"use strict";
exports.__esModule = true;
exports.ENVIRONMENTS = exports.CONFIG = void 0;
exports.CONFIG = {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    errorChannelId: "C04J2SP748M",
    sparkConnectionsChannelId: "C04AMJBCU4F",
    blackList: [
        "U042H5S0K7E",
        "U04BEPGCU0H", // legacy Donut user
    ],
    targetGroupSize: 4
};
exports.ENVIRONMENTS = {
    PRODUCTION: "production",
    TEST: "test"
};
