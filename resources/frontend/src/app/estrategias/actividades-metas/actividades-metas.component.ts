import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { EstrategiasService } from '../estrategias.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, merge, NEVER } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ActividadesMetasGruposDataSource } from '../data-source/actividades-metas-grupos.data-source';
import { ActividadesMetasGruposService } from '../data-source/actividades-metas-grupos.service';
import { ActividadesMetasService } from '../data-source/actividades-metas.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ActividadMetaGrupoDialogComponent } from '../actividad-meta-grupo-dialog/actividad-meta-grupo-dialog.component';
import { ActividadMetaDialogComponent } from '../actividad-meta-dialog/actividad-meta-dialog.component';

@Component({
  selector: 'app-actividades-metas',
  templateUrl: './actividades-metas.component.html',
  styleUrls: ['./actividades-metas.component.css']
})
export class ActividadesMetasComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,  
    private actividadesMetasGruposService: ActividadesMetasGruposService,
    private actividadesMetasService: ActividadesMetasService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }

  objectSubscription: Subscription;

  isLoading:boolean;  
  isSaving:boolean;
  editar:boolean;
  id:any;
  object:any;

  displayedColumns: string[] = ['id','grupo','meta_programada'];
  dataSource: any = [];
  inputSearchTxt:string = "";
  filter: string = "";
  orderBy:string;
  hideTable:boolean;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  catalogos: any;
  totales: any;
  

  ngOnInit() {

    this.dataSource = new ActividadesMetasGruposDataSource(this.actividadesMetasGruposService);    
    

    this.isLoading = true;
    this.editar = false;
    this.isSaving = false;
    this.hideTable = false;

    this.objectSubscription = this.route.paramMap.pipe(
      map( params => {
        const id = params.get('id3');
        this.id = id;
        return id; 
      }),
      switchMap( id => {
        return this.actividadesMetasService.ver(this.id);       
      })
    ).subscribe( data =>  {
      console.log(data);
      this.object = data;
      
      this.isLoading = false;
      this.dataSource.loadData(this.id,'','asc','',0,5);   
       
    }, error=>{
      //this.router.navigate(['../../'],{ relativeTo: this.route });
    });

    
  }

  ngOnDestroy(){
    this.objectSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    if(!this.hideTable){
      this.sort.sortChange.subscribe(() => { this.orderBy = this.sort.active; this.paginator.pageIndex = 0});
      merge(this.sort.sortChange,this.paginator.page)
        .pipe(
          tap(()=> this.loadData())
        ).subscribe();
    }
    
  }

  loadData(){   
    this.dataSource.loadData(this.id,this.filter.trim().toLowerCase(),this.sort.direction,this.orderBy,this.paginator.pageIndex, this.paginator.pageSize);
  }

  applyFilter(): void {
    this.filter = this.inputSearchTxt;
    this.paginator.pageIndex = 0;
    this.loadData();
  }

  back(){
    this.router.navigate(['../../'],{ relativeTo: this.route });
  } 

  editarGrupo(row: any){
    // aqui ya es con puras modales bueno deberia aun no lo termino jaja
  }

  openDialogEdit(): void{

    var item: any = {
      edit: true, 
      actividad_meta: this.object
    }
    const dialogRef = this.dialog.open(ActividadMetaDialogComponent, { width: "600px",data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(result.last_action == "editar"){
          this.object = result.data;
        }
        if(result.last_action == "delete"){
          this.router.navigate(['../../'],{ relativeTo: this.route });
        }
      }     
    });
  }

  openDialogEditGrupo(row:any): void{

    var item: any = {
      edit: true, 
      actividad_meta_grupo: row
    }
    const dialogRef = this.dialog.open(ActividadMetaGrupoDialogComponent, { width: "600px",data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(result.last_action == "editar"){
          this.loadData();
        }
        if(result.last_action == "delete"){
          this.loadData();
        }
      }     
    });
  }

  openDialogCreateGrupo(): void{

    var item: any = {
      edit: false, 
      actividad_meta_grupo: null,
      actividad_id: this.object.actividad_id,
      actividad_meta_id: this.id
    }
    const dialogRef = this.dialog.open(ActividadMetaGrupoDialogComponent, { width: "600px",data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(result.last_action == "crear"){
          this.loadData();
        }
      }
     
    });
  }
}