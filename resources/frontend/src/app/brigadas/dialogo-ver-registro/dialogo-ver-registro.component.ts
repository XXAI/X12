import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { BrigadasService } from '../brigadas.service';
import { SharedService } from  '../../shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DialogData {
  registro: any;
}

@Component({
  selector: 'app-dialogo-ver-registro',
  templateUrl: './dialogo-ver-registro.component.html',
  styleUrls: ['./dialogo-ver-registro.component.css']
})
export class DialogoVerRegistroComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoVerRegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private brigadasService: BrigadasService,
    private sharedService: SharedService
  ) { }

  datosRegistro:any;
  isLoading:boolean;
  
  ngOnInit() {
    this.datosRegistro = this.data.registro;
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
