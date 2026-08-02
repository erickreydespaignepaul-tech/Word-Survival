import { ESPECIES } from './species.js';
import { ModeloAnimal } from './modelos.js';

export class Criaturas {
  constructor(mundo, inventario){
    this.mundo = mundo;
    this.inventario = inventario;
    this.lista = []; // criaturas activas
    this.maxActivas = 200;
    this.spawnPorChunk = 6;
    this.spawnRate = 0.5; // probabilidad base por intento
  }

  actualizar(dt, jugador){
    // actualizar animaciones y movimiento ligero
    for(const c of this.lista){
      c.anim += dt;
      // movimiento pasivo: pequeña oscilacion
      c.x += Math.sin(c.anim*2)*dt*0.3*c.vel;
      c.y += Math.cos(c.anim*1.5)*dt*0.3*c.vel;
      // distancia al jugador: si muy cerca, huir ligeramente
      const dx = c.x - jugador.posicion.x / this.mundo.tamanoTile;
      const dy = c.y - jugador.posicion.y / this.mundo.tamanoTile;
      const dist = Math.hypot(dx,dy) || 0.001;
      if(dist<2){
        // huir
        c.x += (dx/dist)*dt*2;
        c.y += (dy/dist)*dt*2;
      }
    }

    // limpieza: remover fuera de rango absoluto (muy lejos)
    this.lista = this.lista.filter(c=>{
      const dx = c.x - jugador.posicion.x / this.mundo.tamanoTile;
      const dy = c.y - jugador.posicion.y / this.mundo.tamanoTile;
      return Math.hypot(dx,dy) < 60; // limite muy amplio para no desaparecer instant
    });

    // spawnear en chunks cargados cerca del jugador
    const cx = Math.floor(jugador.posicion.x / (this.mundo.tamanoTile * this.mundo.chunks.tamano));
    const cy = Math.floor(jugador.posicion.y / (this.mundo.tamanoTile * this.mundo.chunks.tamano));

    // iterate over loaded chunks
    for(const [clave, bloques] of this.mundo.chunks.lista.entries()){
      if(this.lista.length >= this.maxActivas) break;
      const [sx,sy] = clave.split(',').map(Number);
      if(Math.abs(sx-cx)>4 || Math.abs(sy-cy)>4) continue; // solo chunks cercanos
      // count creatures in this chunk
      const countChunk = this.lista.filter(c=>Math.floor(c.x / this.mundo.chunks.tamano)===sx && Math.floor(c.y / this.mundo.chunks.tamano)===sy).length;
      if(countChunk >= this.spawnPorChunk) continue;
      // intentar spawns
      for(let i=0;i<this.spawnPorChunk - countChunk;i++){
        if(Math.random() < this.spawnRate){
          // escoger una posicion aleatoria en el chunk en tiles
          const tx = sx * this.mundo.chunks.tamano + Math.floor(Math.random()*this.mundo.chunks.tamano);
          const ty = sy * this.mundo.chunks.tamano + Math.floor(Math.random()*this.mundo.chunks.tamano);
          // determinar bioma en esa tile
          const b = this.mundo.chunks.biome(tx,ty);
          // escoger especie compatible
          const candidatos = ESPECIES.filter(s=>s.biomasPreferidos.includes(b));
          if(candidatos.length===0) continue;
          const especie = candidatos[Math.floor(Math.random()*candidatos.length)];
          // crear criatura
          const criatura = {
            id: `${especie.id}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            especieId: especie.id,
            especie,
            x: tx,
            y: ty,
            anim: Math.random()*10,
            vel: especie.tamaño || 1,
            modelo: new ModeloAnimal(especie),
            vida: 20 + (especie.rareza||1)*10
          };
          this.lista.push(criatura);
          if(this.lista.length >= this.maxActivas) break;
        }
      }
    }
  }

  dibujar(ctx, jugadorPos, ancho, alto){
    const camX = jugadorPos.x - ancho/2;
    const camY = jugadorPos.y - alto/2;
    const tile = this.mundo.tamanoTile;
    for(const c of this.lista){
      // culling por cámara
      const px = c.x*tile - camX;
      const py = c.y*tile - camY;
      if(px < -64 || px > ancho+64 || py < -64 || py > alto+64) continue;
      c.modelo.dibujar(ctx, px, py, c.anim);
    }
  }

  // método para intentar recoger/dañar una criatura en coordenadas tile (opcional)
  encontrarEn(tileX,tileY){
    return this.lista.find(c=>Math.floor(c.x)===tileX && Math.floor(c.y)===tileY);
  }
}
