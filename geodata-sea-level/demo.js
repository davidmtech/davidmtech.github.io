var browser = null;
var renderer = null;
var map = null;
var geodata = null;
var seaLevelInput = null;

(function startDemo() {

    var params = vtsParseUrlParams();

    params['map'] = 'https://cdn.melown.com/mario/store/melown2015/map-config/melown/VTS-Tutorial-map/mapConfig.json';

    if(!params['pos']) {
        params['position'] = [ 'obj', 13.744257, 45.568033, 'fix', 45.63, 97.36, -37.21, 0.00, 4212.83, 55.00 ];
    }

    params['positionInUrl'] =  true;
    //params['mapLoadMode'] = 'fit',

    // mapDefaultFont : '../fonts/full-plain/basic.fnt'
    // mapDefaultFont : '../fonts/tibet/basic.fnt'

    browser = vts.browser('map-div', params);

    //check whether browser is supported
    if (!browser) {
        console.log('Your web browser does not support WebGL');
        return;
    }

    //create new UI panel
    //html contetnt is in the form of string
    //you can style html elements as usual
    var panel = browser.ui.addControl('sealevel-panel',
        '<div id="sealevel-div" class="sealevel-div">' +
            '<label><b>Sea Level</b></label><br/>' +
            '<input id="seaLevelInput" type="number" min="0" max="300" step="5" value="10" size="4">' +
        '</div>');

    //get destinations-div element
    //do not use document.getElementById,
    //because element ids are changed to unique ids
    seaLevelInput = panel.getElement('seaLevelInput');

    //create event listener
    //once button state is changed then
    //onFlyToNewDestination function is called
    seaLevelInput.on('change', onSeaLevelChange);

    //callback once is map config loaded
    browser.on('map-loaded', onMapLoaded);
})();


//String.prototype.reverse=function(){return this.split("").reverse().join("");}

function onSeaLevelChange() {

    var seaLevel = parseInt(seaLevelInput.element.value) + 40

    //create geodata object
    geodata = map.createGeodata();

    geodata.addPolygon3([

        [13.5377268, 45.8938275, seaLevel],
        [14.0196080, 45.5820852, seaLevel],
        [13.6601861, 45.4587160, seaLevel],
        [13.3186252, 45.7281240, seaLevel]
    ],

    [],

    null,

    'fix', { 'radius' : 20  }, 'rip', null, {"tesselate" : { "by-length": 100 }  });

    geodata.processHeights('node-by-lod', 20, onHeightProcessed);

}

function onMapLoaded() {
    map = browser.map;

    onSeaLevelChange();
}

function onHeightProcessed() {
    var style = {

        "layers" : {
            "poly" : {
                "filter" : ["==", "#type", "polygon"],

                "polygon": true,
                "polygon-color" : [0,255,255,155],
                //"polygon-style": "flatshade",

                //"line": true,
                //"line-width" : 4,
                //"line-color": [255,0,255,255],

                //"zbuffer-offset" : [-0.01,0,0]
            }

        }
    };

    //make free layer
    var freeLayer = geodata.makeFreeLayer(style);

    //add free layer to the map
    map.removeFreeLayer('sealevel', freeLayer);
    map.addFreeLayer('sealevel', freeLayer);

    //add free layer to the list of free layers
    //which will be rendered on the map
    var view = map.getView();
    view.freeLayers.sealevel = {};
    map.setView(view);

}
