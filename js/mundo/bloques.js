export const BLOQUES={AGUA:'agua',HIERBA:'hierba',TIERRA:'tierra',ROCA:'roca',ARBOL:'arbol'};
export const tipoDesdeSemilla=s=>s<.12?BLOQUES.AGUA:s>.97?BLOQUES.ARBOL:s>.91?BLOQUES.ROCA:s>.76?BLOQUES.TIERRA:BLOQUES.HIERBA;
const colores={agua:'#3889cf',hierba:'#65ad57',tierra:'#9a6940',roca:'#737875',arbol:'#65ad57'};
export const colorBloque=t=>colores[t];
export function detalleBloque(ctx,t,x,y,tamano,semilla){ if(t==='agua'||t==='hierba'||t==='tierra'){ctx.fillStyle=t==='agua'?'#74b7e3':t==='hierba'?'#82c66c':'#b98250';for(let i=0;i<5;i++){const n=((semilla*999+i*31)%1);ctx.fillRect(x+3+n*(tamano-6),y+3+((n*7)%1)*(tamano-6),2,2);}} }
