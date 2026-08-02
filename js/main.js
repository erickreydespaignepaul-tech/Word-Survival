import { Motor } from './motor/motor.js';

const motor = new Motor(document.getElementById('mundo'));
document.getElementById('btn-empezar').addEventListener('click', () => {
  document.getElementById('pantalla-inicio').hidden = true;
  document.getElementById('hud').hidden = false;
  motor.iniciar();
});
