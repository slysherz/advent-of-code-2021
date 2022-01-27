const input = @embedFile("input20.txt");
const std = @import("std");

fn cmpByValue(context: void, a: usize, b: usize) bool {
    return std.sort.asc(usize)(context, a, b);
}

pub fn main() !void {
    var buffer: [1000000]u8 = undefined;
    const alloc = &std.heap.FixedBufferAllocator.init(&buffer).allocator;
    var it = std.mem.tokenize(input, "\r\n");

    var scores = std.ArrayList(usize).init(alloc);
    line: while (it.next()) |line| {
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

            continue :line;
        }

        var line_score: usize = 0;
        while (array.items.len > 0) {
            const d: usize = array.pop();
            line_score *= 5;

            if (d == '{') line_score += 3;
            if (d == '(') line_score += 1;
            if (d == '[') line_score += 2;
            if (d == '<') line_score += 4;
        }
            
        try scores.append(line_score);
    }

    std.sort.sort(usize, scores.items, {}, cmpByValue);

    for (scores.items) |s| {
        std.debug.print("{d}\n", .{ s });
    }

    std.debug.print("{d}\n", .{ scores.items[scores.items.len / 2] });
}
