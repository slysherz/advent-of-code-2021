const fs = require('fs')
const data = fs.readFileSync('input14.txt', 'utf-8')

let template = data.split('\r\n')[0].split('')
for (let j = 0; j < 40; j++) {
    let newTemplate = []

    template.forEach((l, i) => {
        newTemplate.push(l)

        for (const [_, l1, l2, mid] of data.matchAll(/([A-Z])([A-Z]) -> ([A-Z])/g)) {
            if (l === l1 && template[i + 1] === l2) {
                newTemplate.push(mid)
            }
        }
    })

    template = newTemplate
}

let result = template.reduce((res, l) => {
    res[l] = (res[l] || 0) + 1
    return res
}, {})

console.log(Math.max(...Object.values(result)) - Math.min(...Object.values(result)))