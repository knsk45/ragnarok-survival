<div align="center">

# Ragnarok Survival

**A browser survival game inspired by Ragnarok Online and Vampire Survivors**  
**Браузерный survival-экшен по мотивам Ragnarok Online и Vampire Survivors**

[![Version](https://img.shields.io/badge/version-0.17.2-7c3aed)](https://github.com/knsk45/ragnarok-survival/blob/main/docs/RELEASE-0.17.2.md)
[![Quality gate](https://github.com/knsk45/ragnarok-survival/actions/workflows/quality.yml/badge.svg)](https://github.com/knsk45/ragnarok-survival/actions/workflows/quality.yml)
[![Play online](https://img.shields.io/badge/PLAY_ONLINE-22c55e?style=for-the-badge)](https://knsk45.github.io/ragnarok-survival/)

[Русский](#русский) · [English](#english)

</div>

---

## Русский

Ragnarok Survival — бесплатный фанатский браузерный прототип: выберите ветку профессии, переживите 20-минутный забег и превратите героя в машину для уничтожения огромных волн монстров. Персонаж атакует и применяет включённые навыки автоматически — игрок управляет движением, сборкой и тактикой.

### Играть

**[Запустить актуальную версию в браузере](https://knsk45.github.io/ragnarok-survival/)**

Игра адаптирована для компьютеров и мобильных устройств. Прогресс активного забега сохраняется локально в браузере.

### Возможности

- четыре полностью доступные ветки: **Knight, Hunter, Wizard и Assassin**;
- последовательная смена профессий от Novice до финального класса;
- 20-минутные забеги с растущей плотностью волн — до 200 противников на поздней стадии;
- 48 видов обычных монстров и 17 боссов с локальными спрайтами;
- локация **Payon Forest 08** с препятствиями, коллизиями и навигацией монстров;
- деревья навыков, зависимости, SP, персональные перезарядки, баффы и автоматические сборки;
- тактика автобоя: универсальный режим, контроль, экономия SP и приоритет босса;
- Gift Box, временные эффекты, экипировка и отчёт по итогам забега;
- эндгейм после Base 99 / Job 50: случайные пробуждения без паузы, перемножающиеся усиления и уникальное развитие каждого класса;
- сохранение и восстановление незавершённого забега.

### Управление

| Платформа | Движение | Пауза |
|---|---|---|
| Компьютер | `WASD` или стрелки | `P` или кнопка паузы |
| Телефон / планшет | Виртуальный джойстик: коснитесь игрового поля и ведите пальцем | Кнопка паузы |

Атаки и активные навыки срабатывают автоматически. В меню паузы можно настроить навыки, стратегию боя, скорость игры, резерв SP и автопрокачку по выбранному билду.

### Локальный запуск

Игра не требует сборки: достаточно любого локального HTTP-сервера.

```bash
git clone https://github.com/knsk45/ragnarok-survival.git
cd ragnarok-survival
python3 -m http.server 8000
```

Откройте `http://localhost:8000`.

Для тестов нужен Node.js 22:

```bash
npm ci
npm test
npx playwright install chromium webkit
BROWSER_ALL=1 npm run test:browser
```

### Устройство проекта

| Каталог | Назначение |
|---|---|
| `data/` | Профессии, навыки, монстры, боссы, карты, предметы и баланс |
| `engine/` | Игровой цикл, бой, AI, пробуждения, сохранения и интерфейс |
| `assets/` | Локальные игровые спрайты и иконки |
| `styles/` | Адаптивное оформление игры |
| `tests/` | Модульные, интеграционные и браузерные сценарии |
| `docs/` | Архитектура и история релизов |

Подробное техническое описание находится в [docs/ENGINE.md](docs/ENGINE.md), изменения текущей версии — в [docs/RELEASE-0.17.2.md](docs/RELEASE-0.17.2.md).

### Статус и источники

Проект находится в активной разработке. Игровые параметры и описания профессий сверяются с [iRO Wiki](https://irowiki.org/) и [iRO Wiki DB](https://db.irowiki.org/db/), но механики адаптированы под формат survival-экшена.

Это неофициальный некоммерческий фанатский проект. Он не связан с Gravity Co., Ltd. или официальными издателями Ragnarok Online. Права на упомянутые названия и оригинальные материалы принадлежат их владельцам.

Нашли ошибку или есть идея? [Создайте issue](https://github.com/knsk45/ragnarok-survival/issues).

---

## English

Ragnarok Survival is a free fan-made browser prototype: choose a class path, survive a 20-minute run, and turn your hero into a screen-clearing powerhouse. The character attacks and casts enabled skills automatically while the player controls movement, build progression, and combat tactics.

### Play

**[Launch the latest version in your browser](https://knsk45.github.io/ragnarok-survival/)**

The game supports desktop and mobile browsers. Active-run progress is saved locally in your browser.

### Features

- four fully playable paths: **Knight, Hunter, Wizard, and Assassin**;
- class progression from Novice to a final job;
- 20-minute runs with increasingly dense waves — up to 200 enemies in the late game;
- 48 regular monster types and 17 bosses with local sprite assets;
- **Payon Forest 08**, including obstacles, collision, and monster navigation;
- skill trees, prerequisites, SP, independent cooldowns, buffs, and automatic builds;
- configurable auto-combat tactics: balanced, crowd control, SP conservation, and boss priority;
- Gift Boxes, temporary effects, equipment progression, and an end-of-run report;
- post-99/50 endgame: uninterrupted random awakenings, multiplicative upgrades, and class-specific evolutions;
- save and resume support for unfinished runs.

### Controls

| Platform | Movement | Pause |
|---|---|---|
| Desktop | `WASD` or arrow keys | `P` or the pause button |
| Phone / tablet | Touch the playfield and drag the virtual joystick | Pause button |

Basic attacks and active skills trigger automatically. The pause menu lets you configure skills, combat strategy, game speed, SP reserve, and build-based automatic skill allocation.

### Run locally

The game has no build step; serve the repository with any local HTTP server.

```bash
git clone https://github.com/knsk45/ragnarok-survival.git
cd ragnarok-survival
python3 -m http.server 8000
```

Open `http://localhost:8000`.

Node.js 22 is required to run the test suite:

```bash
npm ci
npm test
npx playwright install chromium webkit
BROWSER_ALL=1 npm run test:browser
```

### Project structure

| Directory | Purpose |
|---|---|
| `data/` | Jobs, skills, monsters, bosses, maps, items, and balance data |
| `engine/` | Game loop, combat, AI, awakenings, persistence, and UI |
| `assets/` | Local game sprites and icons |
| `styles/` | Responsive game styling |
| `tests/` | Unit, integration, and browser scenarios |
| `docs/` | Architecture notes and release history |

See [docs/ENGINE.md](docs/ENGINE.md) for technical details and [docs/RELEASE-0.17.2.md](docs/RELEASE-0.17.2.md) for the current release notes.

### Status and sources

This project is under active development. Class descriptions and game data are checked against [iRO Wiki](https://irowiki.org/) and [iRO Wiki DB](https://db.irowiki.org/db/), then adapted for survival-action gameplay.

This is an unofficial, non-commercial fan project. It is not affiliated with Gravity Co., Ltd. or any official Ragnarok Online publisher. All referenced names and original materials belong to their respective owners.

Found a bug or have an idea? [Open an issue](https://github.com/knsk45/ragnarok-survival/issues).
