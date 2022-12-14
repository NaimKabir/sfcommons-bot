import { CONFIG } from "./config";
import { CLIENT } from "./CLIENT";
import { privateInitiation } from "./messages";
import { getGroupedMemberIDs } from "./groups";

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

function postPrivateInitiation(memberIds: Array<string>) {
  const tagGroup = (memberIds: Array<string>) =>
    memberIds.map((id) => `<@${id}>`).join(" ");
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
        CLIENT.chat
          .postMessage({
            token: CONFIG.botToken,
            channel: result.channel.id,
            unfurl_links: false,
            unfurl_media: false,
            blocks: privateInitiation(tagGroup(memberIds)),
            text: "A new connection awaits!",
          })
          .catch((e) =>
            handleError("Failed to post message to private conversation.", {
              memberIds: memberIds,
              errorResponse: e,
            })
          );
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

// Run

getGroupedMemberIDs()
  .then((groups) => {
    groups.forEach((memberIds) => postPrivateInitiation(memberIds));
  })
  .catch((e) =>
    handleError("Failed to get groups of memberIds", { errorResponse: e })
  );
