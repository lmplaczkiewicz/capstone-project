The Green Dragon Tavern

Repository Links:
Front-End: https://github.com/lmplaczkiewicz/capstone-project
Back-End: https://github.com/lmplaczkiewicz/capstone-api

Website Links:
Front-End: https://lmplaczkiewicz.github.io/capstone-project/
Back-End: https://capstone-game-api.herokuapp.com/

Technologies Used: html scss javascript bootstrap handlebars npm-roll

Install Commands: 1. npm install 2. npm roll

App: This app is a proof of concept for a D&D style questing game. In the current state it allows for some variation in player class, some quests, and variable scaling of user characters as they level. It also features permanent death for player characters that reach a health value of zero during questing with a request to the server deleting that table entry for the character. The final intent of this game is to have an either open-ended D&D questing system with character progression and party recruitment or to have a semi-open questing simulation with story quests being implemented based upon renown value and level of character. Additionally, there will be the implementation of a tile map system later on that would allow for use of player_class stats outside of combat.

Unsolved Problems: I would want the textarea to function a bit better and have more versatility for a possible mobile version. I wasn't able to address the potential for a mobile ui due to time constraints.

Development Progress: Sat - Sun I began the project by planning via ERD phases and making a wireframe. I then started setting up my main resource, characters, in the back-end and then started on the front-end. I began by doing a basic html page with several buttons to test user CRU and Character CRUD. Once all the CRUD actions were working I linked the tables and re-tested the resources. Once CRUD was re-tested and working I began pushing forward with additional tables.

Mon - Tues I started adding additional tables and setting up my character select screen and then the tavern screen. I added in additional tables to the back-end; player_class, quest, monster. Then started implementing more handlebar items to display the various table data that was recieved.

Wed - Thurs I started combat logic and the associated join table between monsters and quests and added the weapon table for both characters and monsters. I added the fight screen area and began styling.

Fri I implemented a leveling system for characters up to level 5 and added a column to the characters table. Additionally, I added a scaling system for monsters based upon character level that takes place for the stored monster so that there is some variation and the back-end doesn't have duplicate monsters in said that table.

User Stories:
https://github.com/lmplaczkiewicz/capstone-project/blob/master/planning/userStories.md

Wireframe: https://github.com/lmplaczkiewicz/capstone-project/blob/master/planning/Wireframe%201.png

https://github.com/lmplaczkiewicz/capstone-project/blob/master/planning/Wireframe%202.png

Snapshot:
<img src='https://github.com/lmplaczkiewicz/capstone-project/blob/master/planning/snapshot.png?raw=true' />
