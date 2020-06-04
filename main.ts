enum airList {
  //% block="Varmelegeme"
  heater,
  //% block="Indre Blæser"
  fan
}
//TEEST GIT
enum pumpList {
  //% block="Luftudskiftning"
  airationPump,
  //% block="Ekstern pumpe 1"
  fert1Pump,
  //% block="Ekstern pumpe 2"
  fert2Pump,
  //% block="Luftsten"
  waterPump,
}

enum lightList {
    //% block="Hvidt lys"
    whiteGrow,
    //% block="Infrarødt lys"
    irGrow,
    //% block="Ultraviolet lys"
    uvGrow,
}

let bufboi = [0, 0, 0, 0, 0, 0901, 0]; //buffboi int atm
// groblocks graphics
//% weight=100 color=#0f9c11 icon="\uf06c"
//% groups="['Aktuatorer', Sensorer']"
namespace groblokke {

  //#########################    INITILIZATION   #########################

function init(){
    serial.redirect(
    SerialPin.P0,
    SerialPin.P1,
    BaudRate.BaudRate9600
  );
  pins.digitalWritePin(DigitalPin.P2, 1);
  basic.showString("v1");
  }

//#########################    END INITILIZATION   #########################


//#########################    SENSORS    #########################

//ReceivedData:1|sequence|Humidity|Water_Level|CO2|Temp|Door| clock
//Indexing for readData
let hum = 0;
let water = 1;
let CO2 = 2;
let temp = 3;
//let door = 4;
let clk = 5;

  //% group="Sensorer"
    /**
    * Luftfugtighedsmåler 0-100 procent
    */
    //% block
  export function Luftfugtighed(): number {
    return bufboi[hum];
  }

  /**
  * Vandstandsmåler
  */
  //% block
  //% group="Sensorer"
  export function Vandstand(): number {
    return bufboi[water];
  }

  /**
  * CO2-Måler ppm
  */
  //% block
  //% group="Sensorer"
  export function co2(): number {
    return bufboi[CO2];
  }
  /**
 * Temperatursensor
 */
 //% block
 //% group="Sensorer"
 export function temperatur(): number {
  return bufboi[temp];
}


  /**
  * Klokken i 24 timersformat. Blokken fjerner foranstillede nuller. Dvs klokken 0800 forstås 800. Der må kun være tal i Tidsblokken dvs ingen 21:00 osv.
  */
  //% block
  //% group="Sensorer"
  export function tid(): number {
    return bufboi[clk];
}
//#########################    END SENSORS    #########################

//#########################    ACTUATORS    #########################
/*Indexing actuators
a,white,
b,uv,
c,ir
d,fert
e,water
f,air
g,changeAIR
h,heater
i,fan
j,time
*/
  /**
  * Angiv hvor intenst lyset skal være på en skala 0 til 100 procent
  */
  //% blockId=mockUpLight block="Lysstyrken for %lightList til %brightness"
  //% group="Aktuatorer"
  //% lightBrigt.min=0 lightBrigt.max=100
  export function groLys(lightType: lightList, lightBrigt: number){
    let lB = lightBrigt.toString();
    if (lightType == 0){
      let output = "a:" + lB + "|x";
      serial.writeString(output);
    } else if (lightType == 1){
      let output = "b:" + lB + "|x";
      serial.writeString(output);
    } else if (lightType == 2){
        let output = "c:" + lB + "|x";
        serial.writeString(output);
  }
}

/**
*Angiv hvor meget flow du ønsker i mililiter per time.
*/
//% blockId=pumpeActu block="Sæt %pumpList til %randNum mL/t"
//% group="Aktuatorer"
export function setPump(actu:pumpList, setting: number){
  let set = setting.toString();
  if (actu == 0){
    let output = "d:" + set + "|x";
    serial.writeString(output);
  }
 else if (actu == 1){
    let output = "e:" + set + "|x";
    serial.writeString(output);
  }
  else if (actu == 2){
     let output = "f:" + set + "|x";
     serial.writeString(output);
   }
   else if (actu == 3) {
      let output = "g:" + set + "|x";
      serial.writeString(output);
    }
 }

 /**
 *Angiv størrelsen på enkeltdosis i mL.
 */
 //% blockId=pumpeActu block="Dosér %randNum mL fra %pumpList"
 //% group="Aktuatorer"
 export function burstPump(actu:pumpList, setting: number){
   let set = setting.toString();
   if (actu == 0){
     let output = "j:" + set + "|x";
     serial.writeString(output);
   }
  else if (actu == 1){
     let output = "k:" + set + "|x";
     serial.writeString(output);
   }
   else if (actu == 2){
      let output = "l:" + set + "|x";
      serial.writeString(output);
    }
    else if (actu == 3) {
       let output = "m:" + set + "|x";
       serial.writeString(output);
     }
  }

  /**
  * Angiv den ønskede temperatur i vækstkammeret i celcius
  * NB. Den indre blæser kører altid når varmelegemet er tændt
  */
  //% blockId=airActu block="Opvarm til %randNum °C"
  //% group="Aktuatorer"
  //% setting.min=0 setting.max=40
  export function setHeat(setting: number){
    let set = setting.toString();
      let output = "h:" + set + "|x";
      serial.writeString(output);
  }

