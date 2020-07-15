import * as THREE from './libs/three.module.js';

import { Loader } from './Loader.js';


window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
//window.Timer = new Timer();

Number.prototype.format = function () {
    return this.toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, "$1," );
};


window.THREE = THREE; 

const Editor = function () {

    this.commands = [];
    this.commandsIndex = 0;

    this.model = null;

    this.planes = [];
    this.viewPlanes = [];
    this.currentPlanePack = [];
    this.onlyUnclassified = false;

};

Editor.prototype = {


    applyCommands: function() {

        this.clearVolume();

        let planePack = [];

        let layerPack = new Uint8Array(256);
        layerPack.fill(1);

        for (let i = 0, li = this.commandsIndex; i < li; i++) {

            if (!this.commands[i]) {
                continue;
            }

            if (this.commands[i].type == 'frustum') {
                this.applyFrustumVolume(null, this.commands[i], planePack, layerPack);
            } else if (this.commands[i].type == 'poly-frustum') {
                this.applyPolyFrustumVolume(null, this.commands[i], planePack, layerPack);
            } else if (this.commands[i].type == 'box') {
                this.applyBoxVolume(this.commands[i], planePack, layerPack);
            } else if (this.commands[i].type == 'clipping-planes') {
                let planes = this.commands[i].planes;
                planePack = [];
                this.currentPlanePack = planes.slice();

                for (let j = 0, lj = planes.length; j < lj; j++) {
                    planePack.push(this.planes[planes[j]]);
                }

            } else if (this.commands[i].type == 'layers-visibility') {

                if (this.commands[i].visible) {
                    let planes = this.commands[i].visible;
                    layerPack.fill(0);

                    for (let j = 0, lj = planes.length; j < lj; j++) {
                        layerPack[planes[j]] = 1;
                    }

                } else {
                    let planes = this.commands[i].hidden;
                    layerPack.fill(1);

                    for (let j = 0, lj = planes.length; j < lj; j++) {
                        layerPack[planes[j]] = 0;
                    }
                }

                this.currentLayerPack = layerPack.slice();
            }

        }

    },

    clearVolume: function() {

        let model = this.model;

        if (model) {

            let vertices = model.geometry.attributes.position.array;
            //let colors = model.geometry.attributes.colorRGBA.array;

            let colors = new Uint8Array(Math.round(vertices.length / 3));
            colors.fill(0);

            model.colors = colors;
        }
    },

    checkPlanes: function(x, y, z, planePack) {

        for (let i = 0, li = planePack.length; i < li; i++) {

            let plane = planePack[i];

            if ((-x)*plane[0] + (-y)*plane[1] + (-z)*plane[2] > plane[3]) {
                return false;
            }
        }

        return true;
    },

    applyBoxVolume: function(shapeParams, planePack, layerPack) {

        let model = this.model;
        let shape = this.selected;

        if (model && (shape || shapeParams)) {

            let layerIndex;// / 255.0;
            let vertices = model.geometry.attributes.position.array;
            let colors = model.colors;
            let m = new THREE.Matrix4(), bbox, onlyUnclassified;

            m.elements = shapeParams.m.slice();
            m.getInverse(m);
            bbox = new THREE.Box3(shapeParams.bbox.min, shapeParams.bbox.max);
            layerIndex = (shapeParams.layer || 1) / 255.0;
            onlyUnclassified = shapeParams.onlyUnclassified || false;


            let c = new THREE.Vector3(0,0,0);
            
            for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {

                if ((onlyUnclassified && colors[j+3]) || !layerPack[colors[j]]) {
                    continue;
                }

                if (planePack && !this.checkPlanes(vertices[i],vertices[i+1],vertices[i+2],planePack)) {
                    continue;
                }
                
                let p = new THREE.Vector3(vertices[i],vertices[i+1],vertices[i+2]);

                p.applyMatrix4(m);

                if (bbox.containsPoint(p)) {
                    colors[j] = layerIndex;
                }

                /*
                if (p.distanceTo(c) < 10) {
                    colors[j+3] = layerIndex;
                }*/
            }

            model.geometry.attributes.colorRGBA.needsUpdate = true;

        }

    },


    applyFrustumVolume: function(rect, shapeParams, planePack, layerPack) {

        let model = this.model;

        if (model) {

            let layerIndex;// / 255.0;
            let vertices = model.geometry.attributes.position.array;
            let colors = model.colors;
            let m = new THREE.Matrix4(), onlyUnclassified;
            let pp = new THREE.Vector4(), x1,x2,y1,y2;

            m.elements = shapeParams.m.slice();
            layerIndex = (shapeParams.layer || 0);// / 255.0;
            rect = shapeParams.rect;
            x1 = rect.x1, x2 = rect.x2, y1 = rect.y1, y2 = rect.y2;
            onlyUnclassified = shapeParams.onlyUnclassified || false;

            
            for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {

                if ((onlyUnclassified && colors[j+3]) || !layerPack[colors[j]]) {
                    continue;
                }

                if (planePack && !this.checkPlanes(vertices[i],vertices[i+1],vertices[i+2],planePack)) {
                    continue;
                }
                
                pp.set(vertices[i],vertices[i+1],vertices[i+2], 1);
                pp.applyMatrix4(m);

                let w = 1.0 / pp.w;
                pp.x *= w;
                pp.y *= w;
                pp.z *= w;

                if (!(pp.x > x2 || pp.x < x1 || pp.y > y2 || pp.y < y1 || pp.z > 1 || pp.z < -1)) {
                    colors[j] = layerIndex;
                }
            }

        }
    },

    hitpoly: function(poly, x, y) {
      let c = false;

      for (let i = 0, li = poly.length, j = li-2; i < li; i+=2) {
        if ( ((poly[i+1] > y) != (poly[j+1] > y)) &&
             (x < (poly[j]-poly[i]) * (y-poly[i+1]) / (poly[j+1]-poly[i+1]) + poly[i]) )
           c = !c;

        j = i;
      }

      return c;
    },

    applyPolyFrustumVolume: function(line, shapeParams, planePack, layerPack) {

        let model = this.model;

        if (model) {

            let layerIndex;// / 255.0;
            let vertices = model.geometry.attributes.position.array;
            let colors = model.colors;
            let m = new THREE.Matrix4(), onlyUnclassified;
            let pp = new THREE.Vector4();
            let poly;

            poly = shapeParams.poly;
            m.elements = shapeParams.m.slice();
            layerIndex = (shapeParams.layer || 1);// / 255.0;
            onlyUnclassified = shapeParams.onlyUnclassified || false;

           
            for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {

                if ((onlyUnclassified && colors[j+3]) || !layerPack[colors[j]]) {
                    continue;
                }

                if (planePack && !this.checkPlanes(vertices[i],vertices[i+1],vertices[i+2],planePack)) {
                    continue;
                }
                
                pp.set(vertices[i],vertices[i+1],vertices[i+2], 1);
                pp.applyMatrix4(m);

                let w = 1.0 / pp.w;
                pp.x *= w;
                pp.y *= w;
                pp.z *= w;

                if (!(pp.z > 1 || pp.z < -1 || !this.hitpoly(poly, pp.x, pp.y))) {
                    colors[j] = layerIndex;
                }
            }
        }
    },

    fromJSON: function ( json ) {

        if(!json) {
            return;
        }

        if (json.commands) {
            this.commands = JSON.parse(JSON.stringify(json.commands));
        }

        if (json.commandsIndex) {
            this.commandsIndex = json.commandsIndex;
        }

        if (json.planes) {
            this.planes = JSON.parse(JSON.stringify(json.planes));
        }

        if (json.viewPlanes) {
            this.viewPlanes = JSON.parse(JSON.stringify(json.viewPlanes));
        }
    },


    toBin: function () {

        let model = this.model;

        if (model) {
            /*
            let colors = model.colors;

            let points = colors.length / 4;
            let classes = new Uint8Array(points);

            for (let i = 0; i < points; i++) {
                classes[i] = colors[i*4+3];
            }*/

            return this.model.colors;

        } else {
            return new Uint8Array(0);
        }
    },

    save: function( blob, filename ) {
        let link = document.createElement( 'a' );
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.dispatchEvent( new MouseEvent( 'click' ) );
    },

    onModelLoaded: function(geometry) {

        document.getElementById('status').innerHTML += 'PLY loaded<br>';

        console.log('loaded');

        this.model = { geometry: geometry};

        this.applyCommands();

        document.getElementById('status').innerHTML += 'Processing finished<br>';

        let filename = document.getElementById('jsonfile').files[0].name;

        let strings = filename.split('.');

        if (strings.length > 1) {
            filename = strings[0];
        }

        filename += '.bin';

        this.save( new Blob( [ this.toBin() ], { type: 'application/octet-stream' } ), filename );

        document.getElementById('status').innerHTML += 'Done<br>';

    },


    convert: function () {

        console.log('sdfsd fsd fsdf ');

        document.getElementById('status').innerHTML = '';

        let loader = new Loader(this);

        if (!document.getElementById('plyfile').files[0]) {
            document.getElementById('status').innerHTML += 'No PLY file<br>';
        }

        if (!document.getElementById('jsonfile').files[0]) {
            document.getElementById('status').innerHTML += 'No JSON file<br>';
        }

        if (!document.getElementById('plyfile').files[0] ||
            !document.getElementById('jsonfile').files[0]) {
            return;
        }

        document.getElementById('jsonfile').files[0].text().then((data) => {

            //console.log(JSON.stringify(event));
            this.fromJSON(JSON.parse(data));

            document.getElementById('status').innerHTML += 'JSON loaded<br>';

            loader.loadModel(document.getElementById('plyfile').files[0]);

        });

    },


};

export { Editor };
