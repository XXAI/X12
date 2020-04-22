<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Formulario;
use App\Models\Persona;
use App\Models\PersonaContacto;
use App\Models\PersonaIndice;
use App\Models\Localidad;
use App\Models\RegistroLlenadoFormulario;
use App\Models\RegistroLlenadoRespuestas;
use App\Models\LlamadaCallCenter;
use App\Models\Caso;

use DB;

class FormularioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function obtenerFormulario($id){
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();

            //return response()->json(['data'=>$parametros['id']],HttpResponse::HTTP_CONFLICT);

            $formulario = Formulario::with(['preguntas'=>function($preguntas){
                return $preguntas->select('preguntas.*','catalogo_tipos_preguntas.llave as tipo_pregunta','catalogo_tipos_valores.llave as tipo_valor')
                                ->leftjoin('catalogo_tipos_preguntas','preguntas.tipo_pregunta_id','=','catalogo_tipos_preguntas.id')
                                ->leftjoin('catalogo_tipos_valores','preguntas.tipo_valor_id','=','catalogo_tipos_valores.id')
                                ->where('visible',1)
                                ->orderBy('orden');

            },'preguntas.respuestas','preguntas.serie.preguntas'=>function($serie_preguntas){
                return $serie_preguntas->select('preguntas.*','catalogo_tipos_preguntas.llave as tipo_pregunta','catalogo_tipos_valores.llave as tipo_valor')
                                ->leftjoin('catalogo_tipos_preguntas','preguntas.tipo_pregunta_id','=','catalogo_tipos_preguntas.id')
                                ->leftjoin('catalogo_tipos_valores','preguntas.tipo_valor_id','=','catalogo_tipos_valores.id')->orderBy('orden')->with('respuestas');
            }])->where('id',$id)->first();

            /*if(isset($parametros['ids']) && $parametros['ids']){
                $formulario = $formulario->whereIn('id',$parametros['ids']);
            }*/

            //$formulario = $formulario->get();
            
