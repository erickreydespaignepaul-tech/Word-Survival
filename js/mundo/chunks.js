// Sistema de chunks del mundo infinito
export class Chunks {
    constructor(){
        this.lista = [];
    }
    generar(x,z){
        this.lista.push({x,z});
    }
}
