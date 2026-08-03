import { Chunks } from './chunks.js';
import { BLOQUES, colorBloque, detalleBloque } from './bloques.js';

export class Mundo {
  constructor(seed = Date.now()) { this.tamanoTile = 40; this.chunks = new Chunks(16, seed); this.seed = seed; }
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
        // tronco más alto y ancho relativo al tile
        const trunkW = Math.max(6, Math.floor(t*0.22));
        const trunkH = Math.max(40, Math.floor(t*0.9)); // tronco más alto
        // dibujar tronco anclado en la base del tile (para que no se "corte")
        ctx.fillStyle = '#6b421f';
        ctx.fillRect(x + Math.floor(t*0.45), y - (trunkH - Math.floor(t*0.3)), trunkW, trunkH);
        // copa mayor y más variada según bioma
        ctx.beginPath();
        let crownRadius = Math.floor(t*0.9);
        if(b.bioma === 'jungla') crownRadius = Math.floor(t*1.1);
        if(b.bioma === 'nieve') ctx.fillStyle = '#e6f0f0'; else if(b.bioma === 'jungla') ctx.fillStyle = '#1f6b2f'; else ctx.fillStyle = '#2f7a3a';
        ctx.arc(x + Math.floor(t*0.575), y - trunkH + Math.floor(t*0.35), crownRadius, 0, Math.PI*2);
        ctx.fill();
        // contorno sutil
        ctx.strokeStyle = 'rgba(0,0,0,0.14)';
        ctx.stroke();
      }
      if(b.tipo===BLOQUES.ROCA||b.tipo===BLOQUES.HIERRO||b.tipo===BLOQUES.CARBON){
        ctx.fillStyle='#777';ctx.beginPath();ctx.arc(x+Math.floor(t*0.5),y+Math.floor(t*0.55),12,0,Math.PI*2);ctx.fill();
      }
    });

    // dibujar drops (recursos sueltos)
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    this.chunks.dropsVisibles(camX, camY, ancho, alto, t).forEach(d=>{
      const dx = Math.floor(d.x*t - camX), dy = Math.floor(d.y*t - camY);
      // representación simple: caja + texto
      ctx.fillStyle = '#c08b4e';
      ctx.fillRect(dx + 12, dy + 12, 16, 16);
      ctx.fillStyle = '#000';
      ctx.fillText(d.item, dx + 6, dy + 10);
    });
  }

  // recoger drops alrededor de pos (en píxeles) y añadir al inventario
  recogerDrops(pos, inventario) {
    const items = this.chunks.recogerDropsEnPos(pos, this.tamanoTile, 20);
    for (const it of items) {
      if (inventario && typeof inventario.agregar === 'function') {
        inventario.agregar(it.item, it.cantidad || 1);
      } else if (inventario && inventario.items) {
        // compatibilidad con inventarios en mapa u array
        if (Array.isArray(inventario.items)) inventario.items.push({ item: it.item, cantidad: it.cantidad || 1 });
        else inventario.items[it.item] = (inventario.items[it.item] || 0) + (it.cantidad || 1);
      }
    }
    return items;
  }
}
