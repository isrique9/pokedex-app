<!-- src/components/PokemonTeam.vue -->
<template>
  <div class="pokemon-team">
    <h3><i :class="icon"></i> {{ title }}</h3>
    <div class="team-grid">
      <div
        v-for="(pokemon, idx) in pokemons"
        :key="idx"
        class="team-card"
        :class="{
          'rival-card': type === 'rival',
          'stagger-card': stagger
        }"
        :style="stagger ? { animationDelay: `${idx * 0.1}s` } : {}"
      >
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
        <span>{{ pokemon.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PokemonTeam',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'fa-solid fa-star'
    },
    pokemons: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default: 'user' // 'user' ou 'rival'
    },
    stagger: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.pokemon-team {
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.pokemon-team h3 {
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.pokemon-team i {
  margin-right: 0.5rem;
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
  border: 1px solid #00d358;
}

.team-card.rival-card {
  background: #f8f9fa;
  border: 1px solid #ff6b6b;
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

/* Animação para cards em stagger */
.stagger-card {
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
</style>