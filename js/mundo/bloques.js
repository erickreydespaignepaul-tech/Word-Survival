export const BLOQUES={AGUA:'agua',HIERBA:'hierba',TIERRA:'tierra',ROCA:'roca',ARBOL:'arbol',HIERRO:'hierro',CARBON:'carbon'};

export const BIOMAS={
 BOSQUE:'bosque',
 DESIERTO:'desierto',
 NIEVE:'nieve',
 MONTAÑA:'montana',
 PANTANO:'pantano'
};

export const tipoDesdeSemilla=s=>{
 if(s<.12)return BLOQUES.AGUA;
 if(s>.985)return BLOQUES.HIERRO;
 if(s>.97)return BLOQUES.ARBOL;
 if(s>.91)return BLOQUES.ROCA;
 if(s>.88)return BLOQUES.CARBON;
 return BLOQUES.HIERBA;
};

const colores={agua:'#3889cf',hierba:'#65ad57',tierra:'#9a6940',roca:'#737875',arbol:'#65ad57',hierro:'#b7b7b7',carbon:'#333'};
export const colorBloque=t=>colores[t];

export function detalleBloque(ctx,t,x,y,tamano,semilla){
 if(t==='agua'||t==='hierba'||t==='tierra'){
  ctx.fillStyle=t==='agua'?'#74b7e3':t==='hierba'?'#82c66c':'#b98250';
  for(let i=0;i<5;i++)ctx.fillRect(x+(i*7)%tamano,y+(semilla*i)%tamano,2,2);
 }
}
