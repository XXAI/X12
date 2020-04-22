import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallCenterService } from '../call-center.service';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

/*export interface FormularioData {
  personaId: number;
  formularioId: number;
}*/

@Component({
  selector: 'app-buscar-formulario-dialogo',
  templateUrl: './buscar-formulario-dialogo.component.html',
  styleUrls: ['./buscar-formulario-dialogo.component.css']
})
export class BuscarFormularioDialogoComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<BuscarFormularioDialogoComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: FormularioData,
    private callCenterService: CallCenterService,
    private sharedService: SharedService
  ) { }
  
  isLoading:boolean = false;
  formuarioData:any;

  searchQuery:string;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;

  selectedItemIndex: number = -1;

  displayedColumns: string[] = ['datos_llamada','datos_persona','actions'];
  dataSource: any = [];


  ngOnInit() {    
  }

  loadListadoFormularios(event){
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
    
    params.query = this.searchQuery;
    this.dataSource = [];
    this.resultsLength = 0;

    this.callCenterService.getFormulariosLlenos(params).subscribe(
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

  searchForm(){
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadListadoFormularios(null);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  seleccionarFormulario(formularioLleno){
    this.dialogRef.close(formularioLleno);
  }

  close(): void {
    this.dialogRef.close();
  }
}