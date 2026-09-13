// ============================================================
//  Маляр Калькулятор — Основная логика
// ============================================================

'use strict';

// ====== СОСТОЯНИЕ ПРИЛОЖЕНИЯ ======
const State = {
  tab: 'calc',
  calc: {
    mode: 'quantity', // 'quantity' | 'area'
    manufacturer: 'technocolor',
    materialId: '',
    hardenerId: '',
    thinnerIds: [],
    quantity: 100,
    unit: 'g',
    area: 1,
    reserve: 10,
    temperature: 20,
  },
  lib: {
    filter: 'all',
    search: '',
  },
  result: null,
};

// ====== КОНСТАНТЫ ======
const HISTORY_KEY = 'paintCalc_history';
const HISTORY_TTL = 30 * 24 * 60 * 60 * 1000; // 30 дней

const TYPE_LABELS = {
  primer: 'Грунт',
  lacquer: 'Лак',
  enamel: 'Эмаль',
  dye: 'Краситель/Морилка',
  converter: 'Конвертер',
};

const CHEM_LABELS = {
  pu: 'ПУ',
  'pu-ac': 'ПУ (алиф.)',
  ac: 'Акриловый',
  pe: 'Полиэфирный',
  wb: 'Водоразбавимый',
  solvent: 'На растворителе',
  alkyd: 'Алкидный',
  '1k': '1К',
};

const UNIT_MUL = { g: 1, kg: 1000, l: 1000 };

// ====== ИНИЦИАЛИЗАЦИЯ ======
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCalc();
  initLibrary();
  renderHistory();
  registerSW();
});

// ====== НАВИГАЦИЯ ======
function initNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function switchTab(name) {
  State.tab = name;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${name}"]`).classList.add('active');
  if (name === 'history') renderHistory();
  if (name === 'library') renderLibrary();
}

// ====== КАЛЬКУЛЯТОР ======
function initCalc() {
  // Кнопки режима
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      State.calc.mode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('mode-quantity').style.display = btn.dataset.mode === 'quantity' ? '' : 'none';
      document.getElementById('mode-area').style.display = btn.dataset.mode === 'area' ? '' : 'none';
      clearResult();
    });
  });

  // Производитель
  const mfSelect = document.getElementById('calc-manufacturer');
  mfSelect.addEventListener('change', () => {
    State.calc.manufacturer = mfSelect.value;
    populateMaterials();
    clearResult();
  });
  populateManufacturers();

  // Материал
  const matSelect = document.getElementById('calc-material');
  matSelect.addEventListener('change', () => {
    State.calc.materialId = matSelect.value;
    populateHardeners();
    populateThinners();
    updateCoverageInfo();
    clearResult();
  });
  populateMaterials();

  // Отвердитель
  document.getElementById('calc-hardener').addEventListener('change', function() {
    State.calc.hardenerId = this.value;
    clearResult();
  });

  // Разбавитель
  document.getElementById('calc-thinner').addEventListener('change', function() {
    State.calc.thinnerIds = [this.value];
    clearResult();
  });

  // Температура
  const tempInput = document.getElementById('calc-temp');
  tempInput.addEventListener('input', () => {
    const v = parseFloat(tempInput.value);
    if (!isNaN(v)) {
      State.calc.temperature = v;
      updateTempChips(v);
      clearResult();
    }
  });
  document.querySelectorAll('.temp-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const t = parseInt(chip.dataset.temp);
      State.calc.temperature = t;
      tempInput.value = t;
      updateTempChips(t);
      clearResult();
    });
  });

  // Количество / ед. изм.
  document.getElementById('calc-quantity').addEventListener('input', function() {
    State.calc.quantity = parseFloat(this.value) || 0;
    clearResult();
  });
  document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      State.calc.unit = btn.dataset.unit;
      document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      clearResult();
    });
  });

  // Площадь
  document.getElementById('calc-area').addEventListener('input', function() {
    State.calc.area = parseFloat(this.value) || 0;
    updateCoverageInfo();
    clearResult();
  });

  // Запас
  document.querySelectorAll('.reserve-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      State.calc.reserve = parseInt(btn.dataset.reserve);
      document.querySelectorAll('.reserve-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      clearResult();
    });
  });

  // Кнопка расчёта
  document.getElementById('calc-btn').addEventListener('click', calculate);

  // Кнопка сохранения
  document.getElementById('save-btn').addEventListener('click', saveToHistory);
}

