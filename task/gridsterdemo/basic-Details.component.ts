import { Component, OnInit, ViewChild, Input, EventEmitter, Output, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api-service.service';
import { UniCoreService } from '../../Services/uni-core.service';
import { userService } from '../../Services/user.service';
import { TenderBasicDetails } from '../../Model/ten-TenderBasicDetails';
import { CodesService } from '../../Services/Codes.service';
import { BasicDetailsService } from '../services/basic-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TermsAndConditionPopUpComponent } from '../../Tendering/terms-and-condition-popup/terms-and-condition-popup.component';
import { AddFieldsPopUpComponent } from '../../Tendering/add-fields-popup/add-fields-popup.component';
import { AddFieldsService } from '../services/add-fields.service';
import { ExtraFildsClass } from '../../Model/ten-ExtraField';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GeneralService } from '../../Services/GeneralService';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

import swal from 'sweetalert2';
declare var alert: any;
declare var $: any;

@Component({
  selector: 'app-basic-Details',
  templateUrl: './basic-Details.component.html',
  styleUrls: ['./basic-Details.component.css'],
  providers: [ApiService, DatePipe, UniCoreService, CodesService, GeneralService]
})
export class BasicDetailsComponent implements OnInit {

  @Output() out: EventEmitter<any> = new EventEmitter();
  @Input() PageTitleParent;
  dropdownList = [];
  ArrContactInfo = [];
  dropdownSettings = {};
  selectedItems = [];
  dllCountryList: any;
  dllCityList: any;
  dllAreaList: any;
  CountryKey: any;
  CityKey: any;
  arrField_id = [];
  @ViewChild('fileInput') fileInput: ElementRef;
  uploadImage: any = [];

  bsModalRef: BsModalRef;
  @ViewChild('TermsAndConditionsTAB') TermsAndConditionsTAB;
  @ViewChild('ObjectivesTAB') ObjectivesTAB;
  @ViewChild('RequirmentsTAB') RequirmentsTAB;
  @ViewChild('ItemsComponentTAB') ItemsComponentTAB;
  @ViewChild('BidBondsTAB') BidBondsTAB;
  @ViewChild('PaymentTermsTAB') PaymentTermsTAB;
  @ViewChild('VendorsInfoTAB') VendorsInfoTAB;
  @ViewChild('VendorsDetailsTAB') VendorsDetailsTAB;
  @ViewChild('FinancialProposalTAB') FinancialProposalTAB;
  @ViewChild('SummaryTAB') SummaryTAB;

  @ViewChild('ddlStatus') chddlStatus;
  @ViewChild('ddlCurrency') chddlCurrency;
  @ViewChild('txtBoardSecretary') chtxtBoardSecretary;
  @ViewChild('dllCatagory') chdllCatagory;
  ExtraFieldsForm: FormGroup;

  CreationDate: string;

  oTenderBasicDetails: TenderBasicDetails;
  oExtraFildsClass: ExtraFildsClass;
  dllStatusList;
  dllCatagoryList;
  ddlCurrency = [];
  Fields = [];
  dllBoardSecretary;
  @Input('TenderID') TenderID: number;
  @Input('isAdd') isAdd: boolean;
  ArrForCheck = [];
  BtnCheck: boolean = false;
  BtnConfirmDis: boolean = false;
  ShowSummaryTab: boolean = false;
  oExtraFildsValues = [];
  oTenderBasicDetailsExtraFiledData = [];
  ResourcesList = [];

  constructor(
    private codesService: CodesService, private user: userService,
    public _ApiService: ApiService, private datepipe: DatePipe,
    private coreService: UniCoreService, private BasicDetailsService: BasicDetailsService,
    public _route: ActivatedRoute, public _router: Router,
    public modalService: BsModalService, private AddFieldsService: AddFieldsService,
    public formBuilder: FormBuilder, private generalService: GeneralService,
    private _changeDetectorRef: ChangeDetectorRef) { }

  rowContactInfo = [
    {
      ContactName: '',
      Mobile: '',
      Email: ''
    }
  ];

  //getPizzas$: Observable<any[]> = of(this.BasicDetailsService.getAttach(1).subscribe(x => { return x; })) ;
  obj: any;
  addTable() {
    this.obj = {
      ContactName: '',
      Mobile: '',
      Email: ''
    }
    this.rowContactInfo.push(this.obj)
  }
  deleteRow(ContactID, i) {
    if (this.rowContactInfo.length > 0) {
      if (ContactID == null) {
        this.rowContactInfo.splice(i, 1);
        this.ContactLength();
      } else {
        swal.fire({
          title: localStorage.getItem('Language') == 'en' ? "Are you sure you want to remove this record ?" : 'هل انت متأكد انك تريد حذف السجلات المحددة ؟',
          //text: "You should soon receive an email to " + email + " allowing you to reset your password.</b> Please make sure to check your spam and trash if you can't find the email.",
          html: "",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: localStorage.getItem('Language') == 'en' ? 'Confirm!' : 'تأكيد !',
          cancelButtonText: localStorage.getItem('Language') == 'en' ? 'Cancel' : 'الغاء'
        }).then((result) => {
          if (result.value) {
            this.BasicDetailsService.DeleteContactInfo(ContactID)
              .subscribe(res => {
                if (res.IsError) {
                  alert(res.ResponseMessage, 'error');
                  return;
                }
                else {
                  alert(res.ResponseMessage);
                  this.rowContactInfo = res.Data;
                  this.ContactLength();
                }
              });
          }
        });
      }
    }
  }
  ContactLength() {
    if (this.rowContactInfo.length == 0) {
      this.obj = {
        ContactName: '',
        Mobile: '',
        Email: ''
      }
      this.rowContactInfo.push(this.obj);
    }
  }

