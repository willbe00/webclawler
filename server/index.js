const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { Readable } = require('stream');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ── Встроенные текстовые файлы (гарантированно работают) ──────────────────
const localContent = {
  'local://about-nodejs': {
    label: 'О платформе Node.js',
    type: 'text/plain',
    body: `Node.js — это среда выполнения JavaScript, построенная на движке V8 от Google Chrome.
Node.js использует событийно-управляемую, неблокирующую модель ввода-вывода, что делает
её лёгкой и эффективной. Экосистема пакетов Node.js (npm) является крупнейшей в мире
экосистемой библиотек с открытым исходным кодом.

Основные особенности:
- Асинхронная и событийно-управляемая модель
- Высокая производительность благодаря движку V8
- Единый язык (JavaScript) для клиента и сервера
- Огромная экосистема пакетов (npm)
- Отлично подходит для API, чатов, стриминга данных

Создан Райаном Далем в 2009 году. Сегодня Node.js используется в Netflix, LinkedIn,
Uber, NASA и тысячах других компаний по всему миру.`,
  },
  'local://about-http': {
    label: 'Как работает HTTP протокол',
    type: 'text/plain',
    body: `HTTP (HyperText Transfer Protocol) — протокол передачи данных в интернете.

Основные методы HTTP:
  GET    — получить ресурс
  POST   — отправить данные
  PUT    — обновить ресурс
  DELETE — удалить ресурс
  PATCH  — частично обновить ресурс

Структура HTTP запроса:
  [Метод] [URL] [Версия протокола]
  [Заголовки]
  [Тело запроса]

Коды ответов:
  1xx — Информационные
  2xx — Успех (200 OK, 201 Created)
  3xx — Перенаправление (301, 302)
  4xx — Ошибка клиента (400, 401, 403, 404)
  5xx — Ошибка сервера (500, 502, 503)

HTTP/1.1 появился в 1997 году. HTTP/2 в 2015 году добавил мультиплексирование
и сжатие заголовков. HTTP/3 использует QUIC вместо TCP.`,
  },
  'local://about-js': {
    label: 'JavaScript — краткая история',
    type: 'text/plain',
    body: `JavaScript был создан Бренданом Эйхом в 1995 году за 10 дней для браузера Netscape.
Изначально назывался Mocha, затем LiveScript, и наконец JavaScript — для маркетинга
вместе с популярной тогда Java.

Ключевые моменты истории:
  1995 — Создан в Netscape
  1997 — Стандартизирован как ECMAScript
  2005 — AJAX меняет веб (Gmail, Google Maps)
  2009 — Node.js выходит за пределы браузера
  2015 — ES6 (стрелочные функции, классы, промисы)
  2020 — ES2020 (Optional Chaining, Nullish Coalescing)

Сегодня JavaScript — самый популярный язык программирования в мире по версии
GitHub и Stack Overflow уже более 10 лет подряд.

Основные концепции:
- Прототипное наследование
- Замыкания (Closures)
- Асинхронность (Callbacks → Promises → Async/Await)
- Событийная модель (Event Loop)`,
  },
  'local://about-web': {
    label: 'Как работает интернет',
    type: 'text/plain',
    body: `Интернет — глобальная сеть компьютеров, общающихся по стандартным протоколам.

Что происходит когда вы открываете сайт:

  1. Браузер → DNS-запрос: "какой IP у google.com?"
  2. DNS-сервер отвечает: "142.250.185.46"
  3. Браузер открывает TCP-соединение с сервером
  4. Отправляет HTTP GET запрос
  5. Сервер обрабатывает запрос
  6. Отвечает HTML/CSS/JS файлами
  7. Браузер рендерит страницу

Ключевые протоколы:
  DNS   — система доменных имён
  TCP   — надёжная передача данных
  IP    — маршрутизация пакетов
  HTTP  — передача веб-страниц
  HTTPS — зашифрованный HTTP (TLS/SSL)

Скорость света в оптоволокне ~200 000 км/с.
Пинг от Москвы до Нью-Йорка ~90 мс.`,
  },
  'local://about-git': {
    label: 'Git — система контроля версий',
    type: 'text/plain',
    body: `Git — распределённая система контроля версий, созданная Линусом Торвальдсом в 2005 году
для разработки ядра Linux.

Основные команды:
  git init        — инициализировать репозиторий
  git clone URL   — клонировать репозиторий
  git add .       — добавить файлы в индекс
  git commit -m   — зафиксировать изменения
  git push        — отправить на сервер
  git pull        — получить с сервера
  git branch      — управление ветками
  git merge       — слияние веток

Концепция:
  Каждый коммит — это снимок всего проекта, а не набор изменений.
  Git хранит историю в виде направленного ациклического графа (DAG).
  Ветки — это просто указатели на коммиты.

Сегодня Git используется в 90%+ компаний мира.
GitHub, GitLab, Bitbucket — крупнейшие хостинги Git-репозиториев.`,
  },
  'local://about-sql': {
    label: 'SQL — язык запросов к базам данных',
    type: 'text/plain',
    body: `SQL (Structured Query Language) — язык структурированных запросов для работы с
реляционными базами данных. Разработан IBM в 1970-х, стандартизирован в 1986 году.

Основные операторы:
  SELECT — выборка данных
  INSERT — добавление записей
  UPDATE — обновление записей
  DELETE — удаление записей
  CREATE — создание таблиц
  JOIN   — объединение таблиц

Пример запроса:
  SELECT users.name, orders.total
  FROM users
  JOIN orders ON users.id = orders.user_id
  WHERE orders.total > 1000
  ORDER BY orders.total DESC;

Популярные СУБД:
  PostgreSQL — мощная open-source СУБД
  MySQL      — самая популярная в вебе
  SQLite     — встроенная БД (файл на диске)
  MongoDB    — документная NoSQL база

SQL остаётся одним из самых востребованных навыков в IT уже 50 лет.`,
  },
  'local://about-linux': {
    label: 'Linux — операционная система',
    type: 'text/plain',
    body: `Linux — семейство Unix-подобных операционных систем на базе ядра Linux,
созданного Линусом Торвальдсом в 1991 году.

Архитектура:
  Ядро (Kernel)    — управляет железом
  Оболочка (Shell) — интерфейс пользователя
  Утилиты          — набор программ (GNU)

Популярные дистрибутивы:
  Ubuntu    — для новичков и рабочих станций
  Debian    — стабильность превыше всего
  Arch      — максимальный контроль
  CentOS    — для серверов (корпоративный)
  Android   — Linux на мобильных

Факты:
  - Linux работает на 96% серверов в мире
  - Все 500 самых мощных суперкомпьютеров работают на Linux
  - Android — это Linux
  - Ядро Linux содержит ~28 миллионов строк кода

Основные команды:
  ls, cd, pwd, cp, mv, rm, mkdir
  grep, find, cat, tail, chmod, sudo`,
  },
  'local://about-algorithms': {
    label: 'Алгоритмы сортировки',
    type: 'text/plain',
    body: `Алгоритмы сортировки — одна из фундаментальных тем в информатике.

Основные алгоритмы и их сложность:

  Пузырьковая сортировка (Bubble Sort)
    Лучший случай:  O(n)
    Худший случай:  O(n²)
    Память:         O(1)
    Простейший алгоритм, но медленный на больших данных.

  Быстрая сортировка (Quick Sort)
    Лучший случай:  O(n log n)
    Худший случай:  O(n²)
    Память:         O(log n)
    На практике один из самых быстрых алгоритмов.

  Сортировка слиянием (Merge Sort)
    Лучший случай:  O(n log n)
    Худший случай:  O(n log n)
    Память:         O(n)
    Стабильная, гарантированная сложность.

  Сортировка кучей (Heap Sort)
    Лучший случай:  O(n log n)
    Худший случай:  O(n log n)
    Память:         O(1)
    Не требует дополнительной памяти.

Для большинства задач лучше использовать встроенную сортировку языка —
она как правило реализует TimSort (гибрид Merge Sort и Insertion Sort).`,
  },
};

