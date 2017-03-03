import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import {AbstractRxComponent} from "../AbstractRxComponent";
import {MeteorDataTable} from "../../meteor-datatable/MeteorDataTable";
import {
  Observable,
  Subject
} from "rxjs";
import {MongoObservable} from "meteor-rxjs";
import {ToastsManager} from "ng2-toastr";

@Component({
             selector   : 'angular-meteor-datatable',
             templateUrl: 'angular-meteor-datatable.html'
           })
export class AngularMeteorDataTableComponent extends AbstractRxComponent implements OnInit {
  protected data = {};
  @Input('collectionObservable') private collectionObservable: Observable<MongoObservable.Collection<any>>;
  @Input('tableConfig') private tableConfig: any;
  
  @ViewChild('dataTable') dataTable: ElementRef;
  
  meteorDataTable: MeteorDataTable;
  protected callBackSubject: Subject<any> = new Subject();
  
  constructor(protected toast: ToastsManager) {
    super();
  }
  
  ngOnInit() {
    this._initTable()
  }
  
  private _initTable() {
    this.meteorDataTable            =
      new MeteorDataTable(jQuery(this.dataTable.nativeElement), this.tableConfig, this.collectionObservable, this.callBackSubject);
    this._subscription['dataTable'] = this.meteorDataTable.getMeteorDtTableSubscription();
    
    this._subscription['click_remove_dt'] =
      this.callBackSubject.filter(x => {
        return x['event'] == "clickRemove";
      }).subscribe(data => {
        if (data['data']) {
          this.data['removeId'] = data['data'];
          jQuery('#meteor-dt-remove-modal').modal('show');
        }
      });
  }
  
  removeRecord() {
    this.callBackSubject.next({event: "removeRecord", data: this.data['removeId']});
  }
  
  getCallBackObservable(): Observable<any> {
    return this.callBackSubject.asObservable().share();
  }
}
