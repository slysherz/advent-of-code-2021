const fs = require('fs')

const charA = 'a'.charCodeAt(0)
const char0 = '0'.charCodeAt(0)
const data = fs.readFileSync('input16.txt', 'utf-8')
const numbers = [
    'abcefg', // 0
    'cf', // 1
    'acdeg', // 2
    'acdfg', // 3
    'bcdf', // 4
    'abdfg', // 5
    'abdefg', // 6
    'acf', // 7
    'abcdefg', // 8
    'abcdfg' // 9
]

function permutations(arr = []) {
    if (arr.length === 1) {
        return [arr]
    }

    let result = []
    for (let i = 0; i < arr.length; i++) {
        const others = [...arr.slice(0, i), ...arr.slice(i + 1)]
        for (const p of permutations(others)) {
            result.push([arr[i], ...p])
        }
    }

    return result
}

const possibilities = permutations('abcdefg'.split(''))

function applyPermutation(code = 'abc...', permutation = ['a', 'b', '...']) {
    return code
        .split('')
        .map(l => permutation[l.charCodeAt(0) - charA])
        .sort()
        .join('')
}

function equals(arr1, arr2) {
    console.assert(arr1.length === arr2.length)

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    return true
}

function findPermutation(ex) {
    const examples = ex.map(code => code.split('').sort().join('')).sort()

    for (const p of possibilities) {
        let perm = numbers.map(n => applyPermutation(n, p))
        perm.sort()

        if (equals(examples, perm)) {
            return p
        }
    }
}

function invertPermutation(perm) {
    let result = []

    perm.forEach((l, i) => {
        const j = l.charCodeAt(0) - charA
        result[j] = String.fromCharCode(i + charA)
    })

    return result
}

let sum = 0
for (const line of data.trim().split('\r\n')) {
    const [_, left, right] = line.match(/(.*) \| (.*)/)
    const example = left.split(' ')

    const perm = findPermutation(example)
    const revPerm = invertPermutation(perm)

    const codes = right.split(' ')
    const digits = codes.map(code => numbers.indexOf(applyPermutation(code, revPerm)))

    const number = parseInt(digits.map(d => String.fromCharCode(char0 + d)).join(''))
    sum += number
}

console.log(sum)