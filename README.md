# 💖 sparkbot

## Overview

Community design document [here](https://tinyurl.com/commons-spark-connections).

Sparkbot lives in our [#13-spark-connections](https://thesfcommons.slack.com/archives/C04AMJBCU4F) channel, and will prompt groups of people to meet up in interesting places.

Currently it:

- Finds everyone in #13-spark-connections
- Groups them into groups of 4 or 5
- Sends a private DM to them, prompting them to chat and meet up

Eventually we'll want to:

- Collect metrics on successful meet-ups
- Integrate with the Member Directory to seed discussion with mutual interests
- Poll recommendations on cool meet-up sites from members

## Development

### Usage

This is a script that can be thrown into a cron job for scheduled runs.

It runs on @kabir's 11-year old laptop on a cron.

#### Credentials

Before beginning, you must set environment variables with sparkbot credentials. Ask @kabir to share these credentials via secure means if you don't have them.
I recommend you put them in a password manager like 1Password.

```console
export SLACK_BOT_TOKEN={token}
export SLACK_SIGNING_SECRET={secret}
```

#### Transpiling

This is a TypeScript project. Though we edit `.ts` files in `/src`—actual runnables are `.js` files in `/dist`.

Edited `.ts` files can be transpiled to runnable `.js` with `./compile.sh`.

All `./run.sh` commands also compile before running to be safe and pick up recent edits.

#### Formatting

Let's keep code pretty without having to think about it! Just run:

```console
npx prettier --write .
```

#### Test runs

A dry run will post to [#x0testing](https://thesfcommons.slack.com/archives/C04J2SP748M) rather than actual Direct Messages between Commons members.

This lets us do some quality assurance before an actual run.

```console
./run.sh test
```

#### Actual run

This will actually post to Commons members and ping them.

```console
./run.sh production
```

### Contributing

Before contributing, first write an [Issue](https://github.com/NaimKabir/sfcommons-bot/issues) so we can discuss design. From there you can go ahead and write a Pull Request which we can review and then merge in.

Here's a loose guide to the code to help you think about edits you might make:

- `/src/bot.ts` is the main runnable and entrypoint
- `/src/config.ts` has global config information
- `/src/groups.ts` houses actual member grouping logic to decide Commons member groups for a run. This currently sorts randomly—we may make this smarter in the future.
- `/src/client.ts` is what exposes a usable Slack client
- `/src/messages.ts` is the content that sparkbot uses to craft Direct Messages. Ideally this will one day poll from a dynamic editable source, like Google Sheets or Airtable.
