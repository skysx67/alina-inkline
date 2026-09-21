# ALINA INKLINE

Одностраничный frontend‑концепт личного бренда тату‑мастера из Тюмени. React + TypeScript + Vite, GSAP/ScrollTrigger, Lenis и один OGL‑шейдер. Все заявки остаются только в состоянии React: сетевых запросов, localStorage, backend и загрузки файлов нет.

## Запуск

```bash
npm install
npm run dev
```

Production‑проверка:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:smoke
```

Для первого локального запуска Playwright может потребоваться установка браузеров:

```bash
npx playwright install chromium firefox webkit
```

Базовый прогон использует установленные Chrome и Edge, WebKit/iPhone и Chromium/touch. Firefox можно добавить отдельным прогоном:

```powershell
$env:INCLUDE_FIREFOX=1; npm run test:smoke
```

## Где менять содержимое

- `src/siteContent.ts` — портфолио, навигация, этапы процесса и FAQ.
- `src/site.ts` — бренд, город, социальные ссылки, демо‑режим и профиль анимаций.
- `src/styles.css` — токены, композиция, responsive и reduced motion.
- `public/assets/images` — оптимизированные AVIF/WebP.

Чтобы заменить фотографию, положите файлы с одинаковым базовым именем в `public/assets/images`, например `real-work-01.avif` и `real-work-01.webp`, затем укажите `assets/images/real-work-01` в `siteContent.ts`. Сохраняйте осмысленный `alt` и размеры ниже 200–250 КБ, где это возможно.

## Социальные ссылки

В `src/site.ts` у каждого пункта `socials` есть `href` и флаг `active`. Пока `active: false`, контакт отображается как неактивный `… / скоро`. После добавления реального URL заполните `href` и переключите `active: true`.

## Будущая Telegram‑интеграция

Текущая форма не отправляет данные. Для реального запуска нужен отдельный защищённый backend/serverless endpoint: он должен валидировать поля, ограничивать частоту запросов, безопасно хранить токен Telegram только на сервере и возвращать понятные состояния ошибки. Файлы‑референсы требуют отдельной согласованной политики хранения и удаления. Не помещайте bot token в frontend или переменные `VITE_*`.

## GitHub Pages

Vite использует относительный production‑base, поэтому ассеты работают из любой подпапки GitHub Pages. Публикация идёт из ветки `gh-pages`:

```bash
npm run deploy
```

Команда сначала собирает production‑версию, затем обновляет ветку публикации. Имя репозитория можно менять без перенастройки путей к ассетам.

## Визуальные и лицензионные примечания

Страница явно помечена `CONCEPT / TEMPORARY VISUALS`. Атрибуция временных фото и происхождение сгенерированных кадров описаны в `ASSET_CREDITS.md`; визуальная философия — в `DESIGN_DIRECTION.md`.