function populateManufacturers() {
  const sel = document.getElementById('calc-manufacturer');
  const manufacturers = getAllManufacturers();
  sel.innerHTML = manufacturers.map(m =>
    `<option value="${m.id}">${m.name}</option>`
  ).join('');
}

function populateMaterials() {
  const sel = document.getElementById('calc-material');
  const mfId = State.calc.manufacturer;
  const materials = getAllMaterials().filter(m => m.manufacturer === mfId);

  const grouped = {};
  materials.forEach(m => {
    const group = TYPE_LABELS[m.type] || m.type;
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(m);
  });

  sel.innerHTML = '<option value="">— выберите материал —</option>';
  Object.entries(grouped).forEach(([group, items]) => {
    const og = document.createElement('optgroup');
    og.label = group;
    items.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.code + ' — ' + getShortName(m.name, m.code);
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });

  State.calc.materialId = '';
  populateHardeners();
  populateThinners();
  updateCoverageInfo();
}

function getShortName(name, code) {
  // Убираем код из начала имени
  return name.replace(new RegExp('^' + code + '\\s*[—-]\\s*'), '').trim();
}

function getMaterial() {
  if (!State.calc.materialId) return null;
  return getAllMaterials().find(m => m.id === State.calc.materialId);
}

function populateHardeners() {
  const sel = document.getElementById('calc-hardener');
  const mat = getMaterial();
  if (!mat || !mat.hardeners || mat.hardeners.length === 0) {
    sel.innerHTML = '<option value="">Не требуется</option>';
    sel.disabled = true;
    State.calc.hardenerId = '';
    return;
  }
  sel.disabled = false;
  sel.innerHTML = mat.hardeners.map(h => {
    const hd = HARDENERS[h.id] || { name: h.id, description: '' };
    const ratio = h.ratio ? `${h.ratio}%` : `${h.ratioMin}-${h.ratioMax}%`;
    return `<option value="${h.id}">${hd.name} — ${ratio} (${hd.description.substring(0, 40)})</option>`;
  }).join('');
  State.calc.hardenerId = mat.hardeners[0].id;
}

function populateThinners() {
  const sel = document.getElementById('calc-thinner');
  const mat = getMaterial();
  if (!mat || !mat.thinners || mat.thinners.length === 0) {
    sel.innerHTML = '<option value="">Не требуется</option>';
    sel.disabled = true;
    State.calc.thinnerIds = [];
    return;
  }
  sel.disabled = false;
  sel.innerHTML = mat.thinners.map(t => {
    const td = THINNERS[t.id] || { name: t.id, description: '' };
    const ratio = t.ratio ? `${t.ratio}%` : `${t.ratioMin}-${t.ratioMax}%`;
    return `<option value="${t.id}">${td.name} — ${ratio} разбавления</option>`;
  }).join('');
  State.calc.thinnerIds = [mat.thinners[0].id];
}

function updateCoverageInfo() {
  const mat = getMaterial();
  const el = document.getElementById('coverage-info');
  if (!mat || !mat.coverage) {
    el.hidden = true;
    return;
  }
  const area = State.calc.area;
  const totalMix = mat.coverage * area;
  const withReserve = Math.ceil(totalMix * (1 + State.calc.reserve / 100));

  el.hidden = false;
  el.innerHTML = `Расход материала: <span class="coverage-value">${mat.coverage} г/м²</span> ·
    Для ${area} м²: <span class="coverage-value">${totalMix} г</span> смеси`;
}

function updateTempChips(temp) {
  document.querySelectorAll('.temp-chip').forEach(chip => {
    const t = parseInt(chip.dataset.temp);
    chip.classList.toggle('active', t === temp);
  });
  // Zone highlight
  let zone = getTempZone(temp);
  document.querySelectorAll('.temp-chip').forEach(chip => {
    chip.classList.remove('zone-active');
    if (chip.dataset.zone === zone) chip.classList.add('active');
  });
}

