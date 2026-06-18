const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const keywordDatabase = {
  страны: [
    { url: 'https://restcountries.com/v3.1/name/russia', label: 'Россия — информация о стране' },
    { url: 'https://restcountries.com/v3.1/name/germany', label: 'Германия — информация о стране' },
    { url: 'https://restcountries.com/v3.1/name/japan', label: 'Япония — информация о стране' },
  ],
  pokemon: [
    { url: 'https://pokeapi.co/api/v2/pokemon/pikachu', label: 'Покемон — Пикачу' },
    { url: 'https://pokeapi.co/api/v2/pokemon/charizard', label: 'Покемон — Чаризард' },
    { url: 'https://pokeapi.co/api/v2/pokemon/mewtwo', label: 'Покемон — Мьюту' },
  ],
  собаки: [
    { url: 'https://dog.ceo/api/breeds/list/all', label: 'Все породы собак' },
    { url: 'https://dog.ceo/api/breed/husky/images', label: 'Хаски — список фото' },
    { url: 'https://dog.ceo/api/breed/labrador/images', label: 'Лабрадор — список фото' },
  ],
  шутки: [
    { url: 'https://official-joke-api.appspot.com/random_joke', label: 'Случайная шутка' },
    { url: 'https://official-joke-api.appspot.com/jokes/programming/random', label: 'Шутка про программирование' },
    { url: 'https://official-joke-api.appspot.com/jokes/ten', label: '10 случайных шуток' },
  ],
  числа: [
    { url: 'http://numbersapi.com/42?json', label: 'Факт о числе 42' },
    { url: 'http://numbersapi.com/7/math?json', label: 'Математический факт о числе 7' },
    { url: 'http://numbersapi.com/random/year?json', label: 'Факт о случайном годе' },
  ],
  посты: [
    { url: 'https://jsonplaceholder.typicode.com/posts/1', label: 'Пост #1' },
    { url: 'https://jsonplaceholder.typicode.com/posts/2', label: 'Пост #2' },
    { url: 'https://jsonplaceholder.typicode.com/users', label: 'Все пользователи' },
  ],
};

app.get('/api/keywords', (req, res) => {
  res.json({ keywords: Object.keys(keywordDatabase) });
});

app.get('/api/urls', (req, res) => {
  const keyword = (req.query.keyword || '').toLowerCase().trim();

  if (!keyword) {
    return res.status(400).json({ error: 'Укажите ключевое слово' });
  }

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

  if (!targetUrl) {
    return res.status(400).json({ error: 'Укажите параметр url' });
  }

  const allUrls = Object.values(keywordDatabase).flat().map(u => u.url);
  if (!allUrls.includes(targetUrl)) {
    return res.status(403).json({ error: 'URL не входит в разрешённый список' });
  }

  try {
    const response = await axios.get(targetUrl, {
      timeout: 15000,
      headers: {
        'User-Agent': 'WebCrawler/1.0',
        'Accept': 'application/json, text/plain, */*',
      },
    });

    const body = typeof response.data === 'string'
      ? response.data
      : JSON.stringify(response.data);
    const size = Buffer.byteLength(body, 'utf8');

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Length', size);
    res.setHeader('X-Downloaded-Bytes', size);
    res.setHeader('Access-Control-Expose-Headers', 'X-Content-Length, X-Downloaded-Bytes');
    res.setHeader('Content-Length', size);

    res.status(200).send(body);

  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.statusText || err.message || 'Неизвестная ошибка';
    console.error(`Ошибка загрузки ${targetUrl}:`, message);
    if (!res.headersSent) {
      res.status(status).json({ error: `Не удалось загрузить: ${message}` });
    }
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Keywords: ${Object.keys(keywordDatabase).join(', ')}\n`);
});
