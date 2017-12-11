var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.bodyParser());

/*app.get('/endpoint', function(req, res){
	var obj = {};
	obj.title = 'title';
	obj.data = 'data';
	
	console.log('params: ' + JSON.stringify(req.params));
	console.log('body: ' + JSON.stringify(req.body));
	console.log('query: ' + JSON.stringify(req.query));
	
	res.header('Content-type','application/json');
	res.header('Charset','utf8');
	res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
});*/

app.post('/endpoint', function(req, res){
	var obj = {};
	console.log(getTitles(req.body.search));
	//console.log(req.body.search);
	res.send(req.body);
});


function getTitles(search, callback) {

    function reg(input) {
        var flags;
        //could be any combination of 'g', 'i', and 'm'
        flags = 'gi';
        return new RegExp('.*' + input + '.*', flags);
    }
    
    var regex = reg(search);
    
    var results = [];
    
    fs.readFile("midilist.txt", "utf8", function(err, data) {
        if (err) throw err;
        
        let m;
        
        while ((m = regex.exec(data)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                results.push(match);
            });
        }
        
        
        console.log(results);
        
    });
    
    return results;

};



app.listen(3000);