<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers;

Route::get('/', [Controllers\DomainController::class, 'index']);
Route::get('{all}', [Controllers\DomainController::class, 'index']);

