import {
    identity,
    makeArray,
    clone
} from './helpers.mjs'

const letters = 'ABCD'
const forbiddenSpaces = [2, 4, 6, 8]
const allowedSpaces = makeArray(10, identity)
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
        ['A', 'C'],
        ['D', 'D'],
        ['C', 'B'],
        ['A', 'B']
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

    const rs = roomSpace(room)
    const min = Math.min(rs, space)
    const max = Math.max(rs, space)

    return state.spaces.every((l, s) => !l || s < min || s > max)
}

function roomReacheable(state, room, space) {
    const letter = state.spaces[space]

    if (!letter) {
        return false
    }

    const r = letterRoom(letter)
    if (room !== r) {
        return false
    }

    const [t, b] = state.rooms[room]
    if (t || (b && b !== letter)) {
        return false
    }

    const roomSpace = 2 + room * 2
    const min = Math.min(roomSpace, space + 1)
    const max = Math.max(roomSpace, space - 1)

    return state.spaces.every((l, s) => !l || s < min || s > max)
}

function isGoal(state) {
    return state.rooms.every(([t, b], i) => t === letters[i] && b === letters[i])
}

function letterRoom(letter) {
    return letter.charCodeAt(0) - 'A'.charCodeAt(0)
}

function moveIntoRoom(state, room, space) {
    const letter = state.spaces[space]

    let newState = clone(state)
    newState.spaces[space] = null

    let distance = 1 + roomDistanceToSpace(room, space)
    if (!state.rooms[room][1]) {
        distance++
        newState.rooms[room][1] = letter
    } else {
        newState.rooms[room][0] = letter
    }

    newState.score += letterCost[letter] * distance

    newState.history.push(`${letter}${space} v ${room}`)
    newState.scoreLeft = scoreLeft(newState)
    return newState
}

function moveIntoCorridor(state, room, space) {
    const roomID = state.rooms[room][0] ? 0 : 1
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

    state.spaces.forEach((l, s) => {
        if (!l) return;
        const ts = roomSpace(letterRoom(l))

        result += letterCost[l] * (Math.abs(ts - s) + 1)
    });

    state.rooms.forEach((room, r) => {
        room.forEach((l, i) => {
            if (!l) return;
            const tr = letterRoom(l)

            if (tr !== r) {
                const s1 = roomSpace(tr)
                const s2 = roomSpace(r)
                result += letterCost[l] * (Math.abs(s1 - s2) + 2 + i)
            } else if (i === 0 && room[1] !== l) {
                result += letterCost[l] * 5
            }
        });
    });

    return result
}

function findAlternatives(state = start) {
    const answer = 'B2 ^ 3,C1 ^ 5,C5 v 2,D1 ^ 5,B3 v 1,B0 ^ 3,B3 v 1,D3 ^ 7,A3 ^ 9,D7 v 3, D5 v 3,A9 v 0'
    let alternatives = []
    let quickMove = false

    for (let r1 = 0; r1 < state.rooms.length; r1++) {
        if (state.rooms[r1].some(l => l && letterRoom(l) !== r1)) continue;

        for (let r2 = 0; r2 < state.rooms.length; r2++) {
            if (r1 === r2) continue;
            const tl = state.rooms[r2][0] || state.rooms[r2][1]
            if (!tl || letterRoom(tl) !== r1) continue;
            const d = r2 > r1 ? 1 : -1
            const tempSpace = roomSpace(r1) + d

            if (spaceReacheable(state, r2, tempSpace)) {
                const temp = moveIntoCorridor(state, r2, tempSpace)
                const newState = moveIntoRoom(temp, r1, tempSpace)
                alternatives.push(newState)
                quickMove = true
            }
        }
    }

    if (quickMove) {
        return alternatives
    }

    for (let s = 0; s < state.spaces.length; s++) {
        for (let r = 0; r < state.rooms.length; r++) {
            let roomsFound = false
            if (roomReacheable(state, r, s)) {
                const newState = moveIntoRoom(state, r, s)
                alternatives.push(newState)
                roomsFound = true
            }

            if (!roomsFound && spaceReacheable(state, r, s)) {
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
    const alternatives = findAlternatives(first).filter(s => {
        const score = s.score + s.scoreLeft

        const key = stateKey(s)
        if (!visited[key] || visited[key] < s.score) {
            visited[key] = score
            return true
        }
    })
    possibilities = [...alternatives, ...possibilities]

    possibilities.sort((a, b) => a.score + a.scoreLeft - b.score - b.scoreLeft)
    console.log('Min score:', possibilities[0].score)
    let a = 0
}

let c = 0