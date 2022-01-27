const std = @import("std");
const data = @embedFile("input25.txt");

const wt = u140;
const ht = u137;

const width = 140;
const height = 137;

pub fn main() !void {
    var it = std.mem.tokenize(u8, data, "\r\n");

    var rows = [_]u140 {0} ** 137;
    var cols = [_]u137 {0} ** 140;
    _ = cols;

    var line_n: usize = 0;
    while (it.next()) |line| : (line_n += 1){
        for (line) |c, x| {
            if (c == '>') {
                rows[line_n] |= @as(wt, 1) <<% @intCast(u8, x);
            }
            else if (c == 'v') {
                cols[x] |= @as(ht, 1) <<% @intCast(u8, height);
            }
        }
    }

    var moved = true;
    var i: usize = 0;
    while (moved) : (i += 1) {
        for (rows) |row, y| {
            var blocked: wt = 0;
            for (cols) |col| {
                blocked |= (col >> y) & 1;
            }
            _ = row;
        }
    }

    std.debug.print("{d}\n", .{ i / 2 });
}