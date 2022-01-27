const fs = require('fs')

const size = 1000
let pipes = Array.from(Array(size)).map(_ => Array.from(Array(size)).map(_ => 0))

const data = fs.readFileSync('input10.txt', 'utf-8')

for (const [_, ...coord] of data.matchAll(/([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/g)) {
    const [sx, sy, ex, ey] = coord.map(n => parseInt(n, 10))
    const diff = Math.max(Math.abs(sy - ey), Math.abs(sx - ex))
    const ix = ex > sx
    const iy = ey > sy

    for (let i = 0; i <= diff; i++) {
        const x = ix ?
            Math.min(sx + i, ex) :
            Math.max(sx - i, ex)
        const y = iy ?
            Math.min(sy + i, ey) :
            Math.max(sy - i, ey)

        pipes[y][x]++
    }
}

let sum = 0
for (let yp of pipes) {
    for (let n of yp) {
        if (n >= 2) sum++;
    }
}

console.log(sum)