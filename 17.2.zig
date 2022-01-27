const std = @import("std");

const x1 = 282;
const x2 = 314;
const y1 = -80;
const y2 = -45;
// const x1 = 20;
// const x2 = 30;
// const y1 = -10;
// const y2 = -5;
const minHeigh = -9999;

const Body = struct {
    x: i64,
    y: i64,
    vx: i64,
    vy: i64
};

fn tick(body: Body) Body {
    return Body {
        .x = body.x + body.vx,
        .y = body.y + body.vy,
        .vx = if (body.vx > 0) body.vx - 1 else if (body.vx < 0) body.vx + 1 else 0,
        .vy = body.vy - 1
    };
}

fn isLost(body: Body) bool {
    if (body.vx <= 0 and body.x < x1) return true;
    if (body.vx >= 0 and body.x > x2) return true;
    if (body.y < y1 and body.vy < 0) return true;
    return false;
}

fn hits(body: Body) bool {
    if (body.x < x1 or body.x > x2) return false;
    if (body.y < y1 or body.y > y2) return false;
    return true;
}

fn maxHeight(vx: i64, vy: i64) i64 {
    if (vx == 8 and vy == 2) {
        var k:usize =0;
    }

    var max: i64 = minHeigh;
    var hit: bool = false;
    var body = Body {
        .x = 0,
        .y = 0,
        .vx = vx,
        .vy = vy
    };

    while (!isLost(body)) {
        max = std.math.max(max, body.y);
        hit = hit or hits(body);
        body = tick(body);
    }

    return if (hit) max else minHeigh;
}

pub fn main() !void {
    
    var svx: i64 = 1;
    var sum: i64 = 0;
    while (svx < x2 + 1) : (svx += 1) {
        var svy: i64 = y1;
        while (svy < 1000) : (svy += 1) {
            if (maxHeight(svx, svy) != minHeigh) {
                sum += 1;
            }
        }
    }

    std.debug.print("{d}\n", .{ sum });
}