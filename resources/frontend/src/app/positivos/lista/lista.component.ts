import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatExpansionPanel } from '@angular/material';
import { ConfirmActionDialogComponent } from '../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { map, startWith } from 'rxjs/operators';
import { PermissionsList } from '../../auth/models/permissions-list';
import { MediaObserver } from '@angular/flex-layout';
import { PositivosService } from '../positivos.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;

  isLoading:boolean =false;
  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;
  sexo:any = ['', 'MASCULINO', 'FEMENINO'];

  displayedColumns: string[] = ['no_caso', 'municipio','sexo', 'edad', 'responsable', 'actions'];
  dataSource: any = [];

  constructor(private sharedService: SharedService, public dialog: MatDialog, public positivosService: PositivosService, public mediaObserver: MediaObserver, private route: Router) { }

  ngOnInit() {
    this.cargarLista();
  }

  cargarLista(event?)
  {
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

    this.positivosService.obtenerLista(params).subscribe(
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

  confirmAlta(id:string = ''){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Salida de Paciente',dialogMessage:'Esta seguro de dar salida por alta al paciente?',btnColor:'warn',btnText:'Dar de Alta'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.cargarLista();
      }
    });
  }

  confirmDefuncion(id:string = ''){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Salida de Paciente',dialogMessage:'Esta seguro de dar salida por Defunción al paciente?',btnColor:'warn',btnText:'Defunción'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.cargarLista();
      }
    });
  }

  accionPaciente(valor, id)
  {
    switch(valor)
    {
      case 1:this.confirmAlta(); valor = 1;
      break;
      case 2:
      break;
      case 3: this.route.navigateByUrl('/casos-positivos/editar/'+id);
    
      break;
    }
    console.log(valor);
  }

}
