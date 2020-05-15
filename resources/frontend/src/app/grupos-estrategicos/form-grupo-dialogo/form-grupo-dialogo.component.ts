import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';
import { GruposService } from '../grupos.service';

export interface GrupoData {
  id?: number;
}

@Component({
  selector: 'app-form-grupo-dialogo',
  templateUrl: './form-grupo-dialogo.component.html',
  styleUrls: ['./form-grupo-dialogo.component.css']
})
export class FormGrupoDialogoComponent implements OnInit {

  constructor(
    private sharedService:SharedService,
    private gruposService: GruposService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FormGrupoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GrupoData,
    private formBuilder: FormBuilder
  ) { }

  esEditar:boolean;
  
  isLoading:boolean;
  idGrupo:number;
  grupoForm:FormGroup;
  listaUsuariosAsignados:any[];

  ngOnInit() {
    this.grupoForm = this.formBuilder.group({
      folio:['',Validators.required],
      descripcion:['',Validators.required]
    });

    if(this.data.id){
      this.esEditar = true;
      this.idGrupo = this.data.id;
      this.isLoading = true;
      this.gruposService.verGrupo(this.idGrupo).subscribe(
        response =>{
          if(response.error) {
            let errorMessage = response.error.message;
            this.sharedService.showSnackBar(errorMessage, null, 3000);
          } else {
            this.grupoForm.patchValue(response.data);
            this.listaUsuariosAsignados = response.data.usuarios;
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

  guardarGrupo(){
    let formData = this.grupoForm.value;
    this.isLoading = true;

    if(this.esEditar){
      this.gruposService.modificarGrupo(this.idGrupo,formData).subscribe(
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
      this.gruposService.guardarGrupo(formData).subscribe(
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
