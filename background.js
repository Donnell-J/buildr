import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';



export default function ThreeScene() {
  let renderer, scene, camera, light1, light2;
  let modelMeshes = []; // Array to hold model meshes from GLTF
  const cubes = []; // Array to hold falling cubes

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(new THREE.Color(0xFF0000), 0.0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    light1 = new THREE.PointLight(0xffffff,1);
    light1.position.set(50,50,50);
    scene.add(light1);
    light2 = new THREE.PointLight(0xffffff,0.5);
    light2.position.set(-50,-50,-50);
    scene.add(light2);


    // Load the GLTF model
    const models = [Asset.fromModule(require('./assets/models/tetra.gltf')),
                    Asset.fromModule(require('./assets/models/cross.gltf')),
                    Asset.fromModule(require('./assets/models/cube.gltf'))]
    for(let i =0; i<models.length; i++){
        await models[i].downloadAsync();
        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(models[i].uri);
        const toPush = gltf.scene.children[0].clone();
        if (i === 1){
            toPush.geometry.scale(0.5,0.5,0.5);
        }
        toPush.geometry.center();
        modelMeshes.push(toPush);
    }
    


    // Create falling cubes using loaded model geometry and material
    const material = new THREE.MeshPhongMaterial({color: new THREE.Color(0xff6a14)});
    for (let i = 0; i < 7; i++) {
      // Clone a random mesh from the modelMeshes array
      const modelMesh = modelMeshes[Math.floor(Math.random() * modelMeshes.length)].clone();
      //modelMesh.geometry.scale(0.5,0.5,0.5);
      // Create cube object
      const cube = new THREE.Mesh(modelMesh.geometry, material);
      cube.position.set(
        Math.random() * 30 - 15, // Random x position within the screen
        Math.random() * 20 - 10, // Start above the screen
        Math.random() * 2 - 5 // Random z position within the screen
      );

      scene.add(cube);
      cubes.push(cube);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      cubes.forEach((cube) => {
        cube.position.y -= 0.02; // Adjust falling speed

        // Rotate cube as it falls
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        // Reset position when cube reaches bottom
        if (cube.position.y < -15) {
          cube.position.set(
            Math.random() * 30 - 15, // Random x position within the screen
            15, // Start above the screen
            Math.random() * 2 - 5 // Random z position within the screen
          );

          // Randomly select a new mesh for the cube
          const newModelMesh = modelMeshes[Math.floor(Math.random() * modelMeshes.length)].clone();
          cube.geometry = newModelMesh.geometry;
          cube.material = material;

          // Reset rotation
          cube.rotation.set(0, 0, 0);
        }
      });

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <GLView
      style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}
      onContextCreate={onContextCreate}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});