  //Gridster

  //Grid Options
  options: GridsterConfig = {
    gridType: 'verticalFixed',
    fixedRowHeight: 60,
    minCols: 12,
    maxCols: 12,
    minRows: 1,
    maxRows: 5,
    minItemRows: 1,
    maxItemRows: 50,
    minItemCols: 1,
    defaultItemCols: 1,
    defaultItemRows: 1,
    draggable: {
      enabled: false,

    },
    resizable: {
      enabled: false,
    },
    swap: true,
    margin: 2,
    // pushItems: true
  };

  //Grid items 
  dashboard: Array<GridsterItem> = []


  editEnabled = false;


  editableOn() {

    // if (this.dashboard[0].label_Name == "" && this.dashboard[1].label_Name == "" && this.dashboard[2].label_Name == "") {
    //   this.getAtt()
    // }

    this.editEnabled = true;
    this.options = {
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: 5,
      minItemRows: 1,
      maxItemRows: 50,
      minItemCols: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      draggable: {
        enabled: true,
      },
      resizable: {
        enabled: false,
      },
      swap: true,
      pushItems: true,
      margin: 2,
    };

    var doc = document.getElementById('gridster')
    if (doc == null) {
      return;
    }
    doc.style.background = '#d0d0d0'
  }
  
  resetGrid() {
    localStorage.removeItem("order")
    window.location.reload()
  }

  editableOff() {
    this.editEnabled = false;
    this.advancedEdit = false

    this.options = {
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: 6,
      minItemRows: 1,
      maxItemRows: 50,
      minItemCols: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
    };
    var doc = document.getElementById('gridster')
    if (doc == null) {
      return;
    }
    doc.style.background = 'white'

    var doc2 = document.getElementById('gridster2')
    if (doc2 == null) {
      return;
    }
    doc2.style.background = 'white'

  }

  save() {

    this.editEnabled = false
    this.advancedEdit = false

    if (this.selectedItem.is_Visable == false) {
      this.selectedItem.is_ReadOnly = false;
      this.selectedItem.is_Required = false;
    }



    localStorage.setItem('order', JSON.stringify(this.dashboard))



    this.options = {
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: 4,
      minItemRows: 1,
      maxItemRows: 50,
      minItemCols: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
    };


    this.setAtts()

    var doc = document.getElementById('gridster')
    if (doc == null) {
      return;
    }
    doc.style.background = 'white'

    var doc2 = document.getElementById('gridster2')
    if (doc2 == null) {
      return;
    }
    doc2.style.background = 'white'

    this.editEnabled = false;



  }



  // Advanced Edit
  advancedEdit = false
  tempDash //  a copy of the dashboard
  selectedItem: GridsterItem = {
    x: 0,
    y: 0,
    cols: 0,
    rows: 0
  }

  advancedEditOn(item: GridsterItem) {
    this.advancedEdit = true;
    this.selectedItem = item;
    this.tempDash = structuredClone(this.dashboard) // takes a copy of the dashboard to revert on cancel
  }

  cancel() {
    this.dashboard = this.tempDash
  }
  saveItem() {

    if (this.selectedItem.is_Visable == false) {
      this.selectedItem.is_ReadOnly = false;
      this.selectedItem.is_Required = false;
    }
    
    localStorage.setItem('order', JSON.stringify(this.dashboard))

    this.setAtts
  }
  //Generate Default

  initGridster() {
    var gridster = document.getElementsByTagName('gridster-item');
    var x = 0;
    var y = 0;
    var rOnly
    var req
    var label

    for (let i = 0; i < gridster.length; i++) {

      rOnly = gridster[i].innerHTML.toLowerCase().includes('readonly="true"') || gridster[i].innerHTML.toLowerCase().includes('readonly="readonly"')
      req = gridster[i].innerHTML.toLowerCase().includes('required="true"') || gridster[i].innerHTML.toLowerCase().includes('required="required"')
      label = gridster[i].getElementsByTagName('label')[0].innerHTML

      if (x > 11) {
        x = 0; y++;
      }

      this.dashboard.push({ "id": i, "route": "test", "cols": 4, "rows": 1, "x": x, "y": y, is_ReadOnly: rOnly, is_Visable: true, is_Required: req, label_Name: label });
      x += 4

    }

  }

