<?php

namespace App\Http\Controllers\API\Modulos\Influenza;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 

use \DateTime;

use App\Http\Controllers\Controller;

use App\Models\Influenza\DosisMeta;
use App\Models\Influenza\DosisAvanceDiario;
use App\Models\Influenza\DosisAvanceDiarioDetalle;
use App\Models\Influenza\GrupoPoblacion;
use App\Models\Influenza\ConfigurarModulo;
use App\Models\Distrito;

use App\Helpers\HttpStatusCodes;


class DosisMetasAvancesController extends Controller
{
    public function getInitData(){
        try {
            $auth_user = auth()->user();

            $config = ConfigurarModulo::get();

            $data = [
                'configuracion' => $config,
                'grupos_poblacion' => GrupoPoblacion::all(),
                'dosis_metas' => DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get(),
                'distrito' => Distrito::find($auth_user->distrito_asignado_id),
            ];

            return response()->json(['data'=>$data],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function guardarDosisMetas(Request $request){
        try {
            $auth_user = auth()->user();
            $parametros = $request->all();

            $metas_form = array_values($parametros);
            
            $dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();

            DB::beginTransaction();

            //if(count($dosis_metas)){
                $metas_guardadas = [];
                foreach ($dosis_metas as $value) {
                    $metas_guardadas[$value->id] = $value;
                }

                foreach ($metas_form as $meta) {
                    $meta['distrito_id'] = $auth_user->distrito_asignado_id;

                    if(isset($meta['id']) && $meta['id']){
                        $dosis_meta = $metas_guardadas[$meta['id']];
                        $dosis_meta->update($meta);
                    }else{
                        DosisMeta::create($meta);
                    }
                }
            /*}else{
                for ($i=0; $i < count($metas_form) ; $i++) { 
                    $metas_form[$i]['distrito_id'] = $auth_user->distrito_asignado_id;
                }
                DosisMeta::getModel()->createMany($metas_form);
            }*/
            DB::commit();
            $dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();

            return response()->json(['data'=>$dosis_metas],HttpResponse::HTTP_OK);
        }catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request){
        try{
            $auth_user = auth()->user();
            $parametros = $request->all();
            
            $avance_diario = DosisAvanceDiario::with('usuario','distrito')->where('distrito_id',$auth_user->distrito_asignado_id);
            
            if(isset($parametros['buscar_fecha']) && $parametros['buscar_fecha']){
                $avance_diario = $avance_diario->where('fecha_avance',$parametros['buscar_fecha']);
            }

            if(isset($parametros['buscar_rango']) && $parametros['buscar_rango']){
                $from = date($parametros['fecha_inicio']);
                $to = date($parametros['fecha_fin']);
                $avance_diario = $avance_diario->whereBetween('fecha_avance', [$from,$to]);
            }

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $avance_diario = $avance_diario->where(function($query)use($parametros){
                    return $query->where('fecha_avance','LIKE','%'.$parametros['query'].'%');
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }

            $avance_diario = $avance_diario->orderBy('fecha_avance','DESC');

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $avance_diario = $avance_diario->paginate($resultadosPorPagina);

            } else {
                $avance_diario = $avance_diario->get();
            }

            return response()->json(['data'=>$avance_diario],HttpResponse::HTTP_OK);
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
        try {
            $auth_user = auth()->user();
            $parametros = $request->all();

            $avance_capturado = DosisAvanceDiario::where('distrito_id',$auth_user->distrito_asignado_id)->where('fecha_avance',$parametros['fecha_avance'])->first();
            if($avance_capturado){
                throw new Exception("El día seleccionado ya fue capturado", 1);
            }

            $hoy = new DateTime();
            $fecha_avance = new DateTime($parametros['fecha_avance']);

            if($fecha_avance > $hoy){
                throw new Exception("Piensa McFly, piensa!!!, no se puede capturar un avance de un día mayor al actual", 1);
            }

            $avance_metas_form = array_values($parametros['avance_metas']);
            $avance_por_meta = [];
            $avance_general = 0;
            foreach ($avance_metas_form as $avance_meta) {
                $avance_general += $avance_meta['avance'];
                $avance_por_meta[$avance_meta['dosis_meta_id']] = $avance_meta['avance'];
            }

            DB::beginTransaction();

            $dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();
            $meta_dia = 0;
            foreach ($dosis_metas as $meta) {
                $meta->avance_dosis_acumuladas += $avance_por_meta[$meta->id];
                $meta_dia += $meta->meta_diaria;
                $meta->save();
            }

            $avance_diario = DosisAvanceDiario::create([
                'distrito_id'           => $auth_user->distrito_asignado_id,
                'fecha_avance'          => $parametros['fecha_avance'],
                'avance_dia'            => $avance_general,
                'meta_dia'              => $meta_dia,
                'porcentaje_meta_dia'   => round((($avance_general/$meta_dia)*100),2),
                'observaciones'         => $parametros['observaciones'],
                'usuario_id'            => $auth_user->id,
                'creado_por'            => $auth_user->id
            ]);

            $avance_diario->detalles()->createMany($avance_metas_form);

            DB::commit();
            //$dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();
            return response()->json(['data'=>$dosis_metas],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        try {
            $avance_diario = DosisAvanceDiario::with('detalles')->find($id);

            if(!$avance_diario){
                throw new Exception("Registro inexistente",404);
            } 
            $avance_diario->estrategia;

            return response()->json(['data'=>$avance_diario],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
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
        //StandBy
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id){
        try {
            $auth_user = auth()->user();
            
            DB::beginTransaction();

            $avance_diario = DosisAvanceDiario::with('detalles')->find($id);

            if($avance_diario->solo_lectura){
                throw new Exception("No es posible eliminar este elemento", 1);
            }

            $eliminar_avances = [];
            foreach ($avance_diario->detalles as $avance_meta) {
                $eliminar_avances[$avance_meta->dosis_meta_id] = $avance_meta->avance;
            }

            $dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();
            foreach ($dosis_metas as $meta) {
                $meta->avance_dosis_acumuladas -= $eliminar_avances[$meta->id];
                $meta->save();
            }

            $avance_diario->detalles()->delete();
            $avance_diario->delete();
            DB::commit();

            //$dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();
            return response()->json(['data'=>$dosis_metas],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
