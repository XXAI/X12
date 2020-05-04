import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel } from '@angular/forms';
import { ActividadesMetasService } from '../data-source/actividades-metas.service';
import { merge,interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { map, switchMap, filter, first } from 'rxjs/operators';


@Component({
  selector: 'app-actividad-meta-dialog',
  templateUrl: './actividad-meta-dialog.component.html',
  styleUrls: ['./actividad-meta-dialog.component.css'],
  providers: [
    ActividadesMetasService
  ]
})
export class ActividadMetaDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FormGroup;
  distritos:any [] = [];
  municipios:any [] = [];
  localidades:any [] = [];
  loadingCatalogos: boolean;
  loading: boolean;

  id:any;
  objectSubscription: Subscription;
  object:any;


  distritoSubscription: Subscription;
  municipioSubscription: Subscription;
  localidadSubscription: Subscription;

  showMunicipios:boolean;
  showLocalidades:boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ActividadMetaDialogComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ActividadesMetasService) { }

  ngOnInit (){
    
    this.object = {}
    this.form = this.fb.group(
      {
        meta_programada: [''],
        distrito_id: [''],
        municipio_id: [''],
        localidad_id: ['']
      }
    );

    this.loading = true;  
    this.loadingCatalogos = true;

    this.showLocalidades = this.showMunicipios = false;
    
  }
  
  ngOnDestroy(){
    if(this.objectSubscription != null){
      this.objectSubscription.unsubscribe();
    }
  }


  ngAfterViewInit(){


    if(this.data.actividad_meta != null){
      this.id = this.data.actividad_meta.id;  
      
     
      this.objectSubscription = merge(
        this.apiService.ver(this.id).pipe(
          map( response => {
            this.form.get("distrito_id").setValue(response.distrito_id);  
            this.form.get("meta_programada").setValue(response.meta_programada);  
            this.object = response;
            return true;
          })
        )
      ).subscribe(
        last => {
          if(last){
            this.loading = false;
          }          
        }
      )
    } else {
      console.log(this.data);
      this.loadDistritos();
    
      this.loading = false;
    }
  }

  
  selectDistrito(e){
    if(typeof e  !== "undefined"){
      this.showMunicipios = true;
      this.loadMunicipios(e);
    } else {
      this.showMunicipios = false;
    }
    
  }
  selectMunicipio(e){
    if(typeof e  !== "undefined"){
      this.showLocalidades = true;
      this.loadLocalidades(e);
    } else {
      this.showLocalidades = false;
    }
    
  }
  loadDistritos(){
    if(this.distritoSubscription != null){
      this.distritoSubscription.unsubscribe();
    }

    this.showMunicipios = false;
    this.showLocalidades = false;

    this.loadingCatalogos = true;
    this.disableCatalogos();
    this.distritoSubscription = this.apiService.distritos().subscribe( response => {
      this.loadingCatalogos = false;
      this.distritos = response.data.distritos;
      this
     
      this.enableCatalogos();
    }, error=> {
      this.loadingCatalogos = false;
      this.distritos = [];
      this.enableCatalogos();
    });
  }

  loadMunicipios(distrito_id){
    if(this.municipioSubscription != null){
      this.municipioSubscription.unsubscribe();
    }
    this.showLocalidades = false;
    this.loadingCatalogos = true;
    this.disableCatalogos();
    this.municipioSubscription = this.apiService.municipios(distrito_id).subscribe( response => {
      this.loadingCatalogos = false;
      
      this.municipios = response.data.municipios;
      this.enableCatalogos();
    }, error=> {
      this.loadingCatalogos = false;
      this.municipios = [];
      
      this.enableCatalogos();
    });
  }

  loadLocalidades(municipio_id){
    if(this.localidadSubscription != null){
      this.localidadSubscription.unsubscribe();
    }
    this.loadingCatalogos = true;
    this.disableCatalogos();
    this.localidadSubscription = this.apiService.localidades(municipio_id).subscribe( response => {
      this.loadingCatalogos = false;
      this.localidades = response.data.localidades;
      this.enableCatalogos();
    }, error=> {
      this.loadingCatalogos = false;
      this.localidades = [];
      this.enableCatalogos();
    });
  }

  disableCatalogos(){
    this.form.get('distrito_id').disable();
    this.form.get('municipio_id').disable();
    this.form.get('localidad_id').disable();
  }

  enableCatalogos(){
    this.form.get('distrito_id').enable();
    this.form.get('municipio_id').enable();
    this.form.get('localidad_id').enable();
  }

  crear(){
    this.loading = true;

    var payload = this.form.value;
    payload.actividad_id = this.data.actividad_id;

    if(payload.meta_programada == ""){
      delete payload.meta_programada;
    }

    if(payload.distrito_id == ""){
      delete payload.municipio_id;
      delete payload.municipio_id;
      delete payload.localidad_id;
    }

    if(payload.municipio_id == ""){
      delete payload.municipio_id;
      delete payload.localidad_id;
    }

    if(payload.localidad_id == ""){
      delete payload.localidad_id;
    }

    this.apiService.crear(payload).subscribe(
      response => {
        this.loading = false;
        this.id = response.id;
        this.data.actividad_meta = response;
        this.data.edit = true;

        this.snackBar.open("Los datos fueron creados exitosamente", "Cerrar", {
          duration: 4000,
        });

        this.dialogRef.close({ last_action: "crear", data: this.id});

      },
      errorResponse => {
        this.loading = false;
        if(errorResponse.status == 409){
          this.snackBar.open("Verifique la información del formulario", "Cerrar", {
            duration: 4000,
          });
          this.setErrors(errorResponse.error);
        } else {
          this.snackBar.open(errorResponse.error.message, "Cerrar", {
            duration: 4000,
          });
        }         
      }      
    );
  }
  editar(){
    this.loading = true;
    
    var payload = this.form.value;
    payload.actividad_id = this.data.actividad_meta.actividad_id;

    if(payload.total_meta_programada == ""){
      delete payload.total_meta_programada;
    }

    this.apiService.editar(this.id,payload).subscribe(
      response => {
        this.id = response.id;
        this.data.actividad_meta = response;
        this.loading = false;
        this.snackBar.open("Los datos fueron guardados exitosamente", "Cerrar", {
          duration: 4000,
        });
        console.log(response);
        this.dialogRef.close({ last_action: "editar", data: this.data.actividad});
      },
      errorResponse => {
        this.loading = false;
        if(errorResponse.status == 409){
          this.snackBar.open("Verifique la información del formulario", "Cerrar", {
            duration: 4000,
          });
          this.setErrors(errorResponse.error);
        } else {
          this.snackBar.open(errorResponse.error.message, "Cerrar", {
            duration: 4000,
          });
        }             
      }      
    );
  }

  cancelar(): void {
    this.dialogRef.close({ last_action: "none"});
  }
  borrar(): void {
    const dialogConfirmRef = this.dialog.open(ConfirmDialogComponent, { data:"¿Estás seguro de borrar este elemento?"});

    dialogConfirmRef.afterClosed()
    .pipe(
      filter((result) => result == true),
      switchMap(v => this.apiService.borrar(this.id))
    )
    .subscribe(result => {
      this.dialogRef.close({
        last_action: "delete"
      });
    }, errorResponse => {
      this.snackBar.open(errorResponse.error.message, "Cerrar", {
        duration: 4000,
      });
    });
  }
  
  guardar(): void {
    for (const key in this.form.controls) {
      this.form.get(key).clearValidators();
      this.form.get(key).updateValueAndValidity();
    }  
    if(this.data.edit){
      this.editar();
    } else {      
      this.crear();
    }
  }

  serverValidator(error: {[key: string]: any}):ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      return error;
    }
  }

  setErrors(validationErrors:any[]){
    Object.keys(validationErrors).forEach( prop => {
      const formControl = this.form.get(prop);
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
}
