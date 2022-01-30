// This Module contains the App class

// ****************************
// Imports and global variables
// ****************************

import User from './user.js';
import { createElement, render } from './render.js';
import { $ } from './utils.js';

const $root = $('.score-container');
const urlApi = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games';

// ***************
// App Class
// ***************

class LeaderBoardApp {
  constructor() {
    this.userArr = [];
    this.keyGame = '';
  }

  // Local Storage

  localStorageIsNotEmpty = () => localStorage.getItem('keyGame');

  saveLocalStorage = () => {
    const localStorageKeyGame = JSON.stringify(this.keyGame);
    localStorage.setItem('keyGame', localStorageKeyGame);
  }

  getLocalStorage = () => {
    const localStorageKeyGame = JSON.parse(localStorage.getItem('keyGame'));
    if (this.localStorageIsNotEmpty()) this.keyGame = localStorageKeyGame;
  }

  // Request a new key game
  requestKeyGame = async () => {
    let key = await fetch(`${urlApi}/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'myGame' }),
      });
    key = await key.json();
    this.keyGame = await key.result.slice(14, 34);
  }

  // Create a new keyGame
  createGame = async () => {
    if (this.localStorageIsNotEmpty()) {
      this.getLocalStorage(); return;
    }
    await this.requestKeyGame();
    this.saveLocalStorage();
  }

  // Push a new user to the user array.
  addUser = (newUser) => {
    this.userArr.push(newUser);
  };

  // Append a new user to the score container.
  renderUser = (user, index) => {
    const place = createElement('span', { style: 'font-weight:bold' }, [String(index + 1)]);
    const name = createElement('span', { style: 'font-weight:bold' }, [`${user.name}`]);
    const score = createElement('span', { style: 'font-weight:bold' }, [`${String(user.score)}`]);
    const children = [place, name, score];
    const li = createElement('li', { class: 'article' }, children);
    render(li, $root);
  }

  // Send a GET request to the API server to get all users score.
  getUserArr = async () => {
    await fetch(`${urlApi}/${this.keyGame}/scores`)
      .then((res) => res.json())
      .then((res) => res.result)
      .then((data) => {
        data.forEach((user) => {
          const name = user.user;
          const score = Number(user.score);
          const newUser = new User(name, score);

          this.addUser(newUser);
        });
      });
  }

  // Send a POST request to the API server to save the new user score.
  postUser = async (name, score) => {
    await fetch(`${urlApi}/${this.keyGame}/scores`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: `${name.value}`, score: `${score.value}` }),
      });
  }

  // Sort the user array by score.
  sortUserArr = () => {
    this.userArr = this.userArr.sort((a, b) => (b.score) - (a.score));
  }

  // Display the sorted scores in the score container.
  displayScores = () => {
    $root.innerHTML = '';
    this.sortUserArr();
    this.userArr.forEach((user, index) => {
      this.renderUser(user, index);
    });
  }

  // Handle the refresh button click event and update the scores table.
  refreshScores = async () => {
    const successMsg = '* The leader board has been successfully updated..';

    this.userArr = [];
    await this.getUserArr();
    this.displayScores();
    this.displayMessage(successMsg, false);
  }

  // Display a message to the user
  displayMessage = (msg, isMsgError) => {
    const $msgContainer = $('.msg-container');

    if (isMsgError) $msgContainer.classList.add('error-color');
    else $msgContainer.classList.remove('error-color');
    $msgContainer.innerHTML = msg;
    setTimeout(() => { $msgContainer.innerHTML = ''; }, 3000);
  }

  // Validation for the name input field.
  isNotValid = (name) => {
    const bool = name.value.trim() === '';
    return bool;
  }

  // Handle the submit button click event and post the new user to the API server.
  submit = (event, form) => {
    event.preventDefault();
    const [name, score] = form.querySelectorAll('input');
    const successMsg = '* Score added successfully, please click the refresh button.';
    const errorMsg = '* Please enter a valid input.';

    if (this.isNotValid(name)) {
      this.displayMessage(errorMsg, true); return;
    }

    this.postUser(name, score);
    this.displayMessage(successMsg, false);
    form.reset();
    name.focus();
  }
}

export default LeaderBoardApp;
