const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const { PrismaClient } = require('../../generated/prisma')
const prisma = new PrismaClient({})
const { parse } = require('json2csv')
const session = require("express-session")

exports.postGenerateCsv = async (req, res) => {
    let connection
    try {
        const userId = req.session.user?.id
        const connectedDb = req.session.connectedDb
        let selectedTables = req.body.selectedTables

        if (typeof selectedTables === 'string') {
            try {
                selectedTables = JSON.parse(selectedTables)
            } catch (error) {
                return res.render('pages/generate.twig', {
                    toast: {
                        type: "error",
                        message: "Invalid table selection format"
                    }
                })
            }
        }

        if (!Array.isArray(selectedTables)) {
            selectedTables = [selectedTables]
        }

        if (!selectedTables || selectedTables.length === 0) {
            return res.render('pages/generate.twig', {
                toast: {
                    type: "error",
                    message: "No table selected"
                }
            })
        }

        connection = await mysql.createConnection({
            host: connectedDb.host,
            port: connectedDb.port,
            user: connectedDb.username,
            password: connectedDb.password,
            database: connectedDb.name
        })

        const tablesData = {}
        const tablesColumns = {}

        for (const selectedTable of selectedTables) {
            const queryText = `SELECT * FROM \`${selectedTable}\``
            const [rows] = await connection.execute(queryText)

            if (!rows || rows.length === 0) {
                return res.render('pages/generate.twig', {
                    toast: {
                        type: "error",
                        message: `No data found in the table: ${selectedTable}`
                    }
                })
            }

            tablesData[selectedTable] = rows
            tablesColumns[selectedTable] = Object.keys(rows[0])
        }


        const commonColumns = {}

        for (let i = 0; i < selectedTables.length; i++) {
            for (let j = i + 1; j < selectedTables.length; j++) {
                const table1 = selectedTables[i]
                const table2 = selectedTables[j]


                const commonCols = tablesColumns[table1].filter(column =>
                    tablesColumns[table2].includes(column)
                )
                commonColumns[`${table1}_${table2}`] = commonCols
            }
        }

        return res.render("pages/join.twig", {
            tablesData: tablesData,
            commonColumns: commonColumns,
            selectedTables: selectedTables,
            connectedDbs: [req.session.connectedDb],
            user: req.session.user
        })

    } catch (error) {
        console.error(error)
        return res.render("pages/generate.twig", {
            toast: {
                type: "error",
                message: "Cannot retrieve data from tables"
            }
        })
    } finally {
        if (connection) {
            try {
                await connection.end()
            } catch (error) {
                console.log(error)
            }
        }
        try {
            await prisma.$disconnect()
        } catch (error) {
            console.log(error)
        }
    }
}

