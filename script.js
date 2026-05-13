/* ============================================================
   SCRIPT PRINCIPAL - Despedida de Soltero David Castro
   ============================================================ */

// ============================================================
// VIDEO HERO — Replay al hacer click
// ============================================================
function replayHeroVideo() {
    const vid = document.getElementById('hero-video');
    const btn = document.getElementById('hero-replay-btn');
    const poster = document.getElementById('hero-poster');
    if (!vid) return;

    // Ocultar imagen fija y reproducir vídeo
    if (poster) poster.classList.remove('visible');
    vid.currentTime = 0;
    vid.play();

    // Feedback visual en el botón
    if (btn) {
        btn.textContent = '⟳ Reproduciendo...';
        btn.style.color = 'var(--accent-primary)';
        btn.style.borderColor = 'var(--border-orange)';
        setTimeout(() => {
            btn.textContent = '▶ Reproducir de nuevo';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1800);
    }
}

// Cuando el vídeo acaba → mostrar imagen fija con fade
document.addEventListener('DOMContentLoaded', () => {
    const vid = document.getElementById('hero-video');
    const poster = document.getElementById('hero-poster');
    if (vid) {
        vid.addEventListener('ended', () => {
            // Mostrar imagen fija con transición suave
            if (poster) poster.classList.add('visible');
            // Scroll indicator parpadea más rápido para invitar a bajar
            const scroll = document.querySelector('.scroll-indicator');
            if (scroll) scroll.style.animation = 'bounce 0.5s ease infinite';
        });
    }
});

// ============================================================
// =================== LISTA DE RETOS =========================
// ============================================================
// 
// 🎯 EDITA AQUÍ LOS RETOS:
// Añade o quita objetos del array para personalizar la ruleta.
// Cada objeto necesita: texto, emoji y color.
//
// Colores recomendados para la ruleta (alterna para que se vea bien):
// "#e11d48" (rojo), "#f59e0b" (dorado), "#8b5cf6" (morado), 
// "#22d3ee" (cian), "#34d399" (verde), "#f472b6" (rosa),
// "#fb923c" (naranja), "#60a5fa" (azul)
//
// ============================================================


// ╔══════════════════════════════════════════════════════════════╗
// ║                                                              ║
// ║           🔑🔑🔑  CONTRASEÑAS / CÓDIGOS  🔑🔑🔑             ║
// ║                                                              ║
// ║  ▸ Edita aquí para cambiar cualquier contraseña.            ║
// ║  ▸ Las normales son de UN SOLO USO.                         ║
// ║  ▸ La maestra (kukis123) funciona SIEMPRE.                  ║
// ║  ▸ Las platino activan el modo transferencia de reto.        ║
// ║                                                              ║
// ╚══════════════════════════════════════════════════════════════╝

// ┌──────────────────────────────────────────────────────────────┐
// │  👑  CONTRASEÑA MAESTRA — Uso ilimitado, nunca se consume    │
// └──────────────────────────────────────────────────────────────┘
const LLAVE_MAESTRA = "kukis123";

// ┌──────────────────────────────────────────────────────────────┐
// │  🔒  CONTRASEÑAS NORMALES — 33 códigos, un solo uso cada uno │
// └──────────────────────────────────────────────────────────────┘
const LLAVES = [
    "Catena13", "LoreDavid", "RushCabra", "Dust2Love", "Boda2026",
    "LucenaCS", "GGNovios", "ClutchLore", "DavidMora", "Inferno13",
    "AriaGG", "CabraLove", "RushBoda", "AWPDavid", "Lore2026",
    "BodorrioCabra", "Aria2026", "CSyAmor", "NovioMVP", "Lucena13",
    "AriaMVP", "SmokeLove", "David13", "TeamCatena", "AriaRush",
    "MirageLove", "EcoRound", "LoreAWP", "CabraMVP", "PlantTheBomb",
    "DavidClutch", "BodaInferno", "NoviaLegend"
];

// ┌──────────────────────────────────────────────────────────────┐
// │  💎  LLAVES PLATINO — 5 códigos, activan modo transferencia  │
// └──────────────────────────────────────────────────────────────┘
const LLAVES_PLATINO = [
    "AriaTeAmo",
    "Altamirano",
    "CatenaFamily",
    "Fonda",
    "MariaCatena"
];
// ══════════════════════════════════════════════════════════════

// Variable global para almacenar al amigo al que se le asigna el comodín
let retoComodin = null;

// Llave platino pendiente de confirmar (se guarda aquí hasta saber si se transfiere o no)
let llavePlatinoPendiente = null;

// ============================================================
// MOTOR DE SONIDO (Web Audio API - sin archivos externos)
// ============================================================
const SoundFX = (function () {
    let ctx = null;
    let muted = false;

    function getCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // Genera una nota sintetizada con envolvente ADSR simplificada
    function nota(freq, dur, tipo = 'sine', volumen = 0.35, retardo = 0) {
        if (muted) return;
        const c = getCtx();
        const t = c.currentTime + retardo;
        const osc = c.createOscillator();
        const env = c.createGain();
        osc.connect(env);
        env.connect(c.destination);
        osc.type = tipo;
        osc.frequency.setValueAtTime(freq, t);
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(volumen, t + 0.012);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t);
        osc.stop(t + dur + 0.05);
    }

    // Genera ruido blanco con filtro y envolvente
    function ruido(dur, vol = 0.25, retardo = 0, corte = 600) {
        if (muted) return;
        const c = getCtx();
        const t = c.currentTime + retardo;
        const muestras = Math.ceil(c.sampleRate * dur);
        const buf = c.createBuffer(1, muestras, c.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < muestras; i++) data[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource();
        src.buffer = buf;
        const filtro = c.createBiquadFilter();
        filtro.type = 'lowpass';
        filtro.frequency.value = corte;
        const env = c.createGain();
        src.connect(filtro);
        filtro.connect(env);
        env.connect(c.destination);
        env.gain.setValueAtTime(vol, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + dur);
        src.start(t);
        src.stop(t + dur + 0.05);
    }

    return {
        // Alterna silencio
        toggle() {
            muted = !muted;
            return muted;
        },
        isMuted() { return muted; },

        // Click de la ruleta al pasar por cada tarjeta
        tick(velocidad = 1) {
            // La frecuencia del tick sube cuando la ruleta va rápido
            const freq = 600 + (1 - velocidad) * 400;
            nota(freq, 0.045, 'square', 0.18);
        },

        // Rumble / vibración de la caja
        shake() {
            ruido(0.55, 0.15, 0, 180);
            nota(70, 0.55, 'sine', 0.12);
            nota(110, 0.4, 'sine', 0.08, 0.05);
        },

        // Whoosh ascendente al abrir la tapa
        whoosh() {
            if (muted) return;
            const c = getCtx();
            // Barrido de frecuencia
            const osc = c.createOscillator();
            const env = c.createGain();
            osc.connect(env);
            env.connect(c.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, c.currentTime);
            osc.frequency.exponentialRampToValueAtTime(2200, c.currentTime + 0.75);
            env.gain.setValueAtTime(0.28, c.currentTime);
            env.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.75);
            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.8);
            // Capa de ruido filtrado
            ruido(0.65, 0.1, 0, 2000);
        },

        // Impacto del flash (boom)
        flash() {
            nota(1400, 0.25, 'sine', 0.45);
            nota(700, 0.3, 'sine', 0.2, 0.02);
            ruido(0.2, 0.3, 0, 4000);
        },

        // Fanfarria ganadora
        winner() {
            // Melodía ascendente
            const mel = [523, 659, 784, 1047, 1319];
            mel.forEach((f, i) => nota(f, 0.4, 'sine', 0.35, i * 0.1));
            // Armonía
            const arm = [659, 784, 988, 1319];
            arm.forEach((f, i) => nota(f, 0.3, 'triangle', 0.15, i * 0.1 + 0.05));
            // Shimmer final
            nota(2093, 0.5, 'sine', 0.2, 0.4);
        },

        // Pop de confetti
        confetti() {
            [784, 880, 988, 1175, 1319].forEach((f, i) =>
                nota(f, 0.22, 'sine', 0.2, i * 0.07)
            );
        },

        // Sonidos C4
        bombaPlanted() {
            if (muted) return;
            [0, 0.2, 0.4].forEach(t => nota(1800, 0.08, 'sine', 0.3, t));
        },
        bombaTick(fast = false) {
            if (muted) return;
            nota(1800, 0.05, 'sine', 0.3);
        },
        bombaExplosion() {
            if (muted) return;
            ruido(2.5, 0.9, 0, 800);
            nota(80, 2.0, 'sawtooth', 0.6);
            nota(40, 2.5, 'square', 0.5);
            // Flash bang effect
            ruido(1.0, 0.5, 0, 5000);
        }
    };
})();

// Función global para el botón de mute
function toggleMute() {
    const silenciado = SoundFX.toggle();
    const btn = document.getElementById('mute-btn');
    const icon = document.getElementById('mute-icon');
    if (btn) btn.classList.toggle('muted', silenciado);
    if (icon) icon.textContent = silenciado ? '🔇' : '🔊';
}

