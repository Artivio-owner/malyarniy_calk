// ============================================================
//  Маляр Калькулятор — основная логика
//
//  ГЛАВНОЕ ПРАВИЛО РАСЧЁТА:
//  все доли считаются ОТ ОСНОВНОГО КОМПОНЕНТА (основа = 100%).
//    отвердитель = основа × ratio%
//    разбавитель = основа × ratio%
//  Пример PTS20700: 100 г основы → 50 г PC20 (50%) → 20 г S50 (20%).
// ============================================================

'use strict';

const HISTORY_KEY = 'paintCalc_history';
const HISTORY_TTL = 30 * 24 * 60 * 60 * 1000;
const THEME_KEY = 'paintCalc_theme';

const TYPE_LABELS = {
  primer: 'Грунт', lacquer: 'Лак', enamel: 'Эмаль',
  dye: 'Краситель', converter: 'Конвертер',
};

const CHEM_LABELS = {
  pu: 'ПУ', 'pu-ac': 'ПУ алиф.', ac: 'Акрил', pe: 'Полиэфир',
  wb: 'Водный', solvent: 'Растворитель', alkyd: 'Алкид', '1k': '1К',
};

// Короткие метки для значка в библиотеке (умещаются в 40px)
const CHEM_SHORT = {
  pu: 'ПУ', 'pu-ac': 'ПУА', ac: 'АК', pe: 'ПЭ',
  wb: 'ВД', solvent: 'Р-ЛЬ', alkyd: 'АЛК', '1k': '1К',
};

const UNIT_MUL = { g: 1, kg: 1000, l: 1000 };
const UNIT_LABEL = { g: 'г', kg: 'кг', l: 'л' };

const State = {
  calc: {
    mode: 'quantity',
    manufacturer: '', materialId: '', hardenerId: '', thinnerId: '',
    quantity: 100, unit: 'g',
    area: 2, reserve: 10, temperature: 20,
    hRatioCustom: 50, tRatioCustom: 20,
    subtract: false,
  },
  lib: { filter: 'all', search: '' },
  result: null,
};

// ====== ЗАПУСК ======
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initCalc();
  initLibrary();
  initHistory();
  initInstall();
  renderHistory();
  registerSW();
});

// ====== ТЕМА ======
function initTheme() {
  const saved = safeGet(THEME_KEY);
  if (saved) document.documentElement.dataset.theme = saved;
  document.getElementById('theme-btn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme;
    const isDark = cur ? cur === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    safeSet(THEME_KEY, next);
  });
}

// ====== НАВИГАЦИЯ ======
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
}

function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${name}"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'history') renderHistory();
  if (name === 'library') renderLibrary();
}

// ====== КАЛЬКУЛЯТОР: ИНИЦИАЛИЗАЦИЯ ======
function initCalc() {
  const seg = document.getElementById('mode-seg');
  seg.querySelectorAll('.seg-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      State.calc.mode = btn.dataset.mode;
      seg.dataset.active = String(i);
      seg.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyMode(btn.dataset.mode);
    });
  });

  populateManufacturers();
  populateMaterials();

  document.getElementById('calc-manufacturer').addEventListener('change', e => {
    State.calc.manufacturer = e.target.value;
    populateMaterials();
  });

  document.getElementById('calc-material').addEventListener('change', e => {
    State.calc.materialId = e.target.value;
    populateHardeners();
    populateThinners();
    updateCoverageInfo();
    updateAdjustments();
  });

  document.getElementById('calc-hardener').addEventListener('change', e => {
    State.calc.hardenerId = e.target.value;
    updateCoverageInfo();
  });
  document.getElementById('calc-thinner').addEventListener('change', e => {
    State.calc.thinnerId = e.target.value;
  });

  bindNumber('calc-quantity', v => { State.calc.quantity = v; });
  bindNumber('calc-area', v => { State.calc.area = v; updateCoverageInfo(); });
  bindNumber('calc-temp', v => {
    State.calc.temperature = v;
    syncTempChips(v);
    updateZonePill(v);
    updateAdjustments();
    updateCoverageInfo();
  });

  bindChips('[data-unit]', btn => {
    State.calc.unit = btn.dataset.unit;
    document.getElementById('unit-label').textContent = UNIT_LABEL[btn.dataset.unit];
  });
  bindChips('[data-reserve]', btn => {
    State.calc.reserve = Number(btn.dataset.reserve);
    updateCoverageInfo();
  });
  bindChips('[data-temp]', btn => {
    const t = Number(btn.dataset.temp);
    State.calc.temperature = t;
    document.getElementById('calc-temp').value = t;
    updateZonePill(t);
    updateAdjustments();
    updateCoverageInfo();
  });

  bindNumber('custom-hardener', v => { State.calc.hRatioCustom = v; });
  bindNumber('custom-thinner', v => { State.calc.tRatioCustom = v; });

  document.getElementById('subtract-check').addEventListener('change', function () {
    State.calc.subtract = this.checked;
    updateCoverageInfo();
  });

  document.getElementById('calc-btn').addEventListener('click', () => calculate(true));
  updateZonePill(State.calc.temperature);
  updateSubtractRow();
}

