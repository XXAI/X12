import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { Municipio, Localidad, Colonia, CasosSospechososService, CasoSospechoso } from "@app/casos-sospechosos";
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BitacoraDialogComponent } from '../bitacora-dialog/bitacora-dialog.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers:[DatePipe]
})
export class FormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("fechaIdentificacion",null) fechaIdentificacion: ElementRef;
  form: FormGroup;
  loading:boolean;
  loadingLabel:string;
  id:Number;
  caso:CasoSospechoso;

  loadingMunicipios:boolean;
  loadingLocalidades:boolean;
  loadingColonias:boolean;

  mostrarDatosEmbarazo:boolean;
  
  
  tipos_paciente:any[] =[
    { id: 1, descripcion: "Sintomático"},
    { id: 2, descripcion: "Asintomático"}
  ];
  // Municipios
  municipios:Municipio[] = [];
  filteredMunicipios: Observable<Municipio[]>;

  // Localidades
  localidades:Localidad[] = [];
  filteredLocalidades: Observable<Localidad[]>;

   // Colonias
   colonias:Colonia[] = [];
  filteredColonias: Observable<Colonia[]>;


  casoSubscription: Subscription;
  municipiosSubscription: Subscription;
  localidadesSubscription: Subscription;
  coloniasSubscription: Subscription;
  municipiosValueChangeSubscription: Subscription;



  constructor(
    private titleService: Title, 
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar, 
    private router: Router,
    private route:ActivatedRoute,
    private dialog: MatDialog,
    private apiService:CasosSospechososService) { }

  ngAfterViewInit(): void {
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.fechaIdentificacion.nativeElement.focus();
    },0);  
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id') || null;

    this.initEmptyForm();

    if(this.id!= null) {
      this.setLoading(true);
      this.titleService.setTitle("Caso sospechoso");
      this.loadingLabel = "Cargando caso...";

      this.casoSubscription = this.apiService.ver(this.id)
      .subscribe(
        response => {
          this.setLoading(false);
          
          if(response.caso != null) {
            this.caso = response.caso;
            Object.keys(response.caso).forEach( prop => {
              const formControl = this.form.get(prop);
              if(formControl){
                if(prop == "fecha_identificacion") {
                  this.setDateForm(formControl,response.caso[prop]);
                  return;
                } 
                if(prop == "fecha_inicio_sintomas") {
                  this.setDateForm(formControl,response.caso[prop]);
                  return;
                } 
                if(prop == "fecha_inicio_tratamiento") {
                  this.setDateForm(formControl,response.caso[prop]);
                  return;
                } 
                if(prop == "fecha_termino_seguimiento") {
                  this.setDateForm(formControl,response.caso[prop]);
                  return;
                } 
                if(prop == "fecha_termino_tratamiento") {
                  this.setDateForm(formControl,response.caso[prop]);                  
                  return;
                } 
                if(prop == "fecha_tratamiento_anterior") {
                  this.setDateForm(formControl,response.caso[prop]);
                  return;
                } 
                if(prop == "tipo_paciente_id") {
                  formControl.patchValue(response.caso[prop]);
                  return;
                } 

                if(prop == "municipio_id" || prop == "localidad_id" || prop == "colonia_id") {
                  return;
                } 
                formControl.setValue(response.caso[prop]);
              }
            });

            this.mostrarDatosEmbarazo = this.caso.sexo == "M";

            if(this.municipiosSubscription != null) {
              this.municipiosSubscription.unsubscribe();
            }

            this.municipiosSubscription = this.apiService.municipios().subscribe(
              response =>{
                this.setLoading(false);
                if(response.municipios != null) {
                  this.municipios = response.municipios ;
                  if(this.caso.municipio_id != null) {
                    var municipio;
                    this.municipios.forEach(element => {
                      if(element.id == this.caso.municipio_id) {
                        municipio = element;
                      }
                    });
                    this.form.get("municipio_id").setValue(municipio);
                  }

                  // Cargamos localidades no deberia hacer esto pero ya no hay tiempo
                  if(this.caso.localidad_id != null) {

                    this.localidadesSubscription = this.apiService.localidades(this.caso.municipio_id).subscribe(
                      responseLocalidades =>{
                        this.setLoading(false);
                        if(responseLocalidades.localidades != null) {
                          this.localidades = responseLocalidades.localidades ;
                          var localidad;
                          this.localidades.forEach(element => {
                            if(element.id == this.caso.localidad_id) {
                              localidad = element;
                            }
                          });
                          if(localidad != null) {
                            this.form.get("localidad_id").setValue(localidad); 
                          }
                        } else {
                          this.localidades = [];
                        }
                      }, errorResponseLocalidades => {
                        this.setLoading(false);
                        console.log(errorResponseLocalidades);
                        this.localidades = [];
                      }
                    );
                  }

                  // Cargamos colonias no deberia hacer esto pero ya no hay tiempo
                  if(this.caso.colonia_id != null) {

                    this.coloniasSubscription = this.apiService.colonias(this.caso.municipio_id).subscribe(
                      responseColonia =>{
                        this.setLoading(false);
                        if(responseColonia.colonias != null) {
                          this.colonias = responseColonia.colonias ;
                          var colonia;
                          this.colonias.forEach(element => {
                            if(element.id == this.caso.colonia_id) {
                              colonia = element;
                            }
                          });

                          if(colonia != null) {
                            this.form.get("colonia_id").setValue(colonia);     
                          }
                                             
                          
                        } else {
                          this.colonias = [];
                        }
                      }, errorResponseColonias => {
                        this.setLoading(false);
                        console.log(errorResponseColonias);
                        this.colonias = [];
                      }
                    );
                  }
                  
                } else {
                  this.municipios = [];
                }
                
              }, errorResponse => {
                this.setLoading(false);
                console.log(errorResponse);
                this.municipios = [];
              }
            );

          }
        }, errorResponse => {

          this.setLoading(false);

          if(errorResponse.status == 404) {
            //
            this.router.navigate(['/casos-sospechosos']);
            
          } else {
            this.snackBar.open(errorResponse.error.message, "Cerrar", {
              duration: 4000,
            });
          }
        }
      )
    } else {
      this.titleService.setTitle("Agregar caso sospechoso");    
      this.form.get('folio').disable();
      
      

      this.loadingMunicipios = true;
      this.municipiosSubscription = this.apiService.municipios().subscribe(
        response =>{
          this.loadingMunicipios = false;
          if(response.municipios != null) {
            this.municipios = response.municipios ;
          } else {
            this.municipios = [];
          }
        }, errorResponse => {
          this.loadingMunicipios = false;
          console.log(errorResponse);
          this.municipios = [];
        }
      );
    }

    
    
    

    this.filteredMunicipios = this.form.get('municipio_id').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filterMunicipio(descripcion) : this.municipios.slice())
    );

    this.municipiosValueChangeSubscription = this.filteredMunicipios.subscribe(response => {
     if(typeof  this.form.get("municipio_id").value === 'string'){
      this.form.get('colonia_id').setValue('');
      this.form.get('localidad_id').setValue('');
      this.form.get('colonia_id').disable();
      this.form.get('localidad_id').disable();

     }
    })

    this.filteredLocalidades = this.form.get('localidad_id').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descripcion),
      map(descripcion => descripcion ? this._filterLocalidad(descripcion) : this.localidades.slice())
    );

    this.filteredColonias = this.form.get('colonia_id').valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nombre),
      map(nombre => nombre ? this._filterColonia(nombre) : this.colonias.slice())
    );

    
  }

  ngOnDestroy(){
    if(this.casoSubscription != null) {
      this.casoSubscription.unsubscribe();
    }
    if(this.municipiosSubscription != null) {
      this.municipiosSubscription.unsubscribe();
    }
    if(this.coloniasSubscription != null) {
      this.coloniasSubscription.unsubscribe();
    }
    if(this.localidadesSubscription != null) {
      this.localidadesSubscription.unsubscribe();
    }

    if(this.municipiosValueChangeSubscription != null) {
      this.municipiosValueChangeSubscription.unsubscribe();
    }
    
  }

  setDateForm(formControl:AbstractControl, value:any):void {
    
    if(value!= null) {
      formControl.setValue(new Date(value + " 00:00:00"));
    } else {
      formControl.setValue(null);
    }
  }

  initEmptyForm(){
    var finSeguimiento = new Date();
    finSeguimiento.setDate(finSeguimiento.getDate() + 14);
    this.form = this.fb.group(
      {
        folio: [''],
        origen_id: [1],
        fecha_identificacion: [new Date()],
        tipo_paciente_id: [null, Validators.required],
        apellido_paterno: ['',Validators.required],
        apellido_materno: ['',Validators.required],
        nombre: ['',Validators.required],
        sexo: ['',Validators.required],
        esta_embarazada: [false],
        meses_embarazo:[{value:'', disabled:true}],
        edad: ['',Validators.required],
        ocupacion: [''],
        municipio_id: ['',this.autocompleteObjectValidator()],
        localidad_id: [{ value: "", disabled:true},this.autocompleteObjectValidator()],
        colonia_id: [{ value: "", disabled:true},this.autocompleteObjectValidator()],
        domicilio: ['',Validators.required],
        telefonos: [''],

        diabetes: [false],
        hipertension: [false],
        obesidad: [false],
        epoc: [false],
        asma: [false],
        inmunosupresion: [false],
        vih_sida: [false],
        enfermedad_cardiovascular: [false],
        insuficiencia_renal: [false],
        tabaquismo: [false],

        inicio_subito_sintomas: [false],
        fiebre: [false],
        tos: [false],
        cefalea: [false],
        disnea: [false],
        irritabilidad: [false],
        dolor_toracico: [false],
        escalofrios: [false],
        odinofagia: [false],
        mialgias: [false],
        artralgias: [false],
        anosmia: [false],
        disgeusia: [false],
        rinorrea: [false],
        conjuntivitis: [false],
        ataque_estado_general: [false],
        diarrea: [false],
        polipnea: [false],
        dolor_abdominal: [false],
        vomito: [false],
        cianosis: [false],

        fecha_inicio_sintomas: [new Date()],
        fecha_termino_seguimiento: [this.datePipe.transform(finSeguimiento, 'yyyy-MM-dd')],
        tratamiento: [''],
        fecha_inicio_tratamiento: [null],
        fecha_termimo_tratamiento: [null],
        causa_no_tratamiento: [''],

        tuvo_tratamiento_previo_para_covid:[false],
        tratamiento_previo_para_covid:[{value:'', disabled:true}],
        fecha_tratamiento_anterior: [{value:null, disabled:true}],
        quien_otorgo_tratamiento_anterior: [{value:'', disabled:true}],

        contactos_sintomaticos:[0],
        contactos_asintomaticos:[0],
        numero_contactos:[0],

        condicion_egreso: [''],

      }
    );
  }

  
  setLoading(value:boolean) {
    this.loading = value;
    if(!this.loading){
      for (const key in this.form.controls) {
        this.form.get(key).enable();
      }  
      
      if(this.form.get("municipio_id").value == true) {
        this.form.get("localidad_id").enable();
        this.form.get("colonia_id").enable();
      }
      this.toggleTratamientoPrevio();
      //this.folioControl.enable();
      //this.fechaControl.enable();
    } else {
      for (const key in this.form.controls) {
        this.form.get(key).disable();
      }  
      //this.folioControl.disable();
      //this.fechaControl.disable();
    }
  }

  compareTipoPacienteFn(o1: any, o2: any) {
    return (o1 == o2);
   }
   compareOrigenFn(o1: any, o2: any) {
    return (o1 == o2);
   }
  
  displayMunicipioFn(municipio?:Municipio): string | undefined {
    return municipio ? municipio.descripcion : undefined;
  }
  displayLocalidadFn(localidad?:Localidad): string | undefined {
    return localidad ? localidad.descripcion : undefined;
  }
  displayColoniaFn(colonia?:Colonia): string | undefined {
    return colonia ? colonia.nombre : undefined;
  }



  private _filterMunicipio(descripcion: string): Municipio[] {
    const filterValue = descripcion.toLowerCase();
    return this.municipios.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterLocalidad(descripcion: string): Localidad[] {
    const filterValue = descripcion.toLowerCase();
    return this.localidades.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterColonia(nombre: string): Colonia[] {
    const filterValue = nombre.toLowerCase();
    return this.colonias.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
  }

  onSexoSelected(event):void {
    this.mostrarDatosEmbarazo = event.value=="M";
    if(!this.mostrarDatosEmbarazo ) {
      this.form.get('esta_embarazada').setValue(false);
      this.form.get('meses_embarazo').setValue(0);
      this.form.get('meses_embarazo').enable();
    }
  }

  onMunicipioSelected(event):void{
    this.form.get("localidad_id").enable();
    this.form.get("colonia_id").enable();
    if(this.coloniasSubscription != null) {
      this.coloniasSubscription.unsubscribe();
    }

    this.loadingColonias = true;

    
    this.form.get("colonia_id").disable();
    this.coloniasSubscription = this.apiService.colonias(event.option.value.id).subscribe(
      response =>{
        this.form.get("colonia_id").enable();
        this.loadingColonias = false;
        if(response.colonias != null) {
          this.colonias = response.colonias;    
        } else {
          this.colonias = [];
        }
      }, errorResponse => {
        this.form.get("colonia_id").enable();
        this.loadingColonias = false;
        console.log(errorResponse);
        this.colonias = [];
      }
    );


    if(this.localidadesSubscription != null) {
      this.localidadesSubscription.unsubscribe();
    }
    this.form.get("localidad_id").disable();
    this.loadingLocalidades = true;
    this.localidadesSubscription = this.apiService.localidades(event.option.value.id).subscribe(
      response =>{
        this.form.get("localidad_id").enable();
        this.loadingLocalidades = false;
        if(response.localidades != null) {
          this.localidades = response.localidades;    
        } else {
          this.localidades = [];
        }
      }, errorResponse => {
        this.form.get("localidad_id").enable();
        this.loadingLocalidades = false;
        console.log(errorResponse);
        this.localidades = [];
      }
    );

    

    
  }
  toggleEmbarazada():void {
    var activo = this.form.get('esta_embarazada').value;

    if(activo) {
      this.form.get('meses_embarazo').enable();
    } else{
      this.form.get('meses_embarazo').disable();
    }
  }
  toggleTratamientoPrevio():void {
    var activo = this.form.get('tuvo_tratamiento_previo_para_covid').value;
console.log(activo);
    if(activo) {
      this.form.get('tratamiento_previo_para_covid').enable();
      this.form.get('fecha_tratamiento_anterior').enable();
      this.form.get('quien_otorgo_tratamiento_anterior').enable();
    } else{
      this.form.get('tratamiento_previo_para_covid').disable();
      this.form.get('fecha_tratamiento_anterior').disable();
      this.form.get('quien_otorgo_tratamiento_anterior').disable();
    }
  }
  calcularNumeroContactos():void{
    var contactos_sintomaticos = +this.form.get('contactos_sintomaticos').value||0;
    var contactos_asintomaticos = +this.form.get('contactos_asintomaticos').value||0;
    this.form.get('numero_contactos').setValue((contactos_sintomaticos+contactos_asintomaticos));
  }

  setFechaTerminoTratamiento(type: string, event: MatDatepickerInputEvent<Date>) {
    if(event.value != null) {
      var finSeguimiento = new Date(event.value.getTime());
      finSeguimiento.setDate(finSeguimiento.getDate()+ 14);
      this.form.get('fecha_termino_seguimiento').setValue(this.datePipe.transform(finSeguimiento, 'yyyy-MM-dd'));
    } else {
      this.form.get('fecha_termino_seguimiento').setValue(null);
    }
   
    
    //this.events.push(`${type}: ${event.value}`);
  }

  guardar(){
    for (const key in this.form.controls) {
      this.form.get(key).clearValidators();
      this.form.get(key).updateValueAndValidity();
    }  

    //if(this.form.invalid) return;

    if(this.id != null) {
      this.update();
    } else {
      this.store();
    }
    
    
  }

  update() {

    this.loading = true;
    var payload = this.form.value;
    if (typeof payload.municipio_id === 'string') {
      payload.municipio_id = null
    } else {
      payload.municipio_id = payload.municipio_id.id;
    }
    if (payload.localidad_id  != null ){
      if (typeof payload.localidad_id === 'string') {
        payload.localidad_id = null
      } else {
        payload.localidad_id = payload.localidad_id.id;
      }
    }
    
    if (payload.colonia_id  != null ){
      if (typeof payload.colonia_id === 'string') {
        payload.colonia_id = null
      } else {
        payload.colonia_id = payload.colonia_id.id;
      }
    }

    this.apiService.editar(this.id,this.form.value).subscribe(
      response => {
        this.loading = false;
        /*
        this.id = response.id;
        this.data.usuario = response;
        this.data.edit = true;*/

        this.snackBar.open("Los datos fueron editados exitosamente", "Cerrar", {
          duration: 4000,
        });

       

      },
      errorResponse => {
        this.loading = false;
        if(errorResponse.status == 409){
          this.snackBar.open("Verifique la información del formulario", "Cerrar", {
            duration: 4000,
          });
          this.setErrors(errorResponse.error);
        } else {
          this.snackBar.open(errorResponse.error.message, "Cerrar", {
            duration: 4000,
          });
        }         
      }      
    );

  }

  store(){
    this.loading = true;
    var payload = this.form.value;
    if (typeof payload.municipio_id === 'string') {
      payload.municipio_id = null
    } else {
      payload.municipio_id = payload.municipio_id.id;
    }
    if (payload.localidad_id  != null ){
      if (typeof payload.localidad_id === 'string') {
        payload.localidad_id = null
      } else {
        payload.localidad_id = payload.localidad_id.id;
      }
    }
    
    if (payload.colonia_id  != null ){
      if (typeof payload.colonia_id === 'string') {
        payload.colonia_id = null
      } else {
        payload.colonia_id = payload.colonia_id.id;
      }
    }
   
    this.apiService.crear(this.form.value).subscribe(
      response => {
        this.loading = false;
        /*
        this.id = response.id;
        this.data.usuario = response;
        this.data.edit = true;*/

        this.snackBar.open("Los datos fueron creados exitosamente", "Cerrar", {
          duration: 4000,
        });
        this.router.navigate(['/casos-sospechosos/' + response.caso.id]);
       

      },
      errorResponse => {
        this.loading = false;
        if(errorResponse.status == 409){
          this.snackBar.open("Verifique la información del formulario", "Cerrar", {
            duration: 4000,
          });
          this.setErrors(errorResponse.error);
        } else {
          this.snackBar.open(errorResponse.error.message, "Cerrar", {
            duration: 4000,
          });
        }         
      }      
    );
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  serverValidator(error: {[key: string]: any}):ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      return error;
    }
  }

  setErrors(validationErrors:any[]){
    Object.keys(validationErrors).forEach( prop => {
      const formControl = this.form.get(prop);
      if(formControl){

        formControl.markAsTouched();       

        var array = [];
        for(var x in validationErrors[prop]){
          array.push(this.serverValidator({[validationErrors[prop][x]]: true}));
        }
        formControl.setValidators(array);              
        formControl.updateValueAndValidity();
      }
    });
  }

  openDialogBitacora(): void {
    const dialogRef = this.dialog.open(BitacoraDialogComponent, { width:"800px",disableClose: true,data:this.caso.id});

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      /*
      if(result != null){
        if(result.last_action != "none"){
          this.loadData();
        }
      }   */  
    });
  }

}
