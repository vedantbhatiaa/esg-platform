export async function fetchEdgarDisclosures(cik) {
  const res = await fetch(
    `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik}`,
    {
      headers: {
        "User-Agent": "ESG-Platform your-email@example.com"
      }
    }
  );

  if (!res.ok) throw new Error("SEC EDGAR fetch failed");

  return await res.json();
}
