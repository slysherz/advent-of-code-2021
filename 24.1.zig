const std = @import("std");
const data = @embedFile("input24.txt");

const Instruction = struct {
    itype: Type,
    arg1: i32,
    arg2: i32,

    const Type = enum {
        INP,
        ADD,
        MUL,
        DIV,
        MOD,
        EQL,
        ADDC,
        MULC,
        DIVC,
        MODC,
        EQLC,
    };
};

fn isDigit(char: u8) bool {
    return char >= '0' and char <= '9';
}

fn inputCode(input: []i32) i64 {
    var i: usize = 0;
    var result: i64 = 0;
    while (i < input.len) : (i += 1) {
        result = result * 10 + input[i];
    }

    return result;
}

pub fn execute(program: std.ArrayList(Instruction), input: []i32) bool {
    const result = findCode(program, input, 0);
    std.debug.print("{d}\n", .{ result });

    var registers = [_]i32{0} ** 4;
    var i: usize = 0;

    for (program.items) |ins| {
        if (ins.itype == Instruction.Type.INP) {
            i += 1;
        }

        registers[@intCast(usize, ins.arg1)] = switch (ins.itype) {
            Instruction.Type.INP => input[i],
            Instruction.Type.ADD => registers[@intCast(usize, ins.arg1)] + registers[@intCast(usize, ins.arg2)],
            Instruction.Type.MUL => registers[@intCast(usize, ins.arg1)] * registers[@intCast(usize, ins.arg2)],
            Instruction.Type.DIV => @divTrunc(registers[@intCast(usize, ins.arg1)], registers[@intCast(usize, ins.arg2)]),
            Instruction.Type.MOD => @mod(registers[@intCast(usize, ins.arg1)], registers[@intCast(usize, ins.arg2)]),
            Instruction.Type.EQL => if (registers[@intCast(usize, ins.arg1)] == registers[@intCast(usize, ins.arg2)])
                @intCast(i32, 1)
            else
                @intCast(i32, 0),

            Instruction.Type.ADDC => registers[@intCast(usize, ins.arg1)] + ins.arg2,
            Instruction.Type.MULC => registers[@intCast(usize, ins.arg1)] * ins.arg2,
            Instruction.Type.DIVC => @divTrunc(registers[@intCast(usize, ins.arg1)], ins.arg2),
            Instruction.Type.MODC => @mod(registers[@intCast(usize, ins.arg1)], ins.arg2),
            Instruction.Type.EQLC => if (registers[@intCast(usize, ins.arg1)] == ins.arg2)
                @intCast(i32, 1)
            else
                @intCast(i32, 0),
        };
    }

    if (registers[3] == 0) {
        std.debug.print(" YES!\n", .{});
        return true;
    }

    std.debug.print(" no\n", .{});
    return false;
}

fn findCode(program: std.ArrayList(Instruction), input: []i32, i: usize) i64 {
    if (i == 14) {
        if (execute(program, input)) {
            return inputCode(input);
        }

        return 0;
    }

    var j: i32 = 9;
    while (j > 0) : (j -= 1) {
        input[i] = j;
        const code = findCode(program, input, i + 1);
        if (code != 0) {
            return code;
        }
    }

    return 0;
}

pub fn main() !void {
    std.debug.print("hello\nhello\nhello\nhello\n", .{  });

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    var alloc = gpa.allocator();

    var program = std.ArrayList(Instruction).init(alloc);
    var it = std.mem.tokenize(u8, data, "\r\n");

    while (it.next()) |line| { _ = line;
        var ins = Instruction {
            .itype = Instruction.Type.ADD,
            .arg1 = 0,
            .arg2 = 0
        };
        _ = ins;

        ins.itype = switch (line[0..3]) {
            "inp" => Instruction.Type.INP,
            "add" => if (isDigit(line[6])) Instruction.Type.ADDC else Instruction.Type.ADD,
            "mul" => if (isDigit(line[6])) Instruction.Type.MULC else Instruction.Type.MUL,
            "div" => if (isDigit(line[6])) Instruction.Type.DIVC else Instruction.Type.DIV,
            "mod" => if (isDigit(line[6])) Instruction.Type.MODC else Instruction.Type.MOD,
            "eql" => if (isDigit(line[6])) Instruction.Type.EQLC else Instruction.Type.EQL,
            else => unreachable
        };

        ins.arg1 = line[4] - 'w';
        if (line.len > 6) {
            ins.arg2 = if (isDigit(line[6]))
                try std.fmt.parseInt(i32, line[6..], 10)
            else
                line[6] - 'w';
        }

        try program.append(ins);
    }

    var input = [_]i32 {0} ** 14;

    const result = findCode(program, input[0..14], 0);
    std.debug.print("{d}\n", .{ result });
}