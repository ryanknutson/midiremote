var fs = require('fs');

function getTitles(search) {

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
                console.log(`Found match, group ${groupIndex}: ${match}`);
                results.push(match);
    
                
            });
        }
        
        
        console.log(results);
    
        
        
    });

};