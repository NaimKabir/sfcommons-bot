"use strict";
exports.__esModule = true;
exports.CONFIG = void 0;
exports.CONFIG = {
    botToken: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    errorChannelId: "D04F3FSEPLZ",
    sparkConnectionsChannelId: "C04AMJBCU4F",
    blackList: [
        "U042H5S0K7E",
        "U04BEPGCU0H" // legacy Donut user
    ],
    targetGroupSize: 4
};