// ============================================================
// ============= FIN DE LLAVES / CÓDIGOS =====================
// ============================================================

// ============================================================
// =================== RETOS POR RONDA ======================
// ============================================================

const RETOS_POR_RONDA = {
    ronda1: [
        { texto: "Pide el desayuno con voz de narrador de fútbol", emoji: "⚽", color: "#e11d48" },
        { texto: "Invéntate una historia falsa sobre cómo conociste a Lorena", emoji: "💬", color: "#f59e0b" },

    ],
    ronda2: [
        { texto: "Debes rendirte dramáticamente al primer impacto: caída al suelo, discurso final y todo", emoji: "🎭", color: "#e11d48" },
        { texto: "Celebra cada impacto como si hubieras marcado un gol en la final de Champions.", emoji: "⚽", color: "#f59e0b" },
        { texto: "Tienes que motivar al equipo con discursos totalmente absurdos.", emoji: "📣", color: "#8b5cf6" },
        { texto: "Antes de atacar tienes que gritar una frase de guerra ridícula.", emoji: "⚔️", color: "#22d3ee" },
        { texto: "Cada vez que te eliminen tienes que hacer 10 sentadillas antes de volver 🏋️", emoji: "🏋️", color: "#34d399" }
    ],
    ronda3: [
        { texto: "Pregunta por el plato más raro que veas en la carta al camarero y hazte el interesante.", emoji: "🍽️", color: "#e11d48" },
        { texto: "El grupo elige una palabra prohibida. Si la dices, chupito 🥃", emoji: "🥃", color: "#f59e0b", beber: true },
        { texto: "Haz de traductor oficial del grupo inventándote lo que dicen los demás 🌍", emoji: "🌍", color: "#8b5cf6" },
        { texto: "Explica cómo sobrevivirías en una isla desierta… usando solo cosas de la mesa 🏝️", emoji: "🏝️", color: "#22d3ee" },
        { texto: "Describe cada comida como si fueras jurado de MasterChef.", emoji: "👨‍🍳", color: "#22d3ee" },
        { texto: "Cuéntale a alguien del local que mañana te casas y que estás muy nervioso 💍", emoji: "💍", color: "#34d399" },
        { texto: "Intenta vender un objeto random de la mesa como si costara 1 millón de euros 💸", emoji: "💸", color: "#34d399" },
        { texto: "Levántate y baila para que todos los de la mesa te vean.", emoji: "🕺", color: "#f472b6" },
        { texto: "Convence a la mesa de una teoría absurda como si fuera totalmente real (ej: las palomas son espías) 🕵️", emoji: "🕵️", color: "#fb923c" },
        { texto: "Pide una servilleta como si estuvieras protagonizando una escena dramática de telenovela 🎭", emoji: "🎭", color: "#f472b6" },
        { texto: "Baila con una persona de la mesa una bachata apasionada como si fuera la última noche de tu vida 💃", emoji: "💃", color: "#6366f1" },
        { texto: "Inventa un grito de guerra para el equipo y que todo el mundo lo repita 📣", emoji: "📣", color: "#f43f5e" },

    ],
    ultimaRonda: [
        { texto: "Coge el 'objeto sagrado' y protégelo toda la noche como el anillo de Frodo ⚔️", emoji: "⚔️", color: "#fb923c", objetoSagrado: true },
        { texto: "Te pones las uñas postizas que lleva Lorena y las llevas 30 minutos 💅", emoji: "💅", color: "#e11d48", timer: 1800 },
        { texto: "Improvisa una coreografía en plena calle y aguanta 30 segundos sin parar 🕺", emoji: "💃", color: "#8b5cf6", timer: 30 },
        { texto: "Ronda de chupitos sin usar las manos — todos a la vez 🔥", emoji: "🔥", color: "#22d3ee", beber: true },
        { texto: "Pídele una foto a quien el grupo elija (para el vídeo de recuerdo 😂) 🤳", emoji: "🤳", color: "#f59e0b" },
        { texto: "Para a una pareja mayor por la calle y pregúntales el secreto del amor 💑", emoji: "💑", color: "#34d399" },
        { texto: "Bebe lo que tengas delante sin usar las manos 🍺", emoji: "🍺", color: "#f472b6", beber: true },
        { texto: "Habla con un acento que no sea el tuyo durante media hora 🗣️", emoji: "🎙️", color: "#60a5fa", timer: 1800 },
        { texto: "¡Preguntas de cultura general! Demuestra que no eres un ignorante 🧠", emoji: "🧠", color: "#6366f1", quiz: true },
        { texto: "Haz una foto con 5 desconocidos en menos de 3 minutos 📸", emoji: "📸", color: "#e11d48", timer: 180 },
        { texto: "Publica una historia de Instagram diciendo cuánto quieres a Lorena 📱", emoji: "❤️", color: "#f59e0b" },
        { texto: "Pide una bebida en un bar hablando solo con mímica 🤐", emoji: "🍹", color: "#8b5cf6", beber: true },
        { texto: "Baila reguetón durante 1 minuto sin parar 💃", emoji: "🕺", color: "#22d3ee", timer: 60 },
        { texto: "Cuenta tu momento más vergonzoso delante de todos 😳", emoji: "🫣", color: "#34d399" },
        { texto: "Imita a tu suegra durante 2 minutos 😂", emoji: "🎭", color: "#f472b6", timer: 120 },
        { texto: "Haz 20 flexiones ahora mismo o paga una ronda 💪", emoji: "💪", color: "#fb923c" },
        { texto: "Pide a un desconocido que os haga una foto \"porque sois influencers\".", emoji: "📸", color: "#8b5cf6" }
    ]
};

// Ronda actualmente seleccionada ('ronda1' | 'ronda2' | 'ronda3' | 'ultimaRonda')
let rondaActual = null;

// Construye el array RETOS dinámicamente según la ronda activa
function getRetosDeRonda() {
    if (!rondaActual) return [];
    return (RETOS_POR_RONDA[rondaActual] || []).map((r, i) => ({ ...r, _idx: i }));
}

// Reto pendiente de confirmar (puede que no pueda hacerse)
let retoPendienteConfirm = null;

// ============================================================
// =================== FIN DE RETOS ==========================
// ============================================================

const RETOS = []; // Alias vacío — los retos reales están en RETOS_POR_RONDA

// ============================================================
// VARIABLES GLOBALES
// ============================================================
let girando = false;              // Controla si la caja está girando
let csRating = 4999;              // Calificación CS Premier
let historialRetos = [];          // Historial de retos completados
let retosUsados = {};             // { rondaKey: [indices usados] }
let llavesUsadas = [];            // Códigos de llave ya canjeados

// Tamaño de cada tarjeta + margen (px)
const ITEM_W = 162;

// Devuelve los retos de la ronda actual que todavía no han salido
function getRetosActivos() {
    if (!rondaActual) return [];
    const usados = retosUsados[rondaActual] || [];
    return getRetosDeRonda().filter(r => !usados.includes(r._idx));
}


// ============================================================
// LOCALSTORAGE - CLAVES
// ============================================================
const LS_HISTORIAL = 'despedida_david_historial';
const LS_USADOS = 'despedida_david_usados';
const LS_LLAVES_USADAS = 'despedida_david_llaves_usadas'; // llaves ya canjeadas

// Guarda el estado actual en localStorage
function guardarEstado() {
    localStorage.setItem(LS_HISTORIAL, JSON.stringify(historialRetos));
    localStorage.setItem(LS_USADOS, JSON.stringify(retosUsados));
    if (rondaActual) localStorage.setItem('despedida_david_ronda', rondaActual);
}

// Guarda las llaves usadas y actualiza el contador visual
function guardarLlavesUsadas() {
    localStorage.setItem(LS_LLAVES_USADAS, JSON.stringify(llavesUsadas));
    actualizarContadorLlaves();
}

// Actualiza los badges del contador de llaves en la página
function actualizarContadorLlaves() {
    // Contar cuántas llaves normales y platino han sido usadas
    const platinasUsadas = llavesUsadas.filter(l =>
        LLAVES_PLATINO.some(p => p.toUpperCase() === l.toUpperCase())
    ).length;
    const normalesUsadas = llavesUsadas.length - platinasUsadas;

    const numNormales = document.getElementById('llaves-normales-num');
    const numPlatino = document.getElementById('llaves-platino-num');
    const badgeNormales = document.getElementById('llaves-normales-badge');
    const badgePlatino = document.getElementById('llaves-platino-badge');

    if (numNormales) numNormales.textContent = normalesUsadas;
    if (numPlatino) numPlatino.textContent = platinasUsadas;

    // Clase "agotada" cuando se alcanzan los máximos
    if (badgeNormales) badgeNormales.classList.toggle('agotada', normalesUsadas >= LLAVES.length);
    if (badgePlatino) badgePlatino.classList.toggle('agotada', platinasUsadas >= LLAVES_PLATINO.length);
}

