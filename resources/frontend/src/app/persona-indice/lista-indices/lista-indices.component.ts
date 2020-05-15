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
import { AgregarIndiceDialogComponent} from '../agregar-indice-dialog/agregar-indice-dialog.component';

@Component({
  selector: 'app-lista-indices',
  templateUrl: './lista-indices.component.html',
  styleUrls: ['./lista-indices.component.css']
})
export class ListaIndicesComponent implements OnInit {

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

  displayedColumns: string[] = ['no_caso','persona','email','telefono_casa','telefono_celular','municipio_localidad', 'contacto','actions'];
  dataSource: any = [];

  ngOnInit() {
    this.loadListadoCasos();
  }

  loadListadoCasos(event?){
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
    this.dataSource = [];
    this.resultsLength = 0;

    this.indiceService.getListadoIndices(params).subscribe(
      response => {
        console.log(response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          console.log(response.data);
          if(response.data.data.length > 0){
            this.dataSource = response.data.data;

            this.resultsLength = response.data.data.length;
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
    this.loadListadoCasos(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  
  nuevoIndice()
  {
    let configDialog = {};
    const dialogRef = this.dialog.open(AgregarIndiceDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.loadListadoCasos();
      }
    });
  }

  editarIndice(obj_indice:any)
  {
    let configDialog = {};
    configDialog['data'] = obj_indice;
    console.log(obj_indice);
    const dialogRef = this.dialog.open(AgregarIndiceDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid)
      {
        this.loadListadoCasos();
      }
    });
  } 
}
