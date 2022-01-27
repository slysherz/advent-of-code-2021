const fs = require('fs')

const days = 80
const size = 10

let fish = Array.from(Array(size)).map(_ => 0)

const data = fs.readFileSync('input11.txt', 'utf-8')

for (const [_, number] of data.matchAll(/([0-9]+),?/g)) {
    const n = parseInt(number, 10)

    fish[n]++
}

for (let i = 0; i < days; i++) {
    let newFish = Array.from(Array(size)).map(_ => 0)

    fish.forEach((n, i) => {
        if (i === 0) {
            newFish[8] = n
            newFish[6] = n
        } else {
            newFish[i - 1] += n
        }
    })

    fish = newFish
}

console.log(fish.reduce((sum, n) => sum + n, 0))