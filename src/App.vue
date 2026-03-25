<template>
  <div id="app">
    <!-- Se não tem nome salvo, mostra o card -->
    <CardPerfil v-if="!estaLogado" @dados-confirmados="handleLogin" />

    <!-- Se já tem nome, mostra o conteúdo principal -->
    <div v-else class="main-container">
      <div class="trainer-info">
        <div class="avatar">
          <img v-if="treinador.foto" :src="treinador.foto" alt="foto" />
          <div v-else class="avatar-placeholder"></div>
        </div>
        <div class="info">
          <h2>{{ treinador.nome }}</h2>
          <p>Win Streak: {{ treinador.winStreak }}</p>
        </div>
      </div>
      <PokemonList />
    </div>
  </div>
</template>

<script>
import CardPerfil from './components/CardPerfil.vue'
import PokemonList from './components/PokemonList.vue'

export default {
  name: 'App',
  components: { CardPerfil, PokemonList },
  data() {
    return {
      estaLogado: false,
      treinador: { nome: '', foto: null, winStreak: 0 }
    }
  },
  mounted() {
    const dados = localStorage.getItem('dadosTreinador')
    if (dados) {
      this.treinador = JSON.parse(dados)
      this.estaLogado = true
    }
  },
  methods: {
    handleLogin(dados) {
      this.treinador = dados
      this.estaLogado = true
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
  font-family: sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.trainer-info {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 60px;
  padding: 10px 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  margin-right: 15px;
  border: 2px solid #f5576c;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #ddd;
}
.info h2 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}
.info p {
  color: #666;
}
</style>