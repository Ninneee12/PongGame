# 🏓 Pong

> 🇺🇸 [English version](#-english-version) · 🇧🇷 [Versão em português](#-versão-em-português)

---

## 🇺🇸 English version

A modern reimplementation of the classic **Pong**, built with pure **p5.js** (no build step, no framework) and grown incrementally with the help of **GitHub Copilot**. The project starts as a simple game and gains a full HUD layer, menus, voice narration, arena selection, scoreboard, win condition and organized assets.

---

### 🎮 About the game

- **Player** controls the left paddle with the **mouse**.
- **CPU** controls the right paddle with a simple AI (follows the ball).
- The ball accelerates on every collision, making the match progressively harder.
- Each goal is narrated in **Portuguese** via the `speechSynthesis` API.
- **First to 5 points wins** the match, triggering a trophy modal.

---

### ✨ Features

#### Home screen / menu
- Welcome modal with:
  - Field to enter the **player name** (max 16 characters).
  - **Arena selector** (4 available scenarios).
  - **Live preview** of the selected arena.
  - **Start new match** and **Quit game** buttons.
- CPU name is randomly picked from: `Cyborg`, `Iron Man`, `Robocop`, `T-800`.
- Fully black overlay while the menu is open, hiding the canvas underneath.

#### In-game HUD
- **HTML scoreboard** pinned to the top center, formatted as `Name  N : N  Name`.
- **Restart** button (bottom-center, left) — resets the score while keeping names and arena.
- **Stop** button (bottom-center, right) — pauses the game and opens the pause modal.

#### Pause modal (Stop button)
- Shows the **final scoreboard** for the current match.
- **10-second countdown** that automatically sends the player back to the home screen.

#### Victory modal (5 points)
- Title with 🏆 in gold and the winner's name.
- Scoreboard summary.
- **New match** (returns to the home menu) and **Quit game** buttons.

#### Audio and voice
- **Bounce sound** when the ball collides with a paddle.
- **Goal sound** when someone scores.
- **Voice narration** (`pt-BR`) on every point, announcing only the scoring player's name and current score.

#### Visual
- **800x400** canvas centered on screen with a black background around it.
- The ball rotates proportionally to its speed (`rotate` based on the velocity vector magnitude).
- Arenas are rendered with **letterbox zoom** (preserves aspect ratio without distortion).
- Custom **favicon** using `bola.png`.

---

### 🗂️ Project structure

```
.
├── index.html              # HTML shell, loads p5, p5.sound, CSS and sketch
├── style.css               # HUD, modals, buttons and scoreboard styles
├── sketch.js               # all game logic (classes, state, HUD, modals)
├── README.md
└── assets/
    ├── images/
    │   ├── bola.png        # also used as favicon
    │   ├── barra01.png     # player paddle
    │   ├── barra02.png     # CPU paddle
    │   ├── Arena2.png      # Arena 1
    │   ├── Arena3.jpg      # Arena 2
    │   ├── Arena4.jpg      # Arena 3
    │   └── Arena5.jpg      # Arena 4
    └── sounds/
        ├── 446100__justinvoke__bounce.wav                     # bounce
        └── 274178__littlerobotsoundfactory__jingle_win_synth_02.wav  # goal
```

---

### 🧩 Code architecture (`sketch.js`)

- **Constants block** at the top groups all game configuration (dimensions, speeds, acceleration, points to win, scoreboard styles).
- **`Raquete` class**: encapsulates position, dimensions, sprite and movement. Takes an `ehJogador` flag to switch between mouse control and simple AI.
- **`Bola` class**: encapsulates position, velocity, rotation and collisions. Paddle collisions force the `vx` vector in the correct direction (`Math.abs(vx)` or `-Math.abs(vx)`) multiplied by `BOLA_ACELERACAO_COLISAO`, fixing the classic "stuck ball" bug where it oscillates inside the paddle.
- **`colideRetanguloCirculo` function**: simplified AABB-style collision detection.
- **HUD system in plain DOM**: the scoreboard, buttons and modals are real `<div>`/`<button>` elements appended to `document.body` and positioned with CSS `position: fixed`, instead of being drawn on the canvas. This decouples UI from the render loop and simplifies styling.
- **State flow** controlled by flags (`jogoIniciado`, `jogoPausado`) and by the functions `mostraModalNome`, `voltaTelaInicial`, `paraJogo`, `verificaVitoria`, `mostraModalVitoria`, `mostraTelaSaida`.
- **`escapaHtml`** sanitizes any user-provided text before it lands in `innerHTML` (defense against injection via the name field).

---

### 🚀 Running locally

There is no build step. Just serve the files over HTTP (required for `loadSound` / `loadImage`).

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765> in your browser.

---

### ⌨️ Controls

| Action            | How                                              |
| ----------------- | ------------------------------------------------ |
| Move paddle       | Move the **mouse** vertically                    |
| Start match       | **Start new match** button or `Enter` in the name field |
| Pause / stop      | **Stop** button                                  |
| Reset score       | **Restart** button                               |

---

### 🛠️ Tech stack

- [p5.js 1.6.0](https://p5js.org/) — canvas and render loop.
- [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) — sound effects.
- Vanilla **HTML + CSS + JavaScript** — HUD, modals and styling.
- **Web Speech API** (`SpeechSynthesisUtterance`) — score narration.

---

### 📌 Development history

Each item below was implemented and validated incrementally during development:

1. Initial refactor: constants block, split into `Raquete` and `Bola` classes, typo fix and stuck-ball bug fix.
2. Fixed HTML scoreboard at the top center.
3. Welcome modal with name field.
4. CPU name randomly picked from a themed list.
5. Arena selector with 4 options and live preview.
6. Centered canvas with black background around it.
7. **Restart** and **Stop** buttons centered at the bottom.
8. Pause modal with a **10-second countdown** that returns to the home screen.
9. Voice narration limited to the player who scored.
10. Win condition at **5 points** + trophy modal.
11. Asset reorganization under `assets/images/` and `assets/sounds/`.
12. Favicon using `bola.png`.

---

## 🇧🇷 Versão em português

Reimplementação moderna do clássico **Pong**, construída em **p5.js** puro (sem build, sem framework) e evoluída de forma incremental com o apoio do **GitHub Copilot**. O projeto começa como um jogo simples e ganha uma camada completa de HUD, menus, narração por voz, seleção de arena, sistema de placar, condição de vitória e organização de assets.

---

### 🎮 Sobre o jogo

- **Jogador** controla a raquete da esquerda com o **mouse**.
- **CPU** controla a raquete da direita com uma IA simples (segue a bola).
- A bola acelera a cada colisão para tornar a partida progressivamente mais difícil.
- Cada gol é narrado em **português** por síntese de voz (`speechSynthesis`).
- **Primeiro a 5 pontos vence** a partida e dispara o modal de vitória com troféu.

---

### ✨ Funcionalidades

#### Tela inicial / menu
- Modal de boas-vindas com:
  - Campo para digitar o **nome do jogador** (máx. 16 caracteres).
  - **Seletor de arena** (4 cenários disponíveis).
  - **Pré-visualização ao vivo** da arena selecionada.
  - Botões **Iniciar nova partida** e **Sair do jogo**.
- Nome da CPU é sorteado aleatoriamente da lista: `Cyborg`, `Iron Man`, `Robocop`, `T-800`.
- Fundo totalmente preto (overlay) enquanto o menu está aberto, escondendo o canvas.

#### HUD durante a partida
- **Placar HTML** fixo no topo central, no formato `Nome  N : N  Nome`.
- Botão **Reiniciar** (centro-inferior, à esquerda) — zera o placar mantendo nomes e arena.
- Botão **Parar** (centro-inferior, à direita) — pausa o jogo e abre o modal de pausa.

#### Modal de pausa (botão Parar)
- Mostra **placar final da partida**.
- Contador regressivo de **10 segundos** que retorna automaticamente para a tela inicial.

#### Modal de vitória (5 pontos)
- Título com 🏆 em dourado e nome do vencedor.
- Resumo do placar.
- Botões **Nova partida** (volta para o menu inicial) e **Sair do jogo**.

#### Áudio e voz
- **Som de quique** quando a bola colide com uma raquete.
- **Som de gol** quando alguém pontua.
- **Narração por voz** (`pt-BR`) a cada ponto, falando apenas o nome do jogador que pontuou e sua pontuação atual.

#### Visual
- Canvas **800x400** centralizado na tela, com fundo preto ao redor.
- Bola gira proporcionalmente à sua velocidade (`rotate` em função da magnitude do vetor).
- Arena renderizada com **letterbox-zoom** (preserva proporção sem distorcer).
- **Favicon** personalizado usando `bola.png`.

---

### 🗂️ Estrutura do projeto

```
.
├── index.html              # shell HTML, carrega p5, p5.sound, CSS e sketch
├── style.css               # estilos de HUD, modais, botões e placar
├── sketch.js               # toda a lógica do jogo (classes, estado, HUD, modais)
├── README.md
└── assets/
    ├── images/
    │   ├── bola.png        # também usada como favicon
    │   ├── barra01.png     # raquete do jogador
    │   ├── barra02.png     # raquete da CPU
    │   ├── Arena2.png      # Arena 1
    │   ├── Arena3.jpg      # Arena 2
    │   ├── Arena4.jpg      # Arena 3
    │   └── Arena5.jpg      # Arena 4
    └── sounds/
        ├── 446100__justinvoke__bounce.wav                     # quique
        └── 274178__littlerobotsoundfactory__jingle_win_synth_02.wav  # gol
```

---

### 🧩 Arquitetura do código (`sketch.js`)

- **Bloco de constantes** no topo agrupa toda a configuração do jogo (dimensões, velocidades, aceleração, pontos para vencer, estilos do placar).
- **Classe `Raquete`**: encapsula posição, dimensões, sprite e movimento. Recebe o flag `ehJogador` para alternar entre controle por mouse e IA simples.
- **Classe `Bola`**: encapsula posição, velocidade, rotação e colisões. As colisões com as raquetes forçam o vetor `vx` no sentido correto (`Math.abs(vx)` ou `-Math.abs(vx)`) multiplicado por `BOLA_ACELERACAO_COLISAO`, evitando o bug clássico de "bola grudada" oscilando dentro da raquete.
- **Função `colideRetanguloCirculo`**: detecção AABB simplificada.
- **Sistema de HUD em DOM puro**: placar, botões e modais são `<div>`/`<button>` reais anexados ao `document.body` e posicionados via CSS `position: fixed`, em vez de desenhados no canvas. Isso desacopla a UI do loop de renderização e facilita a estilização.
- **Fluxo de estado** controlado por flags (`jogoIniciado`, `jogoPausado`) e pelas funções `mostraModalNome`, `voltaTelaInicial`, `paraJogo`, `verificaVitoria`, `mostraModalVitoria`, `mostraTelaSaida`.
- **`escapaHtml`** sanitiza qualquer texto inserido pelo usuário antes de cair em `innerHTML` (defesa contra injeção via campo de nome).

---

### 🚀 Como rodar localmente

Não há build. Basta servir os arquivos por HTTP (necessário para `loadSound` / `loadImage`).

```bash
python3 -m http.server 8765
```

Depois abra <http://localhost:8765> no navegador.

---

### ⌨️ Controles

| Ação                | Como                                |
| ------------------- | ----------------------------------- |
| Mover raquete       | Mexer o **mouse** verticalmente     |
| Iniciar partida     | Botão **Iniciar nova partida** ou `Enter` no campo de nome |
| Pausar / encerrar   | Botão **Parar**                     |
| Reiniciar placar    | Botão **Reiniciar**                 |

---

### 🛠️ Tecnologias

- [p5.js 1.6.0](https://p5js.org/) — canvas e loop de renderização.
- [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) — efeitos sonoros.
- **HTML + CSS + JavaScript** vanilla — HUD, modais e estilos.
- **Web Speech API** (`SpeechSynthesisUtterance`) — narração dos pontos.

---

### 📌 Histórico de evolução

Cada item abaixo foi implementado e validado de forma incremental ao longo do desenvolvimento:

1. Refatoração inicial: bloco de constantes, separação em classes `Raquete` e `Bola`, correção de typo e do bug de bola grudada.
2. Placar em HTML fixo no topo central.
3. Modal de boas-vindas com campo de nome.
4. Nome da CPU sorteado de uma lista temática.
5. Seletor de arenas com 4 opções e pré-visualização ao vivo.
6. Centralização do canvas com fundo preto ao redor.
7. Botões **Reiniciar** e **Parar** centralizados na parte inferior.
8. Modal de pausa com **contador regressivo de 10s** que retorna ao menu inicial.
9. Narração por voz apenas do jogador que pontuou.
10. Condição de vitória ao atingir **5 pontos** + modal de troféu.
11. Reorganização de assets em `assets/images/` e `assets/sounds/`.
12. Favicon usando `bola.png`.
