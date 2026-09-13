// ============================================================
//  Маляр Калькулятор — Административная панель
//  Пароль хранится только как SHA-256 хеш
// ============================================================

'use strict';

// SHA-256 хеш от пароля "010203gg"
const ADMIN_HASH = 'ed5f5d0f222cc4911d83a060ce2056233c345c4d7c9a1c61edb0f267b1d690cc';
const ADMIN_LOGIN = 'Net.buzz@mail.ru';
const SESSION_KEY = 'paintCalc_adminSession';

let adminAuthenticated = false;

// ====== ИНИЦИАЛИЗАЦИЯ ======
document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
});

function initAdmin() {
  // Кнопка открытия
  document.getElementById('admin-btn').addEventListener('click', openAdmin);

  // Закрытие оверлея
  document.getElementById('admin-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('admin-overlay')) closeAdmin();
  });

  // Кнопка закрытия
  document.getElementById('admin-close-btn').addEventListener('click', closeAdmin);

  // Форма входа
  document.getElementById('admin-login-form').addEventListener('submit', handleLogin);

  // Вкладки админки
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchAdminTab(btn.dataset.admintab);
    });
  });

  // Проверяем сессию
  checkAdminSession();
}

function checkAdminSession() {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const sess = JSON.parse(sessionData);
      if (sess.authenticated && sess.expires > Date.now()) {
        adminAuthenticated = true;
      }
    }
  } catch {}
}

function openAdmin() {
  const overlay = document.getElementById('admin-overlay');
  overlay.classList.add('open');
  if (adminAuthenticated) {
    showAdminPanel();
  } else {
    showLoginForm();
  }
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
}

function showLoginForm() {
  document.getElementById('admin-login-view').hidden = false;
  document.getElementById('admin-panel-view').hidden = true;
  document.getElementById('admin-error').hidden = true;
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
}

function showAdminPanel() {
  document.getElementById('admin-login-view').hidden = true;
  document.getElementById('admin-panel-view').hidden = false;
  loadAdminContent();
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('admin-error');
  const btn = document.getElementById('login-submit-btn');

  // Почта нечувствительна к регистру: net.buzz@… и Net.buzz@… — один адрес
  if (email.toLowerCase() !== ADMIN_LOGIN.toLowerCase()) {
    errorEl.textContent = 'Неверный логин или пароль';
    errorEl.hidden = false;
    return;
  }

  // Хешируем пароль через SubtleCrypto
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';
  try {
    const hash = await hashPassword(password);
    if (hash === ADMIN_HASH) {
      adminAuthenticated = true;
      // Сессия на 8 часов
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        authenticated: true,
        expires: Date.now() + 8 * 60 * 60 * 1000
      }));
      showAdminPanel();
      errorEl.hidden = true;
    } else {
      errorEl.textContent = 'Неверный логин или пароль';
      errorEl.hidden = false;
    }
  } catch (err) {
    errorEl.textContent = 'Ошибка проверки пароля: ' + err.message;
    errorEl.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Войти';
  }
}

async function hashPassword(password) {
  // crypto.subtle есть только в защищённом контексте (https или localhost).
  // По http на телефоне или из file:// его нет — тогда считаем сами.
  if (window.crypto && crypto.subtle) {
    const data = new TextEncoder().encode(password);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return sha256(password);
}

// Резервная реализация SHA-256 для незащищённого контекста.
function sha256(str) {
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  const H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);

  const bytes = new TextEncoder().encode(str);
  const bitLen = bytes.length * 8;
  const padded = new Uint8Array((bytes.length + 9 + 63) & ~63);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000), false);
  dv.setUint32(padded.length - 4, bitLen >>> 0, false);

  const w = new Uint32Array(64);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));

  for (let off = 0; off < padded.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const x = w[i - 15], y = w[i - 2];
      const s0 = rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
      const s1 = rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }

    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }

  return [...H].map(x => x.toString(16).padStart(8, '0')).join('');
}

function adminLogout() {
  adminAuthenticated = false;
  sessionStorage.removeItem(SESSION_KEY);
  showLoginForm();
  showToast('Выход выполнен');
}
window.adminLogout = adminLogout;

// ====== ВКЛАДКИ АДМИНКИ ======
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelector(`.admin-tab-btn[data-admintab="${tab}"]`)?.classList.add('active');
  document.getElementById('admin-section-' + tab)?.classList.add('active');
  if (tab === 'materials') loadMaterialsList();
  if (tab === 'manufacturers') loadManufacturersList();
  if (tab === 'info') loadInfoSection();
}

function loadAdminContent() {
  switchAdminTab('materials');
}

