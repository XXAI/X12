import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { EstrategiasService } from '../estrategias.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, merge, NEVER } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

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
    private route: ActivatedRoute,
    private router: Router) { }

  form:FormGroup;
  objectSubscription: Subscription;

  isLoading:boolean;  
  isSaving:boolean;
  editar:boolean;
  id:any;
  object:any;


  catalogos: any;
  totales: any;
  

  ngOnInit() {
    this.form = this.fb.group({
      nombre:['',Validators.required],
    });

    this.isLoading = true;
    this.editar = false;
    this.isSaving = false;


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
      }
       
    });
  }

  ngOnDestroy(){
    this.objectSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    
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
