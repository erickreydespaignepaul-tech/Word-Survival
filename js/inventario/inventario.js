export class Inventario {
  constructor(){
    this.capacidad = 100;
    this.items = {}; // mapa item -> cantidad
  }

  cantidad(nombre){
    return this.items[nombre] || 0;
  }

  agregar(item,cantidad=1){
    this.items[item] = (this.items[item] || 0) + cantidad;
    return true;
  }

  // alias en español
  añadir(item,cantidad=1){ return this.agregar(item,cantidad); }

  // compatibilidad con nombres alternativos
  add(item,cantidad=1){ return this.agregar(item,cantidad); }

  // comprobación si tiene suficientes unidades
  tiene(item,cantidad=1){
    return (this.items[item] || 0) >= cantidad;
  }

  quitar(item,cantidad=1){
    if(!this.tiene(item,cantidad)) return false;
    this.items[item] -= cantidad;
    if(this.items[item] <= 0) delete this.items[item];
    return true;
  }

  // alias
  remove(item,cantidad=1){ return this.quitar(item,cantidad); }
}
