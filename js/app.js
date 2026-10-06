/* =========================================================
   ClipCraft — Client-side video editor
   ========================================================= */

/* ---------- KONFIGURASI GAYA EDITING ---------- */
const STYLES = [
  {
    id: 'vlog',
    name: 'Vlog Harian',
    emoji: '🌤️',
    desc: 'Hangat, cerah, casual',
    swatch: 'linear-gradient(135deg,#ffb26b,#ff5fa2)',
    filter: 'saturate(1.25) brightness(1.1) contrast(1.05)',
    overlay: 'linear-gradient(180deg, rgba(255,180,120,0.15), rgba(255,120,180,0.20))',
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
    filter: 'saturate(0.88) brightness(1.08) contrast(1.06)',
    overlay: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(200,200,255,0.14))',
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
    filter: 'contrast(1.25) saturate(0.92) brightness(0.94)',
    overlay: 'linear-gradient(180deg, rgba(10,20,40,0.38), rgba(20,10,40,0.48))',
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
    filter: 'saturate(1.55) contrast(1.12) brightness(1.08)',
    overlay: 'linear-gradient(135deg, rgba(255,0,150,0.14), rgba(0,200,255,0.16))',
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
    filter: 'sepia(0.35) saturate(1.25) contrast(1.05) brightness(1.05)',
    overlay: 'linear-gradient(180deg, rgba(255,200,120,0.18), rgba(180,90,40,0.20))',
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
    filter: 'saturate(1.4) contrast(1.3) hue-rotate(-8deg)',
    overlay: 'linear-gradient(135deg, rgba(120,0,255,0.22), rgba(0,220,255,0.20))',
    font: "'Space Grotesk', sans-serif",
    textColor: '#ffffff',
    weight: '700',
    emojis: ['🌌','⚡','💜','🛸','✨','🔮'],
    textPos: 'center',
    accent: '#b026ff'
  }
];

const RATIOS = [
  { id: '9:16',  label: '9:16  TikTok/Reels', value: [9, 16] },
  { id: '1:1',   label: '1:1  Feed IG',        value: [1, 1] },
  { id: '4:5',   label: '4:5  IG Portrait',    value: [4, 5] },
  { id: '16:9',  label: '16:9  YouTube',       value: [16, 9] }
];

const RESOLUTIONS = [
  { id: '720p',  label: '720p HD',  short: 720 },
  { id: '1080p', label: '1080p FHD', short: 1080 },
  { id: '4k',    label: '4K UHD',   short: 2160 }
];

const MAX_DURATION = 5 * 60; // detik

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

/* ---------- INISIALISASI UI ---------- */
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

/* ---------- UPLOAD HANDLER ---------- */
function handleFile(file) {
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    toast('❌ File harus berupa video (MP4/MOV/WebM).');
    return;
  }

  // clean up previous
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

function updateProcessBtn() {
  processBtn.disabled = !state.file;
}

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

/* ---------- CANVAS MATH ---------- */
function getCanvasSize() {
  const ratio = RATIOS.find(r => r.id === state.ratioId).value;
  const targetShort = RESOLUTIONS.find(r => r.id === state.resId).short;
  const [rw, rh] = ratio;

  // ratio dims: rw:rh → short side = targetShort
  let w, h;
  if (rw >= rh) { h = targetShort; w = Math.round(targetShort * (rw / rh)); }
  else          { w = targetShort; h = Math.round(targetShort * (rh / rw)); }

  // ensure even numbers (encoder friendly)
  w = Math.floor(w / 2) * 2;
  h = Math.floor(h / 2) * 2;
  return { w, h };
}

function drawCover(ctx, video, w, h) {
  const vw = video.videoWidth, vh = video.videoHeight;
  if (!vw || !vh) return;
  const vr = vw / vh, cr = w / h;
  let dw, dh, dx, dy;
  if (vr > cr) { dh = h; dw = h * vr; dx = (w - dw) / 2; dy = 0; }
  else         { dw = w; dh = w / vr; dx = 0; dy = (h - dh) / 2; }
  ctx.drawImage(video, dx, dy, dw, dh);
}

function wrapText(ctx, text, maxWidth) {
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
  return lines.slice(0, 4);
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
  return parts.length ? parts.slice(0, 8) : [brief];
}

/* ---------- FRAME RENDERER ---------- */
function drawFrame(ctx, video, t, w, h) {
  const style = STYLES.find(s => s.id === state.styleId);

  ctx.save();
  ctx.filter = style.filter;
  drawCover(ctx, video, w, h);
  ctx.restore();

  // Letterbox bars (cinematic)
  if (style.letterbox) {
    const bar = h * 0.075;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, bar);
    ctx.fillRect(0, h - bar, w, bar);
  }

  // Color overlay
  ctx.fillStyle = style.overlay;
  ctx.fillRect(0, 0, w, h);

  // Vignette
  const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.38)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  // Emojis floating
  drawEmojis(ctx, t, w, h, style);

  // Captions
  drawCaptions(ctx, t, w, h, style);

  // Progress accent bar (bottom, subtle)
  const dur = state.videoDuration || 1;
  const p = Math.min(1, t / dur);
  const barH = Math.max(3, h * 0.005);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(0, h - barH, w, barH);
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, '#ff5fa2');
  g.addColorStop(0.5, '#a78bfa');
  g.addColorStop(1, '#38bdf8');
  ctx.fillStyle = g;
  ctx.fillRect(0, h - barH, w * p, barH);
}

