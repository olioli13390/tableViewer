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
        console.log(error);
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
        const connectedDb = req.session.connectedDb || null
        res.render("pages/dashboard.twig", { user: req.session.user, connectedDb: connectedDb })
    } catch (error) {
        console.log(error);
        res.redirect('/login')
    }
}

exports.getAddConnection = async (req, res) => { /// affiche formulaire connexion à une db
    try {
        res.render("pages/addConnection.twig", { user: req.session.user })
    } catch (error) {
        console.log(error);
        res.redirect("/login")
    }

}

exports.getUploadCsv = async (req, res) => { /// affiche formulaire déposer un fichier csv
    try {
        res.render("pages/uploadCsv.twig", { user: req.session.user })
    } catch (error) {
        console.log(error);
        res.redirect("/login")
    }

}

exports.getGenerate = async (req, res) => {
    try {
        const connectedDb = req.session.connectedDb;
        res.render("pages/generate.twig", {
            user: req.session.user,
            connectedDbName: connectedDb?.name || null
        })
        console.log(connectedDb);

    } catch (error) {
        console.log(error);
    }
}