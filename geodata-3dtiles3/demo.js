var browser = null;
var renderer = null;
var map = null;
var geodata = null;

(function startDemo() {

    var params = vtsParseUrlParams();    

    params['positionInUrl'] =  true;
    params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/VTS-Tutorial-map/mapConfig.json';

    params['view'] = {
      "surfaces": {},
      "freeLayers": {},
      "options": {}
    };

    params['walkMode'] = true;
    params['fixedHeight'] = 47; //48???
    params['mapCheckTextureSize'] = true;
    params['mapTraverseToMeshNode'] = true;

    //parse mapSplitSpace url param
    var params2 = vts.utils.getParamsFromUrl(window.location.href);

    if (params2['fixedHeight']) {
        params['fixedHeight'] = parseFloat(params2['fixedHeight']);
    }

    var urlParams = new URLSearchParams(window.location.search);

    if(urlParams.has('mapNormalizeOctantTexelSize')) {
        var value = urlParams.get('mapNormalizeOctantTexelSize');
        params['mapNormalizeOctantTexelSize'] = (value == '1' || value == 'true');
    }

    if(urlParams.has('mapTraverseToMeshNode')) {
        var value = urlParams.get('mapTraverseToMeshNode');
        params['mapTraverseToMeshNode'] = (value == '1' || value == 'true');
    }
    
    if (!params['pos']) {
        params['pos'] = [ 'obj', 0.075365034865010019 * (180/Math.PI), 0.90892506334583045 * (180/Math.PI), 'float', 0.00, -23.00, -49.10, 0.00, 41033.50, 45.00 ]
        //params['pos'] = [ 'obj', -2.1362545626053979 * (180/Math.PI), 0.65953372844334801 * (180/Math.PI), 'float', 0.00, -23.00, -49.10, 0.00, 41033.50, 45.00 ]
    }

    browser = vts.browser('map-div', params);

    //check whether browser is supported
    if (!browser) {
        console.log('Your web browser does not support WebGL');
        return;
    }

    //callback once is map config loaded
    browser.on('map-loaded', onMapLoaded);
})();


function onMapLoaded() {
    map = browser.map;

    var freeLayer = {
        credits:[],
        displaySize:1024,
        extents:{"ll":[null,null,null],"ur":[null,null,null]},
        style:{},
        type:"geodata"
    };
                     
    freeLayer.geodata = {  binPath : './tileset.json' };

    //add free layer to the map
    map.addFreeLayer('geodatatest', freeLayer);

    //add free layer to the list of free layers
    //which will be rendered on the map
    var view = map.getView();
    view.freeLayers.geodatatest = { options: { fastParse: true }};
    map.setView(view);
}


