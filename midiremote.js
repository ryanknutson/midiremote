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
var port = 8085;

// you can find this by typing aplaymidi -l
var midiport = "28:0";



//               //
// Begin Program //
//               //

app.use(express.bodyParser());


// return song titles with ajax post
app.post('/search', function(req, res){
	getTitles(req.body.search, res);
});

// play titles with ajax post
app.post('/play', function(req, res){
	console.log('playing...', req.body.file);
	playmusic(req.body.file);
	res.send(200,{"Content-Type": "application/json"});
});

// render homepage
app.get('/', function (req, res) {
  res.render("index");
});


// function to get song titles from text file using a search query
function getTitles(search, res) {
    
    // init vars
    var regex = reg(search);
    var results = [];
    
    // read list of files
    fs.readFile("midilist.txt", "utf8", function(err, data) {
        if (err) throw err;
        
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


function playmusic(file) {
    var command = [];
    command.push('aplaymidi');
    
    command.push('--port=' + midiport);
    
    command.push(file);

    var akill = "pkill aplaymidi";

    exec(akill);
    
    var escaped = shellescape(command);
    exec(escaped, function (error, stdout, stderr) {
      console.log(colors.green(stdout));
      if (error !== null) {
        console.log(colors.red(error));
      }
    }
)}


console.log("Started on port", port);
app.listen(port);
