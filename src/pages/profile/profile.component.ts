import {Component, OnInit} from '@angular/core';
import {ClaimService} from '../../services/claim.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  private userInfo: object;
  private clientName: String;
  private crmName: String;

  constructor(private claimService: ClaimService) {
    this.claimService.getUserInformation().then(res => {
      console.log('profile');
      console.log(res);
      if(res && res[0].Contact) {
        this.clientName = res[0].Contact.Account.Name;
        this.crmName = res[0].Contact.Account.CRM__r.Name;
      }
      this.userInfo = res;
    });
  }


  ngOnInit() {
  }

}
