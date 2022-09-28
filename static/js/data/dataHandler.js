export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards")
    },
    getBoardsIfLoggedIn: async function (userId) {
        return await apiGet(`/api/boards/private/${userId}`)
    },
    getStatuses: async function (boardId) {
        return await apiGet(`/api/statuses/${boardId}`)
    },
    changeStatus: async function (cardId, statusId) {
        let card = {'id': cardId, 'status_id': statusId}
        return await apiPatch('/api/boards/change_status', card)
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards`)
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        let card = {'title': cardTitle, 'board_id': boardId, 'status_id': statusId}
        await apiPost("/api/add_card", card)
    },
    createNewStatus: async function (title, boardId) {
        let status = {'title': title, 'board_id': boardId}
        await apiPost("/api/add_status", status)
        },
    deleteCard: async function (id) {
        await apiDelete(`/api/delete_card/${id}`)
    },
    deleteStatus: async function (id) {
        await apiDelete(`/api/delete_status/${id}`)
    },
    deleteBoard: async function (id) {
        await apiDelete(`/api/delete_board/${id}`)
    },
    createBoard: async function (boardTitle) {
        let board = {'title': boardTitle}
        await apiPost("api/add_board", board)
    },
    renameCard: async function (cardTitle, cardId) {
        let card = {'title': cardTitle, 'card_id': cardId}
        await apiPatch("/api/rename_card", card)
    },
    renameStatus: async function (statusTitle, statusId) {
        let status = {'title': statusTitle, 'status_id': statusId}
        await apiPatch("/api/rename_status", status)
    },
    renameBoard: async function (boardTitle, boardId) {
        let board = {'title': boardTitle, 'board_id': boardId}
        await apiPatch("/api/rename_board", board)
    },
    register: async function (username, password) {
        let newUser = {'username': username, 'password': password}
        await apiPost("/api/register", newUser)
    },
    login: async function (username, password) {
        let user = {'username': username, 'password': password}
        return await apiPost("/api/login", user);
    },
    logout: async function () {
        return await apiGet(`/api/logout`)
    },
    checkIfLoggedIn: async function () {
        return await apiGet(`/api/check`)
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
    let response = await fetch(url, {
       method: 'DELETE',
       headers: {
         'Content-Type': 'application/json'
       },
       body: null
   });
    await response.json()
}


async function apiPut(url, payload) {
    let response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PUT",
    body: JSON.stringify(payload)
    })
    if (response.ok) {
        return await response.json();
    }
}
//apiPut changes(we don't need at the moment)


async function apiPatch(url, payload) {
    let response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PATCH",
    body: JSON.stringify(payload)
    })
    if (response.ok) {
        return await response.json();
    }
}
// apiPatch corrects