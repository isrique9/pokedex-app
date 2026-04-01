<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3>Resultado da Batalha</h3>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      <div class="modal-body">
        <div v-for="(match, idx) in battleDetails" :key="idx" class="matchup">
          <div class="matchup-header">
            <span>Confronto {{ idx + 1 }}</span>
          </div>
          <div class="matchup-cards">
            <!-- Card do usuário -->
            <div
              class="pokemon-card"
              :class="{
                winner: match.outcome === 'user',
                loser: match.outcome === 'rival',
                draw: match.outcome === 'draw'
              }"
            >
              <img
                :src="match.userPokemon.sprites.front_default"
                :alt="match.userPokemon.name"
              />
              <span class="pokemon-name">{{ match.userPokemon.name }}</span>
              <div class="pokemon-types">
                <span
                  v-for="type in match.userPokemon.types"
                  :key="type.type.name"
                  class="type-badge"
                  :class="type.type.name"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>

            <div class="vs">VS</div>

            <!-- Card do rival -->
            <div
              class="pokemon-card"
              :class="{
                winner: match.outcome === 'rival',
                loser: match.outcome === 'user',
                draw: match.outcome === 'draw'
              }"
            >
              <img
                :src="match.rivalPokemon.sprites.front_default"
                :alt="match.rivalPokemon.name"
              />
              <span class="pokemon-name">{{ match.rivalPokemon.name }}</span>
              <div class="pokemon-types">
                <span
                  v-for="type in match.rivalPokemon.types"
                  :key="type.type.name"
                  class="type-badge"
                  :class="type.type.name"
                >
                  {{ type.type.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="overall-result">
          <strong v-html="overallResultText"></strong>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="close" class="close-modal-btn">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import confetti from 'canvas-confetti'

export default {
  name: 'ResultsBattleModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    battleDetails: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    overallResultText() {
      if (!this.battleDetails.length) return ''
      let userWins = 0
      let rivalWins = 0
      for (const match of this.battleDetails) {
        if (match.outcome === 'user') userWins++
        else if (match.outcome === 'rival') rivalWins++
      }
      if (userWins > rivalWins) return '<i class="fa-solid fa-star"></i> Você venceu a batalha!'
      if (rivalWins > userWins) return '<i class="fa-solid fa-skull"></i> O rival venceu a batalha!'
      return '<i class="fa-solid fa-handshake"></i> Empate na batalha!'
    }
  },
  watch: {
    // Quando o modal se tornar visível, verifica se houve vitória e dispara os confetes
    visible(newVal) {
      if (newVal && this.isVictory()) {
        this.fireConfetti()
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    // Verifica se o resultado final é vitória do usuário
    isVictory() {
      return this.overallResultText.includes('Você venceu a batalha!')
    },
    // Dispara uma explosão de confetes
    fireConfetti() {
      // Configuração para uma chuva de confetes mais intensa
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        startVelocity: 25,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      })
      // Adiciona um segundo disparo com mais partículas e ângulo diferente
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.5, x: 0.2 },
          startVelocity: 20,
          colors: ['#ffaa00', '#ff44cc', '#44ffaa']
        })
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.5, x: 0.8 },
          startVelocity: 20,
          colors: ['#ffaa00', '#ff44cc', '#44ffaa']
        })
      }, 150)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 90%;
  width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border-radius: 20px 20px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.1);
}

.modal-body {
  padding: 1.5rem;
}

.matchup {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.matchup-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #f5576c;
  font-size: 1.1rem;
}

.matchup-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.pokemon-card {
  background: white;
  border-radius: 12px;
  padding: 0.8rem;
  text-align: center;
  width: 130px;
  transition: all 0.3s ease;
  border: 2px solid #ddd;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.pokemon-card img {
  width: 90px;
  height: 90px;
  object-fit: contain;
}

.pokemon-name {
  display: block;
  text-transform: capitalize;
  font-weight: bold;
  margin: 8px 0 4px;
}

.pokemon-types {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: bold;
  text-transform: capitalize;
}

/* Estilos para vencedor */
.pokemon-card.winner {
  transform: scale(1.1);
  border-color: #ffd700;
  box-shadow: 0 0 15px #4caf50, 0 4px 8px rgba(0,0,0,0.2);
  background: linear-gradient(145deg, #fff, #fff5e0);
}

/* Estilos para perdedor */
.pokemon-card.loser {
  filter: grayscale(0.6) brightness(0.9);
  transform: scale(0.9);
  opacity: 0.7;
  border-color: #aaa;
  box-shadow: 0 0 10px #f44336;
}

/* Estilos para empate (ambos os cards) */
.pokemon-card.draw {
  filter: grayscale(0.6) brightness(0.9);
  transform: scale(0.9);
  opacity: 0.7;
  border-color: #aaa;
  box-shadow: 0 0 10px #ff9800;
}

.vs {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f5576c;
  background: #f0f0f0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.overall-result {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.3rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  color: #2c3e50;
}

.modal-footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid #eee;
}

.close-modal-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: white;
  padding: 8px 24px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-modal-btn:hover {
  transform: scale(1.05);
}

/* Responsividade */
@media (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
  .matchup-cards {
    flex-direction: column;
    gap: 1rem;
  }
  .vs {
    margin: 0.5rem 0;
  }
  .pokemon-card {
    width: 120px;
  }
  .pokemon-card.winner {
    transform: scale(1.05);
  }
  .pokemon-card.loser,
  .pokemon-card.draw {
    transform: scale(0.95);
  }
}

/* Cores dos tipos (copiadas do PokemonList para consistência) */
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

@media (max-width: 480px) {
  .modal-container {
    width: 95%;
  }

  .matchup-cards {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pokemon-card {
    width: 110px;
  }

  .pokemon-card img {
    width: 80px;
    height: 80px;
  }

  .pokemon-name {
    font-size: 0.8rem;
  }

  .vs {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }

  .overall-result {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style>