
var container, scene, camera, controls;

			// SCENE
		    scene = new THREE.Scene();
		    scene.background = new THREE.Color( 0x262626);
		    
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

			// CONTROLS
		    controls = new THREE.OrbitControls( camera, renderer.domElement );
		    controls.minDistance = 30;
		    controls.maxDistance = 600;
		    controls.minHeight = 0;
		    controls.maxPolarAngle = Math.PI/2;
		    controls.center = lookingPosition;

			
		    // LIGHT
		    var light = new THREE.PointLight(0xffffff);
		    light.position.set(0, 555 ,0);
		    scene.add(light);
		    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    		scene.add(ambientLight);

    		//SPHERE
			//Raggio, meridiani, paralleli, ?, sezione verticale sfera, thetaStart taglia la sfera orizontalmente positivo da sopra negativo da sotto
			var geometry = new THREE.SphereBufferGeometry(50, 0, 0, 0, 2*Math.PI, -0.8, 1 * Math.PI);
			var material = new THREE.MeshBasicMaterial( {color: 0x87CEF4,transparent:true, opacity:0.1, wireframe: false} );
			material.side = THREE.DoubleSide;
			
			var sphere = new THREE.Mesh(geometry, material);
			scene.add(sphere);
			
			//CYLINDER GEOMETRY
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
			var skater_obj = null;


			//SECOND CYLINDER
			var geometry = new THREE.CylinderBufferGeometry(37, 35, 2, 100);
			var snow_cylinderMaterials = 
			[
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/snow.jpg'), side : THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/snow.jpg'), side : THREE.DoubleSide}),
			new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('img/snow.jpg'), side : THREE.DoubleSide}),
			];
			var material = new THREE.MeshFaceMaterial(snow_cylinderMaterials);
			var cylinder_2 = new THREE.Mesh(geometry, material);

			// scene.add(cylinder_2);
			// cylinder_2.position.y = -34;





			//SNOW GEOMETRY
			var n = 10000; // Numero particelle


			var init_pos = new Float32Array(n);
			var init_pos_z = new Float32Array(n);
			var init_pos_x = new Float32Array(n);
			var acceleration = new Float32Array(n);
			//var count = new Int8Array();

			for(i = 0; i < n; i++){
			    init_pos[i] = 100 + (Math.random()-0.5)*20;
			    init_pos_x[i] = (Math.random()-0.5)*100;
			    init_pos_z[i] = (Math.random()-0.5)*80;
			    acceleration[i] = Math.random()*1;
			} 
			//count = 0;
			var snowGeometry = new THREE.BufferGeometry();
				// Il buffer viene letto tre a tre(x,y,z)
				snowGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(n*3), 3));
				snowGeometry.addAttribute('initial_position', new THREE.BufferAttribute(init_pos, 1));
				snowGeometry.addAttribute('initial_position_x', new THREE.BufferAttribute(init_pos_x, 1));
				snowGeometry.addAttribute('initial_position_z', new THREE.BufferAttribute(init_pos_z, 1));
				snowGeometry.addAttribute('acceleration', new THREE.BufferAttribute(acceleration, 1));
				//snowGeometry.addAttribute('count_snow', new THREE.BufferAttribute(count);

			var snowMaterial= new THREE.ShaderMaterial({
			    uniforms: snowUniforms = {
			        time: {value: 10.0},
			        counter: {value: 0.0}
			        // stretch: {value: new THREE.Vector3(190, 30, 135)},
			        // shadowType: {value: 1.0}
			    },
			    vertexShader: document.getElementById('vertexShaderSNOW').textContent,
			    fragmentShader: document.getElementById('fragmentShaderSNOW').textContent,
			})


			var snow = new THREE.Points(snowGeometry, snowMaterial);
			scene.add(snow);

			//MODELS
			// Add Tree Object
		    console.log("Inserting obj")
		    var manager = new THREE.LoadingManager();
		    manager.onProgress = function ( item, loaded, total ) {
		        console.log( item, loaded, total );
		    };
		    var mtlLoader = new THREE.MTLLoader(manager);
		    mtlLoader.setPath( 'obj/' );
		    mtlLoader.load( 'pine_tree.mtl', function( materials ) {
		        materials.preload();
		        var objLoader = new THREE.OBJLoader(manager);
		        objLoader.setMaterials( materials );
		        objLoader.setPath( 'obj/' );
		        objLoader.load( 'pine_tree.obj', function ( object ) {
		            object.position.y = -32;
		            object.position.x = 0;
		            object.position.z = 0;
		            object.scale.x = 10;
		            object.scale.y = 10;
		            object.scale.z = 10;
		            scene.add( object );
		            tree_obj = object;
		        }, function(){}, function(){} );
		    });

		    
			
		 	var update = function(){
				//t += 0.01;
				snowUniforms.time.value += 0.9;
				console.log( snowUniforms.counter.value )
				//cylinder.rotation.y += 0.01;
				//sphere.rotation.y += 0.01;
	

    			
			};
			
			//Draw scene
			var render = function(){

				controls.update();
				renderer.render(scene, camera);

			};

			//Run game loop (update, render, repeat)
			var GameLoop = function(){

				requestAnimationFrame(GameLoop);
				update();
				render();

			};

			
			GameLoop();