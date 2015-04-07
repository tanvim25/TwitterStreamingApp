var express = require('express');
var twitter = require('twitter');
//express server
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World')
});
app.listen(8082);

var args=process.argv.slice(2);
var WINDOW = args[0];
var K=args[1];
//Creating a hashmap
var tagmap = {};

//Twitter client
 var client = new twitter({
  consumer_key: 'bH0uAzyUCdyiF7p66leR1DA6K',
  consumer_secret: 'PwLriNTx7GcukLFB33AqUx8jnQmnD2MFj3LlqUdPN8DolcXmp4',
  access_token_key: '185671827-hEPCxK9FhKzSo0FmZM6OPi67256YXfFJOi7iR6it',
  access_token_secret: 'EPiYVc7eE3M9KTTlRZCOXb1ofPwmMebHr6G2kdSBzgOhz'
});



client.stream('statuses/filter',{track: 'science'}, function(stream) {
  stream.on('data', function(tweet) {
    var hashtags= tweet.entities.hashtags;
    console.log(tweet.text);
    //Inserting into the hashmap
    for(var i=0; i < hashtags.length;i++){
        key=hashtags[i].text.toUpperCase();
        if(key in tagmap)
          tagmap[key]++;
        else
          tagmap[key]=1;
    }


    //console.log(hashtags[i].text);
   /* for(var obj in tagmap)
    {
      console.log("hash: "+obj + " count :"+tagmap[obj]);
    }*/
    
    var count=sort.sortCount(tagmap);
    for(var i=0;i<count.length;i++)
      //console.log(count[i]);
      console.log("tag: "+count[i][0] +" count: "+count[i][1]);
    });
 
 //---------------------------------------------------
  stream.on('error', function(error) {
    throw error;
  });
});



//Sorting the hashmap
var sort = {
  sortCount: function(obj){
    var count=[];
    for(var key in obj){
      count.push([key,obj[key]]);
    }
  //  for(var i=0;i<count.length;i++)
    //  console.log(count[i]);
    count.sort(function(a,b){return b[1]-a[1]});
    return count;
  },
}