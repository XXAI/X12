<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Formulario;
use App\Models\Persona;
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

            $persona = Persona::create($datos_persona);
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
                    'folio'=> $folio+1,
                    'asunto'=>'Llenado de Formulario: '.$formulario->descripcion,
                    'fecha_llamada' => date("Y-m-d"),
                    'hora_llamada' => date("H:i:s"),
                    'categoria_llamada_id' => 13,
                    'estatus_denuncia' => 'P',
                    'nombre_paciente' => $persona->apellido_paterno . ' ' . $persona->apellido_materno . ' ' . $persona->nombre,
                    'sexo' => $persona->sexo,
                    'edad_paciente' => $edad,
                    'telefono_llamada' => ($persona->telefono_celular)?$persona->telefono_celular:$persona->telefono_casa,
                    'recibio_llamada' => $auth_user->id,
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
