import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { BitacoraService, Bitacora } from '@app/casos-sospechosos';

@Component({
  selector: 'app-bitacora-form-dialog',
  templateUrl: './bitacora-form-dialog.component.html',
  styleUrls: ['./bitacora-form-dialog.component.css']
})
export class BitacoraFormDialogComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  bitacora: Bitacora;
  caso_id:Number;
  reloadOnClose:boolean;

  constructor(
    public dialogRef: MatDialogRef<BitacoraFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private apiService:BitacoraService
  ) { }

  ngOnInit() {
    this.reloadOnClose = false;
    if(this.data.bitacora != null){
      this.caso_id = this.data.caso_id;
      this.bitacora = this.data.bitacora;
      this.form = this.fb.group(
        {
          seguimiento: [this.data.bitacora.seguimiento]
        }
      );
    } else {
      this.caso_id = this.data.caso_id;
      this.form = this.fb.group(
        {
          seguimiento: ['']
        }
      );
    }
  }

  cerrar(): void {
    this.dialogRef.close({ reload: this.reloadOnClose});
  }

  guardar():void {
    for (const key in this.form.controls) {
      this.form.get(key).clearValidators();
      this.form.get(key).updateValueAndValidity();
    }  

    //if(this.form.invalid) return;

    if(this.bitacora != null) {
      this.update();
    } else {
      this.store();
    }
  }

  update() {
    console.log("update");
    this.setLoading(true);
    var payload = this.form.value;
    payload.caso_id = this.caso_id;

    this.apiService.editar(this.bitacora.id,payload).subscribe(
      response => {
        this.setLoading(false);
        this.reloadOnClose = true;
        /*
        this.id = response.id;
        this.data.usuario = response;
        this.data.edit = true;*/

        this.snackBar.open("Los datos fueron editados exitosamente", "Cerrar", {
          duration: 4000,
        });
      },
      errorResponse => {
        this.setLoading(false);
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
  
  store(){
    
    this.setLoading(true);
    var payload = this.form.value;

    payload.caso_id = this.caso_id;
    this.apiService.crear(payload).subscribe(
      response => {
        this.setLoading(false);
        this.bitacora = response.bitacora;
        this.reloadOnClose = true;
        /*
        this.id = response.id;
        this.data.usuario = response;
        this.data.edit = true;*/

        this.snackBar.open("Los datos fueron creados exitosamente", "Cerrar", {
          duration: 4000,
        });
       
       

      },
      errorResponse => {
        this.setLoading(false);
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
  setLoading(value:boolean) {
    this.loading = value;
    if(value) {
      this.form.get('seguimiento').disable();
    } else{
      this.form.get('seguimiento').enable();
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
