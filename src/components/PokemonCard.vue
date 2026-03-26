<template>
  <div class="pokemon-card" :class="[cardClass, 'animated-card']" @click="$emit('click')">
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
</template>

<script>
export default {
  name: 'PokemonCard',
  props: {
    pokemon: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    dim: { type: Boolean, default: false }
  },
  computed: {
    cardClass() {
      return {
        selected: this.selected,
        dim: this.dim
      };
    }
  }
};
</script>

<style scoped>
.pokemon-card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  box-sizing: border-box;
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

/* type colors */
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
</style>