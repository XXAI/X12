import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog , MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositivosService } from '../positivos.service';
import { ActivatedRoute, Params }   from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  positivosForm: FormGroup;
  filteredCatalogs:any = {};
  catalogos: any = {};
  id_caso:number = 0;

  constructor(public dialog: MatDialog, 
              private positivosService: PositivosService, 
              private formBuilder: FormBuilder, 
              private router: Router,
              private route: ActivatedRoute ) { }

  ngOnInit() {
    this.positivosForm = this.formBuilder.group({
      apellido_paterno:['',Validators.required],
      apellido_materno:['',Validators.required],
      nombre:['',Validators.required],
      alias:['',Validators.required],
      edad:['',Validators.required],
      sexo:['',Validators.required],
      responsable:['',Validators.required],
      tipo_atencion:['',Validators.required],
      unidad:['',Validators.required],
      derechohabiencia:['',Validators.required],
      contactos:['',Validators.required],
      tipo_transmision:['',Validators.required],
      fecha_inicio_sintomas:['',Validators.required],
      fecha_confirmacion:['',Validators.required],
      fecha_alta_probable:['',Validators.required],
      municipio:[''],
      municipio_id:['',Validators.required],
      estatus:['',Validators.required],
      no_caso: ['',Validators.required],
     
    });

    let carga_catalogos = [
      {nombre:'estados',orden:'descripcion'},
      {nombre:'municipios',orden:'descripcion',filtro_id:{campo:'estado_id',valor:7}},
    ];

    this.route.params.subscribe(params => {
      this.id_caso = params['id'];
      if(this.id_caso > 0)
      {
        this.cargarDatos();
      }
      
    });

    this.positivosService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        console.log(response);
        this.catalogos = response.data;
        
        this.filteredCatalogs['municipios'] = this.positivosForm.controls['municipio_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
          
        /*if(this.data != null)
        {
          this.positivosForm.controls['municipio_id'].setValue(this.data.municipio);
        }*/
      }); 
  }

  public cargarDatos()
  {
    this.positivosService.obtenerCaso(this.id_caso).subscribe(
      response => {
        let datos = response.data;
        this.positivosForm.controls['no_caso'].setValue(datos.no_caso);
        this.positivosForm.controls['apellido_paterno'].setValue(datos.apellido_paterno);
        this.positivosForm.controls['apellido_materno'].setValue(datos.apellido_materno);
        this.positivosForm.controls['nombre'].setValue(datos.nombre);
        this.positivosForm.controls['alias'].setValue(datos.alias);
        this.positivosForm.controls['edad'].setValue(datos.edad);
        this.positivosForm.controls['sexo'].setValue(datos.sexo);
        this.positivosForm.controls['responsable'].setValue(datos.responsable);
        this.positivosForm.controls['tipo_atencion'].setValue(datos.tipo_atencion);
        this.positivosForm.controls['unidad'].setValue(datos.unidad);
        this.positivosForm.controls['derechohabiencia'].setValue(datos.derechohabiencia);
        this.positivosForm.controls['contactos'].setValue(datos.contactos);
        this.positivosForm.controls['tipo_transmision'].setValue(datos.tipo_transmision);
        this.positivosForm.controls['fecha_inicio_sintomas'].setValue(datos.fecha_inicio_sintomas);
        this.positivosForm.controls['fecha_confirmacion'].setValue(datos.fecha_confirmacion);
        this.positivosForm.controls['fecha_alta_probable'].setValue(datos.fecha_alta_probable);
        this.positivosForm.controls['municipio_id'].setValue(datos.municipio_id);
        this.positivosForm.controls['estatus'].setValue(datos.estatus);
      }); 
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if(this.catalogos[catalog]){
      let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }
  

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  enviarDatos(){
    let formData = JSON.parse(JSON.stringify(this.positivosForm.value));
    
    console.log(formData);
    if(formData.municipio_id){
      formData.municipio_id = formData.municipio_id.id;
    }

    let datoGuardado = {
      persona: formData
    }

    if(this.id_caso > 0)
    {
      this.positivosService.editarCaso(this.id_caso, datoGuardado).subscribe(
        response => {
          
      });
      
    }else{
      this.positivosService.guardarCaso(datoGuardado).subscribe(
        response => {
          
      });
    }
    
  }
}
