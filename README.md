# pbot
Twitch Chat Bot **_prototype_**  
Developing on node 8.5.0  

## Try it out
**1. Get the repo and install dependencies**  
`````
nvm use 8.5.0
git clone https://github.com/pstrawberrie/pbot
cd pbot/queue && yarn install
cd ../irc && yarn install
cd ../web && yarn install (not working yet, skip this for now)
`````
**2. Configure your API keys and mongodb (pbot/_config/secret.js)**  
**3. Start your mongodb server**  
**4. Start the queue process ``cd pbot/queue && npm start`` (localhost:3000)**  
**5. Start the irc process ``cd pbot/queue && npm start`` (localhost:3001)**  
**6. Start the web process ``cd pbot/queue && npm start`` (http://localhost:3003)**  

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

## Needs to be implemented!
- update for heal to be "!heal" shortcut
- kill command
  - will attack until dead or kill
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
- npc model and npc interaction
  - quests (need new object in Character model schema for this)

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
