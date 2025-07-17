const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const session = require("express-session")

exports.getRegister = async (req, res) => {/// affiche register
    try {
        res.render('pages/register.twig')
    } catch (error) {
        res.redirect('/login')
    }
}


exports.getLogin = async (req, res) => { /// affiche login
    try {
        res.render('pages/login.twig')
    } catch (error) {
        console.log(error)
        console.log(error)
        res.redirect('/login')
    }
}

exports.getDashboard = async (req, res) => { /// affiche le tableau de bord
    try {
        const user = await prisma.user.findUnique({ // affiche la session en cours
            where: {
                id: req.session.user.id
            }
        })
        const connectedDbs = await prisma.dataBaseConnection.findMany({
            where: {
                user_id: req.session.user.id
            }
        })
        const selectedDb = req.session.connectedDb
        res.render("pages/dashboard.twig", { user: req.session.user, connectedDbs: connectedDbs, selectedDb })
    } catch (error) {
        console.log(error)
        console.log(error)
        res.redirect('/login')
    }
}

exports.getAddConnection = async (req, res) => {
    const { type, host, port, name, mode } = req.query

    res.render("pages/addConnection.twig", {
        formData: {
            type: type,
            host: host,
            port: port,
            name: name,
            username: '',
            password: ''
        },
        mode: mode || 'create'
    })
}

exports.getGenerate = async (req, res) => {
    try {
        const connectedDb = req.session.connectedDb
        if (!connectedDb) {
            req.flash("toast", {
                type: "error",
                message: "No database connected."
            })
            return res.redirect("/")
        }

        const { host, port, name, username, password } = connectedDb
        const databaseUrl = `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${name}`

        const dynamicPrisma = new PrismaClient({
            datasources: {
                db: { url: databaseUrl }
            }
        })

        let tables = []

        try {
            tables = await dynamicPrisma.$queryRaw`
				SELECT table_name FROM information_schema.tables WHERE table_schema = ${name}
			`
        } finally {
            await dynamicPrisma.$disconnect()
        }
        res.render("pages/generate.twig", {
            user: req.session.user,
            connectedDb: connectedDb,
            tables: tables.map(row => row.table_name)
        })
    } catch (error) {
        console.error(error)
    }
}

exports.getWizard = async (req, res) => {
    const data = req.session.joinedData

    if (!data) {
        console.log("No data found in session.")
        return res.redirect("/generate")
    }

    res.render("pages/wizard.twig", {
        headers: data.headers,
        rows: data.rows,      
        user: req.session.user
    })
}