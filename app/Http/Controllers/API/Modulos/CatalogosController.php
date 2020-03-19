<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use Illuminate\Support\Facades\Input;

use App\Http\Controllers\Controller;

class CatalogosController extends Controller
{
    public function index()
    {
        try{
            /*
            $params = Input::all();
            $fuente = Fuente::orderBy("descripcion")->get();
            $nivelAcademico = NivelAcademico::orderBy('nivel')->get();
            $sindicatos = Sindicato::all();

            
            $programa = Programa::orderBy("descripcion")->get();
            $rama = Rama::orderBy("descripcion")->get();
            $tipoTrabajador = TipoTrabajador::orderBy("descripcion")->get();
            $turno = Turno::all();
            $fuente_finan = FuenteFinanciamiento::orderBy("descripcion")->get();
            $ur = UR::all();
            
            $catalogos = [
                "fuente_financiamiento" => $fuente_finan,
                "programa" => $programa, 
                "rama" => $rama, 
                "tipo_trabajador" => $tipoTrabajador, 
                "nivel_academico" => $nivelAcademico, 
                "sindicatos" => $sindicatos,
                "turno" => $turno,
                "ur" => $ur
            ];*/

            return response()->json(['data' => ''],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function catalogoTipoBaja(){
        try{
            $tipos_baja = TipoBaja::all();
            
            return response()->json(['data'=>$tipos_baja], HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
