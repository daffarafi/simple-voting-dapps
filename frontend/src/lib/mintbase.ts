const MINTBASE_GRAPHQL = 'https://api.mintbase.io/v2/graphql';

export async function getUserNFTs(accountId: string) {
  const query = `
    query GetUserNFTs($accountId: String!) {
      tokens: mb_views_nft_tokens(where: { owner: { _eq: $accountId } }) {
        metadata_id
        media
        title
      }
    }
  `;

  const response = await fetch(MINTBASE_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { accountId } }),
  });

  const data = await response.json();
  return data.data.tokens;
}
