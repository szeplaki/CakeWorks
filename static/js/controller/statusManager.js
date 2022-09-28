import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";


export let statusManager = {
    loadStatuses: async function (boardId) {
        const statuses = await dataHandler.getStatuses(boardId);
        for (let status of statuses) {
            const statusBuilder = htmlFactory(htmlTemplates.status);
            const content = statusBuilder(status, boardId);
            domManager.addChild(`.board-content[data-board-id="${boardId}"]`, content);
            domManager.addEventListener(
                 `.add-new-card[data-board-id="${boardId}"][data-status-id="${status.id}"]`,
                 "click",
                 addCardButtonHandler
            );
            domManager.addEventListener(
                `.add-card-button[data-board-id="${boardId}"][data-status-id="${status.id}"]`,
                "click",
                addCardButton
            );
            domManager.addEventListener(
                `.status-remove[data-board-id="${boardId}"][data-status-id="${status.id}"]`,
                "click",
                deleteStatusButton
            );
            domManager.addEventListener(
                 `.status-edit-icon[data-board-id="${boardId}"][data-status-id="${status.id}"]`,
                 "click",
                 renameStatusButtonHandler
            );
            domManager.addEventListener(
                `.status-edit-button[data-board-id="${boardId}"][data-status-id="${status.id}"]`,
                "click",
                renameStatusButton
            );
        }
    },
};


function addCardButtonHandler(clickEvent) {
    let boardId = clickEvent.currentTarget.dataset.boardId;
    let statusId = clickEvent.currentTarget.dataset.statusId;
    let firstButton = document.querySelector(`.add-new-card[data-board-id="${boardId}"][data-status-id="${statusId}"]`)
    firstButton.classList.add('hidden')
    let addButton = document.querySelector(`.add-card-button[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    addButton.classList.remove('hidden')
    let boardName = document.querySelector(`.card-name[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    boardName.classList.remove('hidden')
}


async function addCardButton(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const statusId = clickEvent.target.dataset.statusId;
    const title = clickEvent.target.nextElementSibling.value;
    let firstButton = document.querySelector(`.add-new-card[data-board-id="${boardId}"][data-status-id="${statusId}"]`)
    firstButton.classList.remove('hidden')
    let addButton = document.querySelector(`.add-card-button[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    addButton.classList.add('hidden')
    let boardName = document.querySelector(`.card-name[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    boardName.classList.add('hidden')

    await dataHandler.createNewCard(title,boardId,statusId);
    let statusBody = document.querySelectorAll(`.status-body`)
    for (let body of statusBody) {
        body.innerHTML = ""
    }
    await cardsManager.loadCards(boardId)
}


async function deleteStatusButton(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    const statusId = clickEvent.currentTarget.dataset.statusId;
    await dataHandler.deleteStatus(statusId)
    let boardBody = document.querySelector(`.board-content[data-board-id="${boardId}"]`)
    boardBody.innerHTML = ""
    await statusManager.loadStatuses(boardId);
    await cardsManager.loadCards(boardId);
}


function renameStatusButtonHandler(clickEvent) {
    let boardId = clickEvent.target.parentElement.dataset.boardId;
    let statusId = clickEvent.target.parentElement.dataset.statusId;
    let firstButton = document.querySelector(`.status-edit-icon[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    firstButton.classList.add('hidden')
    let addButton = document.querySelector(`.status-edit-button[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    addButton.classList.remove('hidden')
    let boardName = document.querySelector(`.new-status-name[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    boardName.classList.remove('hidden')
}


async function renameStatusButton(clickEvent) {
    const statusId = clickEvent.target.dataset.statusId;
    const title = clickEvent.target.nextElementSibling.value;
    const boardId = clickEvent.target.dataset.boardId;
    let firstButton = document.querySelector(`.status-edit-icon[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    firstButton.classList.remove('hidden')
    let addButton = document.querySelector(`.status-edit-button[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    addButton.classList.add('hidden')
    let boardName = document.querySelector(`.new-status-name[data-board-id="${boardId}"][data-status-id="${statusId}"]`);
    boardName.classList.add('hidden')
    await dataHandler.renameStatus(title, statusId);
    let boardBody = document.querySelector(`.board-content[data-board-id="${boardId}"]`)
    boardBody.innerHTML = ""
    await statusManager.loadStatuses(boardId);
    await cardsManager.loadCards(boardId);
}