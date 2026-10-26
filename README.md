<p align="center"><img src="public/og-banner.png" alt="Hanafubuki" width="100%"></p>

# ❀ hanafubuki-site

Сайт Minecraft-сервера Hanafubuki — **https://hanafubuki.samedy.xyz** (коротко: https://hf.samedy.xyz).

Одна статичная страница на [Astro](https://astro.build): без UI-библиотек, аналитики, трекеров и cookie-баннеров. Оформление — Material Design 3 (тёмная схема из палитры STYLE.md, без градиентов). Шрифты (Lora для заголовков + Google Sans, оба с кириллицей) лежат на самом сайте, CSS встроен в HTML — ни одного блокирующего запроса.

## Локальный запуск

Нужен Node.js 24 (или 22.23.4+).

```bash
npm ci
npm run dev       # http://localhost:4321, с автообновлением
npm run build     # статическая сборка в dist/
npm run preview   # посмотреть собранный dist/
```

## Где что менять

| Что | Где |
|---|---|
| Все тексты страницы | `src/content/site.ru.json` |
| Адреса, порт, ссылки, флаги (`mapReady`) | `src/config.json` |
| Цвета (роли M3), шрифты, отступы | `src/styles/global.css` (палитра — из [STYLE.md](https://github.com/Hanafubuki-minecraft/hanafubuki-brand/blob/main/STYLE.md)) |
| Разметка секций | `src/components/Landing.astro` |
| Лепестки, статус, «скопировать», табы правил | `src/scripts/` |
| Логотип, favicon, OG-картинка | `public/` (взяты из [hanafubuki-brand](https://github.com/Hanafubuki-minecraft/hanafubuki-brand)) |

**Как обновить тексты.** Правь `src/content/site.ru.json` прямо на GitHub (карандаш → Commit) — через минуту сайт пересоберётся сам. В текстах работает мини-разметка: `**жирный**`, `*курсив*`, `` `команда` ``; `{host}` и `{port}` подставляются из `src/config.json`. Источник фактов — [INFO.md](https://github.com/Hanafubuki-minecraft/hanafubuki-brand/blob/main/INFO.md), голос — [STYLE.md](https://github.com/Hanafubuki-minecraft/hanafubuki-brand/blob/main/STYLE.md).

**Скриншоты.** Лежат в `src/assets/screens/` (копии `screenshots/web/*.webp` из [hanafubuki-brand](https://github.com/Hanafubuki-minecraft/hanafubuki-brand/tree/main/screenshots)). Подписи — в `site.ru.json` → `shots`, какие кадры в галерее — `gallery.items` (первый — крупный), широкие вставки между секциями — `inserts`, превью карты — `map.shots`. Новый кадр: положи файл в `src/assets/screens/`, добавь подпись в `shots` и имя файла (без расширения) в нужный список. Размеры и форматы (AVIF + WebP) Astro делает сам при сборке.

**Карта.** Когда `map.hanafubuki.samedy.xyz` заработает по HTTPS, поставь в `src/config.json` `"mapReady": true` — пометка «скоро» исчезнет, кнопка начнёт вести на карту.

**Английская версия позже.** Скопируй `site.ru.json` в `site.en.json`, переведи и создай `src/pages/en/index.astro` с теми же строками, что в `src/pages/index.astro`, но с импортом `site.en.json`.

## Живой статус

Браузер сам спрашивает [mcsrvstat.us](https://mcsrvstat.us): Java — `api.mcsrvstat.us/3/mc.samedy.xyz`, Bedrock — `api.mcsrvstat.us/bedrock/3/mc.samedy.xyz:19132`. Ответ хранится в памяти, обновление раз в 60 секунд и только пока вкладка открыта. Если API недоступен — показывается «Не удалось узнать». У mcsrvstat свой кэш (около минуты), так что цифры могут отставать.

## Деплой

`.github/workflows/deploy.yml` собирает сайт и публикует его на GitHub Pages (`actions/deploy-pages`) на каждый пуш в `main`. Ручной запуск — Actions → Deploy to GitHub Pages → Run workflow.

Один раз в настройках репозитория:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Custom domain:** `hanafubuki.samedy.xyz` → Save. (Файл `public/CNAME` уже есть, но в настройках домен тоже нужно указать.)
3. Подожди, пока GitHub проверит DNS и выпустит сертификат (от пары минут до суток), и включи **Enforce HTTPS** — тогда `http://` будет перенаправляться на `https://`. Пока галочка серая — сертификат ещё выпускается.

## DNS

Все записи — в DNS домена `samedy.xyz` на Porkbun (Domain Management → `samedy.xyz` → **DNS**). В поле Host пишется только поддомен, без `.samedy.xyz`; TTL — по умолчанию (600). Сертификаты выпускают сами GitHub Pages и Caddy.

| Имя | Тип | Значение | Зачем |
|---|---|---|---|
| `hanafubuki` | CNAME | `hanafubuki-minecraft.github.io` | этот сайт |
| `hf` | CNAME | `hanafubuki-minecraft.github.io` | короткая ссылка, репо [`hanafubuki-short`](https://github.com/Hanafubuki-minecraft/hanafubuki-short) |
| `mc` | A | `91.214.31.132` | вход в игру: Java `mc.samedy.xyz`, Bedrock `mc.samedy.xyz` порт `19132` |
| `map.hanafubuki` | A | `91.214.31.132` | карта мира (BlueMap через Caddy), см. «Дальше» |

Проверить: `bash check-dns.sh` (нужен `dig`) или вручную:

```bash
dig +short hanafubuki.samedy.xyz CNAME   # hanafubuki-minecraft.github.io.
dig +short hf.samedy.xyz CNAME           # hanafubuki-minecraft.github.io.
dig +short mc.samedy.xyz A               # 91.214.31.132
dig +short map.hanafubuki.samedy.xyz A   # 91.214.31.132
```

Если `dig` показывает `pixie.porkbun.com` или IP Porkbun — сработала парковочная wildcard-запись `*`, а нужной записи нет или в Host опечатка. Если `mc` или `map.hanafubuki` указывают не на `91.214.31.132` — исправь A-запись.

> `map.hanafubuki.samedy.xyz` — домен четвёртого уровня: в Porkbun в Host пишется `map.hanafubuki`. Сертификат на него выпускает сам Caddy.

## Дальше

Пока не сделано — план на будущее.

### Карта мира по HTTPS — готово

Работает: https://map.hanafubuki.samedy.xyz (Caddy на nixserver, порты 80/443 проброшены на роутере). Как настроено:

Caddy на nixserver (NixOS, Docker) перед BlueMap:

```caddyfile
map.hanafubuki.samedy.xyz {
	reverse_proxy localhost:8123
}
```

- Caddy сам получит и будет продлевать сертификат Let's Encrypt — для этого на роутере нужен проброс портов **80 и 443** на nixserver.
- Если Caddy в Docker, `localhost` — это сам контейнер: используй `network_mode: host` или адрес контейнера BlueMap (`bluemap:8100` в общей сети).
- DNS: A `map.hanafubuki` → `91.214.31.132`, только DNS.
- Когда `https://map.hanafubuki.samedy.xyz` откроется — `"mapReady": true` в `src/config.json`, а старую ссылку `http://91.214.31.132:8123` можно убрать из `links.mapFallback` и из INFO.md.

### HTTPS-сигналинг NetherNet для Geyser

Чтобы Bedrock-игроки не видели запрос «доверять при первом подключении», Geyser может отдавать NetherNet-сигналинг по HTTPS на `mc.samedy.xyz` — инструкция: https://geysermc.org/wiki/geyser/nethernet-https/. Понадобится сертификат на `mc.samedy.xyz` (его тоже может выпускать Caddy).

## Чек-лист запуска

**DNS (Porkbun, `samedy.xyz` → DNS)**

- [ ] `hanafubuki` — CNAME → `hanafubuki-minecraft.github.io`
- [ ] `hf` — CNAME → `hanafubuki-minecraft.github.io`
- [ ] `mc` — A → `91.214.31.132`
- [ ] `map.hanafubuki` — A → `91.214.31.132` (когда будет Caddy)
- [ ] нет конфликтующих записей с теми же именами (старых A/AAAA/TXT)

**GitHub → `hanafubuki-site` → Settings → Pages**

- [ ] Source: **GitHub Actions**
- [ ] Custom domain: `hanafubuki.samedy.xyz`, «DNS check successful»
- [ ] **Enforce HTTPS** включён
- [ ] Actions → последний «Deploy to GitHub Pages» зелёный

**GitHub → `hanafubuki-short` → Settings → Pages**

- [ ] Source: **GitHub Actions**
- [ ] Custom domain: `hf.samedy.xyz`, «DNS check successful»
- [ ] **Enforce HTTPS** включён
- [ ] `https://hf.samedy.xyz/#rules` открывает `https://hanafubuki.samedy.xyz/#rules`

**По желанию:** Organization → Settings → Pages → *Verified domains* → добавь `samedy.xyz` — тогда никто другой не сможет занять поддомены на GitHub Pages.

---

Не является официальным продуктом Minecraft. Не одобрено и не связано с Mojang или Microsoft.
