# pbot
Twitch Chat Bot **_prototype_**  
Developing on node 8.6.0  

## Try it out
**1. Get the repo and install dependencies**  
`````
nvm use 8.6.0
git clone https://github.com/pstrawberrie/pbot
cd pbot/queue && yarn install
cd ../irc && yarn install
cd ../web && yarn install
`````
**2. Configure your API keys and mongodb (pbot/_config/secret.js)**  
**3. Start your mongodb server**  
**4. Start the queue process ``cd pbot/queue && npm start`` (localhost:4000)**  
**5. Start the irc process ``cd pbot/queue && npm start`` (localhost:4001)**  
**6. Start the web process ``cd pbot/queue && npm start`` (http://localhost:4002)**  

----------------------------------

## Working so far
- Basic commands (use !help for list)
- Make new character
- Move around
- Look
- Attack monsters (+ cooldown based on ap)
- Sanctuary (healz u, m8)
- Dying & Death restrictions (no move/attack)
- Rez (admin only)
- Heal
- Attack characters
- monster drop + item pickup
- monster rez cron
- player rez cron ("A Healing Wind sweeps over the land")
- update for heal to be "!heal" shortcut
- !players command (list players active in last 10 minutes)
- !monsters command (list monsters in current character location)

## Bugs
- ~~!newcharacter spawns with 0 stats, and have to move to sanctuary to get stats~~

## Needs to be implemented!
- npc model and npc interaction
- quests 
- buffs
  - buffs can be based on move #
  - buffs can be based on attack #
- status effects
  - ie. poison
- consumables
  - supercrackyoutube - "monster's heart"
  - hp potions, mp potions
- xp
  - need xp tables for this
- !kill command
  - will attack until dead or kill
## Ideas
- JACK
  - "xp for commands"
    - everytime u send a command for the first time u get points. resets each week
  - "leave area buff"
    - certain areas give you a buff when you enter and leave them
      - IE. sanctuary = buff on enter, graveyard = buff on leave, etc.

## Credits
The RPG Icons this project uses are from here:  
[https://opengameart.org/content/rpg-icon-font](https://opengameart.org/content/rpg-icon-font)  
- Thanks to Lorc and VoodooDod!!!
