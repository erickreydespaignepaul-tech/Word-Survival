import { Chunks } from './chunks.js';
import { BLOQUES, colorBloque, detalleBloque } from './bloques.js';

export class Mundo {
  constructor() { this.tamanoTile=40; this.chunks=new Chunks(16); }
  cargarCerca(pos) { this.chunks.cargarCerca(pos.x / (this.tamanoTile*16), pos.y / (this.tamanoTile*16)); }

  recogerEn(x, y, posJugador) {
    const tileX = Math.floor((x + posJugador.x - innerWidth / 2) / this.tamanoTile);
    const tileY = Math.floor((y + posJugador.y - innerHeight / 2) / this.tamanoTile);

    for (const bloques of this.chunks.lista.values()) {
      const bloque = bloques.find(b => b.x === tileX && b.y === tileY && b.tipo);
      if (!bloque) continue;

      let recurso = null;
      if (bloque.tipo === BLOQUES.ARBOL) recurso = 'madera';
      if (bloque.tipo === BLOQUES.ROCA) recurso = 'piedra';

      if (recurso) {
        bloque.tipo = 0;
        bloque.vida = 0;
        return recurso;
      }
    }
    return null;
  }

  dibujar(ctx,pos,ancho,alto) { const t=this.tamanoTile, camX=pos.x-ancho/2, camY=pos.y-alto/2; this.chunks.bloquesVisibles(camX,camY,ancho,alto,t).forEach(b=>{const x=Math.floor(b.x*t-camX),y=Math.floor(b.y*t-camY); ctx.fillStyle=colorBloque(b.tipo);ctx.fillRect(x,y,t+1,t+1); detalleBloque(ctx,b.tipo,x,y,t,b.semilla); if(b.tipo===BLOQUES.ARBOL){ctx.fillStyle='#68401e';ctx.fillRect(x+16,y+15,8,24);ctx.fillStyle='#236b37';ctx.fillRect(x+7,y+4,27,20);} if(b.tipo===BLOQUES.ROCA){ctx.fillStyle='#a7a9a2';ctx.beginPath();ctx.arc(x+20,y+22,11,0,Math.PI*2);ctx.fill();} }); }
}
