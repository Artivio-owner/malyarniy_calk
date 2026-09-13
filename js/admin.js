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

  if (email !== ADMIN_LOGIN) {
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
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
