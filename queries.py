import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def create_card(card_title_inp, board_id_inp, status_id_inp):
    data_manager.execute_insert(
        """
        INSERT INTO cards (board_id, status_id, title, card_order) 
        VALUES (%(board_id)s, %(status_id)s, %(title)s, 1) 
        ;
        """
        , {"board_id": board_id_inp,
           'status_id': status_id_inp,
           'title': card_title_inp})


def delete_card(card_id):
    data_manager.execute_insert(
        """
        DELETE FROM cards 
        WHERE id=%(id)s
        ;
        """
        , {"id": card_id})


def get_board(board_id):
    board = data_manager.execute_select("""SELECT *
                   FROM boards
                   WHERE boards.id = %(board_id)s
                   ;
                   """, {"board_id": board_id})
    return board


def get_statuses():
    statuses = data_manager.execute_select(
        """
        SELECT *
        FROM statuses
        """)
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
