
export interface CasoSospechoso {
    id:Number;
    folio:string;
    origen_id?:Number;
    fecha_identificacion?: Date;
    tipo_paciente_id?:Number,
    apellido_paterno:string,
    apellido_materno:string,
    nombre:string,
    sexo:string,
    esta_embarazada?:boolean,
    meses_embarazo?:Number,
    edad: Number,
    ocupacion?:string,
    municipio_id?: Number,
    municipio_nombre?:string,
    localidad_id?: Number,
    localidad_nombre?:string,    
    colonia_id?:Number,
    colonia_nombre?:string,
    domicilio?:string,
    telefonos?:string,
    
    

    diabetes?:boolean,
    hipertension?:boolean,
    obesidad?:boolean,
    epoc?:boolean,
    asma?:boolean,
    inmunosupresion?:boolean,
    vih_sida?:boolean,
    enfermedad_cardiovascular?:boolean,
    insuficiencia_renal?:boolean,
    tabaquismo?:boolean,

    inicio_subito_sintomas?:boolean,
    fiebre?:boolean,
    tos?: boolean,
    cefalea?:boolean,
    disnea?:boolean,
    irritabilidad?:boolean,
    dolor_toracico?:boolean,
    escalofrios?:boolean,
    odinofagia?:boolean,
    mialgias?:boolean,
    artralgias?:boolean,
    anosmia?:boolean,
    disgeusia?:boolean,
    rinorrea?:boolean,
    conjuntivitis?:boolean,
    ataque_estado_general?:boolean,
    diarrea?:boolean,
    polipnea?:boolean,
    dolor_abdominal?:boolean,
    vomito?:boolean,
    cianosis?:boolean,

    fecha_inicio_sintomas?:Date,
    fecha_termino_seguimiento?:Date, //sumar 14 dias de inicio de sintomas

    tratamiento?:string,
    fecha_inicio_tratamiento?:Date,
    fecha_termino_tratamiento?:Date,
    causa_no_tratamiento?:string,

    tuvo_tratamiento_previo_para_covid?:boolean,
    tratamiento_previo_para_covid?:string,
    fecha_tratamiento_anterior?:Date
    quien_otorgo_tratamiento_anterior?:string,

    
    contactos_sintomaticos?:Number,
    contactos_asintomaticos?:Number,
    numero_contactos?:Number,

   
    
    condicion_egreso?:string,
    
    updated_at:string
}