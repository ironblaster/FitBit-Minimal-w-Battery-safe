import * as messaging from "messaging";
import { geolocation } from "geolocation";


//roba nuova---------------------
var API_KEY = "56fcdd4493214db7d84b8c4711be375a";

// Fetch the weather from OpenWeather
function queryOpenWeather() {  
  geolocation.getCurrentPosition(locationSuccess, locationError);
  function locationSuccess(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    var linkApi = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="  + long + "&units=metric" + "&appid=" + API_KEY;
  fetch(linkApi)
  .then(function (response) {
      response.json()
      .then(function(data) {
        // We just want some data
        var weather = {
          chiamata: "meteo",
          temperature: Math.round(data["main"]["temp"]),
          humidity: data["main"]["humidity"],
          location: data["name"],
          icon:data["weather"][0]["icon"],
         
        }
        // Send the weather data to the device
        returnWeatherData(weather);
      });
  })
  .catch(function (err) {
    console.log("Error fetching weather: " + err);
  });
    
    
    
 };
 function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}
}







// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log("Error: Connection is not open");
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {

  if (evt.data && evt.data.command == "weather") {
    // The device requested weather data
    queryOpenWeather();
  }
    if (evt.data && evt.data.command === "alpha") {
    chiamata();
  }
  
  
   if (evt.data && evt.data.command === "spotify") {
    chiamataSpotify();
  }
  
  
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}





//fine roba nuova----------------------
function chiamataSpotify() {
    fetch("https://tomcat.ironblaster.net/HomeServlet/spotify")
        .then(response => response.text())
        .then((response) => {
           returnSpotifyValue(response);
        })
        .catch(err => { returnSpotifyValue(err);});
}

function chiamata() {
    fetch("https://tomcat.ironblaster.net/HomeServlet/binance")
        .then(response => response.text())
        .then((response) => {
           returnAlphaValue(response);
        })
        .catch(err => { returnAlphaValue(err);});
}
 
function returnSpotifyValue(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    
       var spotify = {
          chiamata: "spotify",
          data: data
        }
    
    messaging.peerSocket.send(spotify);
  } else {
    console.error("Error: Connection is not open");
  }
}


function returnAlphaValue(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    
       var binance = {
          chiamata: "binance",
          data: data
        }
    
    messaging.peerSocket.send(binance);
  } else {
    console.error("Error: Connection is not open");
  }
}


messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});