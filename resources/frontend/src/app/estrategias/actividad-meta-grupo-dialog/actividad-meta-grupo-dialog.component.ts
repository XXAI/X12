import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel } from '@angular/forms';
import { ActividadesMetasGruposService } from '../data-source/actividades-metas-grupos.service';
import { merge,interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { map, switchMap, filter, first } from 'rxjs/operators';


@Component({
  selector: 'app-actividad-meta-grupo-dialog',
  templateUrl: './actividad-meta-grupo-dialog.component.html',
  styleUrls: ['./actividad-meta-grupo-dialog.component.css'],
  providers: [
    ActividadesMetasGruposService
  ]
})
export class ActividadMetaGrupoDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FormGroup;
  grupos:any [] = [];
  loadingCatalogos: boolean;
  loading: boolean;

  id:any;
  objectSubscription: Subscription;
  object:any;

  gruposSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ActividadMetaGrupoDialogComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ActividadesMetasGruposService) { }

  ngOnInit (){
    
    this.object = {}
    this.form = this.fb.group(
      {
        meta_programada: [''],
        grupo_estrategico_id: ['']
      }
    );

    this.loading = true;  
    this.loadingCatalogos = true;    
  }
  
  ngOnDestroy(){
    if(this.objectSubscription != null){
      this.objectSubscription.unsubscribe();
    }

    if(this.gruposSubscription != null){
      this.gruposSubscription.unsubscribe();
    }
  }


  ngAfterViewInit(){


    if(this.data.actividad_meta_grupo != null){
      this.id = this.data.actividad_meta_grupo.id;  
     
      this.objectSubscription = merge(        
        this.apiService.ver(this.id).pipe(
          map( response => {
            this.form.get("grupo_estrategico_id").setValue(response.grupo_estrategico_id);  
            this.form.get("meta_programada").setValue(response.meta_programada); 
            this.object = response;  
            
            if(response.grupos){
              this.grupos = response.grupos;              
            }
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
      this.loadGrupos();    
      this.loading = false;
    }
  }

  
  loadGrupos(){
    if(this.gruposSubscription != null){
      this.gruposSubscription.unsubscribe();
    }
    this.loadingCatalogos = true;
    this.gruposSubscription = this.apiService.grupos().subscribe( response => {
      this.loadingCatalogos = false;
      this.grupos = response.data.grupos;
    }, error=> {
      this.loadingCatalogos = false;
      this.grupos = [];
    });
  }

  crear(){
    this.loading = true;

    var payload = this.form.value;
    payload.actividad_meta_id = this.data.actividad_meta_id;
    payload.actividad_id = this.data.actividad_id;

    if(payload.meta_programada == ""){
      delete payload.meta_programada;
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

    if(payload.meta_programada == ""  || payload.meta_programada == null){
     
      delete payload.meta_programada;
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
        this.dialogRef.close({ last_action: "editar", data: this.data.actividad_meta});
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
