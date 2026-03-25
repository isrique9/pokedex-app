<template>
  <div class="app">
    <CardPerfil @dados-confirmados="handleDadosTreinador" />
  </div>
</template>

<script>
import CardPerfil from './components/CardPerfil.vue'

export default {
  name: 'App',
  components: {
    CardPerfil
  },
  methods: {
    handleDadosTreinador(dados) {
      console.log('Dados do treinador:', dados)
      // Aqui você pode atualizar o estado global ou fazer outras ações
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>