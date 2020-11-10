import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from '../../shared/shared.service';

export interface DialogData {
  totalBrigadistas: any;
  idBrigada:number;
}

@Component({
  selector: 'app-dialogo-brigadistas',
  templateUrl: './dialogo-brigadistas.component.html',
  styleUrls: ['./dialogo-brigadistas.component.css']
})
export class DialogoBrigadistasComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogoBrigadistasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private brigadasService: BrigadasService,
    private sharedService: SharedService
  ) { }

  idBrigada:number;
  totalBrigadistas:number;
  isLoading:boolean;

  ngOnInit() {
    this.totalBrigadistas = this.data.totalBrigadistas;
    this.idBrigada = this.data.idBrigada;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  actualizarBrigadistas(){
    this.isLoading = true;
    this.brigadasService.actualizarBrigadistas(this.idBrigada,{total_brigadistas: this.totalBrigadistas}).subscribe(
      response => {
        this.sharedService.showSnackBar('Datos guardados con éxito', null, 3000);
        this.isLoading = false;
        this.dialogRef.close(this.totalBrigadistas);
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
