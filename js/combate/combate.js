// Sistema de combate: golpear bloques (árbol/roca)
export class Combate {
  constructor() {
    this.dañoBase = 25; // daño por golpe
  }

  atacar(atacante, mundo) {
    // atacante: instancia Jugador con posicion {x,y} y direccion ('arriba','abajo','izquierda','derecha')
    // mundo: instancia Mundo (para acceder a tile size y chunks)
    if (!atacante || !mundo || !mundo.tamanoTile) return;

    const t = mundo.tamanoTile;
    // vector de dirección en tiles según la orientación del jugador
    const dir = { x: 0, y: 0 };
    if (atacante.direccion === 'arriba') dir.y = -1;
    else if (atacante.direccion === 'abajo') dir.y = 1;
    else if (atacante.direccion === 'izquierda') dir.x = -1;
    else if (atacante.direccion === 'derecha') dir.x = 1;

    // Si no hay dirección (quieto), golpea la tile sobre la que está el jugador
    const centroX = atacante.posicion.x;
    const centroY = atacante.posicion.y;

    const targetTileX = Math.floor((centroX + dir.x * t) / t);
    const targetTileY = Math.floor((centroY + dir.y * t) / t);

    mundo.chunks.damageBloque(targetTileX, targetTileY, this.dañoBase);
    console.log(`Golpeado bloque en (${targetTileX}, ${targetTileY}) con ${this.dañoBase} daño.`);
  }
}
