export class Inventario {
  constructor(slots = 20, capacidadPorSlot = 99){
    this.slots = new Array(slots).fill(null); // cada slot: {item, cantidad} o null
    this.capacidadPorSlot = capacidadPorSlot;
    this.onChange = null; // callback UI: (inventario) => {}
  }

  _emit(){ if(typeof this.onChange === 'function') this.onChange(this); }

  agregar(item, cantidad = 1){
    if(!item) return false;
    // intentar apilar primero
    for(let i=0;i<this.slots.length;i++){
      const s = this.slots[i];
      if(s && s.item === item && s.cantidad < this.capacidadPorSlot){
        const espacio = this.capacidadPorSlot - s.cantidad;
        const uso = Math.min(espacio, cantidad);
        s.cantidad += uso; cantidad -= uso;
        if(cantidad === 0){ this._emit(); return true; }
      }
    }
    // crear nuevos stacks en slots vacíos
    for(let i=0;i<this.slots.length;i++){
      if(this.slots[i] === null){
        const poner = Math.min(this.capacidadPorSlot, cantidad);
        this.slots[i] = { item, cantidad: poner };
        cantidad -= poner;
        if(cantidad === 0){ this._emit(); return true; }
      }
    }
    // si quedó cantidad, no hay espacio suficiente -> no añadir lo restante
    this._emit();
    return false;
  }

  tiene(item, cantidad = 1){
    let total = 0;
    for(const s of this.slots) if(s && s.item === item) total += s.cantidad;
    return total >= cantidad;
  }

  quitar(item, cantidad = 1){
    if(!this.tiene(item, cantidad)) return false;
    for(let i=0;i<this.slots.length && cantidad>0;i++){
      const s = this.slots[i];
      if(!s || s.item !== item) continue;
      const uso = Math.min(s.cantidad, cantidad);
      s.cantidad -= uso; cantidad -= uso;
      if(s.cantidad <= 0) this.slots[i] = null;
    }
    this._emit();
    return true;
  }

  // persistencia simple (serialize slots)
  guardar(key='ws_inventario_slots'){ try { localStorage.setItem(key, JSON.stringify(this.slots)); } catch(e){} }
  cargar(key='ws_inventario_slots'){ try { const raw = localStorage.getItem(key); if(!raw) return false; this.slots = JSON.parse(raw); this._emit(); return true; } catch(e){ return false; } }
}
