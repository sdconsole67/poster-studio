const PEXELS_API_KEY = "6x2EpXEh43KCicMMTM56JSQVhYTnMVbVlGZv012Mg2lvw69QJH4T5biy";

async function getPexelsImages(query) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=20`,
    {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    }
  );

  const data = await response.json();
  return data.photos;
}