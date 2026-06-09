// ----- Constantes do jogo -----
const LARGURA_CANVAS = 800;
const ALTURA_CANVAS = 400;

const RAQUETE_LARGURA = 10;
const RAQUETE_ALTURA = 60;
const RAQUETE_MARGEM = 30;
const RAQUETE_VELOCIDADE = 5;

const BOLA_RAIO = 12;
const BOLA_VELOCIDADE_MAXIMA = 5;
const BOLA_ACELERACAO_COLISAO = 1.1;

const PONTOS_PARA_VENCER = 5;

const PLACAR_TAMANHO_FONTE = 32;
const PLACAR_MARGEM_TOPO = 20;
const PLACAR_OFFSET_CENTRO = 60;
const PLACAR_COR = "#ffffff";
const PLACAR_COR_SOMBRA = "rgba(0, 0, 0, 0.6)";

let placarElemento;
let botaoReiniciar;
let botaoParar;
let jogoPausado = false;

// ----- Nomes -----
const NOMES_CPU = ["Cyborg", "Iron Man", "Robocop", "T-800"];
let nomeJogador = "Jogador";
let nomeComputador = "CPU";
let jogoIniciado = false;

// ----- Fundos disponíveis -----
const FUNDOS = [
  { nome: "Arena 1", arquivo: "assets/images/Arena2.png" },
  { nome: "Arena 2", arquivo: "assets/images/Arena3.jpg" },
  { nome: "Arena 3", arquivo: "assets/images/Arena4.jpg" },
  { nome: "Arena 4", arquivo: "assets/images/Arena5.jpg" },
];

// ----- Assets -----
let bolaImagem;
let jogadorImagem;
let computadorImagem;
let fundoImagens = [];
let fundoImagem;
let fundoSelecionado = 0;
let quicarSom;
let golSom;

// ----- Entidades -----
let bola;
let jogador;
let computador;

// ----- Estado do jogo -----
let pontosJogador = 0;
let pontosComputador = 0;

// cache do enquadramento do fundo (calculado uma vez em setup)
let fundoX;
let fundoY;
let fundoLargura;
let fundoAltura;

class Raquete {
  constructor(x, ehJogador) {
    this.x = x;
    this.y = height / 2;
    this.w = RAQUETE_LARGURA;
    this.h = RAQUETE_ALTURA;
    this.ehJogador = ehJogador;
  }

  update() {
    if (this.ehJogador) {
      this.y = mouseY;
    } else {
      // IA simples: segue a bola
      if (bola.y < this.y) {
        this.y -= RAQUETE_VELOCIDADE;
      } else {
        this.y += RAQUETE_VELOCIDADE;
      }
    }

    // limita dentro da tela
    this.y = constrain(this.y, 0, height - this.h);
  }

  desenha() {
    const sprite = this.ehJogador ? jogadorImagem : computadorImagem;
    image(sprite, this.x, this.y, this.w, this.h);
  }
}

class Bola {
  constructor() {
    this.r = BOLA_RAIO;
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = random(-BOLA_VELOCIDADE_MAXIMA, BOLA_VELOCIDADE_MAXIMA);
    this.vy = random(-BOLA_VELOCIDADE_MAXIMA, BOLA_VELOCIDADE_MAXIMA);
    this.angulo = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angulo += Math.sqrt(this.vx * this.vx + this.vy * this.vy) / 30;

    // saída pelas laterais => ponto
    if (this.x < this.r) {
      pontosComputador++;
      golSom.play();
      falaPontos(nomeComputador, pontosComputador);
      this.reset();
      verificaVitoria();
      return;
    }
    if (this.x > width - this.r) {
      pontosJogador++;
      golSom.play();
      falaPontos(nomeJogador, pontosJogador);
      this.reset();
      verificaVitoria();
      return;
    }

    // rebate no teto/chão
    if (this.y < this.r || this.y > height - this.r) {
      this.vy *= -1;
    }

    // colisão com raquetes — força vx no sentido oposto à raquete
    // para evitar que a bola "gruda" oscilando dentro do retângulo
    if (
      colideRetanguloCirculo(
        this.x,
        this.y,
        this.r,
        jogador.x,
        jogador.y,
        jogador.w,
        jogador.h,
      )
    ) {
      quicarSom.play();
      this.vx = Math.abs(this.vx) * BOLA_ACELERACAO_COLISAO;
      this.vy *= BOLA_ACELERACAO_COLISAO;
    } else if (
      colideRetanguloCirculo(
        this.x,
        this.y,
        this.r,
        computador.x,
        computador.y,
        computador.w,
        computador.h,
      )
    ) {
      quicarSom.play();
      this.vx = -Math.abs(this.vx) * BOLA_ACELERACAO_COLISAO;
      this.vy *= BOLA_ACELERACAO_COLISAO;
    }
  }

