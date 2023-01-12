"use strict";
exports.__esModule = true;
var config_1 = require("./config");
var CLIENT_1 = require("./CLIENT");
var messages_1 = require("./messages");
var groups_1 = require("./groups");
var node_process_1 = require("node:process");
function handleError(message, metadata) {
    var prettyPrint = function (obj) { return JSON.stringify(obj || "", null, 2); };
    console.log(message, prettyPrint(metadata));
    CLIENT_1.CLIENT.chat.postMessage({
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
    CLIENT_1.CLIENT.chat
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
function postChannelAnnouncement(environment) {
    var channelId = environment == config_1.ENVIRONMENTS.PRODUCTION
        ? config_1.CONFIG.sparkConnectionsChannelId
        : config_1.CONFIG.errorChannelId;
    CLIENT_1.CLIENT.chat
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
            CLIENT_1.CLIENT.conversations
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
// Send out Direct Message introductions
(0, groups_1.getGroupedMemberIDs)()
    .then(function (groups) {
    groups.forEach(function (memberIds) {
        console.log("Attempting ".concat(ENVIRONMENT, " initiation for: ") + memberIds);
        postPrivateInitiation(ENVIRONMENT, memberIds);
    });
})["catch"](function (e) {
    return handleError("Failed to get groups of memberIds", { errorResponse: e });
});
// Announce to the channel so no one is ever uncertain if they just
// didn't get grouped on a particular round.
postChannelAnnouncement(ENVIRONMENT);