// ====== РАСЧЁТ ======
function calculate() {
  const mat = getMaterial();
  if (!mat) {
    showToast('Выберите материал для расчёта');
    return;
  }

  const temp = State.calc.temperature;
  const hardenerId = State.calc.hardenerId;
  const thinnerId = State.calc.thinnerIds[0];

  // Базовое количество (в граммах)
  let baseG;
  if (State.calc.mode === 'area') {
    if (!mat.coverage) {
      showToast('Для этого материала расход не указан. Используйте режим "По количеству".');
      return;
    }
    const area = State.calc.area;
    if (!area || area <= 0) {
      showToast('Укажите площадь');
      return;
    }
    const totalMixNeeded = mat.coverage * area * (1 + State.calc.reserve / 100);
    // Разбиваем totalMix на компоненты
    // Нам нужно найти base такое, чтобы base + hardener + thinner = totalMix
    baseG = computeBaseFromTotal(mat, hardenerId, thinnerId, totalMixNeeded, temp);
  } else {
    const qty = State.calc.quantity;
    if (!qty || qty <= 0) {
      showToast('Укажите количество');
      return;
    }
    baseG = qty * UNIT_MUL[State.calc.unit];
  }

  // Получаем пропорции
  const hInfo = hardenerId ? mat.hardeners.find(h => h.id === hardenerId) : null;
  const tInfo = thinnerId ? mat.thinners.find(t => t.id === thinnerId) : null;

  // Отвердитель
  let hardenerG = 0;
  if (hInfo) {
    const ratio = hInfo.ratio || ((hInfo.ratioMin + hInfo.ratioMax) / 2);
    hardenerG = baseG * ratio / 100;
  }

  // Разбавитель
  let thinnerRatio = 0;
  if (tInfo) {
    thinnerRatio = tInfo.ratio || ((tInfo.ratioMin + tInfo.ratioMax) / 2);
  }
  let thinnerG = baseG * thinnerRatio / 100;

  // Ускоритель (ПЭ)
  let acceleratorG = 0;
  let acceleratorId = '';
  if (mat.chemistry === 'pe' && mat.accelerators && mat.accelerators.length > 0) {
    const acc = mat.accelerators[0];
    const accRatio = (temp > 30) ? 1 : acc.ratio;
    acceleratorG = baseG * accRatio / 100;
    acceleratorId = acc.id;
  }

  // Замедлитель
  let retarderG = 0;
  const tempAdj = getTempAdjustments(mat, temp);
  const retarderAdj = tempAdj.find(a => a.type === 'retarder');
  if (retarderAdj) {
    const retarderRatio = (retarderAdj.ratioMin + retarderAdj.ratioMax) / 2;
    retarderG = baseG * retarderRatio / 100;
    // Замедлитель заменяет часть разбавителя
    thinnerG = Math.max(0, thinnerG - retarderG);
  }

  const totalG = baseG + hardenerG + thinnerG + acceleratorG + retarderG;

  // Площадь покрытия (при режиме quantity)
  let coveredArea = null;
  if (State.calc.mode === 'quantity' && mat.coverage) {
    coveredArea = (totalG / mat.coverage).toFixed(2);
  }

  const result = {
    material: mat,
    hardenerId,
    thinnerId,
    temp,
    base: baseG,
    hardener: hardenerG,
    thinner: thinnerG,
    accelerator: acceleratorG,
    acceleratorId,
    retarder: retarderG,
    retarderId: retarderAdj ? retarderAdj.retarder : '',
    total: totalG,
    coveredArea,
    mode: State.calc.mode,
    area: State.calc.area,
    reserve: State.calc.reserve,
    adjustments: tempAdj,
    timestamp: Date.now(),
  };

  State.result = result;
  renderResult(result);
}

