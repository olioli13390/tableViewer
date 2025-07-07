const { PrismaClient } = require("../../generated/prisma")
const prisma = new PrismaClient({})
const auth = require("../services/auth")

exports.postDb = async (req, res) => {
    try {
        const { type, host, port, name } = req.body

        const dataBaseConnection = await prisma.dataBaseConnection.create({
            data: {
                type: req.body.type,
                host: req.body.host,
                port: parseInt(req.body.port),
                name: req.body.name,
                user_id: req.session.user.id
            }
        })
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
}
