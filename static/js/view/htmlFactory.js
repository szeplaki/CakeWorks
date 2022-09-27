export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

function boardBuilder(board) {
    return `<div class="board-container">
                <div class="board" data-board-id=${board.id}>${board.title}</div>
                <button class="add-card-button" data-board-id=${board.id}>Add Card</button>
                <button class="toggle-board-button" data-board-id="${board.id}">Toggle Cards</button>`
}

function cardBuilder(card, board_id) {
    return `<div class="card" data-board-id="${board_id}">
                <div class="card card_item" data-card-id="${card.id}">${card.title}</div>
                <div class="card-remove" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
            </div>`;
}

