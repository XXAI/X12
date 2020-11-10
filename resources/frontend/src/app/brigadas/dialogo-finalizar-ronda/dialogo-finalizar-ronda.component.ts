import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';

export interface DialogData {
  idRonda: number;
}

@Component({
  selector: 'app-dialogo-finalizar-ronda',
  templateUrl: './dialogo-finalizar-ronda.component.html',
  styleUrls: ['./dialogo-finalizar-ronda.component.css']
})
export class DialogoFinalizarRondaComponent implements OnInit {

    constructor(
      public dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogoFinalizarRondaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private brigadasService: BrigadasService,
      private sharedService: SharedService
    ) { }

    idRonda:number;
    fechaFin:string;
    isLoading:boolean;

    ngOnInit() {
      this.fechaFin = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.idRonda = this.data.idRonda;
    }

    cancelar(): void {
      this.dialogRef.close();
    }

    finalizarRonda(){
      if(this.fechaFin){
        this.isLoading = true;
        
        this.brigadasService.finalizarRonda(this.idRonda,{'fecha_fin':this.fechaFin}).subscribe(
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

}
