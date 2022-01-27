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

const Result = struct {
    version: usize,
    type_id: usize,
    length_type: usize,
    version_sum: usize,
    end: usize
};

fn parsePacket(data: []u4, start: usize) Result {
    var result: Result = undefined;

    var i: usize = start;
    result.version = getBits(data, i + 0, i + 3);
    result.type_id = getBits(data, i + 3, i + 6);
    result.version_sum = result.version;
    i += 6;

    if (result.type_id == 4) {
        // Literal value

        while (true) {
            const hasMore = getBits(data, i, i + 1);
            const group = getBits(data, i + 1, i + 5);
            i += 5;

            if (hasMore == 0) break;
        }

        result.end = i;
        printBits(data, start, result.end);

    } else {
        // Operator
        result.length_type = getBits(data, i, i + 1);
        i += 1;

        if (result.length_type == 0) {
            // Length in bits
            const bits = getBits(data, i, i + 15);
            i += 15;

            var t: usize = 0;
            while (true) {
                const packet = parsePacket(data, i + t);
                t = packet.end - i;
                result.version_sum += packet.version_sum;

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
                const packet = parsePacket(data, i);
                i = packet.end;
                t += 1;
                result.version_sum += packet.version_sum;

                if (t == packets) {
                    result.end = packet.end;
                    break;
                }
            }
        }
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

    const packet = parsePacket(&data, 0);

    std.debug.print("{d}\n", .{ packet.version_sum });
}