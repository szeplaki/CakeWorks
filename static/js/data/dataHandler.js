export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
        let card = {'title': cardTitle, 'board_id': boardId, 'status_id': statusId}
        await apiPost("/api/add_card", card)
    },
    deleteCard: async function (id) {
        await apiGet(`/api/delete_card/${id}`)
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        return await response.json();
    }
}

async function apiDelete(url) {
}

async function apiPut(url) {
}

async function apiPatch(url) {
}
