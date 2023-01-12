import { CONFIG, ENVIRONMENTS } from "./config";
import { CLIENT } from "./CLIENT";
import { jobAnnouncementMessage, privateInitiation } from "./messages";
import { getGroupedMemberIDs } from "./groups";
import { argv } from "node:process";

function handleError(message: string, metadata?: Object) {
  const prettyPrint = (obj?: Object) => JSON.stringify(obj || "", null, 2);
  console.log(message, prettyPrint(metadata));
  CLIENT.chat.postMessage({
    token: CONFIG.botToken,
    channel: CONFIG.errorChannelId,
    text: message,
    blocks: [
      { type: "header", text: { type: "plain_text", text: "❌ " + message } },
      {
        type: "section",
        text: { type: "mrkdwn", text: prettyPrint(metadata) },
      },
    ],
  });
}

const tagGroup = (memberIds: Array<string>) =>
  memberIds.map((id) => `<@${id}>`).join(" ");

function postPrivateInitiationToChannel(
  channelId: string,
  memberIds: Array<string>
) {
  CLIENT.chat
    .postMessage({
      token: CONFIG.botToken,
      channel: channelId,
      unfurl_links: false,
      unfurl_media: false,
      blocks: privateInitiation(tagGroup(memberIds)),
      text: "A new connection awaits!",
    })
    .then(() => console.log("Posting initiation for: " + memberIds))
    .catch((e) =>
      handleError("Failed to post message to channel.", {
        memberIds: memberIds,
        channelId: channelId,
        errorResponse: e,
      })
    );
}

function postChannelAnnouncement(environment: string) {
  const channelId =
    environment == ENVIRONMENTS.PRODUCTION
      ? CONFIG.sparkConnectionsChannelId
      : CONFIG.errorChannelId;
  CLIENT.chat
    .postMessage({
      token: CONFIG.botToken,
      channel: channelId,
      unfurl_links: false,
      unfurl_media: false,
      text: jobAnnouncementMessage,
    })
    .then(() => console.log("Posting announcement"))
    .catch((e) =>
      handleError("Failed to post announcement message to channel.", {
        channelId: channelId,
        errorResponse: e,
      })
    );
}

function postPrivateInitiation(environment: string, memberIds: Array<string>) {
  switch (environment) {
    case ENVIRONMENTS.TEST:
      postPrivateInitiationToChannel(CONFIG.errorChannelId, memberIds);
      break;
    case ENVIRONMENTS.PRODUCTION:
      // Open Direct Message between parties and post initiation
      const userList = (memberIds: Array<string>) => memberIds.join(",");
      CLIENT.conversations
        .open({
          token: CONFIG.botToken,
          prevent_creation: false,
          return_im: false,
          users: userList(memberIds),
        })
        .then((result) => {
          if (result.channel && result.channel.id) {
            postPrivateInitiationToChannel(result.channel.id, memberIds);
          } else {
            handleError(
              "No conversation ID found when attempting to post an initiation.",
              { memberIds: memberIds, conversationsApiResult: result }
            );
          }
        })
        .catch((e) =>
          handleError("Failed to open private conversation.", {
            memberIds: memberIds,
            errorResponse: e,
          })
        );
  }
}

// Run

const ENVIRONMENT = argv[2];
if (![ENVIRONMENTS.PRODUCTION, ENVIRONMENTS.TEST].includes(ENVIRONMENT)) {
  throw "Must specify a valid environment!";
}

// Send out Direct Message introductions
getGroupedMemberIDs()
  .then((groups) => {
    groups.forEach((memberIds) => {
      console.log(`Attempting ${ENVIRONMENT} initiation for: ` + memberIds);
      postPrivateInitiation(ENVIRONMENT, memberIds);
    });
  })
  .catch((e) =>
    handleError("Failed to get groups of memberIds", { errorResponse: e })
  );

// Announce to the channel so no one is ever uncertain if they just
// didn't get grouped on a particular round.
postChannelAnnouncement(ENVIRONMENT);
