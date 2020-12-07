<?php

namespace App\Http\Controllers\API\Modulos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DB;
use App\Models\CasoSospechoso;

class CasosSospechososController extends Controller
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
                            'casos_sospechosos.updated_at',)
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
        return response()->json(['caso' => null],200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return response()->json(['caso' => null],200);
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
        return response()->json(['caso' => null],200);
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
}
