var express = require('express');
var fs = require('fs');
var path = require("path");
var app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Port the server runs on
var port = 8080;



app.use(express.bodyParser());

app.post('/search', function(req, res){
	getTitles(req.body.search, res);
});

app.post('/play', function(req, res){
	console.log('playing...', req.body.file);
	res.send(200,{"Content-Type": "application/json"});
});

app.get('/', function (req, res) {
  res.render("index");
});



function getTitles(search, res) {
    
    var regex = reg(search);
    var results = [];
    
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
                results.push(match);
                
            });
        }
        
        // send results to client
        res.json(results);
    });
}


function reg(input) {
    var flags;
    //could be any combination of 'g', 'i', and 'm'
    flags = 'gi';
    return new RegExp('.*' + input + '.*', flags);
}


console.log("Started on port", port);
app.listen(port);