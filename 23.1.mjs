import {
    identity,
    makeArray,
    clone
} from './helpers.mjs'

const letters = 'ABCD'
const forbiddenSpaces = [2, 4, 6, 8]
const allowedSpaces = makeArray(11, identity)
const letterCost = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000
}

const start = {
    score: 0,
    spaces: allowedSpaces.map(_ => null),
    rooms: [
        ['A', 'D', 'D', 'C'],
        ['D', 'C', 'B', 'D'],
        ['C', 'B', 'A', 'B'],
        ['A', 'A', 'C', 'B'],
    ],
    history: []
}


/**
 * RULES
 * Don't stop outside a room
 * Don't enter a room unless it's *their* room
 * Can't move in the corridor after stopping there
 */

function roomSpace(room) {
    return 2 + 2 * room
}

function roomDistanceToSpace(room, space) {
    console.assert(!forbiddenSpaces.includes(space))

    return Math.abs(roomSpace(room) - space)
}

function spaceReacheable(state, room, space) {
    if (forbiddenSpaces.includes(space)) {
        return false
    }

    if (!state.rooms[room][state.rooms[room].length - 1]) {
        return false
    }

    const locked = state.rooms[room].every(l => !l || letterRoom(l) === room)
    if (locked) {
        return false
    }

    const rs = roomSpace(room)
    const min = Math.min(rs, space)
    const max = Math.max(rs, space)

    return state.spaces.every((l, s) => !l || s < min || s > max)
}
/*
function spaceReacheable(state, room, space) {
    if (forbiddenSpaces.includes(space)) {
        return false
    }

    const rs = roomSpace(room)
    const min = Math.min(rs, space)
    const max = Math.max(rs, space)

    return state.spaces.every((l, s) => !l || s < min || s > max)
}
*/

function roomReacheable(state, room, space) {
    const letter = state.spaces[space]

    if (!letter) {
        return false
    }

    const r = letterRoom(letter)
    if (room !== r) {
        return false
    }

    if (state.rooms[room].some(l1 => l1 && l1 !== letter)) {
        return false
    }

    const roomSpace = 2 + room * 2
    const min = Math.min(roomSpace, space + 1)
    const max = Math.max(roomSpace, space - 1)

    return state.spaces.every((l, s) => !l || s < min || s > max)
}

function isGoal(state) {
    return state.rooms.every((room, r) => room.every(l => l && letterRoom(l) === r))
}

function letterRoom(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0)
}

function moveIntoRoom(state, room, space) {
    const letter = state.spaces[space]

    let newState = clone(state)
    newState.spaces[space] = null

    let firstLetter = state.rooms[room].findIndex(identity)
    if (firstLetter === -1) firstLetter = state.rooms[room].length

    let distance = roomDistanceToSpace(room, space) + firstLetter
    newState.rooms[room][firstLetter - 1] = letter

    newState.score += letterCost[letter] * distance

    newState.history.push(`${letter}${space} v ${room}`)
    newState.scoreLeft = scoreLeft(newState)
    return newState
}

function moveIntoCorridor(state, room, space) {
    const roomID = state.rooms[room].findIndex(identity)
    const letter = state.rooms[room][roomID]

    let newState = clone(state)
    newState.rooms[room][roomID] = null

    const distance = 1 + roomDistanceToSpace(room, space) + roomID
    newState.spaces[space] = letter

    newState.score += letterCost[letter] * distance

    newState.history.push(`${letter}${room} ^ ${space}`)
    newState.scoreLeft = scoreLeft(newState)
    return newState
}

function scoreLeft(state) {
    let result = 0

    const letters = {
        null: 0,
        A: 0,
        B: 0,
        C: 0,
        D: 0
    }

    state.spaces.forEach((l, s) => {
        letters[l]++

        if (!l) return;
        const ts = roomSpace(letterRoom(l))

        result += letterCost[l] * (Math.abs(ts - s) + 1)
    });

    state.rooms.forEach((room, r) => {
        room.forEach((l, i) => {
            letters[l]++;

            if (!l) return;
            const tr = letterRoom(l)

            if (tr !== r) {
                const s1 = roomSpace(tr)
                const s2 = roomSpace(r)
                result += letterCost[l] * (Math.abs(s1 - s2) + 2 + i)
            } else if (i !== 0 && room.slice(0, i - 1).some(l1 => l1 && l !== l1)) {
                result += letterCost[l] * (i + 2) * 2
            }
        });
    });

    const count = start.rooms[0].length
    console.assert(letters.A === count && letters.B === count && letters.C === count && letters.D === count)
    return result
}

function findAlternatives(state = start) {
    let alternatives = []

    for (let s = 0; s < state.spaces.length; s++) {
        for (let r = 0; r < state.rooms.length; r++) {
            if (roomReacheable(state, r, s)) {
                const newState = moveIntoRoom(state, r, s)
                alternatives.push(newState)
            }

            if (spaceReacheable(state, r, s)) {
                const newState = moveIntoCorridor(state, r, s)
                alternatives.push(newState)
            }
        }
    }

    return alternatives
}

function stateKey(state) {
    return JSON.stringify([state.rooms, state.spaces])
}

let visited = {}
let possibilities = [start]
while (!isGoal(possibilities[0])) {
    const first = possibilities.shift()
    const alternatives = findAlternatives(first).filter(state => {
        const key = stateKey(state)

        if (!visited[key] || visited[key].score > state.score) {
            visited[key] = {
                score: state.score,
                scoreLeft: state.scoreLeft
            }
            return true
        }
    })
    possibilities = [...alternatives, ...possibilities]

    possibilities.sort((a, b) => a.score + a.scoreLeft - b.score - b.scoreLeft)
    console.log('Min score:', possibilities[0].score + possibilities[0].scoreLeft)
    let a = 0
}

let c = 0