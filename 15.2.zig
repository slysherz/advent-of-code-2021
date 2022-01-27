const input = @embedFile("input15.txt");
const std = @import("std");
const input_s = 100;
const repeats = 5;
const size = input_s * repeats;



pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var distance: [size][size]usize = undefined;
    var weight: [size][size]usize = undefined;

    var j: usize = 0;
    while (it.next()) |line| {
        for (line) |c, x| {
            var i: usize = 0;
            while (i < 5) : (i += 1) {
                var k: usize = 0;
                while (k < 5) : (k += 1) {
                    var value: usize = (@intCast(usize, c - '0') - 1 + i + k) % 9 + 1;
                    weight[j + input_s * i][x + input_s * k] = value;
                    distance[j + input_s * i][x + input_s * k] = 999999999999;
                }
            }
        }

        j += 1;
    }

    distance[0][0] = 0;

    var done: bool = false;
    while (!done) {
        done = true;

        for (weight) |line, y| {
            for (line) |w, x| {
                var minDist: usize = distance[y][x];
                const startDist: usize = minDist;
                
                if (x > 0) minDist = std.math.min(minDist, weight[x][y] + distance[y][x - 1]);
                if (x + 1 < size) minDist = std.math.min(minDist, weight[x][y] + distance[y][x + 1]);
                if (y > 0) minDist = std.math.min(minDist, weight[x][y] + distance[y - 1][x]);
                if (y + 1 < size) minDist = std.math.min(minDist, weight[x][y] + distance[y + 1][x]);

                if (startDist != minDist) done = false;

                distance[y][x] = minDist;
            }
        }
    }

    std.debug.print("{d}\n", .{ distance[size - 1][size - 1] });
}
