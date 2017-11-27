import { Component } from '@angular/core';
import {CalendarComponentOptions} from "ion2-calendar";
import {NavParams, ViewController} from "ionic-angular";

/**
 * Generated class for the DatePickerModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'date-picker-modal',
  templateUrl: 'date-picker-modal.html'
})
export class DatePickerModalComponent {

  private CONST_DATE_RANGE = 'dateRange';

  dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range',
    from: new Date(2000, 0),
    to: new Date(2020, 11, 31)
  };

  constructor(public params: NavParams, public viewCtrl: ViewController) {
    let selectedDate = params.get(this.CONST_DATE_RANGE);
    this.dateRange = { from : selectedDate.from, to : selectedDate.to}
  }

  onSave() {
    this.viewCtrl.dismiss(this.dateRange);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
