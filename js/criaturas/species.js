// Lista generada de 100 especies (metadata en español)
export const ESPECIES = (()=>{
  const nombresBase=[
    'vaca','cerdo','oveja','pollo','caballo','lobo','zorro','oso','conejo','ciervo',
    'aguila','pez','rana','tortuga','serpiente','abeja','murcielago','jaguar','tigre','dragon'
  ];
  const biomasDisponibles=['bosque','sabana','tundra','desierto','jungla','pantano','montana','playa','estepa','taiga'];
  const especies=[];
  for(let i=0;i<100;i++){
    const base=nombresBase[i % nombresBase.length];
    const nombre=`${base}-${i}`;
    const bioma=biomasDisponibles[i % biomasDisponibles.length];
    especies.push({
      id:i,
      nombre,
      base,
      biomasPreferidos:[bioma],
      tamaño:Math.random()*0.8+0.6,
      rareza:Math.floor(Math.random()*4)+1, // 1 comun .. 4 raro
      drops: generateDrops(base)
    });
  }
  return especies;

  function generateDrops(base){
    if(base==='vaca') return [{recurso:'carne',cantidad:3},{recurso:'cuero',cantidad:2}];
    if(base==='cerdo') return [{recurso:'carne',cantidad:2}];
    if(base==='oveja') return [{recurso:'lana',cantidad:3},{recurso:'carne',cantidad:1}];
    if(base==='pollo') return [{recurso:'pollo-crudo',cantidad:1},{recurso:'pluma',cantidad:2}];
    if(base==='caballo') return [{recurso:'cuero',cantidad:2}];
    if(base==='lobo') return [{recurso:'piel',cantidad:1}];
    if(base==='zorro') return [{recurso:'piel',cantidad:1}];
    if(base==='oso') return [{recurso:'carne',cantidad:4},{recurso:'piel',cantidad:2}];
    if(base==='conejo') return [{recurso:'piel',cantidad:1},{recurso:'carne',cantidad:1}];
    if(base==='ciervo') return [{recurso:'carne',cantidad:3},{recurso:'cuerno',cantidad:1}];
    return [{recurso:'carne',cantidad:1}];
  }
})();
