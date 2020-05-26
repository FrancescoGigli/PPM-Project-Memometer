import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { NavController} from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Platform, AlertController, ToastController, List } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { ServicesStorageProvider,Item } from '../../providers/services-storage/services-storage';
import { NativeStorage } from '@ionic-native/native-storage/ngx';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  {
  @ViewChild("barCanvas") barCanvas: ElementRef;
  @ViewChild("myList")mylist: List;
  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  items: Item[] = [];

  chartData0 ={
    key:'',
    value:'',
  }

  chartData1 ={
    key:'',
    value:'',
  }

  chartData2 ={
    key:'',
    value:'',
  }

  chartData3 ={
    key:'',
    value:'',
  }

  chartData4 ={
    key:'',
    value:'',
  }

  chartData5 ={
    key:'',
    value:'',
  }

  chartData6 ={
    key:'',
    value:'',
  }


  newItem: Item = <Item>{};


  data: any;
  currentDate;
  formattedDate:string ;
  formattedDate_0:string ;
  formattedDate_1:string ;
  formattedDate_2:string ;
  formattedDate_3:string ;
  formattedDate_4:string ;
  formattedDate_5:string ;
  formattedDate_6:string ;
  formattedHour;
  progressCounter: number = 0;
  loadProgress: number = 0;	
  dataProgress: number;
  stepsNow: number;
  stepsObj: number;
  stepsPReset: number = 0;
  steps: string;
  savedSteps: string;
  distance: String;
  calories: String;
  velocity: String;
  temperature: String;
  humidity: String;
  pairedList: pairedlist;
  listToggle: boolean = false;
  isConnect: boolean = false;
  pairedDeviceID: number = 0;
  dataSend: string = "";
  output:any;
  message:String;
  responseTxt:any;
  unpairedDevices: any;
  pairedDevices: any;
  statusMessage: string;
  gettingDevices: Boolean;

  private barChart: Chart;
  private lineChart: Chart;

  constructor(public navCtrl: NavController,private nativeStorage: NativeStorage, private plt: Platform, private storage: Storage,private storageService: ServicesStorageProvider, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private toastCtrl: ToastController) {
    this.checkBluetoothEnabled();
    this.currentDate = new Date();
    this.getFormattedDate();
    this.data = {};
  }

    
  // set a key/value
  setValue(key: string, value: any) {
    this.storage.set(key, value).then((response) => {
      console.log('set ' + key + ' ', response);
      //get Value Saved in key
      this.getValue(key);
      this.savedSteps = value;
    }).catch((error) => {
      console.log('set error for ' + key + ' ', error);
    });
  }

  // get a key/value pair
  getValue(key: string) {
    this.storage.get(key).then((val) => {
      console.log('get ' + key + ' ', val);
      this.data[key] = "";
      this.data[key] = val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }

  getValue0(key: string){
    this.storage.get(key).then((val) => {
      this.chartData0.key=key;
      this.chartData0.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }

  getValue1(key: string){
    this.storage.get(key).then((val) => {
      this.chartData1.key=key;
      this.chartData1.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }
  getValue2(key: string){
    this.storage.get(key).then((val) => {
      this.chartData2.key=key;
      this.chartData2.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }
  getValue3(key: string){
    this.storage.get(key).then((val) => {
      this.chartData3.key=key;
      this.chartData3.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }
  getValue4(key: string){
    this.storage.get(key).then((val) => {
      this.chartData4.key=key;
      this.chartData4.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }
  getValue5(key: string){
    this.storage.get(key).then((val) => {
      this.chartData5.key=key;
      this.chartData5.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }

  getValue6(key: string){
    this.storage.get(key).then((val) => {
      this.chartData6.key=key;
      this.chartData6.value=val;
    }).catch((error) => {
      console.log('get error for ' + key + '', error);
    });
  }

  

  // Remove a key/value pair
  removeKey(key: string) {
    this.storage.remove(key).then(() => {
      console.log('removed ' + key);
      this.data[key] = "";
    }).catch((error) => {
      console.log('removed error for ' + key + '', error);
    });
  }

  //Get Current Storage Engine Used
  driverUsed() {
    console.log("Driver Used: " + this.storage.driver);
  }

  // Traverse key/value pairs
  traverseKeys() {
    this.storage.forEach((value: any, key: string, iterationNumber: Number) => {
      console.log("key " + key);
      console.log("iterationNumber " + iterationNumber);
      console.log("value " + value);
    });
  }

  // Traverse key/value pairs
  listKeys() {
    this.storage.keys().then((k) => {
      console.table(k)
    });
  }

  // Total Keys Stored
  getKeyLength() {
    this.storage.length().then((keysLength: Number) => {
      console.log("Total Keys " + keysLength);
    });
  }



  refreshChart(){
  this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    type: "line",
    data: {
      labels: [ this.chartData6.key,this.chartData5.key,this.chartData4.key,this.chartData3.key,
        this.chartData2.key,this.chartData1.key, this.chartData0.key],
      datasets: [
        {
          label: "Steps",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(56,128,255,1)",
          borderColor: "rgba(56,128,255,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(255,0,0,1)",
          pointBackgroundColor: "rgba(255,0,0,1)",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [this.chartData6.value,this.chartData5.value,this.chartData4.value,this.chartData3.value,
            this.chartData2.value,this.chartData1.value, this.steps],
          spanGaps: false
        }
      ]
    }
  });
}

  
  getFormattedDate(){
    setInterval(() =>{
      var dateObj = new Date()

      var day = ((dateObj.getDate() < 10 ? '0' : '') + dateObj.getDate()).toString();
      var month = dateObj.getMonth().toString();
      var year = dateObj.getFullYear().toString();
      var hour = dateObj.getHours().toString();
      var minutes = ((dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes()).toString();
      var sec = ((dateObj.getSeconds() < 10 ? '0' : '') + dateObj.getSeconds()).toString();

      var day_1=(dateObj.getDate()-1).toString();
      var day_2=(dateObj.getDate()-2).toString();
      var day_3=(dateObj.getDate()-3).toString();
      var day_4=(dateObj.getDate()-4).toString();
      var day_5=(dateObj.getDate()-5).toString();
      var day_6=(dateObj.getDate()-6).toString();


      
       var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

       this.formattedDate_0 = day + '/' +monthArray[month] ;
       this.formattedDate_1 = day_1 + '/' +monthArray[month] ;
       this.formattedDate_2 = day_2 + '/' +monthArray[month] ;
       this.formattedDate_3 = day_3 + '/' +monthArray[month] ;
       this.formattedDate_4 = day_4 + '/' +monthArray[month] ;
       this.formattedDate_5 = day_5 + '/' +monthArray[month] ;
       this.formattedDate_6 = day_6 + '/' +monthArray[month] ;

 

      this.formattedDate = day + '/' +monthArray[month] + '/' + year + '' ;
      this.formattedHour = hour + ':' + minutes + ':' + sec;

    }, 10);
  }
    


  progressUp(){
    if(this.loadProgress < 100)
    this.loadProgress++;
  }

  
	ionViewDidLoad(){
		setInterval(() => {
			if(this.stepsObj < this.dataProgress && ((this.stepsObj/this.dataProgress)==(this.progressCounter/100))){
        this.progressUp();
        this.progressCounter++;
			}
		}, 10);

  }
  

  

  checkBluetoothEnabled() {
    this.bluetoothSerial.isEnabled().then(success => {
      this.listPairedDevices();
    }, error => {
      this.showError("Please Enable Bluetooth")
    });
  }

  listPairedDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairedList = success;
      this.listToggle = true;
    }, error => {
      this.showError("Please Enable Bluetooth")
      this.listToggle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairedList[this.pairedDeviceID];
    if (!connectedDevice.address) {
      this.showError('Select Paired Device to connect');
      return;
    }
    let address = connectedDevice.address;
    let name = connectedDevice.name;

    this.connect(address);
  }

  
  connect(address) {
    // Attempt to connect device with specified address, call app.deviceConnected if success
    this.bluetoothSerial.connect(address).subscribe(success => {     
      this.showToast("Successfully Connected");
    }, error => {
      this.showError("Error:Connecting to Device");
    });
  }
  

 success = (data) => alert(data);
 fail = (error) => alert(error);


  deviceDisconnected() {
    // Unsubscribe from data receiving
    this.bluetoothSerial.disconnect();
    this.showToast("Device Disconnected");
  }


  
  sendData() {
    this.dataProgress=parseInt(this.dataSend,10);
    if(this.dataProgress > 100){
      this.progressCounter = 0;
      this.loadProgress = 0;
      this.stepsPReset = this.stepsNow;
      this.dataSend+='\n';
      this.showToast(this.dataSend);
    } else {
      this.showError("It must be greater than 100!");
    }
  }

dataRead(){
  this.refreshChart();
  setInterval(() => {
    this.bluetoothSerial.readUntil('\n').then((data: any) => {
      if (data.indexOf("\n") != -1) {
           this.steps = data.substring(26, data.lenght);
           this.distance = data.substring(0, 5);
           this.calories = data.substring(6, 9);
           this.temperature = data.substring(10, 14);
           this.humidity = data.substring(15, 20);
           this.velocity = data.substring(21, 25);
           this.stepsNow = parseInt(this.steps,10);
           this.stepsObj = this.stepsNow - this.stepsPReset;
           this.setValue(this.formattedDate_0, this.steps);
           this.getValue0(this.formattedDate_0);
           this.getValue1(this.formattedDate_1);
           this.getValue2(this.formattedDate_2);
           this.getValue3(this.formattedDate_3);
           this.getValue4(this.formattedDate_4);
           this.getValue5(this.formattedDate_5);
           this.getValue6(this.formattedDate_6);  
      }
    });
  }, 0);
}

setValue2(){
  this.setValue(this.formattedDate, 21);
  this.getValue(this.formattedDate);
  this.listKeys();
  this.traverseKeys();
}

  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: error,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(msj) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 1000
    });
    toast.present();

  }

}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}