            return response()->json(['data'=>$formulario],HttpResponse::HTTP_OK,['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'], JSON_UNESCAPED_UNICODE);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function guardarDatosFormulario(Request $request){
        try{
            DB::beginTransaction();
            
            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);

            if(isset($datos_persona['telefono_contacto'])){
                if($datos_persona['es_celular']){
                    $datos_persona['telefono_celular'] = $datos_persona['telefono_contacto'];
                }else{
                    $datos_persona['telefono_casa'] = $datos_persona['telefono_contacto'];
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            if(isset($parametros['config']['persona_id']) && $parametros['config']['persona_id']){
                $persona = Persona::find($parametros['config']['persona_id']);

                if(!$persona){
                    throw new Exception("La persona seleccionada no existe", 1);
                }
                
                $persona->nombre            = (isset($datos_persona['nombre']))?           $datos_persona['nombre']            : null;
                $persona->apellido_paterno  = (isset($datos_persona['apellido_paterno']))? $datos_persona['apellido_paterno']  : null;
                $persona->apellido_materno  = (isset($datos_persona['apellido_materno']))? $datos_persona['apellido_materno']  : null;
                $persona->fecha_nacimiento  = (isset($datos_persona['fecha_nacimiento']))? $datos_persona['fecha_nacimiento']  : null;
                $persona->sexo              = (isset($datos_persona['sexo']))?             $datos_persona['sexo']              : null;
                $persona->curp              = (isset($datos_persona['curp']))?             $datos_persona['curp']              : null;
                $persona->email             = (isset($datos_persona['email']))?            $datos_persona['email']             : null;
                $persona->telefono_casa     = (isset($datos_persona['telefono_casa']))?    $datos_persona['telefono_casa']     : null;
                $persona->telefono_celular  = (isset($datos_persona['telefono_celular']))? $datos_persona['telefono_celular']  : null;
                $persona->estado_id         = (isset($datos_persona['estado_id']))?        $datos_persona['estado_id']         : null;
                $persona->municipio_id      = (isset($datos_persona['municipio_id']))?     $datos_persona['municipio_id']      : null;
                $persona->municipio         = (isset($datos_persona['municipio']))?        $datos_persona['municipio']         : null;
                $persona->localidad_id      = (isset($datos_persona['localidad_id']))?     $datos_persona['localidad_id']      : null;
                $persona->localidad         = (isset($datos_persona['localidad']))?        $datos_persona['localidad']         : null;
                $persona->colonia           = (isset($datos_persona['colonia']))?          $datos_persona['colonia']           : null;
                $persona->calle             = (isset($datos_persona['calle']))?            $datos_persona['calle']             : null;
                $persona->no_exterior       = (isset($datos_persona['no_exterior']))?      $datos_persona['no_exterior']       : null;
                $persona->no_interior       = (isset($datos_persona['no_interior']))?      $datos_persona['no_interior']       : null;
                $persona->codigo_postal     = (isset($datos_persona['codigo_postal']))?    $datos_persona['codigo_postal']     : null;
                $persona->referencia        = (isset($datos_persona['referencia']))?       $datos_persona['referencia']        : null;
                $persona->latitud           = (isset($datos_persona['latitud']))?          $datos_persona['latitud']           : null;
                $persona->longitud          = (isset($datos_persona['longitud']))?         $datos_persona['longitud']          : null;

                $persona->save();
            }else{
                $persona = Persona::create($datos_persona);
            }
            //$parametros['persona'] = $persona;

            //for($i = 0; $i <= count($parametros['formularios']); $i++ ){
            foreach ($parametros['formularios'] as $index => $encuesta) {
                
                $formulario_id =  substr($index,11);
                $formulario = true;
                $formulario = Formulario::with(['preguntas'=>function($preguntas){
                    return $preguntas->select('preguntas.*','catalogo_tipos_preguntas.llave as tipo_pregunta','catalogo_tipos_valores.llave as tipo_valor')
                                    ->leftjoin('catalogo_tipos_preguntas','preguntas.tipo_pregunta_id','=','catalogo_tipos_preguntas.id')
                                    ->leftjoin('catalogo_tipos_valores','preguntas.tipo_valor_id','=','catalogo_tipos_valores.id')
                                    ->where('visible',1)
                                    ->orderBy('orden')
                                    ->with('respuestas');
    
                },'preguntas.serie.preguntas'=>function($serie_preguntas){
                    return $serie_preguntas->select('preguntas.*','catalogo_tipos_preguntas.llave as tipo_pregunta','catalogo_tipos_valores.llave as tipo_valor')
                                    ->leftjoin('catalogo_tipos_preguntas','preguntas.tipo_pregunta_id','=','catalogo_tipos_preguntas.id')
                                    ->leftjoin('catalogo_tipos_valores','preguntas.tipo_valor_id','=','catalogo_tipos_valores.id')
                                    ->orderBy('orden')
                                    ->with('respuestas');
                }])->where('id',$formulario_id)->first();

                if(!$formulario){
                    throw new \Exception("Formulario no encontrado: ".$formulario_id, 1);
                }

                $preguntas = $formulario->preguntas;
                $respuestas_persona = [];
                for($i = 0; $i < count($preguntas); $i++){
                    $pregunta = $preguntas[$i];

                    if(isset($encuesta['seccion_pregunta_'.$pregunta->id])){
                        $preguntas_encuesta = $encuesta['seccion_pregunta_'.$pregunta->id];
                    }else{
                        $preguntas_encuesta = $encuesta;
                    }

                    if(isset($preguntas_encuesta['pregunta_'.$pregunta->id])){
                        if($pregunta->tipo_pregunta == 'SINO'){
                            $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta->id,'valor_respuesta'=>($preguntas_encuesta['pregunta_'.$pregunta->id])?true:false];
                        }else if($pregunta->tipo_pregunta == 'MULTI' || $pregunta->tipo_pregunta == 'MULTIO'){
                            for($j = 0 ; $j < count($pregunta->respuestas); $j++){
                                if(isset($preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_'.$pregunta->respuestas[$j]->id]) && $preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_'.$pregunta->respuestas[$j]->id] != null){
                                    $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'respuesta_id'=>$pregunta->respuestas[$j]->id,'pregunta_id'=>$pregunta->id,'valor_respuesta'=>$pregunta->respuestas[$j]->valor];
                                }
                            }
                            if($pregunta->tipo_pregunta == 'MULTIO'){
                                if(isset($preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_otro']) && $preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_otro']){
                                    if(isset($preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_otro_descripcion']) && $preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_otro_descripcion'] != null){
                                        $respuestas_persona[] =  ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta->id,'valor'=>$preguntas_encuesta['pregunta_'.$pregunta->id]['respuesta_otro_descripcion']];
                                    }
                                }
                            }
                        }else if($pregunta->tipo_pregunta == 'UNIC' || $pregunta->tipo_pregunta == 'UNICO'){
                            for($j = 0 ; $j < count($pregunta->respuestas); $j++){
                                if($preguntas_encuesta['pregunta_'.$pregunta->id] == $pregunta->respuestas[$j]->valor){
                                    $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id, 'respuesta_id'=>$pregunta->respuestas[$j]->id,'pregunta_id'=>$pregunta->id,'valor_respuesta'=>$pregunta->respuestas[$j]->valor];
                                    break;
                                }
                            }
                        }else if($pregunta->tipo_pregunta == 'VAL'){
                            if($pregunta->tipo_valor == 'DATE'){
                                $valor_persona = substr($preguntas_encuesta['pregunta_'.$pregunta->id],0,10);
                            }else{
                                $valor_persona = $preguntas_encuesta['pregunta_'.$pregunta->id];
                            }
                            $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta->id,'valor'=>$valor_persona];
                        }
                    }
                    
