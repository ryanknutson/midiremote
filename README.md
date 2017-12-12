# midiremote
## Play midi files on a hardware device remotely

### Setup
- You'll need node, npm, and alsa-utils. Install them with:

  `sudo apt install nodejs npm alsa-utils`

- To create a list of your midi files, go into the directory where they reside and run this command:

  `find -L "$(pwd)" -not -path '*/\.*' -name "*.mid" > midilist.txt`
  
  move `midilist.txt` into the repo
  

- To find the hardware address of your midi device(s) run:

  `aplaymidi -l`

   and change the value of 'midiport' in server.js


- If desired, change 'port' in server.js (this is the port that the web server runs on, default 8085)

- Clone this repo and cd into it and run:
  
  `npm install`

- Run with:

  `node midiremote`
