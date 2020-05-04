<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use App\Http\Requests;

use Illuminate\Support\Facades\Input;

use DB;

use App\Models\Estrategia;
use App\Models\AvanceActividad;
use App\Models\Actividad;

class AvancesActividadesController extends Controller
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
            
            $estrategias = Estrategia::with('actividades.avanceAcumulado')->where('activo',1);

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $estrategias = $estrategias->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $estrategias = $estrategias->paginate($resultadosPorPagina);

            } else {
                $estrategias = $estrategias->get();
            }

            $estrategias = collect($estrategias)->map(function($element){
                if(count($element['actividades'])){
                    for ($i=0; $i < count($element['actividades']); $i++) { 
                        $actividad = $element['actividades'][$i];
                        
                        $actividad['meta_abierta'] = ($actividad['total_meta_programada'])?false:true;
                        
                        if($actividad['avanceAcumulado'] && !$actividad['meta_abierta']){
                            $actividad['porcentaje'] = ($actividad['avanceAcumulado']['total_avance']/$actividad['total_meta_programada'])*100;
                        }else{
                            $actividad['porcentaje'] = '0';
                        }
                    }
                }
                return $element;
            });

            

            return response()->json(['data'=>$estrategias],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function listadoAvances()
    {
        try{
            $parametros = Input::all();
            
            $avances = AvanceActividad::getModel();

            if(isset($parametros['actividad_id']) && $parametros['actividad_id']){
                $avances = $avances->where('actividad_id',$parametros['actividad_id']);
            }
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $avances = $avances->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }

            $avances = $avances->with('usuario')->orderBy('fecha_avance','DESC');

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $avances = $avances->paginate($resultadosPorPagina);

            } else {
                $avances = $avances->get();
            }

            return response()->json(['data'=>$avances],HttpResponse::HTTP_OK);
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

            $parametros['user_id'] = $auth_user->id;

            $avance = AvanceActividad::create($parametros);

            /*if(isset($parametros['id']) && $parametros['id']){
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
            }*/

            $actividad = Actividad::with('avanceAcumulado')->where('id',$parametros['actividad_id'])->first();

            $actividad->meta_abierta = ($actividad->total_meta_programada)?false:true;
            if($actividad->meta_abierta){
                $actividad->porcentaje = 0;
            }else{
                $actividad->porcentaje = ($actividad->avanceAcumulado->total_avance/$actividad->total_meta_programada)*100;
            }
            

            return response()->json(['data'=>$actividad],HttpResponse::HTTP_OK);
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
