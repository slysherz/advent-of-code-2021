const fs = require('fs')

const data = fs.readFileSync('input14.txt', 'utf-8')

let bestPos = 0
let bestFuel = Infinity
for (let i = 0; i < 1000; i++) {
    let fuel = 0
    for (const [_, number] of data.matchAll(/([0-9]+),?/g)) {
        const n = parseInt(number, 10)
        const distance = Math.abs(n - i)

        fuel += distance * (1 + distance) / 2
    }

    if (fuel < bestFuel) {
        bestFuel = fuel
        bestPos = i
    }
}