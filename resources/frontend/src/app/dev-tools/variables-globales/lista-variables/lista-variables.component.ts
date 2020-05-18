import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { FormVariableDialogoComponent } from '../form-variable-dialogo/form-variable-dialogo.component';
import { MediaObserver } from '@angular/flex-layout';
import { VariablesGlobalesService } from '../variables-globales.service';

@Component({
  selector: 'app-lista-variables',
  templateUrl: './lista-variables.component.html',
  styleUrls: ['./lista-variables.component.css']
})
export class ListaVariablesComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private sharedService: SharedService, private variablesGlobalesService: VariablesGlobalesService, public dialog: MatDialog, public mediaObserver: MediaObserver) { }

  isLoading: boolean = false;
  mediaSize: string;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  dataSource: any = [];

  ngOnInit() {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    this.loadListadoVariables();
  }

  loadListadoVariables(event?){
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

    this.variablesGlobalesService.getListadoVariables(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
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
    this.loadListadoVariables(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  editarGrupo(id: number, index: number){
    this.selectedItemIndex = index;
    this.mostrarFormVariable(id);
  }

  mostrarFormVariable(id?:number){
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{id: id, scSize:this.mediaSize},
        panelClass: 'no-padding-dialog'
      };
    }else{
      configDialog = {
        width: '60%',
        maxHeight: '90vh',
        //height: '643px',
        data:{id: id},
        panelClass: 'no-padding-dialog'
      }
    }

    const dialogRef = this.dialog.open(FormVariableDialogoComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadListadoVariables(this.pageEvent);
      }
    });
  }

  eliminarVariable(id:number){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Borrar Variable',dialogMessage:'¿Realmente desea borrar la Variable seleccionada? Escriba ELIMINAR a continuación para realizar el proceso.',validationString:'ELIMINAR',btnColor:'warn',btnText:'Borrar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoading = true;
        this.variablesGlobalesService.borrarVariable(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadListadoVariables(this.pageEvent);
              this.sharedService.showSnackBar('Variable eliminada', null, 3000);
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
      }
    });
  }
}
