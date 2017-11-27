export class FilterSettings {
  public settingsCountries = {};
  public settingsClaimTypes = {};
  public settingsStatuses = {};
  public settingsBeneficialOwners = {};
  public settingsPortfolios = {};
  public settingsCurrency = {};

  constructor(){
    this.settingsCurrency = {
      singleSelection: true,
      text: "Select Currency",
      enableSearchFilter: true
    };

    this.settingsCountries = {
      singleSelection: false,
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3
    };

    this.settingsClaimTypes = {
      singleSelection: false,
      text: "Select Claim Type",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3
    };

    this.settingsStatuses = {
      singleSelection: false,
      text: "Select Statuses",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3
    };


    this.settingsBeneficialOwners = {
      singleSelection: false,
      text: "Select Beneficial Owners",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3
    };

    this.settingsPortfolios = {
      singleSelection: false,
      text: "Select Portfolios",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 3
    };
  }
}

export class FilterValues {
  public countriesList = [];
  public statusesList = [];
  public claimTypesList = [];
  public beneficialOwnersList = [];
  public portfolioList = [];
  public currencyList = [];

  public selectedCountries = [];
  public selectedClaimTypes = [];
  public selectedStatuses = [];
  public selectedBeneficialOwners = [];
  public selectedPortfolios = [];
  public selectedCurrency;

  public divPaymentDateRange: { from: string; to: string; };
  public paymentDateRange: { from: string; to: string; };
  public claimSubmissionDateRange: { from: string; to: string; };
  public expectedRefundDateRange: { from: string; to: string; };

  constructor(){
    this.currencyList = [
      { "id": 1, "itemName": "GBP" },
      { "id": 2, "itemName": "EUR" },
      { "id": 3, "itemName": "ZAR" },
      { "id": 4, "itemName": "PLN" }
    ];

    this.divPaymentDateRange = {from : '', to : ''};
    this.claimSubmissionDateRange = {from : '', to : ''};
    this.paymentDateRange = {from : '', to : ''};
    this.expectedRefundDateRange = {from : '', to : ''};
  }
}

export class Filter {

  public currency: string;
  public claimTypes: Array<String>;
  public statuses: Array<String>;
  public countries: Array<String>;
  public beneficialOwners: Array<String>;
  public portfolios: Array<String>;
  public dividendPaymentDateFrom: string;
  public dividendPaymentDateTo: string;
  public claimSubmissionDateFrom: string;
  public claimSubmissionDateTo: string;
  public paymentDateFrom: string;
  public paymentDateTo: string;
  public pageNo: number;
  public pageSize: number;
  public orderBy: Array<String>;
  public orderDirection: string;

  constructor(){
    this.claimTypes = [];
    this.statuses = [];
    this.countries = [];
    this.beneficialOwners = [];
    this.portfolios = [];
  }
}
