// Generador procedimental de sprites para criaturas
// Ahora genera cuerpos, cabeza, patas (como triángulos si procede), orejas, cola y patrones
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

function lerp(a,b,t){ return a + (b-a)*t; }

export class ModeloAnimal {
  constructor(specie){
    this.specie = specie;
    this.size = Math.floor((specie.tamaño||1)*28)+18; // rango más grande: 18..46
    this.img = this._generateImage();
  }

  _generateImage(){
    const key = this.specie.nombre;
    if(cache.has(key)) return cache.get(key);
    const s = this.size;
    const canvas = document.createElement('canvas');
    canvas.width = s; canvas.height = s; const ctx = canvas.getContext('2d');
    const h = hashString(key);
    ctx.clearRect(0,0,s,s);

    // parámetros derivados de hash y especie
    const base = (this.specie.base||'creatura').toLowerCase();
    const colorBody = colorFromHash(h,0);
    const colorAccent = colorFromHash(h,8);
    const patternColor = colorFromHash(h,16);
    const bodyType = h % 4; // 0: oval, 1: rect, 2: pear, 3: long
    const headType = (h>>2) % 3; // 0: circle,1:square,2:triangle
    const legStyle = (h>>4) % 3; // 0: triangle (pedido),1: rect,2: simple line
    const legCount = (base==='pollo' || base==='pajaro') ? 2 : ((base==='araña')?8:((base==='insecto')?6:4));
    const hasTail = !['oveja','vaca','cerdo'].includes(base) && ((h>>6)%2===1);
    const hasEars = ['vaca','cerdo','oveja','conejo','zorro','lobo','ciervo','tigre','jaguar'].includes(base) || ((h>>7)%2===1);

    // escalas
    const bodyW = Math.floor(s * lerp(0.45,0.75, (h%100)/100));
    const bodyH = Math.floor(s * lerp(0.25,0.55, ((h>>8)%100)/100));
    const bodyX = (s - bodyW)/2;
    const bodyY = s - bodyH - Math.floor(s*0.12);

    // dibujar sombra
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(s/2, s-4, bodyW*0.55, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // cuerpo según tipo
    ctx.fillStyle = colorBody;
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;

    if(bodyType===0){ // oval
      ctx.beginPath(); ctx.ellipse(bodyX+bodyW/2, bodyY+bodyH/2, bodyW/2, bodyH/2, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    } else if(bodyType===1){ // rect redondeado
      const r = Math.max(2, Math.floor(bodyH*0.25));
      roundRect(ctx, bodyX, bodyY, bodyW, bodyH, r, true, true);
    } else if(bodyType===2){ // forma pera (cuerpo más ancho atrás)
      ctx.beginPath();
      ctx.ellipse(bodyX + bodyW*0.45, bodyY+bodyH/2, bodyW*0.45, bodyH/2, 0, 0, Math.PI*2);
      ctx.ellipse(bodyX + bodyW*0.68, bodyY+bodyH*0.45, bodyW*0.32, bodyH*0.4, 0, 0, Math.PI*2);
      ctx.fill(); ctx.stroke();
    } else { // largo tipo reptil
      ctx.beginPath();
      roundRect(ctx, bodyX, bodyY+Math.floor(bodyH*0.15), bodyW, Math.floor(bodyH*0.7), Math.max(2,Math.floor(bodyH*0.2)), true, true);
    }

    // cabeza
    const headR = Math.max(4, Math.floor(s*0.12 * lerp(0.8,1.2, ((h>>10)%100)/100)));
    let headCX = bodyX + Math.floor(bodyW*0.75);
    let headCY = bodyY + Math.floor(bodyH*0.25);
    if(base==='pez' || base==='tortuga') { headCX = bodyX + Math.floor(bodyW*0.5); headCY = bodyY + Math.floor(bodyH*0.15); }

    ctx.fillStyle = colorAccent;
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    if(headType===0){ // circular
      ctx.beginPath(); ctx.arc(headCX, headCY, headR, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    } else if(headType===1){ // cuadrada
      roundRect(ctx, headCX-headR, headCY-headR, headR*2, headR*2, Math.max(2,Math.floor(headR*0.3)), true, true);
    } else { // triangular
      ctx.beginPath(); ctx.moveTo(headCX, headCY-headR); ctx.lineTo(headCX-headR, headCY+headR); ctx.lineTo(headCX+headR, headCY+headR); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // ojos (simple)
    ctx.fillStyle = '#000';
    const eyeOffsetX = Math.max(2, Math.floor(headR*0.35));
    const eyeY = headCY - Math.floor(headR*0.2);
    ctx.beginPath(); ctx.arc(headCX - eyeOffsetX, eyeY, Math.max(1,Math.floor(headR*0.16)), 0, Math.PI*2); ctx.fill();
    if(base!=='serpiente') { ctx.beginPath(); ctx.arc(headCX + eyeOffsetX, eyeY, Math.max(1,Math.floor(headR*0.16)), 0, Math.PI*2); ctx.fill(); }

    // orejas/cuernos si aplica
    if(hasEars){
      ctx.fillStyle = colorAccent;
      const earW = Math.max(2, Math.floor(headR*0.5));
      const earH = Math.max(3, Math.floor(headR*0.8));
      ctx.beginPath(); ctx.moveTo(headCX-headR+2, headCY-headR/2); ctx.lineTo(headCX-headR+2-earW, headCY-headR/2 - earH); ctx.lineTo(headCX-headR+6, headCY-headR/2 + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(headCX+headR-2, headCY-headR/2); ctx.lineTo(headCX+headR-2+earW, headCY-headR/2 - earH); ctx.lineTo(headCX+headR-6, headCY-headR/2 + 2); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // cola si aplica
    if(hasTail){
      ctx.save();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = Math.max(2, Math.floor(s*0.035));
      ctx.beginPath();
      const tx0 = bodyX + bodyW - Math.floor(bodyW*0.08);
      const ty0 = bodyY + Math.floor(bodyH*0.55);
      ctx.moveTo(tx0, ty0);
      ctx.quadraticCurveTo(tx0 + Math.floor(bodyW*0.25), ty0 - Math.floor(bodyH*0.3), tx0 + Math.floor(bodyW*0.45), ty0 - Math.floor(bodyH*0.05));
      ctx.stroke();
      ctx.restore();
    }

    // patas: triangulos (por petición) o rectas/lineas
    const legW = Math.max(3, Math.floor(s*0.06));
    const legH = Math.max(6, Math.floor(s*0.12));
    const spacing = bodyW / (Math.max(legCount,2)+1);
    ctx.fillStyle = colorAccent;
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    for(let i=0;i<legCount;i++){
      const lx = bodyX + spacing*(i+1);
      const ly = bodyY + bodyH;
      if(legStyle===0 || base==='humano' || base==='pollo'){
        // triángulo con punta abajo ("patas triangulares")
        ctx.beginPath();
        ctx.moveTo(lx - legW, ly);
        ctx.lineTo(lx + legW, ly);
        ctx.lineTo(lx, ly + legH);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else if(legStyle===1){
        roundRect(ctx, lx - legW, ly, legW*2, legH, Math.max(1,Math.floor(legW*0.4)), true, true);
      } else {
        // simple línea
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly+legH); ctx.stroke();
        ctx.fillRect(lx-2, ly+legH-2, 4, 4);
      }
    }

    // patrón: manchas o franjas
    if((h>>12)%2===0){
      // manchas
      ctx.fillStyle = patternColor;
      for(let i=0;i<3;i++){
        const pw = Math.max(3, Math.floor(bodyW*0.12*(1 - i*0.2)));
        const ph = Math.max(2, Math.floor(bodyH*0.1*(1 - i*0.1)));
        const px = bodyX + Math.floor(Math.random()* (bodyW - pw));
        const py = bodyY + Math.floor(Math.random()* (bodyH - ph));
        ctx.beginPath(); ctx.ellipse(px+pw/2, py+ph/2, pw/2, ph/2, 0, 0, Math.PI*2); ctx.fill();
      }
    } else {
      // franjas
      ctx.fillStyle = patternColor;
      const stripes = 2 + (h%3);
      for(let i=0;i<stripes;i++){
        const sxp = bodyX + i*(bodyW/stripes);
        ctx.fillRect(sxp, bodyY + Math.floor(bodyH*0.05), Math.max(3,Math.floor(bodyW/stripes*0.25)), Math.floor(bodyH*0.9));
      }
    }

    // pequeño detalle: boca
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    if(base==='serpiente'){
      ctx.fillRect(headCX - Math.floor(headR*0.4), headCY + Math.floor(headR*0.35), Math.floor(headR*0.8), 1);
    } else {
      ctx.fillRect(headCX - Math.floor(headR*0.3), headCY + Math.floor(headR*0.4), Math.floor(headR*0.6), 1);
    }

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
