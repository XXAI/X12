<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use DB;

use App\Models\CasosCovid\TipoAtencion;



class TipoAtencionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $tipos_atenciones = TipoAtencion::all();
    
            return response()->json(['tipos_atenciones' => $tipos_atenciones], 200);

        } catch (\Exception $e) {
            return response()->json(['error' =>$e, 404]);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\TipoAtencion  $tipoAtencion
     * @return \Illuminate\Http\Response
     */
    public function show(TipoAtencion $tipoAtencion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\TipoAtencion  $tipoAtencion
     * @return \Illuminate\Http\Response
     */
    public function edit(TipoAtencion $tipoAtencion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\TipoAtencion  $tipoAtencion
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TipoAtencion $tipoAtencion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\TipoAtencion  $tipoAtencion
     * @return \Illuminate\Http\Response
     */
    public function destroy(TipoAtencion $tipoAtencion)
    {
        //
    }
}
