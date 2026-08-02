// Generador de sprites placeholder y modelo para criaturas (nueva versión en rama feature)
const cache = new Map();

function hashString(s){
  let h=0; for(let i=0;i<s.length;i++) h=(h<<5)-h+ s.charCodeAt(i)|0; return Math.abs(h);
}

function colorFromHash(h, offset=0){
  const r = (h>> (offset % 8)) & 0xFF;
  const g = (h>> ((offset+8) % 16)) & 0xFF;
  const b = (h>> ((offset+16) % 24)) & 0xFF;
  return `rgb(${(r%200)+20},${(g%200)+20},${(b%200)+20})`;
}

export class ModeloAnimal {
  constructor(specie){
    this.specie = specie;
    this.size = Math.floor((specie.tamaño||1)*24)+16; // 16..40
    this.img = this._generateImage();
  }

  _generateImage(){
    const key = this.specie.nombre;
    if(cache.has(key)) return cache.get(key);
    const s = this.size; const canvas = document.createElement('canvas'); canvas.width = s; canvas.height = s; const ctx = canvas.getContext('2d');
    const h = hashString(key);
    // fondo transparente
    ctx.clearRect(0,0,s,s);
    // cuerpo
    ctx.fillStyle = colorFromHash(h,0);
    const cw = Math.floor(s*0.6), ch = Math.floor(s*0.45);
    ctx.fillRect((s-cw)/2, s-ch-4, cw, ch);
    // cabeza
    ctx.fillStyle = colorFromHash(h,8);
    ctx.beginPath(); ctx.arc(s*0.75, s-ch-10, Math.max(4, s*0.12), 0, Math.PI*2); ctx.fill();
    // patrón simple
    ctx.fillStyle = colorFromHash(h,16);
    for(let i=0;i<3;i++){
      ctx.fillRect((s*0.15)+i*4, s-ch-6+i*3, 3, 3);
    }
    // ojos
    ctx.fillStyle = '#000'; ctx.fillRect(s*0.75+4, s-ch-14, 3,3);

    const data = new Image(); data.src = canvas.toDataURL();
    cache.set(key, data);
    return data;
  }

  dibujar(ctx,x,y,animacion=0){
    const salto = Math.sin(animacion*5)*2;
    const img = this.img;
    const w = img.width, h = img.height;
    ctx.save();
    ctx.translate(x - w/2, y - h/2 + salto);
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
  }
}
