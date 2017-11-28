import {Injectable} from '@angular/core';
import {SalesforceService} from "./salesforce.service";

@Injectable()
export class CurrenciesService {

  constructor(private sfdc: SalesforceService) {
  }

  public getCurrencies(): Promise<any> {
    return this.sfdc.execute('CTRL_Currencies', 'getCurrencies', {})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }
}
