import { Jugador } from '../jugador/jugador.js';
import { Mundo } from '../mundo/mundo.js';
import { Inventario } from '../inventario/inventario.js';
import { MotorSemantico } from '../lenguaje/motorSemantico.js';
import { Crafteo } from '../crafteo/crafteo.js';
import { Interfaz } from '../interfaz/menu.js';
import { Controles } from '../jugador/controles.js';
import { Recolector } from '../recursos/recolector.js';
import { Combate } from '../combate/combate.js';
import { Criaturas } from '../criaturas/criaturas.js';

export class Motor {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.mundo = new Mundo(); this.jugador = new Jugador(); this.inventario = new Inventario();
    this.lenguaje = new MotorSemantico(); this.crafteo = new Crafteo(this.inventario);
    this.ui = new Interfaz(this); this.controles = new Controles(); this.recolector = new Recolector(this); this.activo = false; this.ultimo = 0;
    this.combate = new Combate();
    this.criaturas = new Criaturas(this.mundo, this.inventario);
    this.redimensionar(); addEventListener('resize', () => this.redimensionar());

    // tecla Espacio para atacar
    addEventListener('keydown', e => {
      if (e.code === 'Space' || e.key === ' ') {
        try { this.combate.atacar(this.jugador, this.mundo); }
        catch(err){ console.error('Error al atacar:', err); }
      }
    });
  }
  redimensionar() { this.canvas.width = innerWidth * devicePixelRatio; this.canvas.height = innerHeight * devicePixelRatio; this.ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
  iniciar() { if (this.activo) return; this.activo = true; this.ui.activar(); requestAnimationFrame(t => this.bucle(t)); }
  bucle(t) { if (!this.activo) return; const dt = Math.min((t - this.ultimo) / 1000 || 0, .05); this.ultimo = t; this.actualizar(dt); this.dibujar(); requestAnimationFrame(n => this.bucle(n)); }
  actualizar(dt) { 
    this.jugador.actualizar(this.controles.direccion(), dt); 
    this.mundo.cargarCerca(this.jugador.posicion); 
    this.ui.actualizarHud(); 
    try { this.criaturas.actualizar(dt, this.jugador); } catch(e) {}
    try { this.mundo.recogerDrops(this.jugador.posicion, this.inventario); } catch(e) {}
  }
  dibujar() { const w = innerWidth, h = innerHeight; this.ctx.clearRect(0,0,w,h); this.mundo.dibujar(this.ctx, this.jugador.posicion, w, h); try { this.criaturas.dibujar(this.ctx, this.jugador.posicion, w, h); } catch(e) {} this.jugador.dibujar(this.ctx, w/2, h/2); }
}
