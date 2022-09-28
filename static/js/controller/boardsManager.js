import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";
import {statusManager} from "./statusManager.js";

const flexBox1 = htmlFactory(htmlTemplates.flexBox1);
domManager.addChild("#navbar", flexBox1);


const flexBox2 = htmlFactory(htmlTemplates.flexBox2);
domManager.addChild("#navbar", flexBox2);


const registerButton = htmlFactory(htmlTemplates.register);
domManager.addChild(".flexBox1", registerButton);
domManager.addEventListener(
    ".register-link",
    "click",
    showRegistrationForm
);


const registerBox = htmlFactory(htmlTemplates.registerBox);
domManager.addChild(".flexBox2", registerBox);
domManager.addEventListener(
    ".send-registration",
    "click",
    sendRegistration
);


const loginButton = htmlFactory(htmlTemplates.login);
domManager.addChild(".flexBox1", loginButton);
domManager.addEventListener(
    ".login-link",
    "click",
    showLoginForm
);


const loginBox = htmlFactory(htmlTemplates.loginBox);
domManager.addChild(".flexBox2", loginBox)
domManager.addEventListener(
    ".send-login",
    "click",
    sendLogin
);


const logoutPart = htmlFactory(htmlTemplates.logout);
domManager.addChild(".flexBox1", logoutPart)
domManager.addEventListener(
    ".logout-link",
    "click",
    logout
);


const showUser = htmlFactory(htmlTemplates.showUser);
domManager.addChild(".flexBox1", showUser);


const messageBox = htmlFactory(htmlTemplates.messageBox);
domManager.addChild("#navbar", messageBox)


const addBoardButton = htmlFactory(htmlTemplates.addBoardButton);
domManager.addChild("#root", addBoardButton);
domManager.addEventListener(
    ".add-new-board",
    "click",
    addBoardButtonHandler
);


domManager.addEventListener(
    ".add-button",
    "click",
    buttonAndInput
);


async function logout() {
    await dataHandler.logout();
    let loginLink = document.querySelector('.login-link');
    loginLink.classList.remove('hidden');
    let registerLink = document.querySelector('.register-link');
    registerLink.classList.remove('hidden');
    let reloaded = document.getElementById('reloaded');
    reloaded.innerHTML = "";
    await boardsManager.loadBoards();
}


function showRegistrationForm() {
    let registerLink = document.querySelector('.register-link');
    registerLink.classList.add('hidden')
    let registerDiv = document.querySelector('.register');
    registerDiv.classList.remove('hidden');
    let loginLink = document.querySelector('.login-link');
    loginLink.classList.add('hidden');
}


async function sendRegistration() {
    let registerLink = document.querySelector('.register-link');
    registerLink.classList.remove('hidden');
    let registerDiv = document.querySelector('.register');
    registerDiv.classList.add('hidden');
    let registerUser = document.querySelector('.register-user');
    let registerPassword = document.querySelector('.register-password');
    let loginLink = document.querySelector('.login-link');
    loginLink.classList.remove('hidden');
    let username = registerUser.value;
    let password = registerPassword.value;
    let register = await dataHandler.register(username, password);
    console.log(register)
}


function showLoginForm() {
    let loginLink = document.querySelector('.login-link');
    loginLink.classList.add('hidden')
    let loginDiv = document.querySelector('.login-div');
    loginDiv.classList.remove('hidden');
    let registerLink = document.querySelector('.register-link');
    registerLink.classList.add('hidden');
}


async function sendLogin() {
    let loginDiv = document.querySelector('.login-div');
    loginDiv.classList.add('hidden');
    let loginUser = document.querySelector('.login-user')
    let loginPassword = document.querySelector('.login-password')
    let username = loginUser.value;
    let password = loginPassword.value;
    let login = await dataHandler.login(username, password);
    let textField = document.getElementById('alert-text');
    if (!login.hasOwnProperty('id')) {
        textField.innerHTML = "Wrong username or password!";
        let registerLink = document.querySelector('.register-link');
        registerLink.classList.remove('hidden');
    } else {
        textField.innerHTML = "";
    }
    let reloaded = document.getElementById('reloaded');
    reloaded.innerHTML = "";
    await boardsManager.loadBoards();
}


function addBoardButtonHandler() {
    let firstButton = document.getElementsByClassName('add-new-board');
    firstButton[0].classList.add('hidden')
    let addButton = document.getElementsByClassName('add-button');
    addButton[0].classList.remove('hidden')
    let boardName = document.getElementsByClassName('board-name');
    boardName[0].classList.remove('hidden')
}


async function buttonAndInput(clickEvent) {
    let firstButton = document.getElementsByClassName('add-new-board');
    firstButton[0].classList.remove('hidden');
    let addButton = document.getElementsByClassName('add-button');
    addButton[0].classList.add('hidden');
    let boardName = document.getElementsByClassName('board-name');
    boardName[0].classList.add('hidden');
    let title = clickEvent.target.nextElementSibling.value;
    await dataHandler.checkIfLoggedIn()
    await dataHandler.createBoard(title)
    let reloaded = document.getElementById('reloaded');
    reloaded.innerHTML = "";
    await boardsManager.loadBoards();
}


