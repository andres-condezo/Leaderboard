// This Module contains the main functions

import './css/style.css';
import App from './modules/app.js';
import { $ } from './modules/utils.js';

// ***************
// Main function
// ***************

const main = () => {
  const $form = $('form');
  const newApp = new App();

  newApp.createGame();
  newApp.refreshScores();
  $form.addEventListener('submit',
    (event) => { newApp.submit(event, $form); });
  $('.refresh-btn').addEventListener('click', newApp.refreshScores);
};

main();
