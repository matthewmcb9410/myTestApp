import { Component, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  output: any;
  message: String;
  responseTxt: any;
  unpairedDevices: any;
  pairedDevices: any;
  statusMessage: string;
  gettingDevices: Boolean;

  constructor(public loadCtrl: LoadingController, private bluetoothSerial: BluetoothSerial, private alertCtrl: AlertController,
    public navCtrl: NavController, private ngZone: NgZone) {
    bluetoothSerial.enable();
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {

      });
    },
      (err) => {
        console.log(err);
      });

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      });
  }
  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectDevice(address: any) {

    const alert = this.alertCtrl.create({
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);

          }
        }
      ]
    });
  }

  disconnect() {
    const alert = this.alertCtrl.create({
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
            this.gettingDevices = null;
          }
        }
      ]
    });
  }

  next() {
    this.navCtrl.navigateForward('TerminalPage');
  }

  data() {
    setInterval(() => {
      this.read1();
    }, 3000);


  }

  read() {
    this.bluetoothSerial.read().then((data) => {
      this.message = data;

    });
  }

  read1() {
    this.ngZone.run(() => {
      this.read();
    });
  }
}
