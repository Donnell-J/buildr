import React, { useEffect, useRef, useState } from 'react';
import { Platform , Dimensions} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, THREE } from 'expo-three';

const ModelViewer = ({ pcdData }) => {
  let gl;
  let renderer;
  const scene = useRef();
  const camera = useRef();
  const pcd = useRef();
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(null);
  const [lastMouseY, setLastMouseY] = useState(null);
  const [mouseButton, setMouseButton] = useState(null);
  const [canvasBounds, setCanvasBounds] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
  const isMobileWeb = Platform.OS === 'web' && Dimensions.get('window').width <= 768;

  useEffect(() => {
    if (gl && renderer) {
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  }, [gl, renderer]);
  
 

  useEffect(() => {
    const handleResize = () => {
      const canvas = gl.canvas;
      const rect = canvas.getBoundingClientRect();
      setCanvasBounds({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom
      });

      // Adjust camera aspect ratio based on viewport size
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [gl]);

  useEffect(() => {
    const handleMouseDown = (event) => {
      setIsMouseDown(true);
      setLastMouseX(event.clientX);
      setLastMouseY(event.clientY);
      setMouseButton(event.button);
    };

    const handleMouseMove = (event) => {
      if (!isMouseDown) return;
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const deltaX = mouseX - lastMouseX;
      const deltaY = mouseY - lastMouseY;

      // Check if mouse is within canvas bounds
      if (
        mouseX < canvasBounds.left ||
        mouseX > canvasBounds.right ||
        mouseY < canvasBounds.top ||
        mouseY > canvasBounds.bottom
      ) {
        setIsMouseDown(false);
        return;
      }

      // Pan the mesh based on right-click and drag
      if (mouseButton === 2) {
        const panSpeed = 0.1; // Adjust as needed
        pcd.current.position.x += deltaX * panSpeed;
        pcd.current.position.y -= deltaY * panSpeed; // Invert Y-axis for intuitive panning
      }
      // Orbit the mesh based on left-click and drag
      else if (mouseButton === 0) {
        const orbitSpeed = 0.01; // Adjust as needed
        pcd.current.rotation.y += deltaX * orbitSpeed;
        pcd.current.rotation.x += deltaY * orbitSpeed;
      }

      setLastMouseX(mouseX);
      setLastMouseY(mouseY);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleWheel = (event) => {
      const delta = event.deltaY;
      const dollySpeed = 0.1; // Adjust as needed
      camera.current.position.z += delta * dollySpeed;
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isMouseDown, lastMouseX, lastMouseY, mouseButton, canvasBounds]);

  const onContextCreate = async (context) => {
    gl = context;
    renderer = new Renderer({ gl, cullFace: THREE.CullFaceNone });
    renderer.setClearColor(0xffffff);

    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;

    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(30, width / height, 0.001, 30000);
    camera.current.position.z = 150;

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ vertexColors: true });

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pcdData.points), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pcdData.colors), 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(pcdData.point_normals), 3));
    geometry.scale(100000, 100000, 100000);
    geometry.center();
    pcd.current = new THREE.Points(geometry, material);
    scene.current.add(pcd.current);

    const animate = () => {
      requestAnimationFrame(animate);
      if(isMobileWeb){
        pcd.current.rotation.y += 0.01;
      }
      renderer.render(scene.current, camera.current);
      gl.endFrameEXP();
    };

    animate();

    const canvas = gl.canvas;
    canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  };

  return (
    <GLView style={{ flex: 1}} onContextCreate={onContextCreate} />
  );
};

export default ModelViewer;