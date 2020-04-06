<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\LlamadaCallCenter;

class CallCenterLLamadasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try{
            $parametros = Input::all();
            
            $llamadas = LlamadaCallCenter::select('llamadas_call_center.*','catalogo_categoria_llamada.categoria as categoria_llamada','catalogo_categoria_llamada.descripcion as categoria_llamada_desc')
                                        ->leftjoin('catalogo_categoria_llamada','catalogo_categoria_llamada.id','=','llamadas_call_center.categoria_llamada_id');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $llamadas = $llamadas->where(function($query)use($parametros){
                    return $query->where('telefono_llamada','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre_llamada','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('folio','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('fecha_llamada','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('asunto','LIKE','%'.$parametros['query'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }

            if(isset($parametros['page'])){
                $llamadas = $llamadas->orderBy('fecha_llamada','DESC')->orderBy('hora_llamada','DESC');
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $llamadas = $llamadas->paginate($resultadosPorPagina);

            } else {
                $llamadas = $llamadas->get();
            }

            return response()->json(['data'=>$llamadas],HttpResponse::HTTP_OK);
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
        try{
            $auth_user = auth()->user();
            $parametros = Input::all();

            if(isset($parametros['id']) && $parametros['id']){
                $llamada = LlamadaCallCenter::find($parametros['id']);
                $parametros['recibio_llamada'] = $auth_user->id;
                $parametros['turno_id'] = $auth_user->turno_id;

                unset($parametros['hora_llamada']);
                unset($parametros['fecha_llamada']);

                $llamada->update($parametros);
            }else{
                $ultimo_folio = LLamadaCallCenter::max('folio');
                $ultimo_folio = $ultimo_folio+1;

                $parametros['folio'] = $ultimo_folio;
                $parametros['recibio_llamada'] = $auth_user->id;
                $parametros['turno_id'] = $auth_user->turno_id;

                $llamada = LlamadaCallCenter::create($parametros);
            }

            return response()->json(['data'=>$parametros],HttpResponse::HTTP_OK);
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
    public function show($id)
    {
        try{
            $parametros = Input::all();
            
            $llamada = LlamadaCallCenter::select('llamadas_call_center.*','catalogo_categoria_llamada.categoria as categoria_llamada','catalogo_categoria_llamada.descripcion as categoria_llamada_desc','users.name as recibio_llamada_nombre')
                                        ->leftjoin('catalogo_categoria_llamada','catalogo_categoria_llamada.id','=','llamadas_call_center.categoria_llamada_id')
                                        ->leftjoin('users','users.id','=','llamadas_call_center.recibio_llamada')
                                        ->where('llamadas_call_center.id',$id)
                                        ->first();
            
            
            return response()->json(['data'=>$llamada],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
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
