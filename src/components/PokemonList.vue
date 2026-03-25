<template>
  <div class="pokemon-list">
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="loading">Carregando...</div>

    <div v-if="!loading && !error">
      <PokemonTeam
        v-if="selections.length"
        title="Meu Time"
        icon="fa-solid fa-star"
        :pokemons="selections"
        type="user"
        class="user-team"
      />

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

      <div v-if="!completed">
        <div class="progress" v-if="round > 1 || currentOptions.length">
          <strong>Rodada {{ round }} de 3</strong>
        </div>

        <div v-if="currentOptions.length" class="pokemon-grid" :key="gridKey">
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
            <div class="pokemon-types">
              <span
                v-for="typeInfo in pokemon.types"
                :key="typeInfo.type.name"
                class="type-badge"
                :class="typeInfo.type.name"
              >
                {{ typeInfo.type.name }}
              </span>
            </div>
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

      <div v-if="completed" class="completion">
        <button @click="startBattle" class="battle-btn">Batalhar!</button>
        <button @click="resetGame" class="reset-btn">Reiniciar</button>
      </div>

      <!-- Modal de resultados da batalha -->
      <ResultsBattleModal
        :visible="showBattleModal"
        :battle-details="battleDetails"
        @close="showBattleModal = false"
      />
    </div>
  </div>
</template>

<script>
import PokemonTeam from './PokemonTeam.vue'
import ResultsBattleModal from './ResultsBattleModal.vue'

// Type effectiveness chart (attacker type -> defender type -> multiplier)
const typeChart = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, rock: 2, flying: 0, bug: 0.5, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, steel: 0.5, dragon: 2, dark: 2 }
}

export default {
  name: 'PokemonList',
  components: { PokemonTeam, ResultsBattleModal },
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
      gridKey: 0,
      showBattleModal: false,
      battleDetails: [] // array of { userPokemon, rivalPokemon, outcome }
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
    getPrimaryType(pokemon) {
      return pokemon.types[0].type.name
    },
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
    getEffectiveness(attackerType, defenderType) {
      const chart = typeChart[attackerType]
      if (!chart) return 1
      const mult = chart[defenderType]
      return mult !== undefined ? mult : 1
    },
    comparePokemon(userPokemon, rivalPokemon) {
      const userType = this.getPrimaryType(userPokemon)
      const rivalType = this.getPrimaryType(rivalPokemon)

      const userAttack = this.getEffectiveness(userType, rivalType)
      const rivalAttack = this.getEffectiveness(rivalType, userType)

      if (userAttack > rivalAttack) return 'user'
      if (rivalAttack > userAttack) return 'rival'
      return 'draw'
    },
    startBattle() {
      if (this.selections.length !== 3 || this.rivalTeam.length !== 3) return

      const details = []
      for (let i = 0; i < 3; i++) {
        const user = this.selections[i]
        const rival = this.rivalTeam[i]
        const outcome = this.comparePokemon(user, rival)
        details.push({
          userPokemon: user,
          rivalPokemon: rival,
          outcome
        })
      }
      this.battleDetails = details
      this.showBattleModal = true

      // Compute overall result and emit to parent
      let userWins = 0
      let rivalWins = 0
      for (const match of details) {
        if (match.outcome === 'user') userWins++
        else if (match.outcome === 'rival') rivalWins++
      }
      let overallOutcome = 'draw'
      if (userWins > rivalWins) overallOutcome = 'win'
      else if (rivalWins > userWins) overallOutcome = 'loss'
      
      this.$emit('battle-complete', overallOutcome)
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
      this.battleDetails = []
      this.showBattleModal = false
    }
  }
}
</script>

<style scoped>
/* ===== ESTILOS EXISTENTES ===== */
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  padding: 0.5rem;
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

.pokemon-types {
  margin-top: 6px;
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: capitalize;
  background: #eee;
  color: #333;
}

/* Type colors */
.type-badge.normal { background: #A8A878; color: white; }
.type-badge.fire { background: #F08030; color: white; }
.type-badge.water { background: #6890F0; color: white; }
.type-badge.grass { background: #78C850; color: white; }
.type-badge.electric { background: #F8D030; color: black; }
.type-badge.ice { background: #98D8D8; color: black; }
.type-badge.fighting { background: #C03028; color: white; }
.type-badge.poison { background: #A040A0; color: white; }
.type-badge.ground { background: #E0C068; color: black; }
.type-badge.flying { background: #A890F0; color: white; }
.type-badge.psychic { background: #F85888; color: white; }
.type-badge.bug { background: #A8B820; color: white; }
.type-badge.rock { background: #B8A038; color: white; }
.type-badge.ghost { background: #705898; color: white; }
.type-badge.dragon { background: #7038F8; color: white; }
.type-badge.dark { background: #705848; color: white; }
.type-badge.steel { background: #B8B8D0; color: black; }
.type-badge.fairy { background: #EE99AC; color: black; }

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
  max-width: 500px;
}

.battle-btn {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;
}

.battle-btn:hover {
  background-color: #e65c5c;
}

.reset-btn {
  background-color: #f7d02c;
  color: #2c3e50;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-btn:hover {
  background-color: #e6c200;
}

.progress {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

/* Para telas muito pequenas, reduz ainda mais o tamanho mínimo */
@media (max-width: 480px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }
}
</style>