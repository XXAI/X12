<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 
use Illuminate\Support\Facades\Storage;

use App\Http\Controllers\Controller;
use App\Models\ArchivoGrupo;
use App\Models\User;
use App\Models\VariableGlobal;

use App\Helpers\HttpStatusCodes;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use JWTAuth, JWTFactory;

class ArchivosGruposController extends Controller
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
            
            return response()->json(["data"=>ArchivoGrupo::all()]);
        } else {
            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }
            
           
            $items = ArchivoGrupo::select(
                    "archivos_grupos.*", 
                    "grupos_estrategicos.descripcion as grupo")
                ->leftjoin('grupos_estrategicos','grupos_estrategicos.id','=','archivos_grupos.grupo_estrategico_id');
            if(isset($params['orderBy']) && trim($params['orderBy'])!= ""){
                $sortOrder = 'asc';
                if(isset($params['sortOrder'])){
                    $sortOrder = $params['sortOrder'];
                }    
                $items = $items->orderBy($params['orderBy'],$sortOrder);
            }
            
            if(isset($params['filter']) && trim($params['filter'])!= ""){
                $items = $items->where(function($query)use($params){
                    return $query->where('grupos_estrategicos.descripcion','LIKE','%'.$params['filter'].'%')
                            ->orWhere('archivos_grupos.titulo','LIKE','%'.$params['filter'].'%');
                });
            }          

            $obj =  JWTAuth::parseToken()->getPayload();
            $usuario = User::find($obj->get('sub'));
            $grupos = $usuario->grupos;
    
            if(count($grupos) > 0){
                $items = $items->where("archivos_grupos.grupo_estrategico_id","=",$grupos[0]->id);
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
        ini_set('memory_limit', '-1');
        $rules = [
            'titulo' => ['required'],
            'archivo' => ['required','file'],
        ];

        $messages = [
            'required' => 'required',
            'file' => 'file',
        ];
        
        $validator = Validator::make($request->all(), $rules,$messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }

        $obj =  JWTAuth::parseToken()->getPayload();
        $usuario = User::find($obj->get('sub'));
        $grupos = $usuario->grupos;
        $grupo_id = null;

        if(count($grupos) > 0){
            $grupo_id = $grupos[0]->id;
        } else {
            return Response::json( [ "grupo" => ["required"]], HttpResponse::HTTP_CONFLICT);
        }

        $bloquear = VariableGlobal::where("nombre","=","BLOQUEAR-ARCHIVOS-GRUPOS")->first();
        
        if($bloquear && $bloquear->valor == "true"){
            return Response::json( [ "bloqueado" => ["true"]], HttpResponse::HTTP_CONFLICT);
        }
        
        DB::beginTransaction();
        try {
            $uploadedFile = $request->file('archivo');
            $filename = time()."/".$uploadedFile->getClientOriginalName();
            $path = 'archivos-grupos/'.$filename;
            Storage::putFileAs(
                'archivos-grupos/',
                $uploadedFile,
                $filename
            );

            $data = [];
            $data['titulo'] = $request['titulo'];
            $data['path'] = $path;
            $data['grupo_estrategico_id'] = $grupo_id;


            $object = ArchivoGrupo::create($data);
            DB::commit();

        }catch (\Exception $e) {
            DB::rollback();
            return Response::json(['error' => $e->getMessage()], HttpResponse::HTTP_CONFLICT);
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

            $object = ArchivoGrupo::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 
            $object->grupos;

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
        return;
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
            $object = ArchivoGrupo::find($id);
            if(!$object){
                throw new Exception("No de puede borrar un registro inexistente",404);
            }

            $object = ArchivoGrupo::destroy($id);
            return Response::json(['data'=>$object],200);
        } catch (Exception $e) {
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }
    }

     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function descargar($id)
    {
        ini_set("memory_limit","-1"); 
        try {

            $object = ArchivoGrupo::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 
            
            
            return Storage::download($object->path);
        } catch (Exception $e) {
            return Response::json(['message' => $e->getMessage()], HttpStatusCodes::parse($e->getCode()));
        }
    }
}
