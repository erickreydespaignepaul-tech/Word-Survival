// Sistema de criaturas
export class Criaturas {
    constructor(){
        this.lista = [];
        this.especies = [
            'vaca','cerdo','oveja','pollo','caballo','lobo','zorro','oso','conejo','ciervo',
            'aguila','pez','rana','tortuga','serpiente','abeja','murcielago','jaguar','tigre','dragon'
        ];
    }

    crear(tipo,x,y){
        this.lista.push({tipo,x,y,vida:100,animacion:0});
    }

    actualizar(dt){
        for(const criatura of this.lista){
            criatura.animacion += dt;
        }
    }
}
