// Lógica mínima de crafteo: espera que inventario tenga métodos `tiene(recurso,cantidad)`, `quitar(recurso,cantidad)`, `añadir(recurso,cantidad)` o `add`
export function puedeCraftear(inventario, receta){
  for(const [r,c] of Object.entries(receta.inputs)){
    if(!inventario.tiene || !inventario.tiene(r,c)) return false;
  }
  return true;
}

export function craftear(inventario, receta){
  if(!puedeCraftear(inventario, receta)) return false;
  for(const [r,c] of Object.entries(receta.inputs)){
    if(inventario.quitar) inventario.quitar(r,c); else if(inventario.remove) inventario.remove(r,c);
  }
  for(const [r,c] of Object.entries(receta.outputs)){
    if(inventario.añadir) inventario.añadir(r,c); else if(inventario.add) inventario.add(r,c);
  }
  return true;
}