  getAtt() {
    var gridster = document.getElementsByTagName('gridster-item');

    for (let i = 0; i < gridster.length; i++) {

      let rOnly = gridster[i].innerHTML.toLowerCase().includes('readonly="true"') || gridster[i].innerHTML.toLowerCase().includes('readonly="readonly"')
      let req = gridster[i].innerHTML.toLowerCase().includes('required="true"') || gridster[i].innerHTML.toLowerCase().includes('required="required"')
      let label = gridster[i].getElementsByTagName('label')[0].innerHTML

      this.dashboard[i].label_Name = label
      this.dashboard[i].is_ReadOnly = rOnly
      this.dashboard[i].is_Required = req

    }
  }

  //Set Control Attributes
  setAtts() {

    var gridster = document.getElementsByTagName('gridster-item');
    var element
    var display = ""
    var gridsterItemHtml
    var label = ""
    var disabled = ""
    var required = ""
    var readonly = ""

    for (let i = 0; i < gridster.length; i++) {

      this.dashboard[i].is_Visable ? display = "block" : display = "none"

      readonly = this.dashboard[i].is_ReadOnly
      disabled = this.dashboard[i].is_ReadOnly
      required = this.dashboard[i].is_Required
      label = this.dashboard[i].label_Name

      gridsterItemHtml = gridster[i].innerHTML.toLowerCase()

      if (gridsterItemHtml.includes('ng-multiselect-dropdown')) {

        element = gridster[i].getElementsByTagName('ng-multiselect-dropdown')[0]


        if (readonly)
          element.style.pointerEvents = 'none'
        else
          element.style.pointerEvents = 'auto'


        if (required)
          element.setAttribute('required', '')
        else
          element.removeAttribute('required')

        element.style.display = display

        gridster[i].getElementsByTagName('label')[0].innerHTML = label;

      }

      else if (gridsterItemHtml.includes('type="text"') || gridsterItemHtml.includes('type="email" ') || gridsterItemHtml.includes('type="password"') || gridsterItemHtml.includes('type="number"') || gridsterItemHtml.includes('type="date"') || gridsterItemHtml.includes('type="month"')) {

        element = gridster[i].getElementsByTagName('input')[0]
        element.readOnly = readonly
        element.disabled = disabled
        element.required = required
        element.style.display = display
        gridster[i].getElementsByTagName('label')[0].innerHTML = label;
      }

      else if (gridsterItemHtml.includes('/select')) {
        element = gridster[i].getElementsByTagName('select')[0]
        element.disabled = disabled
        element.required = required
        element.style.display = display
        gridster[i].getElementsByTagName('label')[0].innerHTML = label;

      }

      else if (gridsterItemHtml.includes('/textarea')) {

        element = gridster[i].getElementsByTagName('textarea')[0]
        element.disabled = readonly
        element.required = required
        element.style.display = display
        gridster[i].getElementsByTagName('label')[0].innerHTML = label;

      }

      else if (gridsterItemHtml.includes('type="radio"') || gridsterItemHtml.includes('type="checkbox"')) {


        element = gridster[i].getElementsByTagName('input')

        for (let j = 0; j < element.length; j++) {

          element[j].disabled = readonly
          element[j].required = required
          element[j].style.display = display
        }
        gridster[i].getElementsByTagName('label')[0].innerHTML = label;

      }

    }
  }

  //EndGridster

  ngOnInit() {

    //gridsterOnInit

    if (localStorage.getItem('order')) {
      this.dashboard = JSON.parse(localStorage.getItem('order')!)
      setTimeout(() => {
        this.setAtts()
      }, 500);

    }


    if (this.dashboard.length == 0) {
      this.initGridster()

      setTimeout(() => {
        this.getAtt()
      }, 500);

    }

    //endGridsterOnInit

    this.generalService.GetResources("BasicDetails").toPromise().then(x => { this.ResourcesList = x; });
    this.oTenderBasicDetails = new TenderBasicDetails();
    this.oExtraFildsClass = new ExtraFildsClass();
    this.fillCurrencyDDl();
    this.fillCatagoryList();
    this.fillBoardSecretaryDDl();
    this.LoadPageResources();
    this.CheckAddOrEdit();
    this.fillTermsAndConditionsLst();
    this.fillLinkedTermsAndConditionsLst();
    this.EnableDisableTabs();
    this.GetFields();
    this.fillmultiselect();
    this.fillCountryList();
    this.GetAllAttachment();
    if (this.isAdd) {
      this.oTenderBasicDetails.Closing_Time = "12:00 AM";
    }
  }
  timePicker() {
    $(function () {
      $('#datetimepicker3').datetimepicker({
        format: 'LT'
      });
    });
  }
  DontMatch: boolean = true;
  ClosingDate() {
    this.oTenderBasicDetails.Closing_Time = (<HTMLInputElement>document.getElementById("txtClosingTime")).value;
    var EmailPattern = /^(((0[1-9])|(1[0-2])|([1-9])):([0-5])[0-9]\s(A|P|a|p)(M|m))$/;

    if (this.oTenderBasicDetails.Closing_Time) {
      if (this.oTenderBasicDetails.Closing_Time.match(EmailPattern)) {
        this.DontMatch = true;
      }
      else {
        this.DontMatch = false;
        this.oTenderBasicDetails.Closing_Time = (<HTMLInputElement>document.getElementById("txtClosingTime")).value = "";
      }
    }
    else {
      this.DontMatch = true;
    }

  }

