from flask import Flask, render_template, url_for, request, session, make_response, jsonify
from dotenv import load_dotenv
from util import json_response, hash_password, verify_password
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = 'thisisarandomsecretkeyforthistaskonly'
load_dotenv()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/check")
@json_response
def check():
    if 'username' in session:
        return {'is_logged_in': True, 'username': session['username'], 'user_id': session['user_id']}
    return {'is_logged_in': False}


@app.route('/api/add_board', methods=['POST'])
@json_response
def add_board():
    new_board = request.json
    board_title = new_board['title']
    if 'username' in session:
        get_board_id = queries.create_private_board(board_title, session['user_id'])
        board_id = get_board_id['id']
    else:
        get_board_id = queries.create_new_board(board_title)
        board_id = get_board_id['id']
    queries.create_status('new', board_id)
    queries.create_status('in progress', board_id)
    queries.create_status('testing', board_id)
    queries.create_status('done', board_id)
    return 'board created'


@app.route('/api/add_status', methods=['POST'])
@json_response
def add_status():
    new_status = request.json
    board_id = new_status['board_id']
    title = new_status['title']
    queries.create_status(title, board_id)
    return 'status created'


@app.route('/api/statuses/<int:board_id>')
@json_response
def get_statuses(board_id: int):
    return queries.get_statuses(board_id)


@app.route('/api/boards/private/<int:user_id>')
@json_response
def get_boards_if_loggen_id(user_id: int):
    return queries.get_boards_if_logged_in(user_id)


@app.route("/api/add_card", methods=['POST'])
@json_response
def add_card():
    new_card = request.json
    card_title = new_card['title']
    board_id = new_card['board_id']
    status_id = new_card['status_id']
    queries.create_card(card_title, board_id, status_id)
    return 'card created'


@app.route("/api/delete_card/<int:card_id>", methods=['DELETE'])
@json_response
def delete_card(card_id):
    queries.delete('cards', card_id)
    return 'card deleted'


@app.route("/api/delete_status/<int:status_id>", methods=['DELETE'])
@json_response
def delete_status(status_id):
    queries.delete('statuses', status_id)
    return 'status deleted'


@app.route("/api/delete_board/<int:board_id>", methods=['DELETE'])
@json_response
def delete_board(board_id):
    if 'username' in session:
        queries.delete_private_board(board_id, session['user_id'])
    else:
        queries.delete('boards', board_id)
    return 'board deleted'


@app.route("/api/rename_card", methods=['PATCH'])
@json_response
def rename_card():
    renamed_card = request.json
    title = renamed_card['title']
    card_id = renamed_card['card_id']
    queries.rename('cards', 'title', title, card_id)
    return 'card renamed'


@app.route("/api/rename_status", methods=['PATCH'])
@json_response
def rename_status():
    renamed_status = request.json
    title = renamed_status['title']
    status_id = renamed_status['status_id']
    queries.rename('statuses', 'title', title, status_id)
    return 'status renamed'


@app.route("/api/rename_board", methods=['PATCH'])
@json_response
def rename_board():
    renamed_board = request.json
    print(renamed_board)
    title = renamed_board['title']
    board_id = renamed_board['board_id']
    queries.rename('boards', 'title', title, board_id)
    return 'board renamed'


@app.route("/api/boards")
@json_response
def get_boards():
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards")
@json_response
def get_cards_for_board(board_id: int):
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/<int:card_id>")
@json_response
def get_card_to_move(board_id: int, card_id: int):
    return queries.get_card_to_move(board_id, card_id)


@app.route("/api/boards/change_status", methods=['PATCH'])
@json_response
def overwrite_status_id():
    card_with_new_status = request.json
    card_id = card_with_new_status['id']
    status_id = card_with_new_status['status_id']
    queries.overwrite_status(card_id, status_id)
    return 'status overwritten'


@app.route("/api/cards/<int:card_id>")
@json_response
def get_card_order_before_dragged(card_id):
    return queries.get_card_order_of_dragged(card_id)


@app.route("/api/register", methods=["POST"])
@json_response
def register_user():
    user = request.json
    username = user['username']
    password = user['password']
    hashed_password = hash_password(password)
    all_usernames = queries.get_all_user_usernames()
    if username in all_usernames:
        return 'Username already exists, please choose another one!'
    else:
        reg = queries.register(username, hashed_password)
        print(reg)
        return reg['id']


@app.route("/api/login", methods=['GET', 'POST'])
@json_response
def login():
    user = request.json
    username = user['username']
    password = user['password']
    if len(username) == 0 or len(password) == 0:
        return "Please, fill in both fields!"
    is_registered = queries.get_user_by_username(username)
    if is_registered:
        hashed_password = queries.check_password(is_registered['username'])
        if verify_password(password, hashed_password['password']):
            session["username"] = username
            session["user_id"] = is_registered["id"]
            return queries.get_user_by_username(username)
        else:
            return "Wrong username or password!"
    return '"Wrong username or password!"'


@app.route("/api/logout")
def logout():
    print("You logged out")
    session.clear()
    print("logout" + str(session))
    response = make_response(jsonify({'message': 'user logged out'}), 200)
    response.headers['Content-Type'] = "application/json"
    return response


def main():
    app.run(debug=True)
    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
