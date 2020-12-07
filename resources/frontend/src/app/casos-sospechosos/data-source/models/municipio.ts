
export interface Municipio {
    id:Number,
    descripcion:string
}

export interface Localidad {
    id:Number,
    municipio_id:Number,
    descripcion:string
}

export interface Colonia {
    id:Number,
    municipio_id:Number,
    localidad_id?:Number,
    zona:Number,
    region:Number,
    nombre:string
}