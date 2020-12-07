import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatSort } from '@angular/material';
import { getEspPaginatorIntl } from 'src/app/esp-paginator-intl';
import { CasoSospechoso, CasosSospechososDataSource, CasosSospechososService } from "@app/casos-sospechosos";
import { Title } from '@angular/platform-browser';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
/*
const ELEMENT_DATA: CasoSospechoso[] = [
  { id: 1, folio: "123", fecha_identificacion: new Date(), apellido_paterno: "GUTIERREZ", apellido_materno:"CORZO", nombre: "HUGO", sexo: "H", edad: 33, updated_at: "2020-13-01 10:00:00"},
];*/

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ],
  encapsulation : ViewEncapsulation.None,
})
export class IndexComponent implements OnInit {

  inputSearchTxt:string = "";
  filter: string = "";
  private orderBy:string;
  displayedColumns: string[] = ['folio', 'nombre', 'sexo','municipio_nombre','localidad_nombre', 'colonia_nombre', 'updated_at'];

  dataSource: CasosSospechososDataSource;
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor( private titleService: Title, private apiService: CasosSospechososService) {
  }

  ngOnInit() {
    this.titleService.setTitle("Casos sospechosos");

    this.dataSource = new CasosSospechososDataSource(this.apiService);    
    this.dataSource.loadData('','asc','',0,5); 
  }

  ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => { this.orderBy = this.sort.active; this.paginator.pageIndex = 0});
    merge(this.sort.sortChange,this.paginator.page)
      .pipe(
        tap(()=> this.loadData())
      ).subscribe();
  }

  checkFilter(){
    this.inputSearchTxt = this.filter;
  }
  applyFilter(): void {
    this.filter = this.inputSearchTxt.trim().toLowerCase();
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  loadData(){   
    this.dataSource.loadData(this.filter.trim().toLowerCase(),this.sort.direction,this.orderBy,this.paginator.pageIndex, this.paginator.pageSize);
  }

}
