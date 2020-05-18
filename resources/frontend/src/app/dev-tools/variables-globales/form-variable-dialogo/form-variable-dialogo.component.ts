import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../shared/shared.service';
import { VariablesGlobalesService } from '../variables-globales.service';

export interface VariableData {
  id?: number;
}

@Component({
  selector: 'app-form-variable-dialogo',
  templateUrl: './form-variable-dialogo.component.html',
  styleUrls: ['./form-variable-dialogo.component.css']
})
export class FormVariableDialogoComponent implements OnInit {

  constructor(
    private sharedService:SharedService,
    private variablesGlobalesService: VariablesGlobalesService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FormVariableDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VariableData,
    private formBuilder: FormBuilder
  ) { }

  esEditar:boolean;
  
  isLoading:boolean;
  idVariable:number;
  variableForm:FormGroup;
  usuario:any;

  ngOnInit() {
    this.variableForm = this.formBuilder.group({
      nombre:['',Validators.required],
      valor:['']
    });

    if(this.data.id){
      this.esEditar = true;
      this.idVariable = this.data.id;
      this.isLoading = true;
      this.variablesGlobalesService.verVariable(this.idVariable).subscribe(
        response =>{
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.variableForm.patchValue(response.data);
            this.usuario = response.data.usuario;
          }
          this.isLoading = false;
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

  guardarVariable(){
    let formData = this.variableForm.value;
    this.isLoading = true;

    if(this.esEditar){
      this.variablesGlobalesService.modificarVariable(this.idVariable,formData).subscribe(
        response =>{
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.dialogRef.close(response.data);
          }
          this.isLoading = false;
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
    }else{
      this.variablesGlobalesService.guardarVariable(formData).subscribe(
        response =>{
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.dialogRef.close(response.data);
          }
          this.isLoading = false;
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

  close(): void {
    this.dialogRef.close();
  }
}
