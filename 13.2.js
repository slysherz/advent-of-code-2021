const fs = require('fs')
const data = fs.readFileSync('input23.txt', 'utf-8')

function makeArray(size, p) {
    return Array.from(Array(size)).map(p)
}

let maxX = 0,
    maxY = 0
for (const [_, tx, ty] of data.matchAll(/([0-9]+),([0-9]+)/g)) {
    maxX = Math.max(maxX, parseInt(tx, 10))
    maxY = Math.max(maxY, parseInt(ty, 10))
}

let dots = makeArray(maxY + 1, _ => makeArray(maxY + 1, _ => 0))

for (const [_, tx, ty] of data.matchAll(/([0-9]+),([0-9]+)/g)) {
    const x = parseInt(tx, 10)
    const y = parseInt(ty, 10)

    dots[y][x] = true
}

for (const [_, axis, pos] of data.matchAll(/fold along (x|y)=([0-9]+)/g)) {
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

    if (axis === 'y') {
        const left = dots.slice(0, i)
        const right = dots.slice(i + 1).reverse()

        let big, small
        if (left.length > right.length) {
            big = left
            small = right
        } else {
            big = right
            small = left
        }

        const lenDiff = big.length - small.length
        dots = big.map((line, i) => {
            if (i < lenDiff) {
                return line
            }

            const otherLine = small[i - lenDiff]

            return line.map((dot, i) => dot | otherLine[i])
        })
    }
}

const letter = [' ', '*']
const result = dots.map(line => line.map(n => letter[n]).join('')).join('\n')

console.log(result)