export let boardsManager = {
    loadBoards: async function () {
        let checkLoggedIn = await dataHandler.checkIfLoggedIn()
        let showUser = document.querySelector('#block4');
        let divForContent = '<div id="reloaded"></div>'
        domManager.addChild("#root", divForContent);
        if (checkLoggedIn['is_logged_in'] === true) {
            showUser.innerHTML = `Logged in as ${checkLoggedIn['username']}`;
            let blockLogin = document.querySelector('#block2');
            blockLogin.classList.add("hidden")
            let blockLogout = document.querySelector('#block3');
            blockLogout.classList.remove("hidden")
            let boards = await dataHandler.getBoardsIfLoggedIn(checkLoggedIn['user_id'])
            await makeBoards(boards)
        } else {
            let blockLogin = document.querySelector('#block2');
            blockLogin.classList.remove("hidden")
            let loginLink = document.querySelector(`.login-link`);
            loginLink.classList.remove('hidden')
            let blockLogout = document.querySelector('#block3');
            blockLogout.classList.add("hidden")
            showUser.innerHTML = ""
            let boards = await dataHandler.getBoards();
            await makeBoards(boards)
        }
    }
};


async function makeBoards(boards) {
    for (let board of boards) {
        const boardBuilder = htmlFactory(htmlTemplates.board);
        const content = boardBuilder(board);
        domManager.addChild("#reloaded", content)
        domManager.addEventListener(
            `.toggle-board-button[data-board-id="${board.id}"]`,
            "click",
            showHideButtonHandler
        );
        domManager.addEventListener(
            `.add-new-status[data-board-id="${board.id}"]`,
            "click",
            addStatusButtonHandler
        );
        domManager.addEventListener(
            `.add-status-button[data-board-id="${board.id}"]`,
            "click",
            addStatusButton
        );
        domManager.addEventListener(
            `.board-remove[data-board-id="${board.id}"]`,
            "click",
            deleteBoardButton
        );
        domManager.addEventListener(
            `.board-edit-icon[data-board-id="${board.id}"]`,
            "click",
            renameBoardButtonHandler
        );
        domManager.addEventListener(
            `.board-edit-button[data-board-id="${board.id}"]`,
            "click",
            renameBoardButton
        );
        await statusManager.loadStatuses(board.id);
        await cardsManager.loadCards(board.id);
    }
}


function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boardContent = document.querySelector(`.board-content[data-board-id="${boardId}"]`);
    boardContent.classList.toggle('hidden')
}



function addStatusButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let firstButton = document.querySelector(`.add-new-status[data-board-id="${boardId}"]`);
    firstButton.classList.add('hidden')
    let addButton = document.querySelector(`.add-status-button[data-board-id="${boardId}"]`);
    addButton.classList.remove('hidden')
    let boardName = document.querySelector(`.status-name[data-board-id="${boardId}"]`);
    boardName.classList.remove('hidden')
}


async function addStatusButton(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const title = clickEvent.target.nextElementSibling.value;
    let firstButton = document.querySelector(`.add-new-status[data-board-id="${boardId}"]`);
    firstButton.classList.remove('hidden')
    let addButton = document.querySelector(`.add-status-button[data-board-id="${boardId}"]`);
    addButton.classList.add('hidden')
    let boardName = document.querySelector(`.status-name[data-board-id="${boardId}"]`);
    boardName.classList.add('hidden')
    await dataHandler.createNewStatus(title, boardId)
    let boardBody = document.querySelector(`.board-content[data-board-id="${boardId}"]`)
    boardBody.innerHTML = ""
    await statusManager.loadStatuses(boardId);
    await cardsManager.loadCards(boardId);
}


async function deleteBoardButton(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    await dataHandler.checkIfLoggedIn()
    await dataHandler.deleteBoard(boardId)
    let reloaded = document.getElementById('reloaded');
    reloaded.innerHTML = "";
    await boardsManager.loadBoards()
}


function renameBoardButtonHandler(clickEvent) {
    let boardId = clickEvent.target.parentElement.dataset.boardId;
    let firstButton = document.querySelector(`.board-edit-icon[data-board-id="${boardId}"]`);
    firstButton.classList.add('hidden')
    let addButton = document.querySelector(`.board-edit-button[data-board-id="${boardId}"]`);
    addButton.classList.remove('hidden')
    let boardName = document.querySelector(`.new-board-name[data-board-id="${boardId}"]`);
    boardName.classList.remove('hidden')
}


async function renameBoardButton(clickEvent) {
    const title = clickEvent.target.nextElementSibling.value;
    const boardId = clickEvent.target.dataset.boardId;
    let firstButton = document.querySelector(`.board-edit-icon[data-board-id="${boardId}"]`);
    firstButton.classList.remove('hidden')
    let addButton = document.querySelector(`.board-edit-button[data-board-id="${boardId}"]`);
    addButton.classList.add('hidden')
    let boardName = document.querySelector(`.new-board-name[data-board-id="${boardId}"]`);
    boardName.classList.add('hidden')
    await dataHandler.renameBoard(title, boardId);
    let reloaded = document.getElementById('reloaded');
    reloaded.innerHTML = "";
    await boardsManager.loadBoards()
}