import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';

export interface DialogData {
  ultimaRonda: any;
  idBrigada: number;
}

@Component({
  selector: 'app-dialogo-nueva-ronda',
  templateUrl: './dialogo-nueva-ronda.component.html',
  styleUrls: ['./dialogo-nueva-ronda.component.css']
})
export class DialogoNuevaRondaComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoNuevaRondaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private brigadasService: BrigadasService,
    private sharedService: SharedService
  ) { }

  formRonda:FormGroup;
  isLoading:boolean;

  ngOnInit() {
    let fecha_hoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let ultima_ronda = '';

    if(this.data.ultimaRonda > 0){
      ultima_ronda = (this.data.ultimaRonda + 1);
    }

    this.formRonda = this.formBuilder.group({
      brigada_id: this.data.idBrigada,
      fecha_inicio:[fecha_hoy,Validators.required],
      no_ronda:[ultima_ronda,Validators.required],
      id:['']
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  crearRonda(){
    if(this.formRonda.valid){
      this.isLoading = true;
      let datos_ronda = this.formRonda.value;

      this.brigadasService.guardarRonda(datos_ronda).subscribe(
        response => {
          let ronda = response.data;          
          this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
          this.isLoading = false;
          this.dialogRef.close(ronda);
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
}