  ExtraFiledChange(VALUE: string, MSTR_FIELD_ID: number) {
    var oValue = { "MSTR_FIELD_ID": MSTR_FIELD_ID, "VALUE": VALUE };
    this.oExtraFildsValues.forEach((value, index) => {
      if (value.MSTR_FIELD_ID == MSTR_FIELD_ID) this.oExtraFildsValues.splice(index, 1);
    });
    this.oExtraFildsValues.push(oValue);
  }

  ExtraFiledChangeDate(VALUE: DatePipe = new DatePipe('en-US'), MSTR_FIELD_ID: number) {
    var oValue = { "MSTR_FIELD_ID": MSTR_FIELD_ID, "VALUE": this.datepipe.transform(VALUE, "MM-dd-yyyy") };
    this.oExtraFildsValues.forEach((value, index) => {
      if (value.MSTR_FIELD_ID == MSTR_FIELD_ID) this.oExtraFildsValues.splice(index, 1);
    });
    this.oExtraFildsValues.push(oValue);
  }

  fillCreationDate() {
    this.BasicDetailsService.GetCreationDate()
      .subscribe(e => {
        this.oTenderBasicDetails.CREATION_DATE = e.Data;
        //this.oTenderBasicDetails.CREATION_DATE = this.datepipe.transform(this.oTenderBasicDetails.CREATION_DATE, 'dd-MM-yyyy');
      });
  }

  EnableDisableTabs() {
    if (this.TenderID != 0) {

      let lstTabs = [this.SummaryTAB, this.ObjectivesTAB, this.TermsAndConditionsTAB, this.RequirmentsTAB, this.ItemsComponentTAB, this.BidBondsTAB,
      this.PaymentTermsTAB, this.VendorsInfoTAB, this.VendorsDetailsTAB, this.FinancialProposalTAB
      ];

      ///// enable tab click
      lstTabs.forEach(element => {
        element.nativeElement.setAttribute('data-toggle', 'tab');
        element.nativeElement.setAttribute('style', '');
      });
    }
    else {

      let lstTabs = [this.SummaryTAB, this.ObjectivesTAB, this.TermsAndConditionsTAB, this.RequirmentsTAB, this.ItemsComponentTAB, this.BidBondsTAB,
      this.PaymentTermsTAB, this.VendorsInfoTAB, this.VendorsDetailsTAB, this.FinancialProposalTAB
      ];
      ///// disable tab click
      lstTabs.forEach(element => {
        element.nativeElement.setAttribute('data-toggle', '');
        element.nativeElement.setAttribute('style', 'cursor: not-allowed;');

      });
    }
  }

  CheckAddOrEdit() {
    if (this.TenderID != null && this.TenderID != undefined && this.TenderID != 0) {
      //this.TenderID = parms['id'];
      this.BasicDetailsService.checkConfirmationStatusApi(this.TenderID)
        .subscribe(e => {
          this.BasicDetailsService.isTndrValid = e.Data.isTndrValid;
          this.BasicDetailsService.isTndrConfirmed = e.Data.isTndrConfirmed;
          this.BasicDetailsService.isTndrPublished = e.Data.isTndrPublished;
          this.fillStatusDDl();
          this.isAdd = false;
          this.EditMode(this.TenderID);
        });
    }
    else {
      this.BasicDetailsService.isTndrValid = false;
      this.BasicDetailsService.isTndrConfirmed = false;
      this.BasicDetailsService.isTndrPublished = false;
      this.fillStatusDDl();
      this.isAdd = true;
      this.TenderID = 0;
      this.AddMode();
    }
  }

  EditMode(TenderID) {
    this.BasicDetailsService.GetBasicDetails(TenderID)
      .subscribe(res => {
        if (res.IsError) {
          alert(res.ErrorMessage, 'error');
          return;
        }
        this.oTenderBasicDetails = res.Data;
        this.oTenderBasicDetails.Open_Date = this.datepipe.transform(this.oTenderBasicDetails.Open_Date, 'dd-MM-yyyy');
        this.oTenderBasicDetails.Closing_Date = this.datepipe.transform(this.oTenderBasicDetails.Closing_Date, 'dd-MM-yyyy');
        this.oTenderBasicDetails.Publish_Date = this.datepipe.transform(this.oTenderBasicDetails.Publish_Date, 'dd-MM-yyyy');
        this.oTenderBasicDetails.CREATION_DATE = this.datepipe.transform(this.oTenderBasicDetails.CREATION_DATE, 'dd-MM-yyyy');
        this.oTenderBasicDetails.Decision_Date = this.datepipe.transform(this.oTenderBasicDetails.Decision_Date, 'dd-MM-yyyy');
        this.CountryKey = this.oTenderBasicDetails.Country;
        this.CityKey = this.oTenderBasicDetails.City;
        this.fillCountryList();
        this.oTenderBasicDetails.CD_CatagoryArr = res.otndr_codes
        this.oTenderBasicDetailsExtraFiledData = res.ExtraFieldData;
        this.rowContactInfo = res.arrContactData;
        this.oTenderBasicDetails.CREATION_DATE = this.oTenderBasicDetails.CREATION_DATE.substring(0, 10);
        this.ContactLength();
      });
  }