  desenha() {
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    image(bolaImagem, -this.r, -this.r, this.r * 2, this.r * 2);
    pop();
  }
}

// verifica a colisão entre um círculo (cx, cy, raio) e um retângulo (x, y, w, h)
function colideRetanguloCirculo(cx, cy, raio, x, y, w, h) {
  if (cx + raio < x || cx - raio > x + w) return false;
  if (cy + raio < y || cy - raio > y + h) return false;
  return true;
}

function falaPontos(nome, pontos) {
  if (!("speechSynthesis" in window)) return;
  const pontuacao = `${nome} ${pontos}`;
  console.log(pontuacao);
  const msg = new SpeechSynthesisUtterance(pontuacao);
  msg.lang = "pt-BR";
  window.speechSynthesis.speak(msg);
}

function desenhaPlacar() {
  if (!placarElemento) return;
  placarElemento.innerHTML =
    `<span class="placar-nome">${escapaHtml(nomeJogador)}</span>` +
    `<span class="placar-pontos">${pontosJogador} : ${pontosComputador}</span>` +
    `<span class="placar-nome">${escapaHtml(nomeComputador)}</span>`;
}

function criaPlacar() {
  placarElemento = document.createElement("div");
  placarElemento.className = "placar";
  document.body.appendChild(placarElemento);
  desenhaPlacar();
}

function reiniciaPartida() {
  pontosJogador = 0;
  pontosComputador = 0;
  bola.reset();
  desenhaPlacar();
}

function verificaVitoria() {
  if (
    pontosJogador < PONTOS_PARA_VENCER &&
    pontosComputador < PONTOS_PARA_VENCER
  )
    return;
  const vencedor =
    pontosJogador >= PONTOS_PARA_VENCER ? nomeJogador : nomeComputador;
  desenhaPlacar();
  jogoIniciado = false;
  jogoPausado = false;
  noLoop();
  if (botaoReiniciar) botaoReiniciar.style.display = "none";
  if (botaoParar) botaoParar.style.display = "none";
  mostraModalVitoria(vencedor);
}

function mostraModalVitoria(vencedor) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-vitoria";

  const caixa = document.createElement("div");
  caixa.className = "modal-caixa";
  caixa.innerHTML = `
    <h2 class="modal-vitoria-titulo">🏆 ${escapaHtml(vencedor)} venceu!</h2>
    <p>Placar final da partida:</p>
    <div class="placar-resumo">
      <div class="placar-resumo-linha">
        <span>${escapaHtml(nomeJogador)}</span>
        <strong>${pontosJogador}</strong>
      </div>
      <div class="placar-resumo-linha">
        <span>${escapaHtml(nomeComputador)}</span>
        <strong>${pontosComputador}</strong>
      </div>
    </div>
    <div class="modal-acoes">
      <button class="modal-botao" id="botao-nova-partida">Nova partida</button>
      <button class="modal-botao modal-botao-secundario" id="botao-sair-vitoria">Sair do jogo</button>
    </div>
  `;
  overlay.appendChild(caixa);
  document.body.appendChild(overlay);

  caixa.querySelector("#botao-nova-partida").addEventListener("click", () => {
    overlay.remove();
    voltaTelaInicial();
  });
  caixa.querySelector("#botao-sair-vitoria").addEventListener("click", () => {
    overlay.remove();
    mostraTelaSaida();
  });
}

