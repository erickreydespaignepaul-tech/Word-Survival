import { tipoDesdeSemilla, BLOQUES } from './bloques.js';

const ruido=(x,y)=>{const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);};
const altura=(x,y)=>Math.abs(Math.sin(x*0.08)+Math.cos(y*0.08));

export class Chunks {
  constructor(tamano){this.tamano=tamano;this.lista=new Map();this.drops=[];}
  clave(x,y){return `${x},${y}`;}

  biome(wx,wy){
    const n=ruido(Math.floor(wx/20),Math.floor(wy/20));
    if(n<0.2)return 'desierto';
    if(n>0.82)return 'nieve';
    if(n>0.65)return 'montana';
    if(n<0.35)return 'pantano';
    return 'bosque';
  }

  generar(cx,cy){
    const clave=this.clave(cx,cy);
    if(this.lista.has(clave))return;
    const bloques=[];

    for(let x=0;x<this.tamano;x++){
      for(let y=0;y<this.tamano;y++){
        const wx=cx*this.tamano+x;
        const wy=cy*this.tamano+y;
        const b=this.biome(wx,wy);
        const n=ruido(wx,wy);
        const montaña=altura(wx,wy)>1.1;
        let tipo=BLOQUES.HIERBA;

        if(b==='desierto') tipo=n<0.05?BLOQUES.ROCA:BLOQUES.TIERRA;
        if(b==='nieve') tipo=n<0.15?BLOQUES.ROCA:BLOQUES.HIERBA;
        if(b==='montana') tipo=montaña?BLOQUES.ROCA:BLOQUES.TIERRA;
        if(b==='pantano') tipo=n<0.15?BLOQUES.AGUA:BLOQUES.HIERBA;
        if(b==='bosque' && n>0.82) tipo=BLOQUES.ARBOL;

        if(n>0.965) tipo=BLOQUES.HIERRO;
        else if(n>0.93) tipo=BLOQUES.CARBON;

        let vida=0;
        if(tipo===BLOQUES.ARBOL) vida=100;
        if(tipo===BLOQUES.ROCA) vida=80;
        if(tipo===BLOQUES.HIERRO||tipo===BLOQUES.CARBON) vida=120;

        bloques.push({x:wx,y:wy,tipo,bioma:b,semilla:n,vida});
      }
    }
    this.lista.set(clave,bloques);
  }

  cargarCerca(cx,cy){
    cx=Math.floor(cx);cy=Math.floor(cy);
    for(let x=-2;x<=2;x++)for(let y=-2;y<=2;y++)this.generar(cx+x,cy+y);
    for(const clave of this.lista.keys()){
      const [x,y]=clave.split(',').map(Number);
      if(Math.abs(x-cx)>3||Math.abs(y-cy)>3)this.lista.delete(clave);
    }
  }

  bloquesVisibles(camX,camY,ancho,alto,tile){
    return [...this.lista.values()].flat().filter(b=>b.x*tile>camX-tile&&b.x*tile<camX+ancho&&b.y*tile>camY-tile&&b.y*tile<camY+alto);
  }

  damageBloque(wx,wy,daño){
    for(const bloques of this.lista.values()){
      const b=bloques.find(b=>b.x===wx&&b.y===wy&&b.tipo);
      if(!b)continue;
      b.vida-=daño;
      if(b.vida<=0){
        const drop=this._dropPorTipo(b.tipo);
        if(drop)this.spawnDrop(wx,wy,drop);
        b.tipo=0;
      }
      return;
    }
  }

  _dropPorTipo(tipo){
    if(tipo===BLOQUES.ARBOL)return {item:'madera',cantidad:2};
    if(tipo===BLOQUES.ROCA)return {item:'piedra',cantidad:2};
    if(tipo===BLOQUES.HIERRO)return {item:'hierro',cantidad:1};
    if(tipo===BLOQUES.CARBON)return {item:'carbon',cantidad:2};
  }

  spawnDrop(wx,wy,drop){this.drops.push({x:wx,y:wy,...drop});}
  dropsVisibles(camX,camY,ancho,alto,tile){return this.drops;}
}
