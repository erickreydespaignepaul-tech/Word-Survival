import { tipoDesdeSemilla } from './bloques.js';
const ruido=(x,y)=>{const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);};
export class Chunks {
  constructor(tamano){this.tamano=tamano;this.lista=new Map();}
  clave(x,y){return `${x},${y}`;}
  generar(cx,cy){const clave=this.clave(cx,cy);if(this.lista.has(clave))return;const bloques=[];for(let x=0;x<this.tamano;x++)for(let y=0;y<this.tamano;y++){const wx=cx*this.tamano+x,wy=cy*this.tamano+y,semilla=ruido(wx,wy);bloques.push({x:wx,y:wy,semilla,tipo:tipoDesdeSemilla(semilla)});}this.lista.set(clave,bloques);}
  cargarCerca(cx,cy){cx=Math.floor(cx);cy=Math.floor(cy);for(let x=-2;x<=2;x++)for(let y=-2;y<=2;y++)this.generar(cx+x,cy+y);for(const clave of this.lista.keys()){const [x,y]=clave.split(',').map(Number);if(Math.max(Math.abs(x-cx),Math.abs(y-cy))>3)this.lista.delete(clave);}}
  bloquesVisibles(camX,camY,ancho,alto,tile){return [...this.lista.values()].flat().filter(b=>b.x*tile>camX-tile&&b.x*tile<camX+ancho&&b.y*tile>camY-tile&&b.y*tile<camY+alto);}
}
