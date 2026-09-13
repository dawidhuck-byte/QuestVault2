# Froblok

Чистый дизайнерский сайт для поиска игроков Roblox.

- Реальный поиск через официальный Roblox API (прокси на сервере)
- Аватарки с Roblox
- Большое центральное окно со списком
- Поиск по центру сверху
- 3D-моделька, которая танцует (Three.js)
- Белый фон, лёгкие звёзды, которые медленно пульсируют/уменьшаются
- Без эмодзи

## Структура проекта (важно)

```
froblok/
├── package.json
├── server.js          ← главный файл сервера (в корне!)
├── public/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
└── README.md
```

## Быстрый старт (локально)

```bash
npm install
npm start
```

Открой http://localhost:3000

## Музыка

Положи свои треки:

- `public/assets/music1.mp3` — Oh My Little Baby Boy (Instrumental Best Part Looped)
- `public/assets/music2.mp3` — type london (ONDA ANDAR)

Сейчас там silent-заглушки. После замены просто нажми кнопки track 1 / track 2 внизу.

## Что умеет сервер

- `GET /api/search?q=ник` — поиск пользователей Roblox
- `GET /api/avatar/:userId` — аватарка
- `GET /api/user/:userId` — описание и доп. инфо

## Деплой (Railway / Render / Fly и т.п.)

1. Залей **содержимое** папки froblok в корень репозитория.
   - В корне репозитория должны лежать `package.json` и `server.js` рядом.
   - Не клади всё внутрь ещё одной папки froblok.

2. Команда запуска: `npm start`  
   (или `node server.js`)

3. Порт берётся из `process.env.PORT` автоматически.

Если видишь ошибку `Cannot find module '/app/server/index.js'` — значит на хосте нет файла `server.js` в корне. Проверь, что файлы загружены правильно и Root Directory на хостинге указывает на папку, где лежит package.json.

На чистом GitHub Pages (только статика) поиск работать не будет — нужен бэкенд.

## Стек

- Express + node-fetch (прокси)
- Vanilla JS + Three.js r128
- Inter font
