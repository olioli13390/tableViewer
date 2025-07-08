const { PrismaClient } = require("../../generated/prisma")
const hashPasswordExtension = require("../services/extensions/hashPassword")
const prisma = new PrismaClient({}).$extends(hashPasswordExtension)
const bcrypt = require("bcrypt")
const session = require('express-session')

exports.postUser = async (req, res) => { /// créer un user
    try {
        const { company_name, siret, mail, password } = req.body
        if (!req.body.company_name.match(/^.+$/)) {
            return res.render('pages/register.twig', {
                toast: {
                    type: "error",
                    message: "Invalid company name "
                }, user: { ...req.body }
            })
        }

        if (!req.body.siret.match(/^\d{14}$/)) {
            return res.render('pages/register.twig', {
                toast: {
                    type: "error",
                    message: "Siret must contain 14 numbers"
                }, user: { ...req.body }
            })
        }
        if (!req.body.mail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.render("pages/register.twig", {
                toast: {
                    type: "error",
                    message: "Invalid Email"
                }, user: { ...req.body }
            })
        }

        if (!req.body.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
            return res.render('pages/register.twig', {
                toast: {
                    type: "error",
                    message: "Password invalid"
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
                toast: {
                    type: "error",
                    message: "Siret already in use"
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
                toast: {
                    type: "error",
                    message: "Email is already in use"
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
            res.render("pages/login.twig", {
                toast: {
                    type: "succes",
                    message: "Account created"
                }
            })
        } else {
            return res.render('pages/register.twig', { error: { confirmPassword: "Password doesn't match" }, user: { ...req.body } })
        }
    } catch (error) {
        console.log(error);
        res.render("pages/register.twig")
    }
}

exports.postLogin = async (req, res) => { /// permet la connexion
    try {
        const user = await prisma.user.findUnique({
            where: {
                siret: req.body.siret
            }
        })

        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user
                return res.redirect("/")

            }
            else {
                return res.render('pages/login.twig', {
                    toast: {
                        type: "error",
                        message: "Invalid password"
                    }
                })
            }
        } else {
            return res.render('pages/login.twig', {
                toast: {
                    type: "error",
                    message: "Invalid Siret"
                }
            })
        }
    } catch (error) {
        console.log(error);
    }
}

exports.getDisconnected = async (req, res) => { /// permet la déco
    try {
        if (req.session.user) {
            req.session.destroy()
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
        res.redirect("/")
    }
}