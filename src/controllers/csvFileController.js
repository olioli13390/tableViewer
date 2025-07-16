const { Parser } = require('json2csv')
const path = require('path')
const fs = require('fs')
const mysql = require('mysql2/promise')

exports.postGenerateCsv = async (req, res) => {
    let connection
    try {
        const { table1, table2, commonColumn } = req.body
        const userId = req.session.user?.id
        const connectedDb = req.session.connectedDb

        connection = await mysql.createConnection({
            host: connectedDb.host,
            port: connectedDb.port,
            user: connectedDb.username,
            password: connectedDb.password,
            database: connectedDb.name
        })

        const [rows1] = await connection.execute(`SELECT * FROM \`${table1}\``)
        const [rows2] = await connection.execute(`SELECT * FROM \`${table2}\``)


        const joinedData = rows1.map(row1 => {
            const matchingRow = rows2.find(row2 => row2[commonColumn] === row1[commonColumn])
            return { ...row1, ...matchingRow }
        }).filter(row => row[commonColumn] !== undefined)

        const json2csvParser = new Parser()
        const csv = json2csvParser.parse(joinedData)

        const uploadDir = path.join(__dirname, '../../uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filePath = path.join(uploadDir, `output_${timestamp}.csv`)
        fs.writeFileSync(filePath, csv)

        const columns = Object.keys(joinedData[0] || {})

        res.render('pages/wizard.twig', {
            columns: columns,
            joinedData: JSON.stringify(joinedData)
        });
    } catch (error) {
        console.log(error)

    } finally {
        if (connection) {
            try {
                await connection.end()
            } catch (error) {
                console.log(error)

            }
        }
    }
}