function criaBotaoReiniciar() {
  botaoReiniciar = document.createElement("button");
  botaoReiniciar.className = "botao-reiniciar";
  botaoReiniciar.textContent = "Reiniciar";
  botaoReiniciar.style.display = "none";
  botaoReiniciar.addEventListener("click", reiniciaPartida);
  document.body.appendChild(botaoReiniciar);
}

function paraJogo() {
  if (!jogoIniciado || jogoPausado) return;
  jogoPausado = true;
  noLoop();
  mostraModalPlacar();
}

function continuaJogo() {
  jogoPausado = false;
  loop();
}

function mostraModalPlacar() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-placar";

  const caixa = document.createElement("div");
  caixa.className = "modal-caixa";
  caixa.innerHTML = `
    <h2>Jogo pausado</h2>
    <p>Placar final da partida:</p>
    <div class="placar-resumo">
      <div class="placar-resumo-linha">
        <span>${escapaHtml(nomeJogador)}</span>
        <strong>${pontosJogador}</strong>
      </div>
      <div class="placar-resumo-linha">
        <span>${escapaHtml(nomeComputador)}</span>
        <strong>${pontosComputador}</strong>
      </div>
    </div>
    <p class="modal-contador">Reiniciando em <strong id="modal-contador-num">10</strong>s...</p>
  `;
  overlay.appendChild(caixa);
  document.body.appendChild(overlay);

  const contadorEl = caixa.querySelector("#modal-contador-num");
  let restantes = 10;
  const intervalo = setInterval(() => {
    restantes--;
    if (contadorEl) contadorEl.textContent = String(restantes);
    if (restantes <= 0) {
      clearInterval(intervalo);
      overlay.remove();
      voltaTelaInicial();
    }
  }, 1000);
}

function voltaTelaInicial() {
  jogoIniciado = false;
  jogoPausado = false;
  pontosJogador = 0;
  pontosComputador = 0;
  bola.reset();
  desenhaPlacar();
  if (botaoReiniciar) botaoReiniciar.style.display = "none";
  if (botaoParar) botaoParar.style.display = "none";
  mostraModalNome();
}

function mostraTelaSaida() {
  document.querySelectorAll(".modal-overlay").forEach((el) => el.remove());
  noLoop();
  jogoIniciado = false;
  if (botaoReiniciar) botaoReiniciar.style.display = "none";
  if (botaoParar) botaoParar.style.display = "none";

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const caixa = document.createElement("div");
  caixa.className = "modal-caixa";
  caixa.innerHTML = `
    <h2>Até a próxima!</h2>
    <p>Você saiu do jogo. Recarregue a página para jogar novamente.</p>
  `;
  overlay.appendChild(caixa);
  document.body.appendChild(overlay);
}

function criaBotaoParar() {
  botaoParar = document.createElement("button");
  botaoParar.className = "botao-parar";
  botaoParar.textContent = "Parar";
  botaoParar.style.display = "none";
  botaoParar.addEventListener("click", paraJogo);
  document.body.appendChild(botaoParar);
}

function escapaHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function mostraModalNome() {
  noLoop();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const opcoesArena = FUNDOS.map(
    (f, i) =>
      `<option value="${i}"${i === fundoSelecionado ? " selected" : ""}>${escapaHtml(f.nome)}</option>`,
  ).join("");

  const caixa = document.createElement("div");
  caixa.className = "modal-caixa";
  caixa.innerHTML = `
    <h2>Bem-vindo ao Pong</h2>
    <label class="modal-label" for="modal-nome">Seu nome:</label>
    <input id="modal-nome" type="text" class="modal-input" maxlength="16" placeholder="Digite seu nome" />
    <label class="modal-label" for="modal-arena">Arena:</label>
    <select id="modal-arena" class="modal-input">${opcoesArena}</select>
    <img id="modal-preview" class="modal-preview" alt="Pr\u00e9via da arena" />
    <div class="modal-acoes">
      <button class="modal-botao" id="botao-jogar">Iniciar nova partida</button>
      <button class="modal-botao modal-botao-secundario" id="botao-sair">Sair do jogo</button>
    </div>
  `;
  overlay.appendChild(caixa);
  document.body.appendChild(overlay);

  const input = caixa.querySelector("#modal-nome");
  const arenaSelect = caixa.querySelector("#modal-arena");
  const preview = caixa.querySelector("#modal-preview");
  const botao = caixa.querySelector("#botao-jogar");
  const botaoSair = caixa.querySelector("#botao-sair");
  if (nomeJogador && nomeJogador !== "Jogador") input.value = nomeJogador;
  input.focus();

  const atualizaPreview = () => {
    const indice = parseInt(arenaSelect.value, 10);
    preview.src = FUNDOS[indice].arquivo;
  };
  atualizaPreview();
  arenaSelect.addEventListener("change", atualizaPreview);

  const iniciar = () => {
    const valor = input.value.trim();
    nomeJogador = valor !== "" ? valor.slice(0, 16) : "Jogador";
    nomeComputador = random(NOMES_CPU);
    selecionaFundo(parseInt(arenaSelect.value, 10));
    overlay.remove();
    desenhaPlacar();
    jogoIniciado = true;
    if (botaoReiniciar) botaoReiniciar.style.display = "block";
    if (botaoParar) botaoParar.style.display = "block";
    loop();
  };

  botao.addEventListener("click", iniciar);
  botaoSair.addEventListener("click", () => {
    overlay.remove();
    mostraTelaSaida();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") iniciar();
  });
}

// pré-calcula o enquadramento do fundo para não recomputar a cada frame
function calculaEnquadramentoFundo() {
  const canvasAspectRatio = width / height;
  const fundoAspectRatio = fundoImagem.width / fundoImagem.height;
  const zoom =
    canvasAspectRatio > fundoAspectRatio
      ? width / fundoImagem.width
      : height / fundoImagem.height;
  fundoLargura = fundoImagem.width * zoom;
  fundoAltura = fundoImagem.height * zoom;
  fundoX = (width - fundoLargura) / 2;
  fundoY = (height - fundoAltura) / 2;
}

function preload() {
  bolaImagem = loadImage("assets/images/bola.png");
  jogadorImagem = loadImage("assets/images/barra01.png");
  computadorImagem = loadImage("assets/images/barra02.png");
  fundoImagens = FUNDOS.map((f) => loadImage(f.arquivo));
  fundoImagem = fundoImagens[fundoSelecionado];
  quicarSom = loadSound("assets/sounds/446100__justinvoke__bounce.wav");
  golSom = loadSound(
    "assets/sounds/274178__littlerobotsoundfactory__jingle_win_synth_02.wav",
  );
}

function selecionaFundo(indice) {
  if (indice < 0 || indice >= fundoImagens.length) return;
  fundoSelecionado = indice;
  fundoImagem = fundoImagens[indice];
  calculaEnquadramentoFundo();
}

function setup() {
  createCanvas(LARGURA_CANVAS, ALTURA_CANVAS);
  bola = new Bola();
  jogador = new Raquete(RAQUETE_MARGEM, true);
  computador = new Raquete(width - RAQUETE_MARGEM - RAQUETE_LARGURA, false);
  calculaEnquadramentoFundo();
  criaPlacar();
  criaBotaoReiniciar();
  criaBotaoParar();
  mostraModalNome();
}

function draw() {
  background(0);
  image(fundoImagem, fundoX, fundoY, fundoLargura, fundoAltura);

  bola.update();
  bola.desenha();
  jogador.update();
  jogador.desenha();
  computador.update();
  computador.desenha();

  desenhaPlacar();
}