function drawEmojis(ctx, t, w, h, style) {
  const emojis = style.emojis;
  const count = Math.min(6, emojis.length);
  const size = Math.min(w, h) * 0.075;
  ctx.font = `${size}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < count; i++) {
    const speed = 0.05 + (i % 3) * 0.018;
    const seed  = i * 0.173;
    const prog  = ((t * speed + seed) % 1);
    const y     = h * (1.12 - prog * 1.24);
    const x     = w * (0.12 + ((i * 0.17 + Math.sin(t * 0.8 + i) * 0.08) % 0.76));
    const alpha = Math.sin(prog * Math.PI) * 0.85;
    const rot   = Math.sin(t * 1.6 + i * 2) * 0.22;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillText(emojis[i % emojis.length], 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawCaptions(ctx, t, w, h, style) {
  const segs = getCaptionSegments();
  if (!segs.length) return;

  const dur = state.videoDuration || 1;
  const per = dur / segs.length;
  const idx = Math.min(segs.length - 1, Math.floor(t / per));
  const localT = Math.max(0, Math.min(1, (t - idx * per) / per));
  const text = segs[idx];
  if (!text) return;

  // animation
  const slideIn = Math.min(localT * 4, 1);
  const ease = 1 - Math.pow(1 - slideIn, 3);
  const fadeOut = localT > 0.86 ? 1 - (localT - 0.86) / 0.14 : 1;
  const alpha = Math.min(ease, fadeOut);
  const offsetY = (1 - ease) * Math.min(w, h) * 0.05;

  const fontSize = Math.max(22, Math.min(w, h) * 0.058);
  ctx.font = `${style.weight} ${fontSize}px ${style.font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxWidth = w * 0.82;
  const lines = wrapText(ctx, text, maxWidth);
  const lineH = fontSize * 1.22;
  const totalH = lines.length * lineH;

  let baseY;
  if (style.textPos === 'top')         baseY = h * 0.22;
  else if (style.textPos === 'center') baseY = h * 0.5 - totalH / 2;
  else                                 baseY = h * 0.8 - totalH;

  // soft shadow panel behind text
  const padX = fontSize * 0.6, padY = fontSize * 0.35;
  const maxLineW = Math.max(...lines.map(l => ctx.measureText(l).width));
  const boxW = Math.min(maxWidth + padX * 2, maxLineW + padX * 2);
  const boxH = totalH + padY * 2;

  ctx.save();
  ctx.globalAlpha = alpha * 0.32;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  roundRect(ctx, w / 2 - boxW / 2, baseY + offsetY - padY, boxW, boxH, fontSize * 0.4);
  ctx.fill();
  ctx.restore();

  // text
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = style.textColor;
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, baseY + offsetY + i * lineH + lineH / 2);
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

/* ---------- MAIN PROCESS ---------- */
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
  const ctx = workCanvas.getContext('2d', { alpha: false });

  workVideo.src = state.videoURL;
  workVideo.volume = 0;      // mute local playback
  workVideo.muted = false;   // tapi audio tetap tercapture

  try {
    await waitEvent(workVideo, 'loadedmetadata', 12000);
    if (workVideo.duration > MAX_DURATION + 0.5) {
      throw new Error('Video melebihi 5 menit.');
    }
    state.videoDuration = workVideo.duration;

    // preload 1 frame
    workVideo.currentTime = 0;
    await waitEvent(workVideo, 'loadeddata', 12000);

    // Streams
    const canvasStream = workCanvas.captureStream(30);
    let audioTracks = [];
    try {
      const vs = workVideo.captureStream
        ? workVideo.captureStream()
        : (workVideo.mozCaptureStream ? workVideo.mozCaptureStream() : null);
      if (vs) audioTracks = vs.getAudioTracks();
    } catch (e) { console.warn('Audio capture tidak didukung:', e); }

    const combined = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks
    ]);

    // Pilih codec terbaik
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

    recorder.start(120);

    // Play and render
    workVideo.currentTime = 0;
    await workVideo.play();

    let rafId;
    const render = () => {
      if (workVideo.paused || workVideo.ended) return;
      const t = workVideo.currentTime;
      drawFrame(ctx, workVideo, t, w, h);
      setProgress(Math.min(99, (t / state.videoDuration) * 100));
      rafId = requestAnimationFrame(render);
    };
    render();

    await new Promise(res => { workVideo.onended = res; });
    cancelAnimationFrame(rafId);

    // small delay to let the last frame flush
    await new Promise(r => setTimeout(r, 180));
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
      if (!isMp4) toast('ℹ️ Browser kamu belum support MP4 recorder — hasil disimpan sebagai .webm (bisa di-konversi ke MP4).', 6000);
      else toast('✅ Video berhasil diproses!');
    }, 380);

  } catch (err) {
    console.error(err);
    viewLoading.classList.add('hidden');
    viewEditor.classList.remove('hidden');
    toast('❌ Gagal memproses: ' + (err.message || 'Unknown error'));
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

function setProgress(p) {
  const v = Math.max(0, Math.min(100, p));
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

// drag & drop on whole window to avoid browser opening video file
['dragover','drop'].forEach(evt => {
  window.addEventListener(evt, e => {
    if (evt === 'drop' && e.target.closest('#dropZone') === null && e.dataTransfer?.files?.length) {
      e.preventDefault();
    }
  });
});
