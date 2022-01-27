const input = @embedFile("input17.txt");
const std = @import("std");
const one = @intCast(usize, 1);


pub fn main() !void {
    var heightmap: [100][100]u4 = undefined;
    var it = std.mem.tokenize(input, "\r\n");
    var i: usize = 0;

    while (it.next()) |line| {
        for (line) |c, x| {
            heightmap[x][i] = @intCast(u4, c - '0');
        }

        i += 1;
    }

    var sum: usize = 0;
    for (heightmap) |line, x| {
        for (line) |height, y| {
            if (x > 0 and heightmap[x - 1][y] <= height) continue;
            if (x + 1 < heightmap.len and heightmap[x + 1][y] <= height) continue;
            if (y > 0 and heightmap[x][y - 1] <= height) continue;
            if (y + 1 < heightmap[x].len and heightmap[x][y + 1] <= height) continue;

            sum += height + 1;
        }
    }

    std.debug.print("{d}\n", .{ sum });
}
