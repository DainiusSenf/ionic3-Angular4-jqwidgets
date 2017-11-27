import {Injectable} from '@angular/core';
import {SalesforceService} from "./salesforce.service";
import {Filter, FilterValues} from "../models/filterSettings";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class FilterService {

  public filterValues: FilterValues;
  public filter: Filter;
  public filterSubject = new Subject<any>();

  constructor(private sfdc: SalesforceService) {
    this.filterValues = new FilterValues();
    this.filter = new Filter();
  }

  filterDataTable(parentComponent) {
    this.filterSubject.next(parentComponent);
  }

  getFilterSubjectObs(): Observable<any> {
    return this.filterSubject.asObservable();
  }

  public getStatusValues(filter): Promise<any> {
    return this.sfdc.execute('CTRL_Filtering', 'getPicklistsValues', {filter: filter})
      .then((res) => {
        return res;
      }, (err) => {
      });
  }
}
