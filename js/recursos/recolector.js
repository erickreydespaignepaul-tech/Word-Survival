export class Recolector {
  constructor(motor){
    this.motor = motor;
    motor.canvas.addEventListener('click', e => this.click(e));
  }

  click(e){
    const rect = this.motor.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(this.motor.mundo.recogerEn){
      const recurso = this.motor.mundo.recogerEn(x,y,this.motor.jugador.posicion);
      if(recurso){
        this.motor.inventario.agregar(recurso,1);
        if(this.motor.ui.mensaje){
          this.motor.ui.mensaje('+' + recurso);
        }
      }
    }
  }
}
