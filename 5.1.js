const fs = require('fs')

const size = 1000
let pipes = Array.from(Array(size))
    .map(_ => Array.from(Array(size)).map(_ => 0))

const data = fs.readFileSync('input9.txt', 'utf-8')

for (const [_, ...coord] of data.matchAll(/([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/g)) {
    const [sx, sy, ex, ey] = coord.map(n => parseInt(n, 10))

    if (sx === ex) {
        const ly = Math.min(sy, ey)
        const gy = Math.max(sy, ey)
        for (let y = ly; y <= gy; y++) {
            pipes[y][sx]++
        }
    } else if (sy === ey) {
        const lx = Math.min(sx, ex)
        const gx = Math.max(sx, ex)
        for (let x = lx; x <= gx; x++) {
            pipes[sy][x]++
        }
    }
}

let sum = 0
for (let yp of pipes) {
    for (let n of yp) {
        if (n >= 2) sum++;
    }
}

console.log(sum)