var browser = null;
var renderer = null;
var map = null;
var geodata = null;

(function startDemo() {
    var params = vtsParseUrlParams();    

    params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/VTS-Tutorial-map/mapConfig.json',

    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;
    params['controlMeasure'] = true,
    params['controlGithub'] = true,
    params['mapLoadMode'] = 'fit',

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
    //vts.utils.loadJSON('./hill.json', geojsonLoaded);
    vts.utils.loadJSON('./liqWGS84vts2.json', geojsonLoaded);
}


function geojsonLoaded(data) {

    var style = {
        'constants': {
            '@icon-marker': ['icons', 6, 8, 18, 18]
        },
    
        'bitmaps': {
            'icons': 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png'
        },

        "layers" : {

            "poly": {
              "filter": ["==","#type","polygon"],

              "polygon": true,
              //"polygon-color" : [0,255,255,155],
              "polygon-color": [{"random": [0,255]},255,{"random": [0,255]},155],
              "polygon-style": "flatshade",
              //"polygon-culling": "back",
              "polygon-use-stencil": false,
              "polygon-style": "flatshade",

              "line": false,
              "line-width": 4,
              "line-color": [255,0,255,255],
              
              "point": false,
              "point-radius": 20,
              "point-color": [100,255,100,255],

              "zbuffer-offset": [-5,0,0],
            }
        }
    };

    geodata = map.createGeodata();

    //import vts geodata
    geodata.importVTSGeodata(data);

    //make free layer
    var freeLayer = geodata.makeFreeLayer(style); // null, data);

    //add free layer to the map
    map.addFreeLayer('geodatatest', freeLayer);

    //add free layer to the list of free layers
    //which will be rendered on the map
    var view = map.getView();
    view.freeLayers.geodatatest = {};
    map.setView(view);
}

