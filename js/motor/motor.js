// Motor principal de WORD SURVIVAL
export class Motor {
    constructor(){
        this.iniciado = false;
    }
    iniciar(){
        this.iniciado = true;
        console.log('Motor iniciado');
    }
}
