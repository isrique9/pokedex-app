# 🧠 Pokémon Battle Arena

Bem-vindo à [Pokémon Battle Arena](https://isrique9.github.io/Pokedex_App/) – um jogo interativo onde você assume o papel de um treinador, monta seu time de 3 Pokémons e enfrenta um rival em batalhas baseadas no sistema de tipos da franquia Pokémon.

## ✨ Funcionalidades

- 👤 Perfil do Treinador
  - Insira seu nome e faça upload de uma foto de perfil.
  - Dados salvos no localStorage – ao recarregar a página, seu progresso continua.
  - Acompanhe suas sequências de vitórias (Win Streak) e derrotas (Loss Streak).

- 🎲 Montagem do Time (3 rodadas)
  - A cada rodada, 3 Pokémons aleatórios da 1ª geração (Kanto) são exibidos.
  - Escolha um deles para compor seu time.
  - Repita o processo até formar os 3 membros.

- 🤖 Time Rival
  - O time adversário é gerado aleatoriamente após sua escolha final.
  - Animações suaves e efeito de “stagger” na exibição do time rival.

- ⚔️ Sistema de Batalha
  - Confronto individual (1x1) entre cada Pokémon do seu time e do rival, na mesma ordem.
  - Usa a tabela de efetividade de tipos (vantagens/desvantagens).
  - Resultado: vitória, derrota ou empate por confronto, e resultado geral da batalha.

- 🎉 Modal de Resultados
  - Exibe detalhes de cada confronto, destacando vencedores/perdedores.
  - Se você vencer a batalha geral, uma chuva de confetes anima a vitória.

- ⏱️ Controle de Sessão (com Pinia)
  - O login do treinador expira após 30 minutos de inatividade.

## 🧱 Tecnologias Utilizadas

| Ferramenta | Descrição |
| ---------- | --------- |
| Vue 3 | Framework progressivo para UIs reativas. |
| Vue Composition API | Lógica reutilizável (hooks) |
| Pinia | Gerenciamento de estado (store do treinador) |
| PokeAPI | Fonte de dados dos Pokémons (imagens, tipos) |
| HTML5 / CSS3 | Layout responsivo e animações personalizadas |
| LocalStorage | Persistência local do perfil e streaks |

## 🚀 Como Executar o Projeto

1. Clone o repositório

````bash
git clone https://github.com/seu-usuario/pokemon-battle-arena.git
cd pokemon-battle-arena
````

2. Instale as dependências (certifique-se de ter Node.js instalado)

````bash
npm install
````

3. Execute o servidor de desenvolvimento

````bash
npm run serve
````

4 .Acesse a aplicação

Abra http://localhost:8080 (ou a porta indicada) no seu navegador.

**Nota:** O projeto foi desenvolvido com Vue CLI padrão. Caso utilize outra configuração, ajuste os comandos conforme necessário.

## 🕹️ Como Jogar

1. Login – Insira seu nome e clique na área da foto para enviar uma imagem (opcional). Pressione Confirmar.

2. Rodada 1 – Clique em “Buscar 3 Pokémons”. Serão mostradas 3 opções aleatórias. Escolha uma clicando sobre o card. Confirme sua escolha.

3. Rodadas 2 e 3 – Repita o processo. Ao final da 3ª escolha, o time rival é gerado automaticamente.

4. Batalha – Após o time rival aparecer, clique em “Batalhar!”. O modal de resultados exibirá cada confronto e o vencedor geral.

5. Reiniciar – Use o botão “Reiniciar” para zerar o jogo e montar um novo time.

As streaks (sequências) são atualizadas automaticamente conforme você vence ou perde as batalhas.

## 🎨 Personalizações Possíveis

- Ajustar limite de Pokémons – Altere o parâmetro limit=151 nos arquivos usePokemonGame.js e pokemonApi.js para incluir mais gerações (ex: 898).

- Tempo de expiração da sessão – Modifique a constante SESSION_TIMEOUT no store trainer.js.

- Estilos – Todos os componentes possuem ````<style scoped>````, sinta-se à vontade para alterar cores, gradientes e animações.

## 🤝 Contribuição

Contribuições são bem-vindas! Se encontrar algum bug ou tiver sugestões:

1. Faça um fork do projeto.

2. Crie uma branch para sua feature (git checkout -b feature/nova-feature).

3. Commit suas alterações (git commit -m 'Adiciona nova feature').

4. Push para a branch (git push origin feature/nova-feature).

5. Abra um Pull Request.

## 🌟 Créditos

- Dados e imagens fornecidos pela [PokeAPI](https://pokeapi.co/).
- Efeito de confetes: [canvas-confetti](https://github.com/catdad/canvas-confetti).
- Gradientes e inspiração de design – interface divertida inspirada no mundo Pokémon.

**Divirta-se e que vença o melhor treinador! 🏆🎮**

