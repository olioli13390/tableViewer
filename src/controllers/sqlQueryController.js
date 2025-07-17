const mysql = require('mysql2/promise')
const { PrismaClient } = require('../../generated/prisma')
const prisma = new PrismaClient({})
const { parse } = require('json2csv')

exports.prepareJoinTables = async (req, res) => {
    let connection
    try {
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

        // Prépare les données pour la requête SQL
        const sqlQueryName = `Join Query for ${selectedTables.join(', ')}`
        const sqlQueryText = `SELECT * FROM ${selectedTables.join(', ')} WHERE ${Object.keys(commonColumns).map(pair => {
            const [table1, table2] = pair.split('_')
            const commonCol = commonColumns[pair][0] // Suppose qu'il y a au moins une colonne commune
            return `${table1}.${commonCol} = ${table2}.${commonCol}`
        }).join(' AND ')}`

        // Crée une nouvelle entrée dans la table SqlQuery
        const sqlQuery = await prisma.sqlQuery.create({
            data: {
                name: sqlQueryName,
                sql_text: sqlQueryText,
                created_at: new Date(),
                id_dataBaseConnection: connectedDb.id,
            },
        })

        return res.render("pages/join.twig", {
            tablesData: tablesData,
            commonColumns: commonColumns,
            tablesColumns: tablesColumns,
            selectedTables: selectedTables,
            connectedDbs: [req.session.connectedDb],
            user: req.session.user,
            sqlQuery: sqlQuery, // Passe la requête SQL à la vue si nécessaire
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
