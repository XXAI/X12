import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

export interface DialogData {
  idBrigada:number;
  datosBrigada:any;
}

@Component({
  selector: 'app-dialogo-config-brigadas',
  templateUrl: './dialogo-config-brigadas.component.html',
  styleUrls: ['./dialogo-config-brigadas.component.css']
})
export class DialogoConfigBrigadasComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogoConfigBrigadasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private brigadasService: BrigadasService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
  ) { }

  formConfiguracion:FormGroup;

  idBrigada:number;
  isLoading:boolean;

  noTotalBrigadas:number;

  ngOnInit() {
    this.formConfiguracion = this.formBuilder.group({
      nombre_responsable_brigadas:['',Validators.required],
      telefono_responsable_brigadas:['',Validators.required],
      email_responsable_brigadas:['',Validators.required],
      total_brigadistas:['',[Validators.required,Validators.min(1),Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
    this.idBrigada = this.data.idBrigada;
    this.formConfiguracion.patchValue(this.data.datosBrigada);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  actualizarConfiguracionBrigadas(){
    this.isLoading = true;
    let datos = this.formConfiguracion.value;
    this.brigadasService.configurarBrigadas(this.idBrigada,datos).subscribe(
      response => {
        this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
        this.isLoading = false;
        this.dialogRef.close(response.data);
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

}
