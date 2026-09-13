// TechnoColor 2025-2026 — База материалов
// Источник: Каталог продукции ТехноКолор 2025/2026

const TECHNOCOLOR = {
  id: 'technocolor',
  name: 'ТехноКолор',
  nameShort: 'TC',
  website: 'www.t-color.ru',
  phone: '+7 (495) 745-05-49',
  email: 'info@t-color.ru',
  catalogYear: '2025/2026',
  logo: '🟢'
};

const HARDENERS = {
  // ======= ПУ Ароматические =======
  PC10: {
    id: 'PC10', name: 'PC10', chemistry: 'pu', group: 'aromatic',
    description: 'Ароматический отвердитель для ПУ грунтов и матовых лаков, быстрый/твёрдый',
    dryResidue: 20, yellowing: 'high', speed: 'fast',
    note: 'Используется для PTS71, PTS72, PPS10'
  },
  PC20: {
    id: 'PC20', name: 'PC20', chemistry: 'pu', group: 'aromatic',
    description: 'Ароматический отвердитель для ПУ — стандартный, универсальный',
    dryResidue: 25, yellowing: 'high', speed: 'standard',
    note: 'Основной отвердитель для большинства ПУ материалов'
  },
  PC25: {
    id: 'PC25', name: 'PC25', chemistry: 'pu', group: 'aromatic',
    description: 'Ароматический отвердитель для ПУ — средний',
    dryResidue: 25, yellowing: 'high', speed: 'standard',
    note: 'Используется совместно с PC20'
  },
  PC60: {
    id: 'PC60', name: 'PC60', chemistry: 'pu', group: 'aromatic-yellow-resistant',
    description: 'Стойкий к пожелтению отвердитель для ПУ матовых лаков',
    dryResidue: 30, yellowing: 'low', speed: 'standard',
    note: 'Основной отвердитель для эмалей PPL серии'
  },
  PC72: {
    id: 'PC72', name: 'PC72', chemistry: 'pu', group: 'gloss',
    description: 'Отвердитель для глянцевых ПУ лаков',
    dryResidue: 40, yellowing: 'very-high', speed: 'fast',
    note: 'Для PTL202 (100 глосс) и адгезивных грунтов'
  },
  PC90: {
    id: 'PC90', name: 'PC90', chemistry: 'pu', group: 'parquet',
    description: 'Отвердитель для паркетных и лестничных ПУ лаков',
    dryResidue: 45, yellowing: 'high', speed: 'standard',
    note: 'Для PTL90 паркетного лака'
  },
  PC210: {
    id: 'PC210', name: 'PC210', chemistry: 'pu', group: 'aromatic-yellow-resistant',
    description: 'Стойкий к пожелтению ПУ отвердитель, медленный/эластичный',
    dryResidue: 35, yellowing: 'low', speed: 'slow',
    note: 'Для эластичных покрытий'
  },
  PC20042: {
    id: 'PC20042', name: 'PC20042', chemistry: 'pu', group: 'special',
    description: 'Специальный отвердитель для грунтов серии PPS40',
    dryResidue: 20, yellowing: 'high', speed: 'fast',
    note: 'Применяется только с PPS40'
  },
  // ======= ПУ Алифатические (для глянца) =======
  AC200: {
    id: 'AC200', name: 'AC200', chemistry: 'pu-ac', group: 'gloss',
    description: 'Алифатический отвердитель для высокоглянцевых ПУ и акриловых лаков (100 глосс)',
    dryResidue: 45, yellowing: 'very-low', speed: 'medium',
    note: 'Для PTL200, PPL200, PPL500, ATL200, ATL500, ATL203'
  },
  // ======= Акриловые (алифатические) =======
  AC40: {
    id: 'AC40', name: 'AC40', chemistry: 'ac', group: 'acrylic',
    description: 'Алифатический акриловый отвердитель — стандартный, стойкий к пожелтению',
    dryResidue: 35, yellowing: 'very-low', speed: 'standard',
    note: 'Основной отвердитель для большинства акриловых материалов'
  },
  AC41: {
    id: 'AC41', name: 'AC41', chemistry: 'ac', group: 'acrylic',
    description: 'Алифатический акриловый отвердитель — быстрый',
    dryResidue: 35, yellowing: 'very-low', speed: 'fast',
    note: 'Для быстрой сушки (ATL90, ATS20 при необходимости)'
  },
  // ======= Полиэфирные =======
  EC1: {
    id: 'EC1', name: 'EC1', chemistry: 'pe', group: 'polyester',
    description: 'Стандартный отвердитель для полиэфирных материалов',
    dryResidue: 0, yellowing: 'n/a', speed: 'standard',
    note: 'EC1 — стандартный. При температуре ниже 15°C предпочтителен.'
  },
  EC2: {
    id: 'EC2', name: 'EC2', chemistry: 'pe', group: 'polyester',
    description: 'Медленный отвердитель для полиэфирных материалов, увеличивает жизнеспособность',
    dryResidue: 0, yellowing: 'n/a', speed: 'slow',
    note: 'EC2 — медленный. При температуре выше 25°C предпочтителен.'
  },
  EA1: {
    id: 'EA1', name: 'EA1', chemistry: 'pe', group: 'polyester-accelerator',
    description: 'Ускоритель для полиэфирных материалов (обязательный компонент)',
    isAccelerator: true,
    note: 'Обязательный компонент для всех ПЭ материалов. При >30°C — 1%, при <30°C — 2%.'
  }
};

