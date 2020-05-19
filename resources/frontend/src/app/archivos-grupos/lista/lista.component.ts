import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, merge, NEVER, empty } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ArchivosGruposDataSource } from '../data-source/archivos-grupos.data-source';
import { ArchivosGruposService } from '../data-source/archivos-grupos.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ArchivosGruposDialogComponent } from '../archivos-grupos-dialog/archivos-grupos-dialog.component';
import { environment } from 'src/environments/environment';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

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

  displayedColumns: string[] = ['id','titulo','grupo','created_at','archivo','options'];
  dataSource: any = [];
  inputSearchTxt:string = "";
  filter: string = "";
  orderBy:string;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  catalogos: any;
  totales: any;
  botonBloquear:boolean;
  variableGlobal:any;
  ngOnInit() {

    this.dataSource = new ArchivosGruposDataSource(this.apiService);   
    this.dataSource.loadData('','desc','',0,5);   
    var permisos =  JSON.parse( localStorage.getItem('permissions'));
    if(permisos.kjBw52kYMsDiR0xdKiOWuWxMXhxIIrhy){
     

      this.apiService.getGlobalVariable().subscribe(
        result => {
          if(result.data !=null){
            if(result.data.length > 0){
              this.botonBloquear = true;
              this.variableGlobal = result.data[0];
            }
          }
          
        }
      )
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
    this.apiService.updateGlobalVariable(this.variableGlobal.id, {valor: "true"}).subscribe(
      result => {
        if(result.data !=null){
          this.variableGlobal = result.data;
        }
      }, error => {
        console.log(error);
      }
    );
  }

  desbloquearSubida(): void {
    this.apiService.updateGlobalVariable(this.variableGlobal.id, {valor: "false"}).subscribe(
      result => {
        if(result.data !=null){
          this.variableGlobal = result.data;
        }
      }, error => {
        console.log(error);
      }
    );
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

  eliminar(row:any){
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data:"¿Desea eliminar el archivo: " + row.titulo + "?"});
    
    const deleteSubscription = dialogRef.afterClosed().pipe(
      switchMap((ev) => {
        if(ev != null && ev == true ){
          return this.apiService.borrar(row.id);
        } else {
          return empty();
        }
      })
    );

    deleteSubscription.subscribe(
      result => {
        console.log(result)
        this.loadData();
      }, error => {
        console.log(error)
      }
    )


  }



}