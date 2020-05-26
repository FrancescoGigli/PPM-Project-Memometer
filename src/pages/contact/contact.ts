import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController, ToastController } from 'ionic-angular';



@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage { currentDate;
  formattedDate;
  formattedHour;
  progressCounter: number = 0;
  loadProgress: number = 0;	
  dataProgress: number;
  stepsNow: number;
  stepsObj: number;
  stepsPReset: number = 0;
  steps: string;
  distance: String;
  calories: String;
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

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private bluetoothSerial: BluetoothSerial, private toastCtrl: ToastController) {
    this.checkBluetoothEnabled();
    this.currentDate = new Date();
    this.getFormattedDate();
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

      


      var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
      this.showToast("Il valore deve essere più grande di 100!")
    }
  }

dataRead(){
  setInterval(() => {
    this.bluetoothSerial.readUntil('\n').then((data: any) => {
      if (data.indexOf("\n") != -1) {
           this.steps = data.substring(20, data.lenght);
           this.distance = data.substring(0, 5);
           this.calories = data.substring(6, 9);
           this.temperature = data.substring(10, 14);
           this.humidity = data.substring(15, 20);
           this.stepsNow = parseInt(this.steps,10);
           this.stepsObj = this.stepsNow - this.stepsPReset;
      }
    });
  }, 0);
}

  showError(error) {
    let alert = this.alertCtrl.create({
      title: 'Error',
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
