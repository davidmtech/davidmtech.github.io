
import * as THREE from './libs/three.module.js';

const Processor = function (vertices, classes, initData) {
    this.vertices = vertices;
    this.classes = classes;
    this.initData = initData;
    this.currentPlanePack = [];
    this.currentLayerPack = [];
    this.planes = [];
    this.commands = [];
    this.commandsIndex = 0;
};

Processor.prototype = {

    applyCommands: function(skipClear) {
        if (!this.vertices) {
            return;
        }

        if (!this.initData) {
            this.clearVolume();
        } else {
            this.applyBin(this.initData);
        }

        let planePack = [];
        let layerPack = new Uint8Array(256);
        layerPack.fill(1);

        for (let i = 0, li = this.commandsIndex; i < li; i++) {

            if (!this.commands[i]) {
                continue;
            }

            if (this.commands[i].type == 'frustum') {
                this.applyFrustumVolume(this.commands[i], planePack, layerPack);
            } else if (this.commands[i].type == 'poly-frustum') {
                this.applyPolyFrustumVolume(this.commands[i], planePack, layerPack);
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
        let vertices = this.vertices;
        let classes = this.classes;
        
        for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {
            classes[j] = 0;
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

    applyFrustumVolume: function(shapeParams, planePack, layerPack) {
        let vertices = this.vertices;
        let classes = this.classes;
        let m = new THREE.Matrix4(); m.elements = shapeParams.m.slice();
        let pp = new THREE.Vector4();
        let layerIndex2 = (shapeParams.layer || 0);
        let layerIndex = shapeParams.removeMode ? 0 : layerIndex2;
        let rect = shapeParams.rect;
        let x1 = rect.x1, x2 = rect.x2, y1 = rect.y1, y2 = rect.y2;
        let onlyUnclassified = shapeParams.onlyUnclassified || false;
        let removeMode = shapeParams.removeMode || false;

        for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {

            if (onlyUnclassified) {
                if (removeMode) {
                    if (classes[j] != layerIndex2) {
                        continue;
                    }
                } else {
                    if (classes[j]) {
                        continue;
                    }
                }
            }

            if (!layerPack[classes[j]]) {
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
                classes[j] = layerIndex;
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

    applyPolyFrustumVolume: function(shapeParams, planePack, layerPack) {
        let vertices = this.vertices;
        let classes = this.classes;
        let m = new THREE.Matrix4(); m.elements = shapeParams.m.slice();
        let pp = new THREE.Vector4();
        let poly = shapeParams.poly;
        let layerIndex2 = (shapeParams.layer || 0);
        let layerIndex = shapeParams.removeMode ? 0 : layerIndex2;
        let onlyUnclassified = shapeParams.onlyUnclassified || false;
        let removeMode = shapeParams.removeMode || false;

        for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {

            if (onlyUnclassified) {
                if (removeMode) {
                    if (classes[j] != layerIndex2) {
                        continue;
                    }
                } else {
                    if (classes[j]) {
                        continue;
                    }
                }
            }

            if (!layerPack[classes[j]]) {
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
                classes[j] = layerIndex;
            }
        }
    },

    applyBin: function ( data ) {
        let classes = this.classes;

        for (let i = 0, li = classes.length; i < li; i++) {
            classes[i] = data[i];
        }
    },

    toBin: function () {
        return this.classes;
    },

    addCommand: function (command) {
        this.commands[this.commandsIndex] = command;
        this.commandsIndex++;
    },

    addPlane: function (plane) {
        this.planes.push(plane);
        return this.planes.length - 1;
    },

    tracePoints: function(x, y, screenLX, screenLY, camPos, mvp, planePack, layerPack, pointSize) {
        let vertices = this.vertices;
        let classes = this.classes;
        let pp = new THREE.Vector4(), x1,x2,y1,y2, s = Math.max(1, pointSize * 0.5);

        x1 = ((x-s) / screenLX) * 2 - 1;
        x2 = ((x+s) / screenLX) * 2 - 1;
        y2 = -(((y-s) / screenLY) * 2 - 1);
        y1 = -(((y+s) / screenLY) * 2 - 1);

        let points = [];

        for (let i = 0, li = vertices.length, j = 0; i < li; i+=3, j++) {

            pp.set(vertices[i],vertices[i+1],vertices[i+2], 1);
            pp.applyMatrix4(mvp);

            let w = 1.0 / pp.w;
            pp.x *= w;
            pp.y *= w;
            pp.z *= w;

            if (!(pp.x > x2 || pp.x < x1 || pp.y > y2 || pp.y < y1 || pp.z > 1 || pp.z < -1)) {

                let p = new THREE.Vector3(vertices[i],vertices[i+1],vertices[i+2]);

                points.push({p: p, d: camPos.distanceTo(p), c:classes[j] });
            }
        }

        if (points.length > 0) {

            points.sort(function(a, b){return a.d-b.d});

            for (let i = 0, li = points.length; i < li; i++) {
                let p = points[i].p;

                if (!this.checkPlanes(p.x,p.y,p.z,planePack) || !layerPack[points[i].c]) {
                    continue;
                }

                return points[i].p;
            }
        }

        return null;
    },

    undo: function () {
        if (this.commandsIndex > 0) {
            this.commandsIndex--;
        }

        if (this.commandsIndex > 0 && this.commands[this.commandsIndex].type =='clipping-planes') {
            this.commandsIndex--;
        }

        if (this.commandsIndex > 0 && this.commands[this.commandsIndex].type =='layers-visibility') {
            this.commandsIndex--;
        }
    },

    redo: function () {
        if (this.commandsIndex < this.commands.length) {
            this.commandsIndex++;
        }

        if (this.commandsIndex < this.commands.length && this.commands[this.commandsIndex].type =='clipping-planes') {
            this.commandsIndex++;
        }

        if (this.commandsIndex < this.commands.length && this.commands[this.commandsIndex].type =='layers-visibility') {
            this.commandsIndex++;
        }
    }
    
};

export { Processor };












