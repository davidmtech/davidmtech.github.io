
var browser;


function startDemo() {

    var params = vtsParseUrlParams();    

    params['map'] = 'https://rigel.mlwn.se/store/map-config/high-terrain/mapConfig.json';

    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;

    browser = vts.browser('melown-demo', params);

    //hack replace free layers styles
    browser.on('map-mapconfig-loaded', (function(data){

    }));

}