// Carga el estado guardado desde localStorage
function cargarEstado() {
    const historialGuardado = localStorage.getItem(LS_HISTORIAL);
    const usadosGuardado = localStorage.getItem(LS_USADOS);
    const llavesUsadasGuardado = localStorage.getItem(LS_LLAVES_USADAS);
    const rondaGuardada = localStorage.getItem('despedida_david_ronda');

    if (historialGuardado) historialRetos = JSON.parse(historialGuardado);
    if (usadosGuardado) {
        const parsed = JSON.parse(usadosGuardado);
        // Compatibilidad: si el dato guardado era un array (formato antiguo), ignorarlo
        retosUsados = (parsed && !Array.isArray(parsed)) ? parsed : {};
    }
    if (llavesUsadasGuardado) llavesUsadas = JSON.parse(llavesUsadasGuardado);
    if (rondaGuardada) rondaActual = rondaGuardada;

    const savedRating = localStorage.getItem('despedida_david_cs_rating');
    if (savedRating) csRating = parseInt(savedRating, 10);

    // Mostrar contador de llaves con los datos cargados
    actualizarContadorLlaves();
    actualizarRatingUI();
}

// Borra todo el estado guardado
function borrarEstado(resetLlaves = false) {
    localStorage.removeItem(LS_HISTORIAL);
    localStorage.removeItem(LS_USADOS);
    localStorage.removeItem('despedida_david_cs_rating');
    // Si se pide, también borrar las llaves usadas
    if (resetLlaves) {
        localStorage.removeItem(LS_LLAVES_USADAS);
    }
}


// ============================================================
// ACTUALIZAR CONTADOR DE RETOS RESTANTES
// ============================================================
function actualizarRetosRestantes() {
    const totalRonda = rondaActual ? (RETOS_POR_RONDA[rondaActual] || []).length : 0;
    const usadosRonda = rondaActual ? (retosUsados[rondaActual] || []).length : 0;
    const total = Object.values(RETOS_POR_RONDA).reduce((s, a) => s + a.length, 0);
    const usados = Object.values(retosUsados).reduce((s, a) => s + a.length, 0);
    const restantes = totalRonda - usadosRonda;
    const porcentaje = totalRonda > 0 ? (usadosRonda / totalRonda) * 100 : 0;

    // Texto descriptivo
    const el = document.getElementById('caja-retos-restantes');
    if (el) {
        if (restantes === 0) {
            el.textContent = '🎉 ¡Todos los retos completados! David, eres un crack.';
        } else if (restantes === 1) {
            el.textContent = '🔥 ¡Solo queda 1 reto! ¿Te atreves?';
        } else {
            el.textContent = `${restantes} reto${restantes !== 1 ? 's' : ''} restante${restantes !== 1 ? 's' : ''} — ¡No hay escapatoria!`;
        }
    }

    // Contadores numéricos
    const elUsados = document.getElementById('progreso-usados');
    const elTotal = document.getElementById('progreso-total');
    if (elUsados) elUsados.textContent = usados;
    if (elTotal) elTotal.textContent = total;

    // Barra de fill
    const fill = document.getElementById('progreso-fill');
    const glow = document.getElementById('progreso-glow');
    if (fill) {
        fill.style.width = porcentaje + '%';
        // Color: verde cuando completo, naranja-dorado normal
        if (porcentaje >= 100) {
            fill.style.background = 'linear-gradient(90deg, #34d399, #10b981)';
        } else if (porcentaje >= 75) {
            fill.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
        } else {
            fill.style.background = 'linear-gradient(90deg, var(--accent-primary), #e4ae39)';
        }
    }
    if (glow) {
        glow.style.left = Math.max(porcentaje - 2, 0) + '%';
        glow.style.opacity = porcentaje > 0 && porcentaje < 100 ? '1' : '0';
    }

    // Lógica del botón de girar
    const spinBtn = document.getElementById('spin-button');
    if (spinBtn) {
        if (usados >= total && total > 0) {
            spinBtn.innerHTML = '<span class="spin-icon">🏆</span> ¡TODOS LOS RETOS COMPLETADOS!';
            spinBtn.disabled = true;
            spinBtn.title = '¡Habéis superado toda la despedida!';
        } else if (rondaActual && restantes === 0) {
            spinBtn.innerHTML = '<span class="spin-icon">🔄</span> PASAR A SIGUIENTE RONDA';
            spinBtn.disabled = false;
            spinBtn.title = 'Cambia de ronda para seguir jugando';
        } else {
            spinBtn.innerHTML = '<span class="spin-icon">🔑</span> ¡ABRIR CAJA DE RETOS!';
            spinBtn.disabled = false;
            spinBtn.title = '';
        }
    }

    // Actualizar el indicador permanente de ronda
    const roundDisplay = document.getElementById('current-round-display');
    const roundValue = document.getElementById('current-round-value');
    if (roundDisplay && roundValue) {
        if (rondaActual) {
            const nombresRondas = {
                'ronda1': 'Ronda 1: Desayuno',
                'ronda2': 'Ronda 2: Paintball',
                'ronda3': 'Ronda 3: Almuerzo',
                'ultimaRonda': 'Final Round: Drink!!'
            };
            roundValue.textContent = nombresRondas[rondaActual] || rondaActual;
            roundDisplay.style.display = 'inline-flex';
        } else {
            roundDisplay.style.display = 'none';
        }
    }
}


// ============================================================
// CONSTRUIR LA TIRA DE RETOS (estilo apertura de caja CS:GO)
// ============================================================
// totalItems: número total de tarjetas a generar en la tira
// winnerIndex: posición dentro de la tira donde queremos que caiga el ganador

// Fuerza la variante de color de un emoji sin duplicar el selector \uFE0F
function emojiColor(e) {
    if (!e || e.endsWith('\uFE0F') || e.includes('\u200D')) return e;
    return e + '\uFE0F';
}

function construirTira(retosActivos, winnerRetoIdx, totalItems, winnerPos) {
    const tira = document.getElementById('caja-tira');
    tira.innerHTML = '';

    for (let i = 0; i < totalItems; i++) {
        // Escoge un reto aleatorio de los activos para cada posición,
        // pero la posición winnerPos usa exactamente el ganador.
        const reto = (i === winnerPos)
            ? retosActivos[winnerRetoIdx]
            : retosActivos[Math.floor(Math.random() * retosActivos.length)];

        const div = document.createElement('div');
        div.className = 'caja-item';
        div.style.setProperty('--item-color', reto.color);
        if (i === winnerPos) div.dataset.ganador = '1';

        let textoCorto = reto.texto;
        if (textoCorto.length > 55) textoCorto = textoCorto.substring(0, 53) + '…';

        div.innerHTML = `
            <span class="caja-item-emoji">${emojiColor(reto.emoji)}</span>
            <span class="caja-item-texto">${textoCorto}</span>
        `;
        tira.appendChild(div);
    }
}


// ============================================================
// MODAL DE LLAVE / SISTEMA DE PAGO
// ============================================================

// Mensajes graciosos para pagos falsos rechazados
const MENSAJES_RECHAZO = {
    tarjeta: [
        '"Su tarjeta ha sido rechazada. Llame a su banco para saber por qué no tiene dinero." 💳😅',
        'Error 402: Fondos insuficientes. ¿Has mirado cuanto te queda en la cuenta? 🤔',
        'Transacción denegada. Su banco sospecha que está de despedida y ha bloqueado la tarjeta. 🔒'
    ],
    bizum: [
        'Bizum rechazado. Resulta que tu contacto no tiene Bizum... ni bancos en los que confiar. 📱',
        'El bizum volvió de donde vino. Parece que nadie quiere tu dinero. 🤷',
        'Error de Bizum: Saldo insuficiente. Pon aunque sea para la siguiente ronda. 🍺'
    ],
    paypal: [
        'PayPal ha detectado actividad sospechosa: alguien intentando divertirse en una despedida. Bloqueado. 🚫',
        'Su cuenta PayPal está limitada. Probablemente porque lleva años sin pagar nada. 😂',
        'PayPal no está disponible en este momento (ni nunca para ti). 🤷‍♂️'
    ],
    crypto: [
        'Bitcoin no encontrado en tu cartera. Quizás deberías haber HODL más. 📉',
        'La blockchain confirmó la transacción... y luego la canceló. Karma. ⚡',
        'Error: gas fee mayor que tu saldo total. ETH no es para los pobres. 😂'
    ]
};

// Muestra el modal de llave
function mostrarModalLlave() {
    const overlay = document.getElementById('llave-overlay');
    overlay.classList.add('visible');
    mostrarMetodosLlave();
}

// Cierra el modal de llave
function cerrarModalLlave() {
    document.getElementById('llave-overlay').classList.remove('visible');
}

// Muestra el panel principal de métodos de pago
function mostrarMetodosLlave() {
    document.getElementById('llave-metodos').style.display = 'block';
    document.getElementById('llave-codigo-panel').classList.remove('active');
    document.getElementById('llave-procesando').classList.remove('active');
    document.getElementById('llave-rechazado').classList.remove('active');
    // Limpiar error y campo
    document.getElementById('llave-codigo-error').textContent = '';
    const input = document.getElementById('llave-codigo-input');
    if (input) input.value = '';
}

