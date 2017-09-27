# pbot
Twitch Chat Bot prototype    
Developing on node 8.5.0  
*this is not complete*  

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

## Credits
The RPG Icons this project uses are from here:  
[https://opengameart.org/content/rpg-icon-font](https://opengameart.org/content/rpg-icon-font)  
- Thanks to Lorc and VoodooDod!!!
