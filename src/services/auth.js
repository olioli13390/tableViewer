const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient()
const authguard = async (req, res, next) => {
    try {
        if (req.session.user) {
            return next()
        }
        throw new Error("User not connected");
    } catch (error) {
        res.redirect('/login')
    }
}

module.exports = authguard