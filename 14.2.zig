const input = @embedFile("input14.txt");
const std = @import("std");

const List = std.SinglyLinkedList(u8);
const asc_usize = std.sort.asc(usize);

fn insertAfter(node: *?*List.Node, new_node: *List.Node) void {
    new_node.next = node.*;
    node.* = new_node;
}

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    var alloc = gpa.allocator();

    var lit = std.mem.tokenize(u8, input, "\n");
    var map = std.StringHashMap(u8).init(alloc);
    var src = std.StringHashMap(usize).init(alloc);

    const seq = lit.next().?;

    while (lit.next()) |line| {
        var eit = std.mem.split(u8, line, " -> ");
        const str = eit.next().?;
        const char = eit.next().?[0];
        try map.put(str, char);
        try src.put(str, 0);
    }
    var dst = try src.clone();

    for (seq) |_, i| {
        if (i == seq.len - 1) break;
        const v = src.getPtr(seq[i .. i + 2]).?;
        v.* += 1;
    }

    var count: usize = 0;
    while (count < 40) : (count += 1) {
        var it = src.iterator();
        while (it.next()) |entry| {
            const char = map.get(entry.key_ptr.*).?;
            const str = [_]u8{ entry.key_ptr.*[0], char, entry.key_ptr.*[1] };
            dst.getPtr(str[0..2]).?.* += entry.value_ptr.*;
            dst.getPtr(str[1..3]).?.* += entry.value_ptr.*;
            entry.value_ptr.* = 0;
        }
        const tmp = src;
        src = dst;
        dst = tmp;
    }
    var arraymap = std.AutoArrayHashMap(u8, usize).init(alloc);
    var it = src.iterator();
    while (it.next()) |entry| {
        var r = try arraymap.getOrPut(entry.key_ptr.*[0]);
        if (r.found_existing) {
            r.value_ptr.* += entry.value_ptr.*;
        } else {
            r.value_ptr.* = entry.value_ptr.*;
        }
        r = try arraymap.getOrPut(entry.key_ptr.*[1]);
        if (r.found_existing) {
            r.value_ptr.* += entry.value_ptr.*;
        } else {
            r.value_ptr.* = entry.value_ptr.*;
        }
    }
    arraymap.getPtr(seq[0]).?.* += 1;
    arraymap.getPtr(seq[seq.len - 1]).?.* += 1;
    const values = arraymap.values();
    std.sort.sort(usize, values, {}, asc_usize);

    std.debug.print("{any}\n", .{values[values.len - 1] / 2 - values[0] / 2});
}
