import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { GrupoUsuariosDialogoComponent } from '../grupo-usuarios-dialogo/grupo-usuarios-dialogo.component';
import { FormGrupoDialogoComponent } from '../form-grupo-dialogo/form-grupo-dialogo.component';
import { MediaObserver } from '@angular/flex-layout';
import { GruposService } from '../grupos.service';

@Component({
  selector: 'app-lista-grupos',
  templateUrl: './lista-grupos.component.html',
  styleUrls: ['./lista-grupos.component.css']
})
export class ListaGruposComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private sharedService: SharedService, private gruposService: GruposService, public dialog: MatDialog, public mediaObserver: MediaObserver, private route: ActivatedRoute) { }

  isLoading: boolean = false;
  mediaSize: string;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  //displayedColumns: string[] = ['id','folio','descripcion','no_usuarios','actions'];
  dataSource: any = [];

  ngOnInit() {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    this.loadListadoGrupos();
  }

  loadListadoGrupos(event?){
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

    this.gruposService.getListadoGrupos(params).subscribe(
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
    this.loadListadoGrupos(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  editarGrupo(id: number, index: number){
    this.selectedItemIndex = index;
    this.mostrarFormGrupo(id);
  }

  mostrarFormGrupo(id?:number){
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

    const dialogRef = this.dialog.open(FormGrupoDialogoComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadListadoGrupos(this.pageEvent);
      }
    });
  }

  mostrarListaUsuarios(id:number){
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
        width: '80%',
        height:'500px',
        data:{id: id},
        panelClass: 'no-padding-dialog'
      }
    }

    const dialogRef = this.dialog.open(GrupoUsuariosDialogoComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadListadoGrupos(this.pageEvent);
      }
    });
  }

  eliminarGrupo(id:number){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Borrar Grupo',dialogMessage:'¿Realmente desea borrar el Grupo seleccionado? Escriba ELIMINAR a continuación para realizar el proceso.',validationString:'ELIMINAR',btnColor:'warn',btnText:'Borrar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.isLoading = true;
        this.gruposService.borrarGrupo(id).subscribe(
          response =>{
            if(response.error) {
              let errorMessage = response.error.message;
              this.sharedService.showSnackBar(errorMessage, null, 3000);
            } else {
              this.loadListadoGrupos(this.pageEvent);
              this.sharedService.showSnackBar('Grupo borrado', null, 3000);
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