  fillCurrencyDDl() {
    this.coreService.GetCurrencies()
      .subscribe(e => {
        this.ddlCurrency = e.Data;
        if (e.CompanyCurrency) {
          this.oTenderBasicDetails.Currency = e.CompanyCurrency;
        }
        else {
          this.oTenderBasicDetails.Currency = "JOD";
        }
      });
  }

  fillCatagoryList() {
    this.codesService.GetCodesByMajorCode(9)
      .subscribe(e => {
        this.dllCatagoryList = e;
      });
  }

  fillBoardSecretaryDDl() {
    this.codesService.GetCodesByMajorCode(2)
      .subscribe(e => {
        this.dllBoardSecretary = e;
        //this.oTenderBasicDetails.CD_Board_Secretary = e[0].ID;
      });
  }

  fillStatusDDl() {
    this.codesService.GetCodesByMajorCode(1)
      .subscribe(e => {
        if (this.BasicDetailsService.isTndrConfirmed) {
          this.dllStatusList = e;
        }
        else {
          this.dllStatusList = (e as any[]).filter(x => x.ID == 1 || x.ID == 2);
        }
        //this.oTenderBasicDetails.CD_Status = e[0].ID;
      });
  }

  SwapDate(dateItem: any) {
    if (dateItem) {
      if (dateItem instanceof Date) {
        return this.datepipe.transform(dateItem, 'yyyy-MM-dd');
      }
      else {
        var ss = dateItem.split("-");
        return ss[2] + "-" + ss[1] + "-" + ss[0];
      }
    }
  }

  SaveEntry() {
    this.oTenderBasicDetails.Open_Date = this.SwapDate(this.oTenderBasicDetails.Open_Date);
    this.oTenderBasicDetails.Closing_Date = this.SwapDate(this.oTenderBasicDetails.Closing_Date);
    this.oTenderBasicDetails.CREATION_DATE = this.SwapDate(this.oTenderBasicDetails.CREATION_DATE);
    this.oTenderBasicDetails.Publish_Date = this.SwapDate(this.oTenderBasicDetails.Publish_Date);
    this.oTenderBasicDetails.Decision_Date = this.SwapDate(this.oTenderBasicDetails.Decision_Date);
    this.oTenderBasicDetails.CD_Board_Secretary = Number(this.chtxtBoardSecretary.value);
    this.oTenderBasicDetails.CD_Status = Number(this.chddlStatus.value);
    this.oTenderBasicDetails.CD_CatagoryArr = this.chdllCatagory.value.map(x => x.ID);
    this.oTenderBasicDetails.CREATED_BY = this.user.username;
    //this.oTenderBasicDetails.Currency = this.chddlCurrency.value;

    if (this.isAdd) {
      this.oTenderBasicDetails.Reference_no = "0";
    }
    this.BasicDetailsService.AddBasicDetails(this.oTenderBasicDetails, this.oExtraFildsValues, this.rowContactInfo)
      .subscribe(res => {
        if (!res.IsError && res.TenderId != 0) {
          alert(res.msg);
          this.oTenderBasicDetails.ID = res.TenderID;
          this.oTenderBasicDetails.Reference_no = res.Reference_no;
          this.TenderID = res.TenderID;
          this.isAdd = false;
          this.EnableDisableTabs();
          this.ContactLength();
          this.AddFieldsService.GetFields(1).subscribe(response => {
            this.Fields = response.Data;
            for (var x = 0; x < this.Fields.length; x++) {
              this.Fields[x].DATA_SOURCE = JSON.parse(this.Fields[x].DATA_SOURCE);
            }
            this.ExtraFieldsForm = this.formBuilder.group({});
            this.oTenderBasicDetailsExtraFiledData = res.ExtraFieldsData;
            this.EditMode(this.oTenderBasicDetails.ID);
          });
          if (this.AttachmentFile.length != 0) {
            this.AttachmentFile.forEach(element => {
              if (typeof element.Attachment != 'string') {
                if (element.ID != 0) {
                  this.BasicDetailsService.UpdateAttachment(element.Attachment, this.oTenderBasicDetails.ID, element.ID).subscribe(ress => {
                    if (ress.IsError) {
                      alert(res.ResponseMessage, 'error');
                      return;
                    }
                    this.BasicDetailsService.getAttach(this.oTenderBasicDetails.ID).subscribe(resss => {
                      this.AttachmentFile = resss.Data;
                      for (var i = 0; i < this.AttachmentFile.length; i++) {
                        this.AttachmentFile[i].showlabelAttach = true;
                      }
                    });
                  });
                }
                else {
                  this.BasicDetailsService.UploadAttachment(element.Attachment, this.oTenderBasicDetails.ID).subscribe(ress => {
                    if (ress.IsError) {
                      alert(res.ResponseMessage, 'error');
                      return;
                    }
                    this.BasicDetailsService.getAttach(this.oTenderBasicDetails.ID).subscribe(resss => {
                      this.AttachmentFile = resss.Data;
                      for (var i = 0; i < this.AttachmentFile.length; i++) {
                        this.AttachmentFile[i].showlabelAttach = true;
                      }
                    });
                  });
                }
              }
            });
          }
          this.reset();
        }
        else {
          alert(res.ErrorMessage, 'error');
          this.isAdd = true;
        }
      });

    return;
  }


