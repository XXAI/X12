import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import {ConcentradosService} from '../concentrados.service';
import { MatPaginator, MatTable, PageEvent } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './visor-concentrados.component.html',
  styleUrls: ['./visor-concentrados.component.css'],

  


})
export class VisorConcentradosComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;

  isLoading:boolean =false;
  searchQuery: string = '';
  datos_paciente:any;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;


  displayedColumns: string[] = ['no_caso', 'sexo', 'edad', 'municipio','responsable','alta_probable','tipo_atencion','estado','unidad_atencion'];
  dataSource: any = [];

  

  constructor(private sharedService: SharedService, public dialog: MatDialog, public concentradosService: ConcentradosService, public mediaObserver: MediaObserver, private route: Router) { }

    
    ngOnInit() {

      this.cargarConcentrados();

          } 
          
          cargarConcentrados(event?)
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
        
            this.concentradosService.getConcentrados(params).subscribe(
              response => {
                //console.log(response);
                if(response.error) {
                  let errorMessage = response.error.message;
                  this.sharedService.showSnackBar(errorMessage, null, 3000);
                } else {
                  //console.log("entra");
                  //console.log(response.data);
                  if(response.data.casos.length > 0){
                    this.dataSource = response.data.casos;
        
                    this.resultsLength = response.data.casos.length;
                  }
                }
                //console.log("pagina actual");
                //console.log(this.pageEvent);
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
            this.cargarConcentrados(null);
          }
        
          cleanSearch(){
            this.searchQuery = '';
          }

  
}
