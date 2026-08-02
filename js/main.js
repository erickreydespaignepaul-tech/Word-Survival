import { Motor } from './motor/motor.js';

const boton = document.getElementById('btn-empezar');
const pantalla = document.getElementById('pantalla-inicio');
const hud = document.getElementById('hud');

let motor;
try {
  motor = new Motor(document.getElementById('mundo'));
} catch (err) {
  console.error('Error al crear Motor:', err);
}

boton.addEventListener('click', () => {
  pantalla.hidden = true;
  hud.hidden = false;
  if (motor && typeof motor.iniciar === 'function') {
    try {
      motor.iniciar();
    } catch (err) {
      console.error('Error al iniciar motor:', err);
    }
  }
});
