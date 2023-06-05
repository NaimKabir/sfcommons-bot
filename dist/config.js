"use strict";
exports.__esModule = true;
exports.PARTICIPATION_EMOJI = exports.TIMESTAMP_EPSILON = exports.MESSAGE_TYPES = exports.ENVIRONMENTS = exports.CONFIG = void 0;
exports.CONFIG = {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    storageDir: "storage",
    errorChannelId: "C04J2SP748M",
    sparkConnectionsChannelId: "C04AMJBCU4F",
    blackList: [
        "U04BEPGCU0H",
        "U04ER03P6GL", // sparkbot
    ],
    targetGroupSize: 4
};
exports.ENVIRONMENTS = {
    PRODUCTION: "production",
    TEST: "test"
};
exports.MESSAGE_TYPES = {
    QUERY: "query",
    INVITE: "invite"
};
// Timestamp tolerance with which we can
// filter conversations down to a particular message timestamp.
// Slack is dumb and doesn't allow retrieves via message IDs, we have
// to retrieve by channel and timestamp.
exports.TIMESTAMP_EPSILON = 1e-5;
exports.PARTICIPATION_EMOJI = "hand";
