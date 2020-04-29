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
    vts.utils.loadJSON('./hill.json', geojsonLoaded);
}


function geojsonLoaded(data) {
    //create geodata object
    geodata = map.createGeodata();

    //import GeoJSON data
    //carefully choose tessellation parameter, small values (relative to polygon size) can lead to slow processing speed 
    //length parameter means maximum size of triangle side

    //var srs = null;
    var srs = '+proj=longlat +datum=WGS84 +no_defs'; // most common for geojson longlat WGS84

    geodata.importGeoJson(data, 'float', srs, {'tesselation': {'mode':'by-length', 'length':200}} );

    // heights are not provided in data, in that case height are set to 0 value
    // to make data visible we use 'float' height mode (relative to terrain height)
    // so data will sit on the terrain

    // numerical parameter means wich terrain LOD will be use to terrain height source
    // higher number leads to better results (for large polygons use smaller values to speed up processing time)
    // higher then 20 does not make sense (data has only 20 LODs))

    geodata.processHeights('node-by-lod', 20, onHeightProcessed);

    //onHeightProcessed();
}


function onHeightProcessed() {
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
              "polygon-color" : [0,255,255,155],
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

    //make free layer
    var freeLayer = geodata.makeFreeLayer(style);

    //add free layer to the map
    map.addFreeLayer('geodatatest', freeLayer);

    //add free layer to the list of free layers
    //which will be rendered on the map
    var view = map.getView();
    view.freeLayers.geodatatest = {};
    map.setView(view);
}

