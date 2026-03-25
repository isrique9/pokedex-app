<!-- src/components/CardPerfil.vue -->
<template>
  <div class="perfil-container">
    <div class="card-perfil">
      <div class="card-header">
        <h2>Identificação do Treinador</h2>
      </div>
      
      <div class="card-content">
        <!-- Área da Foto -->
        <div class="foto-area">
          <div class="foto-preview" @click="abrirSeletorFoto">
            <img 
              v-if="fotoPreview" 
              :src="fotoPreview" 
              alt="Foto do treinador"
              class="foto-treinador"
            />
            <div v-else class="foto-placeholder">
              <i class="fas fa-camera"></i>
              <span>Adicionar Foto</span>
            </div>
          </div>
          <input 
            type="file" 
            ref="fotoInput"
            accept="image/*"
            @change="processarFoto"
            style="display: none"
          />
        </div>

        <!-- Campo Nome -->
        <div class="nome-area">
          <label for="nomeTreinador">Nome:</label>
          <input 
            type="text" 
            id="nomeTreinador"
            v-model="nomeTreinador"
            placeholder="Insira seu Nome"
            class="input-nome"
          />
        </div>

        <!-- Botão Confirmar -->
        <button 
          @click="confirmarDados"
          class="btn-confirmar"
          :disabled="!nomeTreinador"
        >
          Confirmar
        </button>

        <!-- Win Streak (opcional) -->
        <div v-if="winStreak !== null" class="win-streak">
          <span class="streak-label">Win Streak:</span>
          <span class="streak-value">{{ winStreak }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardPerfil',
  data() {
    return {
      nomeTreinador: '',
      fotoPreview: null,
      fotoArquivo: null,
      winStreak: 0
    }
  },
  methods: {
    abrirSeletorFoto() {
      this.$refs.fotoInput.click()
    },
    
    processarFoto(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        this.fotoArquivo = file
        
        // Criar preview da imagem
        const reader = new FileReader()
        reader.onload = (e) => {
          this.fotoPreview = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        alert('Por favor, selecione um arquivo de imagem válido.')
      }
    },
    
    confirmarDados() {
      if (this.nomeTreinador) {
        const dadosTreinador = {
          nome: this.nomeTreinador,
          foto: this.fotoPreview,
          winStreak: this.winStreak
        }
        
        // Emitir evento para o componente pai
        this.$emit('dados-confirmados', dadosTreinador)
        
        // Salvar no localStorage se quiser
        localStorage.setItem('dadosTreinador', JSON.stringify(dadosTreinador))
      }
    },
    
    carregarDadosSalvos() {
      const dadosSalvos = localStorage.getItem('dadosTreinador')
      if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos)
        this.nomeTreinador = dados.nome
        this.fotoPreview = dados.foto
        this.winStreak = dados.winStreak
      }
    }
  },
  mounted() {
    this.carregarDadosSalvos()
  }
}
</script>

<style scoped>
.perfil-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card-perfil {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
}

.card-content {
  padding: 30px;
}

/* Área da Foto */
.foto-area {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
}

.foto-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  background: #f0f0f0;
  border: 3px solid #f5576c;
  transition: all 0.3s ease;
}

.foto-preview:hover {
  transform: scale(1.05);
  border-color: #f093fb;
}

.foto-treinador {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.foto-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #f8f9fa;
}

.foto-placeholder i {
  font-size: 40px;
  margin-bottom: 10px;
}

.foto-placeholder span {
  font-size: 12px;
}

/* Área do Nome */
.nome-area {
  margin-bottom: 25px;
}

.nome-area label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-nome {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-nome:focus {
  outline: none;
  border-color: #f5576c;
  box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
}

.input-nome::placeholder {
  color: #bbb;
}

/* Botão Confirmar */
.btn-confirmar {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.btn-confirmar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 87, 108, 0.3);
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Win Streak */
.win-streak {
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 15px;
}

.streak-label {
  font-weight: 500;
  color: #666;
  margin-right: 10px;
}

.streak-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f5576c;
}

/* Responsividade */
@media (max-width: 480px) {
  .card-perfil {
    margin: 10px;
    max-width: 350px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .foto-preview {
    width: 120px;
    height: 120px;
  }
}
</style>