// ── Внешние URL (реальные источники) ──────────────────────────────────────
const externalUrls = {
  'https://jsonplaceholder.typicode.com/posts/1': 'Тестовый пост #1 (JSONPlaceholder)',
  'https://jsonplaceholder.typicode.com/users/1': 'Тестовый пользователь #1 (JSONPlaceholder)',
  'https://jsonplaceholder.typicode.com/todos/1': 'Тестовая задача #1 (JSONPlaceholder)',
  'https://pokeapi.co/api/v2/pokemon/pikachu': 'Покемон Пикачу (PokéAPI)',
  'https://pokeapi.co/api/v2/pokemon/charizard': 'Покемон Чаризард (PokéAPI)',
  'https://dog.ceo/api/breeds/list/all': 'Все породы собак (dog.ceo)',
  'https://restcountries.com/v3.1/name/russia': 'Данные о России (RestCountries)',
  'https://restcountries.com/v3.1/name/germany': 'Данные о Германии (RestCountries)',
};

// ── База ключевых слов ─────────────────────────────────────────────────────
const keywordDatabase = {
  технологии: [
    { url: 'local://about-nodejs',    label: 'О платформе Node.js' },
    { url: 'local://about-http',      label: 'Как работает HTTP протокол' },
    { url: 'local://about-js',        label: 'JavaScript — краткая история' },
  ],
  интернет: [
    { url: 'local://about-web',       label: 'Как работает интернет' },
    { url: 'local://about-http',      label: 'Как работает HTTP протокол' },
    { url: 'https://jsonplaceholder.typicode.com/posts/1', label: 'Тестовый пост (JSONPlaceholder)' },
  ],
  программирование: [
    { url: 'local://about-git',       label: 'Git — система контроля версий' },
    { url: 'local://about-algorithms', label: 'Алгоритмы сортировки' },
    { url: 'local://about-sql',       label: 'SQL — язык запросов' },
  ],
  linux: [
    { url: 'local://about-linux',     label: 'Linux — операционная система' },
    { url: 'local://about-git',       label: 'Git — система контроля версий' },
    { url: 'https://dog.ceo/api/breeds/list/all', label: 'Все породы собак (dog.ceo)' },
  ],
  pokemon: [
    { url: 'https://pokeapi.co/api/v2/pokemon/pikachu',   label: 'Покемон Пикачу' },
    { url: 'https://pokeapi.co/api/v2/pokemon/charizard', label: 'Покемон Чаризард' },
    { url: 'https://jsonplaceholder.typicode.com/users/1', label: 'Тестовый пользователь' },
  ],
  страны: [
    { url: 'https://restcountries.com/v3.1/name/russia',  label: 'Данные о России' },
    { url: 'https://restcountries.com/v3.1/name/germany', label: 'Данные о Германии' },
    { url: 'local://about-linux',     label: 'Linux — операционная система' },
  ],
};

