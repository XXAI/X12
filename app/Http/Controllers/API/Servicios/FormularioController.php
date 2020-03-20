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

            $formulario = Formulario::with(['preguntas'=>function($preguntas){
                return $preguntas->select('*')
                                ->leftjoin('');
            },'preguntas.respuestas'])>get();

            return response()->json(['data'=>$formulario],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
