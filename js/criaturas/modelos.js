// Generador procedimental de sprites para criaturas
// Ahora genera cuerpos, cabeza, patas en el estilo visual del humano.
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

function mulberry32(a){
  return function(){
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

function lerp(a,b,t){ return a + (b-a)*t; }

export class ModeloAnimal {
  // ahora acepta seed opcional para que el sprite sea reproducible por mundo/posición
  constructor(specie, seed = null){
    this.specie = specie;
    this.seed = (seed === null) ? hashString(specie.nombre) : (seed >>> 0);
    this.size = Math.floor((specie.tamaño||1)*28)+18; // rango más grande: 18..46
    this.img = this._generateImage();
  }

  _generateImage(){
    const key = this.specie.nombre + ':' + this.seed;
    if(cache.has(key)) return cache.get(key);
    const s = this.size;
    const canvas = document.createElement('canvas');
    canvas.width = s; canvas.height = s; const ctx = canvas.getContext('2d');

    // PRNG a partir de seed para determinar patrones de forma reproducible
    const rand = mulberry32(this.seed);
    const h = hashString(this.specie.nombre ^ this.seed);

    ctx.clearRect(0,0,s,s);

    // parámetros derivados de hash y especie
    const base = (this.specie.base||'creatura').toLowerCase();
    const colorBody = colorFromHash(h,0);
    const colorAccent = colorFromHash(h,8);
    const patternColor = colorFromHash(h,16);
    const outline = 'rgba(20,20,20,0.95)';
    const hasTail = !['oveja','vaca','cerdo'].includes(base) && (Math.floor(rand()*10)%2===1);
    const hasEars = ['vaca','cerdo','oveja','conejo','zorro','lobo','ciervo','tigre','jaguar'].includes(base) || (Math.floor(rand()*10)%2===1);

    // proporciones uniformes al estilo humano: cuerpo más cuadrado, cabeza proporcional
    const bodyW = Math.floor(s * 0.62);
    const bodyH = Math.floor(s * 0.48);
    const bodyX = Math.floor((s - bodyW) / 2);
    const bodyY = s - bodyH - Math.floor(s * 0.12);
    const headR = Math.max(5, Math.floor(s * 0.12));
    let headCX = bodyX + Math.floor(bodyW * 0.75);
    let headCY = bodyY + Math.floor(bodyH * 0.22);
    if(base === 'pez' || base === 'tortuga'){ headCX = bodyX + Math.floor(bodyW*0.5); headCY = bodyY + Math.floor(bodyH*0.15); }

    // contorno grueso tipo "humano"
    ctx.lineWidth = Math.max(1, Math.floor(s * 0.06));
    ctx.strokeStyle = outline;

    // sombra
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(s/2, s-3, bodyW*0.6, Math.max(3,Math.floor(s*0.04)), 0, 0, Math.PI*2); ctx.fill();

    // cuerpo (relleno simple, contorno)
    ctx.fillStyle = colorBody; ctx.beginPath();
    roundRect(ctx, bodyX, bodyY, bodyW, bodyH, Math.max(3,Math.floor(bodyH*0.2)), true, false);
    ctx.stroke();

    // cabeza
    ctx.fillStyle = colorAccent;
    ctx.beginPath(); ctx.arc(headCX, headCY, headR, 0, Math.PI*2); ctx.fill(); ctx.stroke();

    // ojos estilo humano (más arriba, ovales)
    ctx.fillStyle = '#000';
    const eyeX = Math.max(2, Math.floor(headR*0.4));
    const eyeY = headCY - Math.max(1, Math.floor(headR*0.25));
    ctx.beginPath(); ctx.ellipse(headCX - eyeX, eyeY, Math.max(1,Math.floor(headR*0.18)), Math.max(1,Math.floor(headR*0.12)), 0, 0, Math.PI*2); ctx.fill();
    if(base !== 'serpiente') { ctx.beginPath(); ctx.ellipse(headCX + eyeX, eyeY, Math.max(1,Math.floor(headR*0.18)), Math.max(1,Math.floor(headR*0.12)), 0, 0, Math.PI*2); ctx.fill(); }

    // nariz/boca sutil
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(headCX - Math.floor(headR*0.12), headCY + Math.floor(headR*0.18), Math.max(1,Math.floor(headR*0.25)), 1);

    // patas triangulares estilizadas
    const legW = Math.max(3, Math.floor(s*0.06));
    const legH = Math.max(6, Math.floor(s*0.14));
    const legCount = (base==='pollo'||base==='pajaro')?2:4;
    const spacing = bodyW / (legCount + 1);
    ctx.fillStyle = colorAccent;
    ctx.lineWidth = Math.max(1, Math.floor(s*0.02));
    for(let i=0;i<legCount;i++){
      const lx = bodyX + spacing*(i+1);
      const ly = bodyY + bodyH;
      ctx.beginPath();
      ctx.moveTo(lx - legW, ly);
      ctx.lineTo(lx + legW, ly);
      ctx.lineTo(lx, ly + legH);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // patrones (deterministas) en el mismo estilo
    ctx.fillStyle = patternColor;
    const patternCount = 1 + Math.floor(rand()*2);
    for(let i=0;i<patternCount;i++){
      const pw = Math.max(4, Math.floor(bodyW*0.18));
      const ph = Math.max(3, Math.floor(bodyH*0.12));
      const px = bodyX + Math.floor((0.2 + rand()*0.6) * bodyW) - Math.floor(pw/2);
      const py = bodyY + Math.floor((0.2 + rand()*0.6) * bodyH) - Math.floor(ph/2);
      ctx.beginPath(); ctx.ellipse(px+pw/2, py+ph/2, pw/2, ph/2, 0, 0, Math.PI*2); ctx.fill();
    }

    // orejas/cuernos si aplica (estilizados)
    if(hasEars){
      ctx.fillStyle = colorAccent; const earW = Math.max(2, Math.floor(headR*0.5)); const earH = Math.max(3, Math.floor(headR*0.8));
      ctx.beginPath(); ctx.moveTo(headCX-headR+2, headCY-headR/2); ctx.lineTo(headCX-headR+2-earW, headCY-headR/2 - earH); ctx.lineTo(headCX-headR+6, headCY-headR/2 + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(headCX+headR-2, headCY-headR/2); ctx.lineTo(headCX+headR-2+earW, headCY-headR/2 - earH); ctx.lineTo(headCX+headR-6, headCY-headR/2 + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // cola si aplica
    if(hasTail){ ctx.save(); ctx.strokeStyle = outline; ctx.lineWidth = Math.max(1, Math.floor(s*0.03)); ctx.beginPath(); const tx0 = bodyX + bodyW - Math.floor(bodyW*0.08); const ty0 = bodyY + Math.floor(bodyH*0.55); ctx.moveTo(tx0, ty0); ctx.quadraticCurveTo(tx0 + Math.floor(bodyW*0.25), ty0 - Math.floor(bodyH*0.3), tx0 + Math.floor(bodyW*0.45), ty0 - Math.floor(bodyH*0.05)); ctx.stroke(); ctx.restore(); }

    // export image
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

// helper: rectángulo redondeado
function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if(typeof r === 'undefined') r = 5;
  if(typeof r === 'number') r = {tl:r,tr:r,br:r,bl:r};
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}
