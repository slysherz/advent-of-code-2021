export function test(params) {}

export function makeArray(size, cbOrValue) {
    return Array.from(Array(size)).map((_, i) =>
        cbOrValue instanceof Function ? cbOrValue(i) : cbOrValue
    )
}

function makeTensorHelper(dimensions, cbOrValue, outerIndices) {
    if (dimensions.length === 0) {
        return cbOrValue instanceof Function ? cbOrValue(outerIndices) : cbOrValue
    }

    const [size, ...rest] = dimensions
    return makeArray(size, i => makeTensorHelper(rest, cbOrValue, [...outerIndices, i]))
}

export function makeTensor(dimensions, cbOrValue) {
    return makeTensorHelper(dimensions, cbOrValue, [])
}

export function identity(value) {
    return value
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function filterIndices(array = [], pred) {
    let result = []

    for (let i = 0; i < array.length; i++) {
        if (pred(array[i], i, array)) {
            result.push(i)
        }
    }

    return result
}