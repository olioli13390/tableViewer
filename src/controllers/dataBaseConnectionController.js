const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const { testMySQLConnection } = require("../services/testMySqlConnection")

exports.testDb = async (req, res) => { /// affiche le message en cas de réussite de co
    const { host, port, name, username, password } = req.body

    const result = await testMySQLConnection(host, port, name, username, password)

    return res.json({
        success: result.success,
        message: result.message
    })
}

exports.postDb = async (req, res) => { /// permet de poster en db la db distante sans username et password
    try {
        const { type, host, port, name, username, password } = req.body

        const connectionTest = await testMySQLConnection(host, port, name, username, password)
        if (!connectionTest.success) {
            req.flash("toast", {
                type: "error",
                message: "Connection to db failed"
            })
            return res.render("pages/addConnection.twig", { db: { ...req.body } })
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

exports.selectConnection = async (req, res) => {
    const selectedDbId = parseInt(req.body.selectedDbId)

    try {
        const db = await prisma.dataBaseConnection.findUnique({
            where: { id: selectedDbId }
        })

        if (!db) {
            req.flash("toast", {
                type: "error",
                message: "Failed to reach db"
            })
            return res.redirect("/")
        }

        const queryParams = new URLSearchParams({
            type: db.type,
            host: db.host,
            port: db.port,
            name: db.name
        })

        res.redirect(`/addConnection?type=${db.type}&host=${db.host}&port=${db.port}&name=${db.name}&mode=connect`)

    } catch (error) {
        console.error(error)
        req.flash("toast", {
            type: "error",
            message: "Error : Db not selected"
        })
        res.redirect("/")
    }
}

exports.connectExistingDb = async (req, res) => {
    const { type, host, port, name, username, password } = req.body

    try {
        const existingDb = await prisma.dataBaseConnection.findFirst({
            where: {
                type,
                host,
                port: parseInt(port),
                name,
                user_id: req.session.user.id
            }
        })

        if (!existingDb) {
            console.log("Db not existing");
            return res.redirect("/addConnection")
        }

        const result = await testMySQLConnection(host, port, name, username, password)

        if (!result.success) {
           console.log("Connection failed");
            return res.redirect("/addConnection")
        }

        req.session.connectedDb = {
            id: existingDb.id,
            name,
            host,
            port: parseInt(port),
            username,
            password
        }

        req.session.save(err => {
            if (err) {
                console.error(err)
                return res.redirect("/addConnection")
            }

            console.log("Connected successfully");
            return res.redirect("/")
        })
    } catch (error) {
        console.error(error)
        res.redirect("/addConnection")
    }
}