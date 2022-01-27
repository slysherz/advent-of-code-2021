const input = @embedFile("input18.txt");
const std = @import("std");
const size = 100;

pub fn main() !void {
    var buffer: [1000000]u8 = undefined;
    const alloc = &std.heap.FixedBufferAllocator.init(&buffer).allocator;
    var heightmap: [size][size]u4 = undefined;
    var it = std.mem.tokenize(input, "\r\n");
    var i: usize = 0;

    while (it.next()) |line| {
        for (line) |c, x| {
            heightmap[x][i] = @intCast(u4, c - '0');
        }

        i += 1;
    }

    var counted: [size][size]bool = undefined;

    var sum: usize = 0;
    var best_basin = [_]usize{0} ** 3;
    for (heightmap) |line, x| {
        for (line) |height, y| {
            if (x > 0 and heightmap[x - 1][y] <= height) continue;
            if (x + 1 < heightmap.len and heightmap[x + 1][y] <= height) continue;
            if (y > 0 and heightmap[x][y - 1] <= height) continue;
            if (y + 1 < heightmap[x].len and heightmap[x][y + 1] <= height) continue;

            for (counted) |*l| {
                for (l) |*val| {
                    val.* = false;
                }
            }

            const line_len = line.len;
            var basin_size: usize = 0;
            var array = std.ArrayList(usize).init(alloc);
            try array.append(y * line.len + x);
            while (array.items.len > 0) {
                var index = array.pop();

                const y1 = index / line.len;
                const x1 = index % line.len;

                if (counted[x1][y1] or heightmap[x1][y1] == 9) {
                    continue;
                }

                counted[x1][y1] = true;
                basin_size += 1;

                if (x1 > 0) try array.append(y1 * line.len + x1 - 1);
                if (x1 + 1 < heightmap.len) try array.append(y1 * line.len + x1 + 1);
                if (y1 > 0) try array.append((y1 - 1) * line.len + x1);
                if (y1 + 1 < line.len) try array.append((y1 + 1) * line.len + x1);
            }

            for (best_basin) |t, j| {
                if (basin_size > t) {
                    best_basin[j] = basin_size;
                    basin_size = t;
                }
            }
        }
    }

    std.debug.print("{d}\n", .{ best_basin[0] * best_basin[1] * best_basin[2] });
}
