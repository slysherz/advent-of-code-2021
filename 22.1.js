const fs = require('fs')
const data = fs.readFileSync('input22.txt', 'utf-8')

function isPointInCuboid([x, y, z], [x1, y1, z1, x2, y2, z2]) {
    console.assert(x1 < x2)
    console.assert(y1 < y2)
    console.assert(z1 < z2)
    return x1 <= x && x <= x2 &&
        y1 <= y && y <= y2 &&
        z1 <= z && z <= z2
}

function isCuboidInCuboid([x2, y2, z2, x3, y3, z3], [x1, y1, z1, x4, y4, z4]) {
    return x1 <= x2 && x3 <= x4 && y1 <= y2 && y3 <= y4 && z1 <= z2 && z3 <= z4
}

function splitAt(cuboid, point) {
    if (!isPointInCuboid(point, cuboid)) {
        return [cuboid]
    }

    const [x1, y1, z1, x2, y2, z2] = cuboid
    const [x, y, z] = point

    const result = [
        [x1, y1, z1, x, y, z],
        [x, y1, z1, x2, y, z],
        [x1, y, z1, x, y2, z],
        [x, y, z1, x2, y2, z],
        [x1, y1, z, x, y, z2],
        [x, y1, z, x2, y, z2],
        [x1, y, z, x, y2, z2],
        [x, y, z, x2, y2, z2],
    ].filter(([x1, y1, z1, x2, y2, z2]) => x2 > x1 && y2 > y1 && z2 > z1)

    console.assert(volume([cuboid]) === volume(result))

    return result
}


function getCorners([x1, y1, z1, x2, y2, z2]) {
    return [
        [x1, y1, z1],
        [x2, y1, z1],
        [x1, y2, z1],
        [x2, y2, z1],
        [x1, y1, z2],
        [x2, y1, z2],
        [x1, y2, z2],
        [x2, y2, z2]
    ]
}

function intersectionPoints([x1, y1, z1, x2, y2, z2], [x3, y3, z3, x4, y4, z4]) {
    const cuboidOverlap = [
        Math.max(x1, x3),
        Math.max(y1, y3),
        Math.max(z1, z3),
        Math.min(x2, x4),
        Math.min(y2, y4),
        Math.min(z2, z4)
    ]

    const [x5, y5, z5, x6, y6, z6] = cuboidOverlap
    if (x5 < x6 && y5 < y6 && z5 < z6) {
        return getCorners(cuboidOverlap)
    }

    return []
}

function splitCuboid(c1, c2) {
    const points = intersectionPoints(c1, c2)

    let cuboids = [c1]

    for (const point of points) {
        let newCuboids = []

        for (const cuboid of cuboids) {
            newCuboids = [...newCuboids, ...splitAt(cuboid, point)]
        }

        cuboids = newCuboids
    }

    let inCuboids = []
    let outCuboids = []

    cuboids.forEach(c => {
        if (isCuboidInCuboid(c, c2)) {
            inCuboids.push(c)
        } else {
            outCuboids.push(c)
        }
    })

    console.assert(volume([c1]) === volume(inCuboids) + volume(outCuboids))

    return {
        inCuboids,
        outCuboids
    }
}

function volume(cuboids) {
    let volume = 0

    for (const [x1, y1, z1, x2, y2, z2] of cuboids) {
        volume += (x2 - x1) * (y2 - y1) * (z2 - z1)
    }

    return volume
}

let onCuboids = []
let offCuboids = [
    [-50, -50, -50, 51, 51, 51]
]

const startVolume = volume(onCuboids) + volume(offCuboids)

for (const [_, state, ...cub] of data.matchAll(/(on|off) x=(.+)\.\.(.+),y=(.+)\.\.(.+),z=(.+)\.\.(.+)/g)) {
    const on = state === 'on'
    const [x1, x2, y1, y2, z1, z2] = cub.map(s => parseInt(s))
    const cuboid = [x1, y1, z1, x2 + 1, y2 + 1, z2 + 1]

    if (state === 'on') {
        let newOffCuboids = []

        offCuboids.forEach(c => {
            const {
                inCuboids,
                outCuboids
            } = splitCuboid(c, cuboid)

            onCuboids = [...onCuboids, ...inCuboids]
            newOffCuboids = [...newOffCuboids, ...outCuboids]
        })

        offCuboids = newOffCuboids
    } else if (state === 'off') {
        let newOnCuboids = []

        onCuboids.forEach(c => {
            const {
                inCuboids,
                outCuboids
            } = splitCuboid(c, cuboid)

            offCuboids = [...offCuboids, ...inCuboids]
            newOnCuboids = [...newOnCuboids, ...outCuboids]
        })

        onCuboids = newOnCuboids
    }

    console.assert(volume(onCuboids) + volume(offCuboids) === startVolume)

    console.log(`on: ${volume(onCuboids)}, off: ${volume(onCuboids)}`)
}

let a = onCuboids.map(c => volume([c]))
console.log(volume(onCuboids))