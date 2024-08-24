import json

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    welcome_servers = {'title': 'Встречайте - сервера!',
                       'button': {'title': 'Начать играть', 'url': '/servers'},
                       'content': [
                           {'title': 'Присоеденяйся к игрокам на сервер',
                            'text': '''Играть с друзьями намного интереснее, особенно когда их так много! Заходите на сервера и развивайтесь вместе со всеми игроками. Придумай то, кем ты будешь и войди в свою роль.
                            Потрясающая атмосфера, отсутствие привата, войс чат и ничего лишнего''',
                            'image': '/static/images/bg/image_22.jpg'},
                           {'title': 'Мы за адекватное комьюнити',
                            'text': '''Столбы, засорение ландшафта, однообразные и страшные авто-фермы не приветствуются!
                            Внимательная и строгая администрация не допустит нарушения правил, испорченной атмосферы и общего впечатления от игры на сервере, играйте спокойно и с удовольствием!''',
                            'image': '/static/images/bg/image_9.jpg'},
                           {'title': 'Интересное сочетание упрощённого RP и анархии',
                            'text': '''Вы можете объединиться с другими игроками, создавать свои условные племена, или кланы, обмениваться ресурсами и даже например объявлять войны другим кланам. Но имейте в виду, что на каждого преступника найдётся свой суд!
                                    Дайте волю фантазии, всё в ваших руках!''',
                            'image': '/static/images/bg/image_14.jpg'}
                       ]
                       }

    news = [welcome_servers]

    return render_template('index.html', news=news)


@app.route('/servers')
def servers():
    return render_template('servers.html')


@app.route('/servers/<server>')
def server(server):
    with open(f'data/servers/{server}.json', 'r', encoding='utf-8') as f:
        content = json.load(f)

    return render_template('server.html', content=content)


@app.route('/servers/<server>/rules')
def server_rules(server):
    with open(f'data/servers/{server}_rules.json', 'r', encoding='utf-8') as f:
        document = json.load(f)
        title = list(document.keys())[0]
        # document = document[title]

    # print(document)
    return render_template('server_rules.html', title=title, document=document)



@app.route('/static/<path:path>')
def send_static(path):
    return app.send_static_file(path)


@app.route('/favicon.ico')
def send_favicon():
    return app.send_static_file('favicon.ico')


if __name__ == '__main__':
    app.run(host='192.168.0.102', port=8000, debug=True)
