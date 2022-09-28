export const htmlTemplates = {
    board: 1,
    status: 2,
    card: 3,
    addBoardButton: 4,
    login: 5,
    loginBox: 6,
    register: 7,
    registerBox: 8,
    showUser: 9,
    logout: 10,
    flexBox1: 11,
    flexBox2: 12,
    messageBox: 13
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.status]: statusBuilder,
    [htmlTemplates.card]: cardBuilder,
    [htmlTemplates.addBoardButton]: addBoardToRoot(),
    [htmlTemplates.login]: login(),
    [htmlTemplates.loginBox]: loginBox(),
    [htmlTemplates.register]: register(),
    [htmlTemplates.registerBox]: registerBox(),
    [htmlTemplates.showUser]: showUser(),
    [htmlTemplates.logout]: logout(),
    [htmlTemplates.flexBox1]: flexBox1(),
    [htmlTemplates.flexBox2]: flexBox2(),
    [htmlTemplates.messageBox]: messageBox()
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

function messageBox() {
    return `<div id="alert-text"></div>`
}

function flexBox1() {
    return `<div class="flexBox1"></div>`
}


function flexBox2() {
    return `<div class="flexBox2"></div>`
}

function showUser() {
    return `<div id="block4"></div>`
}

function login() {
    return `<div id="block2">
            <div class="login-link">Login</div>
            </div>`
}

function loginBox() {
    return `
    <div class="login-div hidden">
            <br>
            <label for="user">Username</label>
            <input id="user" class="login-user" type="text">
            <br><br>
            <label for="pw">Password</label>
            <input id="pw" class="login-password" type="text">
            <br><br>
            <button class="send-login">Login</button>
            </div>
    `
}


function register() {
    return `<div id="block1">
            <div class="register-link">Register</div>
            </div>`
}

function registerBox() {
    return `
    <div class="register hidden">
            <br>
            <label for="user">Username</label>
            <input id="user" class="register-user" type="text">
            <br><br>
            <label for="pw">Password</label>
            <input id="pw" class="register-password" type="text">
            <br><br>
            <button class="send-registration">Register</button>
            </div>
    `
}

function logout() {
    return `<div id="block3" class="logout-link hidden">Logout</div>`
}

function addBoardToRoot() {
    return `<div class="make-board">
            <button class="add-new-board">Add new board</button>
            <button class='add-button hidden'>Save</button>
            <input class="board-name hidden" type="text">
            </div>`
}

function boardBuilder(board) {
    return `<div class="board-container">
                    <div class="board-header">
                        <div class="board-title" data-board-id=${board.id}>${board.title}</div>
                        <button class="toggle-board-button" data-board-id="${board.id}">Toggle Cards</button>
                        <button class="add-new-status" data-board-id="${board.id}">Add status</button>                      
                        <button class="add-status-button hidden" data-board-id="${board.id}">Save</button>
                        <input class="status-name hidden" data-board-id="${board.id}" type="text">
                        <div class="board-remove" data-board-id="${board.id}"><i class="fas fa-trash-alt"></i></div>
                        
                        <div class="board-edit-icon" data-board-id="${board.id}"><i class="fas fa-edit"></i></div>
                        <button class="board-edit-button hidden" data-board-id="${board.id}">Rename</button>
                        <input class="new-board-name hidden" data-board-id="${board.id}" type="text">
                    </div>
                    <div class="board-content hidden" data-board-id="${board.id}" id="content-${board.id}"></div>
                </div>`;
}

function cardBuilder(card, boardId) {
    return `<div class="card draggable" data-board-id="${boardId}" data-status-id="${card.status_id}" data-card-id="${card.id}">
                <div class="card" data-card-id="${card.id}">${card.title}</div>
                <div class="card-edit-icon" data-board-id="${boardId}" data-status-id="${card.status_id}" data-card-id="${card.id}"><i class="fas fa-edit"></i></div>
                
                <button class="card-edit-button hidden" data-board-id="${boardId}" data-status-id="${card.status_id}" data-card-id="${card.id}">Rename</button> 
                <input class="new-card-name hidden" data-board-id="${boardId}" data-status-id="${card.status_id}" data-card-id="${card.id}" type="text">
                <div class="card-remove" data-board-id="${boardId}" data-card-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
            </div>`;
}

function statusBuilder(status, boardId) {
    return `
        <div class="status" data-board-id="${boardId}" data-status-id="${status.id}">
        <div class="status-header">${status.title}
        <button class="add-new-card" data-board-id="${boardId}" data-status-id="${status.id}">Add card</button>
        <button class="add-card-button hidden" data-board-id="${boardId}" data-status-id="${status.id}">Save</button>
        <input class="card-name hidden" data-board-id="${boardId}" data-status-id="${status.id}" type="text">
        <div class="status-remove" data-board-id="${boardId}" data-status-id="${status.id}"><i class="fas fa-trash-alt"></i></div>
        <div class="status-edit-icon" data-board-id="${boardId}" data-status-id="${status.id}"><i class="fas fa-edit"></i></div>
        <button class="status-edit-button hidden" data-board-id="${boardId}" data-status-id="${status.id}">Rename</button>
        <input class="new-status-name hidden" data-board-id="${boardId}" data-status-id="${status.id}" type="text">
        </div>
        <div class="status-body" data-board-id="${boardId}" data-status-id="${status.id}"></div>
        </div>`;
}