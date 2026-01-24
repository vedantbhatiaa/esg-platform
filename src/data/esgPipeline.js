import { fetchFinnhubESG } from "./finnhub";
import { fetchEdgarDisclosures } from "./secEdgar";
import { inferESGMetrics } from "./inferenceEngine";

export async function runESGPipeline({
  symbol,
  cik,
  industry,
  finnhubKey
}) {
  const finnhub = await fetchFinnhubESG(symbol, finnhubKey);
  const edgar = await fetchEdgarDisclosures(cik);

  return inferESGMetrics({
    edgarData: edgar,
    industry,
    finnhub
  });
}
