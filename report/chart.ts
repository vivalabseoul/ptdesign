import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 400,
  height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export async function createRadarChart(scores: any) {
  const data = {
    labels: ["Usability", "Accessibility", "Visual", "Performance"],
    datasets: [
      {
        label: "UX Score",
        data: [
          scores.usability,
          scores.accessibility,
          scores.visual,
          scores.performance,
        ],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const config = {
    type: "radar",
    data,
    options: { scales: { r: { min: 0, max: 100 } } },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(config);
  return `data:image/png;base64,${image.toString("base64")}`;
}
