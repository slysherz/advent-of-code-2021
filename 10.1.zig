const input = @embedFile("input19.txt");
const std = @import("std");

pub fn main() !void {
    var buffer: [1000000]u8 = undefined;
    const alloc = &std.heap.FixedBufferAllocator.init(&buffer).allocator;
    var it = std.mem.tokenize(input, "\r\n");

    var score: usize = 0;
    while (it.next()) |line| {
        var array = std.ArrayList(u8).init(alloc);
        for (line) |c| {
            if (c == '{' or c == '(' or c == '[' or c == '<') {
                try array.append(c);
                continue;
            }

            const d: u8 = array.pop();

            if (d == '{' and c == '}') continue;
            if (d == '(' and c == ')') continue;
            if (d == '[' and c == ']') continue;
            if (d == '<' and c == '>') continue;

            if (c == '}') score += 1197;
            if (c == ')') score += 3;
            if (c == ']') score += 57;
            if (c == '>') score += 25137;
            break;
        }
    }

    std.debug.print("{d}\n", .{ score });
}
