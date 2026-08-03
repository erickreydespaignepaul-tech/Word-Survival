import { RECETAS } from './recetas.js';
import * as mecanica from './mecanica.js';

export class Crafteo {
  constructor(inventario) { this.inventario = inventario; this.recetas = RECETAS; }

  listarDisponibles() { return this.recetas.filter(r => mecanica.puedeCraftear(this.inventario, r)); }

  craftear(id) {
    const r = this.recetas.find(x => x.id === id); if (!r) return false;
    return mecanica.craftear(this.inventario, r);
  }
}