// Галочка нужна, только когда есть что вычитать
function updateSubtractRow() {
  const c = State.calc;
  const mat = c.mode === 'custom' ? CUSTOM_CHEM : getMaterial();
  if (!mat) { document.getElementById('subtract-row').hidden = true; return; }

  const ret = retarderInfo(mat, c.temperature);
  const acc = c.mode === 'custom' ? 0 : accelRatio(mat, c.temperature);
  const additions = [];
  if (ret) additions.push(`замедлитель ${ret.ratio}%`);
  if (acc) additions.push(`ускоритель ${acc}%`);

  const row = document.getElementById('subtract-row');
  row.hidden = additions.length === 0;
  if (additions.length) {
    document.getElementById('subtract-hint').textContent =
      `Сейчас сверх разбавителя: ${additions.join(', ')} от основы`;
  }
}

// Какие карточки видны в каждом режиме
function applyMode(mode) {
  // hidden-атрибут, а не style.display — иначе карточка не покажется
  document.getElementById('card-material').hidden = mode === 'custom';
  document.getElementById('mode-quantity').hidden = mode === 'area';
  document.getElementById('mode-area').hidden = mode !== 'area';
  document.getElementById('mode-custom').hidden = mode !== 'custom';
  updateCoverageInfo();
  updateAdjustments();
  updateSubtractRow();
}

