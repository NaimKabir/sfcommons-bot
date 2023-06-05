export const CONFIG = {
  botToken: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  storageDir: "storage",
  errorChannelId: "C04J2SP748M", // #x0testing
  sparkConnectionsChannelId: "C04AMJBCU4F", // #13-spark-connections
  blackList: [
    "U04BEPGCU0H", // legacy Donut user
    "U04ER03P6GL", // sparkbot
  ],
  targetGroupSize: 4,
};

export const ENVIRONMENTS = {
  PRODUCTION: "production",
  TEST: "test",
};

export const MESSAGE_TYPES = {
  QUERY: "query", // Poll for participation at the top of a week
  INVITE: "invite", // Actually send out invitation to connect in Direct Messages
};

// Timestamp tolerance with which we can
// filter conversations down to a particular message timestamp.
// Slack is dumb and doesn't allow retrieves via message IDs, we have
// to retrieve by channel and timestamp.
export const TIMESTAMP_EPSILON = 1e-5;

export const PARTICIPATION_EMOJI = "hand";
