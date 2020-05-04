<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use \DB, \Response, \Exception; 

use App\Http\Controllers\Controller;
use App\Models\Actividad;

use App\Helpers\HttpStatusCodes;


class ActividadesController extends Controller
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
            
            return response()->json(["data"=>Actividad::all()]);
        } else {
            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }
            
           
            $items = Actividad::select();
            if(isset($params['orderBy']) && trim($params['orderBy'])!= ""){
                $sortOrder = 'asc';
                if(isset($params['sortOrder'])){
                    $sortOrder = $params['sortOrder'];
                }
    
                $items = $items->orderBy($params['orderBy'],$sortOrder);
            }
            if(isset($params['filter']) && trim($params['filter'])!= ""){
                $items = $items->where("descripcion","LIKE", "%".$params['filter']."%");
            }

            if(isset($params['estrategia_id'])){
                $items = $items->where("estrategia_id","=", $params['estrategia_id']);
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
            'descripcion' => ['required'],
            'estrategia_id' => ['required'],
            'total_meta_programada' => ['numeric']
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
            $data['descripcion'] = $request['descripcion'];
            $data['estrategia_id'] = $request['estrategia_id'];
            if(isset($request['total_meta_programada'])){
                $data['total_meta_programada'] = $request['total_meta_programada'];
            }
            $object = Actividad::create($data);
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

            $object = Actividad::find($id);

            if(!$object){
                throw new Exception("Registro inexistente",404);
            } 
            $object->estrategia;

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
