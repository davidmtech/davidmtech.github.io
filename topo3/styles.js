var osmStyle = {
  "constants": {
    "@main-font": ["noto-mix","noto-cjk"],
    "@italic-font": ["noto-italic","noto-mix","noto-cjk"],
    "@bold-font": ["noto-bold","noto-mix","noto-cjk"],
    "@icon-circle": ["circle",0,0,63,63],
    "@icon-hill": ["hill",0,0,63,63],
    "@base-color": [255,255,255,255],
    "@base-color2": [0,0,0,255],
    "@base-stick": [70,0,2,255,255,255,100,0],
    "@osmid": {"if":[["has","$osm_id"],"$osm_id",""]},

    "@name-solver": {"if":[["has","$name"],{"if":[["any",["!has","$name:en"],["==",{"has-latin":"$name"},true]],"{$name}","{$name}\n{$name:en}"]},""]},
    "@id-solver": "{@osmid} {@ele-solver} {@name-solver}",

    "@country-label": {"uppercase":{"if":[["==","@name-solver","Schweiz/Suisse/Svizzera/Svizra"],"Switzerland",{"if":[["==","@name-solver","België - Belgique - Belgien"],"België","{@name-solver}"]}]}},
    "@country-area": 1234,

    "@is-capital": {"if":[["<=",{"str2num":"$capital"},2],1,0]},
    "@city-label": "{@name-solver}",
    "@id-solver-town": "@city-label",
    "@town-population": {"str2num": {"if":[["has","$population"],"$population",1]} },

    "@peak-prominece": {"add":[{"if":[["has","$ele"],{"mul":[0.0001,{"str2num":"$ele"}]},0]},{"if":[["has","$prominence"],{"mul":[0.3048,{"str2num":"$prominence"}]},0]}]},

    "@ele-solver": "{{'round': {'str2num':'$ele'}}} m", 
    "@peak-name": {"if":[["has","$ele"],"{@name-solver}\n({@ele-solver})","{@name-solver}"]} 
  },

  "fonts": {
    "noto-bold": "//cdn.melown.com/vts/melown2015/fonts/noto-bold/1.0.0/noto-b.fnt",
    "noto-italic": "//cdn.melown.com/vts/melown2015/fonts/noto-italic/1.0.0/noto-i.fnt",
    "noto-mix": "//cdn.melown.com/vts/melown2015/fonts/noto-extended/1.0.0/noto.fnt",
    "noto-cjk": "//cdn.melown.com/vts/melown2015/fonts/noto-cjk/1.0.0/noto.fnt",
    "#default": "//cdn.melown.com/vts/melown2015/fonts/noto-basic/1.0.0/noto.fnt"
  },
  "layers": {

    "country-boundaries": {
      "filter": ["all",["==","#group","boundary"],["==","$admin_level","2"],["!=","$maritime","1"]],
      "line": true,
      "line-flat": false,
      "line-width": 4,
      "line-color": [255,255,255,128],
      "zbuffer-offset": [-0.01,0,0]
    },
    "state-boundaries": {
      "filter": ["all",["==","#group","boundary"],["==","$admin_level","4"],["!=","$maritime","1"]],
      "line": true,
      "line-flat": false,
      "line-width": 4,
      "line-color": [255,255,255,64],
      "zbuffer-offset": [-0.01,0,0]
    },
    "country-labels": {
      "visible": false,
      "filter": ["all",["==","#group","place"],["==","$class","country"]],
      "importance-source": {"logScale": ["@country-area", 24183000]},
      "importance-weight": 1,
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
      "zbuffer-offset": [-0.15,0,0],
      "hysteresis": [1500,1500,"@id-solver-town",true]
    },
    "towns-labels": {
      "filter": ["all",["==","#group","place"],["in","$class","city","town","village","hamlet"]],
      "&imp": {"logScale": ["@town-population", 24183000]},
      "&rank": {"discrete2":["&imp",[[1,19.71],[19.72,4],[56.04,4],[56.06,3],[63.64,3],[63.66,2],[72.84,2],[72.86,1],[80.47,1],[80.49,0]]]},
      "importance-source": "&imp",
      "importance-weight": 1,
      "label": true,
      "label-font": "@main-font",
      "label-source": "@city-label",
      "label-color": {"linear2":["&rank",[[1,[255,233,0,255]],[5,[230,230,230,255]]]]},
      "label-stick": {"linear2":["&rank",[[1,[70,0,2,255,233,0,128]],[5,[70,0,2,230,230,230,128]]]]},
      "label-size": {"discrete2":["&rank",[[0,19],[1,18],[2,17],[3,16],[4,15],[5,14]]]},
      "label-offset": [0,0],
      "label-no-overlap": true,
      "zbuffer-offset": [-0.15,0,0],
      "hysteresis": [1500,1500,"@id-solver-town",true]
    },

    "peaks": {
      "filter": ["all",["==","#group","mountain_peak"],["has","$name"],["!=","$name",""]],
      "&imp": {"logScale": ["@peak-prominece", 8848.8848]},
      "&rank": {"discrete2":["&imp",[[1,19.71],[19.72,4],[56.04,4],[56.06,3],[63.64,3],[63.66,2],[72.84,2],[72.86,1],[80.47,1],[80.49,0]]]},
      "importance-source": "&imp",
      "importance-weight": 1,
      "label": true,
      "label-offset": [0,0],
      "label-color": {"linear2":["&rank",[[1,[255,233,0,255]],[5,[230,230,230,255]]]]},
      "label-stick": {"linear2":["&rank",[[1,[70,0,2,255,233,0,128]],[5,[70,0,2,230,230,230,128]]]]},
      "label-size": {"discrete2":["&rank",[[0,19],[1,18],[2,17],[3,16],[4,15],[5,14]]]},
      "label-source": "@peak-name",
      "label-font": "@main-font",
      "label-no-overlap": true,
      "zbuffer-offset": [-0.25,0,0],
      "culling": 89,
      "hysteresis": [1500,1500,"@id-solver",true]
    }
  }
};

