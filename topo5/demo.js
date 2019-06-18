
var browser;

var selevation = [0,1,4000,1];
var sefade = 0;
var senum = 0;

var setable = [
                [0,1,4000,1],
                [0,2,4000,1.5],
                [0,3,4000,2.25]
        ];


function seChange(num, value) {
    value = parseFloat(value);

    if (selevation[num] != value) {
        selevation[num] = value;
        updateSE();
    }
}

function fadeChange(value) {
    value = parseFloat(value);

    if (sefade != value) {
        sefade = value;
        updateSE();
    }
}

function updateSE() {
    if (browser && browser.renderer) {
        var fade = sefade * 0.01;
        browser.renderer.setSuperElevation(selevation[0], 1 + (selevation[1] - 1) * fade,
                                           selevation[2], 1 + (selevation[3] - 1) * fade);
        browser.map.redraw();
    }

    if (senum != -1) {

        if (selevation[0] != setable[senum][0] || selevation[1] != setable[senum][1] ||
            selevation[2] != setable[senum][2] || selevation[3] != setable[senum][3]) {
            senum = -1;
        } else if (sefade != (senum == 0 ? 0 : 100)) {
            senum = -1;
        }

        document.getElementById('se-b1').style.borderStyle = "outset";
        document.getElementById('se-b2').style.borderStyle = "outset";
        document.getElementById('se-b3').style.borderStyle = "outset";

        switch(senum) {
            case 0: document.getElementById('se-b1').style.borderStyle = "inset"; break;
            case 1: document.getElementById('se-b2').style.borderStyle = "inset"; break;
            case 2: document.getElementById('se-b3').style.borderStyle = "inset"; break;
        }

    }

}

function seButton(num) {

    if (num == 0) {
        sefade = 0;
    } else {
        sefade = 100;
    }

    senum = num;
    selevation = setable[num].slice();

    var view = browser.map.getView();

    view.options = num == 0 ? {} : {
        superelevation : [ [selevation[0],selevation[2]], [selevation[1],selevation[3]] ]
    }

    browser.map.setView(view);
    
    document.getElementById('se-h1').value = '' + selevation[0];
    document.getElementById('se-f1').value = '' + selevation[1];
    document.getElementById('se-h2').value = '' + selevation[2];
    document.getElementById('se-f2').value = '' + selevation[3];
    document.getElementById('se-fade').value = '' + sefade;
    updateSE();
}


function startDemo() {
    updateSE();

    var params = vtsParseUrlParams();    

    //params['map'] = 'https://cdn.melown.com/vts/melown2015/mapycz/live/mapConfig.json';
    params['map'] = 'https://rigel.mlwn.se/store/map-config/high-terrain/mapConfig.json';

    params['view'] = 'mapycz-default';
    params['jumpAllowed'] = true;
    params['positionInUrl'] =  true;
//    params['mapFeaturesReduceMode'] = 'scr-count7';
    params['mapFeaturesReduceMode'] = 'scr-count8';

    params['bigScreenMargins'] = true;
    //params['timeNormalizedInertia'] = true;
    

    if (!params['mapFeaturesReduceParams']) {
        params['mapFeaturesReduceParams'] = [0.2, 0.6, 11, 1, 1000, 5];
        //params['mapFeaturesReduceParams'] =  [0.05,0.15,11,1,1000];
        //params['mapFeaturesReduceParams'] =  [0.1,0.10,2,1,1];
    }

    browser = vts.browser('melown-demo', params);

    //hack replace free layers styles
    browser.on('map-mapconfig-loaded', (function(data){

        data.boundLayers["eox-it-sentinel2-cloudless"] = 
            {
                "credits" : 
                {
                    "eox-it" : 
                    {
                        "id" : 125,
                        "notice" : "Datasource: [https://s2maps.eu s2maps.eu] by EOX IT Services GmbH"
                    }
                },
                "lodRange" : [ 1, 15 ],
                "maskUrl" : "https://cdn.melown.com/vts/melown2015/imagery/global/eox-it-sentinel2-cloudless/{lod}-{x}-{y}.mask?r=2",
                "tileRange" : 
                [
                    [ 0, 0 ],
                    [ 1, 1 ]
                ],
                "type" : "raster",
                "url" : "https://cdn.melown.com/vts/melown2015/imagery/global/eox-it-sentinel2-cloudless/{lod}-{x}-{y}.jpg?r=2",

                
                "options" : {
                     // "shaderFilter" : ""
                     //"shaderFilter" : "c.rgb = mix(c.rgb, vec3(1.0), 0.5);"
                }
            };

       //data.boundLayers["flat"] = "//dfsdfds";


     data['view']['surfaces'] =
         {
            "terrain-viewfinder3": [
        //      { "id": "eox-it-sentinel2-cloudless", "shaderFilter" : "c.rgb = mix(c.rgb, vec3(1.0), 0.5);" }
         //     { "id": "eox-it-sentinel2-cloudless", "shaderFilter" : "c.rgb = mix(c.rgb, vec3(1.0,0.5,0.5), 0.75);" }
              { "id": "eox-it-sentinel2-cloudless", //}

        //       "shaderFilter" : "c.rgb = mix(c.rgb, vec3(1.0), 0.75);" }


               "shaderVarFlatShade" : true,
               "shaderFilter" : "c.rgb = mix(c.rgb,flatShadeData.rgb, 0.25);" } 
            ]
         };


     data['view']['freeLayers'] =
          {
            "osm-maptiler": {
              "style": osmStyle
            },
            "peaklist-org-ultras": {
              "style": ultrasStyle
            }
          };
    }));

}
