const input = @embedFile("input4.txt");
const std = @import("std");

pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var x: i64 = 0;
    var y: i64 = 0;
    var aim: i64 = 0;
    while (it.next()) |line| {
        if (line[0] == 'f') {
            const n = try std.fmt.parseInt(i64, line[8..], 10);
            x += n;
            y += aim * n;
        } else if (line[0] == 'd') {
            const n = try std.fmt.parseInt(i64, line[5..], 10);
            aim += n;
        } else if (line[0] == 'u') {
            const n = try std.fmt.parseInt(i64, line[3..], 10);
            aim -= n;
        }
    }

    std.debug.print("{d}x{d}={d}\n", .{ x, y, x * y });
}
