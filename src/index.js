import './css/style.css';
import { createElement, render } from './modules/create-element.js';
import scoreArr from './modules/score-arr.js';
import { $ } from './modules/utils.js';

const form = $('form');
const root = $('.score-container');

const displayScores = (scoreArr) => {
  scoreArr.forEach((score) => {
    const text = [`${score.name}: ${String(score.score)}`];
    const article = createElement('article', { class: 'article' }, text);
    render(article, root);
  });
};

displayScores(scoreArr);
form.addEventListener('submit', (event) => {
  event.preventDefault();
});
