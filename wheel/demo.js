
/* Basic example with 3D map */

(function startDemo() {

    var params = vtsParseUrlParams();    
    params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/VTS-Tutorial-map/mapConfig.json';
    //params['map'] = 'http://localhost:3060/output/stg/0532203-5255427.5.vts/mapConfig.json';
    //params['map'] = 'http://localhost:8080/store/map-config/vadstena.frydlant-16b-sharp-store.json/mapConfig.json';

    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;


    var browser = vts.browser('map-div', params);

})();
