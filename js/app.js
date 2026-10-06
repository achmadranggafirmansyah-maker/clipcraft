/* =========================================================
   ClipCraft — Client-side video editor (v2)
   Fix: video frame rendering, cinematic feel, smoother anim
   ========================================================= */

/* ---------- KONFIGURASI GAYA EDITING ---------- */
const STYLES = [
  {
    id: 'vlog',
    name: 'Vlog Harian',
    emoji: '🌤️',
    desc: 'Hangat, cerah, casual',
    swatch: 'linear-gradient(135deg,#ffb26b,#ff5fa2)',
    filter: 'saturate(1.18) brightness(1.06) contrast(1.06)',
    overlay: 'linear-gradient(160deg, rgba(255,180,120,0.16), rgba(255,120,180,0.10))',
    tint: '#ffb078',
    font: "'Plus Jakarta Sans', sans-serif",
    textColor: '#ffffff',
    weight: '800',
    emojis: ['✨','🌤️','💛','🌸','☕','🌴'],
    textPos: 'bottom',
    accent: '#ffb078'
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic Minimal',
    emoji: '🤍',
    desc: 'Lembut, clean, elegan',
    swatch: 'linear-gradient(135deg,#e8e6ff,#a78bfa)',
    filter: 'saturate(0.92) brightness(1.07) contrast(1.05)',
    overlay: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(200,200,255,0.09))',
    tint: '#e8e6ff',
    font: "'Playfair Display', serif",
    textColor: '#ffffff',
    weight: '700',
    emojis: ['🤍','🕊️','🌿','✨','🫧'],
    textPos: 'center',
    accent: '#e8e6ff'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    emoji: '🎬',
    desc: 'Gelap, dramatis, film-like',
    swatch: 'linear-gradient(135deg,#0f172a,#0891b2)',
    filter: 'contrast(1.22) saturate(0.95) brightness(0.95)',
    overlay: 'linear-gradient(180deg, rgba(10,20,40,0.22), rgba(20,10,40,0.28))',
    tint: '#7dd3fc',
    font: "'Space Grotesk', sans-serif",
    textColor: '#ffffff',
    weight: '700',
    emojis: ['🎬','🎞️','⭐','🌌'],
    textPos: 'bottom',
    accent: '#7dd3fc',
    letterbox: true
  },
  {
    id: 'pop',
    name: 'Pop Ceria',
    emoji: '🌈',
    desc: 'Ngejreng, playful, energik',
    swatch: 'linear-gradient(135deg,#ff4d9e,#38bdf8)',
    filter: 'saturate(1.45) contrast(1.1) brightness(1.05)',
    overlay: 'linear-gradient(135deg, rgba(255,0,150,0.10), rgba(0,200,255,0.10))',
    tint: '#ff4d9e',
    font: "'Plus Jakarta Sans', sans-serif",
    textColor: '#ffffff',
    weight: '800',
    emojis: ['🌈','💖','🎉','🔥','⭐','🍭','💫'],
    textPos: 'top',
    accent: '#ff4d9e'
  },
  {
    id: 'retro',
    name: 'Retro Vintage',
    emoji: '📼',
    desc: 'Faded, nostaljik, film jadul',
    swatch: 'linear-gradient(135deg,#ffb347,#c2410c)',
    filter: 'sepia(0.32) saturate(1.2) contrast(1.06) brightness(1.04)',
    overlay: 'linear-gradient(180deg, rgba(255,200,120,0.14), rgba(180,90,40,0.14))',
    tint: '#ffb347',
    font: "'Caveat', cursive",
    textColor: '#fff8e7',
    weight: '700',
    emojis: ['📼','🌻','☀️','🍂','🎞️'],
    textPos: 'bottom',
    accent: '#ffb347'
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    emoji: '🌌',
    desc: 'Cyberpunk, terang, futuristik',
    swatch: 'linear-gradient(135deg,#b026ff,#00eaff)',
    filter: 'saturate(1.3) contrast(1.25) hue-rotate(-6deg)',
    overlay: 'linear-gradient(135deg, rgba(120,0,255,0.15), rgba(0,220,255,0.13))',
    tint: '#b026ff',
    font: "'Space Grotesk', sans-serif",
    textColor: '#ffffff',
    weight: '700',
    emojis: ['🌌','⚡','💜','🛸','✨','🔮'],
    textPos: 'center',
    accent: '#b026ff'
  }
];

