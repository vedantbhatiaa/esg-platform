export function inferESGMetrics({ edgarData, industry, finnhub }) {
  const textBlob = JSON.stringify(edgarData).toLowerCase();

  const hasClimate = textBlob.includes("climate");
  const hasRenewable = textBlob.includes("renewable");
  const hasLabor = textBlob.includes("labor");
  const hasBoard = textBlob.includes("board");

  return {
    environmental: [
      {
        metric: "GHG Emissions",
        score: hasClimate ? finnhub.E : finnhub.E - 10,
        weight: 0.25,
        trend: hasClimate ? "improving" : "stable"
      },
      {
        metric: "Renewable Energy",
        score: hasRenewable ? finnhub.E + 5 : finnhub.E - 5,
        weight: 0.20,
        trend: hasRenewable ? "improving" : "stable"
      }
    ],
    social: [
      {
        metric: "Labor Practices",
        score: hasLabor ? finnhub.S : finnhub.S - 10,
        weight: 0.25,
        trend: hasLabor ? "improving" : "stable"
      }
    ],
    governance: [
      {
        metric: "Board Structure",
        score: hasBoard ? finnhub.G : finnhub.G - 10,
        weight: 0.25,
        trend: hasBoard ? "stable" : "declining"
      }
    ],
    controversies: 1
  };
}
