import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatExpansionPanel } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { map, startWith } from 'rxjs/operators';
import { PermissionsList } from '../../auth/models/permissions-list';
import { MediaObserver } from '@angular/flex-layout';
import { IndiceService } from '../indice.service';
import { AgregarContactoDialogComponent} from '../agregar-contacto-dialog/agregar-contacto-dialog.component';


@Component({
  selector: 'app-indice-contacto',
  templateUrl: './indice-contacto.component.html',
  styleUrls: ['./indice-contacto.component.css']
})
export class IndiceContactoComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;

  constructor(private sharedService: SharedService, private indiceService: IndiceService, public dialog: MatDialog, public mediaObserver: MediaObserver, private route: ActivatedRoute) { }

  isLoading: boolean = false;
  mediaSize: string;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  displayedColumns: string[] = ['id','persona','email','telefono_casa','telefono_celular','municipio_localidad','actions'];
  columna_indice: string[] = ['nombre'];
  dataSource: any = [];
  indiceID:any;
  persona_indice:any = [];
  
  ngOnInit() {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    this.route.paramMap.subscribe(params => {
      this.indiceID = params.get('id');

      this.loadListadoContacto();
    });
  }

  loadListadoContacto(event?){
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    params.query = this.searchQuery;
    params.persona_indice = this.indiceID;
    this.dataSource = [];
    this.resultsLength = 0;

    this.indiceService.getListadoContactos(params).subscribe(
      response => {
        console.log(response.data);
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.persona_indice = response.indice;
          if(response.data.data.length > 0){
            this.dataSource = response.data.data;
            console.log(response.data);
            console.log(this.dataSource);

            this.resultsLength = response.data.length;
          }
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadListadoContacto(null);
  }

  agregarContacto()
  {
    let configDialog = {};
    configDialog['data'] = {indiceId: parseInt(this.indiceID), editar: false};
    console.log(configDialog);
    const dialogRef = this.dialog.open(AgregarContactoDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.loadListadoContacto();
      }
    });
  }

  cleanSearch(){
    this.searchQuery = '';
  }
  
  editarContacto(obj_indice:any)
  {
    let configDialog = {};
    obj_indice.editar = true;
    configDialog['data'] = obj_indice;
    console.log(configDialog);
    const dialogRef = this.dialog.open(AgregarContactoDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.loadListadoContacto();
      }
    });
  } 
}