var ultrasStyle = {
  "constants": {
    "@main-font": ["noto-mix","noto-cjk"],
    "@italic-font": ["noto-italic","noto-mix","noto-cjk"],
    "@name-solver": {"uppercase":{"if":[["has","$name"],"$name","$Name"]}},
    "@ele": {"if":[["has","$elevation"],"$elevation","$Elevation"]},
    "@feet": {"round":{"mul":[3.2808399,{"str2num":"@ele"}]}},
    "@ele-solver": "{{'round': {'str2num':'@ele'}}} m",
    "@id-solver": "{@ele-solver} {@name-solver}",
    "@peak-prominece": {"str2num": {"if":[["has","$prom"],"$prom","$Prom"]}},
  },

  "fonts": {
    "noto-italic": "//cdn.melown.com/vts/melown2015/fonts/noto-italic/1.0.0/noto-i.fnt",
    "noto-mix": "//cdn.melown.com/vts/melown2015/fonts/noto-extended/1.0.0/noto.fnt",
    "noto-cjk": "//cdn.melown.com/vts/melown2015/fonts/noto-cjk/1.0.0/noto.fnt",
    "#default": "//cdn.melown.com/vts/melown2015/fonts/noto-basic/1.0.0/noto.fnt"
  },

  "layers": {
    "peak-labels": {
      "importance-source": {"logScale": ["@peak-prominece", 8848.8848]},
      "importance-weight": 1,
      "visible": true,
      "label": true,
      "label-font": "@main-font",
      "label-stick": [70,0,2,255,233,0,128],
      "label-color": [255,233,0,255],
      "label-size": 19,
      "label-source": "{@name-solver}\n({@ele-solver})",
      "label-offset": [0,0],
      "label-no-overlap": true,
      "zbuffer-offset": [-1,0,0],
      "culling": 89,
      "hysteresis": [1500,1500,"@id-solver",true]
    }
  }
};

