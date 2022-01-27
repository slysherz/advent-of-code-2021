const fs = require('fs')
const data = fs.readFileSync('input14.txt', 'utf-8')

const pairs = {}
for (const [_, l1, l2, mid] of data.matchAll(/([A-Z])([A-Z]) -> ([A-Z])/g)) {
    pairs[l1 + l2] = mid
}

function objAdd(a, b) {
    Object.keys(b).forEach(key => a[key] = (a[key] || 0) + b[key])
}

let cache = {}

function expand(template, levels) {
    if (levels === 0) {
        let result = {}

        template.forEach(c => result[c] = (result[c] || 0) + 1)
        return result
    }

    const cacheKey = template.join('') + levels
    if (cacheKey in cache) {
        return cache[cacheKey]
    }

    let result = {}
    for (let i = 0; i < template.length - 1; i++) {
        const pair = template[i] + template[i + 1]
        if (pairs[pair]) {
            objAdd(result, expand([template[i], pairs[pair], template[i + 1]], levels - 1))
        } else {
            result[template[i]] = (result[template[i]] || 0) + 1
        }

        if (i !== 0) {
            result[template[i]]--
        }
    }

    cache[cacheKey] = result
    return result
}

const result = expand(data.split('\r\n')[0].split(''), 40)

console.log(result, Math.max(...Object.values(result)) - Math.min(...Object.values(result)))