import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';
import { GruposService } from '../grupos.service';

export interface GrupoData {
  id: number;
}

@Component({
  selector: 'app-grupo-usuarios-dialogo',
  templateUrl: './grupo-usuarios-dialogo.component.html',
  styleUrls: ['./grupo-usuarios-dialogo.component.css']
})
export class GrupoUsuariosDialogoComponent implements OnInit {

  constructor(
    private sharedService:SharedService,
    private gruposService: GruposService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<GrupoUsuariosDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GrupoData
  ) { }

  searchQuery: string = '';

  isLoading:boolean;
  
  idGrupo:number;
  folioGrupo:string;
  descripcionGrupo:number;

  listaUsuariosAsignados:any[];
  listaUsuariosControl:any;
  resultadosBusquedaUsuarios:any[];

  ngOnInit() {
    this.isLoading = true;

    this.idGrupo = this.data.id;
    this.listaUsuariosControl = {};

    this.gruposService.verUsuariosDeGrupo(this.idGrupo).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          //console.log(response.data);
          this.folioGrupo = response.data.folio;
          this.descripcionGrupo = response.data.descripcion;
          this.listaUsuariosAsignados = response.data.usuarios;

          this.listaUsuariosAsignados.forEach(usuario => {
            this.listaUsuariosControl[usuario.id] = true;
          })
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

  guardarUsuariosAsingados(){
    this.isLoading = true;
    let params = {usuarios:[]};

    if(this.listaUsuariosControl){
      for (const user_id in this.listaUsuariosControl) {
        if(this.listaUsuariosControl[user_id]){
          params.usuarios.push(user_id);
        }
      }
    }

    this.gruposService.sincronizarGrupoUsuarios(this.idGrupo,params).subscribe(
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
  
  search(){
    this.isLoading = true;
    let params = {
      query: this.searchQuery,
      grupo_id: this.idGrupo
    };
    
    this.gruposService.buscarUsuarios(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.resultadosBusquedaUsuarios = response.data;
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

  agregarUsuario(usuario){
    this.listaUsuariosControl[usuario.id] = true;
    this.listaUsuariosAsignados.push(usuario);
  }

  quitarUsuario(index){
    let usuario = this.listaUsuariosAsignados[index];
    this.listaUsuariosControl[usuario.id] = false;
    this.listaUsuariosAsignados.splice(index,1);
  }

  limpiarResultados(){
    this.searchQuery = '';
    this.resultadosBusquedaUsuarios = [];
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  close(): void {
    this.dialogRef.close();
  }
}
