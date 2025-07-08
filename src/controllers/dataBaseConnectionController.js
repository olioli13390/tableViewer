const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const auth = require("../services/auth")

exports.postDb = async (req, res) => {
    const testMySQLConnection = async (host, port, name, username, password) => {
        let testPrisma = null
        try {
            console.log(`Test de connexion MySQL vers ${host}:${port}/${name}`)

            const databaseUrl = `mysql://${username}:${password}@${host}:${port}/${name}` // url tempo

            testPrisma = new PrismaClient({
                datasources: {
                    db: {
                        url: databaseUrl
                    }
                }
            })

            await testPrisma.$queryRaw`SELECT 1` /// select 1 retourne 1 si ca atteint la db

            return {
                success: true,
                message: 'Connexion MySQL réussie'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: `Erreur de connexion MySQL: ${error.message}`
            }
        } finally {
            if (testPrisma) {
                await testPrisma.$disconnect() ///
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
                    message: `Failed to reach db adress ${host}:${port}/${name}`
                }
            })
        }
        const dataBaseConnection = await prisma.dataBaseConnection.create({
            data: {
                type: req.body.type,
                host: req.body.host,
                port: parseInt(req.body.port),
                name: req.body.name,
                user_id: req.session.user.id
            }
        })
        // res.redirect("/")
    } catch (error) {
        res.render("pages/addConnection.twig", { user: req.body })
    }
}
