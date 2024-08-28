# 🎨 Обновление дизайна сайта [FreshCraft](https://freshcraft.org/) 🌐

![Website Design](https://freshcraft.org/assets/images/logos/minecraft_fresh.png)

## 📋 Содержание / Content

1. [Измененные страницы / Modified Pages](#измененные-страницы--modified-pages)
2. [Описание проекта / Project Description](#описание-проекта--project-description)
3. [Запуск проекта / Running the Project](#запуск-проекта--running-the-project)
4. [Структура проекта / Project Structure](#структура-проекта--project-structure)
5. [Технологии / Technologies](#технологии--technologies)
6. [Контакты / Contact](#контакты--contact)

## Измененные страницы / Modified Pages

1. `/` - Главная страница / Main Page
2. `/servers` - Список серверов / Servers List
3. `/servers/<server>` (например, `/servers/revived`) - Описание сервера / Server Description
4. `/servers/<server>/rules` (например, `/servers/revived/rules`) - Правила сервера / Server Rules

## Описание проекта / Project Description

Этот проект представляет собой веб-приложение, разработанное с использованием Flask, для игрового сообщества. В проекте
предоставляется информация о серверах и правилах, а также включены описания страниц и маршрутизация. Возможности проекта
включают:

- 🌟 Главная страница с выделенными серверами
- 🕹️ Список доступных игровых серверов
- ℹ️ Детальная информация по каждому серверу и его правилам
- 📁 Поддержка статических файлов и перенаправление favicon

This project is a Flask-based web application for a gaming community, providing server information and rules, along with
detailed page descriptions and routing. Project features include:

- 🌟 Main page with featured servers
- 🕹️ List of available game servers
- ℹ️ Detailed server-specific information and rules
- 📁 Support for serving static files and favicon

## Запуск проекта / Running the Project

### Простой запуск без Docker / Simple Run without Docker

1. Убедитесь, что у вас установлен Python 3.12 и виртуальное окружение.
2. Склонируйте репозиторий:

```bash
git clone https://github.com/Andrei-Raev/FreshCraft.git
cd freshcraft
```

3. Установите необходимые зависимости:

```bash
pip install -r requirements.txt
```

4. Запустите Flask-приложение:

```bash
python app.py
```

🌿 Ваше Flask-приложение будет доступно по `http://localhost:8000`.

### Альтернативый запуск с Docker / Alternative Run with Docker

1. Установите Docker и Docker Compose.
2. Склонируйте репозиторий.
3. Запустите команду:

```bash
docker-compose up --build
```

🍃 Your Flask app will run on `http://localhost:8000`, and `nginx` will handle traffic on ports `80` and `443` with
HTTP/2 support.

## Структура проекта / Project Structure

- `app.py` - Главный файл приложения / Main application file
- `Dockerfile` - Инструкции для контейнеризации / Docker container instructions
- `docker_compose.yml` - Конфигурация Docker Compose / Docker Compose configuration
- `data` - Данные серверов / Server data
- `static` - Статические файлы / Static files
- `templates` - Шаблоны страниц / Page templates
- `nginx.conf` - Конфиг Nginx / Nginx configuration

## Технологии / Technologies

- 🐍 Python 3.12
- ⚙️ Flask
- 🐳 Docker & Docker Compose
- 🌐 Nginx
- 🔄 HTTP/2 support

## Контакты / Contact

Если у вас возникли вопросы или предложения, пожалуйста, свяжитесь со мной
через [andrey-raev.raev@yandex.ru](mailto:andrey-raev.raev@yandex.ru).

---

✨ Надеемся, вам понравится проект!

✨ Hope you enjoy the project!