                    if($pregunta->serie){
                        if(isset($preguntas_encuesta['pregunta_'.$pregunta->id.'_serie'])){
                            $preguntas_serie = $pregunta->serie->preguntas;
                            $preguntas_serie_encuesta = $preguntas_encuesta['pregunta_'.$pregunta->id.'_serie'];
                            for($j = 0; $j < count($preguntas_serie); $j++){
                                $pregunta_serie = $preguntas_serie[$j];
                                if(isset($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id])){
                                    if($pregunta_serie->tipo_pregunta == 'SINO'){
                                        $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta_serie->id,'valor_respuesta'=>($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id])?true:false];
                                    }else if($pregunta_serie->tipo_pregunta == 'MULTI' || $pregunta_serie->tipo_pregunta == 'MULTIO'){
                                        for($k = 0 ; $k < count($pregunta_serie->respuestas); $k++){
                                            if(isset($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_'.$pregunta_serie->respuestas[$k]->id]) && $preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_'.$pregunta_serie->respuestas[$k]->id] != null){
                                                $respuestas_persona[] =  ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta_serie->id,'respuesta_id'=>$pregunta_serie->respuestas[$k]->id,'valor_respuesta'=>$pregunta_serie->respuestas[$k]->valor];
                                            }
                                        }
                                        if($pregunta_serie->tipo_pregunta == 'MULTIO'){
                                            if(isset($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_otro']) && $preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_otro']){
                                                if(isset($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_otro_descripcion']) && $preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_otro_descripcion'] != null){
                                                    $respuestas_persona[] =  ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta_serie->id,'valor'=>$preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id]['respuesta_otro_descripcion']];
                                                }
                                            }
                                        }
                                    }else if($pregunta_serie->tipo_pregunta == 'UNIC' || $pregunta_serie->tipo_pregunta == 'UNICO'){
                                        for($k = 0 ; $k < count($pregunta_serie->respuestas); $k++){
                                            if($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id] == $pregunta_serie->respuestas[$k]->valor){
                                                $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id, 'respuesta_id'=>$pregunta_serie->respuestas[$k]->id,'pregunta_id'=>$pregunta_serie->id,'valor_respuesta'=>$pregunta_serie->respuestas[$k]->valor];
                                                break;
                                            }
                                        }
                                    }else if($pregunta_serie->tipo_pregunta == 'VAL'){
                                        if($pregunta_serie->tipo_valor == 'DATE'){
                                            $valor_persona = substr($preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id],0,10);
                                        }else{
                                            $valor_persona = $preguntas_serie_encuesta['pregunta_'.$pregunta_serie->id];
                                        }
                                        $respuestas_persona[] = ['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'pregunta_id'=>$pregunta_serie->id,'valor'=>$valor_persona];
                                    }
                                }
                            }
                        }
                        
                    }
                }
            }

            $caso = Caso::where('persona_id',$persona->id)->where('contingencia_id',$formulario->contingencia_id)->first();
            if($caso){
                $caso->latitud = $persona->latitud;
                $caso->longitud = $persona->longitud;
                $caso->save();

                $caso->expediente()->create([
                    'descripcion'=> 'Se actualizó información llenada del formulario',
                    'fecha_atencion'=> date("Y-m-d"),
                    'estatus_clave'=> 'S/E',
                    'valoracion_clave'=> 'S/V',
                    'atendido_por'=> ($auth_user)?$auth_user->id:null
                ]);
                
            }else{
                //Crear caso pendiente
                $caso = Caso::create(
                    [
                        'persona_id' => $persona->id,
                        'contingencia_id' => $formulario->contingencia_id,
                        'fecha_deteccion' => date("Y-m-d"),
                        'estatus_clave' => 'PTE',
                        'latitud' => $persona->latitud,
                        'longitud' => $persona->longitud,
                        'capturado_por' => ($auth_user)?$auth_user->id:null
                    ]
                );

                $caso->expediente()->create([
                    'descripcion'=> 'Lleno formulario web',
                    'fecha_atencion'=> date("Y-m-d"),
                    'estatus_clave'=> 'S/E',
                    'valoracion_clave'=> 'S/V',
                    'atendido_por'=> ($auth_user)?$auth_user->id:null
                ]);
            }
            

            $registro_llenado = RegistroLlenadoFormulario::create(['formulario_id'=>$formulario->id,'persona_id'=>$persona->id,'caso_id'=>$caso->id,'finalizado'=>1,'fecha_finalizado'=>date("Y-m-d H:i:s")]);
            $registro_llenado->registroLlenadoRespuestas()->createMany($respuestas_persona);

            //$parametros['registro_llenado'] = $registro_llenado;
            //$result = $registro_llenado;
            $result = [
                'persona' => $persona,
                'formulario_id' => $formulario->id
            ];

            if(isset($parametros['config']['llamada_id'])){
                $llamada = LlamadaCallCenter::find($parametros['config']['llamada_id']);
                $llamada->formulario_id = $formulario->id;
                $llamada->persona_id = $persona->id;
                $llamada->caso_id = $caso->id;
                $llamada->registro_llenado_id = $registro_llenado->id;

                $result['llamada'] = $llamada;
            }else if(isset($parametros['config']['crear_llamada'])){

                $folio = LlamadaCallCenter::max('folio');

                $edad = null;
                if($persona->fecha_nacimiento){
                    $date = new \DateTime($persona->fecha_nacimiento);
                    $now = new \DateTime();
                    $interval = $now->diff($date);
                    $edad = $interval->y;
                }
                

                $datos_llamada = [
                    'formulario_id'=>$formulario->id,
                    'persona_id'=>$persona->id,
                    'caso_id'=>$caso->id,
                    'registro_llenado_id'=>$registro_llenado->id,
                    'folio'=> $folio+1,
                    'asunto'=>'Llenado de Formulario: '.$formulario->descripcion,
                    'fecha_llamada' => date("Y-m-d"),
                    'hora_llamada' => date("H:i:s"),
                    'categoria_llamada_id' => 13,
                    'estatus_denuncia' => 'P',
                    'nombre_paciente' => $persona->apellido_paterno . ' ' . $persona->apellido_materno . ' ' . $persona->nombre,
                    'nombre_llamada' => $persona->apellido_paterno . ' ' . $persona->apellido_materno . ' ' . $persona->nombre,
                    'direccion_llamada' => $persona->calle . ' #' . $persona->no_externo . ' , ' . $persona->colonia,
                    'sexo' => $persona->sexo,
                    'edad_paciente' => $edad,
                    'telefono_llamada' => ($persona->telefono_celular)?$persona->telefono_celular:$persona->telefono_casa,
                    'recibio_llamada' => ($auth_user)?$auth_user->id:null,
                    'turno_id' => ($auth_user)?$auth_user->turno_id:null,
                ];

                $llamada = LlamadaCallCenter::create($datos_llamada);

                $result['llamada'] = $llamada;
            }

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function guardarDatosIndice(Request $request){//aqui debe de hacerse el cambio
        
        try{
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);

            if(isset($datos_persona['telefono_contacto'])){
                if($datos_persona['es_celular']){
                    $datos_persona['telefono_celular'] = $datos_persona['telefono_contacto'];
                }else{
                    $datos_persona['telefono_casa'] = $datos_persona['telefono_contacto'];
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            $persona = PersonaIndice::create($datos_persona);
            

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function editarDatosIndice(Request $request, $id){//aqui debe de hacerse el cambio
        
        try{
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);

            $persona = PersonaIndice::find($id);

            if(isset($datos_persona['telefono_contacto'])){
                if(isset($datos_persona['es_celular'])){
                    $persona->telefono_celular = $datos_persona['telefono_contacto'];
                    $persona->telefono_casa = null;
                }else{
                    $persona->telefono_casa = $datos_persona['telefono_contacto'];
                    $persona->telefono_celular = null;
            
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            
            $persona->apellido_paterno = $datos_persona['apellido_paterno'];
            $persona->apellido_materno = $datos_persona['apellido_materno'];
            $persona->nombre = $datos_persona['nombre'];
            $persona->fecha_nacimiento = $datos_persona['fecha_nacimiento'];
            $persona->email = $datos_persona['email'];
            $persona->estado_id = $datos_persona['estado_id'];
            $persona->municipio_id = $datos_persona['municipio_id'];
            $persona->municipio = $datos_persona['municipio'];
            $persona->localidad_id = $datos_persona['localidad_id'];
            $persona->localidad = $datos_persona['localidad'];
            $persona->colonia = $datos_persona['colonia'];
            $persona->calle = $datos_persona['calle'];
            $persona->no_exterior = $datos_persona['no_exterior'];
            $persona->no_interior = $datos_persona['no_interior'];
            $persona->codigo_postal = $datos_persona['codigo_postal'];
            $persona->referencia = $datos_persona['referencia'];
            $persona->latitud = $datos_persona['latitud'];
            $persona->longitud = $datos_persona['longitud'];
            $persona->observaciones = $datos_persona['observaciones'];
            $persona->no_caso = $datos_persona['no_caso'];
            $persona->save();
            

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function guardarDatosContacto(Request $request){//aqui debe de hacerse el cambio
        
        try{
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            //return response()->json(['data'=>$datos_persona],HttpResponse::HTTP_OK);
            $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);

            if(isset($datos_persona['telefono_contacto'])){
                if(isset($datos_persona['es_celular'])){
                    $persona->telefono_celular = $datos_persona['telefono_contacto'];
                    $persona->telefono_casa = null;
                }else{
                    $persona->telefono_casa = $datos_persona['telefono_contacto'];
                    $persona->telefono_celular = null;
            
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            $persona = PersonaContacto::create($datos_persona);
            if($datos_persona['estatus_salud_id'] == 2)
            {
                $persona_indice = PersonaIndice::create($datos_persona);
                $persona->persona_nuevo_indice_id = $persona_indice->id;
                $persona->save();
            }

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function editarDatosContacto(Request $request, $id){//aqui debe de hacerse el cambio
        
        try{
            DB::beginTransaction();

            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];
            $formulario_id = 0;

            $datos_persona = $parametros['persona'];

            $datos_persona['fecha_nacimiento'] = substr($datos_persona['fecha_nacimiento'],0,10);

            $persona = PersonaContacto::find($id);

            if(isset($datos_persona['telefono_contacto'])){
                if(isset($datos_persona['es_celular'])){
                    $persona->telefono_celular = $datos_persona['telefono_contacto'];
                    $persona->telefono_casa = null;
                }else{
                    $persona->telefono_casa = $datos_persona['telefono_contacto'];
                    $persona->telefono_celular = null;
            
                }
            }

            if(!isset($datos_persona['longitud']) || !$datos_persona['longitud']){
                if(isset($datos_persona['localidad_id']) && $datos_persona['localidad_id']){
                    $localidad = Localidad::find($datos_persona['localidad_id']);
                    if($localidad){
                        $datos_persona['longitud'] = $localidad->longitud;
                        $datos_persona['latitud'] = $localidad->latitud;
                    }
                }
            }

            
            $persona->apellido_paterno = $datos_persona['apellido_paterno'];
            $persona->apellido_materno = $datos_persona['apellido_materno'];
            $persona->nombre = $datos_persona['nombre'];
            $persona->alias = $datos_persona['alias'];
            if($datos_persona['fecha_nacimiento'] != "" ) { $persona->fecha_nacimiento = $datos_persona['fecha_nacimiento']; }
            if($datos_persona['estatus_contacto_id'] != "" ) { $persona->estatus_contacto_id = $datos_persona['estatus_contacto_id']; }
            if($datos_persona['estatus_salud_id'] != "" ) { $persona->estatus_salud_id = $datos_persona['estatus_salud_id']; }
            if($datos_persona['estatus_sistomatologia_id'] != "" ) { $persona->estatus_sistomatologia_id = $datos_persona['estatus_sistomatologia_id']; }
            $persona->email = $datos_persona['email'];
            $persona->estado_id = $datos_persona['estado_id'];
            $persona->municipio_id = $datos_persona['municipio_id'];
            $persona->municipio = $datos_persona['municipio'];
            $persona->localidad_id = $datos_persona['localidad_id'];
            $persona->localidad = $datos_persona['localidad'];
            $persona->colonia = $datos_persona['colonia'];
            $persona->calle = $datos_persona['calle'];
            $persona->no_exterior = $datos_persona['no_exterior'];
            $persona->no_interior = $datos_persona['no_interior'];
            $persona->codigo_postal = $datos_persona['codigo_postal'];
            $persona->referencia = $datos_persona['referencia'];
            $persona->latitud = $datos_persona['latitud'];
            $persona->longitud = $datos_persona['longitud'];
            $persona->observaciones = $datos_persona['observaciones'];
            $persona->tipo_contacto_id = $datos_persona['tipo_contacto_id'];

            if($datos_persona['estatus_salud_id'] == 2 && $persona->estatus_salud_id != 2)
            {
                $persona_indice = PersonaIndice::create($datos_persona);
                $persona->persona_nuevo_indice_id = $persona_indice->id;
                $persona->estatus_sistomatologia_id = $datos_persona['estatus_sistomatologia_id'];
                $persona->no_caso = $datos_persona['no_caso'];
            }else{
                $persona->estatus_sistomatologia_id = $datos_persona['estatus_sistomatologia_id'];
                $persona->no_caso = $datos_persona['no_caso'];
            }
            
            $persona->save();
            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function actualizaUbicacion(Request $request, $id)
    {
        try{
            DB::beginTransaction();
            $parametros = Input::all();

            $persona = Persona::find($id);
            if($id)
            {
                $persona->latitud = $parametros['latitud'];
                $persona->longitud = $parametros['longitud'];
                $persona->save();
                DB::commit();
                return response()->json(['data'=>$persona],HttpResponse::HTTP_OK);
            }else{
                DB::rollback();
                return response()->json(['error'=>['message'=>'No existe el elemento, favor de verificar','line'=>0]], HttpResponse::HTTP_CONFLICT);
            }
            
    }catch(\Exception $e){
        DB::rollback();
        return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
    }
    }
}
