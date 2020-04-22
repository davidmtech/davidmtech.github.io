var browser = null;
var renderer = null;
var map = null;
var geodata = null;

(function startDemo() {
    // create map in the html div with id 'map-div'
    // parameter 'map' sets path to the map which will be displayed
    // you can create your own map on melown.com
    // position parameter is described in documentation 
    // https://github.com/Melown/vts-browser-js/wiki/VTS-Browser-Map-API#position
    // view parameter is described in documentation 
    // https://github.com/Melown/vts-browser-js/wiki/VTS-Browser-Map-API#definition-of-view

    var params = vtsParseUrlParams();    

 //alert("Hello\nHow are you?");

    params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/VTS-Tutorial-map/mapConfig.json',
    //position : [ 'obj', 15.096869389048662, 49.38435909591623, 'float', 0.00, 0.00, -90.00, 0.00, 1587848.47, 55.00 ],

    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;
    params['controlMeasure'] = true,
    params['controlGithub'] = true,
    params['mapLoadMode'] = 'fit',

    // mapDefaultFont : '../fonts/full-plain/basic.fnt'
    // mapDefaultFont : '../fonts/tibet/basic.fnt'

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

    vts.utils.loadJSON('./CNTR_RG_60M_2016_4326.geojson', geojsonLoaded);
//    vts.utils.loadJSON('./us.json', geojsonLoaded);
//    vts.utils.loadJSON('./chor.json', geojsonLoaded);
//    vts.utils.loadJSON('https://pkgstore.datahub.io/examples/geojson-tutorial/example/data/db696b3bf628d9a273ca9907adcea5c9/example.geojson', geojsonLoaded);
//    vts.utils.loadJSON('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson', geojsonLoaded);
}


function geojsonLoaded(data) {
    //create geodata object
    geodata = map.createGeodata();

    //import GeoJSON data
    //polygon are not supported yet
//    geodata.importGeoJson(data, null, null, {'tesselation': {'mode':'auto'}} );
    geodata.importGeoJson(data, null, null, {'tesselation': {'mode':'by-length', 'length':200000}} );

    //this function is needed only when 'float' heights are used
    //in case you use data with 'fix' height only then you can
    //skip this function and call makeFreeLayer directly
   // geodata.processHeights('node-by-precision', 10, onHeightProcessed);

    geodata.processHeights('none', 0, onHeightProcessed);

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
              "polygon-color": [{"random": [0,255]},255,{"random": [0,255]},155],
              "polygon-extrude": {"random": [0,500000]},
             // "polygon-culling": "back",
              "polygon-use-stencil": false,
              "polygon-style": "flatshade",
              "line": false,
              "line-width": 4,
              "line-color": [255,0,255,255],
              "zbuffer-offset": [-0.001,0,0],
              "point": false,
              "point-radius": 20,
              "point-color": [100,255,100,255]
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

