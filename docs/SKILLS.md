# Навыки и технологии проекта
# Маляр Калькулятор МДФ

Документ описывает технологии, паттерны и практики, применённые при разработке данного PWA-приложения.

---

## 1. Progressive Web App (PWA)

**Что используется:**
- `manifest.json` — описывает приложение (имя, иконки, цвет темы, ориентация)
- `sw.js` (Service Worker) — перехват сетевых запросов, кеширование
- `Cache API` — кеш-стратегия Cache-First для офлайн-работы
- `beforeinstallprompt` — событие для пользовательского предложения установки

**Зачем:**  
Приложение доступно без интернета, устанавливается как нативное на Android/iOS. Маляры на стройке часто работают без стабильного интернета.

**Паттерн Cache-First:**
```js
caches.match(request).then(cached => cached || fetch(request))
```

---

## 2. Vanilla JavaScript (ES2020+)

**Без фреймворков.** Осознанное решение — приложение небольшое, фреймворки добавляют излишний вес и зависимости для задачи такого масштаба.

**Использованные возможности языка:**
- `async/await` + `Promise` — для хеширования пароля и SW-операций
- `Optional chaining` (`?.`) — безопасный доступ к вложенным свойствам
- `Nullish coalescing` (`??`) — значения по умолчанию
- `Array destructuring`, `spread`, `template literals`
- `Array.prototype.find/filter/map/reduce`
- `Object.entries/values` для итерации по словарям

---

## 3. Web Crypto API

**Навык:** Хеширование паролей в браузере без серверной части.

```js
const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(password));
const hash = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0')).join('');
```

**Зачем:**  
Пароль администратора никогда не хранится открыто. В коде присутствует только SHA-256 хеш. Проверка происходит на стороне клиента без запросов к серверу.

---

## 4. LocalStorage / SessionStorage

| Хранилище     | Что хранится                         | Срок          |
|---------------|--------------------------------------|---------------|
| localStorage  | История расчётов (30 дней, TTL)      | Постоянно     |
| localStorage  | Пользовательские данные (материалы)  | Постоянно     |
| sessionStorage| Сессия администратора (8 часов)      | До закрытия вкладки |

**Паттерн TTL в localStorage:**
```js
const entries = JSON.parse(localStorage.getItem(KEY) || '[]');
const fresh = entries.filter(e => Date.now() - e.timestamp < 30 * 24 * 3600 * 1000);
```

---

## 5. CSS Custom Properties (переменные) + Dark Mode

**Паттерн:**
```css
:root {
  --primary: #2e7d32;
  --bg-surface: #ffffff;
  --text: #1a1a1a;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-surface: #1e1e1e;
    --text: #f5f5f5;
  }
}
:root[data-theme="dark"] { ... }
```

**Результат:** Тёмная тема работает автоматически по системным настройкам и переключается вручную через атрибут `data-theme`.

---

## 6. Mobile-First CSS

Весь CSS написан для мобильных устройств как базовый случай, десктопные стили добавляются через `@media (min-width: ...)`.

**Паттерны:**
- `position: fixed` для header и bottom nav с отступами через `env(safe-area-inset-*)`
- `padding-bottom: calc(60px + env(safe-area-inset-bottom))` для контента под навбаром
- `flex-wrap: wrap` для адаптации форм
- CSS Grid для таблиц результатов

---

## 7. Доступность (Accessibility / a11y)

**Применённые практики:**
- Семантические элементы: `<header>`, `<nav>`, `<main>`, `<section>`
- ARIA-роли: `role="tablist"`, `role="tab"`, `role="dialog"`, `role="group"`
- `aria-label` для кнопок-иконок без текста
- `aria-live="polite"` для области результатов
- `aria-hidden="true"` для декоративных SVG
- `hidden` атрибут вместо `display:none` (совместим с `[hidden]{display:none!important}`)
- Подписи форм через `<label for="...">` c `id`

---

## 8. Web Share API

```js
if (navigator.share) {
  await navigator.share({ title, text, url: window.location.href });
}
```

Позволяет мастеру отправить расчёт коллеге через мессенджер прямо из браузера.

---

## 9. SVG-иконки (inline / embedded)

Все иконки — inline SVG (не иконочный шрифт, не растровые изображения). Преимущества:
- Нет дополнительных HTTP-запросов
- Масштабируются без потери качества
- Стилизуются через CSS (`stroke: currentColor`)
- Доступны (`aria-hidden`, `aria-label`)

---

## 10. Архитектура без сборщика (Zero-Build)

**Без Webpack, Vite, Babel.** Чистый HTML + CSS + JS.

**Преимущества для этого проекта:**
- Нет зависимостей (`node_modules`)
- Мгновенный деплой (просто загрузить файлы)
- Простая поддержка (любой разработчик разберётся)
- Меньший размер — нет рантайма фреймворка

**Компромисс:** Нет tree-shaking и минификации автоматически. При необходимости можно добавить на CI.

---

## 11. Паттерн «Слоистые данные»

Базовые данные в `data.js` + пользовательские данные в localStorage объединяются в рантайме:

```js
function getAllMaterials() {
  const base = [...MATERIALS];
  const custom = getCustomData();
  // Применяем кастомные изменения поверх базовых
  custom.materials?.forEach(cm => {
    const idx = base.findIndex(m => m.id === cm.id);
    if (idx >= 0) base[idx] = cm; // override
    else base.push(cm); // new
  });
  // Удаляем помеченные к удалению
  custom.deleted?.forEach(id => {
    const idx = base.findIndex(m => m.id === id);
    if (idx >= 0) base.splice(idx, 1);
  });
  return base;
}
```

---

## 12. Формульное мышление (бизнес-логика)

### Расчёт по количеству (прямой)
```
компонент = основа × (пропорция / 100)
```

### Расчёт по площади (обратный)
```
totalMix = площадь × расход_г_м2 × (1 + запас / 100)
делитель = 1 + Σ(все_пропорции / 100)
основа = totalMix / делитель
компонент_i = основа × (пропорция_i / 100)
```

Правило «замедлитель вытесняет разбавитель» при высоких температурах:
```
разбавитель_факт = max(0, разбавитель_расчёт - замедлитель)
```

---

## 13. Git / GitHub Flow

- Ветка разработки: `claude/painter-mdf-calculator-khvq3d`
- PR → draft → review → merge в `main`
- Коммиты на русском или английском языке, описывают суть изменений

---

## Итог

Проект демонстрирует, что полнофункциональное мобильное приложение для профессионального использования можно создать без фреймворков и backend-инфраструктуры, используя только браузерные стандарты 2024–2025 года.
