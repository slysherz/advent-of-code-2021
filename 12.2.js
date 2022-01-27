const fs = require('fs')
const data = fs.readFileSync('input22.txt', 'utf-8')

const edges = {}
for (const line of data.split('\r\n')) {
    const [_, from, to] = line.match(/([a-zA-Z]+)-([a-zA-Z]+)/)

    if (!edges[from]) {
        edges[from] = []
    }

    if (!edges[to]) {
        edges[to] = []
    }

    edges[from].push(to)
    edges[to].push(from)
}

let paths = 0
let pathsLeft = [
    ['start']
]

while (pathsLeft.length) {
    let path = pathsLeft.pop()
    const location = path[path.length - 1]

    for (const next of edges[location]) {
        if (next === 'end') {
            paths++
            // console.log(path.join(','))
            continue
        } else if (next === 'start') {
            continue
        }

        if (next.toLowerCase() === next) {
            if (path.filter(n => n === next).length === 2) {
                continue
            }

            const repeatedSideCavern = path.find(
                (item, index) => item.toLowerCase() === item && path.indexOf(item) !== index
            )

            if (repeatedSideCavern && path.includes(next)) {
                continue
            }
        }

        pathsLeft.push([...path, next])
    }
}

console.log(paths)