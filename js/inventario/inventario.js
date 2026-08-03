export class Inventario {
  constructor(capacidad = 100) {
    this.capacidad = capacidad;
    this.items = {}; // item -> cantidad
    this.maxStack = 999;
  }

  cantidad(nombre) { return this.items[nombre] || 0; }

  agregar(item, cantidad = 1) {
    if (!item) return false;
    this.items[item] = (this.items[item] || 0) + cantidad;
    const total = Object.values(this.items).reduce((a, b) => a + b, 0);
    if (total > this.capacidad) {
      // revertir
      this.items[item] -= cantidad;
      if (this.items[item] <= 0) delete this.items[item];
      return false;
    }
    return true;
  }

  añadir(item, cantidad = 1) { return this.agregar(item, cantidad); }
  add(item, cantidad = 1) { return this.agregar(item, cantidad); }

  tiene(item, cantidad = 1) { return (this.items[item] || 0) >= cantidad; }

  quitar(item, cantidad = 1) {
    if (!this.tiene(item, cantidad)) return false;
    this.items[item] -= cantidad;
    if (this.items[item] <= 0) delete this.items[item];
    return true;
  }

  remove(item, cantidad = 1) { return this.quitar(item, cantidad); }

  // persistencia simple
  guardar(key = 'ws_inventario') {
    try { localStorage.setItem(key, JSON.stringify({ cap: this.capacidad, items: this.items })); } catch (e) { }
  }
  cargar(key = 'ws_inventario') {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.capacidad = data.cap || this.capacidad;
      this.items = data.items || {};
      return true;
    } catch (e) { return false; }
  }
}
