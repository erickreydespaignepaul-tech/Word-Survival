// Motor semantico de palabras
export class MotorSemantico {
    constructor(){
        this.diccionario = {};
    }
    agregarPalabra(palabra, dato){
        this.diccionario[palabra] = dato;
    }
}
