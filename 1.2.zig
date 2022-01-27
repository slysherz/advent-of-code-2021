const input = @embedFile("input2.txt");
const std = @import("std");

pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var last = [_]usize{ try std.fmt.parseInt(usize, it.next().?, 10), try std.fmt.parseInt(usize, it.next().?, 10), try std.fmt.parseInt(usize, it.next().?, 10) };
    var last_sum = last[0] + last[1] + last[2];
    var incs: usize = 0;
    var i: usize = 1;
    while (it.next()) |line| {
        last[i % 3] = try std.fmt.parseInt(usize, line, 10);
        i += 1;

        var sum = last[0] + last[1] + last[2];

        if (sum > last_sum) incs += 1;
        last_sum = sum;
    }
    std.debug.print("{d}\n", .{incs});
}
