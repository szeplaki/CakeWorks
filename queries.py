import psycopg2

import data_manager
from psycopg2 import sql


def get_boards():
    return data_manager.execute_select(
        "SELECT * FROM boards WHERE user_id IS NULL;"
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY status_id, card_order
        ;
        """
        , {"board_id": board_id})
    return matching_cards


def get_card_to_move(board_id, card_id):
    card = data_manager.execute_select("SELECT * FROM cards WHERE id = %(card_id)s AND board_id = %(board_id)s;",
                                       {'board_id': board_id, 'card_id': card_id}, False)
    return card


def get_boards_if_logged_in(user_id):
    boards = data_manager.execute_select(
        "SELECT * FROM boards WHERE user_id = %(user_id)s OR user_id IS NULL;",
        {"user_id": user_id})
    return boards


def get_statuses(board_id):
    statuses = data_manager.execute_select(
        """
        SELECT *
        FROM statuses
        WHERE statuses.board_id = %(board_id)s
        ;
        """, {"board_id": board_id})
    return statuses


def get_status(status_id):
    status = data_manager.execute_select(
        """
        SELECT title
        FROM statuses
        WHERE statuses.id = %(status_id)s
        ;
        """, {"status_id": status_id}
    )
    return status


def create_card(card_title, board_id, status_id):
    data_manager.execute_insert(
        """
        INSERT INTO cards (board_id, status_id, title, card_order) 
        VALUES (%(board_id)s, %(status_id)s, %(title)s, COALESCE((SELECT MAX(card_order) + 1 
        FROM cards WHERE status_id = %(status_id)s),1))
        ;
        """
        , {"board_id": board_id,
           'status_id': status_id,
           'title': card_title})


def overwrite_status(card_id, status_id):
    data_manager.execute_insert(
        """
        BEGIN;
        UPDATE cards SET card_order = card_order - 1 WHERE status_id = 
        (SELECT status_id FROM cards WHERE id = %(card_id)s)
        AND card_order > (SELECT card_order FROM cards WHERE id = %(card_id)s);
        UPDATE cards SET status_id = %(status_id)s, card_order = COALESCE((SELECT MAX(card_order) + 1
                FROM cards WHERE status_id = %(status_id)s),1) WHERE id = %(card_id)s;
        COMMIT;
        """, {'card_id': card_id, 'status_id': status_id}
    )


def create_new_board(title):
    return data_manager.execute_select(
        "INSERT INTO boards (title) VALUES (%(title)s) RETURNING id",
        {'title': title}, False
    )


def create_private_board(title, user_id):
    return data_manager.execute_select(
        """
        INSERT INTO boards (title, user_id) VALUES (%(title)s, %(user_id)s) RETURNING id
        """, {'title': title, "user_id": user_id}, False
    )


def delete_private_board(board_id, user_id):
    data_manager.execute_insert(
        "DELETE FROM boards WHERE id = %(board_id)s AND user_id = %(user_id)s",
        {'board_id': board_id, 'user_id': user_id}
    )


def get_card_order_of_dragged(card_id):
    return data_manager.execute_select(
        """
        SELECT card_order
        FROM cards
        WHERE id = %(card_id)s
        """, {'card_id': card_id}
    )


def set_card_order_after_leave(status_id, ex_card_order):
    return data_manager.execute_insert(
        """
        UPDATE cards
        SET card_order = card_order - 1
        WHERE status_id = %(status_id)s AND cards.card_order > %(ex_card_order)s;
        """, {'status_id': status_id, 'ex_card_order': ex_card_order}
    )


def create_status(title, board_id):
    data_manager.execute_insert(
        """
        INSERT INTO statuses (title, board_id) VALUES (%(title)s, %(board_id)s)
        """, {'title': title, 'board_id': board_id}
    )


def delete(board, board_id):
    data_manager.execute_insert(psycopg2.sql.SQL(
        "DELETE FROM {board} WHERE id = {board_id}"
    ).format(
        board=psycopg2.sql.Identifier(board),
        board_id=psycopg2.sql.Literal(board_id)
    ))


def rename(board, column, title, bsc_id):
    data_manager.execute_insert(psycopg2.sql.SQL(
        "UPDATE {board} SET {column}={title} WHERE id={bsc_id}"
    ).format(
        board=psycopg2.sql.Identifier(board),
        column=psycopg2.sql.Identifier(column),
        title=psycopg2.sql.Literal(title),
        bsc_id=psycopg2.sql.Literal(bsc_id)
    ))


def register(username, password):
    return data_manager.execute_select("""
    INSERT INTO users (username, password) VALUES (%(username)s, %(password)s) RETURNING id
    """, {'username': username, 'password': password}, False)


def get_all_user_usernames():
    datas = data_manager.execute_select("SELECT username FROM users ORDER BY username")
    usernames = []
    for elem in datas:
        for value in elem.values():
            usernames.append(value)
    return usernames


def get_user_by_username(username):
    return data_manager.execute_select("""
    SELECT username, id
    FROM users
    WHERE username = %(username)s
    """, {"username": username}, False)


def check_password(username):
    return data_manager.execute_select("""
    SELECT password
    FROM users
    WHERE username = %(username)s
    """, {"username": username}, False)