const RATIOS = [
  { id: '9:16', label: '9:16  TikTok/Reels', value: [9, 16] },
  { id: '1:1',  label: '1:1  Feed IG',       value: [1, 1] },
  { id: '4:5',  label: '4:5  IG Portrait',   value: [4, 5] },
  { id: '16:9', label: '16:9  YouTube',      value: [16, 9] }
];

const RESOLUTIONS = [
  { id: '720p',  label: '720p HD',   short: 720 },
  { id: '1080p', label: '1080p FHD', short: 1080 },
  { id: '4k',    label: '4K UHD',    short: 2160 }
];

const MAX_DURATION = 5 * 60;

/* ---------- STATE ---------- */
const state = {
  file: null,
  videoURL: null,
  videoDuration: 0,
  brief: '',
  styleId: 'vlog',
  ratioId: '9:16',
  resId: '1080p'
};

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const viewEditor  = $('viewEditor');
const viewLoading = $('viewLoading');
const viewPreview = $('viewPreview');
const dropZone    = $('dropZone');
const videoInput  = $('videoInput');
const fileMeta    = $('fileMeta');
const previewThumb= $('previewThumb');
const removeFile  = $('removeFile');
const briefInput  = $('briefInput');
const briefCount  = $('briefCount');
const styleGrid   = $('styleGrid');
const ratioChips  = $('ratioChips');
const resChips    = $('resChips');
const processBtn  = $('processBtn');
const progressBar = $('progressBar');
const progressPct = $('progressPct');
const loadingTitle= $('loadingTitle');
const loadingSub  = $('loadingSub');
const resultVideo = $('resultVideo');
const downloadBtn = $('downloadBtn');
const againBtn    = $('againBtn');
const workVideo   = $('workVideo');
const workCanvas  = $('workCanvas');
const toastEl     = $('toast');

/* ---------- TOAST ---------- */
let toastTimer;
function toast(msg, ms = 3200) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
}

/* ---------- UI RENDER ---------- */
function renderStyles() {
  styleGrid.innerHTML = STYLES.map(s => `
    <button type="button" class="style-card ${s.id === state.styleId ? 'active' : ''}" data-style="${s.id}">
      <div class="style-thumb" style="--swatch:${s.swatch}">
        <span class="style-check">✓</span>
        <span class="style-emoji">${s.emoji}</span>
      </div>
      <div class="style-body">
        <div class="style-name">${s.name}</div>
        <div class="style-desc">${s.desc}</div>
      </div>
    </button>
  `).join('');

  styleGrid.querySelectorAll('.style-card').forEach(el => {
    el.addEventListener('click', () => {
      state.styleId = el.dataset.style;
      styleGrid.querySelectorAll('.style-card').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
    });
  });
}

function renderChips(container, items, activeId, onPick) {
  container.innerHTML = items.map(it =>
    `<button type="button" class="chip ${it.id === activeId ? 'active' : ''}" data-id="${it.id}">${it.label}</button>`
  ).join('');
  container.querySelectorAll('.chip').forEach(el => {
    el.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      onPick(el.dataset.id);
    });
  });
}

function renderFormat() {
  renderChips(ratioChips, RATIOS, state.ratioId, id => state.ratioId = id);
  renderChips(resChips, RESOLUTIONS, state.resId, id => state.resId = id);
}

/* ---------- UPLOAD ---------- */
function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    toast('❌ File harus berupa video (MP4/MOV/WebM).');
    return;
  }
  if (state.videoURL) URL.revokeObjectURL(state.videoURL);
  state.file = file;
  state.videoURL = URL.createObjectURL(file);

  previewThumb.src = state.videoURL;
  previewThumb.load();

  previewThumb.onloadedmetadata = () => {
    const dur = previewThumb.duration || 0;
    state.videoDuration = dur;
    if (dur > MAX_DURATION) {
      toast(`⚠️ Durasi ${formatTime(dur)} melebihi batas 5 menit.`);
      resetFile();
      return;
    }
    $('fileName').textContent = file.name;
    $('fileSize').textContent = humanSize(file.size);
    $('fileDur').textContent = '⏱ ' + formatTime(dur);
    fileMeta.classList.remove('hidden');
    dropZone.classList.add('hidden');
    updateProcessBtn();
  };

  previewThumb.onerror = () => {
    toast('❌ Video tidak bisa dibaca browser ini.');
    resetFile();
  };
}

