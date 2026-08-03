// recetas fijas y coherentes para crafteo
export const RECETAS = [
  { id: 1, nombre: 'hacha-madera', categoria: 'herramienta', inputs: { 'madera': 3, 'piedra': 1 }, outputs: { 'hacha-madera': 1 } },
  { id: 2, nombre: 'mesa-crafting', categoria: 'estructura', inputs: { 'madera': 4 }, outputs: { 'mesa-crafting': 1 } },
  { id: 3, nombre: 'espada-piedra', categoria: 'arma', inputs: { 'piedra': 2, 'madera': 1 }, outputs: { 'espada-piedra': 1 } },
  { id: 4, nombre: 'pan', categoria: 'comida', inputs: { 'semilla': 3 }, outputs: { 'pan': 1 } },
  { id: 5, nombre: 'armadura-cuero', categoria: 'ropa', inputs: { 'cuero': 5 }, outputs: { 'armadura-cuero': 1 } },
  { id: 6, nombre: 'antorcha', categoria: 'util', inputs: { 'madera': 1, 'carbon': 1 }, outputs: { 'antorcha': 4 } },
  { id: 7, nombre: 'hoja-afilada', categoria: 'herramienta', inputs: { 'hierro': 2, 'piedra': 1 }, outputs: { 'hoja-afilada': 1 } },
  { id: 8, nombre: 'cuna-semillero', categoria: 'estructura', inputs: { 'madera': 2, 'semilla': 5 }, outputs: { 'semillero': 1 } }
];
