
const { PrismaClient } = require("../../../generated/prisma")

async function testMySQLConnection(host, port, name, username, password) {
	let testPrisma = null;
	try {
		console.log(`Testing connection to ${host}:${port}/${name}`)
		const databaseUrl = `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${name}`

		testPrisma = new PrismaClient({
			datasources: {
				db: {
					url: databaseUrl
				}
			}
		})
		await testPrisma.$queryRaw`SELECT 1`
		return { success: true, message: "Test successfull to MySQL" }
	} catch (error) {
		console.error(error)
		return { success: false, message: "Failed to connect MySQL" }
	} finally {
		if (testPrisma) {
			await testPrisma.$disconnect()
		}
	}
}

module.exports = {
	testMySQLConnection
}