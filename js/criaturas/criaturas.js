import { ModeloAnimal } from './modelos.js';

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
        this.lista.push({
            tipo,x,y,
            vida:100,
            animacion:Math.random()*10,
            modelo:new ModeloAnimal(tipo)
        });
    }

    actualizar(dt){
        for(const criatura of this.lista){
            criatura.animacion += dt;
            criatura.x += Math.sin(criatura.animacion)*dt*3;
        }
    }

    dibujar(ctx){
        for(const criatura of this.lista){
            criatura.modelo.dibujar(ctx,criatura.x,criatura.y,criatura.animacion);
        }
    }
}
