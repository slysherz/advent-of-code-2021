const fs = require('fs')
const data = fs.readFileSync('input23.txt', 'utf-8')

function makeArray(size, p) {
    return Array.from(Array(size)).map(p)
}

const size = 2000
let dots = makeArray(size, _ => makeArray(size, _ => 0))

for (const [_, tx, ty] of data.matchAll(/([0-9]+),([0-9]+)/g)) {
    const x = parseInt(tx, 10)
    const y = parseInt(ty, 10)

    dots[y][x] = true
}

const [_, axis, pos] = data.match(/fold along (x|y)=([0-9]+)/)
const i = parseInt(pos, 10)

if (axis === 'x') {
    dots = dots.map(line => {
        const left = line.slice(0, i)
        const right = line.slice(i + 1).reverse()

        let big, small
        if (left.length > right.length) {
            big = left
            small = right
        } else {
            big = right
            small = left
        }

        const lenDiff = big.length - small.length
        return big.map((dot, i) => i < lenDiff ? dot : dot | small[i - lenDiff])
    })
}

const sum = dots.reduce((sum, line) => line.reduce((sum, v) => sum + v, sum), 0)