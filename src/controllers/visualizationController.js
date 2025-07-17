const { PrismaClient } = require("../../generated/prisma");
exports.postVisualization = (req, res) => {
    const { chartType, columns, datasetColor, backgroundColor } = req.body;
    const data = req.session.joinedData;

    if (!data || !columns || columns.length < 2) {
        req.flash("toast", { type: "error", message: "Configuration invalide." });
        return res.redirect("/wizard");
    }

    res.render("pages/visualization.twig", {
        chartType,
        columns: Array.isArray(columns) ? columns : [columns],
        datasetColor,
        backgroundColor,
        rows: data.rows
    });
};

