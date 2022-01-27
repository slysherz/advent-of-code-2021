const input = @embedFile("input6.txt");
const std = @import("std");
const one = @intCast(usize, 1);

pub fn main() !void {
    const ns = 3000;
    var it = std.mem.tokenize(input, "\r\n");
    var numbers = [_]usize{0} ** ns;
    var ln: usize = 0;

    while (it.next()) |line| {
        numbers[ln] = try std.fmt.parseInt(usize, line, 2);
        ln += 1;
    }

    var bc: u6 = 11;
    while (true) {
        var i: usize = 0;
        var cnt: usize = 0;
        while (i < ln) {
            if ((numbers[i] & (one << bc)) != 0) {
                cnt += 1;
            }
            i += 1;
        }

        const most_ones = cnt * 2 >= ln;
        var j: usize = 0;
        i = 0;
        while (i < ln) {
            const bit = (numbers[i] & (one << bc)) != 0;
            if (bit != most_ones) { // Swap to == for the other part
                numbers[j] = numbers[i];
                j += 1;
            }
            i += 1;
        }

        ln = j;

        if (bc > 0) {
            bc -= 1;
        } else {
            break;
        }
    }

    std.debug.print("{b}={d}\n", .{ numbers[0], numbers[0] });
}
