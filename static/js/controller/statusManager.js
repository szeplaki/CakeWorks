import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let statusManager = {
    loadStatuses: async function (boardId) {
        const statuses = await dataHandler.getStatuses();
        for (let status of statuses) {
            const statusBuilder = htmlFactory(htmlTemplates.status);
            const content = statusBuilder(status);
            domManager.addChild(`.board[data-board-id="${boardId}"]`, content);
        }
    }
};