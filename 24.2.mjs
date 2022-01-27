import {
    readFileSync
} from 'fs'
import {
    identity,
    makeArray
} from './helpers.mjs'

const data = readFileSync('input24.txt', 'utf-8')
const registerSlot = Object.freeze({
    w: 0,
    x: 1,
    y: 2,
    z: 3
})
const instructionCode = Object.freeze({
    add: 0,
    mul: 1,
    div: 2,
    mod: 3,
    eql: 4
})

function parseProgram(data) {
    let program = []
    let currentInp;
    let impNum = 0;
    for (const [_, type, arg1, arg2] of data.matchAll(/(...) (.) ?(.+)?/g)) {
        if (type === 'inp') {
            if (currentInp) program.push(currentInp);

            currentInp = {
                register: arg1,
                ins: [],
                impNum: impNum++
            }
        } else {
            currentInp.ins.push({
                type: instructionCode[type],
                arg1,
                arg2: Object.keys(registerSlot).includes(arg2) ? arg2 : parseInt(arg2)
            })
        }
    }

    program.push(currentInp)

    console.log('Instructions: ', program.reduce((sum, {
        ins
    }) => sum + ins.length + 1, 0))
    return program
}

function execute(program, registers) {
    for (const {
            type,
            arg1,
            arg2: temp
        } of program) {
        const arg2 = typeof (temp) === 'string' ? registers[registerSlot[temp]] : temp;

        switch (type) {
            case instructionCode.add:
                registers[registerSlot[arg1]] = registers[registerSlot[arg1]] + arg2;
                break;
            case instructionCode.mul:
                registers[registerSlot[arg1]] = registers[registerSlot[arg1]] * arg2;
                break;
            case instructionCode.div:
                console.assert(arg2 !== 0)
                console.assert(registers[registerSlot[arg1]] >= 0)
                registers[registerSlot[arg1]] = Math.floor(registers[registerSlot[arg1]] / arg2);
                break;
            case instructionCode.mod:
                console.assert(arg2 !== 0)
                registers[registerSlot[arg1]] = registers[registerSlot[arg1]] % arg2;
                break;
            case instructionCode.eql:
                registers[registerSlot[arg1]] = registers[registerSlot[arg1]] === arg2 ? 1 : 0;
                break;
            default:
                console.assert(false)
        }
    }

    console.assert(!registers.some(n => n >= Number.MAX_SAFE_INTEGER))
    return registers
}

let count = 0
let cache = makeArray(14, _ => ({}))

function findCode(program, [w, x, y, z]) {
    const [{
        register,
        ins,
        impNum
    }, ...rest] = program

    const key = x + ',' + y + ',' + z
    if (cache[rest.length][key]) return false;

    if (rest.length === 10) {
        console.log(count)
        count++
    }

    for (let j = 1; j < 10; j++) {
        let registers = [j, x, y, z]

        execute(ins, registers)

        if (rest.length === 0) {
            if (registers[registerSlot.z] === 0) return j
        } else {
            let result = findCode(rest, registers)
            if (result) {
                return j * Math.pow(10, rest.length) + result
            }
        }
    }

    cache[rest.length][key] = true
    return false
}

console.log('RESULT: ', findCode(parseProgram(data), makeArray(4, 0)))