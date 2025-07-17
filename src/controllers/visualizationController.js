const { PrismaClient } = require('../../generated/prisma')
const prisma = new PrismaClient()

exports.postResult = async (req, res) => {
    try {
        const { xAxis, yAxis, chartStyle, barColor } = req.body
        const joinedData = req.session.joinedData || []

        const xAxisData = joinedData.map(row => row[xAxis])
        const yAxisData = joinedData.map(row => parseFloat(row[yAxis]))

        const chartData = {
            labels: xAxisData,
            datasets: [{
                label: yAxis,
                data: yAxisData,
                backgroundColor: barColor,
                borderColor: barColor,
                borderWidth: 1
            }]
        }

        // Crée une nouvelle entrée dans la table Visualization
        const visualization = await prisma.visualization.create({
            data: {
                type: chartStyle,
                data: JSON.stringify(chartData),
                options: JSON.stringify({
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }),
                title: `Visualization of ${xAxis} vs ${yAxis}`,
                created_at: new Date(),
                csvFile_id: req.session.csvFileId // Assure-toi que l'ID du fichier CSV est disponible dans la session
            }
        })

        return res.render("pages/result.twig", {
            chartData: JSON.stringify(chartData),
            chartStyle: chartStyle,
            visualization: visualization
        })
    } catch (error) {
        console.error(error)
        return res.render("pages/generate.twig", {
            toast: {
                type: "error",
                message: "Cannot generate chart"
            }
        })
    }
}
