<template>
  <div class="pokemon-list">
    <!-- Loading temático -->
    <div v-if="loading" class="loading-container">
      <div class="pokeball-spinner"></div>
      <p class="loading-text">Carregando Pokémons...</p>
    </div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error">
      <!-- resto do template permanece igual -->
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

        <PokemonChoiceGrid
          v-if="currentOptions.length"
          :options="currentOptions"
          :selectedPokemon="selectedPokemon"
          :gridKey="gridKey"
          @select="selectPokemon"
        />

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

      <ResultsBattleModal
        :visible="showBattleModal"
        :battle-details="battleDetails"
        @close="showBattleModal = false"
      />
    </div>
  </div>
</template>

<script>
import PokemonTeam from './PokemonTeam.vue';
import ResultsBattleModal from './ResultsBattleModal.vue';
import PokemonChoiceGrid from './PokemonChoiceGrid.vue';
import { usePokemonGame } from '../composables/usePokemonGame';
import { getBattleResults, getOverallOutcome } from '../composables/useBattle';
import { ref, onMounted } from 'vue';

export default {
  name: 'PokemonList',
  components: { PokemonTeam, ResultsBattleModal, PokemonChoiceGrid },
  emits: ['battle-complete'],
  setup(props, { emit }) {
    // estado local do modal
    const showBattleModal = ref(false);
    const battleDetails = ref([]);

    // lógica do jogo
    const {
      currentOptions,
      selectedPokemon,
      selections,
      round,
      loading,
      error,
      completed,
      rivalTeam,
      gridKey,
      loadPokemonList,
      fetchRandomPokemons,
      selectPokemon,
      confirmSelection,
      resetGame
    } = usePokemonGame();

    onMounted(() => {
      loadPokemonList();
    });

    function startBattle() {
      if (selections.value.length !== 3 || rivalTeam.value.length !== 3) return;

      const details = getBattleResults(selections.value, rivalTeam.value);
      battleDetails.value = details;
      showBattleModal.value = true;

      const overallOutcome = getOverallOutcome(details);
      emit('battle-complete', overallOutcome);
    }

    function resetWithModal() {
      resetGame();
      showBattleModal.value = false;
      battleDetails.value = [];
    }

    return {
      // dados do composable
      currentOptions,
      selectedPokemon,
      selections,
      round,
      loading,
      error,
      completed,
      rivalTeam,
      gridKey,
      // funções do composable
      fetchRandomPokemons,
      selectPokemon,
      confirmSelection,
      // funções locais
      startBattle,
      resetGame: resetWithModal,
      // modal
      showBattleModal,
      battleDetails
    };
  }
};
</script>

<style scoped>
/* Estilos originais mantidos */
.loading, .error {
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
.rival-appear-enter-active,
.rival-appear-leave-active {
  transition: all 0.5s ease;
}
.rival-appear-enter-from,
.rival-appear-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Novos estilos para o loading temático */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.pokeball-spinner {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #fff 5%, #eee 15%, #ccc 30%, #aaa 60%);
  border-radius: 50%;
  position: relative;
  animation: spin 1.2s infinite linear;
  box-shadow: 0 0 0 2px #222, 0 0 0 5px #f00, 0 0 0 8px #222;
}

.pokeball-spinner::before,
.pokeball-spinner::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 50%;
  left: 0;
  background: #f00;
  border-radius: 60px 60px 0 0;
}

.pokeball-spinner::after {
  top: 50%;
  background: #fff;
  border-radius: 0 0 60px 60px;
}

.pokeball-spinner .center {
  position: absolute;
  width: 14px;
  height: 14px;
  background: #222;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px #222;
}

.loading-text {
  margin-top: 1rem;
  font-weight: bold;
  color: #3b4cca;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>