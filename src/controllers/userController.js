const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const session = require('express-session')

exports.getRegister = async (req, res) => {
    const users = await prisma.user.findMany()
    res.render('pages/register.twig')
}

exports.getLogin = async (req, res) => {
    const users = await prisma.user.findMany()
    res.render('pages/login.twig')
}

exports.postUser = async (req, res) => {
    try {
        const { company_name, siret, mail, password } = req.body
        if (!req.body.company_name.match(/^.+$/)) {
            return res.render('pages/register.twig', {
                error: {
                    company_name: "Invalid company name "
                }, user: { ...req.body }
            })
        }

        if (!req.body.siret.match(/^\d{14}$/)) {
            return res.render('pages/register.twig', {
                error: {
                    siret: "Siret must contain 14 numbers"
                }, user: { ...req.body }
            })
        }
        if (!req.body.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.render("pages/register.twig", {
                error: {
                    mail: "Invalid Email"
                }, user: { ...req.body }
            })
        }

        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return res.render('pages/register.twig', {
                error: {
                    password: "Password invalid"
                }, user: { ...req.body }
            })
        }

        const existingSiret = await prisma.user.findUnique({
            where: {
                siret: siret
            }
        })

        if (existingSiret) {
            return res.render("pages/register.twig", {
                error: {
                    siret: "Siret already in use"
                },
                user: { ...req.body }
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                mail: mail
            }
        })

        if (existingUser) {
            return res.render('pages/register.twig', {
                error: {
                    mail: "Email is already in use"
                },
                user: { ...req.body }
            })
        }

        if (req.body.password == req.body.confirmPassword) {
            const user = await prisma.user.create({
                data: {
                    company_name: req.body.company_name,
                    siret: req.body.siret,
                    mail: req.body.mail,
                    password: req.body.password,
                }
            })
            res.redirect("/login")
        } else {
            return res.render('pages/register.twig', { error: { confirmPassword: "Password doesn't match" }, user: { ...req.body } })
        }
    } catch (error) {
        console.log(error);
        res.render("pages/register.twig")
    }
}

// exports.postLogin = async (req, res) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: req.body.id
//             }
//         })

//         if (user) {

//         }
//     } catch (error) {
//         console.log(error);
//     }
// } 