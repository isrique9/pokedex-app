export async function getRandomPokemon(limit = 151) {
  const randomId = Math.floor(Math.random() * limit) + 1
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
  return response.json()
}

export async function getMultipleRandomPokemon(count = 3, limit = 151) {
  const promises = []
  for (let i = 0; i < count; i++) {
    promises.push(getRandomPokemon(limit))
  }
  return Promise.all(promises)
}