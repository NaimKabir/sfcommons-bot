import {
  CONFIG,
  ENVIRONMENTS,
  MESSAGE_TYPES,
  PARTICIPATION_EMOJI,
  TIMESTAMP_EPSILON,
} from "./config";
import { CLIENT } from "./client";
import {
  queryMessage,
  jobAnnouncementMessage,
  privateInitiation,
} from "./messages";
import { getGroupedMemberIDs } from "./groups";
import { argv } from "node:process";
import { ChatPostMessageResponse } from "@slack/web-api";
import { readFileSync, writeFileSync } from "fs";

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

function postChannelQuery(environment: string) {
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
      text: queryMessage,
    })
    .then((message: ChatPostMessageResponse) => {
      console.log(
        `Posting query for participation: ${JSON.stringify(message)}`
      );
      putQueryMessage(environment, message);
      addSampleParticipationEmoji(message);
    })
    .catch((e) =>
      handleError("Failed to post query message to channel.", {
        channelId: channelId,
        errorResponse: e,
      })
    );
}

function addSampleParticipationEmoji(message: ChatPostMessageResponse) {
  CLIENT.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: PARTICIPATION_EMOJI,
  });
}

function queryMessageFilename(environment: string): string {
  return `./${CONFIG.storageDir}/${environment}.json`;
}

function putQueryMessage(
  environment: string,
  message: ChatPostMessageResponse
) {
  // writeFileSync overwrites existing files
  writeFileSync(queryMessageFilename(environment), JSON.stringify(message));
}

function getStoredQueryMessage(environment: string): ChatPostMessageResponse {
  return JSON.parse(readFileSync(queryMessageFilename(environment), "utf8"));
}

/**
 * Get folks who reacted to the messaging polling for active participation.
 */
async function getQueryMessageReactors(
  environment: string
): Promise<Array<string>> {
  const storedQueryMessage = getStoredQueryMessage(environment);
  if (!storedQueryMessage.channel || !storedQueryMessage.ts) {
    handleError(
      `No valid stored query message found for environment: ${environment}.`
    );
    return [];
  }
  // Slack's API only takes search timestamps with precision up to 6 digits.
  const searchTimestamp = (
    parseFloat(storedQueryMessage.ts) + TIMESTAMP_EPSILON
  ).toFixed(6);
  const queryMessageHisory = CLIENT.conversations.history({
    channel: storedQueryMessage.channel,
    latest: `${searchTimestamp}`,
    limit: 1,
  });
  const queryMessages = (await queryMessageHisory).messages;
  if (
    !queryMessages ||
    queryMessages.length == 0 ||
    !queryMessages[0].reactions
  ) {
    handleError(
      `Couldn't find fresh query message found for environment: ${environment}. Is the API request formatted correctly?`
    );
    return [];
  }
  const reactors = queryMessages[0].reactions
    .map((reac) => (reac.users ? reac.users : []))
    .reduce((prev, current) => prev.concat(current))
    .filter((user) => !CONFIG.blackList.includes(user));
  const uniqueReactors = reactors.filter(
    (item, index) => reactors.indexOf(item) == index
  );
  return uniqueReactors;
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

const MESSAGE_TYPE = argv[3];
if (![MESSAGE_TYPES.QUERY, MESSAGE_TYPES.INVITE].includes(MESSAGE_TYPE)) {
  throw `Must specify a valid message type to send! Use "${MESSAGE_TYPES.QUERY}" to poll for participation, or "${MESSAGE_TYPES.INVITE}" to send invitations to a connection.`;
}

if (MESSAGE_TYPE === MESSAGE_TYPES.QUERY) {
  postChannelQuery(ENVIRONMENT);
}

if (MESSAGE_TYPE === MESSAGE_TYPES.INVITE) {
  // Send out Direct Message introductions
  getQueryMessageReactors(ENVIRONMENT)
    .then((reactorIds) => {
      getGroupedMemberIDs(reactorIds)
        .then((groups) => {
          groups.forEach((memberIds) => {
            console.log(
              `Attempting ${ENVIRONMENT} initiation for: ` + memberIds
            );
            postPrivateInitiation(ENVIRONMENT, memberIds);
          });
        })
        .catch((e) =>
          handleError("Failed to get groups of memberIds", { errorResponse: e })
        );
    })
    .catch((e) =>
      handleError("Failed to get reactors to the query message.", {
        errorResponse: e,
      })
    );

  // Announce to the channel so no one is ever uncertain if they just
  // didn't get grouped on a particular round.
  postChannelAnnouncement(ENVIRONMENT);
}
