
const express = require("express"); 
const app =  express();
// Read Synchrously
var fs = require("fs");
var JSONStream = require('JSONStream');
var  es = require('event-stream');
var request = require('request');
var bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

var JobSeekersDetatils; 
var counter = 1; 








  
app.listen("3000", ()=>{
    console.log("App currently running on port 3000");
}); 


app.get("/", (req,res)=>{
   
    
    res.sendFile( __dirname+'/emailsforjobseekers.json')
});



app.post("/add", (req,res)=>{
    var request = require('request');
    req.setTimeout(10000000000000);

    request('http://localhost:3000/', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // preserve newlines, etc - use valid JSON
          body = body.replace(/\\n/g, "\\n")  
              .replace(/\\'/g, "\\'")
              .replace(/\\"/g, '\\"')
              .replace(/\\&/g, "\\&")
              .replace(/\\r/g, "\\r")
              .replace(/\\t/g, "\\t")
              .replace(/\\b/g, "\\b")
              .replace(/\\f/g, "\\f");
              // remove non-printable and other non-valid JSON chars
              body = body.replace(/[\u0000-\u0019]+/g,""); 
      
      
          JobSeekersDetatils = JSON.parse(body); 
          console.log(JobSeekersDetatils.length)

        var i;
        
        // for (i = 2807; i > 2496; i--) 
        // { 
        //      addUsers(JobSeekersDetatils[i].email ,JobSeekersDetatils[i].fullName, i)

           
        // } 
        for (i = 2808; i < JobSeekersDetatils.length; i++ )
        { 
             addUsers(JobSeekersDetatils[i].email ,JobSeekersDetatils[i].fullName, i)

           
        } 

      


        res.send("Users where added"); 



   
        }
      })
      
});

function addEmailToMailChimp(email, name){
    var options = { method: 'POST',
      url: 'https://us18.api.mailchimp.com/3.0/lists/62c2720958/members',
      headers: 
       { 'Postman-Token': '892fa5d3-08f2-41bb-9b17-af8a7440a940',
         'Cache-Control': 'no-cache',
         Authorization: '207157121238bd5bb53fd68559bae82e-us18',
         'Content-Type': 'application/json' },
      body: 
       { email_address: email,
         status: 'subscribed',
         merge_fields: { FNAME: name } },
      json: true };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
              console.log(body.status);

              console.log("This user has been added to our server for the "+ counter + " times");
    counter ++;


    });
    

}

function addUsers(email,name, index){
    request({
        url: 'https://us18.api.mailchimp.com/3.0/lists/62c2720958/members',
        json: {
            'email_address': email,
            'user': 'anystring:207157121238bd5bb53fd68559bae82e-us18',
            'status': 'subscribed',
            'merge_fields': {
                'FNAME':name
               
            }
        },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'apikey 207157121238bd5bb53fd68559bae82e-us18'
        }
    }, function(error, response, body){
        if(error) {
            console.log(error);
            console.log("FAILED TO ADD USER "+ counter + "times");
        } else {
       
            if(body.status == 400){
                console.log("User with this email address "+email + "last index "+index);
            }
            else{
                console.log("added  "+email +" position: "+counter);
                counter ++;
            }
        }
    });
}