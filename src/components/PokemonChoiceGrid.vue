<template>
  <div class="pokemon-grid" :key="gridKey">
    <PokemonCard
      v-for="pokemon in options"
      :key="pokemon.name"
      :pokemon="pokemon"
      :selected="selectedPokemon?.name === pokemon.name"
      :dim="!!selectedPokemon && selectedPokemon?.name !== pokemon.name"
      @click="select(pokemon)"
    />
  </div>
</template>

<script>
import PokemonCard from './PokemonCard.vue';

export default {
  name: 'PokemonChoiceGrid',
  components: { PokemonCard },
  props: {
    options: { type: Array, required: true },
    selectedPokemon: { type: Object, default: null },
    gridKey: { type: Number, required: true }
  },
  emits: ['select'],
  methods: {
    select(pokemon) {
      this.$emit('select', pokemon);
    }
  }
};
</script>

<style scoped>
.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, 200px); 
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  padding: 0.5rem;
}

@media (max-width: 480px) {
  .pokemon-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }
}
</style>