
var browser;

var zooms = [
5387767,
2693883,
1346940,
673469,
336734,
168366,
84183,
42090,
21044,
10521,
5259,
2629,
1313,
656,
328 ];

var zoom = 3;

function zoomIn() {
    zoom++;
    if (zoom > 14) zoom = 14;
    setZoom();
}

function zoomOut() {
    zoom--;
    if (zoom < 0) zoom = 0;
    setZoom();
}

function setZoom() {
    var pos = browser.map.getPosition();
    pos.setViewExtent(zooms[zoom]);
    browser.map.setPosition(pos);
    document.getElementById('count').innerHTML = '' + (zoom+4);
}


var mapczStyle = {
  "constants": {
    "@main-font": ["noto-mix","noto-cjk"],
    "@italic-font": ["noto-italic","noto-mix","noto-cjk"],
    "@bold-font": ["noto-bold","noto-mix","noto-cjk"],
    "@icon-circle": ["circle",0,0,63,63],
    "@icon-hill": ["hill",0,0,63,63],
    "@base-color": [0,0,0,255],
    "@base-color2": [255,255,255,255],
    "@base-stick": [70,5,2,0,0,0,100,14],
    "@name-solver": {"if":[["has","$name"],{"if":[["any",["!has","$name:en"],["==",{"has-latin":"$name"},true]],"{$name}","{$name}\n{$name:en}"]},""]},
    "@country-caps": [255,255,255,255],
    "@country-label": {"uppercase":{"if":[["==","@name-solver","Schweiz/Suisse/Svizzera/Svizra"],"Switzerland",{"if":[["==","@name-solver","België - Belgique - Belgien"],"België","{@name-solver}"]}]}},
    "@country-imp": {"sub":[95,{"str2num":"$rank"}]},
    "@feet": {"round":{"mul":[3.2808399,{"str2num":"$ele"}]}},
    "@ele-solver2": {"if":[["==","#metric",true],"{{'round': {'str2num':'$ele'}}} m","{@feet} ft"]},
    "@ele-solver": "{{'round': {'str2num':'$ele'}}} m",
    "@peak-name": {"if":[["has","$ele"],"{@name-solver}\n{@ele-solver}","{@name-solver}"]},
    "@peak-name-3": {"if":[["has","$ele"],"{@name-solver}\n {@ele-solver} {@prominence-name} r{@peak-rank}","{@name-solver} {@prominence-name} r{@peak-rank}"]},
    "@peak-name-2": "{@name-solver}\n {@prominence}}",
    "@prominence": {"add":[{"if":[["has","$ele"],{"mul":[0.0001,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[0.003048,{"str2num":"$prominence"}]},0]}]},
    "@prominence2": {"if":[["has","$prominence"],{"mul":[0.3048,{"str2num":"$prominence"}]},0]},
    "@prom2rank": {"clamp":[{"add":[{"mul":["@prominence",-0.27027]},14.81081]},0,20]},
    "@prominence-name": {"round":"@prominence"},
    "@osmid": {"if":[["has","$osm_id"],"$osm_id",""]},
    "@id-solver": "{@osmid} {@ele-solver} {@name-solver}",
    "@peak-rank": {"discrete2":["@prominence2",[[1,5],[2,4],[162,4],[164,3],[324,3],[326,2],[749,2],[751,1],[1499,1],[1501,0]]]},
    "@peak-name2": "@peak-name",
    "@peak-imp-old": {"add":[40,{"mul":[0.333,"@prominence"]}]},
    "@peak-imp": {"sub":[90,{"mul":[2.5,"@prom2rank"]}]},
    "@population-to-rank4": {"sub":[47,{"div":[{"log":{"str2num":"$population"}},{"log":1.38}]}]},
    "@population-to-rank4-dbg": {"div":[{"round":{"mul":[10,{"sub":[47,{"div":[{"log":{"str2num":"$population"}},{"log":1.38}]}]}]}},10]},
    "@population-to-rank-dbg": {"div":[{"round":{"mul":[10,{"sub":[42,{"add":["@town-class",{"div":[{"log":{"str2num":"$population"}},{"log":1.5}]}]}]}]}},10]},
    "@population-to-rank2": {"if":[["has","$population"],{"sub":[42,{"add":["@town-class",{"div":[{"log":{"str2num":"$population"}},{"log":1.5}]}]}]},{"mul":[6,{"sub":[5,"@town-class"]}]}]},
    "@population-to-rank": {"clamp":[{"if":[["has","$population"],{"sub":[42,{"add":["@town-class",{"div":[{"log":{"str2num":"$population"}},{"log":1.5}]}]}]},30]},0,30]},
    "@is-capital": {"if":[["<=",{"str2num":"$capital"},2],1,0]},
    "@town-class": {"if":[["<=",{"str2num":"$capital"},2],4,{"if":[["==","$class","city"],3,{"if":[["==","$class","town"],2,{"if":[["==","$class","village"],1,0]}]}]}]},
    "@city-label-dbg": "{@name-solver}-{$rank}\n{$population}-{@population-to-rank2}\n{$class}-{@is-capital}",
    "@city-label": "{@name-solver}",
    "@id-solver-town": "@city-label",
    "@town-imp-old": {"sub":[90,{"str2num":"$rank"}]},
    "@town-imp2": {"sub":[90,{"mul":[2.5,{"str2num":"$rank"}]}]},
    "@town-imp": {"sub":[90,{"mul":[1.6666666,"@population-to-rank"]}]},

    "@town-source-z7": {"if":[["has","$capital"],{"if":[["<=",{"str2num":"$capital"},2],{"uppercase":"@city-label"},"@city-label"]},"@city-label"]},
    "@town-size-z7": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],21,{"linear2":["@population-to-rank",[[7,19],[18,14]]]}]},

    "@town-source-z8": {"if":[["has","$capital"],{"if":[["<=",{"str2num":"$capital"},2],{"uppercase":"@city-label"},"@city-label"]},"@city-label"]},
    "@town-font-z8": {"if":[["has","$capital"],{"if":[["<=",{"str2num":"$capital"},2],"@bold-font","@main-font"]},"@main-font"]},
    "@town-size-z8": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],25,{"linear2":["@population-to-rank",[[7,21],[18,14]]]}]},

    "@town-source-z9": {"if":[["has","$capital"],{"if":[["<=",{"str2num":"$capital"},2],{"uppercase":"@city-label"},"@city-label"]},"@city-label"]},
    "@town-font-z9": {"if":[["<=","@population-to-rank",11],"@bold-font","@main-font"]},
    "@town-size-z9": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],30,{"linear2":["@population-to-rank",[[7,25],[18,14]]]}]},

    "@town-source-z10": {"if":[["has","$capital"],{"if":[["<=",{"str2num":"$capital"},2],{"uppercase":"@city-label"},"@city-label"]},"@city-label"]},
    "@town-font-z10": {"if":[["<=","@population-to-rank",11],"@bold-font","@main-font"]},
    "@town-size-z10": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],30,{"linear2":["@population-to-rank",[[7,25],[18,18]]]}]},
  
    "@town-source-z11": {"if":[["<=","@population-to-rank",11],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z11": {"if":[["<=","@population-to-rank",20],"@bold-font","@main-font"]},
    //"@town-size-z11": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,33],[20,22],[30,12]]]}]},
    "@town-size-z11": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,38],[13,33],[20,22],[30,12]]]}]},

    "@town-source-z12": {"if":[["<=","@population-to-rank",13],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z12": {"if":[["<=","@population-to-rank",23],"@bold-font","@main-font"]},
    //"@town-size-z12": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,38],[20,32],[30,12]]]}]},
    "@town-size-z12": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,38],[13,32],[20,31],[30,12]]]}]},

    "@town-source-z13": {"if":[["<=","@population-to-rank",18],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z13": {"if":[["<=","@population-to-rank",23],"@bold-font","@main-font"]},
    //"@town-size-z13": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,38],[20,32],[30,16]]]}]},
    "@town-size-z13": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,38],[13,32],[20,31],[30,16]]]}]},

    "@town-source-z14": {"if":[["<=","@population-to-rank",27],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z14": {"if":[["<=","@population-to-rank",23],"@bold-font","@main-font"]},
//    "@town-size-z14": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,38],[20,38],[30,18]]]}]},
    "@town-size-z14": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,38],[13,32],[20,31],[30,18]]]}]},

    "@town-source-z15": {"if":[["<=","@population-to-rank",29],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z15": "@main-font",
    //"@town-size-z15": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,38],[20,38],[30,28]]]}]},
    "@town-size-z15": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],38,{"linear2":["@population-to-rank",[[7,28],[13,28],[20,28],[30,18]]]}]},

    /*
    "@town-source-z16": {"if":[["<=","@population-to-rank",29],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z16": "@main-font",
    "@town-size-z16": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,38],[20,38],[30,28]]]}]},

    "@town-source-z17": {"if":[["<=","@population-to-rank",29],{"uppercase":"@city-label"},"@city-label"]},
    "@town-font-z17": "@main-font",
    "@town-size-z17": {"if":[["all",[["has","$capital"],["<=",{"str2num":"$capital"},2]]],50,{"linear2":["@population-to-rank",[[7,42],[13,38],[20,38],[30,28]]]}]},
    */

    "@z4": 5387767,
    "@z5": 2693883,
    "@z6": 1346940,
    "@z7": 673469,
    "@z8": 336734,
    "@z9": 168366,
    "@z10": 84183,
    "@z11": 42090,
    "@z12": 21044,
    "@z13": 10521,
    "@z14": 5259,
    "@z15": 2629,
    "@z16": 1313,
    "@z17": 656,
    "@z18": 328,
    "@dummy-line": 0

  },
  "bitmaps": {
    "hill": {"url":"data:image/png;base64,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","filter":"trilinear","tiled":false},
    "circle": {"url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NDkxMSwgMjAxMy8xMC8yOS0xMTo0NzoxNiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMzdGNjlEMUUxMjAxMUU4OTU1MkMyNTA5OUFCMzRGNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozMzdGNjlEMkUxMjAxMUU4OTU1MkMyNTA5OUFCMzRGNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjMzN0Y2OUNGRTEyMDExRTg5NTUyQzI1MDk5QUIzNEY1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjMzN0Y2OUQwRTEyMDExRTg5NTUyQzI1MDk5QUIzNEY1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+E49TwQAACbNJREFUeNrsW/lTVNkV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","filter":"trilinear","tiled":false}

  },
  "fonts": {
    "noto-bold": "//cdn.melown.com/libs/vtsjs/fonts/noto-bold/1.0.0/noto-b.fnt",
    "noto-italic": "//cdn.melown.com/libs/vtsjs/fonts/noto-italic/1.0.0/noto-i.fnt",
    "noto-mix": "//cdn.melown.com/libs/vtsjs/fonts/noto-extended/1.0.0/noto.fnt",
    "noto-cjk": "//cdn.melown.com/libs/vtsjs/fonts/noto-cjk/1.0.0/noto.fnt",
    "#default": "//cdn.melown.com/libs/vtsjs/fonts/noto-basic/1.0.0/noto.fnt"

  },
  "layers": {
    "country-labels": {
      "filter": ["all",["==","#group","place"],["==","$class","country"]],
      "visibility-switch": [["@z7",null],["@z6","country-labels-z6"],["@z5","country-labels-z5"],["@z4","country-labels-z4"]],
      "culling": 84,
      "zbuffer-offset": [-0.15,0,0],
      "hysteresis": [1500,1500,"@id-solver-town",true]
    },
    "country-labels-z4": {
      "filter": ["skip"],
      "importance-source": "@country-imp",
      "label": true,
      "label-font": "@main-font",
      "label-source": "@country-label",
      "label-color": "@base-color",
      "label-color2": "@base-color2",
      "label-stick": "@base-stick",
      "label-size": 14,
      "label-spacing": 1,
      "label-line-height": 0.8,
      "label-offset": [0,-8],
      "label-no-overlap": true,
      "label-no-overlap-factor": ["div-by-dist","@country-imp"],
      "zbuffer-offset": [-0.15,0,0]
    },
    "country-labels-z5": {
      "inherit": "country-labels-z4",
      "label-font": "@bold-font",
      "label-size": 18
    },
    "country-labels-z6": {
      "inherit": "country-labels-z4",
      "label-font": "@bold-font",
      "label-size": {"linear2":["$rank",[[1,22],[3,19],[4,15]]]}
    },
    "towns-labels": {
      "filter": ["all",["==","#group","place"],["in","$class","city","town","village","hamlet"]],
      "visibility-switch": [["@z15","towns-labels-z15"],["@z14","towns-labels-z14"],["@z13","towns-labels-z13"],["@z12","towns-labels-z12"],["@z11","towns-labels-z11"],["@z10","towns-labels-z10"],["@z9","towns-labels-z9"],["@z8","towns-labels-z8"],["@z7","towns-labels-z7"],["@z6","towns-labels-z6"],["@z5","towns-labels-z5"]],
      "culling": 84,
      "zbuffer-offset": [-0.15,0,0],
      "hysteresis": [1500,1500,"@id-solver-town",true]
    },
    "towns-labels-z5": {
      "filter": ["skip"],
      "importance-source": "@town-imp",
      "pack": true,
      "label": true,
      "label-font": "@main-font",
      "label-source": "@city-label",
      "label-offset": [0,-10],
      "label-color": "@base-color",
      "label-color2": "@base-color2",
      "label-stick": "@base-stick",
      "label-size": 15,
      "label-no-overlap": true,
      "label-no-overlap-factor": ["div-by-dist","@town-imp"],
      "icon": true,
      "icon-source": "@icon-circle",
      "icon-color": [255,255,255,255],
      "icon-scale": 0.4,
      "icon-origin": "bottom-center",
      "icon-offset": [0,10],
      "icon-no-overlap": true,
      "icon-no-overlap-factor": ["div-by-dist","@town-imp"],
      "zbuffer-offset": [-0.15,0,0]
    },
    "towns-labels-z6": {
      "inherit": "towns-labels-z5",
      "label-source": {"if":[["has","$capital"],{"if":[["<=",{"str2num":"$capital"},2],{"uppercase":"@city-label"},"@city-label"]},"@city-label"]},
      "label-size": 15
    },
    "towns-labels-z7": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z7",
      "label-size": "@town-size-z7",
      "label-outline": {"linear2":["@town-size-z7",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z8": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z8",
      "label-font": "@town-font-z8",
      "label-size": "@town-size-z8",
      "label-outline": {"linear2":["@town-size-z8",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z9": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z9",
      "label-font": "@town-font-z9",
      "label-size": "@town-size-z9",
      "label-outline": {"linear2":["@town-size-z9",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z10": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z10",
      "label-font": "@town-font-z10",
      "label-size": "@town-size-z10",
      "label-outline": {"linear2":["@town-size-z10",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z11": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z11",
      "label-font": "@town-font-z11",
      "label-size": "@town-size-z11",
      "label-outline": {"linear2":["@town-size-z11",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z12": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z12",
      "label-font": "@town-font-z12",
      "label-size": "@town-size-z12",
      "label-outline": {"linear2":["@town-size-z12",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z13": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z13",
      "label-font": "@town-font-z13",
      "label-size": "@town-size-z13",
      "label-outline": {"linear2":["@town-size-z13",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z14": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z14",
      "label-font": "@town-font-z14",
      "label-size": "@town-size-z14",
      "label-outline": {"linear2":["@town-size-z14",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z15": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z15",
      "label-font": "@town-font-z15",
      "label-size": "@town-size-z15",
      "label-outline": {"linear2":["@town-size-z15",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z16": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z16",
      "label-font": "@town-font-z16",
      "label-size": "@town-size-z16",
      "label-outline": {"linear2":["@town-size-z16",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "towns-labels-z17": {
      "inherit": "towns-labels-z5",
      "label-source": "@town-source-z17",
      "label-font": "@town-font-z17",
      "label-size": "@town-size-z17",
      "label-outline": {"linear2":["@town-size-z17",[[14,[0.27,0.75,2.2,2.2]],[50,[0.52,0.75,2.2,2.2]]]]}
    },
    "peaks": {
      "filter": ["all",["==","#group","mountain_peak"],["has","$name"],["!=","$name",""]],
      "visible": true,
      "importance-source": "@peak-imp",
      "pack": true,
      "label": true,
      "label-color": "@base-color",
      "label-color2": "@base-color2",
      "label-stick": "@base-stick",
      "label-size": 15,
      "label-offset": [0,-10],
      "label-source": "{@peak-name2}",
      "label-font": "@italic-font",
      "label-no-overlap": true,
      "label-no-overlap-factor": ["div-by-dist","@peak-imp"],
      "icon": true,
      "icon-source": "@icon-hill",
      "icon-color": [50,50,50,255],
      "icon-scale": 0.3,
      "icon-origin": "bottom-center",
      "icon-offset": [0,10],
      "icon-no-overlap": true,
      "icon-no-overlap-factor": ["div-by-dist","@town-imp"],
      "zbuffer-offset": [-0.25,0,0],
      "culling": 89,
      "hysteresis": [1500,1500,"@id-solver",true]
    }
  }
};

var ultrasStyle = {
    "constants": {

        "@main-font": ["noto-mix","noto-cjk"],
        "@italic-font": ["noto-italic", "noto-mix","noto-cjk"],

        "@icon-hill": ["hill", 0, 0, 63, 63],

        "@base-color": [0,0,0,255],
        "@base-color2": [255,255,255,255],
        "@base-stick": [70,5,2,0,0,0,100,14],

        "@name-solver": {"if":[["has","$name"],"$name","$Name"]},
        "@ele": {"if":[["has","$elevation"],"$elevation","$Elevation"]},
        "@feet": {"round":{"mul":[3.2808399,{"str2num":"@ele"}]}},
        "@ele-solver": {"if":[["==","#metric",true],"{{'round': {'str2num':'@ele'}}} m","{@feet} ft"]},
        "@id-solver": "{@ele-solver} {@name-solver}",
        "@prom-solver": {"mul":[0.01,{"str2num":{"if":[["has","$prom"],"$prom","$Prom"]}}]},
        "@prom2rank": {"clamp":[{"add":[{"mul":[ "@prom-solver", -0.270270 ]}, 14.810810 ]}, 0, 20]},

        "@peak-imp-old": {"add":[40,{"mul":[0.333,"@prom-solver"]}]},
        "@peak-imp": {"sub":[90,{"mul":[2.5,"@prom2rank"]}]},
      },

      "fonts": {
        "noto-italic": "//cdn.melown.com/libs/vtsjs/fonts/noto-italic/1.0.0/noto-i.fnt",
        "noto-mix": "//cdn.melown.com/libs/vtsjs/fonts/noto-extended/1.0.0/noto.fnt",
        "noto-cjk": "//cdn.melown.com/libs/vtsjs/fonts/noto-cjk/1.0.0/noto.fnt"
      },

      "bitmaps": {
          "hill": {"url":"data:image/png;base64,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","filter":"trilinear","tiled":false}
      },
    "layers": {
        "peak-labels": {
            "importance-source": "@peak-imp",
            "visible": true,
            "pack": true,
            "label": true,
            "label-font": "@italic-font",
            "label-source": "{@name-solver}\n{@ele-solver}",
            "label-color": "@base-color",
            "label-color2": "@base-color2",
            "label-stick": "@base-stick",
            "label-size": 15,
            "label-offset": [0, -10],
            "label-no-overlap": true,
            "label-no-overlap-factor": ["div-by-dist", "@peak-imp"],
            "icon": true,
            "icon-source": "@icon-hill",
            "icon-color": [50, 50, 50, 255],
            "icon-scale": 0.3,
            "icon-origin": "bottom-center",
            "icon-offset": [0, 10],
            "zbuffer-offset": [-1, 0, 0],
            "culling": 89,
            "hysteresis": [1500, 1500, "@id-solver", true]
        }
    }
} ;


function startDemo() {

    var params = vtsParseUrlParams();    

       // params['pos'] =  ['obj', 16.128569, 49.977362, 'fix', 435.50, 0.00, -90.00, 0.00, 673469, 45.00],
       // params['pos'] =  ['obj', 15.422104, 50.750408, 'fix', 793.53,27.57,-52.27,0.00,5984.35,45.00],

        //investigate!!!!  obj,18.358419,49.903288,fix,253.39,10.97,-82.96,0.00,5984.35,45.00        
       
        //params['map'] = './mapConfig.json';
        //params['map'] = 'https://mapserver-3d.mapy.cz/scenes/current/mapConfig.json';
        //params['map'] = 'https://cdn.melown.com/vts/melown2015/test/seznamcz-outdoor/mapConfig.json';
        params['map'] = 'https://cdn.melown.com/vts/melown2015/mapycz/live/mapConfig.json';
        //params['map'] = 'https://cdn.melown.com/vts/melown2015/mapycz/test/mapConfig.json';
        //params['view'] = 'mapycz-default';

        params['mapLoadMode'] = 'fit';
        //params['mapLoadMode'] = 'topdown';
        //params['mapGridSurrogatez'] =  true;

        //params['mapGridUnderSurface'] =  1;
        //params['mapGridTextureLevel'] =  8;
        //params['mapGridTextureLayer'] =  "bing",
        //params['mapGridTextureLayer'] =  "eox-it-sentinel2-cloudless",
        params['map16bitMeshes'] =  true;
        params['mapOnlyOneUVs'] =  true;
        params['mapIndexBuffers'] =  true;

        params['mapAsyncImageDecode'] =  true;
        params['legacyInertia'] = false;

        params['positionInUrl'] =  true;

        params['mapFeatureStickMode'] =  [0,0];
        params['mapFeatureStickMode'] =  [1,1];
        //params['mapFeatureStickMode'] =  [1,4];
        //params['mapFeatureStickMode'] =  [2,4];

        //params['mapFeaturesReduceMode'] = 'margin';
        //params['mapFeaturesReduceMode'] = 'margin';
        //params['mapFeaturesReduceParams'] = [0.1,3,1];
        //params['mapFeaturesReduceParams'] = [0.2,0,1];

//    browser = vts.browser('melown-demo', { 'map': 'https://cdn.melown.com/vts/melown-assorted/map-config/mapycz/mapConfig.json', 'positionInUrl': true });
    browser = vts.browser('melown-demo', params);

    browser.on('map-mapconfig-loaded', (function(data){

        //var freeLayers = data['view']['freeLayers'];
        //delete freeLayers['osm'];

        //return;

        //data['view']['surfaces'] = {};

        var freeLayers = data['view']['freeLayers'];

        if (freeLayers) {

            //delete freeLayers['osm'];

            for (var key in freeLayers) {
                var layer = freeLayers[key];

                //if (key != 'osm') {
                  //  delete freeLayers[key];
                  //  continue;
                //}

                if (layer.style && (typeof layer.style == 'string')) {

                    if (layer.style.indexOf('mapycz.json') != -1) {
                        layer.style = mapczStyle;
                    } else if (layer.style.indexOf('ultras.json') != -1) {
                        layer.style = ultrasStyle;
                    }
                }
            }

        }

        var namedViews= data['namedViews'];

        for (var key in namedViews) {

            freeLayers = namedViews[key]['freeLayers'];

            if (freeLayers) {

                for (var key2 in freeLayers) {
                    var layer = freeLayers[key2];

                    if (layer.style && (typeof layer.style == 'string')) {

                        if (layer.style.indexOf('mapycz.json') != -1) {
                            layer.style = mapczStyle;
                        } else if (layer.style.indexOf('ultras.json') != -1) {
                            layer.style = ultrasStyle;
                        }
                    }
                }

            }

        }




    }));

}