function resetFile() {
  state.file = null;
  state.videoDuration = 0;
  if (state.videoURL) { URL.revokeObjectURL(state.videoURL); state.videoURL = null; }
  previewThumb.removeAttribute('src');
  previewThumb.load();
  videoInput.value = '';
  fileMeta.classList.add('hidden');
  dropZone.classList.remove('hidden');
  updateProcessBtn();
}

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag');
  handleFile(e.dataTransfer.files[0]);
});
videoInput.addEventListener('change', e => handleFile(e.target.files[0]));
removeFile.addEventListener('click', resetFile);

/* ---------- BRIEF ---------- */
briefInput.addEventListener('input', () => {
  briefCount.textContent = briefInput.value.length;
  state.brief = briefInput.value.trim();
});
function updateProcessBtn() { processBtn.disabled = !state.file; }

/* ---------- HELPERS ---------- */
function humanSize(b) {
  if (b > 1024 * 1024) return (b / (1024 * 1024)).toFixed(1) + ' MB';
  if (b > 1024) return (b / 1024).toFixed(0) + ' KB';
  return b + ' B';
}
function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
function easeOutQuint(x) { return 1 - Math.pow(1 - x, 5); }
function easeInOutCubic(x) { return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2; }

/* ---------- CANVAS SIZE ---------- */
function getCanvasSize() {
  const ratio = RATIOS.find(r => r.id === state.ratioId).value;
  const targetShort = RESOLUTIONS.find(r => r.id === state.resId).short;
  const [rw, rh] = ratio;
  let w, h;
  if (rw >= rh) { h = targetShort; w = Math.round(targetShort * (rw / rh)); }
  else          { w = targetShort; h = Math.round(targetShort * (rh / rw)); }
  w = Math.floor(w / 2) * 2;
  h = Math.floor(h / 2) * 2;
  return { w, h };
}

function drawCover(ctx, video, w, h) {
  const vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !vh) return false;
  const vr = vw / vh, cr = w / h;
  let dw, dh, dx, dy;
  if (vr > cr) { dh = h; dw = h * vr; dx = (w - dw) / 2; dy = 0; }
  else         { dw = w; dh = w / vr; dx = 0; dy = (h - dh) / 2; }
  ctx.drawImage(video, dx, dy, dw, dh);
  return true;
}

