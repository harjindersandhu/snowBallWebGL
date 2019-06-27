# PARTICLE REPRODUCTION OF SNOWFALL - THREE.js & WebGL


### Aims
* Create a particle-system representation of SnowGlobe. 
* Use THREE.js as inteface to WebGL.
* Emphasize use of shaders and technologies studied. 
* Summary study on efficiency of application.

##### A well and examples fully documentation si available here: [Three.js](https://threejs.org)

### Performances
It’s not easy to evaluate performances of a system strongly based on hardware design and software optimization. It’s only possible make some considerations:
* Using a MacBook Pro Retina (2,4 GHz Intel Core i5, Intel Iris 1536 MB) and Safari as reference, were observed results below:
with 50K, 100K or 150K particles, the frame-rate is always 60.
The system has good performances as expected. 


### Introduction 
* A particle-system is a simple representation of a natural phenomena. 
* Our aim is to create a snowfall effect into a snowball.
* The snow will fall only in the ball and it will be cumulative.
* Each particle of snow has its weight, that will determinate the fall’s speed.
