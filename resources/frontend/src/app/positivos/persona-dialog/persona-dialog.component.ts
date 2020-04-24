import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface PersonaIndiceData {
  id?: string;
  sexo?: string;
}

@Component({
  selector: 'app-persona-dialog',
  templateUrl: './persona-dialog.component.html',
  styleUrls: ['./persona-dialog.component.css']
})
export class PersonaDialogComponent implements OnInit {

  catalogo_sexo:any = ['','MASCULINO', 'FEMENINO'];
  constructor(public dialog: MatDialog,  private formBuilder: FormBuilder, private router: Router, 
    public dialogRef: MatDialogRef<PersonaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonaIndiceData,) { }

  ngOnInit() {
    console.log(this.data);
   

  }

}
