<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Formulario;
use App\Models\Persona;
use App\Models\Localidad;

use DB;

class FormularioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function obtenerFormularios(){
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();

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
            }]);

            if(isset($parametros['ids']) && $parametros['ids']){
                $formulario = $formulario->whereIn('id',$parametros['ids']);
            }

            $formulario = $formulario->get();

            return response()->json(['data'=>$formulario],HttpResponse::HTTP_OK);
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
            $parametros['persona'] = $persona;

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

                /*$preguntas = $formulario->preguntas;
                for($i = 0; $i < count($preguntas); $i++){

                    if($preguntas[$i]->serie){
                        $preguntas_serie = $preguntas[$i]->serie->preguntas;

                        for($j = 0; $j < count($preguntas_serie); $j++){
                            //
                        }
                    }
                }*/
            }

            $parametros['formulario'] = $formulario;
            $result = $parametros;

            DB::commit();

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
