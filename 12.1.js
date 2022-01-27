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

    for (const option of edges[location]) {
        if (option === 'end') {
            paths++
            continue
        } else if (option.toLowerCase() == option && path.includes(option)) {
            continue
        }

        pathsLeft.push([...path, option])
    }
}

console.log(paths)