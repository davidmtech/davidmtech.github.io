
import * as THREE from './libs/three.module.js';

const Processor = function (vertices, classes, initData, nodeMax) {
    this.vertices = vertices;
    this.classes = classes;
    this.initData = initData;
    this.currentPlanePack = [];
    this.currentLayerPack = [];
    this.planes = [];
    this.commands = [];
    this.commandsIndex = 0;
    this.tree = null;
    this.nodeMax = nodeMax || 100;
    this.testCounter = 0;
    this.ctx = null;
    this.offsetX = 200;
    this.offsetY = 200;
    this.zoom = 1.5;
    this.debugDraw = false;
    this.original = false;
    
    classes.fill(0);
};

Processor.prototype = {

    buildNode: function(center, size, radius, map, index, count, lod) {

        let node = {};
        node.center = center;
        node.radius = radius;

        if (count <= this.nodeMax || lod >= 10 || size <= 1) {
            node.map = map.slice(index, index + count);
            node.children = null;

            //test map
            this.testCounter++;
            this.testCounter = this.testCounter % 13;
            
            let c = this.testCounter + 1;
            let map2 = node.map;
            let classes = this.classes;
            
            for (let i = 0, li = map2.length; i < li; i++) {
                classes[map2[i]] = c;
            }

            return node;
        }
        
        let octantCounter = [0,0,0,0,0,0,0,0];
        let octantIndex = [0,0,0,0,0,0,0,0];

        let octants = this.octants;
        let vertices = this.vertices;
        let classes = this.classes;

        for (let i = index, li = index + count; i < li; i++) {
            let j = map[i]*3;
            let octant = 0;
            
            let x = vertices[j], y = vertices[j+1], z = vertices[j+2];
            
            if (z > center[2]) {
                if (y > center[1]) {
                    if (x > center[0]) {
                        octant = 0;
                    } else {
                        octant = 1;
                    }
                } else {
                    if (x > center[0]) {
                        octant = 2;
                    } else {
                        octant = 3;
                    }
                }
            } else {
                if (y > center[1]) {
                    if (x > center[0]) {
                        octant = 4;
                    } else {
                        octant = 5;
                    }
                } else {
                    if (x > center[0]) {
                        octant = 6;
                    } else {
                        octant = 7;
                    }
                }
            }

            octants[i] = octant;
            octantCounter[octant]++;
        }

        let index2 = 0;

        for (let i = 0; i < 8; i++) {
            if (octantCounter[i] > 0) {
                octantIndex[i] = index2;
                index2 += octantCounter[i];
            }
        }

        let octantIndex2 = octantIndex.slice();

        let map2 = (map === this.map01) ? this.map02 : this.map01;

        for (let i = index, li = index + count; i < li; i++) {
            let octant = octants[i];
            map2[octantIndex2[octant]] = map[i];
            octantIndex2[octant]++;
        }
        
        let size2 = size*0.25;
        node.children = [];
        
        for (let i = 0; i < 8; i++) {
            if (octantCounter[i] > 0) {
                switch(i) {
                    case 0: node.children[i] = this.buildNode([center[0]+size2, center[1]+size2, center[2]+size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 1: node.children[i] = this.buildNode([center[0]-size2, center[1]+size2, center[2]+size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 2: node.children[i] = this.buildNode([center[0]+size2, center[1]-size2, center[2]+size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 3: node.children[i] = this.buildNode([center[0]-size2, center[1]-size2, center[2]+size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 4: node.children[i] = this.buildNode([center[0]+size2, center[1]+size2, center[2]-size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 5: node.children[i] = this.buildNode([center[0]-size2, center[1]+size2, center[2]-size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 6: node.children[i] = this.buildNode([center[0]+size2, center[1]-size2, center[2]-size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                    case 7: node.children[i] = this.buildNode([center[0]-size2, center[1]-size2, center[2]-size2], size*0.5, radius*0.5, map2, octantIndex[i], octantCounter[i], lod + 1); break;
                }
            } else {
                node.children[i] = null;
            }
        }

        return node;
    },

    buildTree: function() {  //build pc octree 
        
        let bmin = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
        let bmax = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];

        let vertices = this.vertices;


        for (let i = 0, li = vertices.length; i < li; i+=3) {
            if (vertices[i] < bmin[0]) bmin[0] = vertices[i];
            if (vertices[i+1] < bmin[1]) bmin[1] = vertices[i+1];
            if (vertices[i+2] < bmin[2]) bmin[2] = vertices[i+2];

            if (vertices[i] > bmax[0]) bmax[0] = vertices[i];
            if (vertices[i+1] > bmax[1]) bmax[1] = vertices[i+1];
            if (vertices[i+2] > bmax[2]) bmax[2] = vertices[i+2];
        }

        let maxPoints = Math.round(vertices.length / 3);
        
        this.map01 = new Uint32Array(maxPoints);
        this.map02 = new Uint32Array(maxPoints);
        this.octants = new Uint8Array(maxPoints);

        let map = this.map01;

        for (let i = 0; i < maxPoints; i++) {
            map[i] = i;
        }

        let center = [(bmin[0] + bmax[0])*0.5, (bmin[1] + bmax[1])*0.5, (bmin[2] + bmax[2])*0.5];
        let rootRadius = Math.sqrt((bmax[0]-center[0])*(bmax[0]-center[0]), (bmax[1]-center[1])*(bmax[1]-center[1]), (bmax[2]-center[2])*(bmax[2]-center[2]));
        let rootSize = Math.max(bmax[0]-bmin[0], bmax[1]-bmin[1], bmax[2]-bmin[2]);
        
        this.rootSize = rootSize;
        this.sfactor = (1/rootSize)*280*this.zoom;

        if (this.debugDraw) {
            for (let i = 0, li = vertices.length; i < li; i+=3) {
                let x = vertices[i], y = vertices[i+1], z = vertices[i+2];
                this.ctx.fillRect(x*this.sfactor+this.offsetX, z*this.sfactor+this.offsetY, 1, 1);
            }

            this.ctx.fill();
        }
        
        this.tree = this.buildNode(center, rootSize, rootRadius, map, 0, maxPoints, 0);
    },

    applyCommands: function(skipClear) {
        if (!this.vertices) {
            return;
        }

        if (this.debugDraw) {
            var canvas = document.getElementById('myCanvas');
            this.ctx = canvas.getContext('2d');
            this.ctx.fillStyle= 'rgb(50,50,50)';
        }

        if (this.original) {
            let node = {};
            node.center = [0,0,0];
            node.radius = 9999999;
            
            let maxPoints = Math.round(this.vertices.length / 3);
            
            node.map = new Uint32Array(maxPoints);

            let map = node.map;

            for (let i = 0; i < maxPoints; i++) {
                map[i] = i;
            }

            this.tree = node;
            
        } else {
            this.buildTree();
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
                //this.applyFrustumVolume(this.commands[i], planePack, layerPack);
                this.traceFrustumVolume(this.commands[i], planePack, layerPack);
            } else if (this.commands[i].type == 'poly-frustum') {
                this.tracePolyFrustumVolume(this.commands[i], planePack, layerPack);
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

    checkSphereWithPlanes: function(x, y, z, r, planePack) {

        for (let i = 0, li = planePack.length; i < li; i++) {
            let plane = planePack[i];

            if ((-x)*plane[0] + (-y)*plane[1] + (-z)*plane[2] > plane[3] + r) {
                return false;
            }
        }

        return true;
    },

    getProjectionFactor: function(m) { //recompute first number in projection matrix
        
        //get aspect from matrix
        let m2 = new THREE.Matrix4();
        m2.getInverse(m);
        
        let pp1 = new THREE.Vector4(0,0,0,1);
        let pp2 = new THREE.Vector4(0,1,0,1);
        let pp3 = new THREE.Vector4(1,0,0,1);
        
        pp1.applyMatrix4(m2);
        pp2.applyMatrix4(m2);
        pp3.applyMatrix4(m2);

        let w = 1.0 / pp1.w;
        pp1.x *= w;
        pp1.y *= w;
        pp1.z *= w;
        
        w = 1.0 / pp2.w;
        pp2.x *= w;
        pp2.y *= w;
        pp2.z *= w;

        w = 1.0 / pp3.w;
        pp3.x *= w;
        pp3.y *= w;
        pp3.z *= w;
        
        let dx = pp1.x - pp2.x;
        let dy = pp1.y - pp2.y;
        let dz = pp1.z - pp2.z;
        
        let l1 = Math.sqrt(dx*dx + dy*dy + dz*dz);

        dx = pp1.x - pp3.x;
        dy = pp1.y - pp3.y;
        dz = pp1.z - pp3.z;

        let l2 = Math.sqrt(dx*dx + dy*dy + dz*dz);

        let aspect = l2 / l1;  //aspect

        // 1/(.07483862571389199*0.1*0.1)*0.5   //ly = 0.074..
        // 668.1041978396283
        // 2*0.1 / (0.1*Math.tan(0.1 * Math.PI / 180.0)*1.7262103505843949)
        // 663.8324386831739  // m[0] of projection ???
        
        let near = 0.1, fovy = 0.1;

        return [2*near / (near*Math.tan(fovy * Math.PI / 180.0)*aspect), aspect];
    },

    traceFrustumVolume: function(shapeParams, planePack, layerPack) {
        let nodeBuffer01 = [this.tree];
        let nodeBuffer02 = [];

        let nodeBuffer = nodeBuffer01;
        let nodeBuffer2 = nodeBuffer02;
        let nodeBufferIndex = 1;
        let nodeBufferIndex2 = 0;

        let m = new THREE.Matrix4(); m.elements = shapeParams.m.slice(0,16);
        let pp = new THREE.Vector4();

        if (shapeParams.m.length <= 16) {
            let res = this.getProjectionFactor(m);
            shapeParams.m.push(res[0], res[1]);
        }

        let pfactor = shapeParams.m[16]; //692.6470620003764;
        let rfactor = 2 / shapeParams.m[17];

        let rect = shapeParams.rect;
        let x1 = rect.x1, x2 = rect.x2, y1 = rect.y1, y2 = rect.y2;
        let w2 = (x2 - x1) * 0.5, h2 = (y2 - y1) * 0.5;
        let rx = (x2 + x1) * 0.5, ry = (y2 + y1) * 0.5;
        
        do {
        
            for (let i = 0; i < nodeBufferIndex; i++) {
                
                let node = nodeBuffer[i];

                let c = node.center;

                //is node visible?
                pp.set(c[0], c[1], c[2], 1);
                pp.applyMatrix4(m);

                let ww = 1.0 / pp.w;
                pp.x *= ww;
                pp.y *= ww;

                let dx = Math.abs(pp.x - rx);
                let dy = Math.abs(pp.y - ry);

                let r = (node.radius * (pfactor / pp.z) * 2 * rfactor) * 1.01;

                if (dx > (w2 + r)) { continue; }
                if (dy > (h2 + r)) { continue; }

                if (dx <= w2 || dy <= h2 || ((dx - w2)*(dx - w2) + (dy - h2)*(dy - h2) <= (r*r))) { //node visible

                    if (!(planePack && !this.checkSphereWithPlanes(c[0], c[1], c[2], node.radius*2.01, planePack))) {
                        if (node.map) {
                            
                            if (this.debugDraw) {
                                this.ctx.beginPath();
                                this.ctx.arc(c[0]*this.sfactor+this.offsetX, c[2]*this.sfactor+this.offsetY, node.radius*this.sfactor, 0, 2 * Math.PI, false);
                                this.ctx.lineWidth = 1;
                                this.ctx.strokeStyle = '#ff0000';
                                this.ctx.stroke();
                            }
                            
                            this.applyFrustumVolume(node, shapeParams, planePack, layerPack);
                            
                        } else {
                            for (let j = 0; j < 8; j++) {
                                if (node.children[j]) {
                                    nodeBuffer2[nodeBufferIndex2] = node.children[j];
                                    nodeBufferIndex2++;
                                }
                            }
                        }
                    }
                } 
            }
            
            //swap node buffers
            let tmp = nodeBuffer;
            nodeBuffer = nodeBuffer2;
            nodeBuffer2 = tmp;
            nodeBufferIndex = nodeBufferIndex2;
            nodeBufferIndex2 = 0;
            
        } while(nodeBufferIndex);
        
    },

    applyFrustumVolume: function(node, shapeParams, planePack, layerPack) {
        let vertices = this.vertices;
        let classes = this.classes;
        let m = new THREE.Matrix4(); m.elements = shapeParams.m.slice(0,16);
        let pp = new THREE.Vector4();
        let layerIndex2 = (shapeParams.layer || 0);
        let layerIndex = shapeParams.removeMode ? 0 : layerIndex2;
        let rect = shapeParams.rect;
        let x1 = rect.x1, x2 = rect.x2, y1 = rect.y1, y2 = rect.y2;
        let onlyUnclassified = shapeParams.onlyUnclassified || false;
        let removeMode = shapeParams.removeMode || false;
        let map = node.map;

        for (let i = 0, li = map.length; i < li; i++) {
            
            let j = map[i];

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
            
            let jj = j * 3;
            let x = vertices[jj], y = vertices[jj+1], z = vertices[jj+2];

            if (planePack && !this.checkPlanes(x,y,z,planePack)) {
                continue;
            }

            pp.set(x,y,z, 1);
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

    hitPoly: function(poly, x, y) {
      let c = false;

      for (let i = 0, li = poly.length, j = li-2; i < li; i+=2) {
        if ( ((poly[i+1] > y) != (poly[j+1] > y)) &&
              (x < (poly[j]-poly[i]) * (y-poly[i+1]) / (poly[j+1]-poly[i+1]) + poly[i]) )
           c = !c;

           j = i;
      }

      return c;
    },

    circlePolyHit: function(x, y, r, poly, edges) {
        return this.hitPoly(poly, x, y)
            || edges.some((function(line) { return this.pointLineSegmentDistance(x, y, line) < r; }).bind(this));
    },

    polygonEdges: function(poly) {
        let edges = [];

        for (let i = 0, li = poly.length, j = li-2; i < li; i+=2) {
            let x1 = poly[j], y1 = poly[j+1], x2 = poly[i], y2 = poly[i+1];
            let dx = x2 - x1, dy = y2 - y1;
            edges.push([x1,y1,x2,y2, dx*dx + dy*dy]);
            j = i;
        }

        return edges;
    },

    pointLineSegmentDistance : function(x, y, line) {
        let dx, dy;

        if (line[4]) {
            let t = ((x - line[0]) * (line[2] - line[0]) + (y - line[1]) * (line[3] - line[1])) / line[4];

            if (t < 0) {
                dx = line[0] - x, dy = line[1] - y;
            } else if (t > 1) {
                dx = line[2] - x, dy = line[3] - y;
            } else {
                dx = (line[0] + t * (line[2] - line[0])) - x;
                dy = (line[1] + t * (line[3] - line[1])) - y;
            }
        } else {
            dx = line[0] - x, dy = line[1] - y;
        }

        return dx*dx + dy*dy;
    },

    tracePolyFrustumVolume: function(shapeParams, planePack, layerPack) {
        let nodeBuffer01 = [this.tree];
        let nodeBuffer02 = [];

        let nodeBuffer = nodeBuffer01;
        let nodeBuffer2 = nodeBuffer02;
        let nodeBufferIndex = 1;
        let nodeBufferIndex2 = 0;
        
        let m = new THREE.Matrix4(); m.elements = shapeParams.m.slice(0,16);
        let pp = new THREE.Vector4();

        if (shapeParams.m.length <= 16) {
            let res = this.getProjectionFactor(m);
            shapeParams.m.push(res[0], res[1]);
        }

        let pfactor = shapeParams.m[16]; //692.6470620003764;
        let rfactor = 2 / shapeParams.m[17];

        let poly = shapeParams.poly;
        let edges = this.polygonEdges(poly);
        
        do {
        
            for (let i = 0; i < nodeBufferIndex; i++) {
                
                let node = nodeBuffer[i];

                let c = node.center;

                //is node visible?
                pp.set(c[0], c[1], c[2], 1);
                pp.applyMatrix4(m);

                let ww = 1.0 / pp.w;
                pp.x *= ww;
                pp.y *= ww;
                
                let r = (node.radius * (pfactor / pp.z) * 2 * rfactor) * 1.01;
                
                if (this.circlePolyHit(pp.x, pp.y, r*r, poly, edges)) { //node visible

                    if (!(planePack && !this.checkSphereWithPlanes(c[0], c[1], c[2], node.radius*2.01, planePack))) {
                        if (node.map) {
                            
                            if (this.debugDraw) {
                                this.ctx.beginPath();
                                this.ctx.arc(c[0]*this.sfactor+this.offsetX, c[2]*this.sfactor+this.offsetY, node.radius*this.sfactor, 0, 2 * Math.PI, false);
                                this.ctx.lineWidth = 1;
                                this.ctx.strokeStyle = '#ff0000';
                                this.ctx.stroke();
                            }
                            
                            this.applyPolyFrustumVolume(node, shapeParams, planePack, layerPack);
                            
                        } else {
                            for (let j = 0; j < 8; j++) {
                                if (node.children[j]) {
                                    nodeBuffer2[nodeBufferIndex2] = node.children[j];
                                    nodeBufferIndex2++;
                                }
                            }
                        }
                    }
                } 
            }
            
            //swap node buffers
            let tmp = nodeBuffer;
            nodeBuffer = nodeBuffer2;
            nodeBuffer2 = tmp;
            nodeBufferIndex = nodeBufferIndex2;
            nodeBufferIndex2 = 0;
            
        } while(nodeBufferIndex);
        
    },

    applyPolyFrustumVolume: function(node, shapeParams, planePack, layerPack) {
        let vertices = this.vertices;
        let classes = this.classes;
        let m = new THREE.Matrix4(); m.elements = shapeParams.m.slice(0,16);
        let pp = new THREE.Vector4();
        let poly = shapeParams.poly;
        let layerIndex2 = (shapeParams.layer || 0);
        let layerIndex = shapeParams.removeMode ? 0 : layerIndex2;
        let onlyUnclassified = shapeParams.onlyUnclassified || false;
        let removeMode = shapeParams.removeMode || false;
        let map = node.map;

        for (let i = 0, li = map.length; i < li; i++) {

            let j = map[i];

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

            let jj = j * 3;
            let x = vertices[jj], y = vertices[jj+1], z = vertices[jj+2];

            if (planePack && !this.checkPlanes(x,y,z,planePack)) {
                continue;
            }

            pp.set(x,y,z, 1);
            pp.applyMatrix4(m);

            let w = 1.0 / pp.w;
            pp.x *= w;
            pp.y *= w;
            pp.z *= w;

            if (!(pp.z > 1 || pp.z < -1 || !this.hitPoly(poly, pp.x, pp.y))) {
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


