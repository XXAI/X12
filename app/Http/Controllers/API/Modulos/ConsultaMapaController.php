<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;
use \DB;
use App\Models\Persona;
use App\Models\Municipio;
use App\Models\InformacionCovid;

class ConsultaMapaController extends Controller
{
    //

    public function obtenerCasosMunicipios(){
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();
            /*$persona = DB::Table("formularios")
                        ->join("registro_llenado_formulario", "registro_llenado_formulario.formulario_id", "=", "formulario.id")
                        ->join("personas", "personas.id", "=", "registro_llenado_formulario.persona_id")
                        ->where("formularios.id", "=", 1)
                        ->groupBy("personas.municipio_id")
                        ->select("personas.municipio_id")
                        ->get();*/
                /*$persona = DB::Table("personas")
                        ->groupBy("personas.municipio_id")
                        ->select("personas.municipio_id")
                        ->get();*/
            
                        $municipio = DB::Table("catalogo_municipios")
                        ->limit(30)
                        ->get();
            return response()->json(['data'=>$municipio],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function mapaUbicacion(){
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();
            $municipios = Municipio::whereNull("deleted_at")->get();

            $arreglo_municipios = array();
            foreach ($municipios as $key => $value) {
                $arreglo_municipios[$value->id]= $value;
            }

            return response()->json(['data'=>$arreglo_municipios],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function informacionCovid(){
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();
            $informacion = InformacionCovid::whereNull("deleted_at")->first();

            
            return response()->json(['data'=>$informacion],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