// ====== УПРАВЛЕНИЕ МАТЕРИАЛАМИ ======
function loadMaterialsList() {
  const el = document.getElementById('admin-materials-list');
  const materials = getAllMaterials();
  const custom = getCustomData();

  el.innerHTML = materials.map(m => {
    const isCustom = m._custom || (custom.materials && custom.materials.some(cm => cm.id === m.id));
    const mf = getAllManufacturers().find(mf => mf.id === m.manufacturer);
    return `<div class="admin-list-item">
      <div>
        <div class="admin-list-item-name">${m.code}</div>
        <div class="admin-list-item-meta">${mf?.name || m.manufacturer} · ${TYPE_LABELS[m.type] || m.type} · ${CHEM_LABELS[m.chemistry] || m.chemistry}${isCustom ? ' · ✎ изменён' : ''}</div>
      </div>
      <div class="admin-actions">
        <button class="btn btn-sm btn-outline" onclick="editMaterial('${m.id}')">✎</button>
        ${isCustom ? `<button class="btn btn-sm btn-danger-outline" onclick="deleteMaterial('${m.id}')">✕</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function showAddMaterialModal() {
  showModal({
    title: 'Добавить материал',
    content: buildMaterialForm(null),
    confirmLabel: 'Добавить',
    onConfirm: () => saveMaterialFromForm(null),
  });
}
window.showAddMaterialModal = showAddMaterialModal;

function editMaterial(id) {
  const mat = getAllMaterials().find(m => m.id === id);
  if (!mat) return;
  showModal({
    title: 'Редактировать: ' + mat.code,
    content: buildMaterialForm(mat),
    confirmLabel: 'Сохранить',
    onConfirm: () => saveMaterialFromForm(id),
  });
}
window.editMaterial = editMaterial;

function deleteMaterial(id) {
  if (!confirm('Удалить этот материал?')) return;
  const custom = getCustomData();
  // Если это кастомный — удаляем из custom.materials
  if (custom.materials) {
    custom.materials = custom.materials.filter(m => m.id !== id);
  }
  // Если это базовый — добавляем в список удалённых
  const base = MATERIALS.find(m => m.id === id);
  if (base) {
    if (!custom.deleted) custom.deleted = [];
    if (!custom.deleted.includes(id)) custom.deleted.push(id);
  }
  saveCustomData(custom);
  loadMaterialsList();
  showToast('Материал удалён');
}
window.deleteMaterial = deleteMaterial;

function buildMaterialForm(mat) {
  const manufacturers = getAllManufacturers();
  const chemOptions = [
    ['pu', 'Полиуретановый (ПУ)'],
    ['ac', 'Акриловый (АК)'],
    ['pe', 'Полиэфирный (ПЭ)'],
    ['wb', 'Водоразбавимый (ВР)'],
    ['solvent', 'На растворителе'],
  ];
  const typeOptions = Object.entries(TYPE_LABELS);

  return `
  <div class="field"><label>Код материала *</label>
    <input type="text" id="mf-code" value="${mat?.code || ''}" placeholder="Например: PPS20" required></div>
  <div class="field"><label>Название *</label>
    <input type="text" id="mf-name" value="${mat ? getShortName(mat.name, mat.code) : ''}" placeholder="Грунт ПУ белый универсальный" required></div>
  <div class="field"><label>Производитель</label>
    <select id="mf-manufacturer">
      ${manufacturers.map(m => `<option value="${m.id}" ${mat?.manufacturer === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
    </select></div>
  <div class="field"><label>Тип материала</label>
    <select id="mf-type">
      ${typeOptions.map(([v, l]) => `<option value="${v}" ${mat?.type === v ? 'selected' : ''}>${l}</option>`).join('')}
    </select></div>
  <div class="field"><label>Химия</label>
    <select id="mf-chemistry">
      ${chemOptions.map(([v, l]) => `<option value="${v}" ${mat?.chemistry === v ? 'selected' : ''}>${l}</option>`).join('')}
    </select></div>
  <div class="field"><label>Описание</label>
    <textarea id="mf-desc" rows="3">${mat?.description || ''}</textarea></div>
  <div class="field-row">
    <div class="field"><label>Сухой остаток, %</label>
      <input type="number" id="mf-dry" value="${mat?.dryResidue || ''}" min="0" max="100"></div>
    <div class="field"><label>Расход, г/м²</label>
      <input type="number" id="mf-coverage" value="${mat?.coverage || ''}" min="0"></div>
  </div>
  <div class="field"><label>Пропорции (JSON)</label>
    <textarea id="mf-json" rows="4" placeholder='{"hardeners":[{"id":"PC20","ratio":50}],"thinners":[{"id":"S50","ratioMin":20,"ratioMax":30}]}'>${mat ? JSON.stringify({hardeners:mat.hardeners, thinners:mat.thinners, accelerators:mat.accelerators}, null, 2) : ''}</textarea></div>
  <div class="field"><label>Примечания</label>
    <input type="text" id="mf-note" value="${mat?.note || ''}"></div>`;
}

function saveMaterialFromForm(existingId) {
  const code = document.getElementById('mf-code').value.trim();
  const name = document.getElementById('mf-name').value.trim();
  if (!code || !name) {
    showToast('Укажите код и название');
    return false;
  }

  let jsonProps = {};
  try {
    const jsonText = document.getElementById('mf-json').value.trim();
    if (jsonText) jsonProps = JSON.parse(jsonText);
  } catch {
    showToast('Ошибка в JSON пропорций');
    return false;
  }

  const newMat = {
    id: existingId || (code.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()),
    code,
    name: code + ' — ' + name,
    manufacturer: document.getElementById('mf-manufacturer').value,
    type: document.getElementById('mf-type').value,
    chemistry: document.getElementById('mf-chemistry').value,
    description: document.getElementById('mf-desc').value.trim(),
    dryResidue: parseFloat(document.getElementById('mf-dry').value) || null,
    coverage: parseFloat(document.getElementById('mf-coverage').value) || null,
    note: document.getElementById('mf-note').value.trim(),
    hardeners: jsonProps.hardeners || [],
    thinners: jsonProps.thinners || [],
    accelerators: jsonProps.accelerators || [],
  };

  const custom = getCustomData();
  if (!custom.materials) custom.materials = [];
  const idx = custom.materials.findIndex(m => m.id === newMat.id);
  if (idx >= 0) {
    custom.materials[idx] = newMat;
  } else {
    custom.materials.push(newMat);
  }
  saveCustomData(custom);
  loadMaterialsList();
  populateMaterials();
  showToast('Материал сохранён');
  return true;
}

// ====== ПРОИЗВОДИТЕЛИ ======
function loadManufacturersList() {
  const el = document.getElementById('admin-manufacturers-list');
  const manufacturers = getAllManufacturers();
  const custom = getCustomData();

  el.innerHTML = manufacturers.map(m => {
    const isBase = m.id === 'technocolor';
    const isCustom = custom.manufacturers && custom.manufacturers.some(cm => cm.id === m.id);
    return `<div class="admin-list-item">
      <div>
        <div class="admin-list-item-name">${m.name}</div>
        <div class="admin-list-item-meta">${m.website || '—'}${isBase ? ' · Базовый' : ''}</div>
      </div>
      <div class="admin-actions">
        ${!isBase ? `<button class="btn btn-sm btn-outline" onclick="editManufacturer('${m.id}')">✎</button>` : ''}
        ${isCustom ? `<button class="btn btn-sm btn-danger-outline" onclick="deleteManufacturer('${m.id}')">✕</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function showAddManufacturerModal() {
  showModal({
    title: 'Добавить производителя',
    content: buildManufacturerForm(null),
    confirmLabel: 'Добавить',
    onConfirm: () => saveManufacturerFromForm(null),
  });
}
window.showAddManufacturerModal = showAddManufacturerModal;

function editManufacturer(id) {
  const mf = getAllManufacturers().find(m => m.id === id);
  if (!mf) return;
  showModal({
    title: 'Редактировать: ' + mf.name,
    content: buildManufacturerForm(mf),
    confirmLabel: 'Сохранить',
    onConfirm: () => saveManufacturerFromForm(id),
  });
}
window.editManufacturer = editManufacturer;

function deleteManufacturer(id) {
  if (!confirm('Удалить производителя?')) return;
  const custom = getCustomData();
  if (custom.manufacturers) {
    custom.manufacturers = custom.manufacturers.filter(m => m.id !== id);
  }
  if (custom.materials) {
    custom.materials = custom.materials.filter(m => m.manufacturer !== id);
  }
  saveCustomData(custom);
  loadManufacturersList();
  populateManufacturers();
  populateMaterials();
  showToast('Производитель удалён');
}
window.deleteManufacturer = deleteManufacturer;

function buildManufacturerForm(mf) {
  return `
  <div class="field"><label>Название *</label>
    <input type="text" id="mfr-name" value="${mf?.name || ''}" placeholder="Например: ТехноКолор" required></div>
  <div class="field"><label>Веб-сайт</label>
    <input type="text" id="mfr-website" value="${mf?.website || ''}" placeholder="www.example.ru"></div>
  <div class="field"><label>Телефон</label>
    <input type="text" id="mfr-phone" value="${mf?.phone || ''}" placeholder="+7 (000) 000-00-00"></div>
  <div class="field"><label>Email</label>
    <input type="text" id="mfr-email" value="${mf?.email || ''}" placeholder="info@example.ru"></div>
  <div class="field"><label>Описание</label>
    <textarea id="mfr-desc" rows="2">${mf?.description || ''}</textarea></div>`;
}

function saveManufacturerFromForm(existingId) {
  const name = document.getElementById('mfr-name').value.trim();
  if (!name) { showToast('Укажите название'); return false; }

  const mf = {
    id: existingId || ('mfr_' + Date.now()),
    name,
    website: document.getElementById('mfr-website').value.trim(),
    phone: document.getElementById('mfr-phone').value.trim(),
    email: document.getElementById('mfr-email').value.trim(),
    description: document.getElementById('mfr-desc').value.trim(),
  };

  const custom = getCustomData();
  if (!custom.manufacturers) custom.manufacturers = [];
  const idx = custom.manufacturers.findIndex(m => m.id === mf.id);
  if (idx >= 0) { custom.manufacturers[idx] = mf; }
  else { custom.manufacturers.push(mf); }
  saveCustomData(custom);
  loadManufacturersList();
  populateManufacturers();
  showToast('Производитель сохранён');
  return true;
}

// ====== ИНФОРМАЦИЯ ======
function loadInfoSection() {
  const el = document.getElementById('admin-info-content');
  const custom = getCustomData();
  el.innerHTML = `
  <div class="field"><label>Название сайта</label>
    <input type="text" id="site-title" value="${custom.siteTitle || 'Маляр Калькулятор МДФ'}"></div>
  <div class="field"><label>Подзаголовок / описание</label>
    <textarea id="site-desc" rows="2">${custom.siteDesc || 'Расчёт лакокрасочных материалов для маляров'}</textarea></div>
  <div class="field"><label>Контактный телефон</label>
    <input type="text" id="site-phone" value="${custom.sitePhone || ''}"></div>
  <button class="btn btn-primary" onclick="saveInfoSection()">Сохранить</button>
  <hr class="divider">
  <h3 style="color:var(--primary);font-size:16px;margin-bottom:12px;">Статистика</h3>
  <div class="admin-list-item">
    <div class="admin-list-item-name">Материалов в базе</div>
    <div>${getAllMaterials().length}</div>
  </div>
  <div class="admin-list-item">
    <div class="admin-list-item-name">Записей в истории</div>
    <div>${getHistory().length}</div>
  </div>
  <div class="admin-list-item">
    <div class="admin-list-item-name">Производителей</div>
    <div>${getAllManufacturers().length}</div>
  </div>
  <hr class="divider">
  <button class="btn btn-danger-outline" style="width:100%;margin-top:8px" onclick="resetAllData()">🗑 Сбросить все пользовательские данные</button>
  <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="exportData()">📤 Экспорт данных</button>
  <button class="btn btn-outline" style="width:100%;margin-top:8px" onclick="importDataPrompt()">📥 Импорт данных</button>
  `;
}

function saveInfoSection() {
  const custom = getCustomData();
  custom.siteTitle = document.getElementById('site-title').value.trim();
  custom.siteDesc = document.getElementById('site-desc').value.trim();
  custom.sitePhone = document.getElementById('site-phone').value.trim();
  saveCustomData(custom);
  if (custom.siteTitle) {
    document.querySelector('#app-header h1').textContent = custom.siteTitle;
  }
  showToast('Настройки сохранены');
}
window.saveInfoSection = saveInfoSection;

function resetAllData() {
  if (!confirm('Сбросить все пользовательские данные? Базовые материалы ТехноКолор останутся.')) return;
  localStorage.removeItem('paintCalc_customData');
  localStorage.removeItem('paintCalc_history');
  showToast('Данные сброшены');
  loadAdminContent();
}
window.resetAllData = resetAllData;

function exportData() {
  const data = {
    customData: getCustomData(),
    history: getHistory(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'malyar-calc-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}
window.exportData = exportData;

function importDataPrompt() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.customData) saveCustomData(data.customData);
        if (data.history) localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
        showToast('Данные импортированы');
        loadAdminContent();
        populateManufacturers();
        populateMaterials();
      } catch {
        showToast('Ошибка: неверный формат файла');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
window.importDataPrompt = importDataPrompt;

// ====== МОДАЛЬНОЕ ОКНО ======
let modalConfirmCallback = null;

function showModal({ title, content, confirmLabel = 'OK', onConfirm }) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-content').innerHTML = content;
  document.getElementById('modal-confirm-btn').textContent = confirmLabel;
  document.getElementById('modal-overlay').classList.add('open');
  modalConfirmCallback = onConfirm;
}
window.showModal = showModal;

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  modalConfirmCallback = null;
}
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('modal-confirm-btn').addEventListener('click', () => {
    if (modalConfirmCallback) {
      const result = modalConfirmCallback();
      if (result !== false) closeModal();
    }
  });
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
});
