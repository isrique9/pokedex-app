import { defineStore } from 'pinia'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutos em milissegundos

export const useTreinadorStore = defineStore('treinador', {
  state: () => ({
    nome: '',
    foto: null,
    winStreak: 0,
    isLoggedIn: false,
    lastActivity: null      // timestamp da última atividade
  }),
  actions: {
    // Verifica se a sessão expirou; se sim, faz logout e retorna false
    verificarSessao() {
      if (!this.isLoggedIn) return false

      const agora = Date.now()
      const ultimaAtividade = this.lastActivity || 0

      if (agora - ultimaAtividade > SESSION_TIMEOUT) {
        this.logout()
        return false
      }
      return true
    },

    // Atualiza a marca de atividade (deve ser chamada em ações que indicam uso)
    atualizarAtividade() {
      this.lastActivity = Date.now()
      this.salvarLocalStorage()
    },

    login(dados) {
      this.nome = dados.nome
      this.foto = dados.foto
      this.winStreak = dados.winStreak || 0
      this.isLoggedIn = true
      this.atualizarAtividade()  // define lastActivity e salva
    },

    logout() {
      this.nome = ''
      this.foto = null
      this.winStreak = 0
      this.isLoggedIn = false
      this.lastActivity = null
      localStorage.removeItem('treinador')
    },

    salvarLocalStorage() {
      const dados = {
        nome: this.nome,
        foto: this.foto,
        winStreak: this.winStreak,
        isLoggedIn: this.isLoggedIn,
        lastActivity: this.lastActivity
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
        this.lastActivity = parsed.lastActivity

        // Verifica se já expirou no momento do carregamento
        if (this.isLoggedIn) {
          const agora = Date.now()
          if (agora - (this.lastActivity || 0) > SESSION_TIMEOUT) {
            this.logout()
          }
        }
      }
    },

    incrementarWinStreak() {
      // Só permite se a sessão for válida
      if (!this.verificarSessao()) return
      this.winStreak++
      this.atualizarAtividade()
    }
  }
})