const THINNERS = {
  S10: {
    id: 'S10', name: 'S10', speed: 'fast',
    description: 'Быстрый, высокая разбавляющая способность',
    use: 'Морилки (мелкосос.), полиэфирные грунты, патины'
  },
  S11: {
    id: 'S11', name: 'S11', speed: 'medium',
    description: 'Средняя скорость испарения',
    use: 'Полиэфирные глянцевые лаки'
  },
  S12: {
    id: 'S12', name: 'S12', speed: 'medium',
    description: 'Средняя скорость испарения',
    use: 'Морилки (среднесосудистые породы)'
  },
  S13: {
    id: 'S13', name: 'S13', speed: 'fast',
    description: 'Быстрый',
    use: 'Морилки, патины, ПЭ, ПУ, акриловые, УФ материалы'
  },
  S30: {
    id: 'S30', name: 'S30', speed: 'medium',
    description: 'Средняя скорость испарения, хорошая разбавляющая способность',
    use: 'Полиуретановые, акриловые, УФ материалы'
  },
  S31: {
    id: 'S31', name: 'S31', speed: 'medium',
    description: 'Средняя скорость испарения, хорошая разбавляющая способность',
    use: 'ПУ и акриловые грунты, матовые лаки и эмали'
  },
  S50: {
    id: 'S50', name: 'S50', speed: 'slow',
    description: 'Низкая скорость испарения, средняя разбавляющая способность',
    use: 'Глубокоматовые и высокоглянцевые ПУ и акриловые материалы'
  },
  S51: {
    id: 'S51', name: 'S51', speed: 'slow',
    description: 'Низкая скорость испарения',
    use: 'Конвертеры по металлу PTL30 DM, PPL30 DM'
  },
  S70: {
    id: 'S70', name: 'S70', speed: 'slow',
    description: 'Низкая скорость испарения, средняя разбавляющая способность',
    use: 'Глубокоматовые и высокоглянцевые ПУ и акриловые материалы'
  },
  S80: {
    id: 'S80', name: 'S80', speed: 'slow',
    description: 'Низкая скорость испарения',
    use: 'Морилки крупнособудистой древесины; глянцевые лаки при высоких температурах'
  },
  S90: {
    id: 'S90', name: 'S90', speed: 'very-slow',
    description: 'Очень низкая скорость испарения',
    use: 'Морилки CTU, CQS'
  },
  S100: {
    id: 'S100', name: 'S100', speed: 'very-slow', isRetarder: true,
    description: 'Замедлитель — очень низкая скорость испарения',
    use: 'Замедлитель для ПУ и акриловых материалов при высоких температурах (>25°C)'
  },
  S2000: {
    id: 'S2000', name: 'S2000', speed: 'fast',
    description: 'Высокая скорость испарения, низкая агрессивность',
    use: 'Патины'
  },
  Water: {
    id: 'Water', name: 'Вода', speed: 'medium',
    description: 'Вода (для водоразбавимых материалов)',
    use: 'Водоразбавимые материалы ВР'
  }
};

// ============================================================
//  МАТЕРИАЛЫ
// ============================================================
// Структура: hardeners: [{id, ratioMin?, ratioMax?, ratio?}]
//            thinners: [{id, ratioMin, ratioMax}]
//            coverage: g/m² (расход готового материала)
// Все соотношения — % от массы основы (части A)

