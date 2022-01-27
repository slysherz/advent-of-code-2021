const input = @embedFile("input1.txt");
const std = @import("std");

pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var last: usize = try std.fmt.parseInt(usize, it.next().?, 10);
    var incs: usize = 0;
    while (it.next()) |line| {
        const n = try std.fmt.parseInt(usize, line, 10);
        if (n > last) incs += 1;
        last = n;
    }
    std.debug.print("{d}\n", .{incs});
}
