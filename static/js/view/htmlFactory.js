export const htmlTemplates = {
    board: 1,
    status: 2,
    card: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.status]: statusBuilder,
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

function cardBuilder(card, status_id) {
    return `<div class="card" data-status-id="${status_id}">
                <div class="card card_item" data-card-id="${card.id}">${card.title}</div>
                <div class="card-remove" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
            </div>`;
}

function statusBuilder(status) {
    return `<div class="status" data-status-id="${status.id}">
                ${status.title}
            </div>`;
}

