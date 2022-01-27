const fs = require('fs')
const data = fs.readFileSync('input19.txt', 'utf-8')

const minMatches = 12

let scanners = []

for (const scanInput of data.split('--- scanner')) {
    if (!scanInput) continue;

    let scanner = []
    for (const [_, x, y, z] of scanInput.matchAll(/(.+),(.+),(.+)/g)) {
        scanner.push([x, y, z].map(n => parseInt(n)))
    }

    scanners.push(scanner)
}

const pointSub = ([x1, y1, z1], [x2, y2, z2]) => [x1 - x2, y1 - y2, z1 - z2]
const pointAdd = ([x1, y1, z1], [x2, y2, z2]) => [x1 + x2, y1 + y2, z1 + z2]
const pointMag = ([x, y, z]) => Math.sqrt(x * x + y * y + z * z)
const pointEq = ([x1, y1, z1], [x2, y2, z2]) => x1 === x2 && y1 === y2 && z1 === z2
const pointRotFront = ([a, b, c]) => [-b, a, c]
const pointRotLeft = ([a, b, c]) => [a, -c, b]
const pointStr = p => p.join()

function manhattanDist(p1, p2) {
    return p1.reduce((s, n, i) => s + Math.abs(n - p2[i]), 0)
}


let temp = [1, 2, 3]
let axes = []
while (axes.length < 48) {
    if (axes.length === 24) {
        temp = [1, 2, -3]
    }
    temp = Math.random() < 0.5 ? pointRotFront(temp) : pointRotLeft(temp)

    if (!axes.find(p => pointEq(p, temp))) {
        axes.push(temp)
    }
}


function rotate(values, axis) {
    let result = values.map(p => {
        return axis.map(i => i < 0 ? -p[-i - 1] : p[i - 1])
    })

    return result
}

let maxHits = 0

function match(scanner1, temp) {
    scanner1.sort(([x1], [x2]) => x2 - x1)
    for (const axis of axes) {
        let scanner2 = rotate(temp, axis)
        scanner2.sort(([x1], [x2]) => x2 - x1)
        let hash = scanner2.map(pointStr).reduce((o, k) => (o[k] = true, o), {})

        for (const pa of scanner1) {
            for (const pb of scanner2) {
                const diff = pointSub(pb, pa)
                let hits = 0

                for (const p1 of scanner1) {
                    const p2 = pointAdd(diff, p1)
                    const key = pointStr(p2)

                    if (p2.some(n => Math.abs(n) > 1000)) {
                        continue
                    }

                    if (!(key in hash)) {
                        maxHits = Math.max(maxHits, hits)
                        break
                    }

                    hits++

                    if (hits >= minMatches) {
                        console.log(scanners.length)
                        return {
                            diff,
                            points: scanner2.map(p => pointSub(p, diff))
                        }
                    }
                }
            }
        }
    }
}

let scannerPos = scanners.map(_ => [
    [0, 0, 0]
])

function findMatch() {
    for (let i = 0; i < scanners.length - 1; i++) {
        for (let j = i + 1; j < scanners.length; j++) {
            const res = match(scanners[i], scanners[j])

            if (res) {
                for (const point of res.points) {
                    if (scanners[i].findIndex(p => pointEq(point, p)) === -1) {
                        scanners[i].push(point)
                    }
                }

                scanners = scanners.filter((_, i) => i !== j)

                for (const pos of scannerPos[j]) {
                    scannerPos[i].push(pointSub(pos, res.diff))
                }

                scannerPos = scannerPos.filter((_, i) => i !== j)

                return true
            }
        }
    }
}

while (scanners.length > 1 && findMatch());

let maxDist = 0
for (const s1 of scannerPos[0]) {
    for (const s2 of scannerPos[0]) {
        maxDist = Math.max(maxDist, manhattanDist(s1, s2))
    }
}

console.log(maxDist)