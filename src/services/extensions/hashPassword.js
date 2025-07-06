const { Prisma } = require('@prisma/client')
const { PrismaClient } = require('../../../generated/prisma')
const bcrypt = require("bcrypt")

module.exports = Prisma.defineExtension({
    name: "hashPassword",
    query: {
        user: {
            create: async ({ args, query }) => {
                try {
                    const hash = await bcrypt.hash(args.data.password, 10)
                    args.data.password = hash
                    return query(args)
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
})