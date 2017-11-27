import { Component } from '@angular/core';
import {SalesforceService} from "../../services/salesforce.service";

@Component({
  selector: 'logout',
  templateUrl: 'logout.html'
})
export class LogoutComponent {

  text: string;

  constructor(salesforceService : SalesforceService) {
    salesforceService.endSession();
  }

}
