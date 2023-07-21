<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('/sites', Controllers\Resource\SiteController::class);
Route::resource('/sites/{siteId}/pages', Controllers\Resource\PageController::class);
Route::resource('/sites/{siteId}/pages/{pageId}/contents', Controllers\Resource\ContentController::class);