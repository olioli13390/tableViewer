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
exports.getJoin = async (req, res) => {
    try {
        return res.render("pages/join.twig", {
            connectedDbs: [req.session.connectedDb],
            user: req.session.user
        })
    } catch (error) {
        console.error(error)
        return res.render("pages/generate.twig", {
            toast: {
                type: "error",
                message: "Cannot display join form"
            }
        })
    }
}

exports.getWizard = async (req, res) => {
    try {
        const selectedDb = req.session.connectedDb
        if (!selectedDb) {
            req.flash("toast", {
                type: "error",
                message: "No database selected"
            })
            return res.redirect("/dashboard")
        }
        const tableName = req.query.table || req.session.selectedTable
        const columns = await prisma.$queryRaw`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ${selectedDb.name} AND TABLE_NAME = 'your_table_name'`

        res.render("pages/wizard.twig", { columns: columns.map(col => col.COLUMN_NAME), tableName: tableName })
    } catch (error) {
        console.error(error)
        req.flash("toast", {
            type: "error",
            message: "Error loading wizard"
        })
        res.redirect("/login")
    }
}

// exports.getWizard = async (req, res) => {
//     try {
//         const columns = req.session.columns || []
//         const joinedData = req.session.joinedData || []

//         return res.render("pages/csv.twig", {
//             columns: columns,
//             joinedData: JSON.stringify(joinedData)
//         })
//     } catch (error) {
//         console.error(error)
//         return res.render("pages/generate.twig", {
//             toast: {
//                 type: "error",
//                 message: "Cannot display CSV page"
//             }
//         })
//     }
// }

exports.getResult = async (req, res) => {
    try {
        const joinedData = req.session.joinedData || []
        const csvFileId = req.session.csvFileId || null

        return res.render("pages/result.twig", {
            joinedData: JSON.stringify(joinedData),
            csvFileId: csvFileId,
            columns: columns
        })
    } catch (error) {
        console.error(error)
        return res.render("pages/generate.twig", {
            toast: {
                type: "error",
                message: "Cannot display result page"
            }
        })
    }
}