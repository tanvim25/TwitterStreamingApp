var twitter = require('twitter');

var args=process.argv.slice(2);
var WINDOW_SIZE = args[0];    //no. of tweets after which output is written
var K=args[1];    //no of top hashtags

var tagmap = {};    //holds the hashtags and their counts
var tweets = {};    //holds tweets and their hashtags
var tweetcount=0;
var c=0;

//Twitter client
 var client = new twitter({
  consumer_key: 'bH0uAzyUCdyiF7p66leR1DA6K',
  consumer_secret: 'PwLriNTx7GcukLFB33AqUx8jnQmnD2MFj3LlqUdPN8DolcXmp4',
  access_token_key: '185671827-hEPCxK9FhKzSo0FmZM6OPi67256YXfFJOi7iR6it',
  access_token_secret: 'EPiYVc7eE3M9KTTlRZCOXb1ofPwmMebHr6G2kdSBzgOhz'
});

//stream the hashmaps which contains hashtags and english characters only
client.stream('statuses/filter', {track: '#', language:'en'},function(stream) {
  stream.on('data', function(tweet) {
    var hashtags= tweet.entities.hashtags;
//    console.log(tweet.text);

//Remove older tweets and thier respective from the map
   var p=tweets[tweetcount];
   if(p!=undefined)
    {
      x=p.shift();
      while(x!=null && x!=undefined)
      {
//decrement the count of hashtags. if it reaches 0, remove that tag from map.
      tagmap[x]= parseInt(tagmap[x])-1;
      if(parseInt(tagmap[x])==0)
        delete tagmap[x];
      x=p.shift();
     }
  }
//Inserting new hashtags into the hashmap
    tweets[tweetcount]=new Array();
    for(var i=0; i < hashtags.length;i++){
        key=hashtags[i].text.toUpperCase();
        //Add hastag to the tweet array
        tweets[tweetcount].push(key);      
        if(key in tagmap)
          tagmap[key]++;
        else
          tagmap[key]=1;  
    }
    
    if(tweets[tweetcount].length===0)
        delete tweets[tweetcount];
    tweetcount = (tweetcount+1)%WINDOW_SIZE;
   
//Print the results after WINDOW_SIZE no. of tweets
    if(c==parseInt(WINDOW_SIZE)-1)
    {
       var count=sort.sortCount(tagmap);
       console.log("--------------------------");
        for(var i=0;i<count.length&& i<K;i++)
            console.log(count[i][0] +" : "+count[i][1]);
       console.log("--------------------------");
    }
    c=(c+1)%WINDOW_SIZE;    
    });

 //---------------------------------------------------
  stream.on('error', function(error) {
   // client.destroy();
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
    count.sort(function(a,b){return b[1]-a[1]});
    return count;
  },
}