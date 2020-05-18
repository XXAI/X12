import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { EstrategiasService } from '../estrategias.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, merge, NEVER } from 'rxjs';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ActividadesDataSource } from '../data-source/actividades.data-source';
import { ActividadesService } from '../data-source/actividades.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ActividadDialogComponent } from '../actividad-dialog/actividad-dialog.component';

@Component({
  selector: 'app-estrategia',
  templateUrl: './estrategia.component.html',
  styleUrls: ['./estrategia.component.css']
})
export class EstrategiaComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,  
    private estrategiasService: EstrategiasService,
    private actividadesService: ActividadesService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }

  form:FormGroup;
  objectSubscription: Subscription;

  isLoading:boolean;  
  isSaving:boolean;
  editar:boolean;
  id:any;
  object:any;

  displayedColumns: string[] = ['id','descripcion','total_meta_programada'];
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
    this.form = this.fb.group({
      nombre:['',Validators.required],
    });

    this.dataSource = new ActividadesDataSource(this.actividadesService);    
    

    this.isLoading = true;
    this.editar = false;
    this.isSaving = false;
    this.hideTable = false;

   /*
    this.route.paramMap.subscribe(params => {
      if(params.get('id')){
        this.id = params.get('id');
      } else{
        this.id = null;
        this.editar = true;
      }
    });

    this.catalogos = {programas:[]};

    this.totales = {
      insumos: 0,
      medicamentos: 0,
      mat_curacion: 0
    }*/

    this.objectSubscription = this.route.paramMap.pipe(
      map( params => {
        const id = params.get('id');
        this.id = id;
        return id; 
      }),
      switchMap( id => {

        if(id != null){

          return this.estrategiasService.getDatosEstrategia(this.id);
        }  else {
          this.editar = true;
          this.isLoading = false;
          this.hideTable = true;
          return NEVER;
        }        
      })
    ).subscribe( result =>  {
      if(result.data == null){
        this.router.navigate(['../../'],{ relativeTo: this.route });
      } else {
        this.object = result.data;
        this.isLoading = false;
        this.form.get("nombre").setValue(result.data.nombre); 
        this.dataSource.loadData(this.id,'','asc','',0,5);   
      }
       
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

  cancelar(){
    this.editar = false;
    this.form.get("nombre").setValue(this.object.nombre); 
  }
  crear(){
    this.form.get('nombre').disable();
    this.isSaving = true;
    var payload  =this.form.value;
    this.estrategiasService.guardarEstrategia(payload).subscribe(
      response =>{        
        this.isSaving = false;
        
        this.router.navigate(['../editar/' + response.data.id],{ relativeTo: this.route });
      },
      errorResponse =>{
        this.isSaving = false;
        this.form.get('nombre').enable();
        if(errorResponse.status == 409){
          this.sharedService.showSnackBar("Verifique la información del formulario", "Cerrar", 4000);
          this.setErrors(errorResponse.error);
        } else {
          this.sharedService.showSnackBar(errorResponse.error.message, "Cerrar",4000);
        }    
      }
    );
  }
  guardar(){

    this.form.get('nombre').disable();
    this.isSaving = true;
    var payload  =this.form.value;

    this.estrategiasService.actualizarEstrategia(this.id,payload).subscribe(
      response =>{        
        this.isSaving = false;
        this.object.nombre = response.data.nombre;
        this.form.get("nombre").setValue(this.object.nombre); 
        this.editar = false;
      },
      errorResponse =>{
        this.isSaving = false;
        this.form.get('nombre').enable();
        if(errorResponse.status == 409){
          this.sharedService.showSnackBar("Verifique la información del formulario", "Cerrar", 4000);
          this.setErrors(errorResponse.error);
        } else {
          this.sharedService.showSnackBar(errorResponse.error.message, "Cerrar",4000);
        }    
      }
    );
    
  }

  openDialogCreate(): void{

    var item: any = {
      edit: false, 
      actividad: null,
      estrategia_id: this.id
    }
    const dialogRef = this.dialog.open(ActividadDialogComponent, { width: "600px",data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(result.last_action == "crear"){
          console.log("aah");
          this.router.navigate(['actividad/'+ result.data],{ relativeTo: this.route });
        }
      }
     
    });
  }

  editarActividad(row: any){
    this.router.navigate(['actividad/'+ row.id],{ relativeTo: this.route });
  }

 

  setErrors(validationErrors:any[]){
    Object.keys(validationErrors).forEach( prop => {
      const formControl = this.form.get(prop);
      console.log(prop);
      if(formControl){

        formControl.markAsTouched();       

        var array = [];
        for(var x in validationErrors[prop]){
          array.push(this.serverValidator({[validationErrors[prop][x]]: true}));
        }
        formControl.setValidators(array);              
        formControl.updateValueAndValidity();
      }
    });
  }

  serverValidator(error: {[key: string]: any}):ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      return error;
    }
  }

}
