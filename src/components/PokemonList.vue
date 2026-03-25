<template>
  <div class="pokemon-list">
    <!-- Mensagens de erro e loading -->
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Carregando...</div>

    <!-- Conteúdo principal quando não há erro e não está carregando -->
    <div v-if="!loading && !error">
      <!-- Área "Meu Time" - aparece sempre que houver escolhas -->
      <div v-if="selections.length" class="my-team">
        <h3>⭐ Meu Time ⭐</h3>
        <div class="team-grid">
          <div
            v-for="(pokemon, idx) in selections"
            :key="idx"
            class="team-card"
          >
            <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
            <span>{{ pokemon.name }}</span>
          </div>
        </div>
      </div>

      <!-- Área de jogo (opções e ações) - exibida apenas se não finalizado -->
      <div v-if="!completed">
        <div class="progress" v-if="round > 1 || currentOptions.length">
          <strong>Rodada {{ round }} de 3</strong>
        </div>

        <!-- Grid com os 3 Pokémon atuais -->
        <div v-if="currentOptions.length" class="pokemon-grid">
          <div
            v-for="pokemon in currentOptions"
            :key="pokemon.name"
            class="pokemon-card"
            :class="{
              selected: selectedPokemon?.name === pokemon.name,
              dim: selectedPokemon && selectedPokemon?.name !== pokemon.name
            }"
            @click="selectPokemon(pokemon)"
          >
            <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
            <h3>{{ pokemon.name }}</h3>
          </div>
        </div>

        <!-- Área de ações -->
        <div class="actions">
          <button
            v-if="!currentOptions.length"
            @click="fetchRandomPokemons"
            :disabled="loading"
            class="action-btn"
          >
            {{ round === 1 ? 'Buscar 3 Pokémons' : 'Buscar próximos 3' }}
          </button>

          <button
            v-if="selectedPokemon && currentOptions.length"
            @click="confirmSelection"
            :disabled="loading"
            class="action-btn confirm"
          >
            Confirmar escolha
          </button>
        </div>
      </div>

      <!-- Área de conclusão - exibida quando finalizado -->
      <div v-if="completed" class="completion">
        <h3>✅ Seleção finalizada!</h3>
        <button @click="resetGame" class="reset-btn">Reiniciar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PokemonList',
  data() {
    return {
      allPokemonRefs: [],
      currentOptions: [],
      selectedPokemon: null,
      selections: [],
      round: 1,
      loading: false,
      error: null,
      completed: false,
    }
  },
  async mounted() {
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      const data = await res.json()
      this.allPokemonRefs = data.results
    } catch (err) {
      this.error = 'Falha ao carregar a lista de Pokémons. Recarregue a página.'
    }
  },
  methods: {
    async fetchRandomPokemons() {
      if (this.loading) return
      this.loading = true
      this.error = null
      this.selectedPokemon = null
      this.currentOptions = []

      try {
        const indices = new Set()
        while (indices.size < 3) {
          indices.add(Math.floor(Math.random() * this.allPokemonRefs.length))
        }
        const randomRefs = Array.from(indices).map(i => this.allPokemonRefs[i])

        const pokemons = await Promise.all(
          randomRefs.map(ref => fetch(ref.url).then(r => r.json()))
        )
        this.currentOptions = pokemons
      } catch (err) {
        this.error = 'Erro ao carregar os Pokémons. Tente novamente.'
      } finally {
        this.loading = false
      }
    },

    selectPokemon(pokemon) {
      if (this.loading) return
      this.selectedPokemon = pokemon
    },

    confirmSelection() {
      if (!this.selectedPokemon || this.loading) return

      this.selections.push(this.selectedPokemon)

      if (this.round === 3) {
        this.completed = true
        this.currentOptions = []
        this.selectedPokemon = null
        return
      }

      this.round++
      this.currentOptions = []
      this.selectedPokemon = null
    },

    resetGame() {
      this.selections = []
      this.round = 1
      this.completed = false
      this.currentOptions = []
      this.selectedPokemon = null
      this.error = null
    }
  }
}
</script>

<style scoped>
/* Mantém todos os estilos anteriores e adiciona o novo para .completion */

.my-team {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.my-team h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.team-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.team-card {
  background: white;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  width: 80px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.team-card img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.team-card span {
  display: block;
  text-transform: capitalize;
  font-size: 0.8rem;
  margin-top: 4px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 300px));
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
}

.pokemon-card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.pokemon-card:hover {
  transform: scale(1.02);
}

.pokemon-card.selected {
  transform: scale(1.05);
  border-color: #00d358;
  background-color: #f0f0ff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.pokemon-card.dim {
  opacity: 0.6;
  filter: brightness(0.8) grayscale(0.2);
  transform: scale(0.98);
}

.pokemon-card img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.pokemon-card h3 {
  text-transform: capitalize;
  margin: 8px 0 0;
  font-size: 1rem;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
}

.actions {
  text-align: center;
  margin: 1rem 0;
}

.action-btn {
  background-color: #3b4cca;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn.confirm {
  background-color: #e33c2c;
}

.action-btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.action-btn:not(:disabled):hover {
  background-color: #2a3a9c;
}

.action-btn.confirm:not(:disabled):hover {
  background-color: #b52a1c;
}

.completion {
  text-align: center;
  margin-top: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
}

.progress {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.reset-btn {
  background-color: #f7d02c;
  color: #2c3e50;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.reset-btn:hover {
  background-color: #e6c200;
}
</style>