/* ---------- CAPTION SEGMENTS ---------- */
function getCaptionSegments() {
  const brief = (state.brief || '').trim();
  if (!brief) {
    const style = STYLES.find(s => s.id === state.styleId);
    return [style.name, 'Edited with ClipCraft ✨'];
  }
  const parts = brief
    .split(/\n+|[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 1);
  return parts.length ? parts.slice(0, 10) : [brief];
}

/* =========================================================
   FRAME RENDERER v2
   ========================================================= */
function drawFrame(ctx, video, t, w, h) {
  const style = STYLES.find(s => s.id === state.styleId);
  const dur = state.videoDuration || 1;
  const progress = clamp(t / dur, 0, 1);

  // -------- 1. VIDEO dengan Ken Burns (zoom + pan halus) --------
  const zoom = 1.0 + progress * 0.08;            // zoom in 8% sepanjang video
  const panX = Math.sin(t * 0.25) * w * 0.012;   // drift horizontal halus
  const panY = Math.cos(t * 0.19) * h * 0.010;   // drift vertical halus

  ctx.save();
  ctx.translate(w / 2 + panX, h / 2 + panY);
  ctx.scale(zoom, zoom);
  ctx.translate(-w / 2, -h / 2);

  // Filter warna (kalau browser support ctx.filter)
  const supportsFilter = typeof ctx.filter === 'string';
  if (supportsFilter) ctx.filter = style.filter;
  const ok = drawCover(ctx, video, w, h);
  if (supportsFilter) ctx.filter = 'none';
  ctx.restore();

  // Kalau video frame belum ready, jangan lanjut render overlay
  // supaya nggak muncul frame kosong di output
  if (!ok) {
    ctx.fillStyle = '#0b0820';
    ctx.fillRect(0, 0, w, h);
    return;
  }

  // -------- 2. COLOR GRADING (split-tone overlay) --------
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = style.overlay;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // -------- 3. VIGNETTE LEMBUT --------
  const vg = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.42,
    w / 2, h / 2, Math.max(w, h) * 0.85
  );
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  // -------- 4. LETTERBOX (cinematic only) --------
  if (style.letterbox) {
    const bar = h * 0.07;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, bar);
    ctx.fillRect(0, h - bar, w, bar);
  }

  // -------- 5. LIGHT LEAK HALUS --------
  const leakX = ((t * 0.09) % 1.4 - 0.2) * w;
  const leak = ctx.createRadialGradient(leakX, h * 0.28, 0, leakX, h * 0.28, w * 0.55);
  leak.addColorStop(0, hexA(style.accent, 0.10));
  leak.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = leak;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();

  // -------- 6. EMOJI (pattern burst — bukan random scatter) --------
  drawEmojis(ctx, t, w, h, style);

  // -------- 7. INTRO & OUTRO CARD --------
  drawIntroOutro(ctx, t, w, h, dur, style);

  // -------- 8. CAPTIONS --------
  drawCaptions(ctx, t, w, h, style);

  // -------- 9. ACCENT PROGRESS BAR --------
  const barH = Math.max(3, h * 0.0045);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, '#ff5fa2');
  g.addColorStop(0.5, '#a78bfa');
  g.addColorStop(1, '#38bdf8');
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.fillRect(0, h - barH, w, barH);
  ctx.fillStyle = g;
  ctx.fillRect(0, h - barH, w * progress, barH);
}

