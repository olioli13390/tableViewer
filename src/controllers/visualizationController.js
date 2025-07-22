exports.postVisualization = (req, res) => {
	const { chartType, labelColumn, dataColumns } = req.body
	const data = req.session.joinedData

	if (!data || !labelColumn || !dataColumns) {
		req.flash("toast", { type: "error", message: "Configuration invalide." })
		return res.redirect("/wizard")
	}

	const selectedColumns = Array.isArray(dataColumns) ? dataColumns : [dataColumns]
	const labels = data.rows.map(row => row[labelColumn])

	const defaultColors = [
		"#4caf50", "#2196f3", "#ff9800", "#e91e63", "#9c27b0",
		"#00bcd4", "#ffc107", "#f44336", "#3f51b5", "#8bc34a"
	]

	let datasets = []

	if (chartType === "pie" || chartType === "doughnut") {
		if (selectedColumns.length !== 1) {
			req.flash("toast", { type: "error", message: "Un seul champ de données doit être sélectionné pour un graphique circulaire." })
			return res.redirect("/wizard")
		}

		const col = selectedColumns[0]

		datasets.push({
			label: col,
			data: data.rows.map(row => Number(row[col]) || 0),
			backgroundColor: labels.map((_, i) => defaultColors[i % defaultColors.length]),
			borderColor: labels.map((_, i) => defaultColors[i % defaultColors.length]),
			borderWidth: 1
		})
	}

	else {
		datasets = selectedColumns.map((col, index) => ({
			label: col,
			data: data.rows.map(row => Number(row[col]) || 0),
			backgroundColor: defaultColors[index % defaultColors.length],
			borderColor: defaultColors[index % defaultColors.length],
			borderWidth: 1
		}))
	}

	res.render("pages/visualization.twig", {
		chartType,
		labels,
		datasets
	})
}
