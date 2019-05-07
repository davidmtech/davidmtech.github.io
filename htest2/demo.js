
var browser;


function startDemo() {

    var params = vtsParseUrlParams();    

    params['map'] = 'https://altair.mlwn.se/store/map-config/benatky-lod2/mapConfig.json';

    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;

    browser = vts.browser('melown-demo', params);

    //hack replace free layers styles
    browser.on('map-mapconfig-loaded', (function(data){

    }));

}
