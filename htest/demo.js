
var browser;


function startDemo() {

    var params = vtsParseUrlParams();    

    params['map'] = 'https://rigel.mlwn.se/store/a-3d-mountain-map/map-config/map/mapConfig.json';

    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;

    browser = vts.browser('melown-demo', params);

    //hack replace free layers styles
    browser.on('map-mapconfig-loaded', (function(data){

    }));

}