function computeBaseFromTotal(mat, hardenerId, thinnerId, totalMix, temp) {
  // base + base*hRatio/100 + base*tRatio/100 [+ base*accRatio/100] = totalMix
  const hInfo = hardenerId ? mat.hardeners.find(h => h.id === hardenerId) : null;
  const tInfo = thinnerId ? mat.thinners.find(t => t.id === thinnerId) : null;

  const hRatio = hInfo ? (hInfo.ratio || ((hInfo.ratioMin + hInfo.ratioMax) / 2)) : 0;
  const tRatio = tInfo ? (tInfo.ratio || ((tInfo.ratioMin + tInfo.ratioMax) / 2)) : 0;
  let accRatio = 0;
  if (mat.chemistry === 'pe' && mat.accelerators && mat.accelerators.length > 0) {
    accRatio = (temp > 30) ? 1 : mat.accelerators[0].ratio;
  }

  // Замедлитель: добавляет к пропорции
  const tempAdj = getTempAdjustments(mat, temp);
  const retAdj = tempAdj.find(a => a.type === 'retarder');
  const retRatio = retAdj ? (retAdj.ratioMin + retAdj.ratioMax) / 2 : 0;

  const divisor = 1 + hRatio/100 + tRatio/100 + accRatio/100 + retRatio/100;
  return totalMix / divisor;
}

