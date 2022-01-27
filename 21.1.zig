const std = @import("std");

const start_pos = [_]usize{7, 5};
// const start_pos = [_]usize{4, 8};

pub fn main() !void {
    var scores = [_]usize{0, 0};
    var pos = [_]usize{start_pos[0] - 1, start_pos[1] - 1};
    var dice: usize = 0;
    var player: usize = 0;
    var rolls: usize = 0;

    while (scores[0] < 1000 and scores[1] < 1000) : (player = player ^ 1) {
        var i: usize = 0;
        while (i < 3) : (i += 1) {
            pos[player] = (pos[player] + dice + 1) % 10;
            dice = (dice + 1) % 100;
            rolls += 1;
        }

        scores[player] += pos[player] + 1;
    }

    std.debug.print("{d}\n", .{ rolls * scores[player]});
}