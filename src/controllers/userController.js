const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})

exports.getRegister = async (req, res) => {
    const users = await prisma.user.findMany()
    res.render('pages/register.twig')
}

exports.getLogin = async (req, res) => {
    const users = await prisma.user.findMany()
    res.render('pages/login.twig')
}