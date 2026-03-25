<template>
  <div class="pokemon-list">
    <!-- Mensagens de erro e loading -->
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Carregando...</div>

    <!-- Conteúdo principal -->
    <div v-if="!loading && !error">
      <!-- Time do usuário -->
      <PokemonTeam
        v-if="selections.length"
        title="Meu Time"
        icon="fa-solid fa-star"
        :pokemons="selections"
        type="user"
        class="user-team"
      />

      <!-- Time rival com animação de entrada -->
      <transition name="rival-appear">
        <PokemonTeam
          v-if="completed"
          title="Time Rival"
          icon="fa-solid fa-skull"
          :pokemons="rivalTeam"
          type="rival"
          :stagger="true"
          class="rival-team"
        />
      </transition>

      <!-- Área de jogo (enquanto não concluído) -->
      <div v-if="!completed">
        <div class="progress" v-if="round > 1 || currentOptions.length">
          <strong>Rodada {{ round }} de 3</strong>
        </div>

        <!-- Grid de opções com animação de entrada -->
        <div 
          v-if="currentOptions.length" 
          class="pokemon-grid" 
          :key="gridKey"
        >
          <div
            v-for="(pokemon, idx) in currentOptions"
            :key="pokemon.name"
            class="pokemon-card animated-card"
            :class="{
              selected: selectedPokemon?.name === pokemon.name,
              dim: selectedPokemon && selectedPokemon?.name !== pokemon.name
            }"
            :style="{ animationDelay: `${idx * 0.1}s` }"
            @click="selectPokemon(pokemon)"
          >
            <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
            <h3>{{ pokemon.name }}</h3>
          </div>
        </div>

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

      <!-- Botão reiniciar -->
      <div v-if="completed" class="completion">
        <button @click="resetGame" class="reset-btn">Reiniciar</button>
      </div>
    </div>
  </div>
</template>

<script>
import PokemonTeam from './PokemonTeam.vue'

export default {
  name: 'PokemonList',
  components: { PokemonTeam },
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
      rivalTeam: [],
      rivalLoading: false,
      gridKey: 0 // chave para forçar re-renderização da grid
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
        // Incrementa a chave para forçar re-renderização e animação dos cards
        this.gridKey++
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
        this.fetchRivalTeam()
        return
      }

      this.round++
      this.currentOptions = []
      this.selectedPokemon = null
    },

    async fetchRivalTeam() {
      this.rivalLoading = true
      try {
        const indices = new Set()
        while (indices.size < 3) {
          indices.add(Math.floor(Math.random() * this.allPokemonRefs.length))
        }
        const randomRefs = Array.from(indices).map(i => this.allPokemonRefs[i])
        const pokemons = await Promise.all(
          randomRefs.map(ref => fetch(ref.url).then(r => r.json()))
        )
        this.rivalTeam = pokemons
        this.completed = true
      } catch (err) {
        this.error = 'Erro ao carregar o time rival. Tente reiniciar.'
      } finally {
        this.rivalLoading = false
      }
    },

    resetGame() {
      this.selections = []
      this.round = 1
      this.completed = false
      this.currentOptions = []
      this.selectedPokemon = null
      this.error = null
      this.rivalTeam = []
      this.rivalLoading = false
      this.gridKey++
    }
  }
}
</script>

<style scoped>
/* ===== ESTILOS EXISTENTES ===== */
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

/* ===== NOVA ANIMAÇÃO PARA OS CARDS DE OPÇÃO ===== */
.animated-card {
  animation: card-fade-in 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes card-fade-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
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
  background-color: #f0f0ff;
  text-align: center;
  margin: auto;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 330px;
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

/* Animação do time rival */
.rival-appear-enter-active {
  animation: rival-slide-up 0.6s ease-out;
}

@keyframes rival-slide-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>