function syncModeButtons(mode) {
  const order = ['quantity', 'area', 'custom'];
  const idx = Math.max(0, order.indexOf(mode));
  const seg = document.getElementById('mode-seg');
  seg.dataset.active = String(idx);
  seg.querySelectorAll('.seg-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  applyMode(mode);
}

function bindNumber(id, cb) {
  document.getElementById(id).addEventListener('input', function () {
    const v = parseFloat(this.value);
    if (!isNaN(v)) cb(v);
  });
}

function bindChips(selector, cb) {
  const nodes = document.querySelectorAll(selector);
  nodes.forEach(btn => btn.addEventListener('click', () => {
    nodes.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    cb(btn);
  }));
}

// ====== СПИСКИ ======
function populateManufacturers() {
  const sel = document.getElementById('calc-manufacturer');
  const list = getAllManufacturers();
  sel.innerHTML = '<option value="">Все производители</option>' +
    list.map(m => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('');
  sel.value = State.calc.manufacturer;
}

function populateMaterials() {
  const sel = document.getElementById('calc-material');
  let list = getAllMaterials();
  if (State.calc.manufacturer) list = list.filter(m => m.manufacturer === State.calc.manufacturer);

  const groups = {};
  list.forEach(m => {
    const g = TYPE_LABELS[m.type] || m.type;
    (groups[g] = groups[g] || []).push(m);
  });

  sel.innerHTML = '<option value="">— Выберите материал —</option>' +
    Object.entries(groups).map(([g, items]) =>
      `<optgroup label="${esc(g)}">` +
      items.map(m => `<option value="${esc(m.id)}">${esc(m.code)} — ${esc(getShortName(m.name, m.code))}</option>`).join('') +
      '</optgroup>').join('');

  if (list.some(m => m.id === State.calc.materialId)) {
    sel.value = State.calc.materialId;
  } else {
    State.calc.materialId = '';
  }
  populateHardeners();
  populateThinners();
  updateCoverageInfo();
}

function populateHardeners() {
  const sel = document.getElementById('calc-hardener');
  const mat = getMaterial();
  const list = mat ? (mat.hardeners || []) : [];

  if (!list.length) {
    sel.innerHTML = '<option value="">не требуется</option>';
    sel.disabled = true;
    State.calc.hardenerId = '';
    return;
  }
  sel.disabled = false;
  sel.innerHTML = list.map(h => {
    const info = HARDENERS[h.id];
    return `<option value="${esc(h.id)}">${esc(h.id)} · ${ratioOf(h)}%${info ? ' — ' + esc(info.name) : ''}</option>`;
  }).join('');

  // при жаре для полиэфира по умолчанию медленный EC2
  let pick = list[0].id;
  if (mat.chemistry === 'pe' && getTempZone(State.calc.temperature) !== 'cold') {
    const slow = list.find(h => h.id === 'EC2');
    if (slow) pick = slow.id;
  }
  State.calc.hardenerId = pick;
  sel.value = pick;
}

function populateThinners() {
  const sel = document.getElementById('calc-thinner');
  const mat = getMaterial();
  const list = mat ? (mat.thinners || []) : [];

  if (!list.length) {
    sel.innerHTML = '<option value="">не требуется</option>';
    sel.disabled = true;
    State.calc.thinnerId = '';
    return;
  }
  sel.disabled = false;
  sel.innerHTML = '<option value="">без разбавителя</option>' + list.map(t => {
    const info = THINNERS[t.id];
    return `<option value="${esc(t.id)}">${esc(t.id)} · ${rangeText(t)}${info ? ' — ' + esc(info.name) : ''}</option>`;
  }).join('');
  State.calc.thinnerId = list[0].id;
  sel.value = list[0].id;
}

// ====== ПРОПОРЦИИ ======
// Рабочая доля = ratio, либо НИЖНЯЯ граница диапазона (не среднее!).
function ratioOf(info) {
  if (!info) return 0;
  if (info.ratio != null) return info.ratio;
  if (info.ratioMin != null) return info.ratioMin;
  return 0;
}

function rangeText(info) {
  if (!info) return '';
  if (info.ratio != null) return info.ratio + '%';
  if (info.ratioMin === info.ratioMax || info.ratioMax == null) return info.ratioMin + '%';
  return info.ratioMin + '–' + info.ratioMax + '%';
}

function getMaterial() {
  return getAllMaterials().find(m => m.id === State.calc.materialId) || null;
}

// Доля ускорителя EA1 (только полиэфирные): при >30°C снижается до 1%.
function accelRatio(mat, temp) {
  if (mat.chemistry !== 'pe' || !mat.accelerators || !mat.accelerators.length) return 0;
  return temp > 30 ? 1 : mat.accelerators[0].ratio;
}

function retarderInfo(mat, temp) {
  const adj = getTempAdjustments(mat, temp).find(a => a.type === 'retarder');
  return adj ? { id: adj.retarder, ratio: adj.ratioMin } : null;
}

// ====== ЯДРО РАСЧЁТА ======
function buildMix(mat, opts) {
  const { temp } = opts;
  const custom = opts.mode === 'custom';

  const hardenerId = custom ? '' : opts.hardenerId;
  const thinnerId = custom ? '' : opts.thinnerId;

  const hInfo = custom ? null : (opts.hardenerId ? (mat.hardeners || []).find(h => h.id === opts.hardenerId) : null);
  const tInfo = custom ? null : (opts.thinnerId ? (mat.thinners || []).find(t => t.id === opts.thinnerId) : null);

  const hRatio = custom ? Math.max(0, opts.hRatio || 0) : ratioOf(hInfo);
  const tRatio = custom ? Math.max(0, opts.tRatio || 0) : ratioOf(tInfo);
  const aRatio = custom ? 0 : accelRatio(mat, temp);

  // Замедлитель добавляется СВЕРХ отвердителя и разбавителя — по указанию
  // производителя. Каталог (стр. 19) относит S100 к разбавителям с очень
  // низкой скоростью испарения, но долю и способ ввода не задаёт.
  // Сходится с диапазонами: у PTS20700 разбавитель 20–30%, рабочие 20%
  // плюс 10% замедлителя как раз дают верхнюю границу.
  const ret = retarderInfo(custom ? CUSTOM_CHEM : mat, temp);
  const rRatio = ret ? ret.ratio : 0;

  // Галочка «вычесть из разбавителя»: добавки забираются из доли
  // разбавителя, и общий объём смеси не растёт.
  const deduct = !!opts.subtract && (rRatio > 0 || aRatio > 0);
  const thinnerRatio = deduct ? Math.max(0, tRatio - rRatio - aRatio) : tRatio;
  const solventRatio = thinnerRatio + rRatio;

  // Основа
  let baseG;
  if (opts.mode === 'area') {
    // Расход г/м² в каталоге стоит в строке «Способ нанесения» — это расход
    // ГОТОВОЙ РАБОЧЕЙ СМЕСИ, всего что проходит через краскопульт.
    // (Где имеется в виду только основа, каталог пишет «часть А».)
    // Поэтому подбираем основу так, чтобы вся смесь дала нужный расход.
    // Запас в основу НЕ закладываем: компоненты считаются на чистую
    // площадь, а запас выводится отдельной строкой от итоговой суммы.
    const mixNeeded = mat.coverage * opts.area;
    baseG = mixNeeded / (1 + hRatio / 100 + solventRatio / 100 + aRatio / 100);
  } else {
    baseG = opts.quantity * UNIT_MUL[opts.unit];
  }

  // Все компоненты — процент ОТ ОСНОВЫ
  const hardenerG = baseG * hRatio / 100;
  const acceleratorG = baseG * aRatio / 100;
  const retarderG = baseG * rRatio / 100;
  const thinnerG = baseG * thinnerRatio / 100;

  const appliedG = baseG + hardenerG + acceleratorG;
  const mixG = appliedG + thinnerG + retarderG;

  // Запас — процент от ИТОГОВОЙ суммы смеси, отдельной строкой
  const reservePct = opts.mode === 'area' ? (opts.reserve || 0) : 0;
  const reserveG = mixG * reservePct / 100;
  const totalG = mixG + reserveG;

  // Верхняя граница разбавления по паспорту — предупреждаем о переразбавлении
  const tMax = tInfo ? (tInfo.ratioMax != null ? tInfo.ratioMax : tInfo.ratio) : null;

  return {
    base: baseG, hardener: hardenerG, thinner: thinnerG,
    accelerator: acceleratorG, retarder: retarderG,
    applied: appliedG, mix: mixG, reserve: reserveG, reservePct, total: totalG,
    hRatio, tRatio: thinnerRatio, tRatioInput: tRatio, aRatio, rRatio, solventRatio, deducted: deduct,
    overThinned: tMax != null && solventRatio > tMax + 0.01, thinnerMax: tMax,
    hardenerId, thinnerId,
    acceleratorId: aRatio ? mat.accelerators[0].id : '',
    retarderId: rRatio ? ret.id : '',
    coveredArea: mat && mat.coverage ? mixG / mat.coverage : null,
  };
}

// Для произвольного режима материала нет — берём правила ПУ/акрила,
// они для замедлителя одинаковы.
const CUSTOM_CHEM = { chemistry: 'pu', hardeners: [] };

function calculate(save = true) {
  const c = State.calc;

  if (c.mode === 'custom') {
    if (!(c.quantity > 0)) { showToast('Укажите количество основы'); return; }
    const mix = buildMix(null, {
      mode: 'custom', temp: c.temperature, subtract: c.subtract,
      quantity: c.quantity, unit: c.unit,
      hRatio: c.hRatioCustom, tRatio: c.tRatioCustom,
    });
    State.result = {
      ...mix, material: null, mode: 'custom', temp: c.temperature,
      timestamp: Date.now(),
    };
    renderResult(State.result);
    if (save) saveToHistory(State.result);
    return;
  }

  const mat = getMaterial();
  if (!mat) { showToast('Сначала выберите материал'); return; }

  if (c.mode === 'area') {
    if (!mat.coverage) { showToast('Для этого материала расход не указан — считайте по массе'); return; }
    if (!(c.area > 0)) { showToast('Укажите площадь'); return; }
  } else if (!(c.quantity > 0)) {
    showToast('Укажите количество'); return;
  }

  const mix = buildMix(mat, {
    mode: c.mode, hardenerId: c.hardenerId, thinnerId: c.thinnerId,
    temp: c.temperature, quantity: c.quantity, unit: c.unit,
    area: c.area, reserve: c.reserve, subtract: c.subtract,
  });

  State.result = {
    ...mix, material: mat, mode: c.mode, temp: c.temperature,
    area: c.area, timestamp: Date.now(),
  };
  renderResult(State.result);
  if (save) saveToHistory(State.result);
}

// ====== ВЫВОД РЕЗУЛЬТАТА ======
function renderResult(r) {
  const el = document.getElementById('calc-result');
  const mat = r.material;

  const rows = [
    { c: 'base', name: mat ? mat.code : 'Основа', g: r.base, formula: '100% (основа)' },
  ];
  if (r.hardener > 0) rows.push({
    c: 'hardener', name: ('Отвердитель ' + (r.hardenerId || '')).trim(), g: r.hardener,
    formula: `${fmt(r.base)} × ${r.hRatio}% = ${fmt(r.hardener)}`,
  });
  if (r.accelerator > 0) rows.push({
    c: 'accelerator', name: 'Ускоритель ' + r.acceleratorId, g: r.accelerator,
    formula: `${fmt(r.base)} × ${r.aRatio}% = ${fmt(r.accelerator)}`,
  });
  if (r.thinner > 0) rows.push({
    c: 'thinner', name: ('Разбавитель ' + (r.thinnerId || '')).trim(), g: r.thinner,
    formula: `${fmt(r.base)} × ${r.tRatio}% = ${fmt(r.thinner)}`,
  });
  if (r.retarder > 0) rows.push({
    c: 'retarder', name: 'Замедлитель ' + r.retarderId, g: r.retarder,
    formula: `${fmt(r.base)} × ${r.rRatio}% = ${fmt(r.retarder)}`,
  });

  // Запас считается от итоговой суммы смеси и стоит отдельной строкой
  const mixRows = rows.slice();
  if (r.reserve > 0) rows.push({
    c: 'reserve', name: `Запас ${r.reservePct}%`, g: r.reserve,
    formula: `${fmt(r.mix)} × ${r.reservePct}% = ${fmt(r.reserve)}`,
  });

  const bar = mixRows.map(x =>
    `<div class="comp-seg" data-c="${x.c}" style="width:${(x.g / r.mix * 100).toFixed(2)}%"></div>`).join('');

  let heroSub;
  if (r.mode === 'area') {
    heroSub = `${trim(r.area)} м² · расход ${mat.coverage} г/м²${r.reservePct ? ' · запас ' + r.reservePct + '%' : ''}`;
  } else if (r.mode === 'custom') {
    heroSub = `${fmt(r.base)} г основы · отвердитель ${r.hRatio}% · разбавитель ${r.tRatioInput}%`;
  } else {
    heroSub = `${trim(r.base >= 1000 ? r.base / 1000 : r.base)} ${r.base >= 1000 ? 'кг' : 'г'} основы` +
      (r.coveredArea ? ' · хватит на ' + trim(r.coveredArea.toFixed(2)) + ' м²' : '');
  }

  const tags = mat
    ? `<span class="rh-tag">${esc(mat.code)}</span>
       <span class="rh-tag">${esc(CHEM_LABELS[mat.chemistry] || mat.chemistry)}</span>`
    : '<span class="rh-tag">Произвольный расчёт</span>';

  el.innerHTML = `
  <div class="result-hero">
    <div class="rh-label">Готовая смесь</div>
    <div class="rh-value">${fmt(r.total)}<small>г</small></div>
    <div class="rh-sub">${esc(heroSub)}</div>
    <div class="rh-meta">
      ${tags}
      <span class="rh-tag">${r.temp}°C</span>
    </div>
  </div>

  <div class="card">
    <div class="comp-bar">${bar}</div>
    <div class="comp-list">
      ${rows.map(x => `
        <div class="comp-row" data-c="${x.c}">
          <span class="comp-dot" data-c="${x.c}"></span>
          <div>
            <div class="comp-name">${esc(x.name)}</div>
            <div class="comp-formula">${esc(x.formula)}</div>
          </div>
          <div class="comp-amount">${fmt(x.g)}<small>г</small></div>
        </div>`).join('')}
    </div>

    ${r.reserve > 0 ? `<div class="result-subtotal">
      <span>Смесь на ${trim(r.area)} м²</span>
      <span>${fmt(r.mix)} г</span>
    </div>` : ''}

    <div class="result-total">
      <span>${r.reserve > 0 ? 'Итого с запасом' : 'Итого смеси'}</span>
      <span class="rt-val">${fmt(r.total)} г</span>
    </div>

    ${(r.retarder > 0 || r.accelerator > 0) ? `<div class="result-note">
      ${r.deducted
        ? `Добавки <b>вычтены из разбавителя</b>: ${r.tRatioInput}% − ${round1(r.tRatioInput - r.tRatio)}% = ${r.tRatio}%.
           Общий объём смеси не вырос.`
        : `${r.retarder > 0 ? `Замедлитель <b>${esc(r.retarderId)}</b>` : `Ускоритель <b>${esc(r.acceleratorId)}</b>`}
           добавляется <b>сверх</b> отвердителя и разбавителя.`}
      ${r.rRatio > 0 ? `Весь растворитель: ${r.tRatio}% + ${r.rRatio}% = <b>${r.solventRatio}%</b>${r.thinnerMax != null ? ` при паспортных до ${r.thinnerMax}%` : ''}.` : ''}
    </div>` : ''}

    ${r.overThinned ? `<div class="result-note" data-warn="1">
      Растворителя ${r.solventRatio}% — выше паспортных ${r.thinnerMax}%.
      Уменьшите разбавитель или замедлитель, иначе возможны потёки и потеря укрывистости.
    </div>` : ''}

    <div class="result-actions">
      <button class="btn btn-outline btn-sm" id="share-btn">Поделиться</button>
      <button class="btn btn-outline btn-sm" id="copy-btn">Копировать</button>
    </div>
  </div>`;

  el.hidden = false;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  document.getElementById('copy-btn').addEventListener('click', () => copyResult(r, rows));
  document.getElementById('share-btn').addEventListener('click', () => shareResult(r, rows));
}

function resultText(r, rows) {
  return `${r.material ? r.material.code : 'Свой расчёт'} — ${trim(r.temp)}°C\n` +
    rows.map(x => `• ${x.name}: ${fmt(x.g)} г`).join('\n') +
    `\nИтого: ${fmt(r.total)} г`;
}

function copyResult(r, rows) {
  navigator.clipboard?.writeText(resultText(r, rows))
    .then(() => showToast('Расчёт скопирован'))
    .catch(() => showToast('Не удалось скопировать'));
}

function shareResult(r, rows) {
  const text = resultText(r, rows);
  if (navigator.share) {
    navigator.share({ title: 'Расчёт ' + r.material.code, text }).catch(() => {});
  } else {
    copyResult(r, rows);
  }
}

// ====== ИНФО О РАСХОДЕ ======
function updateCoverageInfo() {
  const el = document.getElementById('coverage-info');
  const mat = getMaterial();
  if (!mat) { el.hidden = true; return; }

  const parts = [];
  if (mat.coverage) parts.push(`Расход <b>${mat.coverage} г/м²</b>`);
  if (mat.dryResidue) parts.push(`сухой остаток <b>${mat.dryResidue}%</b>`);

  if (State.calc.mode === 'area' && mat.coverage && State.calc.area > 0) {
    const mix = buildMix(mat, {
      mode: 'area', hardenerId: State.calc.hardenerId, thinnerId: State.calc.thinnerId,
      temp: State.calc.temperature, area: State.calc.area, reserve: State.calc.reserve,
      subtract: State.calc.subtract,
    });
    parts.push(mix.reserve > 0
      ? `на ${trim(State.calc.area)} м² — <b>${fmt(mix.mix)} г</b> смеси плюс запас ${mix.reservePct}% = <b>${fmt(mix.total)} г</b>`
      : `на ${trim(State.calc.area)} м² нужно <b>${fmt(mix.mix)} г</b> смеси`);
  }

  if (!parts.length) { el.hidden = true; return; }
  el.innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" style="flex-shrink:0;margin-top:1px"><circle cx="8" cy="8" r="6.5"/><path d="M8 7.2v4M8 4.8h.01"/></svg><span>${parts.join(' · ')}</span>`;
  el.hidden = false;
}

// ====== ТЕМПЕРАТУРА ======
function updateZonePill(temp) {
  const zone = getTempZone(temp);
  const labels = { cold: 'Холодно', normal: 'Норма', warm: 'Тепло', hot: 'Жарко' };
  const pill = document.getElementById('zone-pill');
  pill.textContent = labels[zone];
  pill.dataset.zone = zone;
}

function syncTempChips(temp) {
  document.querySelectorAll('[data-temp]').forEach(c =>
    c.classList.toggle('active', Number(c.dataset.temp) === temp));
}

function updateAdjustments() {
  const el = document.getElementById('temp-adjustments');
  const mat = State.calc.mode === 'custom' ? CUSTOM_CHEM : getMaterial();
  if (!mat) { el.innerHTML = ''; updateSubtractRow(); return; }
  const adj = getTempAdjustments(mat, State.calc.temperature);
  el.innerHTML = adj.map(a =>
    `<div class="adj-item" data-kind="${esc(a.type)}">
       <span class="adj-icon">${a.icon}</span><span>${esc(a.text)}</span>
     </div>`).join('');
  if (mat.chemistry === 'pe') populateHardeners();
  updateSubtractRow();
}

// ====== ИСТОРИЯ ======
function getHistory() {
  try {
    const raw = safeGet(HISTORY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    const fresh = list.filter(e => Date.now() - e.timestamp < HISTORY_TTL);
    if (fresh.length !== list.length) safeSet(HISTORY_KEY, JSON.stringify(fresh));
    return fresh;
  } catch { return []; }
}

function saveToHistory(r) {
  const list = getHistory();
  list.unshift({
    id: 'h' + r.timestamp,
    timestamp: r.timestamp,
    materialId: r.material ? r.material.id : '',
    code: r.material ? r.material.code : 'Свой расчёт',
    name: r.material ? getShortName(r.material.name, r.material.code) : 'произвольные пропорции',
    hRatio: r.hRatio, tRatio: r.tRatio, subtract: r.deducted,
    hardenerId: r.hardenerId, thinnerId: r.thinnerId,
    base: r.base, hardener: r.hardener, thinner: r.thinner,
    accelerator: r.accelerator, retarder: r.retarder, total: r.total,
    temp: r.temp, mode: r.mode, area: r.area, reserve: r.reservePct,
  });
  safeSet(HISTORY_KEY, JSON.stringify(list.slice(0, 100)));
}

function initHistory() {
  document.getElementById('clear-history-btn').addEventListener('click', () => {
    if (!getHistory().length) { showToast('История уже пуста'); return; }
    if (!confirm('Удалить всю историю расчётов?')) return;
    safeSet(HISTORY_KEY, '[]');
    renderHistory();
    showToast('История очищена');
  });
}

function renderHistory() {
  const list = getHistory();
  const el = document.getElementById('history-list');
  document.getElementById('history-count').textContent = list.length;
  document.getElementById('history-empty').hidden = list.length > 0;

  el.innerHTML = list.map(h => {
    const figs = [
      `<span class="hist-fig">основа <b>${fmt(h.base)} г</b></span>`,
      h.hardener > 0 ? `<span class="hist-fig">${esc(h.hardenerId)} <b>${fmt(h.hardener)} г</b></span>` : '',
      h.thinner > 0 ? `<span class="hist-fig">${esc(h.thinnerId)} <b>${fmt(h.thinner)} г</b></span>` : '',
      `<span class="hist-fig">итого <b>${fmt(h.total)} г</b></span>`,
    ].filter(Boolean).join('');

    return `<div class="hist-item">
      <div class="hist-top">
        <div>
          <div class="hist-code">${esc(h.code)}</div>
          <div class="hist-name">${esc(h.name)} · ${h.temp}°C${h.mode === 'area' ? ' · ' + trim(h.area) + ' м²' : ''}</div>
        </div>
        <div class="hist-date">${dateText(h.timestamp)}</div>
      </div>
      <div class="hist-figs">${figs}</div>
      <div class="hist-acts">
        <button class="btn btn-sm btn-outline" data-repeat="${esc(h.id)}">Повторить</button>
        <button class="btn btn-sm btn-danger-outline" data-del="${esc(h.id)}">Удалить</button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    safeSet(HISTORY_KEY, JSON.stringify(getHistory().filter(e => e.id !== b.dataset.del)));
    renderHistory();
    showToast('Запись удалена');
  }));
  el.querySelectorAll('[data-repeat]').forEach(b => b.addEventListener('click', () => {
    const h = getHistory().find(e => e.id === b.dataset.repeat);
    if (h) repeatCalc(h);
  }));
}

function repeatCalc(h) {
  if (h.mode === 'custom') {
    Object.assign(State.calc, {
      mode: 'custom', temperature: h.temp, quantity: h.base, unit: 'g',
      hRatioCustom: h.hRatio, tRatioCustom: h.tRatio, subtract: !!h.subtract,
    });
    switchTab('calc');
    syncModeButtons('custom');
    document.getElementById('calc-quantity').value = trim(h.base);
    document.getElementById('unit-label').textContent = 'г';
    document.getElementById('custom-hardener').value = h.hRatio;
    document.getElementById('custom-thinner').value = h.tRatio;
    document.getElementById('subtract-check').checked = !!h.subtract;
    document.getElementById('calc-temp').value = h.temp;
    syncTempChips(h.temp);
    updateZonePill(h.temp);
    updateAdjustments();
    calculate(false);
    return;
  }

  const mat = getAllMaterials().find(m => m.id === h.materialId);
  if (!mat) { showToast('Материал больше не доступен'); return; }

  State.calc.manufacturer = mat.manufacturer;
  State.calc.materialId = mat.id;
  State.calc.temperature = h.temp;
  State.calc.mode = h.mode;
  State.calc.area = h.area;
  State.calc.reserve = h.reserve;
  State.calc.quantity = h.base;
  State.calc.unit = 'g';

  switchTab('calc');
  populateManufacturers();
  populateMaterials();
  document.getElementById('calc-material').value = mat.id;
  populateHardeners();
  populateThinners();
  if (h.hardenerId) { State.calc.hardenerId = h.hardenerId; document.getElementById('calc-hardener').value = h.hardenerId; }
  if (h.thinnerId) { State.calc.thinnerId = h.thinnerId; document.getElementById('calc-thinner').value = h.thinnerId; }

  syncModeButtons(h.mode);

  document.getElementById('calc-temp').value = h.temp;
  document.getElementById('calc-area').value = h.area;
  document.getElementById('calc-quantity').value = trim(h.base);
  document.getElementById('unit-label').textContent = 'г';
  State.calc.subtract = !!h.subtract;
  document.getElementById('subtract-check').checked = !!h.subtract;
  syncTempChips(h.temp);
  updateZonePill(h.temp);
  updateAdjustments();
  updateCoverageInfo();
  calculate(false);
}

// ====== БИБЛИОТЕКА ======
function initLibrary() {
  bindChips('.filter-scroll [data-filter]', btn => {
    State.lib.filter = btn.dataset.filter;
    renderLibrary();
  });
  document.getElementById('lib-search').addEventListener('input', function () {
    State.lib.search = this.value.trim().toLowerCase();
    renderLibrary();
  });
}

function renderLibrary() {
  const { filter, search } = State.lib;
  let list = getAllMaterials();

  if (filter !== 'all') {
    list = list.filter(m => filter === 'pe' || filter === 'wb' ? m.chemistry === filter : m.type === filter);
  }
  if (search) {
    list = list.filter(m =>
      m.code.toLowerCase().includes(search) || m.name.toLowerCase().includes(search));
  }

  document.getElementById('lib-count').textContent = list.length;
  document.getElementById('library-empty').hidden = list.length > 0;

  const el = document.getElementById('library-list');
  el.innerHTML = list.map(m => {
    const mixRows = [
      `<div class="mix-row"><span class="comp-dot" data-c="base"></span>${esc(m.code)} (основа)<b>100%</b></div>`,
      ...(m.hardeners || []).map(h =>
        `<div class="mix-row"><span class="comp-dot" data-c="hardener"></span>${esc(h.id)}<b>${rangeText(h)}</b></div>`),
      ...(m.accelerators || []).map(a =>
        `<div class="mix-row"><span class="comp-dot" data-c="accelerator"></span>${esc(a.id)} (ускоритель)<b>${rangeText(a)}</b></div>`),
      ...(m.thinners || []).map(t =>
        `<div class="mix-row"><span class="comp-dot" data-c="thinner"></span>${esc(t.id)}<b>${rangeText(t)}</b></div>`),
    ].join('');

    return `<div class="lib-card" data-id="${esc(m.id)}">
      <div class="lib-head">
        <div class="lib-swatch" data-chem="${esc(m.chemistry)}">${esc(CHEM_SHORT[m.chemistry] || '?')}</div>
        <div class="lib-info">
          <div class="lib-code">${esc(m.code)}</div>
          <div class="lib-desc">${esc(getShortName(m.name, m.code))}</div>
        </div>
        <svg class="lib-chev" viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l5 5 5-5"/></svg>
      </div>
      <div class="lib-body">
        ${m.description ? `<div class="lib-text">${esc(m.description)}</div>` : ''}
        <div class="lib-specs">
          ${m.coverage ? `<div class="spec"><div class="spec-k">Расход</div><div class="spec-v">${m.coverage} г/м²</div></div>` : ''}
          ${m.dryResidue ? `<div class="spec"><div class="spec-k">Сухой остаток</div><div class="spec-v">${m.dryResidue}%</div></div>` : ''}
          <div class="spec"><div class="spec-k">Тип</div><div class="spec-v" style="font-size:13px">${esc(TYPE_LABELS[m.type] || m.type)}</div></div>
        </div>
        <div class="lib-mix">${mixRows}</div>
        ${m.note ? `<div class="result-note">${esc(m.note)}</div>` : ''}
        <div class="tag-row">
          <span class="tag" data-t="chem">${esc(CHEM_LABELS[m.chemistry] || m.chemistry)}</span>
          ${m.outdoor ? '<span class="tag">для улицы</span>' : ''}
          ${m.thixotropic ? '<span class="tag">тиксотропный</span>' : ''}
          ${m.chemistry === 'pe' ? '<span class="tag" data-t="warn">нужен ускоритель EA1</span>' : ''}
        </div>
        <button class="btn btn-primary btn-sm btn-block" style="margin-top:12px" data-calc="${esc(m.id)}">Рассчитать этот материал</button>
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('.lib-head').forEach(head =>
    head.addEventListener('click', () => head.parentElement.classList.toggle('open')));

  el.querySelectorAll('[data-calc]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const mat = getAllMaterials().find(m => m.id === btn.dataset.calc);
    if (!mat) return;
    State.calc.manufacturer = mat.manufacturer;
    State.calc.materialId = mat.id;
    // в произвольном режиме карточки материала нет — возвращаем режим массы
    if (State.calc.mode === 'custom') {
      State.calc.mode = 'quantity';
      syncModeButtons('quantity');
    }
    switchTab('calc');
    populateManufacturers();
    populateMaterials();
    document.getElementById('calc-material').value = mat.id;
    populateHardeners();
    populateThinners();
    updateCoverageInfo();
    updateAdjustments();
  }));
}

// ====== УСТАНОВКА PWA ======
function initInstall() {
  let deferred = null;
  const box = document.getElementById('install-prompt');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e;
    if (!safeGet('pwaDismissed')) box.hidden = false;
  });

  document.getElementById('install-btn').addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    box.hidden = true;
  });

  document.getElementById('install-dismiss').addEventListener('click', () => {
    safeSet('pwaDismissed', '1');
    box.hidden = true;
  });

  document.getElementById('pw-toggle').addEventListener('click', () => {
    const inp = document.getElementById('login-password');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });
}

// ====== УТИЛИТЫ ======
function getShortName(name, code) {
  return String(name).replace(new RegExp('^' + code + '\\s*[—–-]\\s*'), '');
}

function fmt(n) {
  if (n == null || isNaN(n)) return '0';
  if (n >= 1000) return (Math.round(n * 10) / 10).toLocaleString('ru-RU');
  if (n >= 100) return String(Math.round(n));
  return String(Math.round(n * 10) / 10);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function trim(n) {
  return String(Math.round(Number(n) * 100) / 100);
}

function dateText(ts) {
  const d = new Date(ts);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return sameDay ? 'сегодня ' + time
    : d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }) + ' ' + time;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch {} }

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;

  // Была ли страница уже под управлением воркера: при самой первой
  // установке перезагружать нечего.
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded) return;
    reloaded = true;
    location.reload();
  });

  navigator.serviceWorker.register('sw.js').catch(() => {});
}
