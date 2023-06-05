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
var config_1 = require("./config");
var client_1 = require("./client");
var messages_1 = require("./messages");
var groups_1 = require("./groups");
var node_process_1 = require("node:process");
var fs_1 = require("fs");
function handleError(message, metadata) {
    var prettyPrint = function (obj) { return JSON.stringify(obj || "", null, 2); };
    console.log(message, prettyPrint(metadata));
    client_1.CLIENT.chat.postMessage({
        token: config_1.CONFIG.botToken,
        channel: config_1.CONFIG.errorChannelId,
        text: message,
        blocks: [
            { type: "header", text: { type: "plain_text", text: "❌ " + message } },
            {
                type: "section",
                text: { type: "mrkdwn", text: prettyPrint(metadata) }
            },
        ]
    });
}
var tagGroup = function (memberIds) {
    return memberIds.map(function (id) { return "<@".concat(id, ">"); }).join(" ");
};
function postPrivateInitiationToChannel(channelId, memberIds) {
    client_1.CLIENT.chat
        .postMessage({
        token: config_1.CONFIG.botToken,
        channel: channelId,
        unfurl_links: false,
        unfurl_media: false,
        blocks: (0, messages_1.privateInitiation)(tagGroup(memberIds)),
        text: "A new connection awaits!"
    })
        .then(function () { return console.log("Posting initiation for: " + memberIds); })["catch"](function (e) {
        return handleError("Failed to post message to channel.", {
            memberIds: memberIds,
            channelId: channelId,
            errorResponse: e
        });
    });
}
function postChannelQuery(environment) {
    var channelId = environment == config_1.ENVIRONMENTS.PRODUCTION
        ? config_1.CONFIG.sparkConnectionsChannelId
        : config_1.CONFIG.errorChannelId;
    client_1.CLIENT.chat
        .postMessage({
        token: config_1.CONFIG.botToken,
        channel: channelId,
        unfurl_links: false,
        unfurl_media: false,
        text: messages_1.queryMessage
    })
        .then(function (message) {
        console.log("Posting query for participation: ".concat(JSON.stringify(message)));
        putQueryMessage(environment, message);
        addSampleParticipationEmoji(message);
    })["catch"](function (e) {
        return handleError("Failed to post query message to channel.", {
            channelId: channelId,
            errorResponse: e
        });
    });
}
function addSampleParticipationEmoji(message) {
    client_1.CLIENT.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: config_1.PARTICIPATION_EMOJI
    });
}
function queryMessageFilename(environment) {
    return "./".concat(config_1.CONFIG.storageDir, "/").concat(environment, ".json");
}
function putQueryMessage(environment, message) {
    // writeFileSync overwrites existing files
    (0, fs_1.writeFileSync)(queryMessageFilename(environment), JSON.stringify(message));
}
function getStoredQueryMessage(environment) {
    return JSON.parse((0, fs_1.readFileSync)(queryMessageFilename(environment), "utf8"));
}
/**
 * Get folks who reacted to the messaging polling for active participation.
 */
