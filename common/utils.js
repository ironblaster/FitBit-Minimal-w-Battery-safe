// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}



export function iconBatteryChange(battValue,batteria) {
   if(battValue>=0&&battValue<=10)
   batteria.href=`batteryicons/battery-10.png`;
   else if(battValue>10&&battValue<=20)
   batteria.href=`batteryicons/battery-20.png`;
   else if(battValue>20&&battValue<=50)
   batteria.href=`batteryicons/battery-50.png`;
   else if(battValue>50&&battValue<=60)
   batteria.href=`batteryicons/battery-60.png`;
   else if(battValue>60&&battValue<=80)
   batteria.href=`batteryicons/battery-80.png`;
    else if(battValue>80&&battValue<=90)
   batteria.href=`batteryicons/battery-90.png`;
    else if(battValue>90&&battValue<=100)
   batteria.href=`batteryicons/battery-100.png`;
  return;
}

export function iconMeteoChange(nomIcon,meteoIcon) {
  
   meteoIcon.href=`meteo/`+nomIcon+`.png`;
  return;
}





/*export function controlloConnessione(messaging,bluetoothstatus){
  
  

if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {

}
else if (messaging.peerSocket.readyState === messaging.peerSocket.CLOSED) {
   bluetoothstatus.href=`bluetooth/bluetooth-disabled.png`;
}
  
  return;
  
  
}*/



