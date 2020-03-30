<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\Contingencia;
use App\Models\Caso;

class CasosContingenciasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function listadoContingencias()
    {
        try{
            //$storage_images_path = 'imagenes/contingencias-imagenes/';

            $contingencias = Contingencia::select('id','titulo','descripcion',DB::raw('concat("/imagenes/contingencias-imagenes/",archivo_imagen) as imagen'));
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['page'])){
                $contingencias = $contingencias->orderBy('fecha_finalizado','DESC');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $contingencias = $contingencias->paginate($resultadosPorPagina);
            } else {
                $contingencias = $contingencias->get();
            }

            return response()->json(['data'=>$contingencias],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function listadoCasosContingencia($id)
    {
        try{
            $parametros = Input::all();

            $casos = Caso::select('casos.*',DB::raw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) as persona_nombre'))
                        ->where('contingencia_id',$id)
                        ->leftjoin('personas','personas.id','=','casos.persona_id');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $casos = $casos->paginate($resultadosPorPagina);
            } else {
                $casos = $casos->get();
            }

            return response()->json(['data'=>$casos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function verCaso($id)
    {
        try{
            $caso = Caso::with('persona','expediente')->find($id);
            
            return response()->json(['data'=>$caso],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

   
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
