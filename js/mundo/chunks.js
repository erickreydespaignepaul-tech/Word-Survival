import { tipoDesdeSemilla, BLOQUES } from './bloques.js';

// ruido determinista basado en coordenadas y seed
function seededNoise(seed, x, y) {
  const s = (x * 374761393 + y * 668265263) ^ (seed + 0x9E3779B9);
  let t = (s ^ (s >>> 13)) >>> 0;
  t = (Math.imul(t, 1274126177) ^ (t >>> 16)) >>> 0;
  return (t % 10000) / 10000; // 0..1
}

function fractalNoise(seed, x, y, octaves = 3, lacunarity = 2, gain = 0.5) {
  let amp = 1, freq = 1, sum = 0, max = 0;
  for (let i = 0; i < octaves; i++) {
    sum += seededNoise(seed, Math.floor(x * freq), Math.floor(y * freq)) * amp;
    max += amp;
    amp *= gain; freq *= lacunarity;
  }
  return sum / max;
}

const altura = (seed, x, y) => Math.abs(Math.sin(x * 0.08) + Math.cos(y * 0.08)) * 0.5 + fractalNoise(seed, x * 0.02, y * 0.02, 4, 2, 0.6) * 0.5;

export class Chunks {
  constructor(tamano, seed = Date.now()){this.tamano = tamano; this.lista = new Map(); this.drops = []; this.seed = seed >>> 0;}
  clave(x,y){return `${x},${y}`;}

  biome(wx,wy){
    const tx = Math.floor(wx/30), ty = Math.floor(wy/30);
    const temp = fractalNoise(this.seed, tx, ty, 4, 2, 0.6);
    const moist = fractalNoise(this.seed + 12345, tx, ty, 4, 2, 0.6);
    const river = fractalNoise(this.seed + 99999, Math.floor(wx/10), Math.floor(wy/10), 3) > 0.92;
    if (river) return 'rio';
    if (temp < 0.2 && moist < 0.3) return 'tundra';
    if (temp < 0.25) return 'nieve';
    if (temp > 0.75 && moist < 0.25) return 'desierto';
    if (moist > 0.7 && temp > 0.4) return 'jungla';
    if (moist > 0.55) return 'pantano';
    if (temp > 0.6) return 'sabana';
    if (temp > 0.45) return 'bosque';
    return 'pradera';
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
        const n = fractalNoise(this.seed, wx, wy, 3, 2, 0.5);
        const montaña = altura(this.seed, wx, wy) > 0.6;

        // clustering: ruido a baja frecuencia para parches grandes
        const p = fractalNoise(this.seed, wx*0.02, wy*0.02, 3, 2, 0.6);

        // determinar tipo base por ruido y por bioma con clustering
        let tipo = BLOQUES.TIERRA;
        if(['bosque','jungla','sabana','pradera'].includes(b) && p > 0.55) tipo = BLOQUES.ARBOL;
        if(b === 'rio' || p < 0.08) tipo = BLOQUES.AGUA;
        if((b === 'montana' || p > 0.8) && Math.random() < 0.4) tipo = BLOQUES.ROCA;

        // minerales en vetas (usar n a escala fina)
        if(n > 0.965) tipo = BLOQUES.HIERRO;
        else if(n > 0.93) tipo = BLOQUES.CARBON;

        let vida = 0;
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
  dropsVisibles(camX,camY,ancho,alto,tile){
    return this.drops.filter(d=>d.x*tile>camX-tile&&d.x*tile<camX+ancho&&d.y*tile>camY-tile&&d.y*tile<camY+alto);
  }

  // recoger drops cercanos en pos (pos en píxeles), radio en px
  recogerDropsEnPos(pos, tileSize, radioPx = 20) {
    const tx = Math.floor(pos.x / tileSize);
    const ty = Math.floor(pos.y / tileSize);
    const encontrados = [];
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      const dx = (d.x * tileSize) - pos.x; const dy = (d.y * tileSize) - pos.y;
      if (Math.hypot(dx, dy) <= radioPx) { encontrados.push(d); this.drops.splice(i, 1); }
    }
    return encontrados;
  }
}
