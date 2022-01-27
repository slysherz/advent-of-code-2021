const input = @embedFile("input16.txt");
const std = @import("std");

fn getBits(data: []u4, from: usize, to: usize) usize {
    var result: usize = 0;

    var i: usize = from;
    while (i < to) : (i += 1) {
        const code = data[i / 4];

        result = (result << 1) | (code >> @intCast(u2, 3 - i % 4) & 1);
        // std.debug.print("{b}\t& {b}\t= {b} \t-> \t{b}\n", .{ code, mask, code & mask, result });
    }

    return result;
}

fn printBits(data: []u4, from: usize, to: usize) void {
    const n = to - from;
    std.debug.print("{d} \tbits: {b}\n", .{ n, getBits(data, from, to) });
}

fn indent(depth: usize) void {
    var i: usize = 0;
    while (i < depth) : (i += 1) {
        std.debug.print("|   ", .{});
    }
}

fn printValue(value: usize, depth: usize) void {
    indent(depth);
    std.debug.print("{d}\n", .{value});
}

fn printOp(value: usize, depth: usize) void {
    indent(depth);

    switch (value) {
        0 => std.debug.print("+\n", .{}),
        1 => std.debug.print("x\n", .{}),
        2 => std.debug.print("min\n", .{}),
        3 => std.debug.print("max\n", .{}),
        5 => std.debug.print(">\n", .{}),
        6 => std.debug.print("<\n", .{}),
        7 => std.debug.print("==\n", .{}),
        else => unreachable,
    }
}

fn updateResult(packet: Result, value: usize, first: bool) usize {
    const one: usize = 1;
    const zero: usize = 0;

    if (first) {
        return value;
    }

    return switch (packet.type_id) {
        0 => packet.value + value,
        1 => packet.value * value,
        2 => std.math.min(packet.value, value),
        3 => std.math.max(packet.value, value),
        5 => if (packet.value > value) one else zero,
        6 => if (packet.value < value) one else zero,
        7 => if (packet.value == value) one else zero,
        else => unreachable,
    };
}

const Result = struct {
    version: usize,
    type_id: usize,
    length_type: usize,
    value: usize,
    end: usize
};

fn parsePacket(data: []u4, start: usize, depth: usize) Result {
    var result: Result = undefined;

    var i: usize = start;
    result.version = getBits(data, i + 0, i + 3);
    result.type_id = getBits(data, i + 3, i + 6);
    result.value = 18446744073709551615;
    i += 6;

    if (result.type_id == 4) {
        // Literal value
        result.value = 0;
        while (true) {
            const hasMore = getBits(data, i, i + 1);
            const group = getBits(data, i + 1, i + 5);
            i += 5;

            result.value = result.value << 4;
            result.value += group;

            if (hasMore == 0) break;
        }

        result.end = i;

        printValue(result.value, depth);

    } else {
        // Operator
        result.length_type = getBits(data, i, i + 1);
        i += 1;
        printOp(result.type_id, depth);

        if (result.length_type == 0) {
            // Length in bits
            const bits = getBits(data, i, i + 15);
            i += 15;

            var t: usize = 0;
            while (true) {
                const packet = parsePacket(data, i + t, depth + 1);
                result.value = updateResult(result, packet.value, t == 0);
                t = packet.end - i;

                if (t >= bits) {
                    result.end = packet.end;
                    break;
                }
            }
        } else {
            // Length in packets
            const packets = getBits(data, i, i + 11);
            i += 11;

            var t: usize = 0;
            while (true) {
                const packet = parsePacket(data, i, depth + 1);
                var value: usize = packet.value;
                result.value = updateResult(result, packet.value, t == 0);
                i = packet.end;
                t += 1;

                if (t == packets) {
                    result.end = packet.end;
                    break;
                }
            }
        }
        
        indent(depth);
        std.debug.print("= {d}\n", .{result.value});
    }

    return result;
}

pub fn main() !void {
    var data =  [_]u4 {0} ** 1400;

    for (input) |c, i| {
        if (c == '\r') break;

        const slice = input[i..i + 1];
        data[i] = try std.fmt.parseInt(u4, slice, 16);
    }

    const packet = parsePacket(&data, 0, 0);

    std.debug.print("{d}\n", .{ packet.value });
}