function renderResult(r) {
  const el = document.getElementById('calc-result');
  el.hidden = false;
  el.classList.add('fade-in');

  const fmt = g => g >= 1000 ? (g/1000).toFixed(2) + ' кг' : Math.round(g) + ' г';
  const fmtVal = g => Math.round(g);

  const mat = r.material;
  const chemLabel = CHEM_LABELS[mat.chemistry] || mat.chemistry;

  // Определяем жизнеспособность
  const potLifeNote = mat.chemistry === 'pe' ?
    '⚠️ Жизнеспособность смеси: 15-30 минут. Готовьте небольшими порциями!' :
    mat.chemistry === 'pu' || mat.chemistry === 'pu-ac' ? '⏱ Жизнеспособность: 45-60 минут.' : '';

  let html = `
  <div class="result-card">
    <div class="result-title">Результат расчёта</div>
    <div class="result-material-name">${mat.code}</div>
    <div style="font-size:13px;opacity:0.8;margin-bottom:12px;">${getShortName(mat.name, mat.code)}</div>`;

  if (r.mode === 'area') {
    html += `<div style="font-size:13px;opacity:0.8;margin-bottom:12px;">
      Площадь: ${r.area} м² · Запас: ${r.reserve}% · Расход: ${mat.coverage} г/м²
    </div>`;
  }

  html += `<div class="result-rows">
    <div class="result-row">
      <div class="result-row-icon">🪣</div>
      <div class="result-row-label">Основа <span style="opacity:0.7;font-size:11px;">${mat.code}</span></div>
      <div><span class="result-row-value">${fmtVal(r.base)}</span> <span class="result-row-unit">г</span></div>
    </div>`;

  if (r.hardener > 0) {
    const hd = HARDENERS[r.hardenerId] || { name: r.hardenerId };
    html += `<div class="result-row">
      <div class="result-row-icon">⚗️</div>
      <div class="result-row-label">Отвердитель <span style="opacity:0.7;font-size:11px;">${hd.name}</span></div>
      <div><span class="result-row-value">${fmtVal(r.hardener)}</span> <span class="result-row-unit">г</span></div>
    </div>`;
  }

  if (r.thinner > 0) {
    const td = THINNERS[r.thinnerId] || { name: r.thinnerId };
    html += `<div class="result-row">
      <div class="result-row-icon">💧</div>
      <div class="result-row-label">Разбавитель <span style="opacity:0.7;font-size:11px;">${td.name}</span></div>
      <div><span class="result-row-value">${fmtVal(r.thinner)}</span> <span class="result-row-unit">г</span></div>
    </div>`;
  }

  if (r.accelerator > 0) {
    html += `<div class="result-row">
      <div class="result-row-icon">⚡</div>
      <div class="result-row-label">Ускоритель <span style="opacity:0.7;font-size:11px;">${r.acceleratorId}</span></div>
      <div><span class="result-row-value">${fmtVal(r.accelerator)}</span> <span class="result-row-unit">г</span></div>
    </div>`;
  }

  if (r.retarder > 0) {
    const rtd = THINNERS[r.retarderId] || { name: r.retarderId };
    html += `<div class="result-row">
      <div class="result-row-icon">🐢</div>
      <div class="result-row-label">Замедлитель <span style="opacity:0.7;font-size:11px;">${rtd.name}</span></div>
      <div><span class="result-row-value">${fmtVal(r.retarder)}</span> <span class="result-row-unit">г</span></div>
    </div>`;
  }

  html += `</div>
  <div class="result-total">
    <div class="result-total-label">ИТОГО смеси</div>
    <div class="result-total-value">${fmt(r.total)}</div>
  </div>`;

  if (r.coveredArea) {
    html += `<div style="font-size:13px;opacity:0.75;margin-top:8px;text-align:center;">
      ≈ покроет ${r.coveredArea} м² при расходе ${mat.coverage} г/м²
    </div>`;
  }

  html += `</div>`;

  // Диаграмма состава
  const total = r.total || 1;
  html += `<div class="card" style="margin-top:10px;">
    <div class="card-title">📊 Состав смеси</div>
    <div class="composition-bar">
      <div class="comp-segment comp-base" style="width:${(r.base/total*100).toFixed(1)}%"></div>
      <div class="comp-segment comp-hardener" style="width:${(r.hardener/total*100).toFixed(1)}%"></div>
      <div class="comp-segment comp-thinner" style="width:${(r.thinner/total*100).toFixed(1)}%"></div>
      <div class="comp-segment comp-accelerator" style="width:${(r.accelerator/total*100).toFixed(1)}%"></div>
      <div class="comp-segment comp-retarder" style="width:${(r.retarder/total*100).toFixed(1)}%"></div>
    </div>
    <div class="comp-legend">
      <div class="comp-legend-item"><div class="comp-dot comp-base"></div>Основа ${(r.base/total*100).toFixed(0)}%</div>
      ${r.hardener > 0 ? `<div class="comp-legend-item"><div class="comp-dot comp-hardener"></div>Отвердитель ${(r.hardener/total*100).toFixed(0)}%</div>` : ''}
      ${r.thinner > 0 ? `<div class="comp-legend-item"><div class="comp-dot comp-thinner"></div>Разбавитель ${(r.thinner/total*100).toFixed(0)}%</div>` : ''}
      ${r.accelerator > 0 ? `<div class="comp-legend-item"><div class="comp-dot comp-accelerator"></div>Ускоритель ${(r.accelerator/total*100).toFixed(0)}%</div>` : ''}
      ${r.retarder > 0 ? `<div class="comp-legend-item"><div class="comp-dot comp-retarder"></div>Замедлитель ${(r.retarder/total*100).toFixed(0)}%</div>` : ''}
    </div>
  </div>`;

  // Рекомендации по температуре
  if (r.adjustments && r.adjustments.length > 0) {
    html += `<div class="card" style="margin-top:10px;">
      <div class="card-title">🌡️ Рекомендации — ${r.temp}°C (${getTempZoneName(r.temp)})</div>
      <div class="adjustments">`;
    r.adjustments.forEach(adj => {
      html += `<div class="adjustment-item ${adj.type}">
        <div class="adjustment-icon">${adj.icon}</div>
        <div class="adjustment-text">${adj.text}</div>
      </div>`;
    });
    html += `</div></div>`;
  }

  if (potLifeNote) {
    html += `<div class="card" style="margin-top:10px;background:var(--warning-light);border-color:#ffcc80;">
      <div style="color:var(--warning);font-size:13px;">${potLifeNote}</div>
    </div>`;
  }

  // Если материал ПЭ — особое предупреждение
  if (mat.chemistry === 'pe') {
    html += `<div class="card" style="margin-top:10px;background:var(--danger-light);border-color:#ffcdd2;">
      <div style="color:var(--danger);font-size:13px;">
        <strong>⚠️ Полиэфирный материал!</strong><br>
        EC1/EC2 и EA1 — обязательные компоненты. Работайте в хорошо проветриваемом помещении.
        Соблюдайте последовательность смешивания: сначала разбавитель, затем отвердитель, в конце ускоритель.
      </div>
    </div>`;
  }

  html += `<div class="flex-row mt-12">
    <button class="btn btn-outline" onclick="shareResult()">📤 Поделиться</button>
    <button id="save-btn" class="btn btn-primary" style="flex:1">💾 Сохранить</button>
  </div>`;

  el.innerHTML = html;
  document.getElementById('save-btn').addEventListener('click', saveToHistory);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearResult() {
  const el = document.getElementById('calc-result');
  el.hidden = true;
  el.innerHTML = '';
  State.result = null;
}

function getTempZoneName(temp) {
  if (temp < 15) return 'холодно';
  if (temp <= 25) return 'оптимально';
  if (temp <= 30) return 'тепло';
  return 'жарко';
}

// ====== ИСТОРИЯ ======
function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    return all.filter(e => now - e.timestamp < HISTORY_TTL);
  } catch { return []; }
}

