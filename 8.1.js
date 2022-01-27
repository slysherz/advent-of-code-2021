const fs = require('fs')

const data = fs.readFileSync('input15.txt', 'utf-8')

let sum = 0
for (const line of data.split('\r\n')) {
    const [_, left, right] = line.match(/(.*) \| (.*)/)
    const codes = right.split(' ')

    for (const code of codes) {
        if ([2, 4, 3, 7].includes(code.length)) {
            sum++
        }
    }
}