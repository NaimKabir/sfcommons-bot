"use strict";
exports.__esModule = true;
var config_1 = require("./config");
var CLIENT_1 = require("./CLIENT");
var messages_1 = require("./messages");
var groups_1 = require("./groups");
function handleError(message, metadata) {
    var prettyPrint = function (obj) { return JSON.stringify(obj || '', null, 2); };
    console.log(message, prettyPrint(metadata));
    CLIENT_1.CLIENT.chat.postMessage({
        token: config_1.CONFIG.botToken,
        channel: config_1.CONFIG.errorChannelId,
        text: message,
        blocks: [
            { type: "header", text: { type: "plain_text", text: "❌ " + message } },
            { type: "section", text: { type: "mrkdwn", text: prettyPrint(metadata) } },
        ]
    });
}
function postPrivateInitiation(memberIds) {
    var tagGroup = function (memberIds) { return memberIds.map(function (id) { return "<@".concat(id, ">"); }).join(' '); };
    var userList = function (memberIds) { return memberIds.join(','); };
    CLIENT_1.CLIENT.conversations.open({
        token: config_1.CONFIG.botToken,
        prevent_creation: false,
        return_im: false,
        users: userList(memberIds)
    }).then(function (result) {
        if (result.channel && result.channel.id) {
            CLIENT_1.CLIENT.chat.postMessage({
                token: config_1.CONFIG.botToken,
                channel: result.channel.id,
                unfurl_links: false,
                unfurl_media: false,
                blocks: (0, messages_1.privateInitiation)(tagGroup(memberIds)),
                text: "A new connection awaits!"
            })["catch"](function (e) { return handleError("Failed to post message to private conversation.", { memberIds: memberIds, errorResponse: e }); });
        }
        else {
            handleError("No conversation ID found when attempting to post an initiation.", { memberIds: memberIds, conversationsApiResult: result });
        }
    })["catch"](function (e) { return handleError("Failed to open private conversation.", { memberIds: memberIds, errorResponse: e }); });
}
// Run
(0, groups_1.getGroupedMemberIDs)()
    .then(function (groups) {
    groups.forEach(function (memberIds) { console.log(memberIds); postPrivateInitiation(["U042TNNJN6P"]); });
})["catch"](function (e) { return handleError("Failed to get groups of memberIds", { errorResponse: e }); });
