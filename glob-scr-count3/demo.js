
var browser, renderer, map, demoTexture;

function restart() {
    browser.destroy();
    console.log('browser destoyed');
    startDemo();
}

function startDemo() {

    var v1 = vts.vec3.create();
    var v2 = vts.vec3.create();
    var v1 = vts.vec3.add(v1,v2);

    var m11 = vts.mat4.create();

    var params = vts.utils.getParamsFromUrl(window.location.href);
    
    for (key in params) {

        if (key == 'mapFeatureMaxOverlays') {
            params['mapFeaturesPerSquareInch'] = params[key];
            key = 'mapFeaturesPerSquareInch';
        } 
        
        if (key == 'mapFeatureRadius') {
            params['mapFeatureGridCells'] = params[key];
            key = 'mapFeatureGridCells';
        } 

        switch(key) {
            case 'rotate':
            case 'minViewExtent':
            case 'maxViewExtent':
            case 'mapTexelSizeFit':
            case 'mapLowresBackground':               
            case 'mapMaxProcessingTime':
            case 'mapMobileDetailDegradation':
            case 'mapFeaturesPerSquareInch':
            case 'mapNavSamplesPerViewExtent':  params[key] = parseFloat(params[key]); break;
            case 'mapCache':
            case 'mapGPUCache':
            case 'mapMetatileCache':
            case 'mapMaxHiresLodLevels':
            case 'mapRefreshCycles':
            case 'mapDownloadThreads':
            case 'mapForceFrameTime':
            case 'mapForcePipeline':
            case 'mapFeatureGridCells':
            case 'rendererAnisotropic':         params[key] = parseInt(params[key], 10); break;
            case 'panAllowed':
            case 'rotationAllowed':
            case 'zoomAlowed':
            case 'controlCompass':
            case 'controlZoom':
            case 'controlMeasure':
            case 'controlScale':
            case 'controlSpace':
            case 'controlSearch':
            case 'controlLayers':
            case 'controlLink':
            case 'controlMeasure':
            case 'controlLoading':
            case 'controlFullscreen':
            case 'controlCredits':
            case 'controlSearchElement':
            case 'controlSearchValue':
            case 'constrainCamera':
            case 'mapMobileMode':
            case 'mapMobileModeAutodect': 
            case 'mapIgnoreNavtiles':
            case 'mapFog':
            case 'mapPreciseCulling':
            case 'mapAllowHires':
            case 'mapAllowLowres':
            case 'mapAllowSmartSwitching':
            case 'mapHeightLodBlend':
            case 'mapHeightNodeBlend':
            case 'mapBasicTileSequence':
            case 'mapXhrImageLoad':
            case 'mapStoreLoadStats':
            case 'mapHeightfiledWhenUnloaded':
            case 'mapVirtualSurfaces':
            case 'mapPreciseBBoxTest':
            case 'mapPreciseDistanceTest':
            case "mapGridSurrogatez":   
            case 'mapNoTextures':  
            case 'rendererAntialiasing':
            case 'rendererAllowScreenshots':    params[key] = (params[key] == 'true' || params[key] == '1'); break;
            case 'inertia':
            case 'sensitivity':
            case 'tiltConstrainThreshold':
            case 'mapFeaturesReduceParams':
            case 'pan':
                var value = decodeURIComponent(params[key]);
                value = value.split(',');
                
                for (var i = 0, li = value.length; i < li; i++) {
                    value[i] = parseFloat(value[i]);
                }
                
                params[key] = value;
                break;

            case 'pos':
                var value = decodeURIComponent(params[key]);
                value = value.split(',');
                
                for (var i = 1, li = value.length; i < li; i++) {
                    if (i != 3) {
                        value[i] = parseFloat(value[i]);
                    }
                }
                
                params[key] = value;
                break;

            case 'mapGridMode':
            case 'mapLoadMode':
            case 'mapGeodataLoadMode':
            case 'mapFeaturesReduceMode':
            case 'navigationMode':
            case 'controlSearchUrl':
            case 'controlSearchSrs':
            case 'geodata':
            case 'geojson':
            case 'geojsonStyle':
            case 'debugBBox':
            case 'debugLBox':
            case 'debugNoEarth':
            case 'debugShader':
            case 'debugHeightmap':
            case 'debugRadar':
            case 'debugGridCells':
            case 'view':
                params[key] = decodeURIComponent(params[key]);
                break;
                
            case 'useCredentials':                
                vts.utils.useCredentials = (params[key] == 'true' || params[key] == '1'); break;                    
        }
    }
   
    
// klasifikace
// https://www.test.mlwn.se/cloud/link/fjYhih6p8OEkuzacUUYr?pos=obj,13.783927,49.258710,fix,536.31,11.09,-90.00,0.00,554422.89,45.00

// https://trac.citationtech.net/wiki/vts/LandcoversProceduralRender
        
//global-landcover-30 : "//cdn.test.mlwn.se/mario/proxy/melown2015/tms/melown/global-landcover-30/boundlayer.json"


//        params['map'] = 'http://pomerol.internal:8889/david/sternberk3/map/mapConfig.json';
//        params['map'] = 'http://pomerol.internal:8889/david/grand-ev/mapConfig.json';
//        params['map'] = 'http://pomerol:8889/lada/grand-melown2015/storage/world/mapConfig.json';
//        params['map'] = 'http://pomerol.internal:8889/vasek-output/krivoklat.m2015/mapConfig.json';
//        params['map'] = 'http://pomerol.internal:8889/vasek-output/ev.wm/mapConfig.json';
//        params['map'] = 'http://pomerol.internal:8889/vasek-output/j8.pp/mapConfig.json';
        //params['map'] = 'http://pomerol.internal:8889/david/j8.pp/mapConfig.json'; //glues
//        params['map'] = 'http://pomerol.internal:8889/david/j8.pp.flat/mapConfig.json';
        //params['pos'] = ['obj',472201.55368501646,5555820.48565412,'float',0.00,-204.25,-57.24,0.00,413.38,90.00]; //for j8.pp
        //params['pos'] = ['obj',471833.8692580385,5555461.067889656,'float',0.00,-195.72,-90.00,0.00,99.89,90.00];

//        params['map'] = 'http://pomerol:8889/vasek-output/blue-marble-4-9/mapConfig.json';
        
        //params['mapIgnoreNavtiles'] = true;

//        params['map'] = 'http://pomerol.internal:8889/david/bmu-seamless/mapConfig.json'; //planet sphere
//        params['map'] = 'http://pomerol.internal:8889/david/bmp-seamless/mapConfig.json'; //plane flat
//        params['map'] = 'http://pomerol:8888/storage/buffer/vts-grand/grand-complete/mapConfig.json' //grand for planet
//        params['map'] = 'http://pomerol:8888/buffer/vts-grand/storage/mapConfig.json'; //planet sphere + grand
//        params['map'] = 'http://pomerol:8889/lada/seznam-vts-prezentace/fe-storage/mapConfig.json'; //lada bug in named views
//        params['map'] = 'http://pomerol:8889/lada/seznam-vts-prezentace/viewfinder-europe/test-alps-3/mapConfig.json'; //lada bug lox,locy,loclod
          //params['map'] = 'http://pomerol:8889/lada/vts/storage-aggregated/mapConfig.json'; //planet meta bound layers demo
          //params['map'] = 'https://demo.iris-test.citationtech.net/maps/bl-demo/mapConfig.json'; //final bl planet demo
         //vts['useCredentials'] = true; 
         //params['map'] = 'https://demo.iris-test.citationtech.net/bound-layers-demo/map/mapConfig.json'; //final bl planet demo
         //params['map'] = 'https://demo.iris-test.citationtech.net/bound-layers-demo/map-szn/mapConfig.json'; //final bl planet demo
        //params['pos'] = ['obj',14.310856,50.741695,'float',0.00,-95.10,-57.26,0.00,178.09,90.00];

         vts['useCredentials'] = false; 
        //params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/melown/benatky-nad-jizerou/mapConfig.json';
//         params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/David-01/mapConfig.json';
//         params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/mercury-provisional/map-config/melown/mercury-messenger/mapConfig.json';        
//        params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/Name-your-Map-Configuration/mapConfig.json';
//         params['map'] = 'http://pomerol.internal:8870/mp/webmerc-projected/surface/melown/wgs84/mapConfig.json';
         params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/ctt-test/David-Map/mapConfig.json';

//         params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/Bentky-nad-Jizerou/mapConfig.json';

         //params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/melown/COol1/mapConfig.json';

         params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/David-01/mapConfig.json';
         //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/David-HTTP2-Test/mapConfig.json';

         //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/cowi/Tokyo/mapConfig.json';
        //params['map'] = 'https://david.iris-test.citationtech.net/maps/bmp-seamless/mapConfig.json'; //planet flat

         //params['map'] = 'http://pomerol:8889/jakub/output/mapConfig.json';
         //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/Bentky-nad-Jizerou/mapConfig.json';
         //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/cowi/Tokyo/mapConfig.json';

         //params['map'] = 'http://pomerol.internal:8870/mp/melown2015/surface/melown/viewfinder/mapConfig.json';
         //params['map'] = 'http://melown.mapy.sbeta.cz/3d/view/mapConfig.json?ts=157d1ca9dbe';  //old
         //params['map'] = 'http://melown.mapy.sbeta.cz/3d/scenes/cities/mapConfig.json';  

         //params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/ctt-test/David-Map/mapConfig.json';
         //params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/ctt-test/asdasd/mapConfig.json';

         //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/Melown-Earth/mapConfig.json';

//         params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/David-Viewfinder/mapConfig.json';

         //vts['useCredentials'] = true; 
         //params['map'] = 'https://david.iris-test.citationtech.net/maps/bmu-seamless/mapConfig.json';
        //params['map'] = 'http://pomerol.internal:8889/david/j8.pp.flat/mapConfig.json';
        //params['pos'] = ['obj',472201.55368501646,5555820.48565412,'float',0.00,-204.25,-57.24,0.00,413.38,90.00]; //for j8.pp
         

//       vts['useCredentials'] = false; 
//        params['map'] = 'http://pomerol:8888/buffer/tilesets/vts/ppspace/ev2/013-003/mapConfig.json'; // referencd test to pre vts browser
//         params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/3dgang/Modany/mapConfig.json'; 

         //params['map'] = 'http://pomerol.internal:8870/j9.pp/mapConfig.json'; //final bl planet demo
         //params['map'] = 'http://pomerol.internal:8870/ev1.reference/mapConfig.json'; //final bl planet demo            

         //params['map'] = 'http://condrieu:8888/bl-demo/bl-demo/stage/mapConfig.json'; //final bl planet demo
        
         //params['map'] = 'http://pomerol.internal:8870/jenstejn.aliens/mapConfig.json'; //alien demo
         
         //params['map'] = 'http://pomerol.internal:8970/viewfinder-remote/mapConfig.json'; //ondra bug report
         //params['map'] = 'http://pomerol:4070/melown2015/surface/melown/viewfinder/mapConfig.json'; //ondra bug report

         //params['map'] = 'http://pomerol.internal:8870/j8.pp/tilesets/jenstejn-hf/mapConfig.json'; //vasek bug report
         
        //params['map'] = 'http://pomerol:8888/output/uav6.2015-04-29-krivoklat/targets/uav6.2015-04-29-krivoklat.000/target/webexport-manual-fixes-vts/mapConfig.json'; //test texel size hack
        //vts['useCredentials'] = true; params['map'] = 'http://pomerol:8888/output/vadstena.2015-08-21-grabstejn/targets/vadstena.2015-08-21-grabstejn.000/target/webexport-vts/mapConfig.json'; //test texel size hack
        
        //params['map'] = 'http://pomerol.internal:8870/mp/webmerc-projected/surface/melown/matterhorn-srtm/mapConfig.json'; //vasek bug in buildSubmeshes sometime
        
//        params['map'] = 'http://pomerol.internal:8889/vasek-output/j8.pp/tilesets/jenstejn/mapConfig.json';
//        params['map'] = 'http://pomerol:8889/lada/vts/storage-aggregated/glues/eur-aggregated_alps/mapConfig.json';
        //http://pomerol:8889/lada/vts/storage-aggregated/tilesets/extended-europe/
//        params['map'] = 'http://pomerol.internal:8870/melown2015/surface/melown/wgs84/mapConfig.json';

        //params['map'] = 'http://pomerol.internal:8870/13.test/mapConfig.json'; 
        //params['map'] = 'http://pomerol.internal:8870/mp/melown2015/geodata/mapzen/test/mapConfig.json'; //vasek free layers demo

        //params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/ctt-test/David-Map/mapConfig.json';
        //params['authorization'] = 'https://cdn.iris-test.citationtech.net/mario/auth/w3NQiTb2ESftpne5Wffv';

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/David-01/mapConfig.json';
        //params['authorization'] = 'https://cdn.melown.com/mario/auth/MtsW4sQmJcDCldiBfv1G';
        
        //params['map'] = 'https://cdn.iris-test.citationtech.net/mario/store/melown2015/map-config/melown/pcr/mapConfig.json';

//        params['map'] = 'http://pomerol:8888/buffer/tilesets/vts/ppspace/ev2/013-003/mapConfig.json'; //ppspace
        
//        params['map'] = 'http://melown.mapy.sbeta.cz/3d/scenes/world_bing_cities/mapConfig.json';
//        params['map'] = '/3d/scenes/world_bing_cities/mapConfig.json';

//        params['map'] = 'http://melown.mapy.sbeta.cz/3d/scenes/all/mapConfig.json?ts=158441dcc58';  //seznam.cz

//        params['map'] = 'http://pomerol.internal:8871/storage/vasek-output/ng.agg/mapConfig.json';

        //params['map'] = 'http://pomerol.internal:8889/vasek-output/j8.pp/mapConfig.json'; //demo virtual surface

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/policie-cr/Ukzka-zobrazen-vektorovch-dat/mapConfig.json';  //demo policie

//        params['map'] = 'http://melown.mapy.sbeta.cz/3d/scenes/world_cities_staticEV1/mapConfig.json';  //seznam.cz with virtual surface
//        params['map'] = 'http://3d.mapy.sbeta.cz/scenes/world_cities_staticEV1/mapConfig.json';
//        params['map'] = 'http://pomerol.internal:3070/melown2015/surface/melown/viewfinder3/mapConfig.json';
  
        //params['map'] = 'https://cdn.melown.com/maps/map/melown/mercury/mapConfig.json';  //mercury
        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/melown/lada-test/mapConfig.json';  //special small bound layer

        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/info_citationtech-net/ned19-colorado/mapConfig.json'; //custum dem test
        
        //params['map'] = 'http://pomerol:8889/lada/plain/test2.json';
        params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/jarmil-vycital_melown-com/Brands-n-Labem/mapConfig.json';
        
        
        //params['map'] = 'https://3d-mapy.sbeta.cz/scenes/world_cities_staticEV1/mapConfig.json';
        
        params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/tomas-slavkovsky_melown-com/Mapa-Afriky/mapConfig.json';

        params['map'] = 'http://pomerol:8870/v4/jenstejn/mapConfig.json';
        params['map'] = 'https://cdn.melown.com/maps/map/melown/mercury/mapConfig.json';  //mercury
        //params['map'] = 'http://pomerol:8870/v4/jenstejn2015/mapConfig.json';
        //params['map'] = 'http://pomerol.internal:8870/Chrudim/mapConfig.json';
        params['map'] = 'https://cdn.melown.com/mario/store/melown2015/stage/vs/melown-viewfinder-world_melown-viewfinder-1-arc-sec_melown-cz10_melown-cities-cz_melown-landmarks_airphrame-treasure-island_obec-tetin-obec-tetin_visionmap-jerusalem_melown-benatky-nad-jizerou_melown-imst_melown-cesky-krumlov@2/mapConfig.json';
        params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/ctt-test/Intergeo-Test-David/mapConfig.json'; 

        //params['map'] = 'https://3d-mapy.sbeta.cz/scenes/world_cities_staticEV1/mapConfig.json';
        params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/Test109/mapConfig.json';
        params['map'] = 'https://3d-mapy.sbeta.cz/scenes/world_cities_staticEV1/mapConfig.json';

        //params['map'] = 'http://pomerol:8870/v4/j.pp/mapConfig.json'; //metatiles v4 pp-space
        params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/ctt-test/undefined1/mapConfig.json'; //metatiles v4

        //params['map'] = 'http://pomerol:8889/vasek-output/jenstejn.earth-qsc/mapConfig.json'; //QSC projection

        //params['map'] = 'http://pomerol:8870/jtest/jenstejn.vef.earth-qsc/mapConfig.json';

        //params['map'] = 'http://pomerol:8870/jenstejn.earth-qsc/mapConfig.json';     
        //params['map'] = 'http://pomerol:8870/mp/earth-qsc/surface/melown/viewfinder/mapConfig.json';

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/stage/vs/melown-viewfinder-world_melown-viewfinder-1-arc-sec_melown-cz10_melown-cities-cz_melown-landmarks_airphrame-treasure-island_obec-tetin-obec-tetin_visionmap-jerusalem_melown-benatky-nad-jizerou_melown-imst_melown-cesky-krumlov@2/mapConfig.json';

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/ctt-test/undefined45/mapConfig.json';
        //params['map'] = 'http://pomerol:8870/j8.pp/mapConfig.json';

        //params['map'] = 'https://mapserver-3d.mapy.cz/scenes/current/mapConfig.json';

/*
        params['map'] = 'http://altair.mlwn.se:8070/mapproxy/melown2015/surface/examples/srtm1-n47-e013/mapConfig.json'; //ondra bug
        params['map'] = 'http://pomerol:8889/jakub/vadstena.decin.fusion.4/mapConfig.json';
        params['map'] = 'http://altair.mlwn.se:8070/mapproxy/mars-qsc/geodata/mars-case-study/iau-mars-nomenclature2/mapConfig.json';
*/

        params['map'] = 'http://meyrin.internal:8080/store/melown2015/views/vektory/mapConfig.json';

        //params['map'] = 'http://cdn.test.mlwn.se/mario/proxy//mars-qsc/surface/.system/surface-spheroid/mapConfig.json'; //mars ondra
        //params['map'] = 'http://pomerol:8870/mp/melown2015/surface/melown/dem/mapConfig.json'; //vasek chybne boundlayer dlazdice

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/meu-chrudim/Demo-msto-Chrudim/mapConfig.json';
        //params['pos'] = [ 'obj', -122.183059, 41.405764, 'fix', 3476.52, -179.63, 1.32, 0.00, 6741.06, 55.00 ];

        //params['map'] = 'https://mapserver-3d.mapy.cz/scenes/current/mapConfig.json';
        //params['map'] = 'https://mapserver-3d.mapy.cz/scenes/viewfinder_texts/mapConfig.json';
        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/Intergeo-Melown-Earth/mapConfig.json';
        params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/Melown-Earth-Intergeo-2017/mapConfig.json';

        //params['map'] = 'http://altair.mlwn.se/mapproxy/mars-qsc/geodata/mars-case-study/iau-mars-nomenclature2/mapConfig.json';
        //params['map'] = 'http://altair.mlwn.se:8070/mapproxy/mars-qsc/geodata/mars-case-study/iau-mars-nomenclature2/mapConfig.json';

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/VTS-Tutorial-Map-3/mapConfig.json';
        //params['pos'] = [ 'obj', 14.826494839713265, 50.29312224877758, 'float', 0.00, 218.81, -24.64, 0.00, 325.29, 55.00 ];

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/e-knight_hotmail-com/Strawberry-grayscale/mapConfig.json';

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/e-knight_hotmail-com/Strawberry-grayscale-_-working-_-/mapConfig.json';
        //params['pos'] = [ 'obj', 128.275854,27.063939, 'fix',-24362.32,-31.70,-90.00,310.56,5909296.11,55.00 ];

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/airquebec_gmail-com/Perrot/mapConfig.json';
        
        //stange hight extetns in metatiles for egm96 surface - Vasek have to fix it
        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/adam-papousek_melown-com/skyf/mapConfig.json';

        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/airphrame/test-solar-time/mapConfig.json'; //tomas debug diapearing tiles
        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/ctt-test/test-novych-tileranges/mapConfig.json'; //ttest new bound layer order

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/nafotoisrael-gmail-com/Mavo_Dotan/mapConfig.json'; // empty credits test

        //params['map'] = 'http://pomerol:8870/mp/melown2015/geodata/samples/tilehosting.com/mapConfig.json'; // new geodata from vasek
        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/ctt-test/Open-Street-Map--Tilehosting-/mapConfig.json';
        params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/Melown-Earth-Intergeo-2017/mapConfig.json';

        //params['map'] = 'http://jetstream.signell.us:8070/mapproxy/melown2015/surface/sandwich/sandwich_dem_resampling/mapConfig.json';



        //ONDRA
        //params['map'] = 'http://rigel.mlwn.se/mapproxy/melown2015/geodata/topoearth/peaklist-org-ultras/mapConfig.json';
        //params['map'] = 'http://rigel.mlwn.se/mapproxy/earth-qsc/geodata/topoearth/peaklist-org-ultras/mapConfig.json'';
        //params['map'] = 'http://rigel.mlwn.se/mapproxy/melown2015/geodata/topoearth/peaklist-org-ultras-melown2015-tiled/mapConfig.json';
        //params['map'] = 'http://rigel.mlwn.se/mapproxy/earth-qsc/geodata/topoearth/peaklist-org-ultras-earth-qsc-tiled/mapConfig.json';

        //params['map'] = 'http://rigel.mlwn.se/mapproxy/melown2015/geodata/topoearth/peaklist-org-ultras-melown2015-tiled/mapConfig.json';
        //params['map'] = 'https://rigel.mlwn.se/mapproxy/melown2015/geodata/topoearth/peaklist-org-ultras-melown2015-tiled/mapConfig.json';

        params['map'] = 'https://rigel.mlwn.se/store/map-config/high-terrain/mapConfig.json';

        //params['map'] = 'https://cdn.test.mlwn.se/mario/store/melown2015/map-config/ctt-test/bodytest/mapConfig.json';
        //params['map'] = 'http://altair.mlwn.se/mapproxy/mars-qsc/geodata/mars-case-study/iau-mars-nomenclature2/mapConfig.json';

        //params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/St--Louis-Sample--Geomni-/mapConfig.json';

        //params['mapForceMetatileV3'] =  true;

        /*
        params['controlSearch'] = true;
        params['controlSearchElement'] = 'some-div';
        params['controlSearchValue'] = '22brno22';
        */

        //params['map'] = 'https://3d-mapy.sbeta.cz/scenes/current/mapConfig.json';
        //params['pos'] = ['obj',-1.8468458,37.5381157,'float',0.00,29.65,-90.00,0.00,14315.00,55.00];
        //params['pos'] = ['obj',15.542979204287347,50.74107333926054,'float',0.00,2.60,-72.75,0.00,2773.68,55.00]; // lod ve svahu

        //params['map'] = 'http://meyrin.internal:8080/store/melown2015/views/test/mapConfig.json';
        //params['map'] = 'http://meyrin.internal:8080/store/melown2015/views/test/mapConfig.json';
        //params['map'] = 'https://mapserver-3d.mapy.cz/scenes/viewfinder/mapConfig.json';

        //params['rendererAllowScreenshots'] = true;
        
        //params['pos'] = ['obj',35.230410,31.777802,'fix',790.30,349.58,-58.23,0.00,90.00,55.00];
        
        /*
        params['view'] =  {
            'surfaces' : 
            {

                'melown-viewfinder-world' : [ 'bing-world', 'bmng08-world', 'mapycz-ophoto-cz' ]
            },
        
            'freeLayers': {}
        };*/

/*
    params['view'] =    
{
  'surfaces': {
    'melown-viewfinder-world': [
      'bing-world',
      'bmng08-world',
      'mapycz-ophoto-cz'
    ],
    'melown-viewfinder-1-arc-sec': [
      'bing-world',
      'bmng08-world',
      'mapycz-ophoto-cz'
    ],
    'melown-cz10': [
      'bing-world',
      'bmng08-world',
      'mapycz-ophoto-cz'
    ],
    'melown-cities-cz': [],
    'melown-landmarks': [],
    'airphrame-treasure-island': [],
    'obec-tetin-obec-tetin': [],
    'visionmap-jerusalem': [],
    'melown-benatky-nad-jizerou': [],
    'melown-imst': [],
    'melown-cesky-krumlov@2': []
  },
  'freeLayers': {}
}; */

    //params['controlLink'] = true;
    params['positionInUrl'] = true;
    params['jumpAllowed'] = true;
    //params['rotate'] = 10;
    
    params['inspector'] = true;

//    params['mapDefaultFont'] = '../demos/fonts/full-plain/basic.fnt';
    //params['mapDefaultFont'] = '../demos/fonts/full-notibet/basic.fnt';
    params['mapDefaultFont'] = 'https://cdn.melown.com/libs/vtsjs/fonts/noto-basic/1.0.0/noto.fnt';
//    params['mapDefaultFont'] = '../demos/fonts/noto-cjk/noto.fnt';

    //params['mapFog'] = false;

    /*
                params['mapLoadMode'] =  'fit';
                params['mapPreciseBBoxTest'] =  true;
                params['mapPreciseDistanceTest'] =  true;
                params['mapVirtualSurfaces'] =  true;
                params['mapTexelSizeFit'] =  1.1;
                params['mapTexelSizeTolerance'] =  2.2;
                params['mapHeightfiledWhenUnloaded'] =  true; // mrizka
      */   
    
    //params['authorization'] = 'https://cdn.iris-test.citationtech.net/mario/auth/w3NQiTb2ESftpne5Wffv';


    //use this !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //http://localhost:9000/debug/index-merge.html?pos=obj,14.450840,50.068462,fix,250.89,-37.17,-38.66,0.00,305.58,55.00&mapLoadMode=fit&mapGridMode=linear&mapGridSurrogatez=0    

    browser = vts.browser('melown-demo', params);

    browser.on('map-mapconfig-loaded', (function(data){

       data['view'] = 
            {
              "surfaces": {
                "terrain-viewfinder3": [
                  "eox-it-sentinel2-cloudless"
                ]
              },
              "freeLayers": {

                "osm-maptiler": {
                  "style": {
                          "constants": {
                            "@main-font": ["noto-mix","noto-cjk"],
                            "@feet": {"round":{"mul":[3.2808399,{"str2num":"$ele"}]}},
                            "@name-solver": {"if":[["has","$name"],{"if":[["any",["!has","$name:en"],["==",{"has-latin":"$name"},true]],"{$name}","{$name}\n{$name:en}"]},""]},
                            "@ele-solver": {"if":[["==","#metric",true],"{{'round': {'str2num':'$ele'}}} m","{@feet} ft"]},
                            "@peak-name": {"if":[["has","$ele"],"{@name-solver}\n({@ele-solver})","({@name-solver})"]},
                            "@peak-name-3": {"if":[["has","$ele"],"{@name-solver}\n {@ele-solver} {@prominence-name} r{@peak-rank}","{@name-solver} {@prominence-name} r{@peak-rank}"]},
                            "@peak-name-2": "{@name-solver}\n {@prominence}}",
                            //"@prominence": {"add":[{"if":[["has","$ele"],{"mul":[-0.0001,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[-0.3048,{"str2num":"$prominence"}]},0]}]},
                            //"@prominence": {"add":[{"if":[["has","$ele"],{"mul":[0.5,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"add":[5000, {"mul":[0.1524,{"str2num":"$prominence"}]}]},0]}]},
                            //"@prominence": {"sub":[10000,{"add":[{"if":[["has","$ele"],{"mul":[0.5,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"add":[5000, {"mul":[0.1524,{"str2num":"$prominence"}]}]},0]}]}]},

                            //"@prominence": {"add":[{"if":[["has","$ele"],{"mul":[0.5,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"add":[5000, {"mul":[0.1524,{"str2num":"$prominence"}]}]},0]}]},

                            "@prominence": {"add":[{"if":[["has","$ele"],{"mul":[0.0001,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[0.1524,{"str2num":"$prominence"}]},0]}]},

                            //"@prominence": {"add":[{"if":[["has","$ele"],{"mul":[0.0001,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[0.1524,{"str2num":"$prominence"}]},0]}]},

                            //"@prominence": {"div": [{"log":"@prominence-linear"}, {"log":1.0017}] },
                            //"@prominence": {"log":"@prominence-linear"},

                            "@prominence-name": {"round":"@prominence"},
                            "@osmid": {"if":[["has","$osm_id"],"$osm_id",""]},
                            "@id-solver": "{@osmid} {@ele-solver} {@name-solver}",
                            //"@peak-rank": {"discrete2":["@prominence",[[-1501,0],[-1499,1],[-751,1],[-749,2],[-326,2],[-324,3],[-164,3],[-162,4],[-2,4],[-1,5]]]},

                            "@peak-rank": {"discrete2":[{"mul": ["@prominence", 2]}, [[1,5],[2,4],[162,4],[164,3],[324,3],[326,2],[749,2],[751,1],[1499,1],[1501,0]]]},

                            "@peak-name2": {"if":[["==","@peak-rank",0],{"uppercase":"@peak-name"},"@peak-name"]}

                            //"@peak-name2": "@peak-name-2"

                          },
                          "fonts": {
                            "noto-mix": "//cdn.melown.com/libs/vtsjs/fonts/noto-extended/1.0.0/noto.fnt",
                            "noto-cjk": "//cdn.melown.com/libs/vtsjs/fonts/noto-cjk/1.0.0/noto.fnt",
                            "#default": "https://cdn.melown.com/libs/vtsjs/fonts/noto-basic/1.0.0/noto.fnt"

                          },
                          "layers": {
                            "country-boundaries": {
                              "filter": ["all",["==","#group","boundary"],["==","$admin_level","2"],["!=","$maritime","1"]],
                              "line": true,
                              "line-flat": false,
                              "line-width": 4,
                              "line-color": [255,255,255,128],
                              "zbuffer-offset": [-0.01,0,0]
                            },
                            "state-boundaries": {
                              "filter": ["all",["==","#group","boundary"],["==","$admin_level","4"],["!=","$maritime","1"]],
                              "line": true,
                              "line-flat": false,
                              "line-width": 4,
                              "line-color": [255,255,255,64],
                              "zbuffer-offset": [-0.01,0,0]
                            },
                            "peaks": {
                              "filter": ["all",["==","#group","mountain_peak"]],
                              "visible": {"if":[["!=","@name-solver",""],true,false]},
    
                              //"reduce": ["bottom",100,"@prominence"],
                              //"dynamic-reduce": ["scr-count4","@prominence"],
                              "importance-source": "@prominence",

                              "label": true,
                              "label-color": {"linear2":["@peak-rank",[[1,[255,233,0,255]],[5,[230,230,230,255]]]]},
                              "label-stick": {"linear2":["@peak-rank",[[1,[70,5,2,255,233,0,128]],[5,[70,5,2,230,230,230,128]]]]},
                              "label-size": {"discrete2":["@peak-rank",[[0,19],[1,18],[2,17],[3,16],[4,15],[5,14]]]},
                              "label-source": "@peak-name2",
                              "label-font": "@main-font",
                              "label-no-overlap": true,
                              "label-no-overlap-factor": ["div-by-dist","@prominence"],
                              "zbuffer-offset": [-0.25,0,0],
                              "culling": 94,
                              "hysteresis": [1500,1500,"@id-solver",true]
                            }
                          }
                        }


                  //"//rigel.mlwn.se/store/stylesheet/osm-maptiler.style?13"
                }

                ,

                "peaklist-org-ultras": {
                  "style": {
                      "constants": {
                        "@name-solver": {"uppercase":{"if":[["has","$name"],"$name","$Name"]}},
                        "@ele": {"if":[["has","$elevation"],"$elevation","$Elevation"]},
                        "@feet": {"round":{"mul":[3.2808399,{"str2num":"@ele"}]}},
                        "@ele-solver": {"if":[["==","#metric",true],"{{'round': {'str2num':'@ele'}}} m","{@feet} ft"]},
                        "@id-solver": "{@ele-solver} {@name-solver}",
                        "@prom-solver": {"mul":[1,{"str2num":{"if":[["has","$prom"],"$prom","$Prom"]}}]},
                      },
                      "layers": {
                        "peak-labels": {

                          //"dynamic-reduce": ["scr-count4","@prom-solver"],
                          "importance-source": "@prom-solver",

                          "label": true,
                          "label-source": "{@name-solver}\n{@ele-solver}",
                          //"label-source": "@peak-name2",
                          "label-no-overlap": true,
                          "label-no-overlap-factor": ["div-by-dist","@prom-solver"],
                          "label-size": 19,
                          "label-stick": [70,5,2,255,233,0,128],
                          "label-color": [255,233,0,255],
                          "zbuffer-offset": [-1,0,0],
                          "culling": 92,
                          "hysteresis": [1500,1500,"@id-solver",true]
                        }
                      }
                    }
                }

              }
            };

        
        if (params['mapForcePipeline'] != 2) {
            return;
        }

        data.boundLayers['global-landcover-30'] = 
            {
                "credits" : 
                {
                    "ngcc" : 
                    {
                        "id" : 160,
                        "notice" : "{copy}[http://ngcc.sbsm.gov.cn/article/en/ NGCC]"
                    },
                    "usgs" : 
                    {
                        "id" : 2,
                        "notice" : "USGS/NASA"
                    }
                },
                "lodRange" : [ 0, 13 ],
                "maskUrl" : "//cdn.test.mlwn.se/mario/proxy/melown2015/tms/melown/global-landcover-30/{lod}-{x}-{y}.mask",
                "metaUrl" : "//cdn.test.mlwn.se/mario/proxy/melown2015/tms/melown/global-landcover-30/{lod}-{x}-{y}.meta?gr=2",
                "tileRange" : 
                [
                    [ 0, 0 ],
                    [ 0, 0 ]
                ],
                "type" : "raster",
                "dataType" : "classification",
                "url" : "//cdn.test.mlwn.se/mario/proxy/melown2015/tms/melown/global-landcover-30/{lod}-{x}-{y}.png"
            };

        //"//cdn.test.mlwn.se/mario/proxy/melown2015/tms/melown/global-landcover-30/boundlayer.json";


        data['view'] =
            {
              "surfaces": {
                "melown-viewfinder-world": [
                  "global-landcover-30"
                ],
                "st-louis-downtown@1": []
              },
              "freeLayers": {
                "osm-tilehosting-v1": {}
              }
            };

/*
    data.freeLayers['osm-tilehosting-v1'] = {
        "credits" : {
            "klokantech" : {
                "id" : 1002,
                "notice" : "[http://www.openmaptiles.org/ {copy} OpenMapTiles]"
            },
            "osm" : {
                "id" : 3,
                "notice" : "[https://www.openstreetmap.org/about/ {copy} OpenStreetMap contributors]"
            }
        },
        "geodataUrl" : "https://cdn.test.mlwn.se/mario/proxy/melown2015/geodata/melown/osm-tilehosting-3/{lod}-{x}-{y}.geo?gr=0&r=8&viewspec={viewspec}",
        "lodRange" : [ 1, 21 ],
        "metaUrl" : "https://cdn.test.mlwn.se/mario/proxy/melown2015/geodata/melown/osm-tilehosting-3/{lod}-{x}-{y}.meta?gr=0-4&r=8",
        "tileRange" : [ [ 0, 0 ], [ 0, 0 ] ],
        "type" : "geodata-tiles"
    };
    
    data.freeLayers['osm-tilehosting-v1']['style'] =
{
  "constants": {
    "@main-font": ["noto-mix","noto-cjk"],
    "@name-solver": {"if":[["has","$name"],{"if":[["any",["!has","$name:en"],["==",{"has-latin":"$name"},true]],"{$name}","{$name}\n{$name:en}"]},""]},
    "@prominence-solver": {"add":[{"if":[["has","$ele"],{"add":[500,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[10000,{"str2num":"$prominence"}]},0]}]},
    "@nonpeak-overlap-factor": ["div-by-dist", 10000000],
    "@peak-overlap-factor": ["div-by-dist", "@prominence-solver"],
    "@feets": {"round":{"mul":[3.2808399,{"str2num":"$ele"}]}},
    "@ele-solver": {"if":[["==","#metric",true],"{{'round': {'str2num':'$ele'}}} m","{@feets} ft"]},
    "@peak-name": {"if":[["has","$ele"],"{@name-solver}\n {@ele-solver}","{@name-solver}"]}
  },
  "fonts": {
    "noto-mix": "//cdn.melown.com/libs/vtsjs/fonts/noto-extended/1.0.0/noto.fnt",
    "noto-cjk": "//cdn.melown.com/libs/vtsjs/fonts/noto-cjk/1.0.0/noto.fnt",
    "#default": "https://cdn.melown.com/libs/vtsjs/fonts/noto-basic/1.0.0/noto.fnt"

  },
  "layers": {
    "country-boundaries": {
      "filter": ["all",["==","#group","boundary"],["==","$admin_level","2"],["!=","$maritime","1"]],
      "line": true,
      "line-flat": false,
      "line-width": 4,
      "line-color": [255,255,0,200],
      "zbuffer-offset": [-0.01,0,0]
    },
    "state-boundaries": {
      "filter": ["all",["==","#group","boundary"],["==","$admin_level","4"],["!=","$maritime","1"]],
      "line": true,
      "line-flat": false,
      "line-width": 4,
      "line-color": [255,255,0,80],
      "zbuffer-offset": [-0.01,0,0]
    },

/*    
    "country-labels": {
      "filter": ["all",["==","#group","place"],["==","$class","country"]],
      "visible": {"discrete":[[3,false],[4,true],[7,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "culling": 90,
      "zbuffer-offset": [-0.15,0,0],
      "z-index": 1
    },
    "state-labels": {
      "filter": ["all",["==","#group","place"],["==","$class","state"]],
      "visible": {"discrete":[[5,false],[6,true],[8,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-0.15,0,0],
      "z-index": 1,
      "culling": 90,
      "visibility": 2200000
    },
    "city-labels": {
      "filter": ["all",["==","#group","place"],["==","$class","city"],["any",["has","$capital"],["<=","$rank",3]]],
      "visible": {"discrete":[[5,false],[6,true],[16,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-0.15,0,0],
      "z-index": 1,
      "culling": 90,
      "visibility": 1600000
    },
    "city-labels2": {
      "filter": ["all",["==","#group","place"],["==","$class","city"]],
      "visible": {"discrete":[[6,false],[7,true],[16,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-0.15,0,0],
      "z-index": 1,
      "visibility": 150000
    },
    "town-labels": {
      "filter": ["all",["==","#group","place"],["==","$class","town"],["<=","$rank",12]],
      "visible": {"discrete":[[7,false],[8,true],[16,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-0.15,0,0],
      "z-index": 1,
      "visibility": 80000
    },
    "town-labels2": {
      "filter": ["all",["==","#group","place"],["==","$class","town"],["<=","$rank",20]],
      "visible": {"discrete":[[9,false],[11,true],[16,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-0.5,0,0],
      "z-index": 1,
      "visibility": 40000
    },
    "town-labels3": {
      "filter": ["all",["==","#group","place"],["==","$class","village"]],
      "visible": {"discrete":[[9,false],[11,true],[16,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-0.5,0,0],
      "z-index": 1,
      "visibility": 10000
    },
    "suburb-labels": {
      "filter": ["all",["==","#group","place"],["==","$class","suburb"]],
      "visible": {"discrete":[[9,false],[11,true],[16,false]]},
      "label": true,
      "label-size": 19,
      "label-font": "@main-font",
      "label-source": "@name-solver",
      "label-no-overlap": true,
      //"label-no-overlap-factor": "@nonpeak-overlap-factor",
      "zbuffer-offset": [-1,0,0],
      "z-index": 1,
      "visibility": 10000
    },
    "roads": {
      "filter": ["all",["==","#group","transportation"],["in","$class","secondary","tertiary","unclassified","minor","service","unclassified","residential"]],
      "visible": {"discrete":[[15,false],[16,true]]},
      "line": true,
      "line-flat": true,
      "line-width": {"lod-scaled":[14,10,1]},
      "line-color": [255,255,255,120],
      "zbuffer-offset": [-10,-50,-50]
    },
    "highways": {
      "filter": ["all",["==","#group","transportation"],["==","$class","highway"]],
      "visible": false,
      "line": false,
      "line-flat": true,
      "line-width": {"lod-scaled":[12,40,1]},
      "line-color": [255,255,255,130],
      "zbuffer-offset": [-10,-50,-50]
    },
    "roads-major-label": {
      "filter": ["all",["==","#group","transportation_name"],["==","$class","primary"],["==","$class","trunk"]],
      "visible": {"discrete":[[15,false],[16,true]]},
      "line-label": true,
      "line-label-font": "@main-font",
      "line-label-size": {"discrete":[[16,9],[17,6],[18,3.5],[19,2],[20,1.5],[21,1]]},
      "line-label-color": [255,255,255,255],
      "label-font": "@main-font",
      "zbuffer-offset": [-10,-50,-50]
    },
    "roads-minor-label": {
      "filter": ["all",["==","#group","transportation_name"],["in","$class","secondary","tertiary","unclassified","minor","service","unclassified","residential","path"]],
      "visible": {"discrete":[[15,false],[16,true]]},
      "line-label": true,
      "line-label-font": "@main-font",
      "line-label-size": {"discrete":[[16,9],[17,6],[18,3.5],[19,2],[20,1.5],[21,1]]},
      "line-label-color": [255,255,255,255],
      "label-font": "@main-font",
      "zbuffer-offset": [-10,-50,-50]
    },*//*
    "peaks": {
      "filter": ["all",["==","#group","mountain_peak"]],
      "reduce": ["top",100,"@prominence-solver"],
      "dynamic-reduce": ["scr-count2",1,50],
      "label": true,
      "label-color": [255,255,255,255],
      "label-stick": [70,5,2,255,255,255,128],
      "label-size": 19,
      "label-source": "@peak-name",
      "label-font": "@main-font",
      "label-no-overlap": true,
      "label-no-overlap-factor": "@peak-overlap-factor",
      "zbuffer-offset": [-0.25,0,0],
//      "hysteresis": [2000, 5000],
      "z-index": 2
    }
  }
};

*/

    }));


    browser.on('geo-feature-enter', (function(event){
        console.log(JSON.stringify(event));
    }));

    //browser.ui.getMapElement().on('mousedown', demoClick2);
    //browser.ui.getMapElement().on('mousemove', demoMove);

    renderer = browser.renderer;

    browser.on('map-loaded', onMapLoaded);
    loadTexture();
}

function loadTexture() {
    var demoImage = vts.utils.loadImage(
        'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
        (function(){
            demoTexture = renderer.createTexture({ source: demoImage });
        }));
}


function onMapLoaded() {
    map = browser.map;
    map.addRenderSlot('custom-render', onCustomRender, true);
    map.moveRenderSlotAfter('after-map-render', 'custom-render');
    //map.setRenderSlotEnabled('custom-render', true);   
    //map.getRenderSlotEnabled('custom-render');   
    map.removeRenderSlot('custom-render');   

    //browser.setParam('mapForceFrameTime', 1000/20);

    var tr = browser.autopilot.generateTrajectory(['obj', 14.315143,48.812267,'fix',543.50,-87.06,-33.99,0.00,133.63,45.00],
        ['obj', 14.314925,48.810476,'fix',534.94,185.92,-57.24,0.00,39.06,45.00]);
    console.log(JSON.stringify(tr));

    //var d = map.getDistance([14.4617998, 50.0784497, 314.67], [14.4666738, 50.0816003, 300.16], true);
/*
    map.setView(

{
        "description" : "",
        "freeLayers" : 
        {
            "cadastre" : 
            {
               'style' : "http://localhost:9000/debug/teststyle.json"
//                "style" : "/store/stylesheet/cuzk-cadastre-style.json"
            },
            "samples-czdem" : 
            {
                "boundLayers" : [ "cadastre-raster" ],
                "depthOffset" : [ -5, 0, -40 ]
            }
        },
        "surfaces" : 
        {
            "Benatky-nad-Jizerou-center" : [],
            "Benatky-nad-Jizerou-city" : [],
            "Jenstejn" : [],
            "Jenstejn-village" : [],
            "samples-czdem-local" : [ "mapy-cz" ],
            "samples-gtopo30-v1" : [ "bmng" ]
        }

}    


        );
*/
    return;

    var geodata = map.createGeodata();
    //geodata.addGroup("lines");

    geodata.addLineString([
        [13.4836691, 49.6285568, 0],
        [13.8559398, 49.2926023, 0],
        [14.3590684, 49.1136598, 0],
        [15.2561336, 49.0637509, 0],
        [15.8564221, 49.2444548, 0],
        [16.2429312, 49.5161402, 0]
    ]);

    //geodata.addGroup("points");
    
    geodata.addPoint([13.4836691, 49.6285568, 0]);

    /*
    geodata.addPointArray([
        [13.4836691, 49.6285568, 0],
        [16.2429312, 49.5161402, 0]
    ]);*/


    var freeLayer = geodata.makeFreeLayer({

        "layers" : {
            "my-line" : {
                "filter" : ["==", "#type", "line"],
                "line": true,
                "line-width" : 4,
                "line-color": [255,0,255,255],                
                "zbuffer-offset" : [-5,0,0]
            },

            "my-points" : {
                "filter" : ["==", "#type", "point"],
                "point": true,
                "point-radius" : 10,
                "point-color": [0,0,255,255],                
                "zbuffer-offset" : [-5,0,0]
            }

        }

    });

    map.addFreeLayer('builder-test', freeLayer);

    map.setView(
        {
            'surfaces' : 
            {
                'melown-viewfinder-world' : [ 'bing-world', 'bmng08-world', 'mapycz-ophoto-cz' ]
            },
        
            'freeLayers': { 'builder-test': {} }
        }
    );    


};


function onCustomRender() {
    if (demoTexture) { //check whether texture is loaded
        var p = map.convertCoordsFromNavToCanvas([15.172978788057927,49.60550639057978,512.3574876002967], 'fix');

        //draw point image at the first line point
        renderer.drawImage({
            rect : [p[0]-25, p[1]-25, 50, 50],
            texture : demoTexture,
            color : [255,0,255,255],
            depth : p[2],
            depthTest : true,
            depthOffset : [-70,0,0],
            blend : true
            });
    }    
}

function demoMove(event_) {

    var map = browser.map;
    //map.click(coords[0], coords[1]);
    
    if (map) {
        var coords = event_.getMouseCoords();
        map.hover(coords[0], coords[1]);
    }

};

function demoClick2(event_) {

    if (event_.getMouseButton() == 'left') {
        var coords = event_.getMouseCoords();

        //get hit coords with fixed height
        //clickCoords = browser.getHitCoords(coords[0], coords[1], 'fixed');
        
        //force map redraw to display hit point
        //browser.redraw();

        var map = browser.map;
        map.click(coords[0], coords[1]);
        //map.hover(coords[0], coords[1]);
    }

};

function demoClick() {
    var data = browser.map.renderToImage();
}

var lcounter = 0;

function demoClick33() {
    var map = browser.map;

//        'trackerspindl1' : '//cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl1/freelayer.json',
//        'trackerspindl2' : '//cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl2/freelayer.json'

    //https://jsfiddle.net/kvj0ohe9/1/    

    if (lcounter == 0) {

        map.addFreeLayer('test', globGeodata_);

/*    
        map.addFreeLayer('test', 
            {
                'credits' : [],
                'displaySize' : 1024,
                'extents' : 
                {
  //                  'll' : [ 3897196.198009354, 1088142.086964823, 4913904.161823822 ],
    //                'ur' : [ 3898663.59101460, 1089738.292264985, 4914788.923050244 ]

                        'll': [3969808.1323646996, 1019563.7108279606, 4802321.707409608],
                        'ur': [4005948.5767660574, 1194044.7737189461, 4870311.576400328]

                },
                'geodata' : globGeodata2_, //'http://cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl1/geo',
                //'geodata' : 'http://cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl1/geo',
                'style' : globStyle2_,
                'type' : 'geodata'
            }
        );
*/
        map.setView(
            {
                'surfaces' : 
                {

                    'melown-viewfinder-world' : [ 'bing-world', 'bmng08-world', 'mapycz-ophoto-cz' ]
                },
            
                'freeLayers': { 'test': {} }
            }
        );    

        
    } else {

        if (lcounter & 1) {

            map.removeFreeLayer('test'); 

            //map.setFreeLayerOptions('test', 
            map.addFreeLayer('test', 
                {
                    'credits' : [],
                    'displaySize' : 1024,
                    'extents' : 
                    {
                        'll' : [ 3896228.075197034, 1086156.006591079, 4915334.699458356 ],
                        'ur' : [ 3897186.992286432, 1088394.836104217, 4916407.192621460 ]
                    },
                    'geodata' : 'http://cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl2/geo',
                    'style' : '//cdn.melown.com/mario/store/melown2015/stylesheet/tomas-slavkovsky_melown-com/snbtrackerspindl2/20170110_snb_spindl2',
                    'type' : 'geodata'
                }
            );
            
        } else {

            map.removeFreeLayer('test'); 
            map.addFreeLayer('test', 
                {
                    'credits' : [],
                    'displaySize' : 1024,
'extents':{'ll':[3982688.5386696146,1051169.3118004024,4834810.2055621175],'ur':[3997433.654650295,1084018.8559462822,4853683.273918762]},
//                    'geodata' : 'http://cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl1/geo',
  //                  'style' : '//cdn.melown.com/mario/store/melown2015/stylesheet/tomas-slavkovsky_melown-com/snbtrackerspindl1/20170110_snb_spindl1',

                'geodata' : globGeodata_, //'http://cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl1/geo',
                //'geodata' : 'http://cdn.melown.com/mario/proxy/melown2015/geodata/tomas-slavkovsky_melown-com/trackerspindl1/geo',
                'style' : globStyle2_,

                    'type' : 'geodata'
                }
            );
            
        }
        
        
    }


    lcounter++;

};

//var globGeodata_ = {'credits':[],'geodata':{"groups":[{"lines":[{"lines":[[[4096,4096,0],[4006,4059,78],[3812,3966,253],[3634,3860,405],[3446,3744,551],[3368,3693,617],[3350,3673,637],[3335,3655,655],[3330,3636,666],[3324,3617,677],[3320,3594,686],[3325,3541,701],[3323,3433,756],[3331,3371,788],[3334,3351,798],[3352,3307,814],[3377,3259,826],[3414,3212,837],[3440,3171,848],[3446,3153,856],[3457,3117,871],[3464,3074,893],[3461,3039,917],[3440,2964,970],[3398,2828,1070],[3385,2801,1091],[3379,2775,1110],[3315,2626,1225],[3232,2484,1342],[3169,2409,1413],[3129,2377,1449],[3082,2347,1493],[2971,2299,1581],[2750,2203,1751],[2536,2114,1911],[2291,2023,2104],[2221,2004,2156],[2183,1995,2187],[2153,1988,2211],[2113,1979,2240],[2079,1969,2266],[2044,1956,2291],[2011,1941,2315],[1984,1920,2341],[1966,1907,2358],[1933,1876,2387],[1912,1841,2415],[1882,1783,2450],[1860,1723,2484],[1822,1590,2549],[1812,1568,2562],[1792,1546,2578],[1780,1531,2593],[1716,1483,2647],[1604,1409,2731],[1421,1310,2863],[1271,1216,2979],[1077,1118,3110],[898,1031,3238],[687,924,3384],[563,852,3480],[388,726,3623],[298,641,3699],[210,521,3777],[186,456,3813],[168,330,3872],[172,250,3903],[175,232,3907],[176,186,3928],[173,165,3940],[156,140,3958],[128,105,3988],[108,89,4002],[102,84,4008],[82,68,4023],[0,0,4096]]]}],"resolution":4096,"bbox":[[3982934.429909462,1114786.0956790077,4838811.069841244],[3983632.1258293367,1116628.5311157757,4839734.134044912]]}]},

var globGeodata_ = {'credits':[],'geodata':{'groups':[{'lines':[{'lines':[[[0,596,15998],[0,595,15998],[3,586,15999],[9,576,16000],[17,567,15998],[27,560,15996],[44,549,15991],[66,538,15983],[92,522,15973],[103,514,15969],[111,506,15966],[121,496,15963],[125,491,15962],[130,488,15959],[137,487,15955],[144,486,15950],[151,486,15945],[159,488,15939],[167,491,15933],[181,497,15922],[211,511,15897],[229,519,15885],[236,521,15881],[242,523,15877],[250,523,15873],[257,522,15869],[262,520,15866],[268,517,15864],[273,514,15862],[277,511,15860],[293,496,15856],[297,492,15855],[302,488,15855],[325,469,15850],[344,459,15843],[395,433,15823],[422,422,15814],[465,405,15797],[492,396,15784],[542,377,15753],[598,357,15716],[641,341,15689],[644,340,15687],[664,333,15674],[683,325,15662],[690,322,15659],[695,318,15655],[699,314,15653],[703,310,15651],[705,306,15650],[708,302,15649],[708,298,15648],[710,293,15648],[710,289,15648],[711,285,15649],[710,281,15650],[709,276,15652],[704,268,15655],[699,259,15661],[685,246,15672],[679,242,15675],[647,219,15699],[633,209,15709],[598,186,15734],[570,163,15754],[555,149,15766],[544,134,15776],[540,129,15778],[534,116,15786],[529,105,15791],[526,95,15795],[522,67,15807],[534,59,15802],[541,57,15799],[553,52,15793],[566,48,15786],[582,45,15778],[597,44,15769],[612,40,15761],[620,38,15758],[625,36,15755],[636,31,15751],[638,27,15751],[641,23,15751],[642,18,15753],[642,13,15755],[640,10,15758],[636,5,15763],[631,3,15767],[623,0,15774],[619,0,15777],[611,0,15783],[604,0,15789],[595,2,15794],[575,8,15805],[561,13,15814],[554,14,15818],[547,17,15822],[542,20,15824],[537,23,15825],[535,28,15825],[535,33,15823],[536,37,15821],[536,41,15816],[537,45,15811],[539,48,15805],[542,50,15801],[576,73,15780],[616,99,15753],[652,125,15723],[685,152,15694],[717,179,15667],[723,184,15661],[753,211,15635],[782,239,15609],[815,273,15578],[844,306,15551],[872,336,15525],[898,364,15501],[929,394,15474],[964,425,15443],[997,451,15416],[1034,477,15386],[1060,492,15365],[1108,514,15329],[1156,533,15294],[1204,550,15260],[1249,564,15229],[1298,578,15195],[1340,587,15168],[1372,592,15147],[1450,601,15097],[1519,607,15055],[1582,611,15017],[1643,615,14979],[1707,621,14939],[1779,630,14895],[1848,640,14850],[1902,651,14815],[1940,660,14790],[1975,670,14766],[2014,685,14737],[2062,708,14701],[2105,732,14667],[2149,757,14632],[2184,783,14603],[2204,798,14588],[2236,829,14560],[2248,845,14547],[2269,877,14525],[2272,882,14521],[2288,916,14502],[2298,948,14485],[2301,959,14481],[2305,978,14472],[2306,993,14467],[2306,1023,14457],[2302,1055,14450],[2299,1066,14446],[2295,1082,14443],[2289,1114,14438],[2285,1128,14435],[2283,1133,14435],[2274,1163,14431],[2266,1191,14427],[2265,1195,14426],[2256,1221,14422],[2247,1248,14418],[2247,1252,14417],[2245,1257,14417],[2244,1260,14417],[2243,1264,14416],[2242,1268,14415],[2231,1307,14409],[2228,1314,14408],[2226,1323,14407],[2216,1355,14402],[2205,1392,14397],[2196,1424,14392],[2187,1455,14387],[2179,1486,14382],[2170,1521,14374],[2161,1559,14367],[2153,1601,14357],[2146,1641,14347],[2141,1681,14336],[2136,1719,14325],[2133,1755,14313],[2131,1783,14303],[2126,1947,14242],[2124,1982,14229],[2122,2018,14215],[2120,2052,14202],[2119,2086,14189],[2117,2124,14175],[2114,2146,14165],[2114,2161,14160],[2114,2188,14150],[2113,2194,14148],[2112,2225,14136],[2112,2231,14134],[2110,2262,14122],[2108,2292,14110],[2107,2321,14099],[2105,2366,14082],[2103,2405,14067],[2101,2445,14052],[2099,2485,14037],[2097,2527,14020],[2095,2570,14004],[2093,2615,13986],[2091,2662,13967],[2092,2704,13950],[2095,2743,13932],[2100,2789,13910],[2109,2831,13888],[2121,2872,13864],[2136,2911,13838],[2155,2948,13812],[2175,2980,13786],[2199,3013,13759],[2224,3047,13728],[2247,3075,13703],[2272,3104,13676],[2297,3130,13649],[2329,3160,13617],[2360,3186,13586],[2394,3213,13553],[2427,3236,13522],[2461,3260,13488],[2493,3283,13457],[2527,3306,13423],[2564,3332,13386],[2623,3373,13328],[2680,3412,13271],[2734,3449,13217],[2787,3486,13164],[2840,3523,13112],[2892,3560,13060],[2946,3598,13006],[3003,3638,12949],[3014,3649,12932],[3092,3703,12860],[3128,3728,12828],[3163,3753,12795],[3202,3782,12759],[3239,3812,12725],[3269,3837,12698],[3303,3867,12666],[3335,3898,12636],[3362,3927,12607],[3390,3957,12583],[3417,3987,12557],[3441,4018,12532],[3463,4049,12508],[3484,4078,12486],[3502,4109,12464],[3521,4144,12441],[3540,4180,12419],[3558,4216,12396],[3572,4247,12377],[3588,4280,12356],[3603,4317,12336],[3619,4358,12312],[3638,4405,12285],[3656,4450,12259],[3674,4492,12235],[3690,4532,12212],[3706,4570,12190],[3721,4607,12169],[3739,4650,12144],[3742,4659,12139],[3791,4786,12062],[3810,4835,12031],[3827,4883,12000],[3844,4932,11967],[3861,4982,11934],[3878,5033,11899],[3893,5084,11864],[3910,5137,11828],[3926,5191,11792],[3936,5223,11770],[3944,5249,11753],[3945,5253,11750],[3952,5279,11733],[3954,5282,11730],[3966,5314,11708],[3977,5346,11684],[3991,5374,11662],[3997,5383,11654],[4000,5387,11650],[4002,5392,11647],[4016,5413,11626],[4039,5438,11599],[4057,5456,11579],[4087,5481,11548],[4107,5496,11527],[4140,5516,11495],[4174,5533,11463],[4210,5549,11432],[4252,5564,11396],[4297,5580,11358],[4342,5595,11318],[4389,5611,11278],[4431,5625,11243],[4472,5641,11208],[4512,5658,11172],[4550,5675,11137],[4562,5681,11126],[4587,5693,11102],[4588,5693,11101],[4636,5716,11061],[4675,5736,11024],[4713,5756,10988],[4753,5777,10950],[4794,5800,10911],[4838,5823,10870],[4876,5842,10837],[4917,5863,10800],[4956,5883,10766],[4993,5901,10734],[5030,5918,10704],[5052,5929,10684],[5070,5938,10667],[5121,5962,10630],[5164,5984,10595],[5205,6003,10563],[5230,6016,10542],[5326,6063,10465],[5330,6065,10463],[5369,6083,10434],[5413,6104,10401],[5455,6124,10368],[5499,6148,10333],[5534,6168,10305],[5565,6189,10279],[5593,6210,10255],[5624,6235,10229],[5644,6253,10211],[5671,6280,10186],[5694,6305,10165],[5716,6331,10142],[5740,6358,10120],[5767,6388,10096],[5793,6418,10070],[5832,6461,10034],[5864,6496,10003],[5893,6530,9976],[5931,6570,9942],[5970,6607,9907],[6012,6643,9871],[6057,6676,9834],[6086,6694,9811],[6118,6709,9787],[6159,6727,9756],[6204,6745,9724],[6246,6761,9694],[6293,6779,9660],[6334,6799,9629],[6373,6820,9599],[6408,6842,9571],[6443,6866,9544],[6474,6893,9516],[6503,6922,9490],[6522,6947,9470],[6533,6962,9459],[6544,6983,9446],[6558,7014,9428],[6568,7043,9414],[6570,7047,9413],[6573,7074,9402],[6574,7102,9394],[6571,7132,9387],[6569,7163,9380],[6563,7199,9373],[6559,7242,9364],[6558,7274,9355],[6560,7297,9347],[6565,7333,9333],[6570,7353,9323],[6582,7386,9306],[6589,7399,9298],[6604,7425,9280],[6624,7454,9257],[6649,7483,9232],[6675,7513,9205],[6703,7545,9175],[6732,7577,9146],[6759,7612,9116],[6780,7640,9094],[6797,7666,9073],[6813,7695,9052],[6828,7724,9031],[6842,7754,9011],[6846,7764,9004],[6859,7802,8981],[6868,7831,8965],[6875,7860,8949],[6880,7896,8931],[6881,7902,8928],[6884,7944,8909],[6885,7985,8891],[6883,8026,8876],[6878,8067,8862],[6870,8107,8850],[6860,8147,8839],[6850,8178,8831],[6848,8183,8831],[6842,8198,8827],[6830,8227,8822],[6822,8246,8819],[6807,8275,8816],[6789,8305,8813],[6784,8315,8812],[6756,8356,8811],[6727,8395,8811],[6699,8432,8812],[6670,8467,8815],[6635,8503,8819],[6596,8542,8826],[6558,8576,8833],[6550,8584,8835],[6545,8587,8836],[6541,8591,8837],[6536,8595,8838],[6532,8599,8839],[6512,8615,8843],[6508,8619,8844],[6503,8623,8846],[6469,8650,8855],[6433,8678,8864],[6394,8705,8875],[6349,8736,8888],[6303,8767,8902],[6255,8798,8917],[6206,8829,8932],[6156,8861,8948],[6106,8894,8963],[6065,8923,8975],[6026,8951,8986],[5984,8983,8997],[5953,9009,9005],[5920,9040,9010],[5906,9056,9011],[5896,9067,9010],[5883,9082,9008],[5872,9105,9010],[5869,9108,9009],[5866,9112,9009],[5858,9128,9007],[5856,9132,9006],[5854,9136,9005],[5846,9153,9002],[5843,9161,9000],[5842,9165,8999],[5840,9169,8998],[5838,9174,8997],[5837,9178,8996],[5836,9183,8994],[5833,9191,8992],[5828,9214,8984],[5824,9248,8970],[5824,9264,8962],[5826,9292,8947],[5834,9325,8926],[5841,9346,8910],[5851,9366,8894],[5864,9386,8876],[5882,9410,8852],[5898,9430,8830],[5909,9451,8794],[5924,9464,8778],[5960,9485,8758],[5996,9507,8729],[6024,9524,8701],[6075,9552,8654],[6109,9570,8627],[6142,9590,8599],[6178,9611,8568],[6218,9636,8533],[6257,9661,8500],[6296,9692,8464],[6337,9730,8425],[6374,9766,8389],[6408,9802,8355],[6443,9839,8321],[6480,9875,8286],[6523,9913,8248],[6571,9951,8206],[6619,9985,8165],[6655,10005,8137],[6676,10017,8119],[6695,10027,8102],[6738,10048,8072],[6782,10067,8039],[6828,10087,8003],[6879,10108,7965],[6924,10126,7931],[6997,10155,7877],[7080,10187,7815],[7157,10217,7758],[7229,10246,7704],[7297,10273,7653],[7363,10300,7602],[7428,10326,7553],[7493,10352,7504],[7525,10366,7477],[7543,10373,7462],[7584,10388,7435],[7623,10404,7403],[7668,10422,7370],[7709,10438,7337],[7751,10456,7305],[7789,10471,7275],[7831,10489,7240],[7848,10496,7224],[8019,10566,7093],[8061,10583,7059],[8102,10600,7025],[8144,10617,6992],[8189,10636,6955],[8239,10657,6914],[8288,10677,6875],[8332,10699,6838],[8340,10703,6831],[8370,10721,6804],[8403,10745,6774],[8437,10774,6741],[8464,10804,6711],[8488,10834,6685],[8507,10865,6661],[8517,10884,6647],[8529,10917,6626],[8537,10953,6608],[8543,10992,6590],[8547,11035,6571],[8550,11082,6552],[8553,11128,6534],[8556,11170,6517],[8557,11212,6500],[8559,11255,6484],[8561,11298,6467],[8564,11343,6449],[8566,11382,6432],[8568,11418,6419],[8569,11450,6406],[8571,11486,6391],[8573,11521,6377],[8574,11552,6365],[8576,11581,6353],[8578,11612,6341],[8580,11645,6327],[8583,11682,6312],[8585,11717,6298],[8589,11746,6285],[8597,11781,6266],[8609,11814,6247],[8623,11844,6227],[8633,11862,6214],[8636,11868,6210],[8639,11873,6206],[8643,11878,6202],[8646,11884,6198],[8664,11911,6174],[8672,11921,6165],[8696,11945,6143],[8722,11972,6115],[8743,11991,6095],[8785,12025,6053],[8828,12056,6011],[8876,12084,5967],[8928,12110,5923],[8984,12133,5875],[9043,12154,5825],[9094,12169,5785],[9141,12180,5749],[9184,12190,5716],[9232,12199,5680],[9280,12207,5644],[9353,12217,5595],[9430,12229,5541],[9496,12243,5491],[9557,12259,5444],[9603,12275,5405],[9660,12299,5356],[9708,12323,5315],[9754,12350,5274],[9795,12376,5239],[9818,12394,5219],[9846,12422,5192],[9868,12454,5163],[9886,12484,5140],[9903,12520,5116],[9915,12554,5095],[9924,12588,5077],[9925,12601,5068],[9946,12693,5016],[9960,12724,5007],[9968,12754,4991],[9976,12783,4976],[9986,12812,4959],[9997,12843,4941],[10013,12878,4919],[10028,12910,4898],[10049,12943,4872],[10052,12948,4868],[10080,12984,4839],[10105,13013,4813],[10132,13038,4787],[10167,13066,4755],[10200,13090,4724],[10239,13117,4690],[10277,13142,4657],[10313,13164,4627],[10354,13185,4594],[10400,13205,4558],[10452,13224,4518],[10507,13242,4477],[10567,13260,4431],[10624,13275,4390],[10677,13289,4351],[10729,13303,4314],[10783,13316,4275],[10838,13330,4234],[10851,13334,4222],[11553,13506,3715],[11623,13523,3664],[11692,13540,3615],[11761,13558,3564],[11830,13576,3514],[11898,13593,3466],[11964,13610,3419],[11990,13617,3400],[12161,13659,3279],[12208,13671,3243],[12270,13686,3202],[12324,13699,3165],[12379,13713,3127],[12435,13727,3089],[12490,13740,3051],[12544,13753,3015],[12619,13773,2963],[12707,13794,2903],[12795,13817,2843],[12884,13839,2782],[12974,13861,2720],[13064,13883,2659],[13156,13905,2596],[13247,13927,2533],[13334,13948,2472],[13422,13970,2409],[13508,13991,2345],[13597,14014,2280],[13686,14037,2215],[13777,14060,2148],[13869,14084,2080],[13963,14108,2012],[14039,14126,1956],[14102,14141,1910],[14163,14155,1866],[14232,14173,1816],[14297,14190,1767],[14360,14206,1720],[14421,14224,1674],[14475,14240,1632],[14529,14257,1589],[14584,14274,1544],[14642,14293,1497],[14705,14315,1445],[14761,14333,1400],[14818,14353,1353],[14877,14373,1303],[14933,14393,1257],[14989,14412,1211],[15044,14431,1166],[15099,14450,1120],[15155,14470,1075],[15178,14478,1056],[15236,14498,1009],[15283,14515,970],[15328,14531,934],[15374,14547,898],[15425,14564,857],[15487,14586,807],[15516,14595,785],[15557,14609,752],[15604,14625,714],[15650,14642,678],[15689,14657,647],[15732,14674,613],[15771,14692,580],[15777,14695,575],[15815,14716,543],[15852,14742,508],[15882,14768,477],[15911,14796,447],[15931,14818,425],[15956,14852,396],[15971,14879,375],[15983,14908,356],[15993,14941,336],[15998,14970,320],[16000,15000,307],[15997,15030,297],[15995,15043,292],[15994,15048,291],[15994,15053,289],[15989,15083,281],[15988,15087,279],[15986,15090,279],[15981,15118,271],[15981,15122,270],[15976,15150,262],[15970,15179,254],[15968,15191,249],[15965,15205,244],[15960,15244,235],[15955,15278,224],[15949,15314,213],[15941,15368,196],[15934,15422,180],[15925,15474,164],[15915,15526,149],[15905,15577,133],[15895,15629,117],[15884,15681,101],[15873,15733,84],[15862,15786,67],[15851,15841,50],[15841,15889,35],[15832,15932,21],[15825,15973,8],[15820,16000,0]]]}],'resolution':16000,'bbox':[[3982664.2049933462,1051156.0283787085,4834850.699188595],[3997486.8203005227,1084027.874298141,4853653.635257264]]}]},
                    'style':{

                        "bitmaps" : {
                           //"icons" : "http://maps.google.com/mapfiles/kml/paddle/wht-blank.png",
                           "lines" : {"url":"./lines.png", "filter":"linear", "tiled": true}
                        },

                        'layers':{
                            'lines':{
                                'line':true,
                                'line-flat':true,
                            
//                           'line-width':0.01,
                           'line-width':0.1,
                            'line-width-units': 'ratio',
                            //'line-width':300.01,

                              //'line-width':18,

                //"line-style" : "texture",
                //"line-style-texture" : ["lines", 2, 2],
                //"line-style-texture" : ["lines", 7, 7],
                //"line-style-texture" : ["lines", 14, 7],
                "line-style-texture" : ["lines", 21, 7],

                                'line-color':[255,255,255,255],
                                //'line-color':[0,0,0,255],
                                "line-style-background" : [0,0,0,255],
                                'hover-event':true,
                                'advanced-hit':true,
                                'zbuffer-offset':[0,0,-50]
                            }
                        }
                    },'type':'geodata','extents':{'ll':[3982664.2049933462,1051156.0283787085,4834850.699188595],'ur':[3997486.8203005227,1084027.874298141,4853653.635257264]}};


var globStyle_ = {
    'constants': {
        '@icon-marker': ['icons', 6, 8, 18, 18]
    },
    'bitmaps': {
        'icons': 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png'
    },
    'layers': {
        'lines': {
            'filter': ['skip'],
            //'filter': ['==', '#type', 'line'],
            'line': true,
            'line-flat': false,
            'line-width': 4,
            'line-color': [0,255,0,255],
            'zbuffer-offset': [-11, -50, -50],
            'z-index': 9
            //'next-pass' : 'lines-shadow'
   	    },
        'lines2': {
            'filter': ['skip'],
            'inherit': 'lines',
            'line-color': [255,0,0,255],
            'hover-event' : false
   	    },

        'lines-shadow': {
            'filter': ['==', '#type', 'line'],
            //'filter': ['skip'],
            'line': true,
            'line-flat': false,
            'line-width': 12,
            'line-color': [20, 20, 20, 150],
            'zbuffer-offset': [-11, -50, -50],
            'hover-layer' : 'lines-shadow-hover',
            'hover-event' : true,
            'z-index': 10,
            'next-pass' : [[9,'lines']]
        },
        'lines-shadow-hover': {
            //'filter': ['==', '#type', 'line'],
            'filter': ['skip'],
            'hover-event' : true,
            'line': true,
            'line-flat': false,
            'line-width': 12,
            'line-color': [20, 20, 20, 150],
            'zbuffer-offset': [-11, -50, -50],
            'z-index': 10,
            'next-pass' : [[9,'lines2']]
        },

        'points': {
            'filter': ['==', '#type', 'point'],
            'icon': true,
            'icon-source': '@icon-marker',
            'icon-color': [0,255,0,255],
            'icon-scale': 1,
            'icon-origin': 'bottom-center',
            'zbuffer-offset': [-11, -50, -50],
            'z-index': 7
        }
    }
};


var globFreeLayer_ = {'credits':[],'geodata':{'groups':[{'lines':[{'lines':[[[0,593,15998],[0,592,15998],[3,583,16000],[9,573,15999],[17,564,15998],[26,556,15995],[42,546,15988],[63,535,15980],[88,519,15969],[99,511,15965],[108,502,15963],[118,492,15960],[122,488,15959],[128,485,15957],[135,483,15953],[142,483,15948],[150,483,15943],[158,485,15937],[166,488,15931],[180,493,15920],[210,508,15896],[227,516,15882],[233,518,15877],[239,519,15873],[246,519,15869],[253,518,15865],[258,516,15862],[264,514,15859],[269,511,15857],[274,508,15855],[289,492,15852],[293,489,15850],[297,484,15849],[319,465,15843],[337,455,15835],[386,428,15814],[411,417,15802],[452,400,15782],[478,391,15769],[532,372,15742],[593,353,15710],[640,338,15686],[643,337,15684],[666,329,15673],[686,322,15663],[693,318,15659],[699,315,15657],[704,311,15655],[708,307,15654],[711,303,15653],[714,299,15653],[716,295,15653],[718,291,15654],[719,287,15654],[720,282,15656],[720,278,15657],[719,274,15659],[716,266,15664],[711,257,15671],[699,244,15683],[694,240,15688],[665,218,15714],[653,208,15726],[622,185,15755],[597,163,15779],[584,149,15792],[575,134,15804],[572,129,15807],[567,117,15815],[563,105,15822],[561,96,15827],[558,68,15839],[570,60,15834],[576,57,15832],[589,52,15825],[602,49,15818],[617,46,15810],[632,44,15801],[647,40,15793],[654,38,15789],[660,36,15786],[669,32,15782],[672,28,15782],[674,23,15782],[676,18,15783],[675,13,15785],[673,10,15788],[669,5,15792],[663,3,15796],[655,1,15802],[650,0,15806],[642,0,15811],[634,0,15816],[625,2,15821],[605,8,15832],[590,12,15840],[583,14,15843],[575,16,15847],[570,20,15849],[565,23,15851],[563,28,15851],[563,32,15849],[564,37,15847],[567,41,15843],[570,45,15840],[574,48,15836],[577,51,15833],[605,73,15807],[641,99,15775],[675,125,15743],[707,151,15713],[737,177,15684],[743,183,15678],[771,209,15650],[798,237,15623],[830,271,15590],[857,303,15560],[882,333,15533],[907,362,15506],[935,391,15478],[968,422,15445],[999,448,15415],[1035,473,15384],[1060,488,15362],[1106,510,15324],[1153,529,15288],[1199,545,15252],[1243,560,15219],[1290,573,15184],[1330,582,15155],[1361,587,15133],[1437,596,15081],[1504,602,15036],[1565,605,14996],[1625,609,14957],[1687,615,14915],[1756,623,14868],[1823,633,14821],[1876,643,14784],[1912,652,14758],[1945,662,14733],[1983,677,14703],[2030,700,14664],[2072,723,14629],[2113,749,14593],[2147,774,14562],[2165,790,14545],[2195,820,14514],[2206,836,14501],[2225,867,14477],[2228,873,14473],[2242,906,14452],[2251,939,14434],[2253,949,14429],[2256,969,14420],[2257,983,14414],[2256,1013,14403],[2251,1045,14395],[2248,1056,14392],[2244,1071,14389],[2236,1104,14382],[2232,1118,14379],[2230,1123,14378],[2220,1152,14374],[2211,1180,14369],[2210,1184,14368],[2201,1210,14364],[2192,1238,14360],[2191,1242,14358],[2189,1246,14358],[2188,1250,14357],[2186,1254,14357],[2186,1258,14356],[2173,1296,14349],[2170,1304,14348],[2168,1312,14347],[2158,1344,14341],[2146,1381,14335],[2136,1413,14329],[2126,1444,14324],[2117,1475,14318],[2108,1510,14311],[2098,1548,14302],[2090,1590,14292],[2082,1630,14282],[2077,1669,14270],[2072,1708,14259],[2069,1744,14247],[2067,1772,14238],[2064,1936,14179],[2063,1971,14166],[2062,2008,14153],[2060,2042,14141],[2060,2076,14129],[2058,2114,14115],[2058,2136,14107],[2057,2151,14102],[2057,2179,14092],[2056,2184,14090],[2056,2216,14079],[2056,2221,14077],[2055,2252,14066],[2054,2282,14055],[2053,2312,14044],[2052,2357,14028],[2051,2396,14014],[2049,2435,14000],[2048,2476,13985],[2048,2518,13970],[2047,2561,13954],[2046,2607,13938],[2045,2654,13920],[2047,2696,13904],[2050,2735,13887],[2056,2781,13866],[2066,2823,13844],[2078,2864,13820],[2094,2903,13795],[2113,2941,13769],[2134,2972,13744],[2157,3005,13717],[2183,3039,13687],[2207,3068,13661],[2232,3097,13635],[2257,3123,13608],[2290,3152,13577],[2321,3178,13547],[2357,3205,13514],[2390,3229,13484],[2426,3254,13452],[2460,3276,13422],[2496,3300,13390],[2535,3326,13355],[2597,3367,13300],[2658,3407,13246],[2715,3444,13195],[2771,3481,13146],[2826,3519,13096],[2882,3556,13047],[2939,3595,12996],[2999,3635,12942],[3014,3646,12929],[3093,3701,12858],[3129,3726,12825],[3165,3751,12793],[3204,3780,12757],[3241,3809,12723],[3270,3834,12695],[3303,3865,12662],[3334,3895,12631],[3361,3925,12602],[3387,3954,12575],[3411,3984,12548],[3435,4015,12521],[3456,4045,12496],[3475,4074,12473],[3492,4105,12450],[3510,4140,12426],[3527,4175,12402],[3543,4211,12378],[3557,4242,12358],[3571,4276,12336],[3584,4313,12313],[3599,4353,12289],[3616,4400,12260],[3633,4445,12232],[3649,4486,12206],[3664,4526,12182],[3678,4565,12158],[3692,4601,12136],[3707,4644,12110],[3711,4653,12104],[3758,4779,12026],[3777,4828,11995],[3795,4877,11965],[3814,4926,11934],[3834,4977,11903],[3853,5028,11871],[3872,5079,11840],[3892,5132,11807],[3912,5187,11774],[3923,5220,11754],[3933,5245,11738],[3934,5250,11736],[3943,5275,11720],[3945,5279,11717],[3958,5311,11697],[3972,5343,11676],[3988,5372,11655],[3994,5380,11648],[3997,5385,11644],[4000,5389,11641],[4016,5411,11622],[4040,5436,11597],[4060,5454,11578],[4091,5479,11548],[4113,5495,11529],[4148,5515,11499],[4184,5532,11469],[4222,5548,11439],[4266,5564,11405],[4313,5580,11369],[4361,5595,11332],[4411,5611,11294],[4454,5626,11261],[4497,5642,11228],[4540,5659,11194],[4581,5676,11161],[4593,5682,11152],[4621,5694,11129],[4622,5695,11128],[4670,5718,11089],[4711,5738,11055],[4752,5759,11021],[4795,5780,10985],[4839,5803,10948],[4885,5826,10910],[4924,5845,10878],[4968,5867,10842],[5007,5886,10809],[5045,5904,10778],[5082,5922,10748],[5105,5933,10729],[5124,5942,10714],[5173,5966,10674],[5216,5987,10638],[5256,6007,10605],[5281,6019,10584],[5376,6066,10506],[5379,6068,10503],[5416,6086,10473],[5459,6107,10438],[5499,6127,10404],[5542,6150,10368],[5576,6171,10339],[5606,6191,10312],[5633,6212,10287],[5662,6237,10259],[5681,6255,10240],[5706,6282,10213],[5728,6306,10190],[5749,6332,10167],[5771,6360,10142],[5795,6389,10116],[5820,6419,10089],[5856,6461,10050],[5885,6496,10017],[5913,6529,9987],[5948,6569,9950],[5984,6606,9913],[6023,6641,9874],[6066,6674,9835],[6093,6692,9810],[6123,6708,9785],[6164,6725,9753],[6207,6742,9718],[6248,6758,9687],[6292,6776,9652],[6332,6796,9619],[6369,6817,9587],[6403,6839,9557],[6434,6862,9528],[6465,6889,9498],[6491,6918,9470],[6509,6943,9450],[6519,6958,9437],[6529,6978,9423],[6541,7010,9404],[6549,7038,9388],[6550,7042,9385],[6553,7068,9374],[6551,7097,9364],[6547,7127,9355],[6542,7157,9347],[6535,7193,9338],[6528,7236,9326],[6526,7267,9315],[6526,7290,9307],[6529,7326,9291],[6533,7347,9280],[6544,7379,9261],[6550,7392,9253],[6564,7417,9234],[6584,7446,9210],[6607,7476,9184],[6633,7506,9156],[6661,7537,9127],[6689,7570,9096],[6716,7605,9066],[6735,7633,9043],[6752,7658,9022],[6769,7687,9001],[6783,7716,8980],[6797,7747,8960],[6801,7756,8953],[6815,7794,8930],[6823,7823,8914],[6830,7853,8898],[6837,7888,8881],[6837,7894,8878],[6841,7937,8859],[6842,7978,8843],[6841,8019,8828],[6837,8060,8815],[6830,8100,8804],[6821,8141,8794],[6813,8171,8788],[6811,8176,8788],[6806,8191,8785],[6794,8221,8781],[6787,8240,8778],[6773,8269,8776],[6757,8299,8775],[6752,8309,8774],[6726,8350,8775],[6699,8390,8777],[6673,8427,8780],[6645,8462,8784],[6613,8499,8791],[6575,8538,8800],[6540,8572,8809],[6532,8580,8812],[6527,8583,8813],[6523,8587,8814],[6519,8591,8816],[6515,8596,8817],[6497,8611,8822],[6492,8616,8823],[6488,8619,8825],[6455,8647,8835],[6421,8675,8846],[6384,8702,8859],[6341,8734,8875],[6297,8765,8891],[6251,8796,8909],[6205,8828,8926],[6157,8860,8944],[6110,8893,8962],[6070,8923,8976],[6033,8951,8989],[5994,8983,9002],[5963,9009,9011],[5933,9041,9018],[5920,9057,9020],[5912,9068,9022],[5902,9083,9022],[5888,9106,9022],[5886,9110,9022],[5884,9113,9022],[5876,9130,9021],[5874,9133,9020],[5873,9137,9020],[5866,9154,9018],[5864,9162,9016],[5862,9167,9015],[5860,9171,9015],[5860,9176,9014],[5859,9180,9013],[5858,9184,9012],[5855,9193,9010],[5852,9216,9003],[5850,9250,8991],[5851,9267,8984],[5855,9295,8971],[5865,9328,8952],[5873,9349,8939],[5885,9370,8923],[5899,9389,8907],[5919,9414,8885],[5937,9435,8865],[5962,9457,8841],[5977,9470,8826],[6006,9490,8800],[6041,9512,8769],[6071,9529,8744],[6125,9558,8699],[6158,9576,8671],[6191,9595,8642],[6227,9616,8611],[6267,9641,8576],[6304,9666,8542],[6343,9697,8506],[6383,9734,8466],[6419,9771,8429],[6453,9807,8394],[6486,9843,8359],[6521,9880,8322],[6562,9917,8282],[6608,9955,8237],[6655,9988,8195],[6689,10008,8166],[6710,10020,8148],[6730,10031,8131],[6770,10051,8098],[6812,10070,8063],[6857,10090,8027],[6907,10110,7987],[6951,10128,7952],[7022,10157,7896],[7103,10189,7832],[7178,10218,7773],[7248,10247,7717],[7315,10274,7664],[7380,10301,7612],[7443,10327,7562],[7507,10353,7511],[7539,10366,7485],[7558,10374,7470],[7596,10389,7440],[7636,10405,7409],[7679,10422,7374],[7721,10439,7342],[7762,10456,7309],[7800,10471,7278],[7842,10489,7244],[7861,10497,7230],[8029,10566,7096],[8072,10583,7062],[8113,10600,7029],[8155,10617,6995],[8201,10636,6959],[8252,10657,6919],[8300,10677,6880],[8345,10699,6843],[8354,10703,6836],[8384,10721,6809],[8417,10745,6779],[8450,10775,6746],[8479,10805,6717],[8503,10834,6690],[8522,10865,6666],[8532,10884,6653],[8543,10917,6632],[8551,10953,6614],[8557,10992,6595],[8560,11036,6576],[8563,11083,6556],[8565,11128,6538],[8567,11171,6520],[8568,11213,6503],[8570,11255,6486],[8571,11298,6468],[8573,11343,6450],[8575,11382,6434],[8576,11418,6419],[8577,11450,6406],[8579,11486,6391],[8580,11521,6377],[8581,11552,6364],[8583,11581,6352],[8584,11612,6340],[8586,11645,6326],[8588,11682,6311],[8590,11717,6296],[8594,11745,6283],[8602,11781,6264],[8613,11813,6244],[8627,11844,6223],[8636,11861,6211],[8640,11867,6206],[8642,11873,6202],[8646,11878,6198],[8649,11883,6194],[8668,11911,6171],[8676,11921,6162],[8699,11945,6139],[8726,11972,6111],[8746,11991,6091],[8789,12025,6050],[8834,12056,6010],[8884,12084,5967],[8936,12110,5923],[8994,12134,5877],[9056,12155,5830],[9108,12169,5791],[9156,12181,5756],[9200,12191,5724],[9249,12200,5689],[9298,12208,5654],[9371,12218,5604],[9448,12230,5550],[9516,12244,5501],[9578,12261,5455],[9626,12277,5418],[9685,12301,5371],[9734,12325,5330],[9780,12352,5291],[9821,12378,5254],[9842,12396,5234],[9870,12423,5206],[9893,12456,5178],[9911,12486,5155],[9928,12522,5131],[9940,12556,5110],[9948,12590,5091],[9952,12603,5084],[9974,12695,5034],[9981,12725,5018],[9988,12755,5002],[9996,12784,4986],[10006,12814,4969],[10016,12844,4950],[10031,12879,4927],[10045,12911,4906],[10066,12945,4879],[10069,12949,4876],[10096,12985,4845],[10120,13014,4818],[10146,13038,4792],[10181,13067,4759],[10214,13091,4728],[10252,13118,4694],[10290,13142,4660],[10325,13164,4629],[10365,13185,4595],[10410,13205,4559],[10462,13225,4518],[10517,13242,4476],[10578,13260,4431],[10633,13276,4389],[10686,13289,4350],[10738,13303,4312],[10791,13316,4273],[10847,13330,4231],[10861,13334,4221],[11559,13505,3708],[11628,13522,3657],[11697,13539,3607],[11766,13557,3555],[11834,13574,3505],[11901,13592,3456],[11966,13609,3407],[11991,13615,3389],[12160,13657,3264],[12207,13669,3229],[12267,13684,3185],[12319,13697,3147],[12373,13710,3107],[12427,13724,3067],[12481,13737,3028],[12532,13750,2990],[12606,13769,2935],[12691,13790,2873],[12776,13812,2810],[12863,13834,2746],[12950,13856,2682],[13037,13877,2617],[13126,13899,2552],[13215,13921,2487],[13301,13942,2423],[13388,13963,2360],[13474,13985,2296],[13562,14007,2231],[13652,14030,2165],[13742,14054,2098],[13834,14077,2030],[13928,14101,1960],[14004,14119,1905],[14067,14134,1858],[14127,14148,1814],[14197,14166,1763],[14262,14183,1715],[14325,14199,1668],[14386,14217,1622],[14441,14233,1581],[14496,14250,1539],[14553,14268,1495],[14613,14287,1449],[14678,14308,1399],[14735,14327,1356],[14794,14347,1310],[14855,14368,1263],[14913,14387,1218],[14971,14407,1173],[15027,14426,1130],[15084,14446,1086],[15141,14466,1041],[15165,14473,1023],[15224,14494,978],[15273,14511,940],[15318,14526,904],[15364,14542,869],[15417,14560,828],[15480,14581,780],[15509,14591,757],[15551,14605,725],[15599,14621,688],[15644,14638,652],[15684,14653,621],[15727,14670,587],[15767,14689,554],[15773,14691,549],[15811,14712,517],[15848,14738,483],[15879,14765,452],[15909,14792,423],[15929,14815,401],[15954,14848,372],[15969,14876,352],[15982,14904,333],[15993,14937,313],[15998,14967,298],[15999,14997,285],[15997,15027,275],[15996,15040,271],[15995,15045,270],[15994,15050,268],[15989,15080,260],[15989,15084,259],[15987,15087,258],[15983,15115,251],[15982,15119,249],[15977,15147,242],[15972,15176,234],[15970,15188,230],[15968,15203,226],[15962,15241,215],[15957,15275,205],[15952,15311,195],[15945,15366,178],[15937,15419,162],[15929,15472,147],[15920,15524,133],[15911,15575,118],[15903,15627,104],[15894,15679,89],[15884,15732,75],[15875,15785,60],[15866,15840,44],[15858,15889,31],[15851,15932,19],[15844,15973,7],[15840,16000,0]]]}],'resolution':16000,'bbox':[[3982688.5386696146,1051169.3118004024,4834810.2055621175],[3997433.654650295,1084018.8559462822,4853683.273918762]]}]},'style':{'layers':{'lines':{'line':true,'line-width':8,'line-color':[255,0,0,255],'zbuffer-offset':[0,0,0]}}},'type':'geodata','extents':{'ll':[3982688.5386696146,1051169.3118004024,4834810.2055621175],'ur':[3997433.654650295,1084018.8559462822,4853683.273918762]}};


var globStyle2_ = 
{
  'layers': {
    'lines': {
      'line': true,
      'line-width': 8,
      'line-color': [255,0,0,255],
      //'zbuffer-offset': [-11,-50,-50]
      'zbuffer-offset': [0,0,-50]
    }
  }
};

var globGeodata2_ = { 'groups': [{ 'lines': [{ 'lines': [
                    [
                        [582, 0, 15883],
                        [548, 15, 15889],
                        [542, 17, 15889],
                        [515, 14, 15901],
                        [499, 18, 15905],
                        [495, 19, 15906],
                        [481, 25, 15909],
                        [466, 32, 15912],
                        [452, 37, 15915],
                        [440, 43, 15918],
                        [430, 47, 15919],
                        [414, 54, 15922],
                        [392, 64, 15925],
                        [375, 72, 15928],
                        [373, 73, 15929],
                        [299, 106, 15944],
                        [250, 128, 15953],
                        [240, 133, 15955],
                        [238, 134, 15956],
                        [233, 136, 15957],
                        [231, 136, 15957],
                        [229, 137, 15958],
                        [227, 137, 15958],
                        [225, 138, 15959],
                        [219, 139, 15961],
                        [193, 146, 15968],
                        [182, 151, 15970],
                        [166, 157, 15972],
                        [152, 163, 15975],
                        [135, 170, 15977],
                        [134, 170, 15977],
                        [114, 178, 15980],
                        [101, 183, 15982],
                        [78, 192, 15985],
                        [58, 200, 15988],
                        [44, 206, 15991],
                        [26, 213, 15994],
                        [14, 218, 15997],
                        [0, 224, 16000],
                        [2, 224, 15998],
                        [4, 224, 15997],
                        [8, 225, 15995],
                        [8, 225, 15995],
                        [41, 227, 15980],
                        [68, 229, 15967],
                        [77, 230, 15963],
                        [90, 231, 15957],
                        [98, 232, 15953],
                        [107, 233, 15948],
                        [109, 233, 15948],
                        [112, 233, 15946],
                        [133, 233, 15936],
                        [155, 233, 15927],
                        [157, 233, 15927],
                        [172, 233, 15920],
                        [184, 234, 15914],
                        [194, 234, 15907],
                        [215, 235, 15897],
                        [238, 236, 15888],
                        [263, 237, 15878],
                        [284, 238, 15869],
                        [306, 240, 15856],
                        [329, 242, 15848],
                        [340, 243, 15842],
                        [388, 247, 15820],
                        [412, 249, 15808],
                        [434, 251, 15797],
                        [457, 252, 15787],
                        [479, 254, 15777],
                        [501, 255, 15767],
                        [508, 255, 15764],
                        [528, 256, 15755],
                        [549, 257, 15746],
                        [568, 257, 15737],
                        [584, 257, 15732],
                        [600, 257, 15725],
                        [616, 256, 15720],
                        [637, 254, 15712],
                        [646, 254, 15710],
                        [670, 252, 15701],
                        [693, 250, 15692],
                        [707, 249, 15687],
                        [749, 247, 15670],
                        [780, 245, 15658],
                        [788, 244, 15654],
                        [794, 244, 15652],
                        [801, 243, 15649],
                        [814, 242, 15644],
                        [821, 241, 15641],
                        [831, 240, 15638],
                        [842, 238, 15634],
                        [867, 233, 15626],
                        [887, 230, 15620],
                        [892, 229, 15618],
                        [900, 228, 15616],
                        [906, 227, 15613],
                        [907, 227, 15613],
                        [916, 226, 15610],
                        [922, 225, 15607],
                        [924, 225, 15607],
                        [950, 224, 15597],
                        [968, 224, 15591],
                        [987, 224, 15583],
                        [1007, 225, 15575],
                        [1038, 226, 15562],
                        [1060, 227, 15552],
                        [1072, 227, 15547],
                        [1079, 228, 15544],
                        [1106, 229, 15532],
                        [1142, 232, 15516],
                        [1170, 234, 15503],
                        [1197, 236, 15491],
                        [1213, 237, 15484],
                        [1243, 239, 15470],
                        [1284, 241, 15450],
                        [1288, 242, 15448],
                        [1292, 242, 15446],
                        [1300, 244, 15442],
                        [1316, 247, 15433],
                        [1325, 248, 15429],
                        [1330, 248, 15426],
                        [1334, 249, 15422],
                        [1348, 250, 15407],
                        [1370, 251, 15395],
                        [1393, 253, 15385],
                        [1418, 254, 15373],
                        [1448, 256, 15360],
                        [1486, 258, 15350],
                        [1511, 260, 15342],
                        [1531, 261, 15334],
                        [1541, 262, 15330],
                        [1544, 262, 15328],
                        [1550, 263, 15326],
                        [1562, 264, 15320],
                        [1564, 265, 15318],
                        [1566, 265, 15316],
                        [1571, 266, 15314],
                        [1574, 267, 15313],
                        [1576, 267, 15312],
                        [1582, 269, 15309],
                        [1584, 270, 15307],
                        [1597, 275, 15299],
                        [1610, 279, 15291],
                        [1622, 284, 15283],
                        [1634, 289, 15276],
                        [1645, 293, 15269],
                        [1648, 295, 15267],
                        [1650, 295, 15266],
                        [1659, 299, 15260],
                        [1668, 302, 15255],
                        [1669, 302, 15254],
                        [1670, 302, 15253],
                        [1683, 306, 15245],
                        [1694, 308, 15241],
                        [1709, 311, 15233],
                        [1715, 313, 15230],
                        [1715, 313, 15230],
                        [1723, 315, 15225],
                        [1736, 320, 15218],
                        [1748, 324, 15211],
                        [1760, 329, 15204],
                        [1762, 329, 15203],
                        [1766, 331, 15201],
                        [1768, 331, 15200],
                        [1781, 336, 15192],
                        [1783, 337, 15192],
                        [1791, 340, 15187],
                        [1795, 342, 15184],
                        [1797, 342, 15183],
                        [1799, 343, 15182],
                        [1805, 346, 15178],
                        [1805, 347, 15177],
                        [1809, 350, 15173],
                        [1815, 356, 15169],
                        [1820, 363, 15163],
                        [1825, 369, 15157],
                        [1828, 372, 15154],
                        [1838, 378, 15147],
                        [1847, 384, 15140],
                        [1856, 390, 15133],
                        [1858, 392, 15131],
                        [1879, 406, 15114],
                        [1886, 410, 15109],
                        [1889, 413, 15106],
                        [1890, 414, 15105],
                        [1900, 420, 15098],
                        [1908, 426, 15090],
                        [1914, 431, 15084],
                        [1916, 432, 15083],
                        [1923, 438, 15078],
                        [1924, 439, 15077],
                        [1926, 439, 15076],
                        [1926, 440, 15075],
                        [1927, 441, 15074],
                        [1934, 446, 15068],
                        [1941, 451, 15063],
                        [1948, 457, 15056],
                        [1958, 464, 15048],
                        [1966, 472, 15040],
                        [1974, 478, 15033],
                        [1981, 485, 15026],
                        [1988, 491, 15020],
                        [1994, 497, 15013],
                        [1995, 498, 15012],
                        [1995, 499, 15011],
                        [2000, 504, 15005],
                        [2002, 510, 14997],
                        [2010, 515, 14993],
                        [2017, 521, 14989],
                        [2019, 525, 14983],
                        [2027, 531, 14980],
                        [2031, 536, 14975],
                        [2035, 542, 14971],
                        [2039, 547, 14966],
                        [2041, 552, 14962],
                        [2041, 553, 14962],
                        [2040, 556, 14959],
                        [2041, 559, 14959],
                        [2042, 564, 14957],
                        [2039, 570, 14954],
                        [2038, 573, 14953],
                        [2037, 574, 14953],
                        [2036, 576, 14953],
                        [2031, 582, 14952],
                        [2024, 589, 14952],
                        [2017, 594, 14952],
                        [2008, 599, 14954],
                        [1997, 605, 14955],
                        [1986, 611, 14958],
                        [1977, 615, 14960],
                        [1976, 616, 14960],
                        [1966, 622, 14962],
                        [1962, 625, 14962],
                        [1954, 632, 14963],
                        [1952, 633, 14963],
                        [1949, 636, 14962],
                        [1947, 641, 14962],
                        [1945, 647, 14960],
                        [1946, 653, 14957],
                        [1948, 659, 14954],
                        [1952, 665, 14950],
                        [1959, 671, 14943],
                        [1962, 674, 14941],
                        [1967, 676, 14937],
                        [1967, 677, 14937],
                        [1978, 682, 14931],
                        [1984, 684, 14927],
                        [1998, 689, 14918],
                        [2001, 690, 14916],
                        [2017, 693, 14908],
                        [2038, 697, 14897],
                        [2058, 700, 14887],
                        [2073, 702, 14880],
                        [2096, 706, 14868],
                        [2109, 707, 14861],
                        [2127, 710, 14853],
                        [2145, 712, 14845],
                        [2162, 715, 14836],
                        [2179, 717, 14828],
                        [2196, 720, 14819],
                        [2210, 722, 14812],
                        [2212, 722, 14811],
                        [2228, 726, 14802],
                        [2243, 730, 14794],
                        [2257, 735, 14785],
                        [2264, 737, 14781],
                        [2280, 743, 14772],
                        [2295, 748, 14763],
                        [2310, 754, 14754],
                        [2320, 759, 14747],
                        [2330, 765, 14740],
                        [2338, 771, 14733],
                        [2344, 776, 14727],
                        [2350, 782, 14722],
                        [2356, 788, 14717],
                        [2363, 796, 14710],
                        [2370, 803, 14703],
                        [2377, 811, 14696],
                        [2385, 820, 14688],
                        [2392, 827, 14681],
                        [2398, 835, 14674],
                        [2406, 843, 14666],
                        [2423, 865, 14646],
                        [2429, 871, 14639],
                        [2436, 880, 14631],
                        [2443, 887, 14623],
                        [2449, 895, 14616],
                        [2456, 902, 14609],
                        [2462, 909, 14602],
                        [2468, 916, 14595],
                        [2473, 923, 14589],
                        [2478, 929, 14584],
                        [2486, 937, 14576],
                        [2493, 945, 14569],
                        [2501, 953, 14562],
                        [2508, 960, 14555],
                        [2515, 968, 14548],
                        [2523, 976, 14540],
                        [2532, 987, 14531],
                        [2540, 996, 14522],
                        [2548, 1006, 14513],
                        [2556, 1014, 14504],
                        [2563, 1022, 14496],
                        [2569, 1030, 14489],
                        [2575, 1038, 14482],
                        [2580, 1046, 14475],
                        [2584, 1054, 14469],
                        [2588, 1063, 14462],
                        [2589, 1069, 14458],
                        [2591, 1076, 14453],
                        [2591, 1082, 14450],
                        [2591, 1087, 14447],
                        [2590, 1093, 14444],
                        [2589, 1098, 14441],
                        [2588, 1104, 14438],
                        [2588, 1106, 14437],
                        [2586, 1111, 14435],
                        [2586, 1113, 14434],
                        [2578, 1140, 14422],
                        [2577, 1143, 14420],
                        [2576, 1151, 14418],
                        [2575, 1160, 14415],
                        [2573, 1168, 14412],
                        [2572, 1176, 14409],
                        [2571, 1184, 14405],
                        [2570, 1192, 14402],
                        [2570, 1199, 14399],
                        [2571, 1206, 14395],
                        [2572, 1212, 14392],
                        [2573, 1214, 14390],
                        [2576, 1220, 14387],
                        [2578, 1225, 14383],
                        [2578, 1226, 14382],
                        [2579, 1228, 14381],
                        [2582, 1231, 14378],
                        [2586, 1238, 14372],
                        [2591, 1244, 14367],
                        [2596, 1250, 14361],
                        [2603, 1256, 14355],
                        [2609, 1262, 14350],
                        [2610, 1262, 14349],
                        [2611, 1263, 14348],
                        [2617, 1268, 14343],
                        [2619, 1269, 14341],
                        [2623, 1272, 14339],
                        [2633, 1278, 14331],
                        [2644, 1284, 14324],
                        [2655, 1290, 14316],
                        [2666, 1297, 14308],
                        [2679, 1304, 14300],
                        [2693, 1311, 14291],
                        [2707, 1319, 14281],
                        [2725, 1329, 14269],
                        [2741, 1338, 14258],
                        [2756, 1346, 14248],
                        [2771, 1354, 14238],
                        [2785, 1362, 14228],
                        [2798, 1370, 14218],
                        [2812, 1377, 14208],
                        [2818, 1381, 14204],
                        [2830, 1388, 14195],
                        [2844, 1395, 14186],
                        [2856, 1402, 14177],
                        [2868, 1409, 14168],
                        [2880, 1416, 14159],
                        [2893, 1424, 14150],
                        [2901, 1428, 14144],
                        [2908, 1433, 14138],
                        [2912, 1435, 14135],
                        [2920, 1440, 14129],
                        [2929, 1445, 14122],
                        [2938, 1450, 14115],
                        [2947, 1455, 14108],
                        [2957, 1460, 14101],
                        [2959, 1461, 14100],
                        [2960, 1462, 14099],
                        [2961, 1463, 14098],
                        [2971, 1468, 14091],
                        [2978, 1471, 14087],
                        [2994, 1479, 14076],
                        [3009, 1485, 14066],
                        [3025, 1492, 14057],
                        [3040, 1498, 14047],
                        [3056, 1505, 14037],
                        [3072, 1511, 14027],
                        [3090, 1517, 14016],
                        [3147, 1537, 13983],
                        [3161, 1542, 13975],
                        [3242, 1570, 13930],
                        [3431, 1637, 13817],
                        [3451, 1645, 13804],
                        [3471, 1652, 13791],
                        [3491, 1659, 13778],
                        [3510, 1666, 13766],
                        [3529, 1674, 13753],
                        [3548, 1681, 13740],
                        [3568, 1688, 13728],
                        [3588, 1695, 13716],
                        [3608, 1702, 13703],
                        [3629, 1709, 13690],
                        [3642, 1714, 13681],
                        [3652, 1718, 13675],
                        [3667, 1723, 13666],
                        [3682, 1729, 13657],
                        [3698, 1735, 13647],
                        [3715, 1740, 13637],
                        [3732, 1747, 13627],
                        [3750, 1753, 13616],
                        [3765, 1758, 13608],
                        [3780, 1763, 13599],
                        [3795, 1769, 13590],
                        [3811, 1774, 13581],
                        [3824, 1779, 13573],
                        [3837, 1783, 13565],
                        [3858, 1790, 13554],
                        [3881, 1799, 13540],
                        [3904, 1807, 13527],
                        [3926, 1814, 13514],
                        [3948, 1822, 13502],
                        [3969, 1829, 13490],
                        [3988, 1836, 13479],
                        [4005, 1842, 13469],
                        [4017, 1846, 13462],
                        [4029, 1850, 13456],
                        [4040, 1854, 13449],
                        [4050, 1859, 13443],
                        [4060, 1863, 13437],
                        [4066, 1866, 13434],
                        [4069, 1869, 13430],
                        [4072, 1870, 13430],
                        [4077, 1874, 13426],
                        [4083, 1879, 13421],
                        [4088, 1884, 13417],
                        [4091, 1889, 13414],
                        [4094, 1894, 13410],
                        [4095, 1899, 13407],
                        [4100, 1912, 13399],
                        [4108, 1938, 13383],
                        [4110, 1944, 13379],
                        [4112, 1950, 13375],
                        [4113, 1957, 13371],
                        [4115, 1963, 13367],
                        [4116, 1969, 13363],
                        [4118, 1975, 13358],
                        [4119, 1983, 13354],
                        [4122, 1990, 13349],
                        [4123, 1997, 13344],
                        [4125, 2004, 13339],
                        [4127, 2010, 13335],
                        [4128, 2016, 13331],
                        [4129, 2021, 13328],
                        [4129, 2023, 13326],
                        [4131, 2029, 13322],
                        [4133, 2035, 13318],
                        [4134, 2041, 13314],
                        [4135, 2048, 13309],
                        [4137, 2054, 13305],
                        [4138, 2060, 13301],
                        [4139, 2066, 13296],
                        [4139, 2072, 13292],
                        [4140, 2078, 13288],
                        [4141, 2083, 13284],
                        [4142, 2090, 13278],
                        [4143, 2097, 13274],
                        [4144, 2103, 13269],
                        [4145, 2110, 13264],
                        [4148, 2116, 13259],
                        [4151, 2122, 13253],
                        [4156, 2128, 13247],
                        [4157, 2128, 13246],
                        [4157, 2129, 13245],
                        [4163, 2134, 13239],
                        [4169, 2139, 13233],
                        [4176, 2144, 13227],
                        [4177, 2144, 13226],
                        [4185, 2149, 13219],
                        [4185, 2150, 13219],
                        [4195, 2155, 13211],
                        [4204, 2161, 13203],
                        [4212, 2165, 13196],
                        [4221, 2170, 13189],
                        [4229, 2175, 13183],
                        [4238, 2179, 13176],
                        [4247, 2184, 13170],
                        [4248, 2185, 13169],
                        [4254, 2188, 13165],
                        [4265, 2193, 13157],
                        [4275, 2198, 13150],
                        [4285, 2202, 13143],
                        [4296, 2207, 13136],
                        [4308, 2212, 13127],
                        [4320, 2217, 13119],
                        [4331, 2221, 13111],
                        [4333, 2222, 13110],
                        [4334, 2222, 13109],
                        [4336, 2223, 13108],
                        [4338, 2223, 13107],
                        [4339, 2224, 13106],
                        [4349, 2228, 13099],
                        [4364, 2233, 13089],
                        [4376, 2238, 13080],
                        [4390, 2243, 13071],
                        [4404, 2248, 13062],
                        [4417, 2252, 13053],
                        [4429, 2256, 13044],
                        [4437, 2258, 13039],
                        [4439, 2259, 13038],
                        [4452, 2262, 13031],
                        [4469, 2267, 13021],
                        [4487, 2272, 13011],
                        [4504, 2276, 13001],
                        [4521, 2280, 12991],
                        [4540, 2285, 12980],
                        [4558, 2289, 12970],
                        [4575, 2294, 12960],
                        [4590, 2298, 12952],
                        [4608, 2302, 12941],
                        [4625, 2307, 12931],
                        [4643, 2311, 12921],
                        [4648, 2313, 12918],
                        [4664, 2317, 12909],
                        [4680, 2321, 12899],
                        [4694, 2326, 12891],
                        [4697, 2327, 12889],
                        [4707, 2331, 12882],
                        [4709, 2331, 12881],
                        [4720, 2336, 12873],
                        [4730, 2341, 12867],
                        [4739, 2346, 12859],
                        [4740, 2347, 12857],
                        [4745, 2350, 12853],
                        [4753, 2355, 12847],
                        [4758, 2361, 12841],
                        [4762, 2366, 12836],
                        [4765, 2371, 12831],
                        [4765, 2371, 12831],
                        [4768, 2378, 12825],
                        [4769, 2385, 12820],
                        [4769, 2387, 12818],
                        [4768, 2392, 12815],
                        [4768, 2394, 12814],
                        [4766, 2400, 12810],
                        [4765, 2405, 12807],
                        [4763, 2411, 12804],
                        [4762, 2417, 12801],
                        [4762, 2418, 12800],
                        [4762, 2419, 12800],
                        [4762, 2420, 12799],
                        [4760, 2425, 12796],
                        [4760, 2431, 12792],
                        [4761, 2436, 12789],
                        [4763, 2443, 12784],
                        [4764, 2445, 12782],
                        [4765, 2450, 12776],
                        [4768, 2456, 12769],
                        [4777, 2462, 12765],
                        [4789, 2469, 12760],
                        [4800, 2476, 12752],
                        [4812, 2483, 12744],
                        [4826, 2489, 12735],
                        [4843, 2496, 12725],
                        [4861, 2502, 12715],
                        [4879, 2508, 12705],
                        [4895, 2514, 12695],
                        [4912, 2519, 12686],
                        [4927, 2523, 12677],
                        [4943, 2528, 12668],
                        [4958, 2533, 12659],
                        [4973, 2537, 12650],
                        [4987, 2541, 12642],
                        [5000, 2546, 12634],
                        [5002, 2546, 12632],
                        [5008, 2551, 12616],
                        [5025, 2556, 12606],
                        [5044, 2560, 12603],
                        [5052, 2562, 12602],
                        [5068, 2567, 12594],
                        [5081, 2571, 12587],
                        [5100, 2577, 12576],
                        [5119, 2583, 12566],
                        [5136, 2588, 12556],
                        [5156, 2595, 12544],
                        [5175, 2601, 12533],
                        [5195, 2608, 12521],
                        [5210, 2614, 12511],
                        [5225, 2620, 12501],
                        [5238, 2626, 12492],
                        [5248, 2631, 12485],
                        [5259, 2636, 12477],
                        [5269, 2641, 12470],
                        [5282, 2646, 12461],
                        [5293, 2651, 12453],
                        [5304, 2656, 12446],
                        [5316, 2660, 12437],
                        [5331, 2665, 12428],
                        [5348, 2670, 12418],
                        [5362, 2673, 12409],
                        [5375, 2676, 12402],
                        [5390, 2679, 12393],
                        [5407, 2682, 12384],
                        [5425, 2684, 12374],
                        [5450, 2687, 12361],
                        [5477, 2690, 12346],
                        [5503, 2692, 12333],
                        [5527, 2694, 12320],
                        [5552, 2697, 12307],
                        [5578, 2699, 12293],
                        [5607, 2703, 12277],
                        [5624, 2705, 12267],
                        [5642, 2708, 12257],
                        [5658, 2711, 12248],
                        [5673, 2714, 12238],
                        [5682, 2716, 12233],
                        [5695, 2720, 12225],
                        [5699, 2721, 12222],
                        [5708, 2723, 12217],
                        [5721, 2727, 12208],
                        [5733, 2731, 12199],
                        [5745, 2736, 12191],
                        [5754, 2740, 12184],
                        [5756, 2741, 12182],
                        [5758, 2742, 12181],
                        [5766, 2746, 12174],
                        [5769, 2751, 12164],
                        [5776, 2756, 12157],
                        [5782, 2760, 12151],
                        [5788, 2765, 12145],
                        [5795, 2771, 12139],
                        [5802, 2776, 12135],
                        [5807, 2780, 12132],
                        [5808, 2781, 12132],
                        [5808, 2782, 12131],
                        [5812, 2784, 12130],
                        [5817, 2792, 12125],
                        [5821, 2799, 12121],
                        [5823, 2805, 12117],
                        [5824, 2812, 12113],
                        [5824, 2819, 12110],
                        [5824, 2826, 12107],
                        [5824, 2832, 12104],
                        [5823, 2838, 12101],
                        [5823, 2844, 12099],
                        [5823, 2845, 12098],
                        [5823, 2850, 12095],
                        [5824, 2856, 12092],
                        [5827, 2861, 12088],
                        [5827, 2862, 12088],
                        [5828, 2862, 12087],
                        [5828, 2863, 12087],
                        [5829, 2864, 12086],
                        [5829, 2865, 12085],
                        [5835, 2870, 12080],
                        [5836, 2870, 12080],
                        [5844, 2877, 12073],
                        [5852, 2882, 12067],
                        [5855, 2883, 12065],
                        [5865, 2887, 12059],
                        [5879, 2893, 12050],
                        [5884, 2895, 12046],
                        [5896, 2899, 12039],
                        [5908, 2903, 12032],
                        [5914, 2906, 12025],
                        [5927, 2910, 12019],
                        [5944, 2915, 12011],
                        [5959, 2920, 12003],
                        [5972, 2925, 11995],
                        [5985, 2930, 11988],
                        [5988, 2931, 11986],
                        [6000, 2936, 11979],
                        [6012, 2942, 11971],
                        [6026, 2948, 11963],
                        [6038, 2954, 11955],
                        [6049, 2960, 11948],
                        [6060, 2965, 11941],
                        [6072, 2971, 11934],
                        [6087, 2977, 11926],
                        [6100, 2982, 11918],
                        [6115, 2986, 11910],
                        [6126, 2989, 11904],
                        [6146, 2994, 11894],
                        [6165, 2997, 11884],
                        [6185, 3000, 11875],
                        [6204, 3003, 11866],
                        [6224, 3005, 11857],
                        [6241, 3007, 11849],
                        [6254, 3008, 11844],
                        [6286, 3010, 11830],
                        [6314, 3011, 11818],
                        [6340, 3012, 11808],
                        [6365, 3013, 11797],
                        [6391, 3014, 11786],
                        [6421, 3015, 11774],
                        [6449, 3017, 11761],
                        [6472, 3019, 11752],
                        [6487, 3021, 11745],
                        [6501, 3023, 11738],
                        [6517, 3026, 11730],
                        [6537, 3030, 11720],
                        [6555, 3034, 11711],
                        [6573, 3039, 11701],
                        [6587, 3044, 11693],
                        [6595, 3047, 11689],
                        [6608, 3053, 11681],
                        [6613, 3056, 11678],
                        [6622, 3062, 11672],
                        [6623, 3063, 11671],
                        [6630, 3069, 11665],
                        [6634, 3075, 11661],
                        [6635, 3077, 11659],
                        [6637, 3081, 11657],
                        [6637, 3084, 11655],
                        [6637, 3089, 11653],
                        [6635, 3095, 11651],
                        [6634, 3098, 11650],
                        [6633, 3100, 11649],
                        [6630, 3107, 11648],
                        [6628, 3109, 11647],
                        [6628, 3110, 11647],
                        [6624, 3116, 11646],
                        [6621, 3121, 11644],
                        [6620, 3122, 11644],
                        [6617, 3127, 11643],
                        [6613, 3132, 11642],
                        [6613, 3133, 11642],
                        [6612, 3133, 11642],
                        [6612, 3134, 11642],
                        [6611, 3135, 11642],
                        [6611, 3136, 11641],
                        [6606, 3143, 11640],
                        [6605, 3144, 11639],
                        [6604, 3146, 11639],
                        [6600, 3152, 11638],
                        [6596, 3159, 11636],
                        [6592, 3165, 11635],
                        [6588, 3171, 11633],
                        [6585, 3177, 11632],
                        [6581, 3183, 11630],
                        [6577, 3190, 11628],
                        [6574, 3198, 11625],
                        [6571, 3206, 11622],
                        [6569, 3213, 11619],
                        [6567, 3220, 11616],
                        [6566, 3227, 11613],
                        [6565, 3233, 11610],
                        [6563, 3263, 11593],
                        [6562, 3270, 11590],
                        [6562, 3277, 11586],
                        [6561, 3283, 11582],
                        [6560, 3290, 11579],
                        [6560, 3297, 11575],
                        [6558, 3301, 11572],
                        [6558, 3304, 11571],
                        [6558, 3309, 11568],
                        [6558, 3310, 11567],
                        [6557, 3316, 11564],
                        [6557, 3317, 11563],
                        [6557, 3323, 11560],
                        [6556, 3328, 11557],
                        [6556, 3334, 11554],
                        [6555, 3342, 11549],
                        [6554, 3350, 11545],
                        [6553, 3357, 11541],
                        [6552, 3365, 11537],
                        [6551, 3373, 11532],
                        [6551, 3381, 11527],
                        [6550, 3389, 11523],
                        [6549, 3398, 11517],
                        [6549, 3406, 11513],
                        [6550, 3413, 11508],
                        [6553, 3422, 11502],
                        [6556, 3430, 11495],
                        [6561, 3438, 11489],
                        [6568, 3445, 11482],
                        [6575, 3452, 11474],
                        [6583, 3458, 11467],
                        [6593, 3464, 11460],
                        [6603, 3471, 11451],
                        [6613, 3476, 11444],
                        [6623, 3481, 11437],
                        [6633, 3486, 11429],
                        [6646, 3492, 11421],
                        [6659, 3497, 11412],
                        [6673, 3502, 11403],
                        [6687, 3506, 11394],
                        [6701, 3511, 11385],
                        [6714, 3515, 11376],
                        [6728, 3520, 11367],
                        [6743, 3524, 11357],
                        [6767, 3532, 11341],
                        [6791, 3539, 11325],
                        [6813, 3546, 11310],
                        [6834, 3553, 11295],
                        [6856, 3560, 11281],
                        [6878, 3567, 11266],
                        [6900, 3575, 11252],
                        [6923, 3582, 11236],
                        [6928, 3584, 11231],
                        [6960, 3594, 11211],
                        [6974, 3599, 11202],
                        [6989, 3604, 11193],
                        [7005, 3609, 11183],
                        [7020, 3615, 11174],
                        [7032, 3620, 11166],
                        [7046, 3625, 11158],
                        [7059, 3631, 11149],
                        [7070, 3637, 11141],
                        [7082, 3642, 11135],
                        [7093, 3648, 11127],
                        [7103, 3654, 11120],
                        [7112, 3659, 11114],
                        [7120, 3665, 11108],
                        [7128, 3671, 11102],
                        [7136, 3677, 11095],
                        [7143, 3684, 11089],
                        [7151, 3691, 11083],
                        [7156, 3697, 11078],
                        [7163, 3703, 11072],
                        [7169, 3710, 11066],
                        [7176, 3718, 11060],
                        [7183, 3727, 11052],
                        [7191, 3735, 11045],
                        [7198, 3743, 11038],
                        [7205, 3750, 11032],
                        [7211, 3758, 11026],
                        [7218, 3765, 11020],
                        [7225, 3773, 11013],
                        [7226, 3774, 11012],
                        [7246, 3798, 10991],
                        [7254, 3807, 10982],
                        [7261, 3817, 10973],
                        [7268, 3826, 10964],
                        [7275, 3835, 10955],
                        [7282, 3845, 10945],
                        [7288, 3854, 10936],
                        [7295, 3864, 10926],
                        [7302, 3875, 10916],
                        [7305, 3881, 10910],
                        [7309, 3886, 10905],
                        [7309, 3886, 10904],
                        [7312, 3891, 10899],
                        [7313, 3892, 10899],
                        [7318, 3898, 10893],
                        [7323, 3904, 10886],
                        [7328, 3909, 10880],
                        [7330, 3911, 10878],
                        [7332, 3912, 10877],
                        [7333, 3912, 10876],
                        [7339, 3916, 10870],
                        [7348, 3921, 10863],
                        [7355, 3925, 10857],
                        [7367, 3929, 10848],
                        [7376, 3932, 10842],
                        [7389, 3936, 10834],
                        [7403, 3939, 10825],
                        [7418, 3942, 10816],
                        [7435, 3945, 10806],
                        [7454, 3948, 10796],
                        [7472, 3951, 10785],
                        [7492, 3954, 10774],
                        [7509, 3956, 10764],
                        [7525, 3959, 10754],
                        [7542, 3963, 10744],
                        [7557, 3966, 10735],
                        [7562, 3967, 10732],
                        [7573, 3969, 10725],
                        [7573, 3969, 10725],
                        [7593, 3974, 10714],
                        [7609, 3977, 10703],
                        [7624, 3981, 10693],
                        [7641, 3985, 10683],
                        [7658, 3989, 10672],
                        [7676, 3994, 10661],
                        [7691, 3997, 10652],
                        [7708, 4001, 10641],
                        [7724, 4005, 10632],
                        [7739, 4008, 10623],
                        [7754, 4012, 10615],
                        [7763, 4014, 10609],
                        [7771, 4015, 10605],
                        [7791, 4020, 10594],
                        [7809, 4024, 10585],
                        [7826, 4028, 10576],
                        [7837, 4030, 10570],
                        [7876, 4039, 10549],
                        [7877, 4039, 10548],
                        [7893, 4043, 10540],
                        [7911, 4047, 10531],
                        [7929, 4050, 10522],
                        [7947, 4055, 10512],
                        [7961, 4059, 10505],
                        [7974, 4063, 10498],
                        [7985, 4067, 10491],
                        [7998, 4071, 10484],
                        [8006, 4075, 10479],
                        [8017, 4080, 10472],
                        [8026, 4084, 10466],
                        [8036, 4089, 10460],
                        [8046, 4095, 10453],
                        [8057, 4100, 10447],
                        [8067, 4106, 10440],
                        [8083, 4114, 10430],
                        [8096, 4121, 10421],
                        [8108, 4127, 10414],
                        [8124, 4134, 10404],
                        [8140, 4141, 10394],
                        [8157, 4148, 10385],
                        [8176, 4154, 10374],
                        [8187, 4158, 10368],
                        [8200, 4161, 10361],
                        [8217, 4164, 10353],
                        [8236, 4167, 10344],
                        [8253, 4170, 10335],
                        [8272, 4174, 10326],
                        [8289, 4177, 10318],
                        [8305, 4182, 10309],
                        [8320, 4186, 10301],
                        [8334, 4190, 10294],
                        [8347, 4195, 10286],
                        [8358, 4201, 10279],
                        [8366, 4205, 10274],
                        [8371, 4208, 10271],
                        [8375, 4212, 10267],
                        [8381, 4218, 10262],
                        [8385, 4224, 10258],
                        [8386, 4224, 10258],
                        [8387, 4229, 10255],
                        [8388, 4235, 10253],
                        [8386, 4240, 10251],
                        [8385, 4246, 10249],
                        [8383, 4253, 10247],
                        [8382, 4261, 10244],
                        [8381, 4267, 10242],
                        [8382, 4271, 10240],
                        [8384, 4278, 10236],
                        [8386, 4282, 10233],
                        [8391, 4288, 10228],
                        [8394, 4291, 10226],
                        [8400, 4295, 10221],
                        [8408, 4301, 10215],
                        [8418, 4306, 10208],
                        [8429, 4312, 10200],
                        [8441, 4318, 10192],
                        [8452, 4324, 10184],
                        [8464, 4331, 10176],
                        [8472, 4336, 10170],
                        [8479, 4341, 10164],
                        [8486, 4346, 10158],
                        [8492, 4352, 10152],
                        [8498, 4358, 10147],
                        [8499, 4359, 10145],
                        [8504, 4366, 10138],
                        [8508, 4372, 10134],
                        [8511, 4377, 10130],
                        [8513, 4384, 10124],
                        [8513, 4385, 10124],
                        [8515, 4393, 10118],
                        [8515, 4401, 10114],
                        [8514, 4409, 10109],
                        [8512, 4416, 10105],
                        [8509, 4424, 10102],
                        [8505, 4432, 10099],
                        [8501, 4437, 10097],
                        [8500, 4438, 10097],
                        [8498, 4441, 10096],
                        [8492, 4447, 10095],
                        [8489, 4450, 10094],
                        [8483, 4456, 10093],
                        [8476, 4461, 10092],
                        [8474, 4463, 10092],
                        [8462, 4471, 10092],
                        [8450, 4478, 10091],
                        [8439, 4485, 10092],
                        [8427, 4492, 10092],
                        [8413, 4499, 10094],
                        [8396, 4506, 10096],
                        [8381, 4512, 10098],
                        [8378, 4514, 10098],
                        [8376, 4514, 10098],
                        [8374, 4515, 10099],
                        [8372, 4516, 10099],
                        [8370, 4517, 10099],
                        [8362, 4520, 10100],
                        [8361, 4520, 10101],
                        [8358, 4521, 10101],
                        [8344, 4526, 10103],
                        [8330, 4531, 10106],
                        [8314, 4537, 10109],
                        [8295, 4542, 10113],
                        [8277, 4548, 10117],
                        [8257, 4554, 10121],
                        [8237, 4560, 10125],
                        [8216, 4566, 10129],
                        [8196, 4572, 10133],
                        [8179, 4578, 10137],
                        [8163, 4583, 10140],
                        [8146, 4589, 10143],
                        [8133, 4594, 10145],
                        [8120, 4600, 10146],
                        [8114, 4603, 10147],
                        [8109, 4605, 10146],
                        [8104, 4608, 10146],
                        [8099, 4612, 10146],
                        [8098, 4613, 10146],
                        [8097, 4613, 10146],
                        [8094, 4616, 10146],
                        [8093, 4617, 10145],
                        [8092, 4618, 10145],
                        [8089, 4621, 10144],
                        [8088, 4623, 10144],
                        [8087, 4623, 10143],
                        [8086, 4624, 10143],
                        [8086, 4625, 10143],
                        [8085, 4626, 10142],
                        [8085, 4627, 10142],
                        [8084, 4628, 10141],
                        [8082, 4633, 10139],
                        [8080, 4639, 10135],
                        [8080, 4642, 10133],
                        [8081, 4647, 10129],
                        [8084, 4653, 10123],
                        [8087, 4657, 10119],
                        [8091, 4661, 10114],
                        [8096, 4665, 10109],
                        [8104, 4669, 10103],
                        [8110, 4673, 10097],
                        [8115, 4677, 10087],
                        [8121, 4680, 10082],
                        [8136, 4684, 10077],
                        [8151, 4688, 10069],
                        [8162, 4691, 10061],
                        [8183, 4696, 10048],
                        [8197, 4700, 10041],
                        [8210, 4703, 10033],
                        [8225, 4707, 10024],
                        [8242, 4712, 10015],
                        [8257, 4717, 10005],
                        [8274, 4723, 9995],
                        [8290, 4730, 9985],
                        [8306, 4736, 9975],
                        [8320, 4743, 9965],
                        [8334, 4750, 9956],
                        [8349, 4757, 9946],
                        [8367, 4764, 9936],
                        [8386, 4771, 9924],
                        [8406, 4778, 9913],
                        [8421, 4782, 9905],
                        [8429, 4784, 9900],
                        [8437, 4786, 9895],
                        [8455, 4790, 9887],
                        [8473, 4793, 9878],
                        [8492, 4797, 9868],
                        [8513, 4801, 9857],
                        [8531, 4804, 9848],
                        [8561, 4810, 9833],
                        [8595, 4816, 9816],
                        [8627, 4821, 9800],
                        [8656, 4827, 9785],
                        [8684, 4832, 9771],
                        [8711, 4837, 9757],
                        [8738, 4842, 9744],
                        [8765, 4847, 9730],
                        [8778, 4849, 9723],
                        [8785, 4851, 9718],
                        [8802, 4854, 9711],
                        [8818, 4857, 9702],
                        [8836, 4860, 9693],
                        [8853, 4863, 9684],
                        [8870, 4866, 9675],
                        [8886, 4869, 9667],
                        [8903, 4873, 9657],
                        [8910, 4874, 9652],
                        [8980, 4887, 9616],
                        [8997, 4890, 9607],
                        [9014, 4894, 9598],
                        [9031, 4897, 9588],
                        [9050, 4900, 9578],
                        [9071, 4904, 9567],
                        [9090, 4908, 9556],
                        [9109, 4912, 9546],
                        [9112, 4913, 9544],
                        [9124, 4916, 9536],
                        [9138, 4921, 9528],
                        [9151, 4926, 9519],
                        [9163, 4932, 9511],
                        [9173, 4938, 9503],
                        [9181, 4943, 9497],
                        [9185, 4947, 9493],
                        [9189, 4953, 9487],
                        [9193, 4960, 9482],
                        [9195, 4967, 9477],
                        [9197, 4976, 9472],
                        [9198, 4985, 9467],
                        [9199, 4993, 9462],
                        [9200, 5001, 9457],
                        [9201, 5009, 9452],
                        [9202, 5017, 9448],
                        [9203, 5025, 9443],
                        [9204, 5034, 9438],
                        [9204, 5041, 9434],
                        [9205, 5048, 9430],
                        [9206, 5054, 9426],
                        [9207, 5061, 9422],
                        [9207, 5067, 9418],
                        [9208, 5073, 9415],
                        [9209, 5078, 9412],
                        [9209, 5084, 9408],
                        [9210, 5090, 9405],
                        [9211, 5097, 9400],
                        [9212, 5104, 9396],
                        [9214, 5109, 9393],
                        [9217, 5116, 9388],
                        [9222, 5122, 9382],
                        [9228, 5128, 9377],
                        [9232, 5131, 9373],
                        [9233, 5132, 9372],
                        [9235, 5133, 9371],
                        [9236, 5134, 9370],
                        [9238, 5135, 9369],
                        [9245, 5141, 9362],
                        [9248, 5143, 9360],
                        [9258, 5147, 9353],
                        [9269, 5152, 9346],
                        [9277, 5156, 9340],
                        [9294, 5162, 9329],
                        [9312, 5168, 9317],
                        [9332, 5173, 9305],
                        [9353, 5178, 9293],
                        [9376, 5182, 9279],
                        [9400, 5186, 9266],
                        [9421, 5189, 9255],
                        [9440, 5191, 9245],
                        [9458, 5193, 9236],
                        [9478, 5195, 9226],
                        [9497, 5196, 9216],
                        [9528, 5198, 9202],
                        [9559, 5201, 9187],
                        [9586, 5203, 9173],
                        [9611, 5206, 9160],
                        [9630, 5209, 9149],
                        [9653, 5214, 9136],
                        [9673, 5218, 9124],
                        [9692, 5223, 9113],
                        [9709, 5228, 9104],
                        [9718, 5232, 9098],
                        [9729, 5237, 9090],
                        [9738, 5243, 9082],
                        [9746, 5249, 9076],
                        [9753, 5255, 9070],
                        [9758, 5262, 9064],
                        [9762, 5268, 9059],
                        [9762, 5271, 9056],
                        [9770, 5288, 9042],
                        [9776, 5294, 9039],
                        [9780, 5299, 9035],
                        [9783, 5305, 9031],
                        [9787, 5310, 9026],
                        [9791, 5316, 9021],
                        [9798, 5323, 9015],
                        [9804, 5329, 9009],
                        [9813, 5335, 9002],
                        [9814, 5336, 9001],
                        [9825, 5343, 8993],
                        [9836, 5348, 8986],
                        [9847, 5353, 8979],
                        [9861, 5358, 8970],
                        [9875, 5363, 8961],
                        [9891, 5368, 8952],
                        [9906, 5373, 8943],
                        [9921, 5377, 8934],
                        [9938, 5381, 8925],
                        [9957, 5384, 8915],
                        [9978, 5388, 8904],
                        [10001, 5391, 8893],
                        [10025, 5395, 8880],
                        [10048, 5398, 8869],
                        [10070, 5400, 8858],
                        [10092, 5403, 8848],
                        [10114, 5405, 8837],
                        [10137, 5408, 8826],
                        [10142, 5409, 8822],
                        [10430, 5441, 8682],
                        [10458, 5444, 8668],
                        [10487, 5448, 8654],
                        [10515, 5451, 8640],
                        [10543, 5454, 8627],
                        [10571, 5458, 8613],
                        [10598, 5461, 8600],
                        [10609, 5462, 8595],
                        [10679, 5470, 8562],
                        [10698, 5472, 8552],
                        [10724, 5475, 8540],
                        [10746, 5478, 8530],
                        [10768, 5480, 8520],
                        [10791, 5483, 8509],
                        [10814, 5485, 8498],
                        [10836, 5488, 8488],
                        [10867, 5491, 8474],
                        [10903, 5495, 8457],
                        [10939, 5500, 8441],
                        [10976, 5504, 8424],
                        [11012, 5508, 8407],
                        [11049, 5512, 8390],
                        [11087, 5516, 8373],
                        [11124, 5520, 8355],
                        [11160, 5524, 8338],
                        [11196, 5528, 8321],
                        [11231, 5533, 8303],
                        [11268, 5537, 8285],
                        [11305, 5541, 8267],
                        [11342, 5546, 8249],
                        [11380, 5550, 8230],
                        [11418, 5554, 8211],
                        [11449, 5558, 8196],
                        [11475, 5561, 8183],
                        [11500, 5563, 8171],
                        [11529, 5567, 8157],
                        [11555, 5570, 8143],
                        [11581, 5573, 8130],
                        [11606, 5576, 8118],
                        [11628, 5579, 8106],
                        [11650, 5583, 8094],
                        [11673, 5586, 8082],
                        [11697, 5589, 8069],
                        [11723, 5593, 8054],
                        [11745, 5597, 8042],
                        [11769, 5601, 8029],
                        [11793, 5604, 8015],
                        [11816, 5608, 8002],
                        [11839, 5612, 7989],
                        [11861, 5615, 7977],
                        [11884, 5619, 7965],
                        [11907, 5623, 7952],
                        [11916, 5624, 7947],
                        [11940, 5628, 7934],
                        [11960, 5631, 7923],
                        [11978, 5634, 7913],
                        [11997, 5637, 7903],
                        [12018, 5640, 7892],
                        [12043, 5645, 7878],
                        [12055, 5646, 7872],
                        [12072, 5649, 7863],
                        [12091, 5652, 7852],
                        [12110, 5655, 7842],
                        [12126, 5658, 7834],
                        [12144, 5661, 7824],
                        [12160, 5665, 7815],
                        [12162, 5665, 7814],
                        [12178, 5669, 7805],
                        [12193, 5674, 7795],
                        [12205, 5679, 7787],
                        [12217, 5684, 7778],
                        [12225, 5688, 7772],
                        [12236, 5695, 7764],
                        [12242, 5700, 7758],
                        [12246, 5705, 7753],
                        [12251, 5711, 7747],
                        [12253, 5717, 7743],
                        [12253, 5723, 7740],
                        [12252, 5728, 7737],
                        [12252, 5731, 7735],
                        [12251, 5732, 7735],
                        [12251, 5733, 7735],
                        [12249, 5738, 7732],
                        [12248, 5739, 7732],
                        [12248, 5740, 7732],
                        [12246, 5745, 7730],
                        [12246, 5746, 7729],
                        [12244, 5751, 7727],
                        [12241, 5756, 7725],
                        [12241, 5759, 7724],
                        [12239, 5761, 7722],
                        [12237, 5768, 7720],
                        [12235, 5775, 7717],
                        [12233, 5782, 7714],
                        [12230, 5792, 7709],
                        [12226, 5802, 7704],
                        [12223, 5812, 7700],
                        [12219, 5822, 7696],
                        [12215, 5831, 7691],
                        [12210, 5841, 7687],
                        [12206, 5851, 7682],
                        [12201, 5861, 7678],
                        [12197, 5871, 7673],
                        [12192, 5881, 7668],
                        [12188, 5890, 7664],
                        [12185, 5898, 7661],
                        [12182, 5906, 7657],
                        [12179, 5913, 7654],
                        [12176, 5922, 7649],
                        [12174, 5930, 7645],
                        [12173, 5938, 7640],
                        [12174, 5945, 7636],
                        [12176, 5952, 7631],
                        [12178, 5958, 7627],
                        [12182, 5964, 7622],
                        [12185, 5971, 7617],
                        [12190, 5977, 7613],
                        [12192, 5979, 7610],
                        [12196, 5985, 7605],
                        [12200, 5991, 7600],
                        [12204, 5997, 7596],
                        [12207, 6003, 7592],
                        [12210, 6009, 7587],
                        [12213, 6016, 7582],
                        [12214, 6021, 7578],
                        [12214, 6022, 7577],
                        [12214, 6023, 7577],
                        [12214, 6024, 7576],
                        [12214, 6030, 7572],
                        [12213, 6035, 7569],
                        [12212, 6041, 7566],
                        [12211, 6049, 7561],
                        [12210, 6055, 7557],
                        [12210, 6056, 7556],
                        [12211, 6061, 7552],
                        [12213, 6065, 7548],
                        [12218, 6072, 7541],
                        [12225, 6078, 7534],
                        [12230, 6082, 7529],
                        [12231, 6083, 7528],
                        [12237, 6088, 7521],
                        [12243, 6094, 7514],
                        [12245, 6097, 7511],
                        [12245, 6097, 7511],
                        [12246, 6098, 7510],
                        [12246, 6099, 7509],
                        [12247, 6100, 7508],
                        [12250, 6105, 7503],
                        [12251, 6110, 7499],
                        [12251, 6113, 7497],
                        [12250, 6119, 7493],
                        [12247, 6126, 7490],
                        [12244, 6131, 7487],
                        [12241, 6135, 7486],
                        [12238, 6137, 7485],
                        [12223, 6143, 7479],
                        [12214, 6150, 7479],
                        [12209, 6156, 7482],
                        [12208, 6158, 7484],
                        [12208, 6159, 7485],
                        [12196, 6165, 7487],
                        [12182, 6171, 7490],
                        [12167, 6177, 7493],
                        [12156, 6181, 7497],
                        [12140, 6186, 7502],
                        [12126, 6190, 7506],
                        [12111, 6194, 7511],
                        [12096, 6198, 7516],
                        [12080, 6202, 7521],
                        [12064, 6207, 7526],
                        [12050, 6211, 7531],
                        [12049, 6212, 7531],
                        [12046, 6213, 7532],
                        [12045, 6213, 7532],
                        [12041, 6215, 7533],
                        [12039, 6215, 7534],
                        [12034, 6217, 7535],
                        [12022, 6222, 7538],
                        [12012, 6227, 7541],
                        [12004, 6231, 7542],
                        [11996, 6236, 7543],
                        [11989, 6242, 7544],
                        [11983, 6247, 7544],
                        [11979, 6252, 7544],
                        [11975, 6258, 7543],
                        [11972, 6263, 7542],
                        [11970, 6267, 7540],
                        [11969, 6273, 7538],
                        [11967, 6279, 7536],
                        [11967, 6285, 7533],
                        [11969, 6289, 7530],
                        [11971, 6295, 7526],
                        [11975, 6300, 7521],
                        [11976, 6301, 7521],
                        [11977, 6303, 7519],
                        [11978, 6304, 7518],
                        [11982, 6309, 7514],
                        [11984, 6311, 7512],
                        [11989, 6317, 7507],
                        [11995, 6322, 7501],
                        [12002, 6328, 7496],
                        [12012, 6335, 7487],
                        [12021, 6341, 7480],
                        [12030, 6347, 7473],
                        [12039, 6353, 7466],
                        [12048, 6358, 7459],
                        [12056, 6364, 7453],
                        [12057, 6365, 7451],
                        [12061, 6367, 7448],
                        [12072, 6373, 7441],
                        [12081, 6379, 7434],
                        [12090, 6385, 7427],
                        [12099, 6391, 7420],
                        [12107, 6397, 7413],
                        [12119, 6407, 7402],
                        [12130, 6417, 7392],
                        [12138, 6427, 7382],
                        [12145, 6436, 7374],
                        [12152, 6445, 7365],
                        [12159, 6453, 7357],
                        [12167, 6462, 7348],
                        [12178, 6470, 7338],
                        [12190, 6478, 7328],
                        [12200, 6484, 7319],
                        [12214, 6492, 7308],
                        [12228, 6498, 7298],
                        [12243, 6505, 7287],
                        [12262, 6511, 7275],
                        [12278, 6517, 7264],
                        [12282, 6519, 7261],
                        [12318, 6531, 7236],
                        [12335, 6536, 7227],
                        [12349, 6541, 7218],
                        [12364, 6546, 7209],
                        [12376, 6550, 7202],
                        [12392, 6555, 7193],
                        [12405, 6559, 7185],
                        [12421, 6564, 7176],
                        [12437, 6569, 7167],
                        [12454, 6575, 7157],
                        [12475, 6582, 7145],
                        [12495, 6589, 7133],
                        [12513, 6597, 7122],
                        [12534, 6607, 7108],
                        [12554, 6617, 7096],
                        [12571, 6627, 7084],
                        [12584, 6638, 7073],
                        [12593, 6647, 7065],
                        [12601, 6656, 7058],
                        [12605, 6663, 7053],
                        [12609, 6670, 7048],
                        [12614, 6677, 7043],
                        [12615, 6678, 7042],
                        [12620, 6685, 7037],
                        [12625, 6692, 7031],
                        [12631, 6698, 7026],
                        [12637, 6704, 7021],
                        [12645, 6710, 7015],
                        [12653, 6717, 7008],
                        [12658, 6720, 7005],
                        [12666, 6726, 6999],
                        [12674, 6732, 6992],
                        [12682, 6739, 6986],
                        [12683, 6740, 6985],
                        [12684, 6741, 6984],
                        [12691, 6747, 6979],
                        [12697, 6753, 6973],
                        [12703, 6760, 6968],
                        [12703, 6761, 6967],
                        [12703, 6761, 6966],
                        [12707, 6767, 6962],
                        [12710, 6773, 6959],
                        [12712, 6778, 6955],
                        [12714, 6786, 6951],
                        [12715, 6793, 6947],
                        [12715, 6801, 6944],
                        [12713, 6808, 6941],
                        [12709, 6816, 6939],
                        [12704, 6825, 6937],
                        [12698, 6832, 6936],
                        [12691, 6842, 6935],
                        [12685, 6850, 6933],
                        [12680, 6859, 6931],
                        [12676, 6867, 6928],
                        [12672, 6875, 6925],
                        [12669, 6883, 6921],
                        [12668, 6890, 6917],
                        [12668, 6895, 6914],
                        [12667, 6900, 6910],
                        [12669, 6906, 6906],
                        [12671, 6913, 6901],
                        [12673, 6919, 6896],
                        [12677, 6925, 6890],
                        [12682, 6931, 6884],
                        [12688, 6937, 6877],
                        [12695, 6943, 6870],
                        [12703, 6949, 6863],
                        [12711, 6955, 6855],
                        [12722, 6961, 6846],
                        [12735, 6968, 6836],
                        [12748, 6974, 6827],
                        [12761, 6980, 6817],
                        [12774, 6985, 6808],
                        [12788, 6989, 6799],
                        [12802, 6994, 6789],
                        [12821, 7000, 6777],
                        [12841, 7005, 6765],
                        [12863, 7010, 6753],
                        [12887, 7015, 6739],
                        [12913, 7020, 6725],
                        [12936, 7023, 6713],
                        [12962, 7027, 6701],
                        [12988, 7031, 6688],
                        [13015, 7035, 6675],
                        [13042, 7038, 6662],
                        [13071, 7041, 6648],
                        [13101, 7044, 6634],
                        [13133, 7048, 6619],
                        [13166, 7051, 6602],
                        [13196, 7055, 6589],
                        [13214, 7057, 6579],
                        [13233, 7059, 6571],
                        [13251, 7061, 6562],
                        [13270, 7063, 6553],
                        [13277, 7064, 6549],
                        [13297, 7067, 6539],
                        [13317, 7070, 6529],
                        [13339, 7074, 6518],
                        [13361, 7077, 6507],
                        [13380, 7081, 6496],
                        [13393, 7083, 6490],
                        [13410, 7087, 6480],
                        [13426, 7091, 6471],
                        [13441, 7095, 6463],
                        [13455, 7099, 6455],
                        [13468, 7103, 6447],
                        [13480, 7107, 6440],
                        [13492, 7111, 6433],
                        [13503, 7115, 6425],
                        [13522, 7123, 6413],
                        [13537, 7131, 6402],
                        [13551, 7138, 6391],
                        [13562, 7145, 6383],
                        [13572, 7153, 6374],
                        [13579, 7160, 6367],
                        [13586, 7167, 6360],
                        [13591, 7174, 6354],
                        [13591, 7175, 6353],
                        [13594, 7181, 6349],
                        [13596, 7186, 6346],
                        [13597, 7191, 6342],
                        [13599, 7197, 6339],
                        [13599, 7202, 6335],
                        [13598, 7203, 6334],
                        [13597, 7206, 6332],
                        [13598, 7209, 6332],
                        [13597, 7214, 6330],
                        [13597, 7215, 6330],
                        [13595, 7220, 6328],
                        [13594, 7222, 6327],
                        [13594, 7223, 6327],
                        [13593, 7224, 6327],
                        [13590, 7230, 6325],
                        [13586, 7235, 6324],
                        [13581, 7242, 6323],
                        [13575, 7250, 6322],
                        [13567, 7258, 6321],
                        [13560, 7267, 6320],
                        [13552, 7276, 6319],
                        [13543, 7285, 6318],
                        [13536, 7292, 6318],
                        [13530, 7298, 6317],
                        [13523, 7305, 6316],
                        [13516, 7312, 6316],
                        [13510, 7318, 6315],
                        [13504, 7325, 6314],
                        [13498, 7332, 6313],
                        [13492, 7340, 6312],
                        [13486, 7347, 6310],
                        [13481, 7353, 6309],
                        [13476, 7360, 6307],
                        [13473, 7367, 6305],
                        [13469, 7375, 6302],
                        [13468, 7377, 6301],
                        [13465, 7381, 6299],
                        [13463, 7390, 6296],
                        [13461, 7398, 6292],
                        [13460, 7406, 6287],
                        [13460, 7414, 6283],
                        [13461, 7422, 6278],
                        [13463, 7429, 6272],
                        [13465, 7436, 6267],
                        [13468, 7442, 6262],
                        [13471, 7449, 6257],
                        [13474, 7455, 6252],
                        [13476, 7461, 6247],
                        [13480, 7468, 6242],
                        [13481, 7470, 6240],
                        [13486, 7479, 6232],
                        [13491, 7488, 6225],
                        [13497, 7495, 6218],
                        [13501, 7503, 6212],
                        [13505, 7510, 6206],
                        [13509, 7517, 6200],
                        [13512, 7526, 6193],
                        [13516, 7533, 6187],
                        [13518, 7539, 6183],
                        [13519, 7545, 6178],
                        [13520, 7552, 6174],
                        [13520, 7559, 6170],
                        [13520, 7566, 6166],
                        [13518, 7574, 6162],
                        [13517, 7579, 6159],
                        [13515, 7585, 6157],
                        [13512, 7591, 6155],
                        [13508, 7597, 6153],
                        [13506, 7600, 6152],
                        [13505, 7601, 6151],
                        [13503, 7604, 6151],
                        [13502, 7605, 6151],
                        [13498, 7611, 6149],
                        [13492, 7617, 6147],
                        [13486, 7624, 6146],
                        [13479, 7630, 6146],
                        [13471, 7637, 6145],
                        [13462, 7644, 6145],
                        [13457, 7647, 6145],
                        [13455, 7649, 6145],
                        [13454, 7650, 6145],
                        [13453, 7651, 6145],
                        [13444, 7656, 6145],
                        [13434, 7662, 6146],
                        [13425, 7667, 6147],
                        [13416, 7673, 6148],
                        [13414, 7674, 6148],
                        [13412, 7675, 6148],
                        [13401, 7680, 6150],
                        [13396, 7683, 6150],
                        [13395, 7683, 6150],
                        [13393, 7684, 6151],
                        [13383, 7690, 6152],
                        [13372, 7695, 6154],
                        [13360, 7700, 6155],
                        [13346, 7707, 6158],
                        [13330, 7713, 6160],
                        [13316, 7720, 6162],
                        [13302, 7726, 6164],
                        [13289, 7732, 6166],
                        [13275, 7738, 6168],
                        [13264, 7744, 6169],
                        [13252, 7750, 6170],
                        [13240, 7757, 6171],
                        [13229, 7763, 6172],
                        [13218, 7770, 6172],
                        [13208, 7776, 6173],
                        [13197, 7782, 6173],
                        [13183, 7789, 6174],
                        [13171, 7794, 6176],
                        [13157, 7800, 6178],
                        [13141, 7807, 6180],
                        [13124, 7813, 6183],
                        [13108, 7819, 6186],
                        [13093, 7825, 6189],
                        [13085, 7828, 6190],
                        [13073, 7833, 6191],
                        [13061, 7839, 6192],
                        [13055, 7842, 6193],
                        [13051, 7844, 6193],
                        [13041, 7851, 6192],
                        [13033, 7858, 6191],
                        [13031, 7860, 6190],
                        [13027, 7864, 6189],
                        [13023, 7870, 6186],
                        [13022, 7871, 6186],
                        [13019, 7878, 6182],
                        [13018, 7882, 6180],
                        [13017, 7888, 6174],
                        [13016, 7889, 6173],
                        [13018, 7891, 6172],
                        [13018, 7891, 6172],
                        [13020, 7895, 6170],
                        [13021, 7896, 6169],
                        [13022, 7897, 6168],
                        [13025, 7903, 6162],
                        [13030, 7908, 6157],
                        [13041, 7916, 6148],
                        [13055, 7923, 6137],
                        [13072, 7930, 6125],
                        [13088, 7936, 6115],
                        [13106, 7941, 6105],
                        [13126, 7946, 6094],
                        [13147, 7952, 6082],
                        [13152, 7953, 6078],
                        [13170, 7957, 6068],
                        [13187, 7961, 6059],
                        [13201, 7965, 6051],
                        [13215, 7969, 6043],
                        [13227, 7973, 6036],
                        [13241, 7977, 6028],
                        [13256, 7982, 6019],
                        [13269, 7988, 6011],
                        [13284, 7994, 6002],
                        [13296, 7999, 5994],
                        [13308, 8005, 5986],
                        [13321, 8011, 5978],
                        [13336, 8019, 5968],
                        [13351, 8026, 5958],
                        [13364, 8033, 5949],
                        [13378, 8039, 5940],
                        [13392, 8045, 5931],
                        [13401, 8049, 5926],
                        [13402, 8049, 5925],
                        [13404, 8050, 5924],
                        [13413, 8053, 5918],
                        [13422, 8056, 5912],
                        [13437, 8061, 5904],
                        [13452, 8066, 5895],
                        [13467, 8072, 5886],
                        [13480, 8076, 5878],
                        [13493, 8082, 5869],
                        [13507, 8088, 5860],
                        [13520, 8095, 5851],
                        [13532, 8102, 5843],
                        [13543, 8108, 5835],
                        [13552, 8115, 5828],
                        [13562, 8123, 5819],
                        [13571, 8131, 5812],
                        [13579, 8138, 5805],
                        [13587, 8146, 5797],
                        [13594, 8155, 5790],
                        [13598, 8163, 5784],
                        [13601, 8171, 5778],
                        [13602, 8179, 5774],
                        [13603, 8186, 5770],
                        [13603, 8194, 5766],
                        [13603, 8201, 5762],
                        [13604, 8210, 5758],
                        [13604, 8221, 5752],
                        [13604, 8231, 5747],
                        [13604, 8240, 5742],
                        [13603, 8249, 5738],
                        [13603, 8258, 5734],
                        [13602, 8268, 5729],
                        [13602, 8279, 5723],
                        [13602, 8282, 5722],
                        [13600, 8302, 5712],
                        [13600, 8310, 5707],
                        [13600, 8318, 5703],
                        [13600, 8325, 5699],
                        [13600, 8331, 5695],
                        [13600, 8338, 5691],
                        [13601, 8344, 5687],
                        [13601, 8346, 5686],
                        [13602, 8353, 5681],
                        [13603, 8361, 5676],
                        [13605, 8368, 5671],
                        [13606, 8375, 5666],
                        [13608, 8383, 5660],
                        [13609, 8392, 5654],
                        [13611, 8400, 5648],
                        [13613, 8410, 5640],
                        [13615, 8420, 5633],
                        [13618, 8429, 5625],
                        [13619, 8440, 5617],
                        [13620, 8450, 5610],
                        [13621, 8462, 5602],
                        [13620, 8473, 5595],
                        [13618, 8483, 5590],
                        [13616, 8490, 5586],
                        [13615, 8496, 5583],
                        [13612, 8503, 5579],
                        [13611, 8509, 5577],
                        [13608, 8515, 5574],
                        [13605, 8521, 5571],
                        [13603, 8525, 5569],
                        [13601, 8532, 5567],
                        [13598, 8537, 5565],
                        [13597, 8538, 5564],
                        [13594, 8544, 5562],
                        [13591, 8551, 5559],
                        [13587, 8559, 5557],
                        [13582, 8568, 5553],
                        [13578, 8576, 5549],
                        [13575, 8584, 5546],
                        [13571, 8592, 5543],
                        [13567, 8601, 5539],
                        [13563, 8609, 5536],
                        [13558, 8618, 5532],
                        [13553, 8626, 5529],
                        [13550, 8633, 5526],
                        [13548, 8637, 5523],
                        [13548, 8638, 5523],
                        [13548, 8639, 5522],
                        [13548, 8645, 5519],
                        [13548, 8648, 5516],
                        [13552, 8655, 5510],
                        [13558, 8662, 5503],
                        [13566, 8668, 5495],
                        [13576, 8674, 5487],
                        [13590, 8680, 5477],
                        [13605, 8686, 5466],
                        [13623, 8691, 5454],
                        [13639, 8696, 5444],
                        [13660, 8700, 5432],
                        [13683, 8705, 5418],
                        [13704, 8709, 5406],
                        [13724, 8714, 5394],
                        [13742, 8719, 5382],
                        [13760, 8725, 5370],
                        [13773, 8731, 5361],
                        [13782, 8736, 5353],
                        [13791, 8742, 5345],
                        [13796, 8746, 5341],
                        [13801, 8752, 5335],
                        [13806, 8758, 5329],
                        [13810, 8764, 5324],
                        [13814, 8769, 5319],
                        [13818, 8774, 5314],
                        [13820, 8776, 5312],
                        [13825, 8781, 5307],
                        [13826, 8783, 5305],
                        [13827, 8783, 5304],
                        [13831, 8786, 5301],
                        [13837, 8790, 5295],
                        [13840, 8792, 5293],
                        [13849, 8797, 5286],
                        [13860, 8801, 5278],
                        [13871, 8806, 5270],
                        [13884, 8810, 5261],
                        [13897, 8814, 5253],
                        [13912, 8819, 5243],
                        [13928, 8824, 5232],
                        [13942, 8828, 5223],
                        [13954, 8832, 5214],
                        [13967, 8836, 5206],
                        [13981, 8840, 5197],
                        [13994, 8844, 5188],
                        [14005, 8848, 5180],
                        [14016, 8853, 5172],
                        [14025, 8857, 5165],
                        [14034, 8861, 5158],
                        [14038, 8863, 5155],
                        [14044, 8867, 5150],
                        [14054, 8875, 5140],
                        [14063, 8883, 5131],
                        [14069, 8890, 5122],
                        [14073, 8898, 5115],
                        [14074, 8907, 5108],
                        [14074, 8916, 5103],
                        [14071, 8925, 5097],
                        [14065, 8935, 5093],
                        [14060, 8941, 5091],
                        [14060, 8942, 5091],
                        [14059, 8942, 5091],
                        [14057, 8944, 5090],
                        [14056, 8945, 5090],
                        [14053, 8948, 5089],
                        [14052, 8949, 5089],
                        [14052, 8949, 5089],
                        [14051, 8950, 5089],
                        [14047, 8954, 5088],
                        [14040, 8960, 5087],
                        [14036, 8966, 5085],
                        [14035, 8967, 5085],
                        [14034, 8968, 5084],
                        [14033, 8969, 5084],
                        [14033, 8970, 5084],
                        [14032, 8970, 5084],
                        [14030, 8974, 5082],
                        [14026, 8980, 5080],
                        [14024, 8984, 5078],
                        [14021, 8993, 5074],
                        [14020, 9001, 5069],
                        [14021, 9009, 5064],
                        [14023, 9016, 5059],
                        [14026, 9023, 5054],
                        [14029, 9029, 5048],
                        [14030, 9032, 5046],
                        [14035, 9037, 5041],
                        [14037, 9039, 5039],
                        [14042, 9044, 5034],
                        [14047, 9050, 5028],
                        [14053, 9055, 5022],
                        [14060, 9062, 5015],
                        [14066, 9068, 5008],
                        [14068, 9070, 5006],
                        [14076, 9078, 4998],
                        [14085, 9086, 4989],
                        [14092, 9093, 4982],
                        [14099, 9100, 4974],
                        [14107, 9107, 4967],
                        [14114, 9114, 4960],
                        [14122, 9122, 4952],
                        [14131, 9130, 4944],
                        [14140, 9139, 4935],
                        [14149, 9147, 4927],
                        [14157, 9155, 4920],
                        [14164, 9162, 4913],
                        [14172, 9169, 4906],
                        [14180, 9177, 4898],
                        [14189, 9185, 4890],
                        [14198, 9193, 4882],
                        [14207, 9200, 4873],
                        [14217, 9208, 4865],
                        [14227, 9217, 4856],
                        [14238, 9225, 4847],
                        [14250, 9235, 4836],
                        [14263, 9245, 4825],
                        [14275, 9254, 4814],
                        [14285, 9262, 4805],
                        [14295, 9269, 4797],
                        [14304, 9275, 4789],
                        [14313, 9282, 4781],
                        [14321, 9288, 4774],
                        [14330, 9295, 4766],
                        [14337, 9300, 4759],
                        [14344, 9305, 4753],
                        [14345, 9306, 4752],
                        [14356, 9314, 4743],
                        [14366, 9322, 4734],
                        [14377, 9329, 4724],
                        [14386, 9336, 4716],
                        [14395, 9343, 4708],
                        [14404, 9349, 4700],
                        [14414, 9357, 4691],
                        [14423, 9366, 4682],
                        [14431, 9373, 4674],
                        [14438, 9381, 4666],
                        [14445, 9389, 4659],
                        [14451, 9398, 4651],
                        [14456, 9405, 4645],
                        [14460, 9412, 4639],
                        [14464, 9421, 4633],
                        [14467, 9428, 4627],
                        [14469, 9434, 4623],
                        [14470, 9441, 4619],
                        [14472, 9448, 4615],
                        [14473, 9454, 4611],
                        [14474, 9461, 4607],
                        [14473, 9468, 4604],
                        [14472, 9475, 4601],
                        [14469, 9484, 4597],
                        [14465, 9495, 4593],
                        [14460, 9505, 4589],
                        [14455, 9514, 4586],
                        [14449, 9523, 4583],
                        [14441, 9535, 4579],
                        [14433, 9547, 4575],
                        [14424, 9559, 4571],
                        [14418, 9569, 4568],
                        [14412, 9578, 4565],
                        [14409, 9581, 4564],
                        [14408, 9585, 4563],
                        [14407, 9586, 4562],
                        [14404, 9591, 4560],
                        [14403, 9592, 4560],
                        [14401, 9596, 4559],
                        [14401, 9597, 4558],
                        [14398, 9602, 4556],
                        [14398, 9603, 4556],
                        [14395, 9609, 4553],
                        [14395, 9610, 4553],
                        [14395, 9611, 4552],
                        [14393, 9617, 4549],
                        [14392, 9624, 4545],
                        [14392, 9631, 4541],
                        [14393, 9639, 4536],
                        [14395, 9647, 4530],
                        [14399, 9655, 4524],
                        [14404, 9663, 4517],
                        [14410, 9671, 4509],
                        [14416, 9679, 4503],
                        [14419, 9682, 4499],
                        [14427, 9689, 4491],
                        [14434, 9695, 4485],
                        [14442, 9701, 4478],
                        [14450, 9708, 4471],
                        [14456, 9713, 4466],
                        [14461, 9718, 4461],
                        [14462, 9718, 4460],
                        [14463, 9719, 4459],
                        [14465, 9721, 4457],
                        [14475, 9728, 4449],
                        [14486, 9738, 4438],
                        [14496, 9747, 4429],
                        [14504, 9756, 4421],
                        [14510, 9765, 4413],
                        [14514, 9774, 4406],
                        [14516, 9783, 4400],
                        [14517, 9792, 4394],
                        [14516, 9797, 4392],
                        [14516, 9803, 4389],
                        [14513, 9808, 4387],
                        [14511, 9813, 4385],
                        [14508, 9819, 4383],
                        [14504, 9825, 4381],
                        [14503, 9826, 4381],
                        [14502, 9827, 4381],
                        [14497, 9833, 4379],
                        [14491, 9840, 4378],
                        [14490, 9841, 4378],
                        [14489, 9842, 4378],
                        [14482, 9849, 4376],
                        [14476, 9856, 4375],
                        [14469, 9863, 4374],
                        [14463, 9870, 4373],
                        [14458, 9877, 4371],
                        [14452, 9883, 4370],
                        [14447, 9889, 4369],
                        [14441, 9897, 4367],
                        [14434, 9906, 4365],
                        [14428, 9914, 4362],
                        [14422, 9923, 4360],
                        [14417, 9931, 4358],
                        [14411, 9939, 4355],
                        [14405, 9948, 4353],
                        [14399, 9959, 4350],
                        [14393, 9969, 4347],
                        [14387, 9978, 4344],
                        [14381, 9990, 4341],
                        [14374, 10001, 4338],
                        [14366, 10012, 4336],
                        [14357, 10023, 4334],
                        [14347, 10034, 4333],
                        [14341, 10039, 4332],
                        [14334, 10046, 4332],
                        [14327, 10050, 4332],
                        [14317, 10058, 4333],
                        [14306, 10067, 4333],
                        [14294, 10075, 4334],
                        [14282, 10084, 4335],
                        [14270, 10093, 4335],
                        [14258, 10102, 4335],
                        [14247, 10111, 4335],
                        [14236, 10121, 4334],
                        [14227, 10133, 4332],
                        [14219, 10143, 4330],
                        [14212, 10153, 4328],
                        [14207, 10163, 4325],
                        [14201, 10172, 4322],
                        [14195, 10184, 4319],
                        [14188, 10196, 4316],
                        [14179, 10207, 4313],
                        [14169, 10219, 4310],
                        [14161, 10226, 4309],
                        [14153, 10233, 4309],
                        [14144, 10240, 4308],
                        [14133, 10247, 4307],
                        [14121, 10255, 4307],
                        [14109, 10262, 4307],
                        [14094, 10271, 4308],
                        [14080, 10278, 4308],
                        [14068, 10285, 4309],
                        [14054, 10293, 4309],
                        [14040, 10301, 4309],
                        [14028, 10309, 4310],
                        [14014, 10316, 4310],
                        [14001, 10325, 4310],
                        [13987, 10333, 4310],
                        [13975, 10341, 4310],
                        [13965, 10349, 4310],
                        [13956, 10356, 4309],
                        [13947, 10363, 4308],
                        [13938, 10370, 4307],
                        [13934, 10374, 4306],
                        [13934, 10375, 4306],
                        [13933, 10376, 4306],
                        [13928, 10381, 4304],
                        [13926, 10384, 4304],
                        [13925, 10385, 4303],
                        [13920, 10391, 4302],
                        [13916, 10396, 4300],
                        [13915, 10397, 4300],
                        [13909, 10404, 4298],
                        [13904, 10412, 4295],
                        [13899, 10421, 4292],
                        [13894, 10428, 4289],
                        [13890, 10435, 4287],
                        [13885, 10444, 4283],
                        [13880, 10453, 4280],
                        [13874, 10461, 4277],
                        [13867, 10472, 4273],
                        [13858, 10483, 4270],
                        [13849, 10494, 4267],
                        [13839, 10504, 4265],
                        [13829, 10515, 4263],
                        [13819, 10524, 4261],
                        [13809, 10534, 4259],
                        [13799, 10543, 4257],
                        [13790, 10552, 4255],
                        [13779, 10564, 4253],
                        [13771, 10574, 4250],
                        [13764, 10583, 4247],
                        [13757, 10591, 4244],
                        [13752, 10599, 4241],
                        [13747, 10607, 4238],
                        [13742, 10615, 4235],
                        [13739, 10622, 4231],
                        [13735, 10630, 4228],
                        [13733, 10632, 4227],
                        [13731, 10635, 4224],
                        [13729, 10641, 4222],
                        [13726, 10648, 4219],
                        [13723, 10654, 4215],
                        [13720, 10661, 4212],
                        [13717, 10668, 4208],
                        [13714, 10676, 4205],
                        [13710, 10685, 4201],
                        [13706, 10696, 4195],
                        [13702, 10707, 4190],
                        [13698, 10717, 4186],
                        [13694, 10726, 4181],
                        [13691, 10736, 4177],
                        [13688, 10745, 4173],
                        [13685, 10754, 4169],
                        [13683, 10761, 4166],
                        [13681, 10768, 4163],
                        [13681, 10770, 4162],
                        [13680, 10771, 4162],
                        [13679, 10777, 4159],
                        [13678, 10780, 4158],
                        [13676, 10786, 4156],
                        [13676, 10788, 4155],
                        [13675, 10789, 4155],
                        [13674, 10791, 4154],
                        [13674, 10792, 4153],
                        [13673, 10794, 4152],
                        [13673, 10795, 4152],
                        [13672, 10797, 4151],
                        [13673, 10797, 4151],
                        [13670, 10803, 4149],
                        [13670, 10804, 4149],
                        [13667, 10812, 4146],
                        [13664, 10819, 4143],
                        [13660, 10825, 4141],
                        [13657, 10831, 4139],
                        [13652, 10837, 4137],
                        [13646, 10844, 4136],
                        [13640, 10852, 4134],
                        [13634, 10858, 4132],
                        [13629, 10865, 4131],
                        [13624, 10872, 4129],
                        [13619, 10879, 4126],
                        [13616, 10885, 4124],
                        [13614, 10888, 4123],
                        [13612, 10893, 4120],
                        [13611, 10898, 4118],
                        [13611, 10902, 4116],
                        [13610, 10907, 4113],
                        [13611, 10913, 4109],
                        [13613, 10919, 4105],
                        [13615, 10926, 4100],
                        [13618, 10932, 4095],
                        [13621, 10938, 4090],
                        [13625, 10945, 4084],
                        [13629, 10951, 4079],
                        [13633, 10958, 4073],
                        [13636, 10964, 4069],
                        [13639, 10970, 4064],
                        [13640, 10972, 4062],
                        [13643, 10976, 4059],
                        [13645, 10981, 4055],
                        [13646, 10985, 4051],
                        [13648, 10987, 4049],
                        [13650, 10991, 4046],
                        [13653, 10997, 4042],
                        [13655, 11002, 4038],
                        [13656, 11007, 4034],
                        [13657, 11013, 4030],
                        [13659, 11022, 4023],
                        [13660, 11031, 4017],
                        [13659, 11039, 4012],
                        [13657, 11047, 4008],
                        [13654, 11054, 4004],
                        [13651, 11062, 4000],
                        [13648, 11070, 3997],
                        [13644, 11079, 3992],
                        [13643, 11086, 3989],
                        [13642, 11089, 3987],
                        [13642, 11089, 3986],
                        [13637, 11095, 3981],
                        [13640, 11098, 3981],
                        [13640, 11104, 3978],
                        [13640, 11111, 3974],
                        [13641, 11117, 3970],
                        [13643, 11123, 3966],
                        [13645, 11129, 3962],
                        [13649, 11138, 3956],
                        [13653, 11146, 3950],
                        [13656, 11153, 3945],
                        [13659, 11161, 3939],
                        [13662, 11168, 3934],
                        [13666, 11175, 3928],
                        [13669, 11183, 3923],
                        [13672, 11190, 3918],
                        [13675, 11195, 3913],
                        [13677, 11201, 3909],
                        [13680, 11207, 3905],
                        [13680, 11207, 3904],
                        [13682, 11214, 3899],
                        [13685, 11220, 3895],
                        [13687, 11226, 3890],
                        [13690, 11232, 3885],
                        [13693, 11239, 3880],
                        [13695, 11245, 3875],
                        [13696, 11249, 3872],
                        [13699, 11256, 3866],
                        [13702, 11264, 3860],
                        [13706, 11272, 3854],
                        [13709, 11280, 3847],
                        [13712, 11289, 3840],
                        [13715, 11296, 3834],
                        [13717, 11303, 3829],
                        [13720, 11310, 3824],
                        [13723, 11315, 3819],
                        [13725, 11321, 3815],
                        [13727, 11327, 3810],
                        [13729, 11333, 3805],
                        [13732, 11339, 3800],
                        [13734, 11345, 3796],
                        [13736, 11351, 3791],
                        [13736, 11353, 3789],
                        [13739, 11360, 3784],
                        [13741, 11366, 3779],
                        [13742, 11373, 3773],
                        [13743, 11375, 3771],
                        [13744, 11376, 3770],
                        [13747, 11385, 3764],
                        [13750, 11393, 3757],
                        [13754, 11402, 3750],
                        [13756, 11409, 3744],
                        [13759, 11417, 3738],
                        [13762, 11424, 3732],
                        [13765, 11433, 3725],
                        [13767, 11441, 3718],
                        [13767, 11443, 3716],
                        [13771, 11450, 3711],
                        [13772, 11456, 3707],
                        [13775, 11462, 3701],
                        [13778, 11469, 3696],
                        [13781, 11476, 3690],
                        [13783, 11481, 3685],
                        [13785, 11487, 3681],
                        [13788, 11493, 3675],
                        [13791, 11500, 3670],
                        [13794, 11507, 3664],
                        [13798, 11515, 3657],
                        [13797, 11517, 3655],
                        [13798, 11519, 3652],
                        [13803, 11525, 3648],
                        [13806, 11532, 3643],
                        [13809, 11538, 3638],
                        [13812, 11544, 3633],
                        [13815, 11550, 3627],
                        [13818, 11556, 3622],
                        [13822, 11563, 3617],
                        [13826, 11570, 3611],
                        [13830, 11576, 3606],
                        [13834, 11583, 3601],
                        [13838, 11590, 3596],
                        [13840, 11595, 3592],
                        [13843, 11601, 3588],
                        [13847, 11608, 3583],
                        [13847, 11608, 3583],
                        [13849, 11614, 3579],
                        [13849, 11616, 3577],
                        [13848, 11618, 3576],
                        [13851, 11625, 3573],
                        [13852, 11631, 3569],
                        [13852, 11638, 3566],
                        [13852, 11639, 3565],
                        [13852, 11640, 3565],
                        [13852, 11646, 3562],
                        [13851, 11652, 3559],
                        [13848, 11659, 3557],
                        [13848, 11660, 3556],
                        [13845, 11667, 3554],
                        [13841, 11674, 3551],
                        [13836, 11681, 3549],
                        [13831, 11689, 3547],
                        [13825, 11696, 3546],
                        [13817, 11703, 3544],
                        [13810, 11710, 3543],
                        [13803, 11717, 3542],
                        [13796, 11723, 3541],
                        [13789, 11729, 3540],
                        [13781, 11736, 3539],
                        [13774, 11743, 3537],
                        [13768, 11751, 3535],
                        [13763, 11758, 3532],
                        [13761, 11765, 3529],
                        [13759, 11772, 3525],
                        [13758, 11779, 3521],
                        [13757, 11786, 3516],
                        [13756, 11787, 3514],
                        [13755, 11789, 3512],
                        [13754, 11790, 3511],
                        [13754, 11791, 3509],
                        [13753, 11792, 3509],
                        [13751, 11797, 3502],
                        [13747, 11802, 3495],
                        [13744, 11807, 3487],
                        [13744, 11808, 3485],
                        [13744, 11809, 3484],
                        [13754, 11815, 3482],
                        [13768, 11822, 3484],
                        [13775, 11825, 3482],
                        [13777, 11827, 3482],
                        [13778, 11828, 3481],
                        [13783, 11832, 3476],
                        [13787, 11837, 3471],
                        [13788, 11838, 3469],
                        [13789, 11839, 3469],
                        [13790, 11840, 3468],
                        [13790, 11841, 3467],
                        [13791, 11841, 3467],
                        [13791, 11842, 3466],
                        [13796, 11847, 3461],
                        [13800, 11852, 3456],
                        [13804, 11858, 3450],
                        [13805, 11862, 3447],
                        [13807, 11867, 3443],
                        [13808, 11872, 3439],
                        [13809, 11873, 3438],
                        [13809, 11874, 3438],
                        [13810, 11876, 3437],
                        [13810, 11876, 3436],
                        [13811, 11882, 3432],
                        [13813, 11888, 3427],
                        [13815, 11894, 3422],
                        [13819, 11900, 3417],
                        [13823, 11906, 3411],
                        [13828, 11913, 3405],
                        [13834, 11919, 3398],
                        [13837, 11921, 3395],
                        [13838, 11922, 3394],
                        [13844, 11927, 3388],
                        [13851, 11932, 3382],
                        [13852, 11933, 3381],
                        [13858, 11937, 3375],
                        [13868, 11942, 3368],
                        [13869, 11942, 3367],
                        [13878, 11947, 3360],
                        [13890, 11952, 3351],
                        [13900, 11956, 3344],
                        [13912, 11961, 3336],
                        [13923, 11965, 3328],
                        [13935, 11969, 3320],
                        [13948, 11974, 3311],
                        [13961, 11979, 3302],
                        [13972, 11984, 3294],
                        [13983, 11989, 3287],
                        [13993, 11994, 3278],
                        [14003, 11999, 3270],
                        [14005, 12001, 3267],
                        [14009, 12003, 3263],
                        [14012, 12005, 3262],
                        [14013, 12006, 3262],
                        [14014, 12006, 3261],
                        [14016, 12007, 3260],
                        [14017, 12008, 3259],
                        [14023, 12013, 3252],
                        [14026, 12015, 3250],
                        [14073, 12051, 3206],
                        [14081, 12057, 3198],
                        [14092, 12065, 3188],
                        [14102, 12073, 3179],
                        [14113, 12080, 3169],
                        [14124, 12087, 3160],
                        [14135, 12094, 3151],
                        [14145, 12100, 3143],
                        [14155, 12105, 3136],
                        [14164, 12111, 3129],
                        [14173, 12116, 3122],
                        [14182, 12121, 3116],
                        [14189, 12125, 3110],
                        [14203, 12134, 3099],
                        [14215, 12143, 3088],
                        [14227, 12152, 3078],
                        [14238, 12160, 3068],
                        [14249, 12170, 3058],
                        [14260, 12179, 3048],
                        [14271, 12190, 3037],
                        [14280, 12198, 3029],
                        [14282, 12201, 3025],
                        [14285, 12205, 3021],
                        [14293, 12211, 3016],
                        [14300, 12217, 3010],
                        [14306, 12224, 3003],
                        [14313, 12230, 2997],
                        [14321, 12236, 2990],
                        [14329, 12242, 2982],
                        [14338, 12248, 2976],
                        [14347, 12254, 2969],
                        [14356, 12259, 2962],
                        [14368, 12264, 2954],
                        [14379, 12270, 2945],
                        [14393, 12275, 2936],
                        [14408, 12281, 2927],
                        [14421, 12286, 2918],
                        [14435, 12291, 2909],
                        [14448, 12296, 2901],
                        [14460, 12301, 2893],
                        [14474, 12306, 2884],
                        [14484, 12311, 2876],
                        [14488, 12313, 2873],
                        [14500, 12318, 2865],
                        [14510, 12324, 2857],
                        [14520, 12329, 2850],
                        [14529, 12335, 2842],
                        [14537, 12341, 2836],
                        [14544, 12347, 2829],
                        [14550, 12353, 2822],
                        [14556, 12359, 2816],
                        [14560, 12365, 2810],
                        [14563, 12371, 2805],
                        [14566, 12376, 2801],
                        [14568, 12382, 2796],
                        [14570, 12388, 2791],
                        [14570, 12394, 2787],
                        [14570, 12396, 2785],
                        [14573, 12401, 2782],
                        [14574, 12407, 2777],
                        [14576, 12412, 2774],
                        [14578, 12417, 2769],
                        [14579, 12423, 2765],
                        [14581, 12429, 2761],
                        [14584, 12435, 2756],
                        [14587, 12442, 2751],
                        [14591, 12448, 2746],
                        [14596, 12455, 2740],
                        [14602, 12462, 2733],
                        [14611, 12470, 2725],
                        [14620, 12478, 2716],
                        [14629, 12486, 2709],
                        [14638, 12493, 2701],
                        [14647, 12500, 2693],
                        [14655, 12506, 2686],
                        [14662, 12511, 2680],
                        [14674, 12520, 2670],
                        [14682, 12527, 2663],
                        [14691, 12533, 2656],
                        [14697, 12539, 2651],
                        [14703, 12545, 2645],
                        [14709, 12551, 2639],
                        [14715, 12557, 2632],
                        [14733, 12584, 2609],
                        [14735, 12589, 2605],
                        [14737, 12594, 2601],
                        [14739, 12601, 2596],
                        [14741, 12611, 2590],
                        [14743, 12620, 2583],
                        [14743, 12629, 2578],
                        [14743, 12637, 2572],
                        [14742, 12646, 2567],
                        [14740, 12654, 2563],
                        [14737, 12663, 2559],
                        [14733, 12672, 2555],
                        [14727, 12683, 2550],
                        [14722, 12693, 2546],
                        [14716, 12703, 2542],
                        [14710, 12713, 2538],
                        [14705, 12722, 2535],
                        [14700, 12730, 2532],
                        [14695, 12739, 2528],
                        [14690, 12746, 2526],
                        [14688, 12749, 2524],
                        [14684, 12757, 2521],
                        [14679, 12766, 2518],
                        [14675, 12773, 2515],
                        [14671, 12781, 2512],
                        [14667, 12789, 2509],
                        [14664, 12797, 2505],
                        [14661, 12806, 2501],
                        [14658, 12815, 2497],
                        [14657, 12822, 2493],
                        [14656, 12829, 2489],
                        [14655, 12830, 2489],
                        [14655, 12832, 2488],
                        [14655, 12833, 2487],
                        [14655, 12834, 2486],
                        [14655, 12836, 2486],
                        [14654, 12842, 2482],
                        [14653, 12849, 2478],
                        [14653, 12856, 2474],
                        [14653, 12858, 2473],
                        [14653, 12859, 2472],
                        [14653, 12865, 2469],
                        [14654, 12871, 2465],
                        [14655, 12877, 2461],
                        [14656, 12882, 2457],
                        [14656, 12886, 2455],
                        [14656, 12886, 2453],
                        [14657, 12889, 2452],
                        [14661, 12898, 2446],
                        [14664, 12906, 2439],
                        [14667, 12913, 2433],
                        [14671, 12921, 2427],
                        [14675, 12929, 2420],
                        [14680, 12936, 2414],
                        [14684, 12944, 2407],
                        [14689, 12951, 2400],
                        [14693, 12957, 2394],
                        [14698, 12964, 2388],
                        [14705, 12971, 2381],
                        [14712, 12979, 2373],
                        [14720, 12987, 2364],
                        [14722, 12988, 2363],
                        [14730, 12995, 2355],
                        [14737, 13001, 2348],
                        [14744, 13007, 2341],
                        [14750, 13012, 2335],
                        [14757, 13018, 2329],
                        [14766, 13024, 2320],
                        [14777, 13032, 2311],
                        [14788, 13040, 2301],
                        [14799, 13047, 2291],
                        [14810, 13055, 2282],
                        [14821, 13062, 2272],
                        [14829, 13068, 2263],
                        [14832, 13070, 2261],
                        [14841, 13076, 2255],
                        [14849, 13081, 2248],
                        [14857, 13087, 2240],
                        [14866, 13093, 2232],
                        [14876, 13099, 2224],
                        [14886, 13106, 2216],
                        [14897, 13114, 2206],
                        [14905, 13120, 2198],
                        [14915, 13128, 2189],
                        [14923, 13136, 2180],
                        [14930, 13144, 2173],
                        [14936, 13151, 2165],
                        [14942, 13159, 2158],
                        [14948, 13167, 2150],
                        [14954, 13175, 2143],
                        [14958, 13183, 2137],
                        [14962, 13191, 2130],
                        [14964, 13199, 2124],
                        [14966, 13207, 2118],
                        [14966, 13210, 2115],
                        [14966, 13213, 2113],
                        [14967, 13216, 2112],
                        [14967, 13217, 2112],
                        [14967, 13218, 2111],
                        [14967, 13219, 2111],
                        [14967, 13219, 2110],
                        [14967, 13220, 2110],
                        [14967, 13221, 2109],
                        [14967, 13222, 2109],
                        [14967, 13223, 2108],
                        [14967, 13229, 2105],
                        [14967, 13235, 2102],
                        [14966, 13241, 2099],
                        [14964, 13250, 2094],
                        [14961, 13260, 2089],
                        [14958, 13270, 2085],
                        [14956, 13279, 2081],
                        [14952, 13288, 2077],
                        [14949, 13297, 2074],
                        [14946, 13305, 2070],
                        [14944, 13313, 2066],
                        [14943, 13318, 2064],
                        [14938, 13346, 2049],
                        [14939, 13350, 2047],
                        [14939, 13351, 2046],
                        [14938, 13352, 2046],
                        [14939, 13353, 2045],
                        [14938, 13354, 2044],
                        [14938, 13355, 2044],
                        [14938, 13356, 2043],
                        [14938, 13362, 2040],
                        [14938, 13367, 2036],
                        [14938, 13373, 2033],
                        [14938, 13378, 2029],
                        [14938, 13384, 2025],
                        [14939, 13391, 2021],
                        [14938, 13397, 2017],
                        [14938, 13403, 2014],
                        [14936, 13408, 2010],
                        [14936, 13411, 2008],
                        [14933, 13422, 2003],
                        [14928, 13432, 1999],
                        [14922, 13441, 1996],
                        [14916, 13450, 1993],
                        [14908, 13459, 1992],
                        [14898, 13468, 1990],
                        [14888, 13478, 1989],
                        [14875, 13489, 1988],
                        [14859, 13502, 1987],
                        [14845, 13515, 1986],
                        [14831, 13528, 1985],
                        [14818, 13540, 1984],
                        [14805, 13551, 1983],
                        [14794, 13562, 1981],
                        [14783, 13572, 1979],
                        [14771, 13583, 1978],
                        [14760, 13593, 1975],
                        [14750, 13604, 1973],
                        [14740, 13613, 1971],
                        [14732, 13621, 1969],
                        [14723, 13630, 1968],
                        [14713, 13639, 1966],
                        [14705, 13646, 1964],
                        [14697, 13654, 1962],
                        [14689, 13662, 1961],
                        [14680, 13670, 1959],
                        [14680, 13671, 1959],
                        [14679, 13671, 1959],
                        [14678, 13672, 1959],
                        [14678, 13673, 1959],
                        [14677, 13674, 1958],
                        [14669, 13681, 1957],
                        [14663, 13687, 1955],
                        [14656, 13694, 1954],
                        [14651, 13699, 1953],
                        [14649, 13701, 1952],
                        [14645, 13706, 1951],
                        [14644, 13708, 1950],
                        [14643, 13709, 1950],
                        [14642, 13710, 1949],
                        [14641, 13711, 1949],
                        [14637, 13718, 1946],
                        [14633, 13725, 1943],
                        [14630, 13732, 1940],
                        [14628, 13739, 1937],
                        [14628, 13740, 1936],
                        [14627, 13747, 1932],
                        [14626, 13754, 1928],
                        [14627, 13763, 1922],
                        [14629, 13771, 1917],
                        [14632, 13778, 1911],
                        [14635, 13784, 1906],
                        [14639, 13790, 1901],
                        [14643, 13796, 1895],
                        [14648, 13802, 1890],
                        [14653, 13808, 1884],
                        [14657, 13813, 1879],
                        [14662, 13819, 1873],
                        [14666, 13824, 1869],
                        [14670, 13829, 1864],
                        [14673, 13832, 1861],
                        [14686, 13850, 1844],
                        [14691, 13856, 1838],
                        [14695, 13861, 1833],
                        [14700, 13868, 1826],
                        [14705, 13875, 1819],
                        [14710, 13882, 1813],
                        [14714, 13888, 1806],
                        [14719, 13895, 1800],
                        [14723, 13902, 1794],
                        [14728, 13908, 1788],
                        [14732, 13915, 1781],
                        [14734, 13922, 1776],
                        [14736, 13929, 1771],
                        [14736, 13936, 1766],
                        [14735, 13944, 1762],
                        [14734, 13951, 1759],
                        [14732, 13959, 1755],
                        [14728, 13968, 1751],
                        [14723, 13976, 1748],
                        [14716, 13985, 1745],
                        [14709, 13993, 1743],
                        [14702, 14000, 1742],
                        [14693, 14008, 1740],
                        [14683, 14016, 1739],
                        [14673, 14024, 1737],
                        [14663, 14031, 1737],
                        [14652, 14039, 1736],
                        [14641, 14046, 1735],
                        [14629, 14055, 1734],
                        [14616, 14064, 1734],
                        [14603, 14074, 1732],
                        [14590, 14084, 1730],
                        [14580, 14094, 1728],
                        [14572, 14104, 1725],
                        [14566, 14113, 1721],
                        [14562, 14121, 1716],
                        [14560, 14130, 1711],
                        [14561, 14139, 1704],
                        [14562, 14146, 1698],
                        [14565, 14152, 1692],
                        [14568, 14159, 1686],
                        [14573, 14166, 1679],
                        [14579, 14174, 1671],
                        [14586, 14181, 1663],
                        [14595, 14188, 1655],
                        [14604, 14194, 1646],
                        [14613, 14201, 1638],
                        [14621, 14206, 1631],
                        [14630, 14212, 1623],
                        [14639, 14218, 1616],
                        [14646, 14223, 1609],
                        [14654, 14229, 1602],
                        [14663, 14235, 1594],
                        [14671, 14240, 1587],
                        [14679, 14246, 1580],
                        [14689, 14253, 1571],
                        [14700, 14260, 1561],
                        [14713, 14268, 1551],
                        [14723, 14275, 1542],
                        [14733, 14281, 1534],
                        [14744, 14289, 1524],
                        [14755, 14296, 1514],
                        [14768, 14304, 1503],
                        [14780, 14311, 1493],
                        [14794, 14317, 1483],
                        [14807, 14323, 1473],
                        [14822, 14330, 1462],
                        [14838, 14335, 1451],
                        [14855, 14341, 1439],
                        [14873, 14348, 1427],
                        [14888, 14354, 1416],
                        [14892, 14355, 1414],
                        [14906, 14360, 1404],
                        [14919, 14365, 1395],
                        [14932, 14370, 1386],
                        [14943, 14375, 1378],
                        [14956, 14380, 1368],
                        [14958, 14381, 1366],
                        [14960, 14382, 1365],
                        [14962, 14383, 1363],
                        [14974, 14389, 1354],
                        [14984, 14395, 1346],
                        [14993, 14400, 1338],
                        [15003, 14406, 1330],
                        [15012, 14412, 1322],
                        [15023, 14418, 1313],
                        [15035, 14424, 1303],
                        [15046, 14430, 1295],
                        [15058, 14435, 1286],
                        [15070, 14440, 1277],
                        [15082, 14444, 1268],
                        [15096, 14449, 1258],
                        [15112, 14454, 1247],
                        [15128, 14460, 1236],
                        [15147, 14466, 1223],
                        [15166, 14473, 1209],
                        [15181, 14478, 1199],
                        [15195, 14484, 1188],
                        [15209, 14491, 1176],
                        [15224, 14498, 1164],
                        [15236, 14506, 1154],
                        [15246, 14512, 1144],
                        [15253, 14519, 1136],
                        [15262, 14527, 1126],
                        [15267, 14535, 1118],
                        [15272, 14543, 1110],
                        [15274, 14550, 1104],
                        [15275, 14557, 1098],
                        [15277, 14566, 1091],
                        [15278, 14574, 1084],
                        [15278, 14582, 1078],
                        [15280, 14589, 1073],
                        [15282, 14596, 1067],
                        [15284, 14603, 1060],
                        [15285, 14604, 1060],
                        [15285, 14605, 1059],
                        [15289, 14610, 1054],
                        [15292, 14615, 1049],
                        [15293, 14616, 1048],
                        [15297, 14622, 1042],
                        [15302, 14627, 1036],
                        [15307, 14632, 1032],
                        [15313, 14636, 1026],
                        [15319, 14641, 1020],
                        [15327, 14646, 1013],
                        [15336, 14652, 1006],
                        [15339, 14654, 1003],
                        [15345, 14657, 998],
                        [15353, 14660, 993],
                        [15363, 14665, 985],
                        [15374, 14670, 978],
                        [15385, 14675, 970],
                        [15397, 14679, 962],
                        [15409, 14683, 954],
                        [15410, 14684, 953],
                        [15429, 14690, 941],
                        [15448, 14695, 930],
                        [15466, 14700, 919],
                        [15486, 14705, 907],
                        [15507, 14710, 895],
                        [15530, 14714, 882],
                        [15539, 14716, 876],
                        [15547, 14718, 872],
                        [15567, 14721, 862],
                        [15588, 14725, 851],
                        [15607, 14729, 840],
                        [15626, 14732, 830],
                        [15647, 14736, 819],
                        [15658, 14738, 812],
                        [15663, 14739, 809],
                        [15682, 14743, 799],
                        [15700, 14747, 789],
                        [15717, 14751, 779],
                        [15734, 14755, 769],
                        [15750, 14759, 760],
                        [15765, 14764, 751],
                        [15781, 14768, 741],
                        [15795, 14773, 733],
                        [15809, 14778, 724],
                        [15823, 14783, 715],
                        [15837, 14788, 706],
                        [15849, 14794, 698],
                        [15859, 14798, 691],
                        [15870, 14803, 684],
                        [15880, 14808, 677],
                        [15889, 14813, 670],
                        [15894, 14816, 666],
                        [15899, 14819, 662],
                        [15901, 14820, 661],
                        [15911, 14826, 653],
                        [15920, 14833, 645],
                        [15929, 14839, 638],
                        [15937, 14844, 632],
                        [15945, 14850, 625],
                        [15947, 14852, 623],
                        [15954, 14858, 617],
                        [15960, 14864, 611],
                        [15966, 14870, 605],
                        [15967, 14871, 604],
                        [15973, 14878, 598],
                        [15977, 14884, 592],
                        [15982, 14891, 586],
                        [15987, 14897, 580],
                        [15990, 14904, 575],
                        [15990, 14905, 574],
                        [15993, 14911, 569],
                        [15995, 14917, 564],
                        [15997, 14924, 560],
                        [15998, 14924, 559],
                        [15999, 14932, 554],
                        [16000, 14938, 550],
                        [15999, 14945, 545],
                        [15999, 14952, 541],
                        [15998, 14958, 537],
                        [15997, 14966, 533],
                        [15993, 14977, 526],
                        [15988, 14988, 521],
                        [15983, 14999, 515],
                        [15979, 15008, 510],
                        [15974, 15018, 505],
                        [15970, 15027, 501],
                        [15965, 15037, 496],
                        [15960, 15046, 491],
                        [15956, 15056, 486],
                        [15951, 15066, 481],
                        [15948, 15074, 477],
                        [15945, 15079, 474],
                        [15942, 15085, 471],
                        [15939, 15091, 468],
                        [15936, 15097, 465],
                        [15933, 15103, 462],
                        [15930, 15110, 458],
                        [15927, 15115, 455],
                        [15926, 15118, 454],
                        [15923, 15123, 451],
                        [15921, 15129, 448],
                        [15920, 15130, 447],
                        [15920, 15131, 447],
                        [15920, 15132, 447],
                        [15917, 15140, 442],
                        [15914, 15148, 437],
                        [15913, 15157, 431],
                        [15912, 15165, 425],
                        [15913, 15174, 418],
                        [15914, 15181, 412],
                        [15916, 15190, 405],
                        [15919, 15197, 398],
                        [15921, 15205, 391],
                        [15924, 15213, 383],
                        [15927, 15220, 377],
                        [15930, 15228, 370],
                        [15933, 15235, 363],
                        [15934, 15239, 359],
                        [15934, 15241, 356],
                        [15939, 15254, 346],
                        [15939, 15256, 344],
                        [15943, 15266, 336],
                        [15944, 15275, 329],
                        [15944, 15284, 323],
                        [15942, 15293, 318],
                        [15940, 15301, 314],
                        [15936, 15309, 310],
                        [15931, 15318, 306],
                        [15926, 15327, 303],
                        [15925, 15328, 302],
                        [15924, 15330, 302],
                        [15924, 15331, 302],
                        [15923, 15332, 301],
                        [15922, 15333, 301],
                        [15921, 15334, 301],
                        [15921, 15335, 300],
                        [15920, 15336, 300],
                        [15920, 15336, 300],
                        [15920, 15337, 300],
                        [15919, 15339, 299],
                        [15918, 15339, 299],
                        [15915, 15342, 297],
                        [15913, 15348, 296],
                        [15909, 15354, 294],
                        [15907, 15359, 292],
                        [15906, 15360, 291],
                        [15904, 15366, 289],
                        [15903, 15371, 286],
                        [15903, 15372, 286],
                        [15902, 15378, 282],
                        [15902, 15384, 279],
                        [15903, 15389, 275],
                        [15904, 15394, 271],
                        [15907, 15400, 267],
                        [15909, 15405, 262],
                        [15912, 15411, 258],
                        [15913, 15411, 257],
                        [15916, 15417, 252],
                        [15919, 15422, 247],
                        [15922, 15428, 243],
                        [15923, 15430, 240],
                        [15923, 15431, 239],
                        [15923, 15432, 239],
                        [15925, 15438, 234],
                        [15925, 15443, 230],
                        [15925, 15446, 229],
                        [15925, 15447, 228],
                        [15924, 15449, 227],
                        [15922, 15455, 224],
                        [15918, 15462, 220],
                        [15914, 15469, 217],
                        [15910, 15474, 215],
                        [15907, 15477, 214],
                        [15901, 15486, 211],
                        [15894, 15495, 207],
                        [15888, 15503, 204],
                        [15882, 15510, 202],
                        [15877, 15518, 199],
                        [15870, 15526, 196],
                        [15863, 15535, 192],
                        [15860, 15540, 190],
                        [15860, 15540, 190],
                        [15855, 15546, 188],
                        [15853, 15550, 187],
                        [15852, 15550, 186],
                        [15850, 15554, 185],
                        [15849, 15554, 185],
                        [15848, 15556, 184],
                        [15848, 15557, 184],
                        [15846, 15558, 183],
                        [15842, 15564, 181],
                        [15838, 15571, 177],
                        [15835, 15578, 174],
                        [15831, 15585, 171],
                        [15828, 15593, 167],
                        [15825, 15600, 163],
                        [15824, 15609, 158],
                        [15824, 15610, 156],
                        [15822, 15620, 150],
                        [15821, 15629, 145],
                        [15821, 15637, 139],
                        [15823, 15645, 134],
                        [15824, 15652, 128],
                        [15827, 15660, 122],
                        [15830, 15669, 115],
                        [15834, 15679, 107],
                        [15836, 15685, 103],
                        [15838, 15692, 98],
                        [15841, 15699, 92],
                        [15840, 15700, 90],
                        [15841, 15702, 88],
                        [15843, 15703, 87],
                        [15844, 15705, 87],
                        [15848, 15710, 83],
                        [15851, 15716, 78],
                        [15853, 15722, 74],
                        [15855, 15727, 70],
                        [15858, 15734, 65],
                        [15860, 15741, 60],
                        [15861, 15745, 56],
                        [15861, 15751, 53],
                        [15860, 15757, 49],
                        [15858, 15764, 45],
                        [15855, 15770, 43],
                        [15852, 15775, 40],
                        [15848, 15781, 38],
                        [15843, 15786, 36],
                        [15837, 15792, 35],
                        [15834, 15795, 35],
                        [15826, 15801, 34],
                        [15819, 15806, 34],
                        [15810, 15812, 34],
                        [15804, 15815, 34],
                        [15801, 15817, 34],
                        [15799, 15818, 34],
                        [15788, 15824, 35],
                        [15776, 15830, 37],
                        [15763, 15837, 38],
                        [15752, 15842, 40],
                        [15750, 15842, 41],
                        [15749, 15843, 41],
                        [15737, 15849, 43],
                        [15735, 15850, 43],
                        [15731, 15851, 43],
                        [15727, 15853, 44],
                        [15726, 15854, 44],
                        [15725, 15855, 44],
                        [15714, 15860, 46],
                        [15706, 15864, 47],
                        [15697, 15870, 47],
                        [15688, 15875, 48],
                        [15680, 15881, 48],
                        [15670, 15887, 48],
                        [15662, 15894, 47],
                        [15658, 15898, 46],
                        [15657, 15898, 46],
                        [15655, 15900, 46],
                        [15654, 15902, 45],
                        [15653, 15902, 45],
                        [15652, 15903, 45],
                        [15651, 15904, 45],
                        [15649, 15906, 44],
                        [15641, 15914, 42],
                        [15636, 15920, 40],
                        [15635, 15921, 40],
                        [15629, 15928, 37],
                        [15624, 15934, 35],
                        [15624, 15935, 35],
                        [15623, 15936, 35],
                        [15619, 15941, 33],
                        [15616, 15945, 31],
                        [15614, 15948, 30],
                        [15610, 15954, 28],
                        [15608, 15956, 27],
                        [15604, 15962, 24],
                        [15600, 15967, 23],
                        [15598, 15969, 22],
                        [15597, 15970, 22],
                        [15595, 15973, 20],
                        [15594, 15974, 20],
                        [15593, 15976, 20],
                        [15588, 15981, 18],
                        [15585, 15984, 17],
                        [15578, 15994, 14],
                        [15578, 15995, 14],
                        [15578, 15996, 13],
                        [15579, 15997, 12],
                        [15580, 15998, 11],
                        [15582, 15998, 10],
                        [15584, 15999, 8],
                        [15587, 15999, 7],
                        [15590, 16000, 5],
                        [15593, 15999, 4],
                        [15597, 15999, 2],
                        [15600, 15999, 2],
                        [15604, 15998, 1],
                        [15607, 15998, 0],
                        [15609, 15997, 0],
                        [15610, 15996, 0],
                        [15611, 15995, 0],
                        [15611, 15995, 0],
                        [15610, 15994, 2],
                        [15609, 15993, 3],
                        [15606, 15992, 5],
                        [15604, 15992, 6],
                        [15602, 15991, 8],
                        [15600, 15991, 8],
                        [15570, 15988, 23],
                        [15537, 15985, 38],
                        [15462, 15978, 78],
                        [15443, 15976, 88],
                        [15426, 15975, 96],
                        [15410, 15973, 103],
                        [15380, 15971, 118],
                        [15356, 15969, 129],
                        [15334, 15968, 139],
                        [15322, 15967, 145],
                        [15303, 15966, 153],
                        [15280, 15964, 164],
                        [15262, 15964, 172],
                        [15238, 15964, 182],
                        [15214, 15965, 192],
                        [15193, 15966, 201],
                        [15164, 15968, 211],
                        [15162, 15968, 212],
                        [15140, 15970, 221],
                        [15120, 15971, 228],
                        [15117, 15971, 229],
                        [15104, 15972, 235],
                        [15092, 15972, 240],
                        [15070, 15973, 249],
                        [15066, 15973, 250],
                        [14993, 15974, 281],
                        [14945, 15974, 302],
                        [14904, 15974, 320],
                        [14899, 15974, 322],
                        [14884, 15974, 329],
                        [14872, 15973, 334],
                        [14865, 15973, 338],
                        [14846, 15972, 347],
                        [14826, 15970, 357],
                        [14820, 15970, 360],
                        [14802, 15968, 369],
                        [14782, 15967, 378],
                        [14777, 15967, 381],
                        [14765, 15967, 386],
                        [14744, 15967, 395],
                        [14731, 15967, 401],
                        [14714, 15967, 408],
                        [14687, 15967, 419],
                        [14684, 15967, 421],
                        [14678, 15972, 421],
                        [14671, 15977, 420],
                        [14665, 15980, 421],
                        [14661, 15983, 421],
                        [14653, 15988, 421],
                        [14651, 15989, 421],
                        [14650, 15990, 421],
                        [14648, 15991, 421],
                        [14643, 15990, 424],
                        [14632, 15989, 430],
                        [14621, 15988, 435],
                        [14615, 15987, 438],
                        [14610, 15987, 441],
                        [14604, 15987, 444],
                        [14601, 15987, 445],
                        [14595, 15987, 447],
                        [14578, 15987, 454],
                        [14553, 15988, 465],
                        [14529, 15989, 475],
                        [14503, 15990, 486],
                        [14500, 15990, 487],
                        [14497, 15990, 488],
                        [14494, 15991, 489],
                        [14491, 15991, 490],
                        [14488, 15992, 491],
                        [14481, 15994, 493]
                    ]
                ] }], 'resolution': 16000, 'bbox': [
                [3969808.1323646996, 1019563.7108279606, 4802321.707409608],
                [4005948.5767660574, 1194044.7737189461, 4870311.576400328]
            ] }] };



