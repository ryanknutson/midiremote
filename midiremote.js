var express = require('express');
var fs = require('fs');
var path = require("path");
var colors = require('colors');
var exec = require('child_process').exec;
var shellescape = require('shell-escape');
var app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));



// Port the web server runs on
var port = process.env.PORT || 3000;

// you can find this by typing aplaymidi -l
var midiport = "28:0";



//               //
// Begin Program //
//               //

app.use(express.bodyParser());


// return song titles with ajax post
app.post('/search', (req, res) => {
	getTitles(req.body.search, res);
});


// play titles with ajax post
app.post('/play', (req, res) => {
	console.log('playing', req.body.file);
	playmusic(res, req.body.file);
});

app.post('/stop', (req, res) => {
    console.log('stopping music...');
    stopmusic(res, 1);
});

// render homepage
app.get('/', (req, res) => {
    res.render("index");
});


// function to get song titles from text file using a search query
function getTitles(search, res) {
    
    // init vars
    var regex = reg(search);
    var results = [];
    
    // read list of files
    fs.readFile("midilist.txt", "utf8", (err, data) => {
        if (err) {
            res.status(500).send("<span style=\"color: red;\">" + err + "</span>");    
            throw err;
        }
        
        // set a variable to make things shorter
        let m;
        
        // loop through the data and add them to the array
        while ((m = regex.exec(data)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            m.forEach((match, groupIndex) => {
                // add matches to array
                results.push(match);
            });
        }
        
        // send results to client
        res.json(results);
    });
}


function reg(input) {
    var flags = 'gi';
    return new RegExp('.*' + input + '.*', flags);
}


function playmusic(res, file) {
    var command = [];
    command.push('aplaymidi');
    
    command.push('--port=' + midiport);
    
    command.push(file);

    stopmusic();
    
    var escaped = shellescape(command);
    exec(escaped, (error, stdout, stderr) => {
      console.log(colors.green(stdout));
      if (error !== null) {
        console.log(colors.red(error));
        res.status(500).send("<span style=\"color: red;\">error playing " + file.split('/').pop() + "</span>");
      } else {
        res.status(200).send("playing " + file.split('/').pop());
      }
    });
}


function stopmusic(res, z) {
    z = z || 0;

    exec("pkill aplaymidi", (error, stdout, stderr) => {
    // Send response
      console.log(colors.green(stdout));
      
      if (error !== null) {
        console.log(colors.red(error));
        if (z == 1) { res.status(500).send("<span style=\"color: red;\">" + error + "</span>"); }
      } else {
        if (z == 1) { res.status(200).send('Music stopped'); }
      }
      
    });
}


console.log("Started on port", port);
app.listen(port);
