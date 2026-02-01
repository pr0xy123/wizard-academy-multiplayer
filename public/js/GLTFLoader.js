// GLTFLoader for Three.js r128
// Simplified version for loading GLTF models
// Source: https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

THREE.GLTFLoader = ( function () {

	function GLTFLoader( manager ) {

		this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	}

	GLTFLoader.prototype = {

		constructor: GLTFLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var loader = new THREE.FileLoader( scope.manager );

			loader.setPath( scope.path );
			loader.setResponseType( 'arraybuffer' );

			loader.load( url, function ( data ) {

				try {

					scope.parse( data, onLoad, onError );

				} catch ( e ) {

					if ( onError ) {

						onError( e );

					} else {

						console.error( e );

					}

				}

			}, onProgress, onError );

		},

		setPath: function ( value ) {

			this.path = value;
			return this;

		},

		parse: function ( data, onLoad, onError ) {

			var content;
			var extensions = {};

			if ( typeof data === 'string' ) {

				content = data;

			} else {

				var magic = THREE.LoaderUtils.decodeText( new Uint8Array( data, 0, 4 ) );

				if ( magic === 'glTF' ) {

					extensions[ 'KHR_binary_glTF' ] = new GLTFBinaryExtension( data );
					content = extensions[ 'KHR_binary_glTF' ].content;

				} else {

					content = THREE.LoaderUtils.decodeText( new Uint8Array( data ) );

				}

			}

			var json = JSON.parse( content );

			if ( json.asset === undefined || json.asset.version[ 0 ] < 2 ) {

				if ( onError ) onError( new Error( 'THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.' ) );
				return;

			}

			var parser = new GLTFParser( json, extensions, {

				path: this.path || '',
				manager: this.manager

			} );

			parser.parse( function ( scene, scenes, cameras, animations, asset ) {

				var glTF = {
					scene: scene,
					scenes: scenes,
					cameras: cameras,
					animations: animations,
					asset: asset
				};

				onLoad( glTF );

			}, onError );

		}

	};

	function GLTFParser( json, extensions, options ) {

		this.json = json || {};
		this.extensions = extensions || {};
		this.options = options || {};

		this.cache = new GLTFRegistry();

	}

	GLTFParser.prototype.parse = function ( onLoad, onError ) {

		var json = this.json;

		this.cache.removeAll();

		this.loadScenes( function ( scenes ) {

			var scene = scenes[ json.scene || 0 ];

			var cameras = [];
			var animations = [];

			onLoad( scene, scenes, cameras, animations, json.asset );

		} );

	};

	GLTFParser.prototype.loadScenes = function ( onLoad ) {

		var json = this.json;
		var extensions = this.extensions;
		var scenes = [];

		for ( var i = 0, il = ( json.scenes || [] ).length; i < il; i ++ ) {

			var scene = new THREE.Scene();
			if ( json.scenes[ i ].name !== undefined ) scene.name = json.scenes[ i ].name;

			var dependencies = [];

			var nodeIds = json.scenes[ i ].nodes || [];

			for ( var j = 0, jl = nodeIds.length; j < jl; j ++ ) {

				dependencies.push( this.loadNode( nodeIds[ j ] ) );

			}

			Promise.all( dependencies ).then( function ( nodes ) {

				for ( var k = 0, kl = nodes.length; k < kl; k ++ ) {

					scene.add( nodes[ k ] );

				}

			} );

			scenes.push( scene );

		}

		onLoad( scenes );

	};

	GLTFParser.prototype.loadNode = function ( nodeId ) {

		var json = this.json;
		var parser = this;

		var nodeDef = json.nodes[ nodeId ];

		return new Promise( function ( resolve ) {

			var node = new THREE.Object3D();

			if ( nodeDef.name !== undefined ) {

				node.name = nodeDef.name;

			}

			if ( nodeDef.matrix !== undefined ) {

				var matrix = new THREE.Matrix4();
				matrix.fromArray( nodeDef.matrix );
				node.applyMatrix4( matrix );

			} else {

				if ( nodeDef.translation !== undefined ) {

					node.position.fromArray( nodeDef.translation );

				}

				if ( nodeDef.rotation !== undefined ) {

					node.quaternion.fromArray( nodeDef.rotation );

				}

				if ( nodeDef.scale !== undefined ) {

					node.scale.fromArray( nodeDef.scale );

				}

			}

			if ( nodeDef.mesh !== undefined ) {

				parser.loadMesh( nodeDef.mesh ).then( function ( mesh ) {

					node.add( mesh );

				} );

			}

			if ( nodeDef.children ) {

				var children = nodeDef.children;

				var pending = [];

				for ( var i = 0, l = children.length; i < l; i ++ ) {

					pending.push( parser.loadNode( children[ i ] ) );

				}

				Promise.all( pending ).then( function ( nodes ) {

					for ( var j = 0, jl = nodes.length; j < jl; j ++ ) {

						node.add( nodes[ j ] );

					}

				} );

			}

			resolve( node );

		} );

	};

	GLTFParser.prototype.loadMesh = function ( meshId ) {

		var json = this.json;
		var meshDef = json.meshes[ meshId ];

		var group = new THREE.Group();
		group.name = meshDef.name || 'mesh_' + meshId;

		var primitives = meshDef.primitives || [];

		for ( var i = 0, il = primitives.length; i < il; i ++ ) {

			var primitive = primitives[ i ];
			var geometry = new THREE.BufferGeometry();
			var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );

			var mesh = new THREE.Mesh( geometry, material );
			group.add( mesh );

		}

		return Promise.resolve( group );

	};

	function GLTFRegistry() {

		var objects = {};

		return {

			get: function ( key ) {

				return objects[ key ];

			},

			add: function ( key, object ) {

				objects[ key ] = object;

			},

			remove: function ( key ) {

				delete objects[ key ];

			},

			removeAll: function () {

				objects = {};

			}

		};

	}

	function GLTFBinaryExtension( data ) {

		this.name = 'KHR_binary_glTF';
		this.content = null;

	}

	return GLTFLoader;

} )();

},{}]},{},[1]);