// Selecciona un método de pago
function seleccionarPago(metodo) {
    if (metodo === 'regalo') {
        // Mostrar panel de código real
        document.getElementById('llave-metodos').style.display = 'none';
        document.getElementById('llave-codigo-panel').classList.add('active');
        setTimeout(() => {
            document.getElementById('llave-codigo-input').focus();
        }, 100);
        return;
    }

    // Para los demás: simular procesando y luego rechazar con humor
    document.getElementById('llave-metodos').style.display = 'none';
    const procesando = document.getElementById('llave-procesando');
    procesando.classList.add('active');

    const pasos = [
        'Conectando con el servidor...',
        'Verificando datos...',
        'Procesando pago...',
        'Confirmando transacción...'
    ];
    let paso = 0;
    const textoEl = document.getElementById('llave-procesando-texto');
    textoEl.textContent = pasos[0];

    const intervalo = setInterval(() => {
        paso++;
        if (paso < pasos.length) {
            textoEl.textContent = pasos[paso];
        }
    }, 600);

    // Después de 2.8s: rechazar
    setTimeout(() => {
        clearInterval(intervalo);
        procesando.classList.remove('active');

        const mensajes = MENSAJES_RECHAZO[metodo] || MENSAJES_RECHAZO.tarjeta;
        const msg = mensajes[Math.floor(Math.random() * mensajes.length)];
        document.getElementById('llave-rechazado-msg').textContent = msg;
        document.getElementById('llave-rechazado').classList.add('active');
    }, 2800);
}

// Verifica el código de la tarjeta regalo
function verificarCodigo() {
    const input = document.getElementById('llave-codigo-input');
    const errorEl = document.getElementById('llave-codigo-error');
    const codigo = input.value.trim();

    errorEl.textContent = '';

    if (!codigo) {
        errorEl.textContent = '¡Escribe un código antes de canjear! 🙃';
        return;
    }

    const codigoUpper = codigo.toUpperCase();

    // ── 1. Contraseña maestra: uso ilimitado, nunca se consume ──
    if (codigoUpper === LLAVE_MAESTRA.toUpperCase()) {
        retoComodin = null;
        cerrarModalLlave();
        setTimeout(() => { animarAperturaCaja(); }, 300);
        return;
    }

    // ── 2. Buscar entre contraseñas normales y platino ──
    const codigoOriginal = LLAVES.find(l => l.toUpperCase() === codigoUpper);
    const esPlatino = LLAVES_PLATINO.find(l => l.toUpperCase() === codigoUpper);

    if (!codigoOriginal && !esPlatino) {
        errorEl.textContent = '❌ Código inválido. Comprueba que lo has escrito bien.';
        input.select();
        return;
    }

    const claveAUsar = esPlatino || codigoOriginal;

    // ── 3. Comprobar si ya fue usada (un solo uso) ──
    if (llavesUsadas.map(l => l.toUpperCase()).includes(claveAUsar.toUpperCase())) {
        errorEl.textContent = '🔒 Esta contraseña ya fue utilizada y ha quedado invalidada. No puede volver a abrir cajas.';
        input.select();
        return;
    }

    // ── 4. Código válido ──
    if (esPlatino) {
        // Llave Platino: NO se consume todavía.
        // Solo se consumirá si el usuario elige transferir el reto a otro.
        // Si elige "Yo mismo lo hago", la llave queda intacta.
        llavePlatinoPendiente = claveAUsar;
        retoComodin = null;
        cerrarModalLlave();
        setTimeout(() => {
            mostrarModalLlavePlatino(claveAUsar);
        }, 300);
        return;
    }

    // Contraseña normal: marcar como usada ahora
    llavesUsadas.push(claveAUsar);
    guardarLlavesUsadas();
    retoComodin = null;

    cerrarModalLlave();
    setTimeout(() => {
        animarAperturaCaja();
    }, 300);
}

