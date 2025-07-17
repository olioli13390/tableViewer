const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../../generated/prisma");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvParser = require("csv-parser");

exports.postGenerate = async (req, res) => {
    try {
        const connectedDb = req.session.connectedDb;
        if (!connectedDb) {
            req.flash("toast", {
                type: "error",
                message: "No database connected."
            });
            return res.redirect("/");
        }

        const { host, port, name, username, password } = connectedDb;
        
        let selectedTables = req.body.selectedTables;
        if (!selectedTables) {
            req.flash("toast", { type: "error", message: "No tables selected." });
            return res.redirect("/generate");
        }

        // Si les données sont envoyées sous forme de JSON string (ex: '["table1", "table2"]')
        if (typeof selectedTables === 'string') {
            try {
                selectedTables = JSON.parse(selectedTables);
            } catch (e) {
                req.flash("toast", { type: "error", message: "Invalid table selection." });
                return res.redirect("/generate");
            }
        }

        if (selectedTables.length !== 2) {
            req.flash("toast", { type: "error", message: "Please select exactly two tables." });
            return res.redirect("/generate");
        }

        const [table1, table2] = selectedTables;


        if (!table1 || !table2) {
            req.flash("toast", {
                type: "error",
                message: "Please select two tables."
            });
            return res.redirect("/generate");
        }

        const databaseUrl = `mysql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
        const prisma = new PrismaClient({
            datasources: {
                db: { url: databaseUrl }
            }
        });

        let joinColumn = null;

        try {
            // Trouver une colonne commune pour faire la jointure
            const columns1 = await prisma.$queryRaw`
                SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = ${name} AND TABLE_NAME = ${table1}
            `;

            const columns2 = await prisma.$queryRaw`
                SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = ${name} AND TABLE_NAME = ${table2}
            `;

            const set1 = new Set(columns1.map(c => c.COLUMN_NAME));
            const set2 = new Set(columns2.map(c => c.COLUMN_NAME));

            const commonColumns = [...set1].filter(col => set2.has(col));

            if (commonColumns.length === 0) {
                req.flash("toast", {
                    type: "error",
                    message: "No common columns found for a JOIN."
                });
                return res.redirect("/generate");
            }

            joinColumn = commonColumns[0]; // Prend la première colonne commune

            const result = await prisma.$queryRawUnsafe(`
                SELECT * FROM \`${table1}\` t1
                LEFT JOIN \`${table2}\` t2 ON t1.\`${joinColumn}\` = t2.\`${joinColumn}\`
            `);

            if (!result || result.length === 0) {
                req.flash("toast", {
                    type: "warning",
                    message: "No data returned from the JOIN query."
                });
                return res.redirect("/generate");
            }

            // Créer le CSV
            const headers = Object.keys(result[0]).map(header => ({ id: header, title: header }));
            const csvPath = path.join(__dirname, "..", "tmp", `join_result_${Date.now()}.csv`);

            const csvWriter = createCsvWriter({
                path: csvPath,
                header: headers
            });

            await csvWriter.writeRecords(result);

            // Parser le CSV pour extraire les données
            const parsedRows = [];
            const stream = fs.createReadStream(csvPath).pipe(csvParser());

            stream.on("data", (row) => {
                parsedRows.push(row);
            });

            stream.on("end", () => {
                req.session.joinedData = {
                    headers: Object.keys(parsedRows[0] || {}),
                    rows: parsedRows
                };

                res.redirect("/wizard");
            });

        } finally {
            await prisma.$disconnect();
        }

    } catch (err) {
        console.error(err);
        req.flash("toast", {
            type: "error",
            message: "An error occurred during generation."
        });
        return res.redirect("/generate");
    }
};
