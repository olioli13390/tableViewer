const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const session = require("express-session")

exports.getRegister = async (req, res) => { /// affiche register
    res.render('pages/register.twig')
}


exports.getLogin = async (req, res) => { /// affiche login
    res.render('pages/login.twig')
}

exports.getDashboard = async (req, res) => { /// affiche le tableau de bord

    try {
        const user = await prisma.user.findUnique({ // affiche la session en cours
            where: {
                id: req.session.user.id
            }
        })
        res.render("pages/dashboard.twig", { user: req.session.user })
    } catch (error) {
        console.log(error);

    }

}