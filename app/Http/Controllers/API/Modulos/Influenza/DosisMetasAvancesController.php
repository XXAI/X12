<?php

namespace App\Http\Controllers\API\Modulos\Influenza;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 

use App\Http\Controllers\Controller;

use App\Models\Influenza\DosisMeta;
use App\Models\Influenza\DosisAvanceDiario;
use App\Models\Influenza\DosisAvanceDiarioDetalle;
use App\Models\Influenza\GrupoPoblacion;

use App\Helpers\HttpStatusCodes;


class DosisMetasAvancesController extends Controller
{
    public function getInitData(){
        try {
            $auth_user = auth()->user();

            $data = [
                'grupos_poblacion' => GrupoPoblacion::all(),
                'dosis_metas' => DosisMeta::with('grupoPoblacion')->where('distrito_id',$auth_user->distrito_asignado_id)->get(),
                'distrito' => Distrito::find($auth_user->distrito_asignado_id)
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

            $data = [];

            $dosis_metas = DosisMeta::where('distrito_id',$auth_user->distrito_asignado_id)->get();

            DB::beginTransaction();

            if(count($dosis_metas)){
                $metas_guardadas = [];
                foreach ($dosis_metas as $value) {
                    $metas_guardadas[$value->id] = $value;
                }

                foreach ($parametros as $meta) {
                    $meta['distrito_id'] = $auth_user->distrito_asignado_id;

                    if(isset($meta['id']) && $meta['id']){
                        $dosis_meta = $metas_guardadas[$meta['id']];

                        $dosis_meta->update($meta);
                    }else{
                        DosisMeta::create($meta);
                    }
                }
            }else{
                DosisMeta::createMany($parametros);
            }
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

            $avance_diario = DosisAvanceDiario::create([
                'distrito_id'=>''
            ]);
            
            return response()->json(['data'=>$avance_diario],HttpResponse::HTTP_OK);
        } catch (Exception $e) {
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
        $rules = [
            'descripcion' => ['required'],
            'estrategia_id' => ['required'],
            'total_meta_programada' => ['numeric']
        ];

        $messages = [
            'required' => 'required',
            'numeric' => 'numeric',
        ];

        DB::beginTransaction();
        try {

            $object = Actividad::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 

            $validator = Validator::make($request->all(), $rules,$messages);

            if ($validator->fails()) {
                return  response()->json($validator->messages(), 409);
            }
        
            $object->descripcion = $request['descripcion'];
            if(isset($request['total_meta_programada'])){
                $object->total_meta_programada = $request['total_meta_programada'];
            } else {
                $object->total_meta_programada = null;
            }
            
            $object->save();
            DB::commit();
        }catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
        }
        $object->estrategia;
        return $object;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            //$object = Permiso::destroy($id);
            $object = Actividad::find($id);
            if(!$object){
                throw new Exception("No de puede borrar un registro inexistente",404);
            }

            $object = Actividad::destroy($id);
            return Response::json(['data'=>$object],200);
        } catch (Exception $e) {
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }
    }
}
