const std = @import("std");

const Scores = [2]u16;
const Positions = [2]u8;
const State = struct {
    scores: Scores,
    position: Positions
};
const Result = [2]usize;
const Cache = std.AutoHashMap(State, Result);

const start_pos = Positions{7, 5};
// const start_pos = Positions{4, 8};

var possibilitites = [_]u16 {0} ** 10;

fn score_possibilities() void {
    var i: u16 = 1;
    while (i <= 3) : (i+= 1) {
        var j: u16 = 1;
        while (j <= 3) : (j += 1) {
            var k: u16 = 1;
            while (k <= 3) : (k += 1) possibilitites[i + j + k] += 1;
        }
    }
}

fn advance(state: State, roll: u8) State {
    const position: u8 = (state.position[0] + roll) % 10;

    return State{
        .scores = Scores{state.scores[1], @intCast(u16, state.scores[0] + position + 1)},
        .position = Positions{state.position[1], position}
    };
}

fn countWins(cache: *Cache, state: State) Result {
    if (cache.contains(state)) {
        return cache.get(state).?;
    }
    
    if (state.scores[1] >= 21) {
        return Result{0, 1};
    }    

    var res: Result = Result{0, 0};
    for (possibilitites) |count, i| {
        if (count == 0) continue;

        var temp = countWins(cache, advance(state, @intCast(u8, i)));

        res[0] += count * temp[1];
        res[1] += count * temp[0];
    }

    const ignore = cache.put(state, res);
    return res;
}

pub fn main() !void {
    var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa = &general_purpose_allocator.allocator;
    var cache = Cache.init(gpa);

    score_possibilities();
    
    var res = countWins(&cache, State {
        .scores = Scores{0, 0},
        .position = Positions{start_pos[0] - 1, start_pos[1] - 1}
    });

    std.debug.print("{d}\n", .{ std.math.max(res[0], res[1]) });
}