// ── Modal especial para Llave Platino ──
function mostrarModalLlavePlatino(nombreLlave) {
    // Crear overlay dinámico si no existe
    let overlay = document.getElementById('platino-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'platino-overlay';
        overlay.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:9999',
            'display:flex', 'align-items:center', 'justify-content:center',
            'background:rgba(0,0,0,0.82)', 'backdrop-filter:blur(6px)',
            'padding:1.5rem'
        ].join(';');
        overlay.innerHTML = `
            <div style="
                background:linear-gradient(135deg,#1a1200 0%,#2a1f00 100%);
                border:2px solid #e5c100;
                border-radius:1.25rem;
                padding:2.5rem 2rem;
                max-width:480px;
                width:100%;
                text-align:center;
                box-shadow:0 0 60px #f5a62388,0 0 120px #f5a62322;
                font-family:inherit;
            ">
                <div style="font-size:3rem;margin-bottom:.5rem;">🗝️</div>
                <div style="
                    font-size:1.6rem;
                    font-weight:900;
                    color:#f5c842;
                    letter-spacing:.05em;
                    text-shadow:0 0 18px #f5c84299;
                    margin-bottom:.4rem;
                ">¡LLAVE PLATINO ACTIVADA!</div>
                <div style="color:#ffe97a;font-size:1rem;margin-bottom:1.5rem;opacity:.9;">
                    Puedes transferir el siguiente reto aleatorio<br>a otra persona del grupo.
                </div>
                <label style="color:#ccc;font-size:.9rem;display:block;margin-bottom:.5rem;">
                    ¿A qué persona le pasas el marrón?
                </label>
                <input id="platino-nombre-input" type="text" placeholder="Nombre de la persona..."
                    style="
                        width:100%;box-sizing:border-box;
                        padding:.75rem 1rem;
                        border-radius:.6rem;
                        border:1.5px solid #f5c842;
                        background:#0d0a00;
                        color:#fff;
                        font-size:1rem;
                        outline:none;
                        margin-bottom:1.25rem;
                    "
                    onkeydown="if(event.key==='Enter') confirmarLlavePlatino();"
                />
                <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
                    <button onclick="confirmarLlavePlatino()" style="
                        padding:.75rem 2rem;
                        border-radius:.6rem;
                        border:none;
                        background:linear-gradient(135deg,#f5c842,#e5a800);
                        color:#1a1200;
                        font-weight:800;
                        font-size:1rem;
                        cursor:pointer;
                        transition:filter .2s;
                    " onmouseover="this.style.filter='brightness(1.15)'" onmouseout="this.style.filter=''">
                        ✨ Confirmar
                    </button>
                    <button onclick="confirmarLlavePlatino(true)" style="
                        padding:.75rem 1.5rem;
                        border-radius:.6rem;
                        border:1.5px solid #555;
                        background:transparent;
                        color:#aaa;
                        font-weight:600;
                        font-size:.95rem;
                        cursor:pointer;
                    ">
                        Yo mismo lo hago
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    // Limpiar input y mostrar
    const inp = document.getElementById('platino-nombre-input');
    if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 150); }
    overlay.style.display = 'flex';
}

function confirmarLlavePlatino(yoMismo = false) {
    const overlay = document.getElementById('platino-overlay');

    if (yoMismo) {
        // El usuario lo hace él mismo → la llave NO se consume
        retoComodin = null;
        llavePlatinoPendiente = null;
    } else {
        // Transfiere el reto → la llave SÍ se consume ahora
        const inp = document.getElementById('platino-nombre-input');
        const nombre = inp ? inp.value.trim() : '';
        retoComodin = nombre.length > 0 ? nombre : 'Alguna persona';

        if (llavePlatinoPendiente) {
            llavesUsadas.push(llavePlatinoPendiente);
            guardarLlavesUsadas();
            llavePlatinoPendiente = null;
        }
    }

    if (overlay) overlay.style.display = 'none';
    animarAperturaCaja();
}


// ============================================================
// ABRIR LA CAJA - PUNTO DE ENTRADA
// Comprueba si necesita llave antes de animar
// ============================================================
// ============================================================
// MODAL DE SELECCIÓN DE RONDA
// ============================================================
function mostrarModalRonda() {
    document.getElementById('ronda-overlay').classList.add('visible');
}

function cerrarModalRonda() {
    document.getElementById('ronda-overlay').classList.remove('visible');
}

function intentarCambiarRonda() {
    if (rondaActual) {
        const retosActivos = getRetosActivos();
        if (retosActivos.length > 0) {
            const confirmacion = confirm(`⚠️ ¡Todavía quedan ${retosActivos.length} retos sin completar en esta ronda!\n\n¿Estás seguro de que quieres avanzar y abandonar esta fase del día?`);
            if (!confirmacion) return;
        }
    }
    mostrarModalRonda();
}

let pendingRondaKey = null;

function seleccionarRonda(rondaKey) {
    pendingRondaKey = rondaKey;
    document.getElementById('password-modal-overlay').classList.add('active');
    document.getElementById('ronda-password-error').style.display = 'none';

    const input = document.getElementById('ronda-password-input');
    input.value = '';
    // Enfocar después de que la transición CSS comience
    setTimeout(() => input.focus(), 100);
}

function cancelarRondaPassword() {
    document.getElementById('password-modal-overlay').classList.remove('active');
    pendingRondaKey = null;
}

function submitRondaPassword() {
    if (!pendingRondaKey) return;

    const contrasenas = {
        'ronda1': 'Desayuno',
        'ronda2': 'Paintball',
        'ronda3': 'Almuerzo',
        'ultimaRonda': 'Copas'
    };

    const pass = document.getElementById('ronda-password-input').value;

    // Verificación (ignorando mayúsculas, minúsculas y espacios extra)
    if (pass.trim().toLowerCase() !== contrasenas[pendingRondaKey].toLowerCase()) {
        document.getElementById('ronda-password-error').style.display = 'block';
        return;
    }

    document.getElementById('ronda-password-error').style.display = 'none';
    document.getElementById('password-modal-overlay').classList.remove('active');
    cerrarModalRonda();

    // ==========================================
    // TRANSICIÓN ÉPICA DE RONDA
    // ==========================================
    const textosTransicion = {
        'ronda1': 'Ronda 1: Desayuno',
        'ronda2': 'Ronda 2: Lucha en Paintball',
        'ronda3': 'Ronda 3: Almuerzo',
        'ultimaRonda': 'Final Round: Drink!!'
    };

    const overlay = document.getElementById('round-transition-overlay');
    const textEl = document.getElementById('round-transition-text');

    textEl.textContent = textosTransicion[pendingRondaKey];
    overlay.classList.add('active');

    // Sonidos épicos de transición
    SoundFX.shake();
    setTimeout(() => SoundFX.flash(), 300);

    // Esperar a que pase la animación y luego setear la ronda real
    setTimeout(() => {
        overlay.classList.remove('active');

        rondaActual = pendingRondaKey;
        localStorage.setItem('despedida_david_ronda', pendingRondaKey);
        actualizarRetosRestantes();

        const retosActivos = getRetosActivos();
        if (retosActivos.length === 0) {
            alert('¡Ya completaste todos los retos de esta ronda! 🎉 Elige otra ronda.');
            return;
        }

        // No llamamos a mostrarModalLlave automáticamente aquí para que tengan que darle al botón de abrir
    }, 2500);
}

function girarRuleta() {
    if (girando) return;

    if (!rondaActual) {
        // Primera vez: preguntar la ronda obligatoriamente
        mostrarModalRonda();
    } else {
        // Ya hay ronda, comprobar si quedan retos
        const retosActivos = getRetosActivos();
        if (retosActivos.length === 0) {
            // Si le dio a abrir pero ya no quedan retos, le obligamos a cambiar de ronda
            mostrarModalRonda();
        } else {
            // Ir directamente a pedir la llave
            mostrarModalLlave();
        }
    }
}


// ============================================================
// ANIMACIÓN DE APERTURA (se llama tras canjear una llave válida)
// ============================================================
function iniciarAperturaCaja() {
    if (girando) return;

    const retosActivos = getRetosActivos();
    if (retosActivos.length === 0) return;

    girando = true;
    const boton = document.getElementById('spin-button');
    boton.disabled = true;

    // ---- Elegir ganador ----
    let winnerRetoIdx = Math.floor(Math.random() * retosActivos.length);

    // Obligar a que el primer reto de la ronda 1 salga primero (100% prob)
    if (rondaActual === 'ronda1') {
        const idxPrimerReto = retosActivos.findIndex(r => r._idx === 0);
        if (idxPrimerReto !== -1) {
            winnerRetoIdx = idxPrimerReto;
        }
    }

    // Obligar a que el reto del 'objeto sagrado' salga primero (100% prob) cuando esté en su ronda
    const idxObjetoSagrado = retosActivos.findIndex(r => r.objetoSagrado);
    if (idxObjetoSagrado !== -1) {
        winnerRetoIdx = idxObjetoSagrado;
    }

    // ---- Configurar la tira ----
    // La tira tiene muchos items; el ganador cae en una posición
    // cercana al final para que haya mucho recorrido visible.
    const totalItems = 60;
    const winnerPos = totalItems - 8 - Math.floor(Math.random() * 4);

    construirTira(retosActivos, winnerRetoIdx, totalItems, winnerPos);

    // ---- Calcular cuánto desplazar la tira ----
    const ventana = document.getElementById('caja-ventana');
    const ventanaW = ventana.offsetWidth;
    const centerOfWinner = winnerPos * ITEM_W + ITEM_W / 2;
    const targetTranslate = ventanaW / 2 - centerOfWinner;
    const offset = (Math.random() - 0.5) * 60;
    const finalTranslate = targetTranslate + offset;

    // ---- Animar ----
    const duracion = 5000 + Math.random() * 1500;
    const inicio = performance.now();
    const tira = document.getElementById('caja-tira');

    // Activar will-change SOLO durante la animación (iOS Safari bug fix)
    tira.style.willChange = 'transform';
    tira.style.transform = 'translate3d(0, 0, 0)';

    function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
    }

    let lastTickIndex = -1;

    function animar(ahora) {
        const transcurrido = ahora - inicio;
        const progreso = Math.min(transcurrido / duracion, 1);
        const progresoSuave = easeOutQuint(progreso);
        const translateX = finalTranslate * progresoSuave;

        // translate3d en lugar de translateX: mantiene la capa GPU estable en iOS
        tira.style.transform = `translate3d(${translateX}px, 0, 0)`;

        // Parpadeo del indicador al pasar por cada tarjeta
        const centroVentana = ventanaW / 2;
        const indiceActual = Math.floor((centroVentana - translateX) / ITEM_W);
        if (indiceActual !== lastTickIndex && indiceActual >= 0 && indiceActual < totalItems) {
            lastTickIndex = indiceActual;
            // Sonido de tick (velocidad basada en el progreso: más rápido al inicio)
            SoundFX.tick(progresoSuave);
            const indTop = document.querySelector('.caja-indicador-top');
            const indBot = document.querySelector('.caja-indicador-bottom');
            if (indTop && indBot) {
                indTop.style.borderTopColor = '#fff';
                indBot.style.borderBottomColor = '#fff';
                setTimeout(() => {
                    indTop.style.borderTopColor = '#f59e0b';
                    indBot.style.borderBottomColor = '#f59e0b';
                }, 60);
            }
        }

        if (progreso < 1) {
            requestAnimationFrame(animar);
        } else {
            // ---- FIX iOS Safari: forzar repintado antes de parar ----
            // Quitar will-change provoca que iOS recomponga la capa
            // con el contenido real (texto + emojis) en vez de negro.
            tira.style.willChange = 'auto';
            // Leer offsetHeight fuerza un reflow sincrónico que obliga
            // a WebKit a renderizar el contenido antes del siguiente frame
            void tira.offsetHeight;

            // Resaltar la tarjeta ganadora
            const items = document.querySelectorAll('.caja-item');
            if (items[winnerPos]) items[winnerPos].classList.add('ganador');

            // Pausa dramática antes de mostrar el resultado
            setTimeout(() => {
                mostrarResultado(retosActivos[winnerRetoIdx]);
                girando = false;
                boton.disabled = false;
            }, 800);
        }
    }

    requestAnimationFrame(animar);
}


// ============================================================
// MOSTRAR RESULTADO
// ============================================================
// Ahora recibe el objeto reto directamente (con ._idx = índice original en RETOS)
// ============================================================
// MOSTRAR RESULTADO — con confirmación ¿puedes hacerlo?
// ============================================================
function mostrarResultado(reto) {
    let retoFinal = { ...reto }; // Copia para no mutar el original en la lista

    if (retoComodin) {
        retoFinal.texto = `[Para ${retoComodin.toUpperCase()}] ${reto.texto}`;
    }

    // Guardar reto pendiente de confirmar (no se marca como usado todavía)
    retoPendienteConfirm = retoFinal;

    document.getElementById('resultado-emoji').textContent = emojiColor(retoFinal.emoji);
    document.getElementById('resultado-texto').textContent = retoFinal.texto;

    // Reseteamos comodín para la próxima vez
    retoComodin = null;

    document.getElementById('resultado-container').classList.add('visible');

    // Panel objeto sagrado
    const panelSagrado = document.getElementById('objeto-sagrado-panel');
    if (panelSagrado) {
        panelSagrado.classList.toggle('visible', !!reto.objetoSagrado);
    }

    // Timer C4 para beber
    const c4Container = document.getElementById('c4-container');
    const c4Btn = document.getElementById('c4-btn');
    const c4Display = document.getElementById('c4-timer-display');
    const c4Time = document.getElementById('c4-time');

    // Timer genérico para retos con tiempo
    const genTimerContainer = document.getElementById('generic-timer-container');
    const genTimerBtn = document.getElementById('generic-timer-btn');
    const genTimerDisplay = document.getElementById('generic-timer-display');
    const genTimerTime = document.getElementById('generic-timer-time');
    const genTimerProg = document.getElementById('timer-circle-prog');

    if (c4Interval) {
        clearInterval(c4Interval);
        c4Interval = null;
    }
    if (genericTimerInterval) {
        clearInterval(genericTimerInterval);
        genericTimerInterval = null;
    }

    if (c4Container) {
        if (reto.beber) {
            c4Container.style.display = 'flex';
            if (c4Btn) c4Btn.style.display = 'block';
            if (c4Display) c4Display.style.display = 'none';
            if (c4Time) {
                c4Time.textContent = '00:30';
                c4Time.classList.remove('danger');
            }
        } else {
            c4Container.style.display = 'none';
        }
    }

    if (genTimerContainer) {
        if (reto.timer && !reto.beber) {
            genericTimerTotal = reto.timer;
            genTimerContainer.style.display = 'flex';
            if (genTimerBtn) genTimerBtn.style.display = 'block';
            if (genTimerDisplay) genTimerDisplay.style.display = 'none';
            if (genTimerTime) {
                genTimerTime.textContent = formatTimerTime(reto.timer);
                genTimerTime.style.color = '#fff';
            }
            if (genTimerProg) {
                genTimerProg.style.strokeDashoffset = '0';
                genTimerProg.style.stroke = '#4a9eca';
            }
        } else {
            genTimerContainer.style.display = 'none';
        }
    }

    // Mostrar botones de confirmación y ocultar botón entendido
    document.getElementById('resultado-confirm-btns').style.display = 'flex';
    document.getElementById('resultado-close').style.display = 'none';

    // Sonido de resultado ganador
    SoundFX.winner();
    lanzarConfetti();
}

// El jugador PUEDE hacer el reto → lanza el modal custom de confirmación
function confirmarRetoPuede() {
    const overlay = document.getElementById('custom-confirm-overlay');
    if (overlay) overlay.classList.add('active');
}

function cancelarRetoPuede() {
    const overlay = document.getElementById('custom-confirm-overlay');
    if (overlay) overlay.classList.remove('active');
}

function ejecutarRetoPuede() {
    cancelarRetoPuede();

    const reto = retoPendienteConfirm;
    if (!reto) return;

    // Marcar como usado en la ronda actual
    if (!retosUsados[rondaActual]) retosUsados[rondaActual] = [];
    retosUsados[rondaActual].push(reto._idx);

    historialRetos.push({ texto: reto.texto, emoji: reto.emoji, color: reto.color, ronda: rondaActual, completado: true });
    guardarEstado();
    actualizarHistorial();
    actualizarRetosRestantes();

    comprobarLogros(reto); // Revisar si desbloqueamos medallas

    // Añadir puntos al CS Rating (entre 200 y 500)
    const puntos = Math.floor(Math.random() * 301) + 200;
    const ratingAnterior = csRating;
    csRating += puntos;
    localStorage.setItem('despedida_david_cs_rating', csRating);
    actualizarRatingUI();
    comprobarRankUp(ratingAnterior, csRating);

    retoPendienteConfirm = null;

    // Si es quiz, abrirlo
    if (reto.quiz) {
        cerrarResultado();
        abrirQuiz();
        return;
    }

    // Cerrar resultado directamente sin pedir confirmación adicional
    cerrarResultado();
}

// El jugador NO puede hacer el reto → vuelve a la ruleta sin marcarlo y tira de nuevo gratis
function confirmarRetoNoPuede() {
    retoPendienteConfirm = null;

    // Ocultar resultado
    document.getElementById('resultado-container').classList.remove('visible');
    document.getElementById('resultado-confirm-btns').style.display = 'none';
    document.getElementById('resultado-close').style.display = 'block';

    // Resetear caja para que esté lista para la animación
    resetCajaDisplay();

    // Esperar un poquito a que se cierre el modal y volver a animar la apertura sin pedir llave
    setTimeout(() => {
        animarAperturaCaja();
    }, 400);
}


// ============================================================
// CERRAR RESULTADO
// ============================================================
function cerrarResultado() {
    document.getElementById('resultado-container').classList.remove('visible');

    if (c4Interval) {
        clearInterval(c4Interval);
        c4Interval = null;
    }

    if (genericTimerInterval) {
        clearInterval(genericTimerInterval);
        genericTimerInterval = null;
    }

    guardarEstado();
    // Restaurar la caja a su estado cerrado
    resetCajaDisplay();
}


// ============================================================
// ANIMACIÓN DE APERTURA DE LA CAJA (antes del giro de la ruleta)
// ============================================================
function animarAperturaCaja() {
    const scene = document.getElementById('case-3d-scene');
    const display = document.getElementById('csgo-case-display');
    const beam = document.getElementById('case-light-beam');
    const rays = document.getElementById('case-rays');
    const flash = document.getElementById('case-flash');
    const instruc = document.getElementById('case-instruction');

    if (!scene) { iniciarAperturaCaja(); return; }

    // Ocultar instrucción
    if (instruc) instruc.style.opacity = '0';

    // ── Fase 1: vibración (0-560ms) ──────────────────────────
    scene.classList.add('case-shaking');
    SoundFX.shake(); // Sonido de rumble

    setTimeout(() => {
        scene.classList.remove('case-shaking');

        // ── Fase 2: abrir tapa + luz (560-1400ms) ────────────
        scene.classList.add('case-opening');
        if (beam) beam.classList.add('active');
        if (rays) rays.classList.add('active');
        SoundFX.whoosh(); // Sonido de whoosh al abrir la tapa

        // ── Fase 3: flash blanco (1100ms) ────────────────────
        setTimeout(() => {
            if (flash) flash.style.opacity = '0.92';
            SoundFX.flash(); // Impacto del flash

            setTimeout(() => {
                if (flash) flash.style.opacity = '0';

                // ── Fase 4: ocultar caja → iniciar ruleta ────
                if (display) display.classList.add('case-hidden');

                iniciarAperturaCaja();
            }, 280);
        }, 540);

    }, 560);
}


// ============================================================
// RESETEAR CAJA (vuelve a estado cerrado tras ver el resultado)
// ============================================================
function resetCajaDisplay() {
    const scene = document.getElementById('case-3d-scene');
    const display = document.getElementById('csgo-case-display');
    const beam = document.getElementById('case-light-beam');
    const rays = document.getElementById('case-rays');
    const instruc = document.getElementById('case-instruction');

    if (!scene || !display) return;

    // Quitar clases de apertura
    scene.classList.remove('case-opening', 'case-shaking');
    if (beam) beam.classList.remove('active');
    if (rays) rays.classList.remove('active');

    // Mostrar la caja de nuevo
    display.classList.remove('case-hidden');
    if (instruc) instruc.style.opacity = '1';
}


// ============================================================
// ACTUALIZAR HISTORIAL
// ============================================================
function actualizarHistorial() {
    const historialDiv = document.getElementById('historial');
    const lista = document.getElementById('historial-lista');
    const resetBtn = document.getElementById('reset-button');

    lista.innerHTML = '';

    if (historialRetos.length === 0) {
        historialDiv.classList.remove('visible');
        resetBtn.style.display = 'none';
        return;
    }

    historialDiv.classList.add('visible');
    resetBtn.style.display = 'inline-flex';

    historialRetos.forEach((entry, i) => {
        // Compatibilidad con formato antiguo (string) y nuevo (objeto)
        const texto = typeof entry === 'string' ? entry : entry.texto;
        const emoji = typeof entry === 'string' ? '🎯' : (entry.emoji || '🎯');
        const color = typeof entry === 'string' ? '#f59e0b' : (entry.color || '#f59e0b');

        const li = document.createElement('li');
        li.className = 'historial-item';
        li.style.setProperty('--item-color', color);
        li.innerHTML = `
            <span class="historial-numero">${i + 1}</span>
            <span class="historial-emoji">${emojiColor(emoji)}</span>
            <span class="historial-text">${texto}</span>
            <span class="historial-check">✓</span>
        `;
        lista.appendChild(li);
    });
}


// ============================================================
// REINICIAR RULETA
// ============================================================
function reiniciarRuleta() {
    if (!confirm('¿Seguro que quieres reiniciar la caja y borrar el historial? 🔄')) return;

    // Preguntar también si se quieren resetear las llaves
    const resetLlaves = confirm('¿Resetear también los códigos de llave? (Si dices NO, los códigos ya usados seguirán sin funcionar) 🔑');

    historialRetos = [];
    retosUsados = {};
    rondaActual = null;
    localStorage.removeItem('despedida_david_ronda');
    localStorage.removeItem('despedida_david_logros');
    borrarEstado(resetLlaves);

    csRating = 4999;
    actualizarRatingUI();

    if (resetLlaves) {
        llavesUsadas = [];
    }

    logrosDesbloqueados = [];
    document.querySelectorAll('.medalla').forEach(m => m.classList.remove('unlocked'));

    actualizarHistorial();
    actualizarRetosRestantes();

    // Limpiar la tira y resetear su posición
    const tira = document.getElementById('caja-tira');
    if (tira) {
        tira.innerHTML = '';
        tira.style.transform = 'translateX(0px)';
    }

    // Rehabilitar botón girar por si estaba deshabilitado
    const spinBtn = document.getElementById('spin-button');
    spinBtn.disabled = false;
    spinBtn.title = '';

    // Resetear también la caja visual
    resetCajaDisplay();
}


// ============================================================
// CUENTA ATRÁS HASTA LA BODA
// ============================================================
function actualizarCuentaAtras() {
    // Fecha de la boda: 13 de Junio de 2026
    const fechaBoda = new Date('2026-06-13T12:00:00');
    const ahora = new Date();
    const diferencia = fechaBoda - ahora;

    if (diferencia <= 0) {
        document.getElementById('countdown-days').textContent = '🎉';
        document.getElementById('countdown-hours').textContent = '¡YA!';
        document.getElementById('countdown-minutes').textContent = '🎉';
        document.getElementById('countdown-seconds').textContent = '🎉';
        return;
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = String(dias).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(horas).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutos).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(segundos).padStart(2, '0');
}


// ============================================================
// PARTÍCULAS DE FONDO
// ============================================================
function crearParticulas() {
    const container = document.getElementById('particles-container');
    const colores = ['#f59e0b', '#e11d48', '#22d3ee', '#a855f7', '#34d399', '#f472b6'];
    const numParticulas = 40;

    for (let i = 0; i < numParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particle';

        const tamano = Math.random() * 6 + 2;
        const color = colores[Math.floor(Math.random() * colores.length)];
        const left = Math.random() * 100;
        const duracion = Math.random() * 15 + 10;
        const delay = Math.random() * 15;
        const opacidad = Math.random() * 0.4 + 0.1;

        particula.style.cssText = `
            width: ${tamano}px;
            height: ${tamano}px;
            background: ${color};
            left: ${left}%;
            animation-duration: ${duracion}s;
            animation-delay: -${delay}s;
            opacity: ${opacidad};
            box-shadow: 0 0 ${tamano * 2}px ${color};
        `;

        container.appendChild(particula);
    }
}


// ============================================================
// CONFETTI 🎉
// ============================================================
function lanzarConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettis = [];
    const colores = ['#f59e0b', '#e11d48', '#22d3ee', '#a855f7', '#34d399', '#f472b6', '#ffffff'];
    const numConfetti = 150;

    for (let i = 0; i < numConfetti; i++) {
        confettis.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colores[Math.floor(Math.random() * colores.length)],
            velocidadY: Math.random() * 3 + 2,
            velocidadX: Math.random() * 4 - 2,
            rotacion: Math.random() * 360,
            rotacionVel: Math.random() * 10 - 5,
            opacidad: 1,
        });
    }

    let frame = 0;
    const maxFrames = 180; // ~3 segundos a 60fps

    function animarConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        frame++;

        confettis.forEach(c => {
            c.y += c.velocidadY;
            c.x += c.velocidadX;
            c.rotacion += c.rotacionVel;

            if (frame > maxFrames - 60) {
                c.opacidad -= 0.016;
            }

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate((c.rotacion * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, c.opacidad);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            ctx.restore();
        });

        if (frame < maxFrames) {
            requestAnimationFrame(animarConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animarConfetti();
}


// ============================================================
// PREGUNTAS DEL QUIZ DE CULTURA GENERAL
// ============================================================
// 🎯 Edita aquí las preguntas, opciones y la respuesta correcta.
// "correcta" es el índice (0=A, 1=B, 2=C, 3=D) de la opción correcta.

const PREGUNTAS_QUIZ = [
    {
        pregunta: "¿Cuál es la capital de España?",
        opciones: ["Barcelona", "Madrid", "Sevilla", "Valencia"],
        correcta: 1
    },
    {
        pregunta: "¿Cuántas comunidades autónomas tiene España?",
        opciones: ["15", "16", "17", "19"],
        correcta: 2
    },
    {
        pregunta: "¿En qué año ganó España su primera Copa del Mundo de fútbol?",
        opciones: ["2006", "2008", "2010", "2012"],
        correcta: 2
    },
    {
        pregunta: "¿Cómo se llama el rey actual de España?",
        opciones: ["Juan Carlos I", "Carlos III", "Felipe VI", "Fernando VII"],
        correcta: 2
    },
    {
        pregunta: "¿Cuál es el río más largo que discurre íntegramente por territorio español?",
        opciones: ["Tajo", "Duero", "Guadalquivir", "Ebro"],
        correcta: 3
    }
];


// ============================================================
// QUIZ — VARIABLES Y LÓGICA
// ============================================================
let respuestasUsuario = [];
let quizResuelto = false;

function abrirQuiz() {
    quizResuelto = false;
    respuestasUsuario = new Array(PREGUNTAS_QUIZ.length).fill(null);
    renderizarQuiz();
    document.getElementById('quiz-container').classList.add('visible');
}

function cerrarQuiz() {
    document.getElementById('quiz-container').classList.remove('visible');
}

function renderizarQuiz() {
    const letras = ['A', 'B', 'C', 'D'];
    const container = document.getElementById('quiz-preguntas');
    const resultado = document.getElementById('quiz-resultado');
    container.innerHTML = '';
    resultado.innerHTML = '';
    resultado.classList.remove('visible');

    PREGUNTAS_QUIZ.forEach((q, qi) => {
        const div = document.createElement('div');
        div.className = 'quiz-pregunta';
        div.innerHTML = `
            <div class="quiz-pregunta-header">
                <span class="quiz-pregunta-numero">Pregunta ${qi + 1}</span>
                <span class="quiz-pregunta-icon">🇪🇸</span>
            </div>
            <p class="quiz-pregunta-texto">${q.pregunta}</p>
            <div class="quiz-opciones">
                ${q.opciones.map((op, oi) => `
                    <button class="quiz-opcion" data-q="${qi}" data-o="${oi}"
                            onclick="seleccionarOpcion(${qi}, ${oi})">
                        <span class="quiz-opcion-letra">${letras[oi]}</span>
                        <span class="quiz-opcion-texto">${op}</span>
                    </button>
                `).join('')}
            </div>
        `;
        container.appendChild(div);
    });

    // Botón comprobar
    const btnComprobar = document.createElement('button');
    btnComprobar.className = 'quiz-resultado-btn';
    btnComprobar.id = 'quiz-btn-comprobar';
    btnComprobar.style.cssText = 'margin-top:1.5rem;display:block;width:100%;font-size:1.05rem;';
    btnComprobar.textContent = '✅ Comprobar respuestas';
    btnComprobar.onclick = comprobarQuiz;
    container.appendChild(btnComprobar);

    // Botón cerrar
    const btnCerrar = document.createElement('button');
    btnCerrar.className = 'quiz-resultado-btn';
    btnCerrar.style.cssText = 'margin-top:0.8rem;display:block;width:100%;background:rgba(255,255,255,0.08);color:#f8fafc;box-shadow:none;font-size:1rem;';
    btnCerrar.textContent = '✖ Cerrar quiz';
    btnCerrar.onclick = cerrarQuiz;
    container.appendChild(btnCerrar);
}

function seleccionarOpcion(qi, oi) {
    if (quizResuelto) return;
    respuestasUsuario[qi] = oi;
    const botones = document.querySelectorAll(`.quiz-opcion[data-q="${qi}"]`);
    botones.forEach(btn => btn.classList.remove('quiz-opcion-seleccionada'));
    document.querySelector(`.quiz-opcion[data-q="${qi}"][data-o="${oi}"]`).classList.add('quiz-opcion-seleccionada');
}

function comprobarQuiz() {
    if (respuestasUsuario.some(r => r === null)) {
        alert('¡Responde todas las preguntas primero! 😤');
        return;
    }
    quizResuelto = true;
    let aciertos = 0;

    PREGUNTAS_QUIZ.forEach((q, qi) => {
        const botones = document.querySelectorAll(`.quiz-opcion[data-q="${qi}"]`);
        botones.forEach(btn => btn.disabled = true);

        const usuario = respuestasUsuario[qi];
        const correcta = q.correcta;

        botones.forEach((btn, oi) => {
            btn.classList.remove('quiz-opcion-seleccionada');
            if (oi === correcta) {
                btn.classList.add('quiz-opcion-correcta');
            } else if (oi === usuario && usuario !== correcta) {
                btn.classList.add('quiz-opcion-incorrecta');
            } else {
                btn.classList.add('quiz-opcion-disabled');
            }
        });

        if (usuario === correcta) aciertos++;
    });

    // Ocultar botón comprobar
    document.getElementById('quiz-btn-comprobar').style.display = 'none';

    // Mostrar resultado
    let emoji, puntuacion, mensaje;
    if (aciertos === 5) {
        emoji = '🏆'; puntuacion = '5/5';
        mensaje = '¡PERFECTO! David sabe lo que se hace. ¡Increíble! 🎉';
    } else if (aciertos >= 3) {
        emoji = '😅'; puntuacion = `${aciertos}/5`;
        mensaje = 'Aprobado, pero raspando... Al menos no es un desastre total 😬';
    } else {
        emoji = '😂'; puntuacion = `${aciertos}/5`;
        mensaje = `¡SUSPENSO TOTAL! Solo ${aciertos}/5. ¡CHUPITO OBLIGATORIO! 🥃`;
        lanzarConfetti();
    }

    const resultado = document.getElementById('quiz-resultado');
    resultado.innerHTML = `
        <div class="quiz-resultado-card">
            <div class="quiz-resultado-emoji">${emoji}</div>
            <div class="quiz-resultado-puntuacion">${puntuacion}</div>
            <p class="quiz-resultado-mensaje">${mensaje}</p>
            <button class="quiz-resultado-btn" onclick="abrirQuiz()">🔄 Repetir Quiz</button>
            <button class="quiz-resultado-btn" style="margin-top:0.6rem;background:rgba(255,255,255,0.08);color:#f8fafc;box-shadow:none;" onclick="cerrarQuiz()">✖ Cerrar</button>
        </div>
    `;
    resultado.classList.add('visible');
}


// ============================================================
// SMOOTH SCROLL para el CTA
// ============================================================
document.getElementById('cta-start').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('ruleta-section').scrollIntoView({ behavior: 'smooth' });
});


// ============================================================
// CERRAR RESULTADO CON ESCAPE
// ============================================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        cerrarResultado();
    }
});


// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    // Cargar estado guardado desde localStorage
    cargarEstado();

    crearParticulas();
    actualizarCuentaAtras();
    setInterval(actualizarCuentaAtras, 1000);

    // Si había historial guardado, mostrarlo
    if (historialRetos.length > 0) {
        actualizarHistorial();
    }

    actualizarCuentaAtras();
    setInterval(actualizarCuentaAtras, 1000);

    // Crear partículas de fondo
    crearParticulas();

    // Inicializar medallas
    inicializarLogros();
});

// ============================================================
// SISTEMA DE LOGROS (MEDALLAS CS2)
// ============================================================
let logrosDesbloqueados = JSON.parse(localStorage.getItem('despedida_david_logros')) || [];

function inicializarLogros() {
    logrosDesbloqueados.forEach(id => {
        const el = document.getElementById(`medalla-${id}`);
        if (el) el.classList.add('unlocked');
    });
}

function desbloquearLogro(id) {
    if (!logrosDesbloqueados.includes(id)) {
        logrosDesbloqueados.push(id);
        localStorage.setItem('despedida_david_logros', JSON.stringify(logrosDesbloqueados));

        const el = document.getElementById(`medalla-${id}`);
        if (el) {
            el.classList.add('unlocked');
            // Efecto visual/sonoro
            SoundFX.confetti();
            setTimeout(() => alert(`🎖️ ¡HAS DESBLOQUEADO UNA NUEVA MEDALLA DE SERVICIO! 🎖️`), 500);
        }
    }
}

function comprobarLogros(retoRecienCompletado) {
    // Logro 1: Calentando Motores (5 retos en total)
    if (historialRetos.length >= 5) {
        desbloquearLogro(1);
    }

    // Logro 2: El Portador (reto con objetoSagrado)
    if (retoRecienCompletado && retoRecienCompletado.objetoSagrado) {
        desbloquearLogro(2);
    }

    // Logro 3: Superviviente (terminar ronda 3)
    if (rondaActual === 'ronda3') {
        const activosRonda3 = getRetosActivos();
        if (activosRonda3.length === 0) {
            desbloquearLogro(3);
        }
    }
}

// ============================================================
// CS PREMIER RATING LOGIC
// ============================================================
function getRatingColor(rating) {
    if (rating < 5000) return '#b0c3d9'; // Gris
    if (rating < 7500) return '#5e98d9'; // Azul claro
    if (rating < 9000) return '#4b69ff'; // Azul oscuro
    if (rating < 11000) return '#8847ff'; // Morado
    if (rating < 15000) return '#d32ce6'; // Fucsia
    if (rating < 20000) return '#eb4b4b'; // Rojo
    return '#e4ae39'; // Dorado (Global Elite)
}

function formatRating(rating) {
    return rating.toLocaleString('en-US');
}

function actualizarRatingUI() {
    const scores = document.querySelectorAll('.cs-premier-score');
    const badges = document.querySelectorAll('.cs-premier-badge');
    const color = getRatingColor(csRating);

    scores.forEach(el => {
        el.textContent = formatRating(csRating);
        el.style.color = color;
        el.style.textShadow = `0 0 10px ${color}66`;
    });

    badges.forEach(el => {
        el.style.borderColor = color;
        el.style.boxShadow = `0 0 15px ${color}33`;
    });
}

function comprobarRankUp(oldRating, newRating) {
    const umbrales = [5000, 7500, 9000, 11000, 15000, 20000];

    for (let u of umbrales) {
        if (oldRating < u && newRating >= u) {
            mostrarRankUp(newRating);
            return;
        }
    }
}

function mostrarRankUp(rating) {
    const overlay = document.getElementById('rank-up-overlay');
    const badge = document.getElementById('rank-up-badge');
    const scoreAnim = document.getElementById('rank-up-score-anim');
    const color = getRatingColor(rating);

    if (scoreAnim) {
        scoreAnim.textContent = formatRating(rating);
        scoreAnim.style.color = color;
        scoreAnim.style.textShadow = `0 0 30px ${color}99`;
    }
    if (badge) {
        badge.style.borderTopColor = color;
        badge.style.borderBottomColor = color;
        badge.style.boxShadow = `inset 0 0 40px ${color}33, 0 0 80px ${color}66`;
    }

    if (overlay) overlay.classList.add('active');

    SoundFX.winner();
    setTimeout(() => lanzarConfetti(), 300);
}

function cerrarRankUp() {
    const overlay = document.getElementById('rank-up-overlay');
    if (overlay) overlay.classList.remove('active');
}

// ============================================================
// C4 TIMER LOGIC
// ============================================================
let c4Interval = null;

function iniciarC4() {
    const c4Btn = document.getElementById('c4-btn');
    const c4Display = document.getElementById('c4-timer-display');
    const c4Time = document.getElementById('c4-time');

    if (c4Btn) c4Btn.style.display = 'none';
    if (c4Display) c4Display.style.display = 'block';

    SoundFX.bombaPlanted();

    let timeLeft = 30;

    if (c4Interval) clearInterval(c4Interval);

    c4Interval = setInterval(() => {
        timeLeft--;

        // Formatear a 00:XX
        const secs = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
        if (c4Time) c4Time.textContent = `00:${secs}`;

        if (timeLeft <= 10 && timeLeft > 0) {
            if (c4Time) c4Time.classList.add('danger');
            SoundFX.bombaTick(true);
        } else if (timeLeft > 10) {
            SoundFX.bombaTick(false);
        }

        if (timeLeft <= 0) {
            clearInterval(c4Interval);
            c4Interval = null;
            SoundFX.bombaExplosion();

            // Flash screen effect
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.inset = '0';
            overlay.style.backgroundColor = 'white';
            overlay.style.zIndex = '10000';
            overlay.style.transition = 'opacity 1s ease-out';
            document.body.appendChild(overlay);

            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 1000);
            }, 100);
        }
    }, 1000);
}

// ============================================================
// GENERIC TIMER LOGIC
// ============================================================
let genericTimerInterval = null;
let genericTimerTotal = 0;

function formatTimerTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

function iniciarGenericTimer() {
    const btn = document.getElementById('generic-timer-btn');
    const display = document.getElementById('generic-timer-display');
    const timeEl = document.getElementById('generic-timer-time');
    const prog = document.getElementById('timer-circle-prog');

    if (btn) btn.style.display = 'none';
    if (display) display.style.display = 'flex';

    let timeLeft = genericTimerTotal;

    if (genericTimerInterval) clearInterval(genericTimerInterval);

    genericTimerInterval = setInterval(() => {
        timeLeft--;
        if (timeEl) timeEl.textContent = formatTimerTime(timeLeft);

        // Update circle
        if (prog) {
            const pct = timeLeft / genericTimerTotal;
            const offset = 283 - (pct * 283);
            prog.style.strokeDashoffset = offset;

            if (pct <= 0.2) {
                prog.style.stroke = '#eb4b4b'; // rojo al 20%
                if (timeEl) timeEl.style.color = '#eb4b4b';
            }
        }

        if (timeLeft <= 0) {
            clearInterval(genericTimerInterval);
            genericTimerInterval = null;
            SoundFX.winner(); // Sonido de victoria al terminar
        }
    }, 1000);
}

// ============================================================
// ÁLBUM DE FOTOS (CÁMARAS DE SEGURIDAD)
// ============================================================
function abrirAlbumFotos() {
    const googlePhotosUrl = 'https://photos.app.goo.gl/Su3nAoYoZ5fnXV926';
    window.open(googlePhotosUrl, '_blank');
}