  GetAllAttachment() {
    this.BasicDetailsService.getAttach(this.TenderID).subscribe(res => {
      this.AttachmentFile = res.Data;
      for (var i = 0; i < this.AttachmentFile.length; i++) {
        this.AttachmentFile[i].showlabelAttach = true;
      }
    });
  }
  reset() {
    this.rowContactInfo = [
      {
        ContactName: '',
        Mobile: '',
        Email: ''
      }
    ];
  }
  AddMode() {
    this.oTenderBasicDetails = new TenderBasicDetails();
    this.oTenderBasicDetails.ID = 0;
    this.oTenderBasicDetails.Reference_no = "";
    this.oTenderBasicDetails.CD_Status = 1;
    this.oTenderBasicDetails.CREATED_BY = this.user.username;
    this.fillCreationDate();
  }

  LoadPageResources() {
    this.coreService.getLanguage().subscribe(res => {
      localStorage.setItem('Language', res);
      this.user.PageTitle = localStorage.getItem('Language') == 'en' ? 'Tender Definition' : 'تعريف العطاء';
      this.user.ModuleTitle = localStorage.getItem('Language') == 'en' ? 'Tendering' : 'العطاء';
      if (this.PageTitleParent != null || this.PageTitleParent == "") {
        this.user.PageTitle = this.PageTitleParent;
      }
    });
  }

  /////// Start Terms And Conditions
  ArrLinkedTermsAndCondition = [];
  ArrAllTermsAndConditions = [];
  showEditTermsAndConditionsEntry: boolean = false;
  selectedTermID = 0;
  TermsEntryData;

  @ViewChild('gridLinkedTermsAndCondition') gridLinkedTermsAndCondition;
  @ViewChild('gridAllTermsAndCondition') gridAllTermsAndCondition;

  fillTermsAndConditionsLst() {
    this.BasicDetailsService.fillTermsAndConditionsLst(this.TenderID)
      .subscribe(res => {
        if (res.IsError) {
          alert(res.ResponseMessage, 'error');
          return;
        }
        this.ArrAllTermsAndConditions = res.Data;
      });
  }

  fillLinkedTermsAndConditionsLst() {
    this.BasicDetailsService.fillLinkedTermsAndConditionsLst(this.TenderID)
      .subscribe(res => {
        if (res.IsError) {
          alert(res.ResponseMessage, 'error');
          return;
        }
        this.ArrLinkedTermsAndCondition = res.Data;
      });
  }

  LinkTerms() {
    if (this.ArrAllTermsAndConditions.filter(x => x.selected == true).length <= 0) {
      alert(localStorage.getItem('Language') == 'en' ? "Please select a record." : 'الرجاء تحديد خيار', "error");
      return;
    }
    else {
      if (this.oTenderBasicDetails.ID == undefined || this.oTenderBasicDetails.ID <= 0) {
        alert(localStorage.getItem('Language') == 'en' ? "Please save the tender before add the terms and conditions." : 'يرجى حفظ العطاء قبل اضافة الأحكام و الشروط', "error");
        return;
      }
      else {
        swal.fire({
          title: localStorage.getItem('Language') == 'en' ? "Are you sure you want to add these terms and conditions ?" : 'هل انت متأكد انك تريد اضافة هذه الأحكام و الشروط ؟',
          //text: "You should soon receive an email to " + email + " allowing you to reset your password.</b> Please make sure to check your spam and trash if you can't find the email.",
          html: "",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: localStorage.getItem('Language') == 'en' ? 'Confirm!' : 'تأكيد !',
          cancelButtonText: localStorage.getItem('Language') == 'en' ? 'Cancel' : 'الغاء'
        }).then((result) => {
          if (result.value) {
            this.BasicDetailsService.LinkTerms(this.TenderID, this.user.username, this.ArrAllTermsAndConditions.filter(x => x.selected == true))
              .subscribe(res => {
                if (res.IsError) {
                  alert(res.ResponseMessage, 'error');
                  return;
                }
                this.ArrLinkedTermsAndCondition = res.Data.lstLinkedTerms;
                this.ArrAllTermsAndConditions = res.Data.lstAllTerms;
                this.showEditTermsAndConditionsEntry = false;

              });
          }
        });
      }
    }
  }

  UnLinkTerms() {
    if (this.ArrLinkedTermsAndCondition.filter(x => x.selected == true).length <= 0) {
      alert(localStorage.getItem('Language') == 'en' ? "Please select a record." : 'الرجاء اختيار سجل', "error");
      return;
    }
    else {
      swal.fire({
        title: localStorage.getItem('Language') == 'en' ? "Are you sure you want to unlink these terms and conditions ?" : 'هل انت متأكد انك تريد الغاء ربط هذه الأحكام و الشروط',
        //text: "You should soon receive an email to " + email + " allowing you to reset your password.</b> Please make sure to check your spam and trash if you can't find the email.",
        html: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: localStorage.getItem('Language') == 'en' ? 'Confirm!' : 'تأكيد !',
        cancelButtonText: localStorage.getItem('Language') == 'en' ? 'Cancel' : 'الغاء'
      }).then((result) => {
        if (result.value) {
          this.BasicDetailsService.UnLinkTerms(this.TenderID, this.user.username, this.ArrLinkedTermsAndCondition.filter(x => x.selected == true))
            .subscribe(res => {
              if (res.IsError) {
                alert(res.ResponseMessage, 'error');
                return;
              }
              this.ArrLinkedTermsAndCondition = res.Data.lstLinkedTerms;
              this.ArrAllTermsAndConditions = res.Data.lstAllTerms;
              this.showEditTermsAndConditionsEntry = false;

            });
        }
      });
    }
  }

