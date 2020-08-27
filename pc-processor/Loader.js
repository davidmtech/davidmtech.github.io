
import {
    FileLoader
} from "./libs/three.module.js";

import * as THREE from './libs/three.module.js';

import { PLYLoader } from './loaders/PLYLoader.js';

const Loader = function ( editor ) {

    const scope = this;
    
    this.editor = editor;

    this.loadModel = function (file) {

        let reader = new FileReader()

        reader.addEventListener( 'load', (function ( event ) {

            var contents = event.target.result;
            var geometry = new PLYLoader().parse( contents );
            this.editor.onModelLoaded(geometry);

        }).bind(this), false );

        reader.readAsArrayBuffer( file );
    }

};

export { Loader };
