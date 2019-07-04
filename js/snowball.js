			var container, scene, camera, controls;
			var n = 50000; // Numero particelle di neve


			// SCENE
		    scene = new THREE.Scene();
		    scene.background = new THREE.Color(0x989898);
		    
		    // CAMERA
		    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
		    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	        camera.position.set(0, 0, 600);
	        var lookingPosition = new THREE.Vector3(scene.position.x, scene.position.y + 100, scene.position.z);
	        scene.add(camera);

		    
		    // RENDERER
		    let renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true} );
		    renderer.render(scene, camera);
		    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		    container = document.getElementById('WebGL');
		    container.appendChild( renderer.domElement );
			var lookingPosition = new THREE.Vector3(scene.position.x, scene.position.y + 100, scene.position.z);
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

			// CONTROLS
		    controls = new THREE.OrbitControls( camera, renderer.domElement );
		    controls.minDistance = 10;
		    controls.maxDistance = 340;
		    controls.minHeight = 0;
		    controls.maxPolarAngle = Math.PI/2;
		    controls.center = lookingPosition;
		    controls.enableRotate = true;
		    controls.minPolarAngle = 0;
		    controls.maxPolarAngle = Math.PI;


		    // STATS
		    stats = new Stats();
		    stats.domElement.style.position = 'absolute';
		    stats.domElement.style.bottom = '0px';
		    stats.domElement.style.zIndex = 100;
		    container.appendChild( stats.domElement );
    

		    
			//LIGHTS
			var ambientLight = new THREE.AmbientLight(0xffffff, 1);
			scene.add(ambientLight);

			var light = new THREE.PointLight(0xffffff, 2.0, 600);
			scene.add(light);

			var spotLight = new THREE.SpotLight(0xffff00, 2.0, 100000);
			spotLight.position.set( -18, 0, 0 );
			spotLight.angle = Math.PI / 4;
			spotLight.penumbra = 0.05;
			spotLight.decay = 1;
			spotLight.distance = 200;
			spotLight.castShadow = true;
			spotLight.shadow.mapSize.width = 1024;
			spotLight.shadow.mapSize.height = 1024;
			spotLight.shadow.camera.near = 10;
			spotLight.shadow.camera.far = 200;
			scene.add(spotLight);


    		//SPHERE
			//(raggio, meridiani, widthSegments, heightSegments, sezione verticale sfera, thetaStart taglia la sfera orizontalmente positivo da sopra negativo da sotto)
			var geometry = new THREE.SphereBufferGeometry(50, 50, 50, 0, 2*Math.PI, -0.8, 1 * Math.PI);
			var material = new THREE.MeshBasicMaterial( {color: 0xd4e1ec,transparent:true, opacity:0.15, wireframe: false} );
			material.side = THREE.DoubleSide;
			var sphere = new THREE.Mesh(geometry, material);
			sphere.castShadow = true; //default is false
			sphere.receiveShadow = false; //default
			scene.add(sphere);
			
			//CYLINDER GEOMETRY
			//(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float))
			var geometry = new THREE.CylinderBufferGeometry(35, 45, 25, 100);
			var cylinderMaterials = 
			[
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/wood.jpg'), side : THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/grass.jpg'), side : THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/wood.jpg'), side : THREE.DoubleSide}),
			];
			
			var material = new THREE.MeshFaceMaterial(cylinderMaterials);
			var cylinder = new THREE.Mesh(geometry, material);
			
			scene.add(cylinder);
			cylinder.position.y = -47;
			var tree_obj = null;



			//SNOW GEOMETRY
			var init_pos_y = new Float32Array(n);
			var init_pos_z = new Float32Array(n);
			var init_pos_x = new Float32Array(n);
			var acceleration = new Float32Array(n);
			var min_level = new Float32Array(n);

			
			for(i=0; i<n; i++){
			var ptAngle = Math.random() * 2 * Math.PI;
			var ptRadiusSq= Math.random() * 1250.0;

			init_pos_x[i] = Math.sqrt(ptRadiusSq) * Math.cos(ptAngle);
			init_pos_y[i] = 60 + (Math.random()-0.5)*30;
			init_pos_z[i] = Math.sqrt(ptRadiusSq) * Math.sin(ptAngle);
			acceleration[i] = Math.random()*1;

			    // Snow stops at house's top
			    if( init_pos_x[i] > 7 && init_pos_z[i] > -12&&
			    	init_pos_x[i] < 28 && init_pos_z[i] < 12){
			    	min_level[i] = (-32.5 + 51.5 - Math.abs(init_pos_x[i]-17.5)*1.2) - Math.random()*2;	
			    }

			    // Snow stops at tree's top
			     if((init_pos_x[i] + 9.7)**2 + (init_pos_z[i] - 0.5)**2 < 83){
			     	base = init_pos_x[i] + 9.7;
			     	altezza = init_pos_z[i]- 0.5;
			     	console.log(init_pos_z[i]);
			    	min_level[i] = (34.5-4*(Math.sqrt(base**2 + altezza**2))**1) + Math.random()*2;	
			    }
			} 
			
			var snowGeometry = new THREE.BufferGeometry();
				snowGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(n*3), 3));
				snowGeometry.addAttribute('initial_position_x', new THREE.BufferAttribute(init_pos_x, 1));
				snowGeometry.addAttribute('initial_position_y', new THREE.BufferAttribute(init_pos_y, 1));
				snowGeometry.addAttribute('initial_position_z', new THREE.BufferAttribute(init_pos_z, 1));
				snowGeometry.addAttribute('acceleration', new THREE.BufferAttribute(acceleration, 1));
				snowGeometry.addAttribute('min_level', new THREE.BufferAttribute(min_level, 1));
				

			var snowColorOutside = new Float32Array(3);
    		snowColorOutside[0] = 0;
    		snowColorOutside[1] = 0;
    		snowColorOutside[2] = 0;
    		// Color of the snow inside the sphere
    		var traspColorInside = new Float32Array(3);
	        traspColorInside[0] = 1;
    		traspColorInside[1] = 1;
    		traspColorInside[2] = 1;
			var snowMaterial= new THREE.ShaderMaterial({
			    uniforms: snowUniforms = {
			        time: {value: 10.0},
			        counter: {value: 0.0},
			       	customColor: {value: snowColorOutside},
			        customColor2: {value: traspColorInside},
			        customOpacity: {value: 1.0},
			    },
			    vertexShader: document.getElementById('vertexShaderSNOW').textContent,
			    fragmentShader: document.getElementById('fragmentShaderSNOW').textContent,
			})
			var snow = new THREE.Points(snowGeometry, snowMaterial);
			scene.add(snow);

			// MODELS

			// TREE
		    //console.log("Inserting obj")
		    var manager = new THREE.LoadingManager();
		    manager.onProgress = function (item, loaded, total) {
		        console.log( item, loaded, total );
		    };
		    var mtlLoader = new THREE.MTLLoader(manager);
		    mtlLoader.setPath( 'obj/' );
		    mtlLoader.load('pine_tree.mtl', function(materials) {
		        materials.preload();
		        var objLoader = new THREE.OBJLoader(manager);
		        objLoader.setMaterials(materials);
		        objLoader.setPath('obj/');
		        objLoader.load( 'pine_tree.obj', function (object) {
		            object.position.y = -32;
		            object.position.x = -10;
		            object.position.z = 0;
		            object.scale.x = 10;
		            object.scale.y = 10;
		            object.scale.z = 10;
		            scene.add(object);
		            tree_obj = object;
		        }, function(){}, function(){});
		    });

		    

		    // HOUSE
		    //console.log("Inserting house obj")
		    var manager = new THREE.LoadingManager(); 
		    manager.onProgress = function (item, loaded, total) {
		        console.log(item, loaded, total);
		    };
       		var PNGFile = 'obj/house.png';
		    var mtlLoader = new THREE.MTLLoader(manager);
		    mtlLoader.setPath('obj/');
		    mtlLoader.load('house.mtl', function(materials) {
		        materials.preload();
		        var objLoader = new THREE.OBJLoader(manager);
		        objLoader.setMaterials(materials);
		        objLoader.setPath('obj/');
		        objLoader.load( 'house.obj', function (object) {

		        var texture = new THREE.TextureLoader().load(PNGFile);
            	object.traverse(function (child) {   // aka setTexture
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                }
            	});
              		object.name = "object";
		            object.position.y = -35;
		            object.position.x = 17;
		            object.position.z = 0;
		            object.scale.x = 3;
		            object.scale.y = 3;
		            object.scale.z = 3;
		            scene.add(object);		            
		        }, function(){}, function(){});
		    });

		    //GUI
		    var guiControls = new function(){
		    	this.speed = 0.2;
		    	this.sound = 0.5;
		    	this.lightAngle = spotLight.angle;	
		    }
		    var datGUI = new dat.GUI();
		    datGUI.add(guiControls, 'speed', 0.01, 1);
		    datGUI.add(guiControls, 'sound', 0.0, 1);
		    datGUI.add(guiControls, 'lightAngle', 0, Math.PI / 2 );
		    

		    
		    //AUDIO
		    //Create an AudioListener and add it to the camera 
		    var listener = new THREE.AudioListener(); 
		    camera.add(listener); 
		    // create a global audio source 
		    var sound = new THREE.Audio( listener ); 
		    var audioLoader = new THREE.AudioLoader();
		    //Load a sound and set it as the Audio object's buffer 
		    audioLoader.load( 'audio/jingle.mp3', function( buffer ) { 
		        sound.setBuffer( buffer ); 
		        sound.setLoop(true); 
		        sound.setVolume(0.5); 
		        sound.play(); 
		    });


		 	var update = function(){
				
				snowUniforms.time.value += guiControls.speed;
				sound.setVolume(guiControls.sound);
				spotLight.angle = guiControls.lightAngle;
				console.log(snowUniforms.counter.value)

			};
			
			
			//Draw scene
			var render = function(){
			
				controls.update();
				renderer.render(scene, camera);
				stats.update(); // update stats

			};

			//Run game loop (update, render, repeat)
			var gameLoop = function(){

				requestAnimationFrame(gameLoop);
				update();
				render();
			};

			
			gameLoop();
