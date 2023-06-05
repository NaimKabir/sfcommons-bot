"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.getGroupedMemberIDs = void 0;
var config_1 = require("./config");
var client_1 = require("./client");
/**
 * getGroupSizes makes best effort to take a pool of size `totalMembers` and split it up into groups
 * of size `targetGroupSize`, avoiding cases where you get groups without critical mass.
 */
function getGroupSizes(totalMembers, targetGroupSize) {
    var numGroups = Math.max(Math.floor(totalMembers / targetGroupSize), 1);
    var remainder = totalMembers % targetGroupSize;
    // Keeping it pretty simple: spread the remainder over the groups of targetGroupSize.
    // This means targetGroupSize is effectively only a minimum bound.
    // We won't have to deal with most cases where this causes overlarge groups,
    // because in practice `totalMembers` >> `targetGroupSize` and groups will only
    // get 1 more person added than `targetGroupSize`, at most.
    var groupSizes = Array(numGroups).fill(targetGroupSize);
    for (var i = remainder; i > 0; i--) {
        var groupIndex = i % numGroups;
        groupSizes[groupIndex] += 1;
    }
    return groupSizes;
}
/**
 * group breaks a big list into many smaller groups.
 */
function group(memberIds) {
    var groupSizes = getGroupSizes(memberIds.length, config_1.CONFIG.targetGroupSize);
    var groups = [];
    var lastIdx = 0;
    groupSizes.forEach(function (size, _) {
        var endIdx = lastIdx + size;
        var group = memberIds.slice(lastIdx, lastIdx + size);
        groups.push(group);
        lastIdx = endIdx;
    });
    return groups;
}
function shuffle(array) {
    return array
        .map(function (id, _) {
        return { id: id, sortKey: Math.random() };
    })
        .sort(function (a, b) {
        return a.sortKey - b.sortKey;
    })
        .map(function (item) { return item.id; });
}
function getAllMemberIds() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var hasMore, cursor, memberIds, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    hasMore = true;
                    memberIds = [];
                    _b.label = 1;
                case 1:
                    if (!hasMore) return [3 /*break*/, 3];
                    return [4 /*yield*/, client_1.CLIENT.conversations.members({
                            token: config_1.CONFIG.botToken,
                            channel: config_1.CONFIG.sparkConnectionsChannelId,
                            limit: 100,
                            cursor: cursor
                        })];
                case 2:
                    response = _b.sent();
                    if (response.members) {
                        memberIds = memberIds.concat(response.members);
                    }
                    cursor = (_a = response.response_metadata) === null || _a === void 0 ? void 0 : _a.next_cursor;
                    hasMore = cursor ? cursor.length > 0 : false;
                    return [3 /*break*/, 1];
                case 3:
                    if (memberIds.length == 0) {
                        throw "No channel members!";
                    }
                    return [2 /*return*/, memberIds];
            }
        });
    });
}
function getGroupedMemberIDs(providedMemberIds) {
    return __awaiter(this, void 0, void 0, function () {
        var filteredMemberIds, shuffledMemberIds;
        return __generator(this, function (_a) {
            filteredMemberIds = providedMemberIds.filter(function (id) {
                return !config_1.CONFIG.blackList.includes(id);
            });
            shuffledMemberIds = shuffle(filteredMemberIds);
            return [2 /*return*/, group(shuffledMemberIds)];
        });
    });
}
exports.getGroupedMemberIDs = getGroupedMemberIDs;
