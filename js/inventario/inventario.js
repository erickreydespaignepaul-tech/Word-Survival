// Sistema de inventario
export class Inventario {
    constructor(){
        this.items = [];
    }
    agregar(item){
        this.items.push(item);
    }
}
