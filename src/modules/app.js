// This Module contains the App class

import User from './user.js';
import { createElement, render } from './render.js';
import { $ } from './utils.js';

const $root = $('.score-container');
const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games';

// ***************
// App Class
// ***************

class LeaderBoardApp {
  constructor() {
    this.userArr = [];
    this.keyGame = '';
  }

  // Local Storage

  // Create a new keyGame
  createGame = async () => {
    const localStorageIsNotEmpty = localStorage.getItem('keyGame');

    if (localStorageIsNotEmpty) {
      const localStorageKeyGame = JSON.parse(localStorage.getItem('keyGame'));
      this.keyGame = localStorageKeyGame;
    } else {
      let key = await fetch(`${url}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'myGame',
          }),
        });
      key = await key.json();
      key = await key.result.slice(14, 34);
      this.keyGame = key;
      const localStorageKeyGame = JSON.stringify(this.keyGame);
      localStorage.setItem('keyGame', localStorageKeyGame);
    }
  }

  addUser = (newUser) => {
    this.userArr.push(newUser);
  };

  renderUser = (user, index) => {
    const place = createElement('span', { style: 'font-weight:bold' }, [String(index + 1)]);
    const name = createElement('span', { style: 'font-weight:bold' }, [`${user.name}`]);
    const score = createElement('span', { style: 'font-weight:bold' }, [`${String(user.score)}`]);
    const children = [place, name, score];
    const li = createElement('li', { class: 'article' }, children);
    render(li, $root);
  }

  sortUserArr = () => {
    this.userArr = this.userArr.sort((a, b) => (b.score) - (a.score));
  }

  getUserArr = async () => {
    await fetch(`${url}/${this.keyGame}/scores`)
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

  postUser = async (name, score) => {
    await fetch(`${url}/${this.keyGame}/scores`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: `${name}`,
          score: `${score}`,
        }),
      });
  }

  displayScores = () => {
    $root.innerHTML = '';
    this.sortUserArr();
    this.userArr.forEach((user, index) => {
      this.renderUser(user, index);
    });
  }

  refreshScores = async () => {
    this.userArr = [];
    await this.getUserArr();
    this.displayScores();
    this.displayMessage('* Score refreshed successfully.', false);
  }

  displayMessage = (msg, error) => {
    const $msgContainer = $('.msg-container');

    if (error) $msgContainer.classList.add('error-color');
    else $msgContainer.classList.remove('error-color');
    $msgContainer.innerHTML = msg;
    setTimeout(() => { $msgContainer.innerHTML = ''; }, 3000);
  }

  isNotValid = (name) => {
    const bool = name.value.trim() === '';
    return bool;
  }

  submit = (event, form) => {
    event.preventDefault();
    const [name, score] = form.querySelectorAll('input');
    const successMsg = '* Score added successfully, please click the refresh button.';
    const errorMsg = '* Please enter a valid input.';

    if (this.isNotValid(name)) {
      this.displayMessage(errorMsg, true);
    } else {
      this.postUser(name.value, score.value);
      this.displayMessage(successMsg, false);
      form.reset();
      name.focus();
    }
  }
}

export default LeaderBoardApp;
