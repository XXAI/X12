import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VigilanciaClinicaService } from '../vigilancia-clinica.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  vigilanciaCLinicaForm: FormGroup;
  isLoading: boolean = false;
  filteredCatalogs: any = {};
  catalogos: any = {};
  catalogo_municipios: any = [];
  catalogo_estatus_paciente_covid: any = [];
  catalogo_egresos_covid: any = [];
  catalogo_clinicas_covid: any = [];


  maxDate: any = '';
  fechaActual: any = '';
  paciente: any = {};
  paciente_id: number = 0;

  constructor(public dialog: MatDialog,
    private vigilanciaClinicaService: VigilanciaClinicaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.vigilanciaCLinicaForm = this.formBuilder.group({

      nombre_paciente: ['', Validators.required],
      municipio_id: ['', Validators.required],
      municipio: [''],
      clinica_id: ['', Validators.required],
      clinica: [''],
      edad: ['', Validators.required],
      sexo: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_ingreso: ['', Validators.required],
      fecha_intubado: ['', Validators.required],
      folio_pcr: ['PENDIENTE', Validators.required],
      no_caso: ['', Validators.required],
      diagnostico: ['', Validators.required],
      estatus_paciente_id: ['', Validators.required],
      estatus_paciente: [''],
      estatus_egreso_id: ['', Validators.required],
      estatus_egreso: [''],
      intubado: [0, Validators.required],
      servicio_cama: ['', Validators.required],
      pco_fipco: ['', Validators.required],
      saturado_02: ['', Validators.required],
      observaciones: ['', Validators.required],
      ventilador: [0],
      monitor: [0],
      bomba_infusion: [0],

    });

    this.route.params.subscribe(params => {
      this.paciente_id = params['id'];

      if (this.paciente_id > 0) {
        this.cargarDatos();
      } else {
        this.IniciarCatalogos(null);
      }

    });

    let fecha = new Date();

    this.maxDate = fecha;


  }

  // obtenerIniciales(nombre_completo: string) {
  //   let nombre: string = "";
  //   let arreglo_nombre = nombre_completo.split(" ");
  //   //console.log(arreglo_nombre);
  //   for (let i = 0; i < arreglo_nombre.length; i++) {
  //     nombre += arreglo_nombre[i][0];
  //   }
  //   this.positivosForm.controls['alias'].setValue(nombre);
  //   //console.log(nombre);
  // }

  public IniciarCatalogos(obj: any) {
    this.isLoading = true;
    let carga_catalogos = [
      { nombre: 'municipios', orden: 'descripcion' },
      { nombre: 'estatus_paciente_covid', orden: 'descripcion' },
      { nombre: 'egresos_covid', orden: 'descripcion' },
      { nombre: 'clinicas_covid', orden: 'nombre_unidad' },
      // { nombre: 'municipios', orden: 'descripcion', filtro_id: { campo: 'estado_id', valor: 7 } },
    ];
    this.vigilanciaClinicaService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        let respuesta = response.data;
        this.catalogos = respuesta;

        this.catalogo_municipios = respuesta.municipios;
        this.catalogo_estatus_paciente_covid = respuesta.estatus_paciente_covid;
        this.catalogo_egresos_covid = respuesta.egresos_covid;
        this.catalogo_clinicas_covid = respuesta.clinicas_covid;


        this.filteredCatalogs['municipios'] = this.vigilanciaCLinicaForm.controls['municipio_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'municipios', 'descripcion')));
        this.filteredCatalogs['estatusPacienteCovid'] = this.vigilanciaCLinicaForm.controls['estatus_paciente_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'estatus_paciente_covid', 'descripcion')));
        this.filteredCatalogs['estatusEgresoCovid'] = this.vigilanciaCLinicaForm.controls['estatus_egreso_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'egresos_covid', 'descripcion')));
        this.filteredCatalogs['clinicasCovid'] = this.vigilanciaCLinicaForm.controls['clinica_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'clinicas_covid', 'nombre_unidad')));


        if (obj) {
          // console.log(obj);
          this.vigilanciaCLinicaForm.controls['municipio_id'].setValue(obj.municipio);
          this.vigilanciaCLinicaForm.controls['estatus_paciente_id'].setValue(obj.estatus_paciente);
          this.vigilanciaCLinicaForm.controls['estatus_egreso_id'].setValue(obj.estatus_egreso);
          this.vigilanciaCLinicaForm.controls['clinica_id'].setValue(obj.clinica_covid);
          //this.valor_unidad = parseInt(obj.tipo_unidad_id);
        }
        this.isLoading = false;
        // else {
        //   this.vigilanciaCLinicaForm.controls['no_caso'].setValue(respuesta.caso.no_caso);
        // }
      });
  }
  public cargarDatos() {
    this.vigilanciaClinicaService.obtenerCaso(this.paciente_id).subscribe(
      response => {

        console.log(response);
        let datos = response.data;

        var municipio = datos.municipio;
        var estatus_paciente = datos.estatus_paciente;
        var estatus_egreso = datos.estatus_egreso;
        var clinica_covid = datos.clinica_covid;

        let datos_autocomplet = {
          municipio,
          estatus_paciente,
          estatus_egreso,
          clinica_covid

        }

        this.vigilanciaCLinicaForm.controls['nombre_paciente'].setValue(datos.nombre_paciente);
        //this.vigilanciaCLinicaForm.controls['municipio_id'].setValue(datos.municipio_id);
        this.vigilanciaCLinicaForm.controls['edad'].setValue(datos.edad);
        this.vigilanciaCLinicaForm.controls['sexo'].setValue(datos.sexo);
        this.vigilanciaCLinicaForm.controls['fecha_inicio'].setValue(datos.fecha_inicio);
        this.vigilanciaCLinicaForm.controls['fecha_ingreso'].setValue(datos.fecha_ingreso);
        this.vigilanciaCLinicaForm.controls['fecha_intubado'].setValue(datos.fecha_intubado);
        this.vigilanciaCLinicaForm.controls['folio_pcr'].setValue(datos.folio_pcr);
        this.vigilanciaCLinicaForm.controls['no_caso'].setValue(datos.no_caso);
        this.vigilanciaCLinicaForm.controls['diagnostico'].setValue(datos.diagnostico);
        //this.vigilanciaCLinicaForm.controls['estatus_paciente_id'].setValue(datos.estatus_paciente_id);
        //this.vigilanciaCLinicaForm.controls['estatus_egreso_id'].setValue(datos.estatus_egreso_id);
        this.vigilanciaCLinicaForm.controls['intubado'].setValue(datos.intubado);
        this.vigilanciaCLinicaForm.controls['servicio_cama'].setValue(datos.servicio_cama);
        this.vigilanciaCLinicaForm.controls['pco_fipco'].setValue(datos.pco_fipco);
        this.vigilanciaCLinicaForm.controls['saturado_02'].setValue(datos.saturado_02);
        this.vigilanciaCLinicaForm.controls['observaciones'].setValue(datos.observaciones);
        this.vigilanciaCLinicaForm.controls['ventilador'].setValue(datos.ventilador);
        this.vigilanciaCLinicaForm.controls['monitor'].setValue(datos.ventilador);
        this.vigilanciaCLinicaForm.controls['bomba_infusion'].setValue(datos.ventilador);
        console.log(datos);
        this.IniciarCatalogos(datos_autocomplet);
      });
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    if (this.catalogos[catalog]) {
      let filterValue = '';
      if (value) {
        if (typeof (value) == 'object') {
          filterValue = value[valueField].toLowerCase();
        } else {
          filterValue = value.toLowerCase();
        }
      }
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  getDisplayFn(label: string) {
    return (val) => this.displayFn(val, label);
  }

  displayFn(value: any, valueLabel: string) {
    return value ? value[valueLabel] : value;
  }

  enviarDatos() {
    let formData = JSON.parse(JSON.stringify(this.vigilanciaCLinicaForm.value));

    // console.log(formData);
    if (formData.municipio_id) {
      formData.municipio_id = formData.municipio_id.id;
    }

    if (formData.clinica_id) {
      formData.clinica_id = formData.clinica_id.id;
    }

    if (formData.estatus_paciente_id) {
      formData.estatus_paciente_id = formData.estatus_paciente_id.id;
    }

    if (formData.estatus_egreso_id && formData.estatus_egreso_id) {
      formData.estatus_egreso_id = formData.estatus_egreso_id.id;
    }

    if (this.paciente_id > 0) {
      this.vigilanciaClinicaService.editarPaciente(this.paciente_id, formData).subscribe(
        response => {
          this.isLoading = false;

          var Message = "Datos Editados con Éxito!";
          this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
          this.router.navigate(['/vigilancia-clinica']);
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });

    } else {
      this.vigilanciaClinicaService.guardarPaciente(formData).subscribe(
        response => {
          this.isLoading = false;
          var Message = "Datos Guardados con Éxito!";

          this.sharedService.showSnackBar(Message, 'Cerrar', 4000);
          this.router.navigate(['/vigilancia-clinica']);
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }

  }
}
