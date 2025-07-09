const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const flash = require("connect-flash")
const session = require("express-session")

exports.postDb = async (req, res) => {
    const testMySQLConnection = async (host, port, name, username, password) => {
        let testPrisma = null
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
            await testPrisma.$queryRaw`SELECT 1` // select 1 renvoi 1 si la base de donnée
            return {
                success: true,
                message: 'Connected to MySQL'

            }

        } catch (error) {
            return {
                success: false,
                message: "Failed to connect MySQL"
            }
        }
        finally {
            if (testPrisma) {
                await testPrisma.$disconnect()
            }
        }
    }

    try {
        const { type, host, port, name, username, password } = req.body
        const connectionTest = await testMySQLConnection(host, port, name, username, password)

        if (!connectionTest.success) {
            return res.render("pages/addConnection.twig", {
                user: req.session.user,
                formData: req.body,
                toast: {
                    type: "error",
                    message: "Connection to db failed"
                }
            })
        }
        const dataBaseConnection = await prisma.dataBaseConnection.create({ // post les data
            data: {
                type: type,
                host: host,
                port: parseInt(port),
                name: name,
                user_id: req.session.user.id
            }
        })
        req.flash('toast', { type: 'success', message: 'Connection test to MySQL successfully done !' })
        return res.redirect("/")
    } catch (error) {
        console.log(error);

        return res.render("pages/addConnection.twig", {
            user: req.session.user,
            formData: req.body,
            toast: {
                type: "error",
                message: "Data not saved in database"
            }
        })
    }
}