function saveHistory(entries) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

function saveToHistory() {
  if (!State.result) {
    showToast('Сначала выполните расчёт');
    return;
  }
  const history = getHistory();
  // Лимит 100 записей
  if (history.length >= 100) history.pop();
  history.unshift({ ...State.result, id: Date.now().toString() });
  saveHistory(history);
  showToast('✅ Сохранено в историю');
  renderHistory();
}

function renderHistory() {
  const el = document.getElementById('history-list');
  const history = getHistory();

  if (history.length === 0) {
    el.innerHTML = `<div class="history-empty">
      <div class="empty-icon">📋</div>
      <div>История пуста</div>
      <div class="text-muted" style="margin-top:6px;">Выполните расчёт и сохраните его</div>
    </div>`;
    return;
  }

  const fmt = g => g >= 1000 ? (g/1000).toFixed(2) + ' кг' : Math.round(g) + ' г';

  el.innerHTML = history.map(e => {
    const mat = e.material;
    const date = new Date(e.timestamp);
    const dateStr = date.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' }) +
      ' ' + date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

    return `<div class="history-item" data-id="${e.id}" onclick="loadFromHistory('${e.id}')">
      <button class="history-delete" onclick="deleteHistory(event,'${e.id}')">✕</button>
      <div class="history-item-header">
        <div class="history-item-name">${mat.code}</div>
        <div class="history-item-date">${dateStr}</div>
      </div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:8px;">${getShortName(mat.name, mat.code)}</div>
      <div class="history-summary">
        <span class="history-pill">🪣 ${fmt(e.base)}</span>
        ${e.hardener > 0 ? `<span class="history-pill">⚗️ ${fmt(e.hardener)}</span>` : ''}
        ${e.thinner > 0 ? `<span class="history-pill">💧 ${fmt(e.thinner)}</span>` : ''}
        ${e.accelerator > 0 ? `<span class="history-pill">⚡ ${fmt(e.accelerator)}</span>` : ''}
        <span class="history-pill" style="background:var(--primary);color:#fff;border-color:var(--primary);">= ${fmt(e.total)}</span>
        ${e.mode === 'area' ? `<span class="history-pill">📐 ${e.area} м²</span>` : ''}
        <span class="history-pill">🌡️ ${e.temp}°C</span>
      </div>
    </div>`;
  }).join('');

  document.getElementById('history-count').textContent = history.length;
}

function deleteHistory(evt, id) {
  evt.stopPropagation();
  const history = getHistory().filter(e => e.id !== id);
  saveHistory(history);
  renderHistory();
}

function loadFromHistory(id) {
  const entry = getHistory().find(e => e.id === id);
  if (!entry) return;
  // Переходим на калькулятор и показываем результат
  State.result = entry;
  switchTab('calc');
  const el = document.getElementById('calc-result');
  el.hidden = false;
  renderResult(entry);
  showToast('Расчёт загружен из истории');
}

window.deleteHistory = deleteHistory;
window.loadFromHistory = loadFromHistory;

