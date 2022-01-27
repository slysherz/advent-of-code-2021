const input = @embedFile("input21.txt");
const std = @import("std");
const size: usize = 10;
const steps: usize = 100;

fn addPower(pl: *[size][size]u5, flashed: *[size][size]bool, x: usize, y: usize, dx: i64, dy: i64) void {
    const x1 = @intCast(i64, x) - dx;
    const y1 = @intCast(i64, y) - dy;

    if (x1 < 0 or y1 < 0) return;
    if (x1 >= pl[0].len or y1 >= pl.len) return;
    if (flashed[@intCast(usize, y1)][@intCast(usize, x1)]) return;
    pl[@intCast(usize, y1)][@intCast(usize, x1)] += 1;

    return;
}

pub fn main() !void {
    var it = std.mem.tokenize(input, "\r\n");
    var pl: [size][size]u5 = undefined;
    var flashed: [size][size]bool = undefined;

    var j: usize = 0;
    while (it.next()) |line| {
        for (line) |c, x| {
            pl[j][x] = @intCast(u5, c - '0');
        }

        j += 1;
    }

    var k: usize = 0;
    var flashes: usize = 0;
    while (k < steps) {
        for (flashed) |*line, y| {
            for (line) |*f, x| {
                f.* = false;
                pl[y][x] += 1;
            }
        }

        var check = true;
        while (check) {
            check = false;

            for (pl) |line, y| {
                for (line) |power, x| {
                    if (power > 9) {
                        check = true;
                        pl[y][x] = 0;
                        flashed[y][x] = true;
                        flashes += 1;

                        addPower(&pl, &flashed, x, y, -1, -1);
                        addPower(&pl, &flashed, x, y, -1, 0);
                        addPower(&pl, &flashed, x, y, -1, 1);
                        addPower(&pl, &flashed, x, y, 0, -1);
                        addPower(&pl, &flashed, x, y, 0, 1);
                        addPower(&pl, &flashed, x, y, 1, -1);
                        addPower(&pl, &flashed, x, y, 1, 0);
                        addPower(&pl, &flashed, x, y, 1, 1);
                    }
                }
            }
        }

        k += 1;
    }

    std.debug.print("{d}\n", .{ flashes });
}
