const input = @embedFile("input5.txt");
const std = @import("std");

fn popcnt(str: []const u8) usize {
    var res: usize = 0;
    for (str) |c| {
        if (c == '1') res += 1;
    }

    return res;
}

pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var bit_cnt = [_]usize{0} ** 12;
    var ln_cnt: usize = 0;

    while (it.next()) |line| {
        for (line) |c, i| {
            if (c == '1') bit_cnt[i] += 1;
        }
        ln_cnt += 1;
    }

    var gamma: usize = 0;
    var epsilon: usize = 0;
    for (bit_cnt) |bits, i| {
        if (bits > ln_cnt / 2) {
            gamma ^= @intCast(usize, 1) << @intCast(u6, 11 - i);
        } else {
            epsilon ^= @intCast(usize, 1) << @intCast(u6, 11 - i);
        }
    }

    std.debug.print("{b}x{b}={d}\n", .{ gamma, epsilon, gamma * epsilon });
}
