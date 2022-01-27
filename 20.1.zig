const input = @embedFile("input20.txt");
const std = @import("std");

const Board = struct {
    data: std.ArrayList(bool),
    width: i64,
    height: i64
};

fn getPos(x: i64, y: i64, width: i64) usize {
    return @intCast(usize, y * width + x);
}

fn get(board: *Board, x: i64, y: i64, dx: i64, dy: i64) bool {
    const x1 = x + dx;
    const y1 = y + dy;

    if (x1 < 0 or x1 >= board.width) return false;
    if (y1 < 0 or y1 >= board.height) return false;

    return board.data.items[getPos(x1, y1, board.width)];
}

fn parsePixel(c: u8) bool {
    std.debug.assert(c == '#' or c == '.');
    if (c == '#') return true;
    return false;
}

pub fn main() !void {
    var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa = &general_purpose_allocator.allocator;

    var alg = std.ArrayList(bool).init(gpa);
    var board1: Board = undefined;
    var board2: Board = undefined;

    board1.data = std.ArrayList(bool).init(gpa);
    board2.data = std.ArrayList(bool).init(gpa);

    var it = std.mem.tokenize(input, "\r\n");
    const alg_line = it.next().?;

    for (alg_line) |c| {
        try alg.append(parsePixel(c));
    }

    board1.width = 0;
    board1.height = 0;
    while (it.next()) |line| {
        board1.width = @intCast(i64, line.len);
        board1.height += 1;
        for (line) |c| {
            try board1.data.append(parsePixel(c));
        }
    }

    std.debug.assert(board1.data.items.len == board1.width * board1.height);

    var steps: usize = 0;
    while (steps < 2) : (steps += 1) {
        var b1: *Board = if (steps % 2 == 0) &board1 else &board2;
        var b2: *Board = if (steps % 2 == 0) &board2 else &board1;

        b2.data.clearRetainingCapacity();
        b2.width = b1.width + 2;
        b2.height = b1.height + 2;

        var y: i64 = 0;
        while (y < b2.height) : (y += 1) {
            var x: i64 = 0;
            while (x < b2.width) : (x += 1) {
                const x1 = x - 1;
                const y1 = y - 1;
                
                var code: usize = 0;
                if (get(b1, x1, y1, -1, -1)) code |= 1 << 8;
                if (get(b1, x1, y1, 0, -1)) code |= 1 << 7;
                if (get(b1, x1, y1, 1, -1)) code |= 1 << 6;
                if (get(b1, x1, y1, -1, 0)) code |= 1 << 5;
                if (get(b1, x1, y1, 0, 0)) code |= 1 << 4;
                if (get(b1, x1, y1, 1, 0)) code |= 1 << 3;
                if (get(b1, x1, y1, -1, 1)) code |= 1 << 2;
                if (get(b1, x1, y1, 0, 1)) code |= 1 << 1;
                if (get(b1, x1, y1, 1, 1)) code |= 1 << 0;
                
                const pos = getPos(x, y, b2.width);
                std.debug.assert(pos == b2.data.items.len);
                try b2.data.append(alg.items[code]);
                std.debug.assert(get(b2, x, y, 0, 0) == alg.items[code]);

                if (alg.items[code]) std.debug.print("#", .{})
                else std.debug.print(".", .{});
            }
            std.debug.print("\n", .{});
        }
        std.debug.print("\n\n\n", .{});
    }

    var sum1: usize = 0;
    for (board1.data.items) |p| {
        if (p) sum1 += 1;
    }

    var sum2: usize = 0;
    for (board2.data.items) |p| {
        if (p) sum2 += 1;
    }

    std.debug.print("{d}, {d}\n", .{ sum1, sum2 });
}