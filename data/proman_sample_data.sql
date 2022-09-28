--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users CASCADE;

---
--- create tables
---

CREATE TABLE statuses (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id INTEGER                NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    user_id     INTEGER
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    status_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL
);

CREATE TABLE users (
    id          SERIAL PRIMARY KEY  NOT NULL,
    username    VARCHAR (200)       NOT NULL,
    password    VARCHAR (200)       NOT NULL
)

---
--- insert data
---
INSERT INTO users(username, password) VALUES ('eva', '$2b$12$0SwTq9lJO1rZs4loYWpasuzRnRjAn3hfVkwfk7Ufuy6mkb7KD5s0i');

INSERT INTO boards(title) VALUES ('Cakes');
INSERT INTO boards(title) VALUES ('Free From Everything Cakes');
INSERT INTO boards(title) VALUES ('Salt cakes');
INSERT INTO boards(title, user_id) VALUES ('My cakes', 1);
INSERT INTO boards(title, user_id) VALUES ('My cookies', 1);

INSERT INTO statuses(title, board_id) VALUES ('new order',1);
INSERT INTO statuses(title, board_id) VALUES ('under preparation',1);
INSERT INTO statuses(title, board_id) VALUES ('wrapping',1);
INSERT INTO statuses(title, board_id) VALUES ('ready to take away',1);

INSERT INTO statuses(title, board_id) VALUES ('new order',2);
INSERT INTO statuses(title, board_id) VALUES ('under preparation',2);
INSERT INTO statuses(title, board_id) VALUES ('wrapping',2);
INSERT INTO statuses(title, board_id) VALUES ('ready to take away',2);

INSERT INTO statuses(title, board_id) VALUES ('new order',3);
INSERT INTO statuses(title, board_id) VALUES ('under preparation',3);
INSERT INTO statuses(title, board_id) VALUES ('wrapping',3);
INSERT INTO statuses(title, board_id) VALUES ('ready to take away',3);

INSERT INTO statuses(title, board_id) VALUES ('my favourites',4);
INSERT INTO statuses(title, board_id) VALUES ('visit and bring cake',4);
INSERT INTO statuses(title, board_id) VALUES ('quick cakes',4);
INSERT INTO statuses(title, board_id) VALUES ('for family',4);

INSERT INTO statuses(title, board_id) VALUES ('new order',5);
INSERT INTO statuses(title, board_id) VALUES ('under preparation',5);
INSERT INTO statuses(title, board_id) VALUES ('wrapping',5);
INSERT INTO statuses(title, board_id) VALUES ('ready to take away',5);



INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Chocolate cake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'Brownie Cheesecake', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Black Forest Cheesecake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Carrot Cake', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'Lemon Coconut Cake', 3);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'Cinnamon Cake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Pumpkin Latte Cake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'Salted Caramel cake', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Gluten-Free Caramel Apple Cake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 5, 'Gluten-Free Limoncello Cake', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 6, 'Laktose-Free Black and White Mousse Cake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 7, 'Egg-Free Macaron Selection', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'No Sugar Added Coconut Cream Cake', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 8, 'Egg-free Tiramisu Cake', 2);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 9, 'Salty Sweet Pecan Cookies', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 10, 'Peanut Butter Cookies', 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 3, 11, 'Salty Chocolate Chip Cookies', 1);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE ONLY statuses
    ADD CONSTRAINT fk_statuses_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_boards_board_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;