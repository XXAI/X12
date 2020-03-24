<?php

namespace App\Http\Controllers\API\Servicios;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

use App\Models\Formulario;

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
            $auth_user = auth()->user();
            $parametros = Input::all();
            $result = [];

            $result = $parametros;

            return response()->json(['data'=>$result],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
