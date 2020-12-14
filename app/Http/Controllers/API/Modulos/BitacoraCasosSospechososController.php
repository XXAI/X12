<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB, Validator;
use App\Models\CasoSospechoso;
use App\Models\BitacoraCasoSospechoso;

class BitacoraCasosSospechososController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $auth_user = auth()->user();

        $params = $request->input();
        if(isset($params["all"])){
            
            return response()->json(["data"=>CasoSospechoso::all()]);
        } else {

            if(!isset($params['caso_id'])){
                $empty = [
                    "current_page"=> 1,
                    "data"=> [],
                    "first_page_url"=> "",
                    "from"=> null,
                    "last_page"=> 1,
                    "last_page_url"=> "",
                    "next_page_url"=> null,
                    "path" => "",
                    "per_page"=> "5",
                    "prev_page_url"=> null,
                    "to" => null,
                    "total"=> 0
                ];
                return response()->json($empty);
            }

            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }
            
            //auth()->user()->id
           
            $items = BitacoraCasoSospechoso::where('caso_id',$params['caso_id']);

            if(isset($params['orderBy']) && trim($params['orderBy'])!= ""){
                $sortOrder = 'asc';
                if(isset($params['sortOrder'])){
                    $sortOrder = $params['sortOrder'];
                }
               
    
                $items = $items->orderBy($params['orderBy'],$sortOrder);
            }  else {
                $items = $items->orderBy('bitacora_casos_sospechosos.id','desc');
            }           

           
            
            $items = $items->paginate($params['pageSize']);
            
            
            return response()->json($items);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id){
        $bitacora = BitacoraCasoSospechoso::find($id);        
        
        if($caso != null) {
            return response()->json(['bitacora' => $bitacora]);
        } else {
            return response()->json(['message' => "Bitácora no encontrado"],404);
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
        $rules = [
            'caso_id' => 'required',
            'seguimiento' => 'required',
        ];

        $messages = [
            'required' => 'required',
        ];

        $payload = $request->except(['id']);

        $validator = Validator::make($payload, $rules, $messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }
        $auth_user = auth()->user();
        $payload['user_id'] = $auth_user->id;        

        $response = DB::transaction(function() use($payload){            
            $bitacora = BitacoraCasoSospechoso::create($payload);
            return response()->json(['bitacora' => $bitacora]);
        });

        return $response;
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
        $bitacora = BitacoraCasoSospechoso::find($id);
        
        if($bitacora != null) {
           
            $rules = [
                'caso_id' => 'required',
                'seguimiento' => 'required',
            ];
    
            $messages = [
                'required' => 'required',
            ];
    
            $payload = $request->except(['id']);    
            $validator = Validator::make($payload, $rules, $messages);
    
            if ($validator->fails()) {
                return  response()->json($validator->messages(), 409);
            }

            $auth_user = auth()->user();
            $payload['user_id'] = $auth_user->id;  


            $response = DB::transaction(function() use($bitacora,$payload){                
    
                $bitacora->update($payload);
    
                //$caso->save();
                return response()->json(['bitacora' => $bitacora]);
            });

        } else {
            return response()->json(['message' => "Bitacora no encontrada"],404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return response()->json(['bitacora' => null],200);
    }
}
