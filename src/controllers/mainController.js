const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const session = require("express-session")

exports.getRegister = async (req, res) => {
    res.render('pages/register.twig')
}


exports.getLogin = async (req, res) => {
    res.render('pages/login.twig')
}

exports.getDashboard = async (req, res) => {
    res.render("pages/dashboard.twig")

}