  /**
  * Angiv om den indre blæser skal være tændt eller slukket. Værdien 0 er slukket
  * mens 1 er tændt. NB. Blæseren kører altid når varmelegemet er tændt
  */
  //% blockId=internalFan block="Blæser Sluk/Tænd %randNum"
  //% group="Aktuatorer"
  //% setting.min=0 setting.max=1
  export function fan(setting: number){
    let set = setting.toString();
    let output = "i:" + set + "|x";
    serial.writeString(output);
    }
  //#########################    END ACTUATORS    #########################


  //#########################    DEBUG FUNCTIONS    #########################
let timeString = "N/A";
let fakeTime = 0801;
let fakeTimeString = "0801";
/**
*Display data buffer contents
*/
//% block
//% group="xDebug"
//% advanced=true
  export function fakeTimeFunction(): number{
    return fakeTime;
  }

  /**
  *Display data buffer contents
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function fakeTimeParsedAsInt(): number{
    return parseInt(fakeTimeString);
  }
  /**
  *Display data buffer contents
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function dispDataBuffer(){

    basic.showString("A"); //First string from ardu
    basic.pause(1000);
    basic.showNumber(bufboi[0]); //Hum - Luftfugtighed
    basic.pause(1000);
    basic.showNumber(bufboi[1]); // Water level
    basic.pause(1000);

    basic.showString("B"); //Second string from ardu
    basic.pause(1000);
    basic.showNumber(bufboi[2]); //CO2
    basic.pause(1000);
    basic.showNumber(bufboi[3]); //Temp
    basic.pause(1000);

    basic.showString("C"); //Third string from ardu
    basic.pause(1000);
    basic.showNumber(bufboi[4]); //Door
    basic.pause(1000);
    basic.showNumber(bufboi[5]); //Clock
    basic.pause(1000);
  }

  /**
  * Runs all actuators as a test
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function runActuators(){

    groLys(0,100);  //White light
    basic.pause(2000);
    groLys(0,0);
    basic.pause(500);
    groLys(1,100); //IR Light
    basic.pause(2000);
    groLys(1,0);
    basic.pause(500);
    groLys(2,100);  //UV Light
    basic.pause(2000);
    groLys(2,0);

    basic.pause(1000);

    //basic.showString("P"); // Pumps not checked
    setPump(0,500); //Water pump
    basic.pause(2000);
    setPump(1,500); //airationPump
    basic.pause(2000);
    setPump(2,500); //External pump 1
    basic.pause(2000);
    setPump(3,500); // External pump 2
    basic.pause(2000);
    setPump(0,0);
    basic.pause(2000);
    setPump(1,0);
    basic.pause(2000);
    setPump(2,0);
    basic.pause(2000);
    setPump(3,0);
    //basic.showString("H");
    setHeat(100);
    basic.pause(2000);

    setHeat(0);
    basic.pause(1000);
    //setHeat(0,0);
    //setHeat(1,0);
  }

  /**
  * Displays time as a string
  */
  //% block
  //% group="xDebug"
  //% advanced=true
  export function timeAsString(){
    let readIn = serial.readString();
    let inSplit = readIn.split('|');
    if (inSplit[0] == "c") {
      timeString = inSplit[2];
    }
    basic.showString(timeString);
    bufboi[5] = parseInt(inSplit[2]);
  }


    /**
    * prints string on LEDS and on serial port
    * @param testString string
    */
    //% weight=101 blockGap=8
    //% blockId=testSerialPrint block="Test Serial print: %testString"
    //% group="xDebug"
    //% advanced=true
    export function testSerialPrint(testString: string) : void {
      basic.showString(testString);
      serial.writeString(testString);
    }
  //#########################   END DEBUG FUNCTIONS    #########################

//Calls the initilization function to run on startup
init();

}//Ends namespce
/////////////////////////////////     END OF GROBLOCKS NAMESPACE      /////////////////////////////////



/////////////////////////////////     START OF INBACKGROUND NAMESPACE      /////////////////////////////////

control.inBackground(function () {

  function sensData(){
    let readIn = serial.readString();
    let inSplit = readIn.split('|');
    if (inSplit[0] == "a") {
      //basic.showString("A"); //Debugging ReadData with string on successful read
      //basic.pause(15);
      bufboi[0] = parseInt(inSplit[1]);
      bufboi[1] = parseInt(inSplit[2]);


    } else if (inSplit[0] == "b") {
      //basic.showString("B"); //Debugging ReadData with string on successful read
      //basic.pause(15);
      bufboi[2] = parseInt(inSplit[1]);
      bufboi[3] = parseInt(inSplit[2]);

    } else if (inSplit[0] == "c") {
      //basic.showString("C"); //Debugging ReadData with string on successful read
      //basic.pause(15);
      bufboi[4] = parseInt(inSplit[2]);
      bufboi[5] = parseInt(inSplit[2]);

    }
  }
while(true){
  sensData();
  basic.pause(500);
}

})
