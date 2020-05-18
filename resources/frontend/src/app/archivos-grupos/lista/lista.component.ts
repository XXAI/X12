import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, merge, NEVER } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ArchivosGruposDataSource } from '../data-source/archivos-grupos.data-source';
import { ArchivosGruposService } from '../data-source/archivos-grupos.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ArchivosGruposDialogComponent } from '../archivos-grupos-dialog/archivos-grupos-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,  
    private apiService: ArchivosGruposService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }


  isLoading:boolean;  
  isSaving:boolean;
  editar:boolean;
  id:any;
  object:any;

  displayedColumns: string[] = ['id','titulo','grupo','created_at','archivo'];
  dataSource: any = [];
  inputSearchTxt:string = "";
  filter: string = "";
  orderBy:string;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  catalogos: any;
  totales: any;
  botonBloquear:boolean;

  ngOnInit() {

    this.dataSource = new ArchivosGruposDataSource(this.apiService);   
    this.dataSource.loadData('','desc','',0,5);   
    var permisos =  JSON.parse( localStorage.getItem('permissions'));
    if(permisos.kjBw52kYMsDiR0xdKiOWuWxMXhxIIrhy){
      this.botonBloquear = true;
    } else {
      this.botonBloquear = false;
    }   
  }

  ngOnDestroy(){
  }

  ngAfterViewInit(){
    this.sort.sortChange.subscribe(() => { this.orderBy = this.sort.active; this.paginator.pageIndex = 0});
    merge(this.sort.sortChange,this.paginator.page)
      .pipe(
        tap(()=> this.loadData())
      ).subscribe();
    
  }

  loadData(){   
    this.dataSource.loadData(this.filter.trim().toLowerCase(),this.sort.direction,this.orderBy,this.paginator.pageIndex, this.paginator.pageSize);
  }

  applyFilter(): void {
    this.filter = this.inputSearchTxt;
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  back(){
    this.router.navigate(['../../'],{ relativeTo: this.route });
  } 

  editarMeta(row: any){
    this.router.navigate(['meta/'+ row.id],{ relativeTo: this.route });
  }

  bloquearSubida(): void {
    alert("Pendiente de implementar");
  }

  openDialogEdit(): void{
/*
    var item: any = {
      edit: true, 
      actividad: this.object
    }
    const dialogRef = this.dialog.open(ActividadDialogComponent, { width: "600px",data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(result.last_action == "editar"){
          this.object = result.data;
        }
        if(result.last_action == "delete"){
          this.router.navigate(['../../'],{ relativeTo: this.route });
        }
      }     
    });*/
  }

  openDialogCreate(): void{

    var item: any = {
      edit: false, 
      archivo_grupo: null
    }
    const dialogRef = this.dialog.open(ArchivosGruposDialogComponent, { width: "600px",data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(result.last_action == "crear"){
          this.loadData();
        }
      }     
    });
  }

  descargar(id:any):void {
    var query = "token=" + localStorage.getItem('token');
		window.open(`${environment.base_url}/descargar-archivo-grupo/${id}?${query}`);
  }



}