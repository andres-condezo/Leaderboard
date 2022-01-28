// This Module contains the main functions

import './css/style.css';
import LeaderBoardApp from './modules/app.js';
import { $ } from './modules/utils.js';

// ***************
// Main function
// ***************

const main = async () => {
  const $form = $('form');
  const app = new LeaderBoardApp();

  await app.createGame();
  await app.refreshScores();
  await $form.addEventListener('submit',
    (event) => { app.submit(event, $form); });
  $('.refresh-btn').addEventListener('click', app.refreshScores);
};

main();
