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
        <div class="pokemon-types">
          <span class="type-badge" :class="pokemon.types[0].type.name">
            {{ pokemon.types[0].type.name }}
          </span>
          <span
            v-if="pokemon.types.length > 1"
            class="type-badge"
            :class="pokemon.types[1].type.name"
          >
            {{ pokemon.types[1].type.name }}
          </span>
        </div>
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
      default: 'user'
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
  width: 100px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #00d358;
}

.team-card.rival-card {
  background: #f8f9fa;
  border: 1px solid #ff6b6b;
}

.team-card img {
  width: 70px;
  height: 70px;
  object-fit: contain;
}

.team-card span {
  display: block;
  text-transform: capitalize;
  font-size: 0.9rem;
  margin: 4px 0;
}

.pokemon-types {
  margin-top: 4px;
}

.type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: bold;
  text-transform: capitalize;
  margin: 0 2px;
  background: #eee;
  color: #333;
}

/* Type colors (same as in PokemonList) */
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

/* Animation for staggered cards */
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

@media (max-width: 480px) {
  .team-card {
    width: 80px;
    padding: 0.3rem;
  }

  .team-card img {
    width: 60px;
    height: 60px;
  }

  .team-card span {
    font-size: 0.75rem;
  }

  .type-badge {
    font-size: 0.55rem;
    padding: 1px 4px;
  }
}
</style>