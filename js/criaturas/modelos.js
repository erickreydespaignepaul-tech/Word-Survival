// Modelos generados por codigo para criaturas
export class ModeloAnimal {
 constructor(tipo){
  this.tipo=tipo;
 }
 dibujar(ctx,x,y,animacion=0){
  const salto=Math.sin(animacion*5)*3;
  ctx.save();
  ctx.translate(x,y+salto);

  // cuerpo
  ctx.fillStyle=this.color();
  ctx.fillRect(-18,-12,36,22);

  // cabeza
  ctx.beginPath();
  ctx.arc(22,-10,12,0,Math.PI*2);
  ctx.fill();

  // patas animadas
  ctx.fillRect(-12,10+salto,6,14);
  ctx.fillRect(8,10-salto,6,14);

  // ojos
  ctx.fillStyle='#000';
  ctx.fillRect(25,-14,3,3);
  ctx.restore();
 }
 color(){
  const colores={vaca:'#fff',cerdo:'#f5a6a6',oveja:'#ddd',pollo:'#e8d35b',lobo:'#777',zorro:'#d86b22',caballo:'#75451f',oso:'#4b3020'};
  return colores[this.tipo]||'#999';
 }
}
