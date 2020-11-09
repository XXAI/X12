import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  totalBrigadistas: any;
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
  ) { }

  totalBrigadistas:number;
  isLoading:boolean;

  ngOnInit() {
    this.totalBrigadistas = this.data.totalBrigadistas;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  crearRonda(){
    this.dialogRef.close(this.totalBrigadistas);
  }

}
