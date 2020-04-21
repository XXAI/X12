<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Input;
use DB;

use App\Models\CasosCovid\Derechohabiencias;

class DerechohabienciasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $derechohabiencias = Derechohabiencias::all();
    
            return response()->json(['derechohabiencias' => $derechohabiencias], 200);

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
     * @param  \App\Models\CasosCovid\Derechohabiencias  $derechohabiencias
     * @return \Illuminate\Http\Response
     */
    public function show(Derechohabiencias $derechohabiencias)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\CasosCovid\Derechohabiencias  $derechohabiencias
     * @return \Illuminate\Http\Response
     */
    public function edit(Derechohabiencias $derechohabiencias)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\CasosCovid\Derechohabiencias  $derechohabiencias
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Derechohabiencias $derechohabiencias)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CasosCovid\Derechohabiencias  $derechohabiencias
     * @return \Illuminate\Http\Response
     */
    public function destroy(Derechohabiencias $derechohabiencias)
    {
        //
    }
}
