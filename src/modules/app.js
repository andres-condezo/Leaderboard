// This Module contains the App class

import User from './user.js';
import { createElement, render } from './render.js';
import { $ } from './utils.js';

const $root = $('.score-container');
const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games';

// ***************
// App Class
// ***************

class App {
  constructor() {
    this.userArr = [];
    this.keyGame = '';
  }

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

  // Get the index of a new user
  getIndex = () => this.userArr.length + 1;

  // Update the index property for every user of the array.
  updateIndex = () => {
    this.userArr.forEach((user, index) => {
      user.index = index + 1;
    });
  }

  renderUser = (user) => {
    const place = createElement('span', { style: 'font-weight:bold' }, [`${user.index}`]);
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
          const index = this.getIndex();
          const newUser = new User(name, score, index);

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
    this.updateIndex();
    this.userArr.forEach((user) => {
      this.renderUser(user);
    });
  }

  refreshScores = async () => {
    this.userArr = [];
    await this.getUserArr();
    this.displayScores();
  }

  submit = (event, form) => {
    event.preventDefault();
    const [name, score] = form.querySelectorAll('input');

    this.postUser(name.value, score.value);
    form.reset();
    name.focus();
  }
}

export default App;
