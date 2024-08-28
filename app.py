"""
This Flask application serves a website for a gaming community with server information and rules.

The application includes routes to:
1. Display the homepage with featured servers.
2. Show a list of available servers.
3. Present server-specific information and rules.
4. Serve static files and the favicon.

Dependencies:
    - Flask for web serving and templating.
    - JSON for reading server data from files.

Start the server by running this file, which will host the application on the specified IP and port.
"""

import json
from flask import Flask, render_template, Response

app = Flask(__name__)


@app.route('/')
def index() -> str:
    """
    Renders the homepage with a welcome section and a list of featured servers.

    :return: Rendered HTML template of the index page.
    """
    welcome_servers = {
        'title': 'Встречайте - сервера!',
        'button': {'title': 'Начать играть', 'url': '/servers'},
        'content': [
            {
                'title': 'Присоединяйся к игрокам на сервер',
                'text': '''Играть с друзьями намного интереснее, особенно когда их так много! Заходите на сервера и развивайтесь вместе со всеми игроками. Придумай то, кем ты будешь и войди в свою роль.
                            Потрясающая атмосфера, отсутствие привата, войс чат и ничего лишнего''',
                'image': '/static/images/bg/image_22.jpg'
            },
            {
                'title': 'Мы за адекватное комьюнити',
                'text': '''Столбы, засорение ландшафта, однообразные и страшные авто-фермы не приветствуются!
                            Внимательная и строгая администрация не допустит нарушения правил, испорченной атмосферы и общего впечатления от игры на сервере, играйте спокойно и с удовольствием!''',
                'image': '/static/images/bg/image_9.jpg'
            },
            {
                'title': 'Интересное сочетание упрощённого RP и анархии',
                'text': '''Вы можете объединиться с другими игроками, создавать свои условные племена, или кланы, обмениваться ресурсами и даже например объявлять войны другим кланам. Но имейте в виду, что на каждого преступника найдётся свой суд!
                                    Дайте волю фантазии, всё в ваших руках!''',
                'image': '/static/images/bg/image_14.jpg'
            }
        ]
    }

    news = [welcome_servers]

    return render_template('index.html', news=news)


@app.route('/servers')
def servers() -> str:
    """
    Renders the servers page listing all available game servers.

    :return: Rendered HTML template of the servers page.
    """
    return render_template('servers.html')


@app.route('/servers/<server>')
def server(server_name: str) -> str:
    """
    Renders the page for a specific server, displaying its details.

    :param server_name: The name of the server.
    :return: Rendered HTML template of the server page with server content.
    """
    with open(f'data/servers/{server_name}.json', 'r', encoding='utf-8') as f:
        content = json.load(f)

    return render_template('server.html', content=content)


@app.route('/servers/<server>/rules')
def server_rules(server_name: str) -> str:
    """
    Renders the rules page for a specific server.

    :param server_name: The name of the server whose rules are requested.
    :return: Rendered HTML template of the server rules page.
    """
    with open(f'data/servers/{server_name}_rules.json', 'r', encoding='utf-8') as f:
        document = json.load(f)
        title = list(document.keys())[0]

    return render_template('server_rules.html', title=title, document=document)


@app.route('/static/<path:path>')
def send_static(path: str) -> Response:
    """
    Serves static files located in the 'static' directory.

    :param path: The path of the static file requested.
    :return: Static file response.
    """
    return app.send_static_file(path)


@app.route('/favicon.ico')
def send_favicon() -> Response:
    """
    Serves the favicon for the website.

    :return: The favicon file response.
    """
    return app.send_static_file('favicon.ico')


if __name__ == '__main__':
    app.run(host='192.168.0.102', port=8000, debug=True)
