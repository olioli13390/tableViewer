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
        let selectedTable = req.body.selectedTables


        if (typeof selectedTable === 'string') { /// typeof sur vérifie le type de la variable ici string
            try {
                selectedTable = JSON.parse(selectedTable) /// parse le json
            } catch (error) {
                return res.render('pages/generate.twig', {
                    toast: {
                        type: "error",
                        message: "Invalid table selection format"
                    }
                })
            }
        }

        if (Array.isArray(selectedTable)) { /// sélectionne seulement le premier fichier  - temporaire
            selectedTable = selectedTable[0]
        }

        if (!selectedTable) {
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

        const csv = parse(rows)
        const timestamp = Date.now()
        const fileName = `${selectedTable}_${timestamp}.csv`
        const exportDir = path.join(__dirname, '../../uploads')
        const filePath = path.join(exportDir, fileName)

        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true })
        }

        fs.writeFileSync(filePath, csv)

        let dbConnection
        if (connectedDb.id) {
            dbConnection = { id: connectedDb.id }
        } else {
            dbConnection = await prisma.dataBaseConnection.findFirst({
                where: {
                    host: connectedDb.host,
                    port: parseInt(connectedDb.port),
                    name: connectedDb.name,
                    user_id: userId
                }
            })
        }

        const sqlQuery = await prisma.sqlQuery.create({
            data: {
                name: `Query on ${selectedTable}`,
                sql_text: `SELECT * FROM \`${selectedTable}\``,
                created_at: new Date(),
                id_dataBaseConnection: dbConnection.id,
            }
        })

        await prisma.csvFile.create({
            data: {
                name_csv: fileName,
                path: `/exports/${fileName}`,
                created_at: new Date(),
                sqlQuery_id: sqlQuery.id,
                user_id: userId,
            }
        })
        console.log(req.session.user);
        console.log(req.session.connectedDb);
        return res.render("pages/dashboard.twig", {
            toast: {
                type: "success",
                message: `CSV generated successfully from ${selectedTable}. File saved as: ${fileName}`
            }, connectedDbs: [req.session.connectedDb], user: req.session.user
        })

    } catch (error) {
        return res.render("pages/generate.twig", {
            twig: {
                type: "error",
                message: "Cannot generate"
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