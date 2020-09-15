
import * as THREE from './libs/three.module.js';
import { Loader } from './Loader.js';
import { Processor } from './Processor.js';

window.URL = window.URL || window.webkitURL;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
//window.Timer = new Timer();

Number.prototype.format = function () {
    return this.toString().replace( /(\d)(?=(\d{3})+(?!\d))/g, "$1," );
};

window.THREE = THREE; 

const Editor = function () {
    this.model = null;
    this.commands = [];
    this.commandsIndex = 0;
    this.planes = [];
};

Editor.prototype = {

    fromJSON: function ( json ) {

        if(!json) {
            return;
        }

        let version = json.version || 0;

        if (version == -1) {
            this.commands = [];
            this.commandsIndex = 0;
            this.planes = [];
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

        if (version <= 0.1) {
            //flip axis in commands
            for (let i = 0, li = this.commands.length; i < li; i++) {

                let type = this.commands[i]['type'];

                if (type == 'frustum' || type == 'poly-frustum') {
                    let m = this.commands[i]['m'];

                    let m2 = new THREE.Matrix4();
                    m2.fromArray(m);

                    let m3 = new THREE.Matrix4();
                    m3.fromArray([1,0,0,0,
                                  0,1,0,0,
                                  0,0,-1,0,
                                  0,0,0,1]);

                    m2.multiply(m3);

                    this.commands[i]['m'] = m2.toArray();
                }

            }

            //flip axis in planes
            for (let i = 0, li = this.planes.length; i < li; i++) {

                let plane = this.planes[i];
                plane[2] = -plane[2];
            }
        }
    },

    save: function( blob, filename ) {
    //return;
        let link = document.createElement( 'a' );
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.dispatchEvent( new MouseEvent( 'click' ) );
    },

    getParamsFromUrl: function(url) {
        let parser = document.createElement('a');
        parser['href'] = url;

        let queryString = {};
        let query = parser['search'].substring(1);
        let vars = query.split('&');
        
        if (!(vars.length == 1 && vars[0] == '')) {
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split('=');
                if (typeof queryString[pair[0]] === 'undefined') {
                    queryString[pair[0]] = pair[1];
                } else if (typeof queryString[pair[0]] === 'string') {
                    let arr = [ queryString[pair[0]], pair[1] ];
                    queryString[pair[0]] = arr;
                } else {
                    queryString[pair[0]].push(pair[1]);
                }
            }
        }
        
        return queryString;
    },

    onModelLoaded: function(geometry) {

        document.getElementById('status').innerHTML += 'PLY loaded<br>';

        console.log('loaded');
        
        let timer = performance.now(); 
        
        let processor = new Processor(geometry.attributes.position.array, new Uint8Array(Math.round(geometry.attributes.position.array.length / 3)));
        processor.commands = this.commands;
        processor.commandsIndex = this.commandsIndex;
        processor.planes = this.planes;
        
        let params = this.getParamsFromUrl(window.location.href);
        
        if('original' in params) processor.original = true;
        if('debug' in params){
            processor.debugDraw = true;
            document.getElementById('myCanvas').style.display = 'block';
        } 
        
        processor.applyCommands();

        let timer2 = performance.now(); 

        document.getElementById('status').innerHTML += 'Processing finished<br>';
        document.getElementById('status').innerHTML += 'Processing time: ' + (timer2 - timer).toFixed(0) + ' ms<br>';

        let filename = document.getElementById('jsonfile').files[0].name;

        let strings = filename.split('.');

        if (strings.length > 1) {
            filename = strings[0];
        }

        filename += '.bin';

        this.save( new Blob( [ processor.toBin() ], { type: 'application/octet-stream' } ), filename );

        document.getElementById('status').innerHTML += 'Done<br>';

    },


    convert: function () {

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