// ====== ОЧИСТИТЬ ИСТОРИЮ ======
document.getElementById('clear-history-btn')?.addEventListener('click', () => {
  if (!confirm('Очистить всю историю?')) return;
  saveHistory([]);
  renderHistory();
});

// ====== БИБЛИОТЕКА ======
function initLibrary() {
  // Фильтры
  document.querySelectorAll('#tab-library .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      State.lib.filter = chip.dataset.filter;
      document.querySelectorAll('#tab-library .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderLibrary();
    });
  });

  // Поиск
  document.getElementById('lib-search').addEventListener('input', function() {
    State.lib.search = this.value.toLowerCase().trim();
    renderLibrary();
  });
}

function renderLibrary() {
  const el = document.getElementById('library-list');
  let materials = getAllMaterials();
  const filter = State.lib.filter;
  const search = State.lib.search;

  if (filter !== 'all') {
    if (['primer', 'lacquer', 'enamel', 'dye', 'converter'].includes(filter)) {
      materials = materials.filter(m => m.type === filter);
    } else if (['pu', 'ac', 'pe', 'wb'].includes(filter)) {
      materials = materials.filter(m => m.chemistry === filter || m.chemistry === 'pu-ac' && filter === 'pu');
    }
  }

  if (search) {
    materials = materials.filter(m =>
      m.code.toLowerCase().includes(search) ||
      m.name.toLowerCase().includes(search) ||
      (m.description || '').toLowerCase().includes(search)
    );
  }

  if (materials.length === 0) {
    el.innerHTML = `<div class="history-empty">
      <div class="empty-icon">🔍</div>
      <div>Ничего не найдено</div>
    </div>`;
    return;
  }

  el.innerHTML = materials.map(m => buildLibCard(m)).join('');

  // Клики на раскрытие
  el.querySelectorAll('.lib-material-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const card = hdr.closest('.lib-material-card');
      card.classList.toggle('expanded');
    });
  });

  // Кнопки "Рассчитать"
  el.querySelectorAll('.lib-calc-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const matId = btn.dataset.matid;
      switchTab('calc');
      // Установить материал
      const matSel = document.getElementById('calc-material');
      matSel.value = matId;
      State.calc.materialId = matId;
      populateHardeners();
      populateThinners();
      updateCoverageInfo();
      showToast('Материал выбран в калькуляторе');
    });
  });
}

