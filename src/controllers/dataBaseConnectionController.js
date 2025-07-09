const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const { testMySQLConnection } = require("../services/extensions/testMySqlConnection")

exports.testDb = async (req, res) => { /// affiche le message en cas de réussite de co
    const { host, port, name, username, password } = req.body

    const result = await testMySQLConnection(host, port, name, username, password)

    return res.json({
        success: result.success,
        message: result.message
    })
}

exports.postDb = async (req, res) => { /// 
    try {
        const { type, host, port, name, username, password } = req.body

        const connectionTest = await testMySQLConnection(host, port, name, username, password)
        if (!connectionTest.success) {
            req.flash("toast", {
                type: "error",
                message: "Connection to db failed"
            })
            return res.redirect("/addConnection")
        }

        await prisma.dataBaseConnection.create({
            data: {
                type,
                host,
                port: parseInt(port),
                name,
                user_id: req.session.user.id
            }
        })

        req.flash("toast", {
            type: "success",
            message: "Database connection saved!"
        });
        res.redirect("/")
    } catch (error) {
        console.error(error)
        req.flash("toast", {
            type: "error",
            message: "Error saving connection"
        })
        res.redirect("/addConnection")
    }
}
