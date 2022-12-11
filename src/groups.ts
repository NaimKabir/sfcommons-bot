import {CONFIG} from './config';
import {CLIENT} from './client';
import { ConversationsMembersResponse } from '@slack/web-api';

export type Groups = Array<Array<string>>

/**
 * getGroupSizes makes best effort to take a pool of size `totalMembers` and split it up into groups
 * of size `targetGroupSize`, avoiding cases where you get groups without critical mass.
 */
function getGroupSizes(totalMembers: number, targetGroupSize: number): Array<number> {
  const numGroups = Math.floor(totalMembers / targetGroupSize);
  const remainder = totalMembers % targetGroupSize;

  // Keeping it pretty simple: spread the remainder over the groups of targetGroupSize.
  // This means targetGroupSize is effectively only a minimum bound.
  // We won't have to deal with most cases where this causes overlarge groups,
  // because in practice `totalMembers` >> `targetGroupSize` and groups will only
  // get 1 more person added than `targetGroupSize`, at most.
  const groupSizes = Array(numGroups).fill(targetGroupSize);
  for (let i=remainder; i > 0; i--){
    const groupIndex = i % numGroups;
    groupSizes[groupIndex] += 1
  }

  return groupSizes;
}

/**
 * group breaks a big list into many smaller groups.
 */
function group(memberIds: Array<string>): Groups {
  const groupSizes = getGroupSizes(memberIds.length, CONFIG.targetGroupSize)
  const groups: Groups = [];
  let lastIdx = 0;
  groupSizes.forEach( (size: number, _) => {
    const endIdx = lastIdx + size;
    const group = memberIds.slice(lastIdx, lastIdx + size);
    groups.push(group);
    lastIdx = endIdx;
  })
  return groups;
}

function shuffle(array: Array<any>): Array<any> {
  return array
    .map((id, _) => { return {id: id, sortKey: Math.random()} })
    .sort((a, b) => { return a.sortKey - b.sortKey} )
    .map((item) => item.id)
}

async function getAllMemberIds(): Promise<Array<string>> {
  let hasMore = true;
  let cursor;
  let memberIds: Array<string> = [];
  while (hasMore) {
    const response: ConversationsMembersResponse = await CLIENT.conversations.members({
      token: CONFIG.botToken, 
      channel: CONFIG.sparkConnectionsChannelId, 
      limit: 15, 
      cursor: cursor
    })
    if (response.members) {
      memberIds = memberIds.concat(response.members)
    }
    cursor = response.response_metadata?.next_cursor
    hasMore = cursor ? cursor.length > 0 : false
  }
  if (memberIds.length == 0) {
    throw "No channel members!"
  }
  return memberIds;
}

export async function getGroupedMemberIDs(): Promise<Groups> {
  const memberIds = await getAllMemberIds()
  const filteredMemberIds = memberIds.filter((id) => {return !CONFIG.blackList.includes(id)})

  const shuffledMemberIds = shuffle(filteredMemberIds);

  return group(shuffledMemberIds);
}