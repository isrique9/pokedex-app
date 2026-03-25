import { defineStore } from 'pinia'

export const useTreinadorStore = defineStore('treinador', {
  state: () => ({
    nome: '',
    foto: null,
    winStreak: 0,
    isLoggedIn: false
  }),
  actions: {
    login(dados) {
      this.nome = dados.nome
      this.foto = dados.foto
      this.winStreak = dados.winStreak || 0
      this.isLoggedIn = true
      this.salvarLocalStorage()
    },
    logout() {
      this.nome = ''
      this.foto = null
      this.winStreak = 0
      this.isLoggedIn = false
      localStorage.removeItem('treinador')
    },
    salvarLocalStorage() {
      const dados = {
        nome: this.nome,
        foto: this.foto,
        winStreak: this.winStreak,
        isLoggedIn: this.isLoggedIn
      }
      localStorage.setItem('treinador', JSON.stringify(dados))
    },
    carregarLocalStorage() {
      const dados = localStorage.getItem('treinador')
      if (dados) {
        const parsed = JSON.parse(dados)
        this.nome = parsed.nome
        this.foto = parsed.foto
        this.winStreak = parsed.winStreak
        this.isLoggedIn = parsed.isLoggedIn
      }
    },
    incrementarWinStreak() {
      this.winStreak++
      this.salvarLocalStorage()
    }
  }
})