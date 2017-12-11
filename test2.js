var express = require('express');
var fs = require('fs');
var app = express();


app.use(express.bodyParser());


app.post('/search', function(req, res){
	console.log(getTitles(req.body.search));
	//res.send(req.body);
});


function getTitles(search) {
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
        
        return results;
        
    });
    
    return results;

}

function reg(input) {
    var flags;
    //could be any combination of 'g', 'i', and 'm'
    flags = 'gi';
    return new RegExp('.*' + input + '.*', flags);
}

app.listen(3000);