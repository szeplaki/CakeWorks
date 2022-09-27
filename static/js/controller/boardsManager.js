import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {statusManager} from "./statusManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.toggle-board-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `.add-card-button[data-board-id="${board.id}"]`,
                "click",
                createCard
            );
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let boards = document.querySelectorAll(`.status`)
    if (boards.length !== 0) {
        for (let board of boards) {
            board.remove();
        }
    } else {
        statusManager.loadStatuses(boardId);
        cardsManager.loadCards(boardId);
    }
}

function createCard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    dataHandler.createNewCard('one more card', boardId, 1)
}
