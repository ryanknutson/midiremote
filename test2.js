var express = require('express');
var fs = require('fs');
var app = express();


app.use(express.bodyParser());


app.post('/search', function(req, res){
	getTitles(req.body.search, res);
	//res.send(req.body);
	//res.send(200);
});


function getTitles(search, res) {
    var regex = reg(search);
    var results = [];
    
    fs.readFile("midilist.txt", "utf8", function(err, data) {
        if (err) throw err;
        
        let m;
        
        while ((m = regex.exec(data)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            m.forEach((match, groupIndex) => {
                results.push(match);
                
            });
        }
        res.send(results);
    });
}

function reg(input) {
    var flags;
    //could be any combination of 'g', 'i', and 'm'
    flags = 'gi';
    return new RegExp('.*' + input + '.*', flags);
}

app.listen(3000);