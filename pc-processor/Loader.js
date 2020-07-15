/**
 * @author mrdoob / http://mrdoob.com/
 */
import {FileLoader} from "./libs/three.module.js";

const POINTS_MATERIAL = {
	size: 0.5, 
	flatShading: true, 
	vertexColor: THREE.VertexColors
}

import * as THREE from './libs/three.module.js';

import { FBXLoader } from './loaders/FBXLoader.js';
import { GLTFLoader } from './loaders/GLTFLoader.js';
import { MTLLoader } from './loaders/MTLLoader.js';
import { OBJLoader } from './loaders/OBJLoader.js';
import { PLYLoader } from './loaders/PLYLoader.js';


import { LoaderUtils } from './LoaderUtils.js';

import { JSZip } from './libs/jszip.module.min.js';

const Loader = function ( editor ) {

	const scope = this;

	this.editor = editor;
	this.texturePath = '';

	this.loadItemList = function ( items ) {

		LoaderUtils.getFilesFromItemList( items, function ( files, filesMap ) {

			scope.loadFiles( files, filesMap );

		} );

	};

	this.loadFiles = function ( files, filesMap ) {

		if ( files.length > 0 ) {

			var filesMap = filesMap || LoaderUtils.createFilesMap( files );

			var manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				var file = filesMap[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					return URL.createObjectURL( file );

				}

				return url;

			} );

			for ( var i = 0; i < files.length; i ++ ) {

				scope.loadFile( files[ i ], manager );

			}

		}

	};

	this.loadModel = function (file, ondone) {
		let manager = new THREE.LoadingManager();
		manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
			console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
		};

		manager.onLoad = function ( ) {
			console.log( 'Loading complete!');

			if (ondone) {
				ondone();
			}
		};

		manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
			console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
		};

		manager.onError = function ( url ) {
			console.log( 'There was an error loading ' + url );
		};

		this.loadFile( file, manager );

		/*

		let loader = new PLYLoader(manager)
		loader.load(background_url, function (geometry) {

			geometry.sourceType = "ply";
			geometry.sourceFile = background_url;
			geometry.computeBoundingBox();

			//editor.applyCommands();
		})
		*/

	}

	this.loadFile = function ( file, manager ) {

		let filename = file.name;
		let extension = filename.split( '.' ).pop().toLowerCase();


		let reader = new FileReader()
		reader.addEventListener( 'progress', function ( event ) {

			let size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			let progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';

			console.log( 'Loading', filename, size, progress );

		} );

		switch ( extension ) {
			case 'js':
			case 'json':
			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== - 1 ) {

						var blob = new Blob( [ contents ], { type: 'text/javascript' } );
						var url = URL.createObjectURL( blob );

						var worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					var data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data );

				}, false );
				reader.readAsText( file );

				break;
			case 'obj':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var object = new OBJLoader().parse( contents );
					object.name = filename;

					//editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'ply':

				reader.addEventListener( 'load', (function ( event ) {

					var contents = event.target.result;

					var geometry = new PLYLoader().parse( contents );

					geometry.sourceType = "ply";
					geometry.sourceFile = file.name;
					//geometry.computeVertexNormals();

					this.editor.onModelLoaded(geometry);



				}).bind(this), false );
				reader.readAsArrayBuffer( file );

				break;

			case 'zip':

				reader.addEventListener( 'load', function ( event ) {

					handleZIP( event.target.result );

				}, false );
				reader.readAsBinaryString( file );

				break;

			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	};

	function handleJSON( data ) {


		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.formatVersion !== undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		switch ( data.metadata.type.toLowerCase() ) {

			case 'buffergeometry':

				var loader = new THREE.BufferGeometryLoader();
				var result = loader.parse( data );

				var mesh = new THREE.Mesh( result );

				//editor.execute( new AddObjectCommand( editor, mesh ) );

				break;

			case 'geometry':

				console.error( 'Loader: "Geometry" is no longer supported.' );

				break;

			case 'object':

				var loader = new THREE.ObjectLoader();
				loader.setResourcePath( scope.texturePath );

				loader.parse( data, function ( result ) {

					if ( result.isScene ) {

						//editor.execute( new SetSceneCommand( editor, result ) );

					} else {

						//editor.execute( new AddObjectCommand( editor, result ) );

					}

				} );

				break;

			case 'app':

				editor.fromJSON( data );

				break;

		}

	}

	function handleZIP( contents ) {

		var zip = new JSZip( contents );

		// Poly

		if ( zip.files[ 'model.obj' ] && zip.files[ 'materials.mtl' ] ) {

			var materials = new MTLLoader().parse( zip.file( 'materials.mtl' ).asText() );
			var object = new OBJLoader().setMaterials( materials ).parse( zip.file( 'model.obj' ).asText() );
			editor.execute( new AddObjectCommand( editor, object ) );

		}

		//

		zip.filter( function ( path, file ) {

			var manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				var file = zip.files[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					var blob = new Blob( [ file.asArrayBuffer() ], { type: 'application/octet-stream' } );
					return URL.createObjectURL( blob );

				}

				return url;

			} );

			var extension = file.name.split( '.' ).pop().toLowerCase();

			switch ( extension ) {

				case 'fbx':

					var loader = new FBXLoader( manager );
					var object = loader.parse( file.asArrayBuffer() );

					//editor.execute( new AddObjectCommand( editor, object ) );

					break;

				case 'glb':

					var loader = new GLTFLoader();
					loader.parse( file.asArrayBuffer(), '', function ( result ) {

						var scene = result.scene;

						editor.addAnimation( scene, result.animations );
						//editor.execute( new AddObjectCommand( editor, scene ) );

					} );

					break;

				case 'gltf':

					var loader = new GLTFLoader( manager );
					loader.parse( file.asText(), '', function ( result ) {

						var scene = result.scene;

						editor.addAnimation( scene, result.animations );
						//editor.execute( new AddObjectCommand( editor, scene ) );

					} );

					break;

			}

		} );

	}

	function isGLTF1( contents ) {

		var resultContent;

		if ( typeof contents === 'string' ) {

			// contents is a JSON string
			resultContent = contents;

		} else {

			var magic = THREE.LoaderUtils.decodeText( new Uint8Array( contents, 0, 4 ) );

			if ( magic === 'glTF' ) {

				// contents is a .glb file; extract the version
				var version = new DataView( contents ).getUint32( 4, true );

				return version < 2;

			} else {

				// contents is a .gltf file
				resultContent = THREE.LoaderUtils.decodeText( new Uint8Array( contents ) );

			}

		}

		var json = JSON.parse( resultContent );

		return ( json.asset != undefined && json.asset.version[ 0 ] < 2 );

	}

};

export { Loader };
