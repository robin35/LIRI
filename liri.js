require("dotenv").config();

var keys = require('./keys.js');
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var fs = require("fs");

//console.log( "keys: " + keys );

var liriCommand = process.argv[2];
var searchTerm = process.argv[3];

//==============================================================================================================================
// Bands in Town API
//==============================================================================================================================

callBands = function() {
    
  var id = keys.bands.app_id;
  
  axios.get("https://rest.bandsintown.com/artists/"+searchTerm+"/events?app_id=" + id ).then(
    function(response) {

      var results = response.data;

      for (var i = 0; i < results.length; i++) {
        var j = i+1;
        console.log(" ");
        console.log("Event Num: ", j);
        console.log("Name of the venue: ", results[i].venue.name);
        console.log("Venue location: ", results[i].venue.city);
        console.log("Date of the Event: ", moment(results[i].venue.datetime).format("L"));

        writeFile(results);
      }
    })

  .catch(function(err) {
    console.log('Bands in Town Error Occurred: ' + err);
  });
};



//==============================================================================================================================
// Spotify API
//==============================================================================================================================

callSpotify = function() {

  if( searchTerm === ""){
    searchTerm = "The Sign Ace of Base"
  }
  
  var id = keys.spotify.id;
  var secret = keys.spotify.secret;

  var spotify = new Spotify({
      id,
      secret
  });
      
  spotify.search({ type: 'track', query: searchTerm }, function(err,data) {
    if (err) {
      return console.log('Spotify Error Occurred: ' + err);
    }
    
    var results = data.tracks.items;

    console.log(" ");
    console.log("Artist(s): ", results[0].artists[0].name);
    console.log("Song Name: ", results[0].name);
    console.log("Preview Link: ", results[0].preview_url);
    console.log("Album Name: ", results[0].album.name);

    writeFile(results);
  })
}



//==============================================================================================================================
// OMDb (Open Movie Database) API
//==============================================================================================================================

callOMDB = function() {

  if( searchTerm === ""){
    searchTerm = "Mr. Nobody"
  }

  var id = keys.omdb.key;
 
  axios.get("http://www.omdbapi.com/?t="+searchTerm+"&apikey="+id).then(
    function(response) {

      var results = response.data;

      console.log(" ");
      console.log("Movie Title: ", results.Title);
      console.log("Year Released: ", results.Year);
      console.log("IMDB Rating: ", results.imdbRating);
      console.log("Rotten Tomatoes Rating: ", results.Ratings[1].Value);
      console.log("Country Where Produced: ", results.Country);
      console.log("Language: ", results.Language);
      console.log("Plot: ", results.Plot);
      console.log("Actors: ", results.Actors);

      writeFile(results);
    })

    .catch(function(err) {
    console.log('OMDB Error Occurred: ' + err);
    });
};



//==============================================================================================================================
// Do What it Says
//==============================================================================================================================

callRandom = function() {

  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    var dataArr = data.split(",");

    liriCommand = dataArr[0];
    searchTerm = dataArr[1];

    if( liriCommand === "concert-this"){
      callBands();
    }
    
    if( liriCommand  === "spotify-this-song"){
      callSpotify();
    }
    
    if( liriCommand  === "movie-this"){
      callOMDB();
    }

  });
}


//==============================================================================================================================
// Write Query to Text File
//==============================================================================================================================


writeFile = function(results) {
  fs.appendFileSync("log.txt", JSON.stringify(results)+'\r\n', function(err) {
      if(err){
          return console.log(err); 
          
      };
      console.log("log.txt was updated!");
  });

}


//==============================================================================================================================
// MAIN PROCESS
//==============================================================================================================================

if( liriCommand === "concert-this"){
  callBands();
}

if( liriCommand === "spotify-this-song"){
  callSpotify();
}

if( liriCommand === "movie-this"){
  callOMDB();
}

if( liriCommand === "do-what-it-says"){
  callRandom();
}