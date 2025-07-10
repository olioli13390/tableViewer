const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const { PrismaClient } = require('../../generated/prisma')
const prisma = new PrismaClient({})
const { parse } = require('json2csv')


exports.postGenerateCsv = async (req, res) => {
	let connection
	try {
		const userId = req.session.user?.id
		const connectedDb = req.session.connectedDb
		const selectedTables = JSON.parse(req.body.selectedTables)

		if (selectedTables.length === 0) {
			return res.render('/generate', {
				toast: {
					type: "error",
					message: "No table selected"
				}
			})
		}

		const tableName = selectedTables[0] /// pour l'instant il n'y qu'une table qui est sélec
		const queryText = `SELECT * FROM ${tableName}`

		connection = await mysql.createConnection({
			host: connectedDb.host,
			port: connectedDb.port,
			user: connectedDb.username,
			password: connectedDb.password,
			database: connectedDb.name
		})


		const [rows] = await connection.execute(queryText)

		/// vérif si données présentent
		if (!rows || rows.length === 0) {
			return res.render('/generate', {
				toast: {
					type: "error",
					message: "No data found in the selected table."
				}
			})
		}

		/// créa fichier csv
		const csv = parse(rows)
		const timestamp = Date.now()
		const fileName = `${tableName}_${timestamp}.csv`
		const filePath = path.join(__dirname, '../../uploads/exports', fileName)

		const exportDir = path.join(__dirname, '../../uploads/exports')
		if (!fs.existsSync(exportDir)) {
			fs.mkdirSync(exportDir, { recursive: true })
		}

		fs.writeFileSync(filePath, csv)

		let dbConnection

		///verif si l'id est déjà dans la co sinon on parcourt tout
		if (connectedDb.id) {
			dbConnection = { id: connectedDb.id }
		} else {
			const allUserConnections = await prisma.dataBaseConnection.findMany({
				where: { user_id: userId }
			})

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
				name: `Query on ${tableName}`,
				sql_text: queryText,
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
		req.flash('success', `CSV generated successfully! ${rows.length} rows exported.`)
		return res.redirect("/")

	} catch (error) {
		console.log(error);
		return res.redirect("/generate")
	} finally {
		///fermeture de co + fermeture co prisma
		if (connection) {
			try {
				await connection.end()
			} catch (error) {
				console.log(error);

			}
		}
		try {
			await prisma.$disconnect()
		} catch (error) {
			console.log(error);
		}
	}
}