const fs = require('fs')
const data = fs.readFileSync('input20.txt', 'utf-8')
const {
    a
} = JSON.parse(fs.readFileSync('a.txt', 'utf-8'))

function getPos(x, y, width) {
    return y * width + x
}

function get(board, x, y) {
    if (x < 0 || x >= board.width) return board.inf;
    if (y < 0 || y >= board.height) return board.inf;

    return board.data[getPos(x, y, board.width)]
}

function parsePixel(c) {
    return c === '#'
}

function printBoard({
    data,
    width,
    height
}) {
    let result = ''
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            result += data[y * width + x] ? '#' : '.'
        }
        result += '\n'
    }

    console.log(result)
}

let boards = [{
        data: [],
        width: 0,
        height: 0,
        inf: false
    },
    {
        data: [],
        width: 0,
        height: 0,
        inf: false
    }
]

const [algLine, ...boardLines] = data.split(/\n+/g)
let alg = []
for (let i = 0; i < algLine.length; i++) {
    alg.push(parsePixel(algLine[i]))
}

for (const line of boardLines) {
    if (!line) continue;

    boards[0].height++
    boards[0].width = line.length
    for (let i = 0; i < line.length; i++) {
        boards[0].data.push(parsePixel(line[i]))
    }
}

for (let steps = 0; steps < 2; steps++) {
    let b1 = boards[steps % 2]
    let b2 = boards[(steps + 1) % 2]

    b2.data = []
    b2.width = b1.width + 2
    b2.height = b1.height + 2
    b2.inf = alg[0] === true ? !b1.inf : b1.inf

    for (let y = 0; y < b2.height; y++) {
        for (let x = 0; x < b2.width; x++) {
            const x1 = x - 1
            const y1 = y - 1

            let code = 0
            if (get(b1, x1 - 1, y1 - 1)) code |= 1 << 8;
            if (get(b1, x1 + 0, y1 - 1)) code |= 1 << 7;
            if (get(b1, x1 + 1, y1 - 1)) code |= 1 << 6;
            if (get(b1, x1 - 1, y1 + 0)) code |= 1 << 5;
            if (get(b1, x1 + 0, y1 + 0)) code |= 1 << 4;
            if (get(b1, x1 + 1, y1 + 0)) code |= 1 << 3;
            if (get(b1, x1 - 1, y1 + 1)) code |= 1 << 2;
            if (get(b1, x1 + 0, y1 + 1)) code |= 1 << 1;
            if (get(b1, x1 + 1, y1 + 1)) code |= 1 << 0;

            b2.data.push(alg[code])
        }
    }
}

const sum = boards[0].data.reduce((sum, p) => p ? sum + 1 : sum, 0)
console.log(sum)