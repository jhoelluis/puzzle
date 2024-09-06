const contenedorPuzzle = document.getElementById('puzzle');
const listaMovimientos = document.getElementById('listaMovimientos');
let puzzle = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
];

function dibujar() {
    contenedorPuzzle.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const casilla = document.createElement('div');
            casilla.className = 'tile';
            if (puzzle[i][j] === 0) {
                casilla.classList.add('empty');
            } else {
                casilla.textContent = puzzle[i][j];
                casilla.onclick = () => mover(i, j);
            }
            contenedorPuzzle.appendChild(casilla);
        }
    }
}

function encontrarVacio(tablero) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tablero[i][j] === 0) {
                return [i, j];
            }
        }
    }
}

function mover(i, j) {
    const [vacioI, vacioJ] = encontrarVacio(puzzle);
    if ((Math.abs(i - vacioI) === 1 && j === vacioJ) || (Math.abs(j - vacioJ) === 1 && i === vacioI)) {
        [puzzle[vacioI][vacioJ], puzzle[i][j]] = [puzzle[i][j], puzzle[vacioI][vacioJ]];
        dibujar();
    }
}

function mezclar() {
    for (let i = 0; i < 100; i++) {
        const [vacioI, vacioJ] = encontrarVacio(puzzle);
        const movimientos = [];
        if (vacioI > 0) movimientos.push([vacioI - 1, vacioJ]);
        if (vacioI < 2) movimientos.push([vacioI + 1, vacioJ]);
        if (vacioJ > 0) movimientos.push([vacioI, vacioJ - 1]);
        if (vacioJ < 2) movimientos.push([vacioI, vacioJ + 1]);
        const [nuevoI, nuevoJ] = movimientos[Math.floor(Math.random() * movimientos.length)];
        [puzzle[vacioI][vacioJ], puzzle[nuevoI][nuevoJ]] = [puzzle[nuevoI][nuevoJ], puzzle[vacioI][vacioJ]];
    }
    dibujar();
}

function resolver() {
    const solucion = aStar(puzzle);
    if (solucion) {
        listaMovimientos.innerHTML = '';
        animar(solucion);
    }
}

function animar(solucion) {
    let paso = 0;
    const intervalo = setInterval(() => {
        if (paso >= solucion.length) {
            clearInterval(intervalo);
            return;
        }
        const movimiento = calcularMovimiento(puzzle, solucion[paso]);
        if (movimiento) {
            mostrarMovimiento(movimiento);
        }
        puzzle = solucion[paso];
        dibujar();
        paso++;
    }, 500);
}

function mostrarMovimiento(movimiento) {
    const li = document.createElement('li');
    li.textContent = `Mover ficha ${movimiento.ficha}`;
    listaMovimientos.appendChild(li);
}

function calcularMovimiento(estadoActual, estadoSiguiente) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (estadoActual[i][j] !== estadoSiguiente[i][j] && estadoSiguiente[i][j] !== 0) {
                return {
                    ficha: estadoSiguiente[i][j],
                    origen: [i, j],
                    destino: encontrarVacio(estadoActual)
                };
            }
        }
    }
    return null;
}

function aStar(tableroInicial) {
    const Frontier = [];
    const ExploredSet = new Set();
    const estadoInicial = {
        tablero: tableroInicial.map(fila => fila.slice()),
        padre: null
    };
    Frontier.push(estadoInicial);

    while (Frontier.length > 0) {
        const actual = Frontier.shift();
        if (resuelto(actual.tablero)) {
            const camino = [];
            let temp = actual;
            while (temp) {
                camino.push(temp.tablero);
                temp = temp.padre;
            }
            return camino.reverse();
        }

        ExploredSet.add(JSON.stringify(actual.tablero));

        const vecinos = obtenerVecinos(actual.tablero);
        for (let vecino of vecinos) {
            if (!ExploredSet.has(JSON.stringify(vecino))) {
                Frontier.push({
                    tablero: vecino,
                    padre: actual
                });
            }
        }
    }
    return null;
}

function resuelto(tablero) {
    const objetivo = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]
    ];
    return JSON.stringify(tablero) === JSON.stringify(objetivo);
}

function obtenerVecinos(tablero) {
    const vecinos = [];
    const [vacioI, vacioJ] = encontrarVacio(tablero);
    const direcciones = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (let [di, dj] of direcciones) {
        const nuevoI = vacioI + di;
        const nuevoJ = vacioJ + dj;
        if (nuevoI >= 0 && nuevoI < 3 && nuevoJ >= 0 && nuevoJ < 3) {
            const nuevoTablero = tablero.map(fila => fila.slice());
            [nuevoTablero[vacioI][vacioJ], nuevoTablero[nuevoI][nuevoJ]] = [nuevoTablero[nuevoI][nuevoJ], nuevoTablero[vacioI][vacioJ]];
            vecinos.push(nuevoTablero);
        }
    }
    return vecinos;
}

dibujar();
