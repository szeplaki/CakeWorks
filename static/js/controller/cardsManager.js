import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {statusManager} from "./statusManager.js";


const item = {
            dragged: null,
            };


export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card, boardId);
            domManager.addChild(`.board-content[data-board-id="${boardId}"] > 
            .status[data-status-id="${card.status_id}"] > .status-body`, content);
            domManager.addEventListener(
                 `.card-remove[data-card-id="${card.id}"]`,
                 "click",
                 deleteCardButton
            );
            domManager.addEventListener(
                 `.card-edit-icon[data-card-id="${card.id}"]`,
                 "click",
                 renameCardButtonHandler
            );
            domManager.addEventListener(
                `.new-card-name[data-card-id="${card.id}"]`,
                'keyup',
                renameWithEnter
            );
        }
        const cardsToRemove = document.querySelectorAll(`.card[data-board-id="${boardId}"]`)
        for (let cardToMove of cardsToRemove) {
            cardToMove.setAttribute('draggable', true);
            cardToMove.addEventListener('dragstart', handleDragStart)
            cardToMove.addEventListener('dragend', handleDragEnd)
            }
        const slots = document.querySelectorAll(`.status-body[data-board-id="${boardId}"]`)
        for (let slot of slots) {
            slot.addEventListener('dragover', handleDragover);
            slot.addEventListener('drop', handleDrop);
        }
    },
};


async function deleteCardButton(clickEvent) {
    const id = clickEvent.currentTarget.dataset.cardId;
    const boardId = clickEvent.currentTarget.dataset.boardId;
    await dataHandler.deleteCard(id)
    let statusBody = document.querySelectorAll(`.status-body`)
    for (let body of statusBody) {
        body.innerHTML = ""
    }
    await cardsManager.loadCards(boardId)
}


function renameCardButtonHandler(clickEvent) {
    const cardId = clickEvent.target.parentElement.dataset.cardId;
    const boardId = clickEvent.target.parentElement.dataset.boardId;
    const statusId = clickEvent.target.parentElement.dataset.statusId;
    let firstButton = document.querySelector(`.card-edit-icon[data-board-id="${boardId}"][data-status-id="${statusId}"][data-card-id="${cardId}"]`);
    firstButton.classList.add('hidden')
    let boardName = document.querySelector(`.new-card-name[data-board-id="${boardId}"][data-status-id="${statusId}"][data-card-id="${cardId}"]`);
    boardName.classList.remove('hidden')
}


function handleDragover(event) {
    event.preventDefault()
}


async function handleDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    const boardId = item.dragged.dataset.boardId;
    const cardId = item.dragged.dataset.cardId;
    dropzone.appendChild(item.dragged);
    const newStatusId = dropzone.dataset.statusId;
    await dataHandler.changeStatus(cardId, newStatusId);
    let boardBody = document.querySelector(`.board-content[data-board-id="${boardId}"]`)
    boardBody.innerHTML = ""
    await statusManager.loadStatuses(boardId);
    await cardsManager.loadCards(boardId);
}


function handleDragStart(event) {
    if (event.currentTarget.classList.contains('draggable')) {
        item.dragged = event.currentTarget;
    } else {
        item.dragged = event.currentTarget.parentElement
    }
}


function handleDragEnd() {
    item.dragged = null;
}


async function renameWithEnter(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const title = clickEvent.target.value;
    const boardId = clickEvent.target.dataset.boardId;
    const statusId = clickEvent.target.dataset.statusId;
    if (clickEvent.keyCode === 13) {
        clickEvent.preventDefault();
        let firstButton = document.querySelector(`.card-edit-icon[data-board-id="${boardId}"][data-status-id="${statusId}"][data-card-id="${cardId}"]`);
        firstButton.classList.remove('hidden')
        let boardName = document.querySelector(`.new-card-name[data-board-id="${boardId}"][data-status-id="${statusId}"][data-card-id="${cardId}"]`);
        boardName.classList.add('hidden')
        await dataHandler.renameCard(title, cardId);
        let statusBody = document.querySelectorAll(`.status-body`)
        for (let body of statusBody) {
            body.innerHTML = ""
        }
        await cardsManager.loadCards(boardId)
    }
}