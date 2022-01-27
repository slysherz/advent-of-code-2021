const fs = require('fs')
const data = fs.readFileSync('input18.txt', 'utf-8')

function parseData(data) {
    let stack = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].match(/[0-9]/)) {
            stack.push(parseInt(data[i]))
            continue;
        }

        if (data[i] === ']') {
            const right = stack.pop()
            const left = stack.pop()
            const pair = [left, right]
            stack.push(pair)
        }
    }

    return stack[0]
}

function addLeftmost(tree, val) {
    if (typeof (tree[1]) === 'number') {
        tree[1] += val
        return
    }

    var addTo = tree[1]
    while (addTo[0] instanceof Array) addTo = addTo[0]
    addTo[0] += val
}

function addRightmost(tree, val) {
    if (typeof (tree[0]) === 'number') {
        tree[0] += val
        return
    }

    var addTo = tree[0]
    while (addTo[1] instanceof Array) addTo = addTo[1]
    addTo[1] += val
}

function explode(tree, depth) {
    const [left, right] = tree
    if (depth === 1) {
        if (left instanceof Array) {
            const [lval, rval] = left
            tree[0] = 0
            addLeftmost(tree, rval)
            return {
                left: lval
            }
        } else if (right instanceof Array) {
            const [lval, rval] = right
            addRightmost(tree, lval)
            tree[1] = 0
            return {
                right: rval
            }
        }

        return false
    }

    if (left instanceof Array) {
        const result = explode(left, depth - 1)
        if (result && 'right' in result) {
            addLeftmost(tree, result.right)
            return {}
        }
        if (result) return result
    }

    if (right instanceof Array) {
        const result = explode(right, depth - 1)

        if (result && 'left' in result) {
            addRightmost(tree, result.left)
            return {}
        }
        if (result) return result
    }

    return false
}

function split(tree, depth) {
    for (let i = 0; i < tree.length; i++) {
        const val = tree[i]
        if (typeof (val) === 'number' && val >= 10) {
            tree[i] = [Math.floor(val / 2), Math.ceil(val / 2)]
            return true
        } else if (val instanceof Array) {
            if (split(val, depth - 1)) {
                return true
            }
        }
    }

    return false
}

function reduce(tree) {
    while (true) {
        // console.log(JSON.stringify(tree))
        if (explode(tree, 4)) continue
        if (split(tree, 4)) continue
        break;
    }
}

function magnitude(tree) {
    if (typeof (tree) === 'number') {
        return tree
    }

    const [left, right] = tree
    return 3 * magnitude(left) + 2 * magnitude(right)
}

const numbers = data.split('\r\n')

let max = 0
numbers.forEach((n1, i) => {
    numbers.forEach((n2, j) => {
        if (i === j) return

        let tree = [parseData(n1), parseData(n2)]
        reduce(tree)
        max = Math.max(max, magnitude(tree))
    })
})

console.log(max)

let i = 0