function getQueryMessageReactors(environment) {
    return __awaiter(this, void 0, void 0, function () {
        var storedQueryMessage, searchTimestamp, queryMessageHisory, queryMessages, reactors, uniqueReactors;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    storedQueryMessage = getStoredQueryMessage(environment);
                    if (!storedQueryMessage.channel || !storedQueryMessage.ts) {
                        handleError("No valid stored query message found for environment: ".concat(environment, "."));
                        return [2 /*return*/, []];
                    }
                    searchTimestamp = (parseFloat(storedQueryMessage.ts) + config_1.TIMESTAMP_EPSILON).toFixed(6);
                    queryMessageHisory = client_1.CLIENT.conversations.history({
                        channel: storedQueryMessage.channel,
                        latest: "".concat(searchTimestamp),
                        limit: 1
                    });
                    return [4 /*yield*/, queryMessageHisory];
                case 1:
                    queryMessages = (_a.sent()).messages;
                    if (!queryMessages ||
                        queryMessages.length == 0 ||
                        !queryMessages[0].reactions) {
                        handleError("Couldn't find fresh query message found for environment: ".concat(environment, ". Is the API request formatted correctly?"));
                        return [2 /*return*/, []];
                    }
                    reactors = queryMessages[0].reactions
                        .map(function (reac) { return (reac.users ? reac.users : []); })
                        .reduce(function (prev, current) { return prev.concat(current); })
                        .filter(function (user) { return !config_1.CONFIG.blackList.includes(user); });
                    uniqueReactors = reactors.filter(function (item, index) { return reactors.indexOf(item) == index; });
                    return [2 /*return*/, uniqueReactors];
            }
        });
    });
}
function postChannelAnnouncement(environment) {
    var channelId = environment == config_1.ENVIRONMENTS.PRODUCTION
        ? config_1.CONFIG.sparkConnectionsChannelId
        : config_1.CONFIG.errorChannelId;
    client_1.CLIENT.chat
        .postMessage({
        token: config_1.CONFIG.botToken,
        channel: channelId,
        unfurl_links: false,
        unfurl_media: false,
        text: messages_1.jobAnnouncementMessage
    })
        .then(function () { return console.log("Posting announcement"); })["catch"](function (e) {
        return handleError("Failed to post announcement message to channel.", {
            channelId: channelId,
            errorResponse: e
        });
    });
}
function postPrivateInitiation(environment, memberIds) {
    switch (environment) {
        case config_1.ENVIRONMENTS.TEST:
            postPrivateInitiationToChannel(config_1.CONFIG.errorChannelId, memberIds);
            break;
        case config_1.ENVIRONMENTS.PRODUCTION:
            // Open Direct Message between parties and post initiation
            var userList = function (memberIds) { return memberIds.join(","); };
            client_1.CLIENT.conversations
                .open({
                token: config_1.CONFIG.botToken,
                prevent_creation: false,
                return_im: false,
                users: userList(memberIds)
            })
                .then(function (result) {
                if (result.channel && result.channel.id) {
                    postPrivateInitiationToChannel(result.channel.id, memberIds);
                }
                else {
                    handleError("No conversation ID found when attempting to post an initiation.", { memberIds: memberIds, conversationsApiResult: result });
                }
            })["catch"](function (e) {
                return handleError("Failed to open private conversation.", {
                    memberIds: memberIds,
                    errorResponse: e
                });
            });
    }
}
// Run
var ENVIRONMENT = node_process_1.argv[2];
if (![config_1.ENVIRONMENTS.PRODUCTION, config_1.ENVIRONMENTS.TEST].includes(ENVIRONMENT)) {
    throw "Must specify a valid environment!";
}
var MESSAGE_TYPE = node_process_1.argv[3];
if (![config_1.MESSAGE_TYPES.QUERY, config_1.MESSAGE_TYPES.INVITE].includes(MESSAGE_TYPE)) {
    throw "Must specify a valid message type to send! Use \"".concat(config_1.MESSAGE_TYPES.QUERY, "\" to poll for participation, or \"").concat(config_1.MESSAGE_TYPES.INVITE, "\" to send invitations to a connection.");
}
if (MESSAGE_TYPE === config_1.MESSAGE_TYPES.QUERY) {
    postChannelQuery(ENVIRONMENT);
}
if (MESSAGE_TYPE === config_1.MESSAGE_TYPES.INVITE) {
    // Send out Direct Message introductions
    getQueryMessageReactors(ENVIRONMENT)
        .then(function (reactorIds) {
        (0, groups_1.getGroupedMemberIDs)(reactorIds)
            .then(function (groups) {
            groups.forEach(function (memberIds) {
                console.log("Attempting ".concat(ENVIRONMENT, " initiation for: ") + memberIds);
                postPrivateInitiation(ENVIRONMENT, memberIds);
            });
        })["catch"](function (e) {
            return handleError("Failed to get groups of memberIds", { errorResponse: e });
        });
    })["catch"](function (e) {
        return handleError("Failed to get reactors to the query message.", {
            errorResponse: e
        });
    });
    // Announce to the channel so no one is ever uncertain if they just
    // didn't get grouped on a particular round.
    postChannelAnnouncement(ENVIRONMENT);
}
