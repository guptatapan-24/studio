"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Level } from '@/lib/levels';

type GolfCanvasProps = {
  level: Level;
  onStroke: () => void;
  onHoleComplete: () => void;
  setPower: (power: number) => void;
  isGamePaused?: boolean;
};

const GolfCanvas: React.FC<GolfCanvasProps> = ({ level, onStroke, onHoleComplete, setPower, isGamePaused = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Using refs for values that change frequently in the animation loop
  // to avoid re-renders and stale state in callbacks.
  const state = useRef({
    isBallMoving: false,
    isCharging: false,
    aimDirection: new THREE.Vector3(0, 0, -1),
    ballVelocity: new THREE.Vector3(),
    ballMesh: null as THREE.Mesh | null,
    holeMesh: null as THREE.Mesh | null,
    isHoleCompleted: false,
  }).current;

  // Memoize callbacks to prevent re-creating functions on every render
  const memoizedOnStroke = useCallback(onStroke, [onStroke]);
  const memoizedOnHoleComplete = useCallback(() => {
    if (!state.isHoleCompleted) {
        state.isHoleCompleted = true;
        onHoleComplete();
    }
  }, [onHoleComplete, state]);

  useEffect(() => {
    if (!mountRef.current) return;
    
    const currentMount = mountRef.current;
    state.isHoleCompleted = false; // Reset on level change

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); 
    scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(level.startPosition[0], 5, level.startPosition[2] + 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera from going under ground
    controls.target.set(level.startPosition[0], level.startPosition[1], level.startPosition[2]);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // --- Game Objects ---
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x55aa55, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const ballGeo = new THREE.SphereGeometry(0.15, 32, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
    state.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    state.ballMesh.castShadow = true;
    state.ballMesh.position.fromArray(level.startPosition);
    scene.add(state.ballMesh);

    const holeGeo = new THREE.CircleGeometry(level.holeRadius, 32);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    state.holeMesh = new THREE.Mesh(holeGeo, holeMat);
    state.holeMesh.position.fromArray(level.holePosition);
    state.holeMesh.rotation.x = -Math.PI / 2;
    scene.add(state.holeMesh);

    const obstacles: THREE.Mesh[] = [];
    level.obstacles.forEach(obs => {
      const obsGeo = new THREE.BoxGeometry(...obs.size);
      const obsMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
      const obstacle = new THREE.Mesh(obsGeo, obsMat);
      obstacle.position.fromArray(obs.position);
      if(obs.rotation) obstacle.rotation.fromArray(obs.rotation as [number, number, number]);
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      scene.add(obstacle);
      obstacles.push(obstacle);
    });
    
    // --- Aiming indicator ---
    const aimLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const aimLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const aimLine = new THREE.Line(aimLineGeo, aimLineMat);
    scene.add(aimLine);

    // --- Event Handlers ---
    const onKeyDown = (event: KeyboardEvent) => {
        if (isGamePaused || state.isBallMoving || state.isHoleCompleted) return;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                state.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 45);
                break;
            case 'ArrowRight':
                event.preventDefault();
                state.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 45);
                break;
            case ' ': // Spacebar
                event.preventDefault();
                if (!state.isCharging) {
                    state.isCharging = true;
                    setPower(0);
                }
                break;
        }
    }

    const onKeyUp = (event: KeyboardEvent) => {
        if (isGamePaused || state.isHoleCompleted) return;
        
        if (event.key === ' ' && state.isCharging && state.ballMesh) {
            event.preventDefault();
            
            const power = parseFloat(renderer.domElement.style.getPropertyValue('--power-charge') || '0');
            
            if (power < 5) { // Ignore tiny taps
                state.isCharging = false;
                setPower(0);
                renderer.domElement.style.setProperty('--power-charge', '0');
                return;
            }

            state.ballVelocity.copy(state.aimDirection).multiplyScalar(power * 0.05);
            state.isBallMoving = true;
            memoizedOnStroke();

            // Reset charge state
            state.isCharging = false;
            setPower(0);
            renderer.domElement.style.setProperty('--power-charge', '0');
        }
    }

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', handleResize);
    
    // --- Animation Loop ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const chargeSpeed = 0.5; // Controls how fast power bar fills up
      if (state.isCharging) {
          const currentPower = parseFloat(renderer.domElement.style.getPropertyValue('--power-charge') || '0');
          const newPower = Math.min(currentPower + chargeSpeed, 100);
          renderer.domElement.style.setProperty('--power-charge', newPower.toString());
          setPower(newPower);
      }

      // Update aim indicator
      if (state.ballMesh && aimLine) {
        aimLine.visible = !state.isBallMoving && !state.isHoleCompleted && !isGamePaused;
        if(aimLine.visible) {
            aimLine.geometry.setFromPoints([state.ballMesh.position, state.ballMesh.position.clone().add(state.aimDirection.clone().multiplyScalar(3))]);
        }
      }
      
      if (state.isBallMoving && state.ballMesh) {
        state.ballMesh.position.add(state.ballVelocity);
        state.ballVelocity.multiplyScalar(0.985); // friction

        const ballBox = new THREE.Box3().setFromObject(state.ballMesh);
        obstacles.forEach(obstacle => {
            const obstacleBox = new THREE.Box3().setFromObject(obstacle);
            if (ballBox.intersectsBox(obstacleBox)) {
                const ballCenter = new THREE.Vector3();
                ballBox.getCenter(ballCenter);
                const obstacleCenter = new THREE.Vector3();
                obstacleBox.getCenter(obstacleCenter);
                
                const normal = ballCenter.sub(obstacleCenter).normalize();
                state.ballVelocity.reflect(normal);
            }
        });

        if (state.ballVelocity.lengthSq() < 0.0001) {
            state.ballVelocity.set(0, 0, 0);
            state.isBallMoving = false;
        }
      }
      
      // Check for goal
      if (state.ballMesh && state.holeMesh && !state.isHoleCompleted && !isGamePaused) {
        const distToHole = state.ballMesh.position.distanceTo(state.holeMesh.position);
        if (distToHole < level.holeRadius && state.ballVelocity.lengthSq() < 0.1) {
          state.ballVelocity.set(0,0,0);
          state.isBallMoving = false;
          memoizedOnHoleComplete();
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      
      // Dispose of Three.js objects to prevent memory leaks
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      controls.dispose();
    };
  }, [level, setPower, memoizedOnStroke, memoizedOnHoleComplete, isGamePaused, state]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default GolfCanvas;
