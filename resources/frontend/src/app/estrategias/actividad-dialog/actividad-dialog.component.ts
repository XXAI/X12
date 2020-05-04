import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel } from '@angular/forms';
import { ActividadesService } from '../data-source/actividades.service';
import { merge,interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { map, switchMap, filter, first } from 'rxjs/operators';


@Component({
  selector: 'app-actividad-dialog',
  templateUrl: './actividad-dialog.component.html',
  styleUrls: ['./actividad-dialog.component.css'],
  providers: [
    ActividadesService
  ]
})
export class ActividadDialogComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FormGroup;
  grupos:any [] = [];
  loading: boolean;

  id:any;
  permisosError:boolean;
  objectSubscription: Subscription;
  object:any;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ActividadDialogComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ActividadesService) { }

  ngOnInit (){
    
    this.object = {}
    this.form = this.fb.group(
      {
        descripcion: [''],
        total_meta_programada: ['']
      }
    );

    this.loading = true;
    this.permisosError = false;    
    
  }
  
  ngOnDestroy(){
    if(this.objectSubscription != null){
      this.objectSubscription.unsubscribe();
    }
  }


  ngAfterViewInit(){


    if(this.data.actividad != null){
      this.id = this.data.actividad.id;  
     
      this.objectSubscription = merge(
        this.apiService.ver(this.id).pipe(
          map( response => {
            this.form.get("descripcion").setValue(response.descripcion);  
            this.form.get("total_meta_programada").setValue(response.total_meta_programada);  
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
      this.loading = false;
    }
  }

  crear(){
    this.loading = true;

    var payload = this.form.value;
    payload.estrategia_id = this.data.estrategia_id;

    if(payload.total_meta_programada == ""){
      delete payload.total_meta_programada;
    }

    this.apiService.crear(payload).subscribe(
      response => {
        this.loading = false;
        this.id = response.id;
        this.data.actividad = response;
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
    payload.estrategia_id = this.data.actividad.estrategia_id;

    if(payload.total_meta_programada == ""){
      delete payload.total_meta_programada;
    }

    this.apiService.editar(this.id,payload).subscribe(
      response => {
        this.id = response.id;
        this.data.actividad = response;
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

    this.permisosError = false;

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
    this.permisosError = false;
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
