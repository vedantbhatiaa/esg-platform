export async function fetchFinnhubESG(symbol, apiKey) {
  const res = await fetch(
    `https://finnhub.io/api/v1/stock/esg?symbol=${symbol}&token=${apiKey}`
  );

  if (!res.ok) throw new Error("Finnhub fetch failed");

  const data = await res.json();

  return {
    E: data.environmentScore,
    S: data.socialScore,
    G: data.governanceScore,
    total: data.totalScore
  };
}