// ── Все разрешённые URL ────────────────────────────────────────────────────
const allAllowedUrls = new Set([
  ...Object.keys(localContent),
  ...Object.keys(externalUrls),
]);

app.get('/api/keywords', (req, res) => {
  res.json({ keywords: Object.keys(keywordDatabase) });
});

app.get('/api/urls', (req, res) => {
  const keyword = (req.query.keyword || '').toLowerCase().trim();
  if (!keyword) return res.status(400).json({ error: 'Укажите ключевое слово' });

  const urls = keywordDatabase[keyword];
  if (!urls) {
    return res.status(404).json({
      error: `Ключевое слово "${keyword}" не найдено`,
      available: Object.keys(keywordDatabase),
    });
  }
  res.json({ keyword, urls });
});

app.get('/api/download', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) return res.status(400).json({ error: 'Укажите параметр url' });
  if (!allAllowedUrls.has(targetUrl)) return res.status(403).json({ error: 'URL не входит в разрешённый список' });

  // ── Локальный контент — стримим из памяти ──
  if (targetUrl.startsWith('local://')) {
    const item = localContent[targetUrl];
    if (!item) return res.status(404).json({ error: 'Локальный контент не найден' });

    const body = item.body;
    const size = Buffer.byteLength(body, 'utf8');

    res.setHeader('Content-Type', item.type + '; charset=utf-8');
    res.setHeader('X-Content-Length', size);
    res.setHeader('Access-Control-Expose-Headers', 'X-Content-Length, X-Downloaded-Bytes');

    // Стримим кусками по 256 байт — виден реальный прогресс
    const chunkSize = 256;
    const readable = new Readable({ read() {} });
    res.setHeader('Transfer-Encoding', 'chunked');

    let offset = 0;
    let downloaded = 0;
    const buf = Buffer.from(body, 'utf8');

    const interval = setInterval(() => {
      if (offset >= buf.length) {
        clearInterval(interval);
        readable.push(null);
        return;
      }
      const chunk = buf.slice(offset, offset + chunkSize);
      offset += chunkSize;
      downloaded += chunk.length;
      res.setHeader('X-Downloaded-Bytes', downloaded);
      readable.push(chunk);
    }, 50);

    readable.pipe(res);

    req.on('close', () => clearInterval(interval));
    return;
  }

  // ── Внешний URL — стримим через Axios ──
  try {
    const response = await axios.get(targetUrl, {
      responseType: 'stream',
      timeout: 15000,
      headers: { 'User-Agent': 'WebCrawler/1.0', 'Accept': 'application/json, text/plain, */*' },
    });

    const contentLength = response.headers['content-length'];
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/json');
    res.setHeader('X-Content-Length', contentLength || '0');
    res.setHeader('Access-Control-Expose-Headers', 'X-Content-Length, X-Downloaded-Bytes');

    let downloaded = 0;
    response.data.on('data', (chunk) => {
      downloaded += chunk.length;
      res.setHeader('X-Downloaded-Bytes', downloaded);
    });
    response.data.on('error', (err) => {
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
    response.data.pipe(res);

  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.statusText || err.message || 'Неизвестная ошибка';
    console.error(`Ошибка загрузки ${targetUrl}:`, message);
    if (!res.headersSent) res.status(status).json({ error: `Не удалось загрузить: ${message}` });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

process.on('uncaughtException', (err) => console.error('uncaughtException:', err.message));
process.on('unhandledRejection', (reason) => console.error('unhandledRejection:', reason));

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Keywords: ${Object.keys(keywordDatabase).join(', ')}\n`);
});
