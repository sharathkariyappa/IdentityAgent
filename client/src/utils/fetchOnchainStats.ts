export async function fetchOnchainStats(walletAddress: string) {
  const res = await fetch(`http://localhost:4000/api/onchain-stats?address=${walletAddress}`);

  if (!res.ok) throw new Error("Failed to fetch onchain stats");

  const result = await res.json();

  if (!result || typeof result !== 'object') {
    throw new Error("Invalid onchain stats response");
  }

  return result;
}
