<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 

use App\Http\Controllers\Controller;
use App\Models\ActividadMeta;
use App\Models\Distrito;
use App\Models\Municipio;
use App\Models\Localidad;
use App\Helpers\HttpStatusCodes;


class ActividadesMetasController extends Controller
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
            
            return response()->json(["data"=>ActividadMeta::all()]);
        } else {
            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }
            
           
            $items = ActividadMeta::select(
                    "actividades_metas.*", 
                    "catalogo_distritos.descripcion as distrito", 
                    "catalogo_municipios.descripcion as municipio", 
                    "catalogo_localidades.descripcion as localidad")
                ->leftjoin('catalogo_distritos','catalogo_distritos.id','=','actividades_metas.distrito_id')
                ->leftjoin('catalogo_municipios','catalogo_municipios.id','=','actividades_metas.municipio_id')
                ->leftjoin('catalogo_localidades','catalogo_localidades.id','=','actividades_metas.localidad_id');
            if(isset($params['orderBy']) && trim($params['orderBy'])!= ""){
                $sortOrder = 'asc';
                if(isset($params['sortOrder'])){
                    $sortOrder = $params['sortOrder'];
                }
    
                $items = $items->orderBy($params['orderBy'],$sortOrder);
            }

            
            if(isset($params['filter']) && trim($params['filter'])!= ""){
                $items = $items->where(function($query)use($params){
                    return $query->where('catalogo_distritos.descripcion','LIKE','%'.$params['filter'].'%')
                                ->orWhere('catalogo_municipios.descripcion','LIKE','%'.$params['filter'].'%')
                                ->orWhere('catalogo_localidades.descripcion','LIKE','%'.$params['filter'].'%')
                                ;
                                //->whereRaw('CONCAT_WS(" ",personas.apellido_paterno, personas.apellido_materno, personas.nombre) like "%'.$parametros['query'].'%"' );
                });
            }

            if(isset($params['actividad_id'])){
                $items = $items->where("actividad_id","=", $params['actividad_id']);
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
            $data = [];
            $data['actividad_id'] = $request['actividad_id'];
            if(isset($request['meta_programada'])){
                $data['meta_programada'] = $request['meta_programada'];
            }
            
            if(isset($request['distrito_id'])){
                $data['distrito_id'] = $request['distrito_id'];
            } 

            if(isset($request['municipio_id'])){
                $data['municipio_id'] = $request['municipio_id'];
            } 

            if(isset($request['localidad_id'])){
                $data['localidad_id'] = $request['localidad_id'];
            } 

            $object = ActividadMeta::create($data);
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

            $object = ActividadMeta::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 
            $actividad = $object->actividad;
            if($actividad){
                $actividad->estrategia;
            }
            $distrito = $object->distrito;

            $object->distritos = Distrito::all();

            if($distrito){
                
                $object->municipios = Municipio::where("distrito_id","=",$distrito->id)->get();
            }
            $municipio = $object->municipio;
            if($municipio){
                $object->localidades = Localidad::where("municipio_id","=",$municipio->id)->get();
            }
            $object->localidad;


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
            //'actividad_id' => ['required'],
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

            $object = ActividadMeta::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 

            if(isset($request['meta_programada'])){
                $object->meta_programada = $request['meta_programada'];
            } else {
                $object->meta_programada = null;
            }
            
            if(isset($request['distrito_id'])){
                $object->distrito_id = $request['distrito_id'];
            } else {
                $object->distrito_id = null;
            }

            if(isset($request['municipio_id'])){
                $object->municipio_id = $request['municipio_id'];
            }  else {
                $object->municipio_id = null;
            }

            if(isset($request['localidad_id'])){
                $object->localidad_id = $request['localidad_id'];
            } else {
                $object->localidad_id = null;
            } 
            
            $object->save();

            DB::commit();
        }catch (\Exception $e) {
            DB::rollback();
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }

        $object->distrito;
        $object->municipio;
        $object->localidad;
        
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
            $object = ActividadMeta::find($id);
            if(!$object){
                throw new Exception("No de puede borrar un registro inexistente",404);
            }

            $object = ActividadMeta::destroy($id);
            return Response::json(['data'=>$object],200);
        } catch (Exception $e) {
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }
    }
}
