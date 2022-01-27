const input = @embedFile("input7.txt");
const std = @import("std");
const one = @intCast(usize, 1);

const Card = struct {
    hits: usize,
    numbers: [25]usize,
    num_cnt: usize
};

pub fn main() !void {
    var it = std.mem.split(input, "\r\n\r\n");
    var balls_it = std.mem.tokenize(it.next().?, ",");
    var cards = [_]Card{undefined} ** 100;
    var patterns = [_]usize{
        @intCast(usize, 31) << @intCast(u6, 0),
        @intCast(usize, 31) << @intCast(u6, 5),
        @intCast(usize, 31) << @intCast(u6, 10),
        @intCast(usize, 31) << @intCast(u6, 15),
        @intCast(usize, 31) << @intCast(u6, 20),
        @intCast(usize, 1082401) << @intCast(u6, 0),
        @intCast(usize, 1082401) << @intCast(u6, 1),
        @intCast(usize, 1082401) << @intCast(u6, 2),
        @intCast(usize, 1082401) << @intCast(u6, 3),
        @intCast(usize, 1082401) << @intCast(u6, 4),
    };

    var i: usize = 0;
    while (it.next()) |card_txt| {
        cards[i].hits = 0;
        cards[i].num_cnt = 0;

        var line_it = std.mem.tokenize(card_txt, "\r\n");
        while (line_it.next()) |line| {
            var num_it = std.mem.tokenize(line, " ");
            while (num_it.next()) |num| {
                cards[i].numbers[cards[i].num_cnt] = try std.fmt.parseInt(usize, num, 10);
                cards[i].num_cnt += 1;
            }
        }
        i += 1;
    }

    while (balls_it.next()) |draw_txt| {
        const draw = try std.fmt.parseInt(usize, draw_txt, 10);

        for (cards) |*card| {
            for (card.numbers) |n, k| {
                if (n == draw) {
                    card.hits ^= @intCast(usize, 1) << @intCast(u6, k);

                    for (patterns) |p| {
                        if (card.hits & p == p) {
                            var sum: usize = 0;
                            for (card.numbers) |cn, j| {
                                if (card.hits & @intCast(usize, 1) << @intCast(u6, j) == 0) {
                                    sum += cn;
                                }
                            }

                            std.debug.print("{d}\n", .{ sum * draw });
                            return;
                        }
                    }
                }
            }
        }
    }
}
