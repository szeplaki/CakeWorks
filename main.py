from flask import Flask, render_template, url_for, request
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/add_card", methods=['POST'])
@json_response
def add_card():
    new_card = request.json
    card_title = new_card['title']
    board_id = new_card['board_id']
    status_id = new_card['status_id']
    queries.create_card(card_title, board_id, status_id)
    return 'card created'


@app.route("/api/delete_card/<id>")
@json_response
def delete_card(id):
    queries.delete_card(id)
    return 'card deleted'


@app.route('/api/<int:status_id>')
@json_response
def get_status_by_id(status_id: int):
    return queries.get_status(status_id)


@app.route('/api/statuses')
@json_response
def get_statuses():
    return queries.get_statuses()


@app.route('/api/<int:board_id>')
@json_response
def get_board(board_id: int):
    return queries.get_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
