const secret = {
  dbString: 'mongodb://xxxx', //mongo db connection string
  testDbString: 'mongodb://xxxx', //used for testing fake irc messages with agenda
  twitchUsername: 'xxx', //bot account twitch username
  twitchMainChannel: 'xxx', //bot main channel (for /action etc.)
  twitchChannels: ['xxx'], //channel(s) bot should join
  botOwner: 'xxx', //twitch owner acct username (control & debug)
  twitchKey: 'oauth:xxxxx', //twitch bot oauth key
  twitchClient: 'xxxx', //currently unused
  twitchSecret: 'xxxx' //currently unused
}

module.exports = secret;
