// composables/usePokemonGame.js
import { ref } from 'vue';

export function usePokemonGame() {
  // Estado
  const allPokemonRefs = ref([]);
  const currentOptions = ref([]);
  const selectedPokemon = ref(null);
  const selections = ref([]);
  const round = ref(1);
  const loading = ref(false);
  const error = ref(null);
  const completed = ref(false);
  const rivalTeam = ref([]);
  const rivalLoading = ref(false);
  const gridKey = ref(0);

  // Função auxiliar para carregar a lista inicial (chamada externamente)
  async function loadPokemonList() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();
      allPokemonRefs.value = data.results;
    } catch (err) {
      error.value = 'Falha ao carregar a lista de Pokémons. Recarregue a página.';
    }
  }

  async function fetchRandomPokemons() {
    if (loading.value) return;
    loading.value = true;
    error.value = null;
    selectedPokemon.value = null;
    currentOptions.value = [];

    try {
      const indices = new Set();
      while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * allPokemonRefs.value.length));
      }
      const randomRefs = Array.from(indices).map(i => allPokemonRefs.value[i]);
      const pokemons = await Promise.all(
        randomRefs.map(ref => fetch(ref.url).then(r => r.json()))
      );
      currentOptions.value = pokemons;
      gridKey.value++;
    } catch (err) {
      error.value = 'Erro ao carregar os Pokémons. Tente novamente.';
    } finally {
      loading.value = false;
    }
  }

  function selectPokemon(pokemon) {
    if (loading.value) return;
    selectedPokemon.value = pokemon;
  }

  function confirmSelection() {
    if (!selectedPokemon.value || loading.value) return;
    selections.value.push(selectedPokemon.value);

    if (round.value === 3) {
      fetchRivalTeam();
      return;
    }

    round.value++;
    currentOptions.value = [];
    selectedPokemon.value = null;
  }

  async function fetchRivalTeam() {
    rivalLoading.value = true;
    try {
      const indices = new Set();
      while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * allPokemonRefs.value.length));
      }
      const randomRefs = Array.from(indices).map(i => allPokemonRefs.value[i]);
      const pokemons = await Promise.all(
        randomRefs.map(ref => fetch(ref.url).then(r => r.json()))
      );
      rivalTeam.value = pokemons;
      completed.value = true;
    } catch (err) {
      error.value = 'Erro ao carregar o time rival. Tente reiniciar.';
    } finally {
      rivalLoading.value = false;
    }
  }

  function resetGame() {
    selections.value = [];
    round.value = 1;
    completed.value = false;
    currentOptions.value = [];
    selectedPokemon.value = null;
    error.value = null;
    rivalTeam.value = [];
    rivalLoading.value = false;
    gridKey.value++;
  }

  return {
    // estado
    allPokemonRefs,
    currentOptions,
    selectedPokemon,
    selections,
    round,
    loading,
    error,
    completed,
    rivalTeam,
    rivalLoading,
    gridKey,
    // ações
    loadPokemonList,
    fetchRandomPokemons,
    selectPokemon,
    confirmSelection,
    fetchRivalTeam,
    resetGame
  };
}