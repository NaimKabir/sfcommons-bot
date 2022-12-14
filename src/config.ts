export const CONFIG = {
  botToken: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  errorChannelId: "D04F3FSEPLZ", // DMs with kabir
  sparkConnectionsChannelId: "C04AMJBCU4F", // #13-spark-connections
  blackList: [
    "U042H5S0K7E", // the Admin account
    "U04BEPGCU0H", // legacy Donut user
  ],
  targetGroupSize: 4,
};
