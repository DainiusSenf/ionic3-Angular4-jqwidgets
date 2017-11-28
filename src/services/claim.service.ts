import {Injectable} from '@angular/core';
import {SalesforceService} from "./salesforce.service";

@Injectable()
export class ClaimService {

  constructor(private sfdc: SalesforceService) {}


  public getFilteredClaimLines(filters): Promise<any> {
    return this.sfdc.execute('CTRL_ClaimLines', 'getClaimLines', {filters: filters})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }

  public getUserClaims(): Promise<any> {
    return this.sfdc.execute('CTRL_WTaxCommunityApp','getUserClaims', {})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }

  public getUserClaimsChart(): Promise<any> {
    return this.sfdc.execute('CTRL_WTaxCommunityApp','getUserClaimsChart', {})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }

  public getUserClaimLinesTable(): Promise<any> {
    return this.sfdc.execute('CTRL_WTaxCommunityApp','getUserClaimLines', {})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }

  public getClaimsByCountry(filter): Promise<any> {
    return this.sfdc.execute('CTRL_ClaimLines','getClaimLinesAmountByCountry',{filters: filter})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }

  public getClaimsByStatus(filter): Promise<any> {
    return this.sfdc.execute('CTRL_ClaimLines','getClaimLinesAmountByStatus', {filters: filter})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }

  public getUserInformation(): Promise<any> {
    return this.sfdc.execute('CTRL_WTaxCommunityApp','getUserInformation', {})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }
}