/* ---------- EMOJI ---------- */
function drawEmojis(ctx, t, w, h, style) {
  const emojis = style.emojis;
  const count = Math.min(6, emojis.length);
  const size = Math.min(w, h) * 0.07;
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < count; i++) {
    const speed = 0.045 + (i % 3) * 0.014;
    const seed = i * 0.173;
    const prog = ((t * speed + seed) % 1);

    // Naik dari bawah ke atas dengan fade in/out di ujung
    const y = h * (1.14 - prog * 1.28);
    // Horizontal drift pakai sine biar kerasa "mengambang"
    const x = w * (0.14 + ((i * 0.16) % 0.72)) + Math.sin(t * 0.9 + i * 1.7) * w * 0.035;
    // Alpha: fade in cepat di awal, fade out halus di akhir
    const alpha = easeInOutCubic(Math.sin(prog * Math.PI)) * 0.9;
    // Rotasi halus
    const rot = Math.sin(t * 1.4 + i * 2.1) * 0.18;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = size * 0.35;
    ctx.shadowOffsetY = size * 0.08;
    ctx.fillText(emojis[i % emojis.length], 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

/* ---------- INTRO & OUTRO ---------- */
function drawIntroOutro(ctx, t, w, h, dur, style) {
  const CARD = 1.6; // durasi intro/outro (detik)

  // Intro (0..1.6s)
  if (t < CARD) {
    const p = t / CARD;
    const alpha = p < 0.35 ? easeOutCubic(p / 0.35)
                : p > 0.7  ? 1 - easeOutCubic((p - 0.7) / 0.3)
                : 1;
    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, w, h);

    // Emoji besar
    const emSize = Math.min(w, h) * 0.14;
    ctx.font = `${emSize}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', w / 2, h * 0.42);

    // Brand
    const brandSize = Math.min(w, h) * 0.075;
    ctx.font = `800 ${brandSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 30;
    ctx.fillText('ClipCraft', w / 2, h * 0.52);
    ctx.font = `500 ${brandSize * 0.42}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.shadowBlur = 0;
    ctx.fillText('aesthetic video editor', w / 2, h * 0.57);
    ctx.restore();
  }

  // Outro (dur-1.6 .. dur)
  const outroStart = dur - CARD;
  if (t > outroStart && dur > CARD * 2.2) {
    const p = (t - outroStart) / CARD;
    const alpha = p < 0.35 ? easeOutCubic(p / 0.35)
                : p > 0.75 ? 1 - easeOutCubic((p - 0.75) / 0.25)
                : 1;
    ctx.save();
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, w, h);

    const textSize = Math.min(w, h) * 0.075;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${textSize}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    ctx.fillText('💖', w / 2, h * 0.45);

    ctx.font = `800 ${textSize * 0.85}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 30;
    ctx.fillText('Thanks for watching', w / 2, h * 0.55);
    ctx.restore();
  }
}

/* ---------- CAPTIONS v2 ---------- */
function drawCaptions(ctx, t, w, h, style) {
  const dur = state.videoDuration || 1;
  const CARD = 1.6;

  // Skip caption saat intro/outro biar nggak tabrakan
  if (t < CARD || t > dur - CARD) return;

  const segs = getCaptionSegments();
  if (!segs.length) return;

  const usableDur = dur - CARD * 2;
  const per = usableDur / segs.length;
  const localT = t - CARD;
  const idx = clamp(Math.floor(localT / per), 0, segs.length - 1);
  const prog = clamp((localT - idx * per) / per, 0, 1);
  const text = segs[idx];
  if (!text) return;

  // ---- Animasi masuk / keluar yang lebih halus ----
  const IN = 0.18;   // 18% pertama = masuk
  const OUT = 0.14;  // 14% terakhir = keluar
  let alpha, slide, scale;

  if (prog < IN) {
    const p = easeOutQuint(prog / IN);
    alpha = p;
    slide = (1 - p) * Math.min(w, h) * 0.045;
    scale = 0.94 + p * 0.06;
  } else if (prog > 1 - OUT) {
    const p = easeOutCubic((prog - (1 - OUT)) / OUT);
    alpha = 1 - p;
    slide = -p * Math.min(w, h) * 0.03;
    scale = 1 - p * 0.04;
  } else {
    alpha = 1;
    slide = 0;
    scale = 1;
  }

  const fontSize = clamp(Math.min(w, h) * 0.056, 22, 96);
  const lineH = fontSize * 1.22;
  const maxWidth = w * 0.84;

  ctx.save();
  ctx.font = `${style.weight} ${fontSize}px ${style.font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Word wrap
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);

  const shownLines = lines.slice(0, 4);
  const totalH = shownLines.length * lineH;

  let baseY;
  if (style.textPos === 'top')         baseY = h * 0.20;
  else if (style.textPos === 'center') baseY = h * 0.5 - totalH / 2;
  else                                 baseY = h * 0.82 - totalH;

  // ---- Background bar gradient (bukan rounded box) ----
  // Untuk bottom: gradient dari transparan ke gelap di bagian bawah
  if (style.textPos === 'bottom') {
    const gH = h * 0.32;
    const g = ctx.createLinearGradient(0, h - gH, 0, h);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.save();
    ctx.globalAlpha = alpha * 0.75;
    ctx.fillStyle = g;
    ctx.fillRect(0, h - gH, w, gH);
    ctx.restore();
  } else if (style.textPos === 'top') {
    const gH = h * 0.28;
    const g = ctx.createLinearGradient(0, 0, 0, gH);
    g.addColorStop(0, 'rgba(0,0,0,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.globalAlpha = alpha * 0.75;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, gH);
    ctx.restore();
  }

  // ---- Accent bar kecil di atas teks (signature ClipCraft) ----
  if (style.textPos !== 'center') {
    const barW = Math.min(w * 0.14, fontSize * 2.6);
    const barH = Math.max(3, fontSize * 0.09);
    const barY = baseY + slide - fontSize * 0.55;
    ctx.save();
    ctx.globalAlpha = alpha;
    const bg = ctx.createLinearGradient(w / 2 - barW / 2, 0, w / 2 + barW / 2, 0);
    bg.addColorStop(0, '#ff5fa2');
    bg.addColorStop(1, style.accent);
    ctx.fillStyle = bg;
    ctx.shadowColor = style.accent;
    ctx.shadowBlur = 18;
    roundRect(ctx, w / 2 - barW / 2, barY, barW, barH, barH / 2);
    ctx.fill();
    ctx.restore();
  }

  // ---- Text dengan shadow lembut + scale ----
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(w / 2, baseY + totalH / 2 + slide);
  ctx.scale(scale, scale);
  ctx.translate(-w / 2, -(baseY + totalH / 2));

  ctx.shadowColor = 'rgba(0,0,0,0.75)';
  ctx.shadowBlur = fontSize * 0.9;
  ctx.shadowOffsetY = fontSize * 0.12;
  ctx.fillStyle = style.textColor;

  shownLines.forEach((ln, i) => {
    const y = baseY + i * lineH + lineH / 2;
    // Outline tipis buat readability di background apapun
    ctx.lineWidth = fontSize * 0.06;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineJoin = 'round';
    ctx.strokeText(ln, w / 2, y);
    ctx.fillText(ln, w / 2, y);
  });
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

/* =========================================================
   PROCESS VIDEO
   ========================================================= */
async function processVideo() {
  if (!state.file) { toast('Upload video dulu ya 🎬'); return; }

  state.brief = briefInput.value.trim();

  viewEditor.classList.add('hidden');
  viewPreview.classList.add('hidden');
  viewLoading.classList.remove('hidden');
  setProgress(0);
  loadingTitle.textContent = 'Menyiapkan video...';
  loadingSub.textContent = 'Memuat frame & audio sumber 🎧';

  const { w, h } = getCanvasSize();
  workCanvas.width = w;
  workCanvas.height = h;
  const ctx = workCanvas.getContext('2d', { alpha: false, desynchronized: true });
  // Fill awal biar canvas nggak hitam
  ctx.fillStyle = '#0b0820';
  ctx.fillRect(0, 0, w, h);

  workVideo.src = state.videoURL;
  workVideo.muted = false;   // audio perlu "on" biar track-nya hidup, tapi volume 0
  workVideo.volume = 0;
  workVideo.load();

  try {
    await waitEvent(workVideo, 'loadedmetadata', 12000);
    if (workVideo.duration > MAX_DURATION + 0.5) throw new Error('Video melebihi 5 menit.');
    state.videoDuration = workVideo.duration;

    // Pastikan minimal 1 frame sudah ter-load
    if (workVideo.readyState < 2) {
      await waitEvent(workVideo, 'loadeddata', 12000);
    }

    // Paksa seek ke 0 supaya frame pertama beneran ready buat di-draw
    if (workVideo.currentTime !== 0) {
      workVideo.currentTime = 0;
      await waitEvent(workVideo, 'seeked', 5000).catch(() => {});
    }

    // ---- Draw frame pertama SEBELUM recorder mulai ----
    let drewFirst = false;
    for (let i = 0; i < 8 && !drewFirst; i++) {
      drewFirst = tryDraw(ctx, workVideo, 0, w, h);
      if (!drewFirst) await sleep(120);
    }
    if (!drewFirst) {
      console.warn('Frame pertama belum tersedia, lanjut saja...');
    }

    // ---- Setup streams ----
    const canvasStream = workCanvas.captureStream(30);

    let audioTracks = [];
    try {
      const vs = workVideo.captureStream ? workVideo.captureStream()
               : workVideo.mozCaptureStream ? workVideo.mozCaptureStream()
               : null;
      if (vs) audioTracks = vs.getAudioTracks();
    } catch (e) { console.warn('Audio capture tidak didukung:', e); }

    const combined = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks
    ]);

    // ---- Pilih codec ----
    const candidates = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=avc1,mp4a',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    let mime = '';
    for (const c of candidates) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(c)) { mime = c; break; }
    }
    if (!mime) throw new Error('Browser tidak mendukung MediaRecorder.');

    const isMp4 = mime.startsWith('video/mp4');
    const bitrate = state.resId === '4k' ? 24_000_000
                  : state.resId === '1080p' ? 10_000_000
                  : 5_000_000;

    const recorder = new MediaRecorder(combined, {
      mimeType: mime,
      videoBitsPerSecond: bitrate,
      audioBitsPerSecond: 128_000
    });

    const chunks = [];
    recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const stopped = new Promise(res => { recorder.onstop = () => res(); });

    loadingTitle.textContent = 'Menerapkan gaya editing...';
    loadingSub.textContent = 'Filter, teks aesthetic & emoji sedang dirender ✨';

    // ---- Start recording SETELAH frame pertama ke-draw ----
    recorder.start(150);

    // ---- Play video dari awal ----
    workVideo.currentTime = 0;
    await workVideo.play();

    // ---- Draw loop: pakai requestVideoFrameCallback kalau ada ----
    await new Promise((resolve) => {
      let stopped = false;

      const finish = () => {
        if (stopped) return;
        stopped = true;
        resolve();
      };

      const loop = (now, meta) => {
        if (workVideo.ended || workVideo.paused) return finish();
        const t = workVideo.currentTime;
        tryDraw(ctx, workVideo, t, w, h);
        setProgress(clamp((t / state.videoDuration) * 100, 0, 99));

        if ('requestVideoFrameCallback' in workVideo) {
          workVideo.requestVideoFrameCallback(loop);
        } else {
          requestAnimationFrame(() => loop());
        }
      };

      workVideo.addEventListener('ended', finish, { once: true });
      workVideo.addEventListener('pause', finish, { once: true });

      if ('requestVideoFrameCallback' in workVideo) {
        workVideo.requestVideoFrameCallback(loop);
      } else {
        requestAnimationFrame(() => loop());
      }
    });

    // Flush frame terakhir
    await sleep(220);
    recorder.stop();
    await stopped;

    const blob = new Blob(chunks, { type: isMp4 ? 'video/mp4' : 'video/webm' });
    const url = URL.createObjectURL(blob);

    resultVideo.src = url;
    resultVideo.load();

    const ext = isMp4 ? 'mp4' : 'webm';
    downloadBtn.href = url;
    downloadBtn.setAttribute('download', `clipcraft-${Date.now()}.${ext}`);
    downloadBtn.innerHTML = `<span class="btn-ico">⬇</span> Download ${ext.toUpperCase()}`;

    setProgress(100);

    setTimeout(() => {
      viewLoading.classList.add('hidden');
      viewPreview.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (!isMp4) toast('ℹ️ Browser kamu belum support MP4 recorder — hasil disimpan sebagai .webm (bisa dikonversi ke MP4).', 6000);
      else toast('✅ Video berhasil diproses!');
    }, 380);

  } catch (err) {
    console.error(err);
    viewLoading.classList.add('hidden');
    viewEditor.classList.remove('hidden');
    toast('❌ Gagal memproses: ' + (err.message || 'Unknown error'));
  }
}

function tryDraw(ctx, video, t, w, h) {
  if (!video.videoWidth || !video.videoHeight) return false;
  try {
    drawFrame(ctx, video, t, w, h);
    return true;
  } catch (e) {
    console.warn('drawFrame error:', e);
    return false;
  }
}

function waitEvent(el, event, timeout = 8000) {
  return new Promise((resolve, reject) => {
    let done = false;
    const cleanup = () => { if (done) return; done = true; el.removeEventListener(event, on); clearTimeout(tid); };
    const on = () => { cleanup(); resolve(); };
    const tid = setTimeout(() => { cleanup(); reject(new Error(`Timeout menunggu ${event}`)); }, timeout);
    el.addEventListener(event, on, { once: true });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function setProgress(p) {
  const v = clamp(p, 0, 100);
  progressBar.style.width = v + '%';
  progressPct.textContent = Math.round(v) + '%';
}

/* ---------- RESET / AGAIN ---------- */
againBtn.addEventListener('click', () => {
  if (resultVideo.src && resultVideo.src.startsWith('blob:')) {
    URL.revokeObjectURL(resultVideo.src);
  }
  resultVideo.removeAttribute('src');
  resultVideo.load();

  viewPreview.classList.add('hidden');
  viewEditor.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- BOOT ---------- */
renderStyles();
renderFormat();
updateProcessBtn();
processBtn.addEventListener('click', processVideo);

['dragover','drop'].forEach(evt => {
  window.addEventListener(evt, e => {
    if (evt === 'drop' && e.target.closest('#dropZone') === null && e.dataTransfer?.files?.length) {
      e.preventDefault();
    }
  });
});
