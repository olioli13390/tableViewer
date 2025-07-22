exports.postVisualization = (req, res) => {
    const { chartType, columns, datasetColor, backgroundColor } = req.body
    const data = req.session.joinedData

    if (!data || !columns || columns.length < 2) {
        req.flash("toast", { type: "error", message: "Configuration invalide." })
        return res.redirect("/wizard")
    }

    const selectedColumns = Array.isArray(columns) ? columns : [columns]

    const labels = data.rows.map(row => row[selectedColumns[0]]) // première colonne = labels

    const datasets = selectedColumns.slice(1).map(col => ({
        label: col,
        data: data.rows.map(row => Number(row[col]) || 0),
        backgroundColor: datasetColor,
        borderColor: datasetColor,
        borderWidth: 1
    }))

    res.render("pages/visualization.twig", {
        chartType,
        datasetColor,
        backgroundColor,
        labels,
        datasets
    })
}