  EditTermsAndConditions(ID) {
    this.showEditTermsAndConditionsEntry = true;
    this.selectedTermID = ID;
    this.BasicDetailsService.EditTermsAndConditions(ID)
      .subscribe(res => {
        if (res.IsError) {
          alert(res.ResponseMessage, 'error');
          return;
        }
        this.TermsEntryData = res.Data;

      });
  }

  UpdateTermsAndConditions() {
    this.BasicDetailsService.UpdateTermsAndConditions(this.selectedTermID, this.TermsEntryData)
      .subscribe(res => {
        if (res.IsError) {
          alert(res.ResponseMessage, 'error');
          return;
        }
        this.TermsEntryData = res.Data.Terms
        alert(res.ResponseMessage);
        this.showEditTermsAndConditionsEntry = false;
        this.selectedTermID = 0;
      });
  }

  OpenPopUp() {
    const initialState = {
      TenderId: this.TenderID,
    };
    const config = {
      ignoreBackdropClick: true,
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(TermsAndConditionPopUpComponent, config);
    let modalDialog = document.getElementsByClassName("modal-dialog");
    modalDialog[1].setAttribute("style", "width:900px !important;");
    this.modalService.onHidden.subscribe(() => {
      this.fillLinkedTermsAndConditionsLst();
    });
  }
  ////// End Terms And Conditions

  AddFieldsPopUp(section) {

    const initialState = {
      TenderId: this.TenderID,
      section: section
    };
    const config = {
      ignoreBackdropClick: true,
      initialState: initialState
    };

    this.bsModalRef = this.modalService.show(AddFieldsPopUpComponent, config);
    let modalDialog = document.getElementsByClassName("modal-dialog");
    modalDialog[1].setAttribute("style", "width:900px !important;");
    this.modalService.onHidden.subscribe(() => {
      this.AddFieldsService.GetFields(1).subscribe(res => {
        this.Fields = res.Data;
        for (var x = 0; x < this.Fields.length; x++) {
          this.Fields[x].DATA_SOURCE = JSON.parse(this.Fields[x].DATA_SOURCE);
        }
        this.ExtraFieldsForm = this.formBuilder.group({});
      });
    });
  }

  GetFields() {
    this.AddFieldsService.GetFields(1).subscribe(res => {
      this.Fields = res.Data;
      for (var x = 0; x < this.Fields.length; x++) {
        this.Fields[x].DATA_SOURCE = JSON.parse(this.Fields[x].DATA_SOURCE);
      }
      this.ExtraFieldsForm = this.formBuilder.group({});
    });
  }

  GetFieldValue(event) {
    var Data = this.oTenderBasicDetailsExtraFiledData.filter(element => element.MSTR_FIELD_ID == event)[0];
    if (Data) {
      return Data.Value;
    } else {
      var Data = this.Fields.filter(element => element.MSTR_FIELD_ID == event)[0];
      if (Data) {
      }
      else {
        return null;
      }
    }
  }


  LoadSummary(ShowSummary) {
    this.ShowSummaryTab = ShowSummary;
  }
  getBasicDetails() {
    this.EditMode(this.TenderID);
  }

  Exsit() {
    this.coreService.ActivePage = "Tendering List";
  }

  DeleteField(FieldId: any) {
    this.AddFieldsService.DeleteField(FieldId)
      .subscribe(e => {
        if (e.IsError) {
          alert(e.ErrorMessage, 'error');
        }
        else {
          alert(localStorage.getItem('Language') == 'en' ? "The extra field deleted successfully." : 'تم حذف الحقل الإضافي بنجاح');
          this.GetFields();
        }
      });
  }
  SeeMore(TabName) {

    switch (TabName) {
      case "Basic_Details":
        $(".nav-tabs a[href='#BasicDetailsComponent']").click();
        this.LoadSummary(false);

        break;
      case "Terms_Conditions":
        $(".nav-tabs a[href='#TermsAndConditionsComponent']").click();
        this.LoadSummary(false);

        break;
      case "Objectives":
        $(".nav-tabs a[href='#ObjectivesComponent']").click();
        this.LoadSummary(false);

        break;
      case "Requirments":
        $(".nav-tabs a[href='#RequirmentsComponent']").click();
        this.LoadSummary(false);

        break;
      case "FinancialProposal":
        $(".nav-tabs a[href='#FinancialRequirmentsComponent']").click();
        this.LoadSummary(false);

        break;
      case "Items":
        $(".nav-tabs a[href='#ItemsComponent']").click();
        this.LoadSummary(false);

        break;
      case "Bid_Bonds":
        $(".nav-tabs a[href='#BidBonds']").click();
        this.LoadSummary(false);

        break;
      case "Payment_Terms":
        $(".nav-tabs a[href='#PaymentTerms']").click();
        this.LoadSummary(false);

        break;
      case "Vendor_Info":
        $(".nav-tabs a[href='#VendorsInfo']").click();
        this.LoadSummary(false);

        break;
      case "Vendor_Documents":
        $(".nav-tabs a[href='#VendorsDetails']").click();
        this.LoadSummary(false);

        break;

      default:
        break;
    }

  }

  fillmultiselect() {
    this.codesService.GetCodesByMajorCode(9)
      .subscribe(e => {
        this.dropdownList = e;
      });
    this.dropdownList = this.dropdownList.concat(this.oTenderBasicDetails);
    this.dropdownSettings = {
      singleSelection: false,

      idField: 'ID',
      textField: 'NAME',
      selectAllText: localStorage.getItem('Language') == 'en' ? 'Select All' : 'اختيار الكل',
      unSelectAllText: localStorage.getItem('Language') == 'en' ? 'UnSelect All' : 'الغاء اختيار الكل',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  fillCountryList() {
    this.coreService.GetCountries()
      .subscribe(e => {
        this.dllCountryList = e.Data;
      });
    this.fillCityList();
  }
  selectCountry(event) {
    this.CountryKey = event.currentTarget.value;
    this.oTenderBasicDetails.City = null;
    this.oTenderBasicDetails.Area = null;
    if (this.CountryKey != null) {
      this.fillCityList();
    }
  }
  fillCityList() {
    if (this.CountryKey != null) {
      this.coreService.GetCities(this.CountryKey)
        .subscribe(e => {
          this.dllCityList = e.Data;
        });
      this.fillAreaList();
    }
  }

  selectCity(event) {
    this.CityKey = event.currentTarget.value;
    if (this.CountryKey != null && this.CityKey != null) {
      this.fillAreaList();
    }
  }
  fillAreaList() {
    if (this.CityKey != null) {
      this.coreService.GetAreas(this.CityKey, this.CountryKey)
        .subscribe(e => {
          this.dllAreaList = e.Data;
        });
    }
  }

  ShowUploded = false;


  PushNewAttch() {

    var NewAttach = { Attachment: "", ID: 0, showlabelAttach: true };
    if (this.AttachmentFile.length >= 10) {
      alert(localStorage.getItem('Language') == 'en' ? 'You Cannt add greater Than 10 Attachment' : 'غير قادر على اضافة اكثر من 10 مرافق', 'error')

    }
    else {
      this.AttachmentFile.push(NewAttach);
    }
  }
  //showlabelAttach: boolean = true;
  AttachmentFile = [{ Attachment: "", ID: 0, showlabelAttach: true }];
  SelectAttachedFile(event, i) {
    var file = event.target.files[0];
    this.AttachmentFile[i].Attachment = file;
    this.AttachmentFile[i].showlabelAttach = true;
    if (this.AttachmentFile[i].showlabelAttach == true) {
      this.AttachmentFile[i].showlabelAttach = false;
    }
  }

  getAttach(AttID, i) {
    this.BasicDetailsService.getAttach(AttID)
      .subscribe(res => {
        if (res.IsError) {
          alert(res.ResponseMessage, 'error');
          return;
        }
        else {
          this.AttachmentFile = res.Data;
          for (var i = 0; i < this.AttachmentFile.length; i++) {
            this.AttachmentFile[i].showlabelAttach = true;
          }
        }
      });
  }

  RemoveAttach(AttID, i) {
    if (this.AttachmentFile.length > 0) {
      if (AttID == 0) {
        this.AttachmentFile.splice(i, 1);
        this.ContactLength();
      } else {
        swal.fire({
          title: localStorage.getItem('Language') == 'en' ? "Are you sure you want to remove this record ?" : 'هل انت متأكد انك تريد حذف السجلات المحددة ؟',
          //text: "You should soon receive an email to " + email + " allowing you to reset your password.</b> Please make sure to check your spam and trash if you can't find the email.",
          html: "",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: localStorage.getItem('Language') == 'en' ? 'Confirm!' : 'تأكيد !',
          cancelButtonText: localStorage.getItem('Language') == 'en' ? 'Cancel' : 'الغاء'
        }).then((result) => {
          if (result.value) {
            this.BasicDetailsService.RemoveAttach(AttID)
              .subscribe(res => {
                if (res.IsError) {
                  alert(res.ResponseMessage, 'error');
                  return;
                }
                else {
                  alert(res.ResponseMessage);
                  this.AttachmentFile = res.Data;

                  for (var i = 0; i < this.AttachmentFile.length; i++) {
                    this.AttachmentFile[i].showlabelAttach = true;
                  }
                  this.ContactLength();
                }
              });
          }
        });
      }
    }
  }

  DownloadBasicAttachment(AttachId) {
    this.BasicDetailsService.DownloadBasicAttachment(AttachId, this.TenderID).subscribe(res => {
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.setAttribute('target', '_blank');
      a.href = res.Path;
      a.download = res.FileName;
      a.click();
    });
  }
}
