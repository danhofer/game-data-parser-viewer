# Game Data Parser/Viewer

This project takes a database export of completed online games and parses the data to find which characters win the most, sorted by number of players.

The original database file (not included in this repository) is over 120mb and contains over 60,000 games. The code in [parser.js](./parser.js) takes each line and extracts the number of players, the characters the players used, and the final score. An example line of data is in [raw-data-file.csv](./raw-data-file.csv), and the parsed output data is just over 20kb. The script runs in O(n) time, and a standard laptop at the time of this writing parses about 10,000 lines a second.

The output of [parser.js](./parser.js) was copied into [data.js](./public/data.js) for the frontend.

## Take it for a spin

https://danhofer.github.io/game-data-parser-viewer/

## Obstacles

This was a fairly straightforward process but I did encounter a few hurdles along the way:
- The final game states given to me were completely cryptic with little to no explanation of where to find the data I needed. When I did find where the characters were identified, I had to reverse engineer the arbitrary character numbers in the database to the actual names of the characters in the game. To complicate things further, one character didn't have a number. If a player used that character, their data would be listed without a character key. The code accounts for this.
- The 20kb of parsed data is too large to leave open in a code editor (or just my code editor), so I wanted to keep the data in a separate file while I built and edited the [index.js](./public/index.js) frontend. To do this, [data.js](./public/data.js) loads the parsed data into a div in [index.html](./public/index.html), and then is quickly copied out by [index.js](./public/index.js).
