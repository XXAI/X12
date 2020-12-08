<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB, Validator;
use App\Models\CasoSospechoso;
use App\Models\Municipio;
use App\Models\Localidad;
use App\Models\Colonia;

class CasosSospechososController extends Controller
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
            if(!isset($params['pageSize'])){
                $params['pageSize'] = 1;
            }
            
            //auth()->user()->id
           
            $items = CasoSospechoso::select(
                            'casos_sospechosos.id',
                            'casos_sospechosos.folio',
                            'casos_sospechosos.apellido_paterno',
                            'casos_sospechosos.apellido_materno',
                            'casos_sospechosos.nombre',
                            'casos_sospechosos.sexo',
                            'casos_sospechosos.edad',
                            'catalogo_municipios.descripcion as municipio_nombre',
                            'catalogo_localidades.descripcion as localidad_nombre',
                            'catalogo_colonias.nombre as colonia_nombre',
                            'casos_sospechosos.updated_at')
                        ->leftJoin('catalogo_colonias', 'catalogo_colonias.id', '=', 'casos_sospechosos.colonia_id')
                        ->leftJoin('catalogo_municipios', 'catalogo_municipios.id', '=', 'casos_sospechosos.municipio_id')
                        ->leftJoin('catalogo_localidades', 'catalogo_localidades.id', '=', 'casos_sospechosos.localidad_id');
            if(isset($params['orderBy']) && trim($params['orderBy'])!= ""){
                $sortOrder = 'asc';
                if(isset($params['sortOrder'])){
                    $sortOrder = $params['sortOrder'];
                }
                if($params['orderBy'] == "municipio_nombre") {
                    $params['orderBy'] = "catalogo_municipios.descripcion";
                }

                if($params['orderBy'] == "localidad_nombre") {
                    $params['orderBy'] = "catalogo_localidades.descripcion";
                }

                if($params['orderBy'] == "colonia_nombre") {
                    $params['orderBy'] = "catalogo_colonias.nombre";
                }
    
                $items = $items->orderBy($params['orderBy'],$sortOrder);
            }  else {
                $items = $items->orderBy('casos_sospechosos.id','desc');
            }

            if(isset($params['filter']) && trim($params['filter'])!= ""){
                $items = $items->where("folio","LIKE", "%".$params['filter']."%")
                            ->orWhere(DB::raw('concat(casos_sospechosos.apellido_paterno," ",casos_sospechosos.apellido_materno," ",casos_sospechosos.nombre)'),"LIKE", "%".$params['filter']."%")
                            ->orWhere("catalogo_municipios.descripcion","LIKE", "%".$params['filter']."%")
                            ->orWhere("catalogo_localidades.descripcion","LIKE", "%".$params['filter']."%")
                            ->orWhere("catalogo_colonias.nombre","LIKE", "%".$params['filter']."%");
                            

            }

            if(!$auth_user->is_superuser){
                $lista_zonas = [];
                $lista_regiones = [];
        
                
                
                $lista_zonas = array_unique($auth_user->configuracionBrigadas->pluck('zona')->toArray());
                if(count($lista_zonas) == 1 && !$lista_zonas[0]){
                    $lista_zonas = [];
                }else{
                    $lista_regiones = array_unique($auth_user->configuracionBrigadas->pluck('region')->toArray());
                    if(count($lista_regiones) == 1 && !$lista_regiones[0]){
                        $lista_regiones = [];
                    }
                }

                $colonias = Colonia::select('id')->whereIn('zona',$lista_zonas)->whereIn('region',$lista_regiones)->get();

                $lista_colonias = [];

                foreach($colonias as $colonia) {
                    $lista_colonias[] = $colonia->id;
                }

                $items = $items->whereIn('colonia_id', $lista_colonias);
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


        $auth_user = auth()->user();
        $caso = CasoSospechoso::where("id",$id);
        if($auth_user->is_superuser){
            $caso = $caso->first();
        } else {
            
            $lista_zonas = [];
            $lista_regiones = [];
    
           
            
            $lista_zonas = array_unique($auth_user->configuracionBrigadas->pluck('zona')->toArray());
            if(count($lista_zonas) == 1 && !$lista_zonas[0]){
                $lista_zonas = [];
            }else{
                $lista_regiones = array_unique($auth_user->configuracionBrigadas->pluck('region')->toArray());
                if(count($lista_regiones) == 1 && !$lista_regiones[0]){
                    $lista_regiones = [];
                }
            }

            $colonias = Colonia::select('id')->whereIn('zona',$lista_zonas)->whereIn('region',$lista_regiones)->get();

            $lista_colonias = [];

            foreach($colonias as $colonia) {
                $lista_colonias[] = $colonia->id;
            }
            $caso = $caso->whereIn('colonia_id', $lista_colonias)->first();
        }
        
        if($caso != null) {
            return response()->json(['caso' => $caso]);
        } else {
            return response()->json(['message' => "Caso no encontrado"],404);
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
            'origen_id' => 'required',
            'tipo_paciente_id' => 'required',
            'apellido_paterno' => 'required',
            'apellido_materno' => 'required',
            'nombre' => 'required',
            'edad' => 'required|integer',
            'sexo' => 'required',
            'municipio_id' => 'required',
            'colonia_id' => 'required',
            'domicilio' => 'required',
            'fecha_identificacion' => 'date|nullable',
            'fecha_inicio_sintomas' => 'date|nullable',
            'fecha_termino_seguimiento' => 'date|nullable',
            'fecha_inicio_tratamiento' => 'date|nullable',
            'fecha_termino_tratamiento' => 'date|nullable',
            'fecha_tratamiento_anterior' => 'date|nullable',
            'contactos_sintomaticos' => 'integer',
            'contactos_asintomaticos' => 'integer',
            'numero_contactos' => 'integer',
        ];

        $messages = [
            'required' => 'required',
            'numeric' => 'numeric',
            'integer' => 'integer',
            'date' => 'date',
            'unique' => 'unique'
        ];

        $payload = $request->except(['id']);

        $validator = Validator::make($payload, $rules, $messages);

        if ($validator->fails()) {
            return  response()->json($validator->messages(), 409);
        }
        $auth_user = auth()->user();
        $payload['user_id'] = $auth_user->id;        

        $response = DB::transaction(function() use($payload){
            $last_folio = CasoSospechoso::select(DB::raw('max(folio_incremento) as folio_incremento'))->first();
            
            if($last_folio->folio_incremento == null) {
                $payload["folio"] = "000001";
                $payload["folio_incremento"] = 1;
            } else{
                $payload["folio_incremento"] =  $last_folio->folio_incremento + 1;
                $payload["folio"] = str_pad($payload["folio_incremento"], 6, "0", STR_PAD_LEFT);
            }
            $caso = CasoSospechoso::create($payload);
            return response()->json(['caso' => $caso]);
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
        $auth_user = auth()->user();
        $caso = CasoSospechoso::where("id",$id);
        if($auth_user->is_superuser){
            $caso = $caso->first();
        } else {
            
            $lista_zonas = [];
            $lista_regiones = [];
    
           
            
            $lista_zonas = array_unique($auth_user->configuracionBrigadas->pluck('zona')->toArray());
            if(count($lista_zonas) == 1 && !$lista_zonas[0]){
                $lista_zonas = [];
            }else{
                $lista_regiones = array_unique($auth_user->configuracionBrigadas->pluck('region')->toArray());
                if(count($lista_regiones) == 1 && !$lista_regiones[0]){
                    $lista_regiones = [];
                }
            }

            $colonias = Colonia::select('id')->whereIn('zona',$lista_zonas)->whereIn('region',$lista_regiones)->get();

            $lista_colonias = [];

            foreach($colonias as $colonia) {
                $lista_colonias[] = $colonia->id;
            }
            $caso = $caso->whereIn('colonia_id', $lista_colonias)->first();
        }
        if($caso != null) {
           
            $rules = [
                'origen_id' => 'required',
                'tipo_paciente_id' => 'required',
                'apellido_paterno' => 'required',
                'apellido_materno' => 'required',
                'nombre' => 'required',
                'edad' => 'required|integer',
                'sexo' => 'required',
                'municipio_id' => 'required',
                'colonia_id' => 'required',
                'domicilio' => 'required',
                'fecha_identificacion' => 'date|nullable',
                'fecha_inicio_sintomas' => 'date|nullable',
                'fecha_termino_seguimiento' => 'date|nullable',
                'fecha_inicio_tratamiento' => 'date|nullable',
                'fecha_termino_tratamiento' => 'date|nullable',
                'fecha_tratamiento_anterior' => 'date|nullable',
                'contactos_sintomaticos' => 'integer',
                'contactos_asintomaticos' => 'integer',
                'numero_contactos' => 'integer',
            ];
    
            $messages = [
                'required' => 'required',
                'numeric' => 'numeric',
                'integer' => 'integer',
                'date' => 'date',
                'unique' => 'unique'
            ];
    
            $payload = $request->except(['id']);
    
            $validator = Validator::make($payload, $rules, $messages);
    
            if ($validator->fails()) {
                return  response()->json($validator->messages(), 409);
            }
            $auth_user = auth()->user();
            $payload['user_id'] = $auth_user->id;  


            $response = DB::transaction(function() use($caso,$payload){
                
    
                $caso->update($payload);
    
                //$caso->save();
                return response()->json(['caso' => $caso]);
            });

        } else {
            return response()->json(['message' => "Caso no encontrado"],404);
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
        return response()->json(['caso' => null],200);
    }

    // Catalogos

    public function getMunicipios(Request $request ) {
        return response()->json(['municipios' => Municipio::all()]);

    }

    public function getLocalidades(Request $request ) {
        $params = $request->input();
        return response()->json(['localidades' => Localidad::where('municipio_id', $params['municipio_id'])->get()]);

    }
    public function getColonias(Request $request ) {
        $params = $request->input();
        return response()->json(['colonias' => Colonia::where('municipio_id', $params['municipio_id'])->get()]);

    }
}