function buildLibCard(m) {
  const chemLabel = CHEM_LABELS[m.chemistry] || m.chemistry;
  const typeLabel = TYPE_LABELS[m.type] || m.type;

  let badges = `<span class="material-badge badge-${m.chemistry === 'pu-ac' ? 'pu' : m.chemistry}">${chemLabel}</span>`;
  if (m.thixotropic) badges += `<span class="material-badge badge-thix">Тиксотроп.</span>`;
  if (m.fireProtection) badges += `<span class="material-badge badge-fire">Огнезащита</span>`;
  if (m.outdoor) badges += `<span class="material-badge badge-type">Наружный</span>`;

  let recipeHtml = '';
  if (m.hardeners && m.hardeners.length > 0) {
    recipeHtml += m.hardeners.map(h => {
      const hd = HARDENERS[h.id] || { name: h.id };
      const ratio = h.ratio ? `${h.ratio}%` : `${h.ratioMin}-${h.ratioMax}%`;
      return `<div class="lib-recipe-row"><span class="lib-recipe-component">Отвердитель ${hd.name}</span><span class="lib-recipe-ratio">${ratio}</span></div>`;
    }).join('');
  }
  if (m.accelerators && m.accelerators.length > 0) {
    recipeHtml += m.accelerators.map(a => {
      return `<div class="lib-recipe-row"><span class="lib-recipe-component">Ускоритель ${a.id}</span><span class="lib-recipe-ratio">${a.ratio}%</span></div>`;
    }).join('');
  }
  if (m.thinners && m.thinners.length > 0) {
    const td = THINNERS[m.thinners[0].id] || { name: m.thinners[0].id };
    const ratio = m.thinners[0].ratio ? `${m.thinners[0].ratio}%` : `${m.thinners[0].ratioMin}-${m.thinners[0].ratioMax}%`;
    recipeHtml += `<div class="lib-recipe-row"><span class="lib-recipe-component">Разбавитель ${td.name}</span><span class="lib-recipe-ratio">${ratio}</span></div>`;
    if (m.thinners.length > 1) {
      recipeHtml += `<div class="lib-recipe-row"><span class="lib-recipe-component text-muted">Альт. разбавители</span><span class="lib-recipe-ratio">${m.thinners.slice(1).map(t=>t.id).join(', ')}</span></div>`;
    }
  }
  if (!recipeHtml) {
    recipeHtml = `<div class="lib-recipe-row"><span class="lib-recipe-component text-muted">Однокомпонентный</span></div>`;
  }

  const mfName = getAllManufacturers().find(mf => mf.id === m.manufacturer)?.name || m.manufacturer;

  return `
  <div class="lib-material-card">
    <div class="lib-material-header">
      <div class="lib-material-info">
        <div class="lib-material-code">${m.code}</div>
        <div class="lib-material-name">${getShortName(m.name, m.code)}</div>
        <div class="lib-material-type">${typeLabel} · ${chemLabel}</div>
      </div>
      <div class="lib-material-arrow">›</div>
    </div>
    <div class="lib-material-body">
      <div class="lib-desc">${m.description || ''}</div>
      <div style="margin-bottom:10px;">${badges}</div>
      <div class="lib-props">
        <div class="lib-prop"><span class="lib-prop-label">Производитель</span><span class="lib-prop-value">${mfName}</span></div>
        ${m.dryResidue ? `<div class="lib-prop"><span class="lib-prop-label">Сухой остаток</span><span class="lib-prop-value">${m.dryResidue}%</span></div>` : ''}
        ${m.coverage ? `<div class="lib-prop"><span class="lib-prop-label">Расход</span><span class="lib-prop-value">${m.coverage} г/м²</span></div>` : ''}
        ${m.gloss ? `<div class="lib-prop"><span class="lib-prop-label">Глянец</span><span class="lib-prop-value">${m.gloss.join(', ')} гл.</span></div>` : ''}
      </div>
      <div class="lib-recipe">
        <div class="lib-recipe-title">📋 Рецептура (на 100г основы)</div>
        ${recipeHtml}
        ${m.note ? `<div style="font-size:12px;color:var(--text3);margin-top:8px;">${m.note}</div>` : ''}
      </div>
      ${m.variants ? `<div style="margin-top:10px;font-size:12px;color:var(--text2);">
        <strong>Варианты:</strong> ${m.variants.join(' · ')}
      </div>` : ''}
      <button class="btn btn-primary lib-calc-btn btn-sm" data-matid="${m.id}">
        🧮 Рассчитать этот материал
      </button>
    </div>
  </div>`;
}

// ====== ПОДЕЛИТЬСЯ ======
function shareResult() {
  if (!State.result) return;
  const r = State.result;
  const fmt = g => Math.round(g) + ' г';
  const text = `🎨 Расчёт ТехноКолор\n` +
    `Материал: ${r.material.code}\n` +
    `Основа: ${fmt(r.base)}\n` +
    (r.hardener > 0 ? `Отвердитель ${r.hardenerId}: ${fmt(r.hardener)}\n` : '') +
    (r.thinner > 0 ? `Разбавитель ${r.thinnerId}: ${fmt(r.thinner)}\n` : '') +
    (r.accelerator > 0 ? `Ускоритель ${r.acceleratorId}: ${fmt(r.accelerator)}\n` : '') +
    (r.retarder > 0 ? `Замедлитель ${r.retarderId}: ${fmt(r.retarder)}\n` : '') +
    `Итого: ${fmt(r.total)}\n` +
    `Температура: ${r.temp}°C`;

  if (navigator.share) {
    navigator.share({ title: 'Расчёт материалов', text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('📋 Скопировано в буфер'));
  } else {
    showToast('Поделиться: ' + text.substring(0, 50) + '...');
  }
}
window.shareResult = shareResult;

// ====== TOAST ======
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}
window.showToast = showToast;

// ====== SERVICE WORKER ======
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}
