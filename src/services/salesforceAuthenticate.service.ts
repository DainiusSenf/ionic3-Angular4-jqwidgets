import {Injectable} from '@angular/core';
import {SalesforceService} from './salesforce.service';
import * as jsforce from 'jsforce';

@Injectable()
export class SalesforceAuthenticate {

  constructor(private salesforceService: SalesforceService) {}

  public authenticate() {
    let sf = (<any>window)._sf;
    return new Promise((resolve, reject) => {
      if (this.salesforceService.conn) {
          console.log('Already authenticated with SF');
          resolve(true);
      } else if (sf.api) {
        console.log('Authenticated using session API');
        console.log('${window.location.protocol}//${window.location.hostname}');
        console.log(`${window.location.protocol}//${window.location.hostname}`);
        console.log(sf.api);

        this.salesforceService.conn = new jsforce.Connection({
          sessionId: sf.api,
          serverUrl: `${window.location.protocol}//${window.location.hostname}`
        });
        resolve(true);
      } else if (sf.auth) {
        this.salesforceService.authenticate(sf.auth.login_url, sf.auth.username, sf.auth.password, sf.auth.oauth2)
          .then((res) => {
            console.log('Authenticated using session login details');
            resolve(true);
          }, (reason) => {
            console.log('Failed to authenticate');
            console.log(reason);
            resolve(true);
          });
      }
    });
  }

}
