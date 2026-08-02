import { RECURSOS } from '../mundo/recursos.js';

// Generar ~200 recetas programáticamente
const categorias = ['herramienta','arma','ropa','comida','estructura','util'];
const recetas = [];
let id=1;
for(const cat of categorias){
  for(let i=0;i<Math.floor(200 / categorias.length);i++){
    const name = `${cat}-${i+1}`;
    // seleccionar 2-4 insumos
    const inputs = {};
    const nIn = 2 + Math.floor(Math.random()*3);
    for(let j=0;j<nIn;j++){
      const r = RECURSOS[Math.floor(Math.random()*RECURSOS.length)];
      inputs[r] = (inputs[r]||0) + (1 + Math.floor(Math.random()*3));
    }
    const outputs = {};
    outputs[`${cat}-item`] = 1;
    recetas.push({id:id++,categoria:cat,nombre:name,inputs,outputs});
  }
}

export const RECETAS = recetas;
