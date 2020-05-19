<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 

use App\Http\Controllers\Controller;
use App\Models\ActividadMetaGrupo;
use App\Models\GrupoEstrategico;
use App\Helpers\HttpStatusCodes;


class ActividadesMetasGruposController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $params = $request->input();
        if(isset($params["all"])){            
            return response()->json(["data"=>ActividadMetaGrupo::all()]);
        } else {
            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }            
           
            $items = ActividadMetaGrupo::select(
                    "actividades_metas_grupos.*", 
                    "grupos_estrategicos.descripcion as grupo")
                ->leftjoin('grupos_estrategicos','grupos_estrategicos.id','=','actividades_metas_grupos.grupo_estrategico_id');
            if(isset($params['orderBy']) && trim($params['orderBy'])!= ""){
                $sortOrder = 'asc';
                if(isset($params['sortOrder'])){
                    $sortOrder = $params['sortOrder'];
                }    
                $items = $items->orderBy($params['orderBy'],$sortOrder);
            }
            
            if(isset($params['filter']) && trim($params['filter'])!= ""){
                $items = $items->where(function($query)use($params){
                    return $query->where('grupos_estrategicos.descripcion','LIKE','%'.$params['filter'].'%');
                });
            }

            if(isset($params['actividad_meta_id'])){
                $items = $items->where("actividad_meta_id","=", $params['actividad_meta_id']);
            }            
            
            $items = $items->paginate($params['pageSize']);
            
            return response()->json($items);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'actividad_id' => ['required'],
            'actividad_meta_id' => ['required'],
            'grupo_estrategico_id' => ['required'],
            'meta_programada' => ['numeric']
        ];

        $messages = [
            'required' => 'required',
            'numeric' => 'numeric',
        ];

        $validator = Validator::make($request->all(), $rules,$messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }

        //TODO:Agregar un resumen por grupo, sin actividad_meta_id

        DB::beginTransaction();
        try {
            $data = [];
            $data['actividad_id'] = $request['actividad_id'];
            $data['actividad_meta_id'] = $request['actividad_meta_id'];
            $data['grupo_estrategico_id'] = $request['grupo_estrategico_id'];

            if(isset($request['meta_programada'])){
                $data['meta_programada'] = $request['meta_programada'];
            }

            $object = ActividadMetaGrupo::create($data);

            $actividad_grupo = ActividadMetaGrupo::where('actividad_id',$request['actividad_id'])->where('grupo_estrategico_id',$request['grupo_estrategico_id'])->whereNull('actividad_meta_id')->first();

            if(!$actividad_grupo){
                $actividad_grupo = ActividadMetaGrupo::create([ 'actividad_id' => $request['actividad_id'], 'grupo_estrategico_id' => $request['grupo_estrategico_id'] ,'meta_programada' => 0 ]);
            }

            $suma = ActividadMetaGrupo::where('actividad_id',$request['actividad_id'])->where('grupo_estrategico_id',$request['grupo_estrategico_id'])->whereNotNull('actividad_meta_id')->get();
            $suma = $suma->sum('meta_programada');
            $actividad_grupo->meta_programada = $suma;
            $actividad_grupo->save();

            DB::commit();
        }catch (\Exception $e) {
            DB::rollback();
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }
        
        return $object;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {

            $object = ActividadMetaGrupo::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 
            $object->grupos = GrupoEstrategico::All();
            $object->grupo;
            


            return $object;
        } catch (Exception $e) {
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
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
            'grupo_estrategico_id' => ['required'],
            'meta_programada' => ['numeric']
        ];

        $messages = [
            'required' => 'required',
            'numeric' => 'numeric',
        ];

        $validator = Validator::make($request->all(), $rules,$messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }

        DB::beginTransaction();
        try {

            $object = ActividadMetaGrupo::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 

            if(isset($request['meta_programada'])){
                $object->meta_programada = $request['meta_programada'];
            } else {
                $object->meta_programada = null;
            }
            
            if(isset($request['grupo_estrategico_id'])){
                $object->grupo_estrategico_id = $request['grupo_estrategico_id'];
            } else {
                $object->grupo_estrategico_id = null;
            }

            $actividad_grupo = ActividadMetaGrupo::where('actividad_id',$object->actividad_id)->where('grupo_estrategico_id',$request['grupo_estrategico_id'])->whereNull('actividad_meta_id')->first();

            if(!$actividad_grupo){
                $actividad_grupo = ActividadMetaGrupo::create([ 'actividad_id' => $object->actividad_id, 'grupo_estrategico_id' => $request['grupo_estrategico_id'] ,'meta_programada' => 0 ]);
            }

            $suma = ActividadMetaGrupo::where('actividad_id',$object->actividad_id)->where('grupo_estrategico_id',$request['grupo_estrategico_id'])->whereNotNull('actividad_meta_id')->get();
            $suma = $suma->sum('meta_programada');
            $actividad_grupo->meta_programada = $suma;
            $actividad_grupo->save();
            
            $object->save();

            DB::commit();
        }catch (\Exception $e) {
            DB::rollback();
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }

        $object->grupo;
        
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
            $object = ActividadMetaGrupo::find($id);
            if(!$object){
                throw new Exception("No de puede borrar un registro inexistente",404);
            }

            $object = ActividadMetaGrupo::destroy($id);
            return Response::json(['data'=>$object],200);
        } catch (Exception $e) {
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }
    }
}
