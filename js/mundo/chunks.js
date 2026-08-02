import { tipoDesdeSemilla, BLOQUES } from './bloques.js';
const ruido=(x,y)=>{const v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);};
export class Chunks {
  constructor(tamano){this.tamano=tamano;this.lista=new Map(); this.drops = [];}
  clave(x,y){return `${x},${y}`;}
  generar(cx,cy){
    const clave=this.clave(cx,cy);
    if(this.lista.has(clave)) return;
    const bloques=[];
    for(let x=0;x<this.tamano;x++){
      for(let y=0;y<this.tamano;y++){
        const wx = cx*this.tamano + x;
        const wy = cy*this.tamano + y;
        const sem = Math.floor(ruido(wx,wy)*100000);
        const tipo = tipoDesdeSemilla(sem);
        let vida = 0;
        if (tipo === BLOQUES.ARBOL) vida = 50;
        else if (tipo === BLOQUES.ROCA) vida = 80;
        bloques.push({ x: wx, y: wy, tipo, semilla: sem, vida });
      }
    }
    this.lista.set(clave, bloques);
  }
  cargarCerca(cx,cy){
    cx=Math.floor(cx);cy=Math.floor(cy);
    for(let x=-2;x<=2;x++) for(let y=-2;y<=2;y++) this.generar(cx+x,cy+y);
    for(const clave of this.lista.keys()){
      const [x,y]=clave.split(',').map(Number);
      if(Math.abs(x-cx)>3||Math.abs(y-cy)>3) this.lista.delete(clave);
    }
  }
  bloquesVisibles(camX,camY,ancho,alto,tile){
    return [...this.lista.values()].flat().filter(b=>b.x*tile>camX-tile&&b.x*tile<camX+ancho&&b.y*tile>camY-tile&&b.y*tile<camY+alto);
  }
  // Aplica daño a un bloque por coordenadas de tile (wx,wy)
  damageBloque(wx, wy, daño) {
    for (const bloques of this.lista.values()) {
      const idx = bloques.findIndex(b => b.x === wx && b.y === wy && b.tipo);
      if (idx >= 0) {
        const b = bloques[idx];
        if (!b.vida) return;
        b.vida -= daño;
        if (b.vida <= 0) {
          const drop = this._dropPorTipo(b.tipo);
          if (drop) this.spawnDrop(wx, wy, drop);
          b.tipo = 0;
          b.vida = 0;
        }
        return;
      }
    }
  }
  _dropPorTipo(tipo) {
    if (tipo === BLOQUES.ARBOL) return { item: 'madera', cantidad: 1 };
    if (tipo === BLOQUES.ROCA) return { item: 'piedra', cantidad: 1 };
    return null;
  }
  spawnDrop(wx, wy, drop) {
    this.drops.push({ x: wx, y: wy, ...drop });
  }
  dropsVisibles(camX,camY,ancho,alto,tile) {
    return this.drops.filter(d => d.x*tile>camX-tile && d.x*tile<camX+ancho && d.y*tile>camY-tile && d.y*tile<camY+alto);
  }
  recogerDropsEnPos(pos, tileSize, rangoPixeles = 20) {
    const recogidos = [];
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      const dx = d.x * tileSize + tileSize/2 - pos.x;
      const dy = d.y * tileSize + tileSize/2 - pos.y;
      if (Math.hypot(dx, dy) <= rangoPixeles) {
        recogidos.push(d);
        this.drops.splice(i,1);
      }
    }
    return recogidos;
  }
}
