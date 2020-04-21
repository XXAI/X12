<?php

namespace App\Http\Controllers\API;

use App\Models\CasosCovid\TiposTransmisiones;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use DB;


class TiposTransmisionesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $tipos_transmisiones = TiposTransmisiones::all();
    
            return response()->json(['tipos_transmisiones' => $tipos_transmisiones], 200);

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
     * @param  \App\Models\CasosCovid\TiposTransmisiones  $tiposTransmisiones
     * @return \Illuminate\Http\Response
     */
    public function show(TiposTransmisiones $tiposTransmisiones)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CasosCovid\TiposTransmisiones  $tiposTransmisiones
     * @return \Illuminate\Http\Response
     */
    public function edit(TiposTransmisiones $tiposTransmisiones)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CasosCovid\TiposTransmisiones  $tiposTransmisiones
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, TiposTransmisiones $tiposTransmisiones)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CasosCovid\TiposTransmisiones  $tiposTransmisiones
     * @return \Illuminate\Http\Response
     */
    public function destroy(TiposTransmisiones $tiposTransmisiones)
    {
        //
    }
}
