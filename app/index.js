import clock from "clock";
import { battery } from "power";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { charger } from "power";
import { me as appbit } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { localizedDate } from "./locale-date";
import * as messaging from 'messaging';





// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const orologio = document.getElementById("orologio");
const giorno = document.getElementById("giorno");
const batteria = document.getElementById("battery");
const meteoimg = document.getElementById("meteoimg");
const temperature = document.getElementById("temperature");
const localizzazione = document.getElementById("localizzazione");

const ripplevalue = document.getElementById("ripplevalue");
const spotifyvalue = document.getElementById("spotifyvalue");
const batterypercentage = document.getElementById("batterypercentage");
const valorecuore = document.getElementById("cuorevalue");
const iconspoty = document.getElementById("spotify");
batterypercentage.text=battery.chargeLevel+"%";
util.iconBatteryChange(battery.chargeLevel,batteria);


//*******************sezione meteo*************************

// **************CHIAMATE REMOTE AL COMPANION****************
function fetchWeather() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

function fetchAlpha() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: "alpha"
    });
  }
}

function fetchSpotify() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the companion
    messaging.peerSocket.send({
      command: "spotify"
    });
  }
}
// **************FINE CHIAMATE REMOTE AL COMPANION****************




//funzioni per processare  i dati ricevuti dalle chiamate companion
function processWeatherData(data) {
    temperature.text=data.temperature+"°"+"C"; 
  
 // console.log("batteryu trsdt: " + data.test);
 // console.log("The location is : " + data.location);
  //console.log("Icon:" + data.icon);
  localizzazione.text=data.location;
  util.iconMeteoChange(data.icon,meteoimg);
  
 // meteoimg.href="http://openweathermap.org/img/wn/"+data.icon+".png";
}

function processAlphaData(data) {
ripplevalue.text=data.data.split('\n')[1].replace("&euro;","€");
  
}

function processspotifyData(data) {

spotifyvalue.text=data.data.split('\n')[0];
  if(spotifyvalue.text=="")
    iconspoty.style.display = "none";
  else
    iconspoty.style.display = "inline";
  
}



  // PRIMO FETCH ALL AVVIO DELLA CONNESSIONE CON IL COMPANION
messaging.peerSocket.onopen = function() {
  fetchWeather();
  fetchAlpha();
  fetchSpotify();
}


// Listner delle richieste del companion (creato l'oggetto chiamata per non fare troppe chiamate uguali)
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data) {
    if(evt.data.chiamata ==="meteo")
    processWeatherData(evt.data);
     if (evt.data.chiamata === "binance") 
    processAlphaData(evt.data);
       if (evt.data.chiamata === "spotify") 
    processspotifyData(evt.data);
 
  }
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

//*****************fine sezione meteo*********************
















// Fetch value binance every 5 minutes
//setInterval(fetchAlpha, 5 * 1000 * 60);

//fetch value meteo every 30 minutes
setInterval(fetchWeather, 15 * 1000 * 60);





//i nuovi cambio lingua
var date = new Date();
giorno.text =localizedDate(date)[0]+" "+localizedDate(date)[3];
//--------------------------

//controllo periodico cambio icona batteria
battery.onchange = (charger, evt) => {
  
 batterypercentage.text=battery.chargeLevel+"%";
    if(battery.charging==true)
   batteria.href=`batteryicons/battery-charge.png`;
  else
  util.iconBatteryChange(battery.chargeLevel,batteria);
}




if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    valorecuore.text=hrm.heartRate;

   
  });
  display.addEventListener("change", () => {
    // Automatically stop the sensor when the screen is off to conserve battery
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
}











//aggiornamento valore orario
clock.ontick = (evt) => {
 
  
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  orologio.text = `${hours}:${mins}`;
}

display.onchange = function () {
  if (display.on) { 
        date = new Date();
        giorno.text =localizedDate(date)[0]+" "+localizedDate(date)[3];
     fetchWeather();
   fetchAlpha();
  fetchSpotify();
    
  }
}


