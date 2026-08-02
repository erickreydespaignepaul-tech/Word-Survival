import { Chunks } from './chunks.js';
import { BLOQUES, colorBloque, detalleBloque } from './bloques.js';

export class Mundo {
  constructor() { this.tamanoTile=40; this.chunks=new Chunks(16); }
  cargarCerca(pos) { this.chunks.cargarCerca(pos.x / (this.tamanoTile*16), pos.y / (this.tamanoTile*16)); }

  recogerEn(x, y, posJugador) {
    const tileX = Math.floor((x + posJugador.x - innerWidth / 2) / this.tamanoTile);
    const tileY = Math.floor((y + posJugador.y - innerHeight / 2) / this.tamanoTile);
    for (const bloques of this.chunks.lista.values()) {
      const bloque = bloques.find(b=>b.x===tileX&&b.y===tileY&&b.tipo);
      if(!bloque) continue;
      let recurso=null;
      if(bloque.tipo===BLOQUES.ARBOL) recurso='madera';
      if(bloque.tipo===BLOQUES.ROCA) recurso='piedra';
      if(bloque.tipo===BLOQUES.HIERRO) recurso='hierro';
      if(bloque.tipo===BLOQUES.CARBON) recurso='carbon';
      if(recurso){ bloque.tipo=0; return recurso; }
    }
    return null;
  }

  dibujar(ctx,pos,ancho,alto){
    const t=this.tamanoTile,camX=pos.x-ancho/2,camY=pos.y-alto/2;
    // Obtener bloques visibles una sola vez
    const visibles = this.chunks.bloquesVisibles(camX,camY,ancho,alto,t);

    // 1) Dibujar capa de suelo (tiles y detalle) para todos los bloques visibles
    visibles.forEach(b=>{
      const x=Math.floor(b.x*t-camX),y=Math.floor(b.y*t-camY);
      ctx.fillStyle=colorBloque(b.tipo);ctx.fillRect(x,y,t+1,t+1);
      detalleBloque(ctx,b.tipo,x,y,t,b.semilla);
    });

    // 2) Dibujar objetos/decors (árboles, rocas, minerales) ordenados por y para correcto solapamiento
    visibles.sort((a,b)=> (a.y - b.y));
    visibles.forEach(b=>{
      const x=Math.floor(b.x*t-camX),y=Math.floor(b.y*t-camY);
      if(b.tipo===BLOQUES.ARBOL){
        // tronco
        ctx.fillStyle='#68401e';
        // ajustar para que el tronco se dibuje por encima del tile anterior (no sea "cortado")
        ctx.fillRect(x+Math.floor(t*0.45),y-10,Math.floor(t*0.25),50);
        // copa
        ctx.fillStyle='#236b37';ctx.beginPath();ctx.arc(x+Math.floor(t*0.575),y-12,Math.floor(t*0.7),0,Math.PI*2);ctx.fill();
      }
      if(b.tipo===BLOQUES.ROCA||b.tipo===BLOQUES.HIERRO||b.tipo===BLOQUES.CARBON){
        ctx.fillStyle='#777';ctx.beginPath();ctx.arc(x+Math.floor(t*0.5),y+Math.floor(t*0.55),12,0,Math.PI*2);ctx.fill();
      }
    });
  }
}
