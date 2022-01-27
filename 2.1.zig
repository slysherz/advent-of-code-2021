const input = @embedFile("input3.txt");
const std = @import("std");

pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var x: usize = 0;
    var y: usize = 0;
    while (it.next()) |line| {
        if (line[0] == 'f') {
            x += try std.fmt.parseInt(usize, line[8..], 10);
        } else if (line[0] == 'd') {
            y += try std.fmt.parseInt(usize, line[5..], 10);
        } else if (line[0] == 'u') {
            y -= try std.fmt.parseInt(usize, line[3..], 10);
        }
    }

    std.debug.print("{d}x{d}={d}\n", .{ x, y, x * y });
}