const MATERIALS = [

  // ===========================
  // КРАСИТЕЛИ / МОРИЛКИ
  // ===========================
  {
    id: 'ctu', code: 'CTU', manufacturer: 'technocolor',
    name: 'CTU — Красители прозрачные универсальные',
    type: 'dye', chemistry: 'solvent',
    color: 'transparent', outdoor: false, thixotropic: false,
    description: 'Концентрированные морилки с высокой прозрачностью. Подчёркивают текстуру. Насыщенные цвета. Смешиваются внутри серии.',
    dryResidue: null, coverage: 80,
    hardeners: [],
    thinners: [{ id: 'S10', ratioMin: 500, ratioMax: 1000 }, { id: 'S12', ratioMin: 500, ratioMax: 1000 }, { id: 'S90', ratioMin: 500, ratioMax: 1000 }],
    application: ['spray'],
    variants: ['CTU21 орех классич.', 'CTU22 орех светлый', 'CTU23 орех старый', 'CTU24 вишня', 'CTU25 махагон', 'CTU26 венге', 'CTU27 олива', 'CTU28 палисандр', 'CTU29 мербау', 'CTU30 макоре'],
    note: 'Концентрат. Разводится растворителем перед применением.'
  },
  {
    id: 'cps', code: 'CPS', manufacturer: 'technocolor',
    name: 'CPS — Красители пигментные (растворитель)',
    type: 'dye', chemistry: 'solvent',
    color: 'pigment', outdoor: false, thixotropic: false,
    description: 'Пигментные красители с высокой укрывистостью на основе растворителя. Выравнивают разнотонность.',
    dryResidue: null, coverage: 80,
    hardeners: [],
    thinners: [{ id: 'S10', ratioMin: 500, ratioMax: 1000 }, { id: 'S12', ratioMin: 500, ratioMax: 1000 }, { id: 'S90', ratioMin: 500, ratioMax: 1000 }],
    application: ['spray'],
    note: 'Концентрат.'
  },
  {
    id: 'cqs', code: 'CQS', manufacturer: 'technocolor',
    name: 'CQS — Патина на основе растворителя',
    type: 'dye', chemistry: 'solvent',
    color: 'special', outdoor: false, thixotropic: false,
    description: 'Патина для мебели. Низкий расход, простота нанесения. Металлизированные (золото, серебро) и неметаллизированные варианты.',
    dryResidue: null, coverage: 80,
    hardeners: [],
    thinners: [{ id: 'S10', ratioMin: 100, ratioMax: 300 }, { id: 'S2000', ratioMin: 100, ratioMax: 300 }],
    application: ['brush', 'rag'],
    variants: ['CQS 43XXX золото', 'CQS 42XXX серебро', 'CQS 21 орех классич.', 'CQS 22 орех светлый', 'CQS 23 орех старый', 'CQS 24 вишня', 'CQS 25 махагон', 'CQS 26 венге'],
    note: 'Концентрат. Наносится ватой, кистью, удаляется скотч-брайтом.'
  },

  // ===========================
  // ПУ ГРУНТЫ ПРОЗРАЧНЫЕ (PTS)
  // ===========================
  {
    id: 'pts71', code: 'PTS71', manufacturer: 'technocolor',
    name: 'PTS71 — Грунт ПУ прозрачный изолирующий (смолистые породы, МДФ)',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Изолирующий грунт с отличной смачивающей и изолирующей способностью. Не агрессивен к красителям. Хорошо шлифуется.',
    dryResidue: 21, coverage: 80,
    hardeners: [{ id: 'PC72', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 25 }],
    application: ['spray'],
    note: 'Рекомендован для МДФ и смолистых пород (сосна, лиственница).'
  },
  {
    id: 'pts72', code: 'PTS72', manufacturer: 'technocolor',
    name: 'PTS72 — Грунт ПУ прозрачный адгезивный (меламиновая бумага)',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Адгезионный грунт для меламиновой бумаги. Хорошо шлифуется, стойкий к подтёкам.',
    dryResidue: 39, coverage: 150,
    hardeners: [{ id: 'PC72', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 25 }],
    application: ['spray'],
    note: 'Для деталей из МДФ с меламиновым покрытием.'
  },
  {
    id: 'pts20700', code: 'PTS20700', manufacturer: 'technocolor',
    name: 'PTS20700 — Грунт ПУ прозрачный с высоким сухим остатком',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Отличная адгезия к разным породам и МДФ. Хорошие порозаполняющие свойства. Прозрачный, хорошо шлифуется.',
    dryResidue: 57, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'Высокий сухой остаток 57% — меньше слоёв для заполнения пор.'
  },
  {
    id: 'pts10', code: 'PTS10', manufacturer: 'technocolor',
    name: 'PTS10 — Грунт ПУ прозрачный эконом',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая смачивающая способность, хорошая прозрачность. Не агрессивен к подтёкам и наплывам. Очень быстро сохнет до шлифования (2 часа).',
    dryResidue: 41, coverage: 150,
    hardeners: [{ id: 'PC20', ratioMin: 40, ratioMax: 50 }, { id: 'PC10', ratioMin: 40, ratioMax: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'Экономичная альтернатива. PC20 — стандарт, PC10 — быстрее.'
  },
  {
    id: 'pts20', code: 'PTS20', manufacturer: 'technocolor',
    name: 'PTS20 — Грунт ПУ прозрачный универсальный',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Хорошая прозрачность и наполнение. Быстрая сушка (2 часа). Высокая эластичность и сухой остаток. Хорошо смачивает микропоры.',
    dryResidue: 45, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 50 }, { id: 'PC25', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: ''
  },
  {
    id: 'pts50', code: 'PTS50', manufacturer: 'technocolor',
    name: 'PTS50 — Грунт ПУ прозрачный тиксотропный',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Высокая стойкость к подтёкам и наплывам. Хорошая прозрачность. Хорошо растекается на вертикальных поверхностях.',
    dryResidue: 45, coverage: 120,
    hardeners: [{ id: 'PC20', ratio: 50 }, { id: 'PC25', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 25 }],
    application: ['spray', 'curtain'],
    note: 'Тиксотропный — не течёт на вертикальных поверхностях.'
  },
  {
    id: 'pts50a', code: 'PTS50 A', manufacturer: 'technocolor',
    name: 'PTS50 A — Грунт ПУ прозрачный тиксотропный (высокий сухой остаток)',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Тиксотропный грунт с отличной стойкостью к подтёкам, порозаполнением и лёгким шлифованием. Хорошо прокрывает и заполняет микропоры.',
    dryResidue: 51, coverage: 120,
    hardeners: [{ id: 'PC20', ratio: 50 }, { id: 'PC25', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 25 }],
    application: ['spray', 'curtain'],
    note: 'Улучшенная версия PTS50 с высоким сухим остатком 51%.'
  },
  {
    id: 'pts60', code: 'PTS60', manufacturer: 'technocolor',
    name: 'PTS60 — Грунт ПУ прозрачный высокой твёрдости',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая стойкость к усадке и твёрдость. Хорошее порозаполнение. Стойкий к прямым и диагональным механическим ударам. Без пожелтения и отслоения.',
    dryResidue: 50, coverage: 150,
    hardeners: [{ id: 'PC25', ratio: 60 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 25 }],
    application: ['spray'],
    note: 'Повышенная твёрдость. Отвердитель PC25 60%.'
  },
  {
    id: 'pts21812', code: 'PTS21812', manufacturer: 'technocolor',
    name: 'PTS21812 — Грунт ПУ адгезивный для МДФ',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Отличная адгезия к разным типам МДФ. Быстро сохнет. Высокий сухой остаток 74%. Для подготовки изделий из МДФ перед нанесением основного грунта.',
    dryResidue: 74, coverage: 100,
    hardeners: [{ id: 'PC20', ratio: 40 }, { id: 'PC72', ratio: 30 }],
    thinners: [{ id: 'S50', ratioMin: 10, ratioMax: 20 }],
    application: ['spray'],
    note: 'Специальный адгезионный грунт для МДФ. PC20 40% или PC72 30% — выбрать один.'
  },

  // ===========================
  // ПУ ГРУНТЫ БЕЛЫЕ (PPS)
  // ===========================
  {
    id: 'pps10', code: 'PPS10', manufacturer: 'technocolor',
    name: 'PPS10 — Грунт ПУ белый эконом',
    type: 'primer', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Высокий сухой остаток 76% и наполненность. Стойкий к наплывам и подтёкам. Быстро сохнет. Хорошая твёрдость.',
    dryResidue: 76, coverage: 150,
    hardeners: [{ id: 'PC10', ratio: 40 }, { id: 'PC20', ratio: 30 }],
    thinners: [{ id: 'S50', ratioMin: 10, ratioMax: 20 }],
    application: ['spray'],
    note: 'PC10 40% быстрее, PC20 30% стандарт — выбрать один вариант.'
  },
  {
    id: 'pps20', code: 'PPS20', manufacturer: 'technocolor',
    name: 'PPS20 — Грунт ПУ белый универсальный',
    type: 'primer', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Хорошо держится на острых углах. Отлично укрывает. Стойкий к подтёкам и наплывам. Быстро сохнет и легко шлифуется.',
    dryResidue: 71, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'Основной белый грунт для МДФ фасадов.'
  },
  {
    id: 'pps50', code: 'PPS50', manufacturer: 'technocolor',
    name: 'PPS50 — Грунт ПУ белый тиксотропный',
    type: 'primer', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: true,
    description: 'Тиксотропный грунт с отличными вертикальными свойствами, стойкостью к подтёкам. Хорошие порозаполняющие способности, выравнивает поверхность. Стойкий к усадке.',
    dryResidue: 72, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'Тиксотропный — идеален для вертикальных поверхностей фасадов.'
  },
  {
    id: 'pps50277', code: 'PPS50277', manufacturer: 'technocolor',
    name: 'PPS50277 — Грунт ПУ белый тиксотропный (высокий сухой остаток)',
    type: 'primer', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: true,
    description: 'Лучшая тиксотропность. Отлично укрывает и заполняет поры. Быстро набирает твёрдость. Высокий сухой остаток 73%.',
    dryResidue: 73, coverage: 120,
    hardeners: [{ id: 'PC20', ratio: 30 }],
    thinners: [{ id: 'S50', ratioMin: 10, ratioMax: 20 }],
    application: ['spray'],
    note: 'Отвердитель PC20 только 30% — особенность рецептуры.'
  },
  {
    id: 'pps40', code: 'PPS40', manufacturer: 'technocolor',
    name: 'PPS40 — Грунт ПУ пигментный для ППУ',
    type: 'primer', chemistry: 'pu',
    color: 'colored', outdoor: false, thixotropic: false,
    description: 'Цветные грунты для отделки ППУ и МДФ. Отличная адгезия. Высокая эластичность и укрывистость. Хорошо шлифуется вручную.',
    dryResidue: 79, coverage: 150,
    hardeners: [{ id: 'PC20042', ratio: 20 }, { id: 'PC20', ratio: 25 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'PC20042 20% или PC20 25% — выбрать один. Доступны цветные варианты под заказ.'
  },
  {
    id: 'pps40091', code: 'PPS40091', manufacturer: 'technocolor',
    name: 'PPS40091 — Грунт ПУ чёрный',
    type: 'primer', chemistry: 'pu',
    color: 'black', outdoor: false, thixotropic: false,
    description: 'Для подготовки мебельных фасадов и панелей из МДФ под отделку цветными эмалями. Хорошая адгезия к МДФ. Высокий сухой остаток, минимальная усадка.',
    dryResidue: 72, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 25 }],
    thinners: [{ id: 'S50', ratio: 30 }],
    application: ['spray'],
    note: 'Чёрный грунт под тёмные финишные покрытия.'
  },

  // ===========================
  // ПУ ЛАКИ (PTL)
  // ===========================
  {
    id: 'ptl10', code: 'PTL10', manufacturer: 'technocolor',
    name: 'PTL10 — Лак ПУ быстрой сушки',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Универсальный лак. Отлично проливает поры, не провваливается в подложку. Быстро сохнет. Отличная растекаемость.',
    dryResidue: 43, coverage: 120,
    gloss: [10, 20, 30, 70],
    hardeners: [{ id: 'PC20', ratio: 40 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PTL10 UM — 10 гл', 'PTL10 SM — 30 гл', 'PTL10 M — 20 гл', 'PTL10 G — 70 гл'],
    note: ''
  },
  {
    id: 'ptl20', code: 'PTL20', manufacturer: 'technocolor',
    name: 'PTL20 — Лак ПУ универсальный',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Превосходно растекается по поверхности и быстро сохнет. Хорошая физ.-хим. стойкость и прочность.',
    dryResidue: 43, coverage: 120,
    gloss: [5, 10, 20, 30],
    hardeners: [{ id: 'PC20', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PTL20 DM — 5 гл', 'PTL20 UM — 10 гл', 'PTL20 M — 20 гл', 'PTL20 SM — 30 гл'],
    note: ''
  },
  {
    id: 'ptl50', code: 'PTL50', manufacturer: 'technocolor',
    name: 'PTL50 — Лак ПУ тиксотропный',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Тиксотропный лак для вертикальных изделий. Стойкость к подтёкам и наплывам. Хорошая физ.-хим. стойкость.',
    dryResidue: 46, coverage: 120,
    gloss: [10, 20, 30, 40, 60, 90],
    hardeners: [{ id: 'PC20', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PTL50 UM — 10 гл', 'PTL50 M — 20 гл', 'PTL50 SM — 30 гл', 'PTL50 SG — 40 гл', 'PTL50 G — 60 гл', 'PTL50090 — 90 гл'],
    note: ''
  },
  {
    id: 'ptl60', code: 'PTL60', manufacturer: 'technocolor',
    name: 'PTL60 — Лак ПУ для столешниц и барных стоек',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая стойкость к царапинам и химическим жидкостям (кофе, чистящие средства и т.п.).',
    dryResidue: 34, coverage: 150,
    gloss: [30],
    hardeners: [{ id: 'PC60', ratio: 50 }],
    thinners: [{ id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['PTL60 SM — 30 гл'],
    note: 'Специально для столешниц. Отвердитель PC60, разбавитель S80.'
  },
  {
    id: 'ptl80', code: 'PTL80', manufacturer: 'technocolor',
    name: 'PTL80 — Лак/грунт ПУ (минимально поднимает ворс)',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Самогрунтующийся полиуретановый лак. Минимально поднимает ворс. Приятное на ощупь покрытие. Хорошая физ.-хим. стойкость. Быстро сохнет.',
    dryResidue: 40, coverage: 120,
    gloss: [20],
    hardeners: [{ id: 'PC10', ratio: 50 }, { id: 'PC20', ratio: 40 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PTL80 M — 20 гл'],
    note: 'PC10 50% — быстрее, PC20 40% — стандарт. Выбрать один.'
  },
  {
    id: 'ptl90', code: 'PTL90', manufacturer: 'technocolor',
    name: 'PTL90 — Лак ПУ для паркета и лестниц',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Отлично растекается. Приятный на ощупь. Великолепная эластичность и химическая стойкость. Устойчив к истиранию. Может использоваться как самогрунт.',
    dryResidue: 43, coverage: 150,
    gloss: [10, 30],
    hardeners: [{ id: 'PC90', ratio: 50 }],
    thinners: [{ id: 'S70', ratioMin: 20, ratioMax: 30 }, { id: 'S80', ratioMin: 20, ratioMax: 30 }],
    application: ['spray', 'roller'],
    variants: ['PTL90 UM — 10 гл', 'PTL90 SM — 30 гл'],
    note: 'Для паркета и лестниц. S70 или S80 по выбору.'
  },
  {
    id: 'ptl200', code: 'PTL200', manufacturer: 'technocolor',
    name: 'PTL200 — Лак ПУ глянцевый (100 глосс)',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Лак с высоким сухим остатком. Глубокий блеск. Хорошая твёрдость. Стойкость к царапинам. Хорошо растягивается и полируется.',
    dryResidue: 52, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'AC200', ratio: 100 }],
    thinners: [{ id: 'S70', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    note: 'Высокоглянцевый. Отвердитель AC200 100% — важно соблюдать.'
  },
  {
    id: 'ptl202', code: 'PTL202', manufacturer: 'technocolor',
    name: 'PTL202 — Лак ПУ глянцевый (100 глосс) для ритуальных изделий',
    type: 'lacquer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Хорошая твёрдость. Глубокий блеск. Высокая скорость высыхания. Суперглянцевое тиксотропное покрытие. Отлично держится на вертикальных поверхностях.',
    dryResidue: 55, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'PC72', ratio: 100 }],
    thinners: [{ id: 'S70', ratioMin: 15, ratioMax: 25 }],
    application: ['spray'],
    note: 'Отвердитель PC72 100% — для особо глянцевых изделий.'
  },

  // ===========================
  // ПУ ЭМАЛИ (PPL)
  // ===========================
  {
    id: 'ppl10', code: 'PPL10', manufacturer: 'technocolor',
    name: 'PPL10 — Эмаль ПУ быстрой сушки',
    type: 'enamel', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Отличная укрывистость. Высокий сухой остаток 67%. Для мебельных фасадов и панелей из МДФ.',
    dryResidue: 67, coverage: 150,
    gloss: [20],
    hardeners: [{ id: 'PC60', ratio: 40 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }, { id: 'S70', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PPL10 M — 20 гл'],
    note: ''
  },
  {
    id: 'ppl20', code: 'PPL20', manufacturer: 'technocolor',
    name: 'PPL20 — Эмаль ПУ белая универсальная',
    type: 'enamel', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Отличная укрывистость. Хорошая химическая стойкость, растекаемость. Стойкость к царапинам. Финишное покрытие для мебели.',
    dryResidue: 65, coverage: 150,
    gloss: [5, 10, 20, 30, 95],
    hardeners: [{ id: 'PC60', ratioMin: 40, ratioMax: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }, { id: 'S70', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PPL20 DM* — 5 гл', 'PPL20 UM — 10 гл', 'PPL20 M — 20 гл', 'PPL20 SM — 30 гл', 'PPL20 G — 95 гл'],
    note: 'PC60 40-50%. Самая популярная эмаль для МДФ фасадов.'
  },
  {
    id: 'ppl50', code: 'PPL50', manufacturer: 'technocolor',
    name: 'PPL50 — Эмаль ПУ белая тиксотропная',
    type: 'enamel', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: true,
    description: 'Отличная укрывистость. Стойкость к подтёкам и наплывам. Хорошая физ.-хим. стойкость. Финишное покрытие при вертикальной окраске.',
    dryResidue: 65, coverage: 150,
    gloss: [20, 30, 40],
    hardeners: [{ id: 'PC60', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }, { id: 'S70', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PPL50 M — 20 гл', 'PPL50 SM — 30 гл', 'PPL50 SG — 40 гл'],
    note: 'Тиксотропная — для вертикальных фасадов без подтёков.'
  },
  {
    id: 'ppl200', code: 'PPL200', manufacturer: 'technocolor',
    name: 'PPL200 — Эмаль ПУ белая глянцевая (100 глосс)',
    type: 'enamel', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Отличная укрывистость. Высокий блеск и гладкость покрытия. Хорошая физ.-хим. стойкость и стойкость к царапинам. Хорошо полируется.',
    dryResidue: 70, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'AC200', ratio: 70 }],
    thinners: [{ id: 'S70', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    note: 'Для зеркально-глянцевых МДФ фасадов. AC200 70%.'
  },
  {
    id: 'ppl500', code: 'PPL500', manufacturer: 'technocolor',
    name: 'PPL500 — Эмаль ПУ белая глянцевая тиксотропная (100 глосс)',
    type: 'enamel', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: true,
    description: 'Превосходные вертикальные свойства. Выравнивание поверхности, глубокий блеск. Отличная прочность и химическая стойкость.',
    dryResidue: 70, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'AC200', ratio: 70 }],
    thinners: [{ id: 'S70', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    note: 'Тиксотропная версия PPL200. Для сложных изделий.'
  },

  // ===========================
  // ПУ ОГНЕЗАЩИТНЫЕ
  // ===========================
  {
    id: 'pts01_1', code: 'PTS01 (I гр.)', manufacturer: 'technocolor',
    name: 'PTS01 — Грунт ПУ прозрачный огнезащитный (I группа)',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false, fireProtection: true,
    description: 'Превосходные огнезащитные свойства — I группа. Хорошая прозрачность и смачиваемость. Эластичность, быстро сохнет, легко шлифуется. ГОСТ Р 53292-2009 (п.6.1).',
    dryResidue: 71, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'Огнезащита I группы.'
  },
  {
    id: 'pts01_2', code: 'PTS01 (II гр.)', manufacturer: 'technocolor',
    name: 'PTS01 — Грунт ПУ прозрачный огнезащитный (II группа)',
    type: 'primer', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false, fireProtection: true,
    description: 'Огнезащита II группа. Превосходные огнезащитные свойства. ГОСТ Р 53292-2009.',
    dryResidue: 50, coverage: 150,
    hardeners: [{ id: 'PC20', ratio: 50 }, { id: 'PC25', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'Огнезащита II группы.'
  },

  // ===========================
  // АКРИЛОВЫЕ ГРУНТЫ (ATS, APS)
  // ===========================
  {
    id: 'ats20', code: 'ATS20', manufacturer: 'technocolor',
    name: 'ATS20 — Грунт акриловый прозрачный',
    type: 'primer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Прозрачный акриловый грунт с отличными смачивающими свойствами. Легко шлифуется. Для нанесения перед эмалью. Перед патиной. Выбор для открыто-пористой отделки.',
    dryResidue: 30, coverage: 150,
    hardeners: [{ id: 'AC40', ratio: 20 }, { id: 'AC41', ratio: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    note: 'AC40 20% или AC41 20% — выбрать один.'
  },
  {
    id: 'aps20', code: 'APS20', manufacturer: 'technocolor',
    name: 'APS20 — Грунт акриловый белый для открытых пор',
    type: 'primer', chemistry: 'ac',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Отлично смачивает поры. Не проваливается в МДФ. Для шпонированных изделий с фрезеровкой. Открытый эффект Decare.',
    dryResidue: 60, coverage: 150,
    hardeners: [{ id: 'AC40', ratio: 20 }, { id: 'AC41', ratio: 20 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    note: 'AC40 20% или AC41 20%.'
  },

  // ===========================
  // АКРИЛОВЫЕ ЛАКИ (ATL)
  // ===========================
  {
    id: 'atl20', code: 'ATL20', manufacturer: 'technocolor',
    name: 'ATL20 — Лак акриловый универсальный',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Максимально прозрачный и светостойкий. Гладкое и приятное на ощупь покрытие. Отличная физ.-хим. стойкость. Хорошо подчёркивает поры. Для ванных комнат и кухни.',
    dryResidue: 24, coverage: 150,
    gloss: [10, 20, 40],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['ATL20 UM — 10 гл', 'ATL20 M — 20 гл', 'ATL20 SG — 40 гл'],
    note: ''
  },
  {
    id: 'atl50', code: 'ATL50', manufacturer: 'technocolor',
    name: 'ATL50 — Лак акриловый тиксотропный',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Стойкость к подтёкам и наплывам. Высокая прозрачность. Хорошая растекаемость на плоскостях. Для изделий сложной формы.',
    dryResidue: 31, coverage: 150,
    gloss: [5, 20, 30, 40, 60],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['ATL50 DM — 5 гл', 'ATL50 M — 20 гл', 'ATL50 SM — 30 гл', 'ATL50 SG — 40 гл', 'ATL50 G — 60 гл'],
    note: ''
  },
  {
    id: 'atl90', code: 'ATL90', manufacturer: 'technocolor',
    name: 'ATL90 — Лак акриловый быстрой сушки',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая скорость сушки. Устойчивость к пожелтению. Подчёркивает поры. Для различной мебели.',
    dryResidue: 29, coverage: 150,
    gloss: [5, 10, 20, 30, 40, 80],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }, { id: 'AC41', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }, { id: 'S70', ratioMin: 20, ratioMax: 30 }, { id: 'S80', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['ATL90 DM — 5 гл', 'ATL90 UM — 10 гл', 'ATL90 M — 20 гл', 'ATL90 SM — 30 гл', 'ATL90 SG — 40 гл', 'ATL90 G — 80 гл'],
    note: 'AC40 или AC41 — AC41 быстрее.'
  },
  {
    id: 'atl200', code: 'ATL200', manufacturer: 'technocolor',
    name: 'ATL200 — Лак акриловый глянцевый (100 глосс)',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая прозрачность. Глубокий блеск и твёрдость. Красивое покрытие с отличной стойкостью к пожелтению. Ванные комнаты и кухни.',
    dryResidue: 45, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'AC200', ratioMin: 50, ratioMax: 70 }],
    thinners: [{ id: 'S70', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    note: 'AC200 50-70%.'
  },
  {
    id: 'atl500', code: 'ATL500', manufacturer: 'technocolor',
    name: 'ATL500 — Лак акриловый глянцевый тиксотропный (100 глосс)',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: true,
    description: 'Стойкость к подтёкам и наплывам. Тонкий слой с глубоким глянцем. Химическая стойкость. Для МДФ, кухни, ванных.',
    dryResidue: 48, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'AC200', ratio: 70 }],
    thinners: [{ id: 'S70', ratioMin: 0, ratioMax: 20 }, { id: 'S80', ratioMin: 0, ratioMax: 20 }],
    application: ['spray'],
    note: 'Тиксотропный глянец. Разбавитель 0-20% — часто наносят без разбавления.'
  },
  {
    id: 'atl20118', code: 'ATL20118', manufacturer: 'technocolor',
    name: 'ATL20118 — Лак акриловый с натуральным эффектом',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая смачивающая способность. Глубоко проникает в структуру дерева. Натуральный эффект поверхности. Стойкость к холодной и горячей воде.',
    dryResidue: 16, coverage: 120,
    gloss: [10],
    hardeners: [{ id: 'AC40', ratio: 25 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    note: 'Низкий сухой остаток 16% — для открытой поры, натуральный вид.'
  },
  {
    id: 'atl203', code: 'ATL203', manufacturer: 'technocolor',
    name: 'ATL203 — Лак акриловый глянцевый HS (100 глосс)',
    type: 'lacquer', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Хорошая физ.-хим. стойкость. Высокий блеск и сухой остаток 56%. Быстро сохнет, легко полируется. Максимально прозрачное покрытие с толстой линзой.',
    dryResidue: 56, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'AC200', ratioMin: 70, ratioMax: 100 }],
    thinners: [{ id: 'S70', ratioMin: 10, ratioMax: 20 }, { id: 'S80', ratioMin: 10, ratioMax: 20 }],
    application: ['spray'],
    note: 'HS — высокий сухой остаток. AC200 70-100%.'
  },

  // ===========================
  // АКРИЛОВЫЕ ЭМАЛИ (APL)
  // ===========================
  {
    id: 'apl20', code: 'APL20', manufacturer: 'technocolor',
    name: 'APL20 — Эмаль акриловая белая универсальная',
    type: 'enamel', chemistry: 'ac',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Отличные прочностные характеристики. Хорошая растекаемость. Красиво подчёркивает поры. Финишное покрытие и отделка под патину.',
    dryResidue: 50, coverage: 150,
    gloss: [20, 30],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['APL20 M — 20 гл', 'APL20 SM — 30 гл'],
    note: ''
  },

  // ===========================
  // ПОЛИЭФИРНЫЕ (ETS, EPS, ETL)
  // ===========================
  {
    id: 'ets20', code: 'ETS20', manufacturer: 'technocolor',
    name: 'ETS20 — Грунт ПЭ прозрачный',
    type: 'primer', chemistry: 'pe',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокий сухой остаток 96% и твёрдость. Для отделки под высокий глянец, а также под окраску пигментными глянцевыми столами.',
    dryResidue: 96, coverage: 200,
    hardeners: [{ id: 'EC1', ratio: 2 }, { id: 'EC2', ratio: 2 }],
    thinners: [{ id: 'S10', ratioMin: 10, ratioMax: 15 }, { id: 'S11', ratioMin: 10, ratioMax: 15 }],
    accelerators: [{ id: 'EA1', ratio: 2 }],
    application: ['spray'],
    note: 'Полиэфирный — EC1/EC2 2%, EA1 2% ОБЯЗАТЕЛЬНО. EC1 при <25°C, EC2 при >25°C.'
  },
  {
    id: 'eps20', code: 'EPS20', manufacturer: 'technocolor',
    name: 'EPS20 — Грунт ПЭ белый',
    type: 'primer', chemistry: 'pe',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Высокий сухой остаток 95% и твёрдость. Стойкий к усадке. Для отделки под высокий глянец.',
    dryResidue: 95, coverage: 200,
    hardeners: [{ id: 'EC1', ratio: 2 }, { id: 'EC2', ratio: 2 }],
    thinners: [{ id: 'S10', ratioMin: 10, ratioMax: 15 }, { id: 'S50', ratioMin: 10, ratioMax: 15 }],
    accelerators: [{ id: 'EA1', ratio: 2 }],
    application: ['spray'],
    note: 'Полиэфирный — EC1/EC2 2%, EA1 2% ОБЯЗАТЕЛЬНО.'
  },
  {
    id: 'eps22', code: 'EPS22', manufacturer: 'technocolor',
    name: 'EPS22 — Грунт ПЭ белый универсальный',
    type: 'primer', chemistry: 'pe',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Быстрый набор твёрдости. Экономичный. Высокие укрывные способности 96% СО. Стойкий к усадке. Для матовых фасадов, дверей, фрезерованных изделий.',
    dryResidue: 96, coverage: 200,
    hardeners: [{ id: 'EC1', ratio: 2 }, { id: 'EC2', ratio: 2 }],
    thinners: [{ id: 'S10', ratioMin: 10, ratioMax: 15 }, { id: 'S11', ratioMin: 10, ratioMax: 15 }],
    accelerators: [{ id: 'EA1', ratio: 2 }],
    application: ['spray'],
    note: 'Полиэфирный — EC1/EC2 2%, EA1 2% ОБЯЗАТЕЛЬНО. Рекомендован для МДФ фасадов под глянец.'
  },
  {
    id: 'etl200', code: 'ETL200', manufacturer: 'technocolor',
    name: 'ETL200 — Лак ПЭ глянцевый прозрачный (100 глосс)',
    type: 'lacquer', chemistry: 'pe',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Очень глубокая линза 99% СО. Высокая степень блеска. Для изделий с ровным качественным глянцем и глянцевых столов.',
    dryResidue: 99, coverage: 150,
    gloss: [100],
    hardeners: [{ id: 'EC1', ratio: 2 }, { id: 'EC2', ratio: 2 }],
    thinners: [{ id: 'S10', ratioMin: 10, ratioMax: 15 }, { id: 'S11', ratioMin: 10, ratioMax: 15 }, { id: 'S31', ratioMin: 10, ratioMax: 15 }, { id: 'S50', ratioMin: 10, ratioMax: 15 }],
    accelerators: [{ id: 'EA1', ratio: 2 }],
    application: ['spray', 'curtain'],
    note: 'Полиэфирный глянец 100. EC1/EC2 2%, EA1 2% ОБЯЗАТЕЛЬНО. Даёт «стекловидный» вид.'
  },

  // ===========================
  // ВОДОРАЗБАВИМЫЕ (HPS, HTL, HPL)
  // ===========================
  {
    id: 'hps10', code: 'HPS10', manufacturer: 'technocolor',
    name: 'HPS10 — Грунт ВР белый',
    type: 'primer', chemistry: 'wb',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Высокая укрывистость и стойкость к подтёкам. Легко шлифуется. Без растворителей. Для детских кроваток, стульев, другой мебели.',
    dryResidue: 55, coverage: 110,
    hardeners: [],
    thinners: [{ id: 'Water', ratioMin: 0, ratioMax: 10 }],
    application: ['spray'],
    note: 'Водоразбавимый, однокомпонентный. Без отвердителя.'
  },
  {
    id: 'hps20', code: 'HPS20', manufacturer: 'technocolor',
    name: 'HPS20 — Грунт ВР белый (универсальный мебельный)',
    type: 'primer', chemistry: 'wb',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Хорошая смачиваемость и растекаемость. Хорошая твёрдость. Минимальная усадка. Для мебельных фасадов, дверей, МДФ, ХДФ, шпона.',
    dryResidue: 52, coverage: 100,
    hardeners: [],
    thinners: [{ id: 'Water', ratioMin: 0, ratioMax: 10 }],
    application: ['spray'],
    note: 'Водоразбавимый, однокомпонентный.'
  },
  {
    id: 'hps50', code: 'HPS50', manufacturer: 'technocolor',
    name: 'HPS50 — Грунт ВР белый тиксотропный',
    type: 'primer', chemistry: 'wb',
    color: 'white', outdoor: false, thixotropic: true,
    description: 'Тиксотропный. Для мебельных фасадов, панелей, стульев. Быстро сохнет и шлифуется. Высокий сухой остаток 61%.',
    dryResidue: 61, coverage: 110,
    hardeners: [],
    thinners: [{ id: 'Water', ratioMin: 0, ratioMax: 10 }],
    application: ['spray'],
    note: 'Водоразбавимый, однокомпонентный. Тиксотропный.'
  },
  {
    id: 'htl20', code: 'HTL20', manufacturer: 'technocolor',
    name: 'HTL20 — Лак ВР универсальный',
    type: 'lacquer', chemistry: 'wb',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Высокая прозрачность и светостойкость к пожелтению. Без растворителей — для детской мебели. Хорошая физ.-хим. стойкость.',
    dryResidue: 32, coverage: 90,
    gloss: [30, 60],
    hardeners: [],
    thinners: [{ id: 'Water', ratioMin: 0, ratioMax: 10 }],
    application: ['spray'],
    variants: ['HTL20 SM — 30 гл', 'HTL20 G — 60 гл'],
    note: 'Водоразбавимый, однокомпонентный.'
  },
  {
    id: 'hpl20sm', code: 'HPL20 SM', manufacturer: 'technocolor',
    name: 'HPL20 SM — Эмаль ВР белая универсальная (30 глосс)',
    type: 'enamel', chemistry: 'wb',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Высокая стойкость к пожелтению. Без растворителей. Для детской мебели. Высокий сухой остаток 41%.',
    dryResidue: 41, coverage: 100,
    gloss: [30],
    hardeners: [],
    thinners: [{ id: 'Water', ratioMin: 0, ratioMax: 10 }],
    application: ['spray'],
    note: 'Водоразбавимый, однокомпонентный.'
  },

  // ===========================
  // СИСТЕМА КОЛЕРОВКИ (конвертеры)
  // ===========================
  {
    id: 'ptl1', code: 'PTL1', manufacturer: 'technocolor',
    name: 'PTL1 — Конвертер ПУ прозрачный для эмалей',
    type: 'converter', chemistry: 'pu',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Для приготовления эмалей системы колеровки. Добавляют пигментные пасты CS.',
    dryResidue: null, coverage: 150,
    gloss: [5, 10, 20],
    hardeners: [{ id: 'PC60', ratioMin: 40, ratioMax: 50 }],
    thinners: [{ id: 'S50', ratioMin: 25, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PTL1 DM* — 5 гл', 'PTL1 UM* — 10 гл', 'PTL1 M — 20 гл'],
    note: 'Колеруется пастами CS. PC60 40-50%.'
  },
  {
    id: 'ppl1', code: 'PPL1', manufacturer: 'technocolor',
    name: 'PPL1 — Конвертер ПУ белый для эмалей',
    type: 'converter', chemistry: 'pu',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Для приготовления эмалей системы колеровки. Добавляют пигментные пасты CS.',
    dryResidue: null, coverage: 150,
    gloss: [20],
    hardeners: [{ id: 'PC60', ratio: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PPL1 M — 20 гл'],
    note: 'Колеруется пастами CS. PC60 50%.'
  },
  {
    id: 'atl1', code: 'ATL1', manufacturer: 'technocolor',
    name: 'ATL1 — Конвертер акриловый прозрачный для эмалей',
    type: 'converter', chemistry: 'ac',
    color: 'clear', outdoor: false, thixotropic: false,
    description: 'Акриловый конвертер для приготовления прозрачных эмалей с пастами CS.',
    dryResidue: null, coverage: 150,
    gloss: [10, 20],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }, { id: 'AC41', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['ATL1 UM — 10 гл', 'ATL1 M — 20 гл'],
    note: ''
  },
  {
    id: 'apl1', code: 'APL1', manufacturer: 'technocolor',
    name: 'APL1 — Конвертер акриловый белый для эмалей',
    type: 'converter', chemistry: 'ac',
    color: 'white', outdoor: false, thixotropic: false,
    description: 'Акриловый белый конвертер для приготовления эмалей с пастами CS.',
    dryResidue: null, coverage: 150,
    gloss: [10, 20],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['APL1 UM — 10 гл', 'APL1 M — 20 гл'],
    note: ''
  },
  {
    id: 'ppl_ral', code: 'PPL RAL', manufacturer: 'technocolor',
    name: 'PPL RAL — Эмаль ПУ колерованная (складская программа)',
    type: 'enamel', chemistry: 'pu',
    color: 'colored', outdoor: false, thixotropic: false,
    description: 'Полиуретановая эмаль, колерованная в популярные цвета. Отличные прочностные свойства. Хорошая растекаемость в тонком слое и эластичность.',
    dryResidue: 53, coverage: 150,
    gloss: [5, 20],
    hardeners: [{ id: 'PC60', ratioMin: 30, ratioMax: 50 }],
    thinners: [{ id: 'S50', ratioMin: 20, ratioMax: 30 }],
    application: ['spray'],
    variants: ['PPL R1013 M — беж', 'PPL R7047 M — серый', 'PPL R1015 M — слоновая кость', 'PPL R9010 DM*', 'PPL R9003 DM*', 'PPL R9001 M — молочно-белый', 'PPL R7016 M — антрацит', 'PPL R9005 M — чёрный', 'PPL R9016 M — белый'],
    note: 'PC60 30-50% в зависимости от варианта (DM* — 30%).'
  },
  {
    id: 'apl_ral', code: 'APL RAL', manufacturer: 'technocolor',
    name: 'APL RAL — Эмаль акриловая колерованная (20 глосс, складская программа)',
    type: 'enamel', chemistry: 'ac',
    color: 'colored', outdoor: false, thixotropic: false,
    description: 'Акриловая эмаль в популярные цвета. Отличные прочностные характеристики. Хорошая растекаемость и эластичность. Красиво подчёркивает поры.',
    dryResidue: 53, coverage: 150,
    gloss: [20],
    hardeners: [{ id: 'AC40', ratioMin: 10, ratioMax: 20 }],
    thinners: [{ id: 'S50', ratioMin: 30, ratioMax: 40 }, { id: 'S80', ratioMin: 30, ratioMax: 40 }],
    application: ['spray'],
    variants: ['APL RAL 1013 M — бежевый', 'APL RAL 9005 M — чёрный', 'APL RAL 1015 M — слоновая кость', 'APL RAL 9010 — белый', 'APL RAL 9003 M — сигнальный белый', 'APL RAL 9016 M — белый транспортный'],
    note: ''
  }
];

// ============================================================
//  Вспомогательные функции доступа к данным
// ============================================================

function getAllMaterials() {
  const custom = getCustomData();
  const allMaterials = [...MATERIALS];
  // Merge custom materials
  if (custom.materials) {
    custom.materials.forEach(cm => {
      const idx = allMaterials.findIndex(m => m.id === cm.id);
      if (idx >= 0) {
        allMaterials[idx] = { ...allMaterials[idx], ...cm, _modified: true };
      } else {
        allMaterials.push({ ...cm, _custom: true });
      }
    });
  }
  // Apply deletions
  if (custom.deleted) {
    return allMaterials.filter(m => !custom.deleted.includes(m.id));
  }
  return allMaterials;
}

function getAllManufacturers() {
  const custom = getCustomData();
  const base = [TECHNOCOLOR];
  if (custom.manufacturers) {
    return [...base, ...custom.manufacturers];
  }
  return base;
}

function getCustomData() {
  try {
    const raw = localStorage.getItem('paintCalc_customData');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function saveCustomData(data) {
  localStorage.setItem('paintCalc_customData', JSON.stringify(data));
}

// Temperature zone
function getTempZone(temp) {
  if (temp < 15) return 'cold';
  if (temp <= 25) return 'normal';
  if (temp <= 30) return 'warm';
  return 'hot';
}

function getTempAdjustments(material, temp) {
  const zone = getTempZone(temp);
  const adjustments = [];

  if (material.chemistry === 'pu' || material.chemistry === 'pu-ac') {
    if (zone === 'cold') {
      adjustments.push({ type: 'tip', icon: '🌡️', text: 'Низкая температура: прогрейте материал до 18-20°C. Уменьшите разбавление до нижней границы диапазона.' });
      if (material.hardeners.some(h => h.id === 'PC20')) {
        adjustments.push({ type: 'tip', icon: '⚡', text: 'Можно заменить PC20 на PC10 — более быстрый отвердитель при низких температурах.' });
      }
    } else if (zone === 'warm') {
      adjustments.push({ type: 'retarder', icon: '🐢', text: 'Температура 25-30°C: добавьте замедлитель S100 — 5-10% от основы.', retarder: 'S100', ratioMin: 5, ratioMax: 10 });
      adjustments.push({ type: 'tip', icon: '🪣', text: 'Рекомендуется S70 или S80 вместо S50 — медленнее испаряются.' });
    } else if (zone === 'hot') {
      adjustments.push({ type: 'retarder', icon: '🔥', text: 'Температура >30°C: обязательно добавьте S100 — 10-15% от основы.', retarder: 'S100', ratioMin: 10, ratioMax: 15 });
      adjustments.push({ type: 'tip', icon: '⏰', text: 'Используйте S80 разбавитель. Работайте рано утром или вечером. Сократите объём замеса.' });
    }
  } else if (material.chemistry === 'ac') {
    if (zone === 'cold') {
      adjustments.push({ type: 'tip', icon: '🌡️', text: 'Низкая температура: прогрейте материал. Используйте нижнюю границу разбавления.' });
    } else if (zone === 'warm') {
      adjustments.push({ type: 'retarder', icon: '🐢', text: 'Температура 25-30°C: добавьте S100 — 5-10% от основы.', retarder: 'S100', ratioMin: 5, ratioMax: 10 });
    } else if (zone === 'hot') {
      adjustments.push({ type: 'retarder', icon: '🔥', text: 'Температура >30°C: добавьте S100 — 10-15% от основы.', retarder: 'S100', ratioMin: 10, ratioMax: 15 });
      adjustments.push({ type: 'tip', icon: '⏰', text: 'Используйте S80 разбавитель. Работайте рано утром.' });
    }
  } else if (material.chemistry === 'pe') {
    if (zone === 'cold') {
      adjustments.push({ type: 'hardener', icon: '❄️', text: 'Температура <15°C: используйте EC1 (стандартный, работает быстрее при низкой температуре). Поддерживайте температуру помещения минимум 15°C.' });
    } else if (zone === 'warm' || zone === 'hot') {
      adjustments.push({ type: 'hardener', icon: '☀️', text: `Температура ${zone === 'hot' ? '>30' : '25-30'}°C: используйте EC2 (медленный отвердитель) для увеличения жизнеспособности смеси.` });
      if (zone === 'hot') {
        adjustments.push({ type: 'accelerator', icon: '⚠️', text: 'При >30°C: уменьшите EA1 до 1% (минимум). Работайте небольшими порциями.' });
      }
    }
  } else if (material.chemistry === 'wb') {
    if (zone === 'cold') {
      adjustments.push({ type: 'warning', icon: '⚠️', text: 'Температура <15°C: нанесение водоразбавимых материалов не рекомендуется. Риск нарушения плёнкообразования.' });
    } else if (zone === 'hot') {
      adjustments.push({ type: 'tip', icon: '💧', text: 'Температура >30°C: нанесение ранним утром или вечером. Можно увеличить разбавление водой до верхней границы.' });
    }
  }

  return adjustments;
}
