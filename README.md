# Froblok

Чистый дизайнерский сайт для поиска игроков Roblox.

- Реальный поиск через официальный Roblox API (прокси на сервере)
- Аватарки с Roblox
- Большое центральное окно со списком
- Поиск по центру сверху
- 3D-моделька, которая танцует (Three.js)
- Белый фон, лёгкие звёзды, которые медленно пульсируют/уменьшаются
- Без эмодзи

## Быстрый старт

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
- `GET /api/avatar/:userId` — аватарка (редирект на thumbnail)
- `GET /api/user/:userId` — описание и доп. инфо

## Деплой на GitHub + хостинг

1. Создай репозиторий на GitHub и залей эту папку.
2. Для работы API нужен Node-хостинг:
   - [Railway](https://railway.app)
   - [Render](https://render.com)
   - [Fly.io](https://fly.io)
3. Укажи команду запуска: `npm start`
4. Порт берётся из `process.env.PORT` автоматически.

На чистом GitHub Pages (только статика) поиск работать не будет — нужен бэкенд.

## Стек

- Express + node-fetch (прокси)
- Vanilla JS + Three.js r128
- Inter font
