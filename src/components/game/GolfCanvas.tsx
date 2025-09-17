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
};

const GolfCanvas: React.FC<GolfCanvasProps> = ({ level, onStroke, onHoleComplete, setPower }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    isBallMoving: false,
    isCharging: false,
    power: 0,
    chargeStartTime: 0,
    aimDirection: new THREE.Vector3(0, 0, -1),
    ballVelocity: new THREE.Vector3(),
    ballMesh: null as THREE.Mesh | null,
    holeMesh: null as THREE.Mesh | null,
  }).current;

  const memoizedOnStroke = useCallback(onStroke, [onStroke]);
  const memoizedOnHoleComplete = useCallback(onHoleComplete, [onHoleComplete]);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xD3D3D3); 
    scene.fog = new THREE.Fog(0xD3D3D3, 20, 50);

    const camera = new THREE.PerspectiveCamera(60, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, level.startPosition[2] + 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    controls.enablePan = true;


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const groundGeo = new THREE.PlaneGeometry(30, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#7CFC00', roughness: 0.8 });
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
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1 });
    state.holeMesh = new THREE.Mesh(holeGeo, holeMat);
    state.holeMesh.position.fromArray(level.holePosition);
    state.holeMesh.rotation.x = -Math.PI / 2;
    scene.add(state.holeMesh);

    const obstacles: THREE.Mesh[] = [];
    level.obstacles.forEach(obs => {
      const obsGeo = new THREE.BoxGeometry(...obs.size);
      const obsMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.7 });
      const obstacle = new THREE.Mesh(obsGeo, obsMat);
      obstacle.position.fromArray(obs.position);
      if(obs.rotation) obstacle.rotation.fromArray(obs.rotation as [number, number, number]);
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      scene.add(obstacle);
      obstacles.push(obstacle);
    });

    const aimLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const aimLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const aimLine = new THREE.Line(aimLineGeo, aimLineMat);
    scene.add(aimLine);


    const onKeyDown = (event: KeyboardEvent) => {
        if (state.isBallMoving) return;

        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                state.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 60);
                break;
            case 'ArrowRight':
                event.preventDefault();
                state.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 60);
                break;
            case ' ': // Spacebar
                event.preventDefault();
                if (!state.isCharging) {
                    state.isCharging = true;
                    state.chargeStartTime = Date.now();
                }
                break;
        }
    }

    const onKeyUp = (event: KeyboardEvent) => {
        if (event.key === ' ' && state.isCharging && state.ballMesh) {
            event.preventDefault();
            state.isCharging = false;
            
            const chargeDuration = Date.now() - state.chargeStartTime;
            const power = Math.min(chargeDuration / 20, 100); // Max power at 2 seconds
            
            if (power < 5) {
                setPower(0);
                state.power = 0;
                return;
            }

            state.ballVelocity.copy(state.aimDirection).multiplyScalar(power * 0.003);
            state.isBallMoving = true;
            memoizedOnStroke();
            setPower(0);
            state.power = 0;
        }
    }

    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    const handleClick = () => {
      currentMount.focus();
    };

    currentMount.addEventListener('click', handleClick);
    currentMount.addEventListener('keydown', onKeyDown);
    currentMount.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', handleResize);
    
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if(state.isCharging) {
          const chargeDuration = Date.now() - state.chargeStartTime;
          state.power = Math.min(chargeDuration / 20, 100);
          setPower(state.power);
      }

      if (state.ballMesh) {
        aimLine.visible = !state.isBallMoving;
        if(aimLine.visible) {
            aimLine.geometry.setFromPoints([state.ballMesh.position, state.ballMesh.position.clone().add(state.aimDirection.clone().multiplyScalar(3))]);
        }
      }

      if (state.isBallMoving && state.ballMesh) {
        state.ballMesh.position.add(state.ballVelocity);
        state.ballVelocity.multiplyScalar(0.98); // friction

        if (state.ballVelocity.lengthSq() < 0.00001) {
            state.ballVelocity.set(0, 0, 0);
            state.isBallMoving = false;
        }
      }
      
      if (state.ballMesh && state.holeMesh) {
        const distToHole = state.ballMesh.position.distanceTo(state.holeMesh.position);
        if (distToHole < level.holeRadius && !state.isBallMoving) {
          state.ballVelocity.set(0,0,0);
          
          // Simple animation to sink the ball
          if (state.ballMesh.position.y > state.holeMesh.position.y - 0.1) {
             state.ballMesh.position.y -= 0.01;
          } else {
             memoizedOnHoleComplete();
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('click', handleClick);
      currentMount.removeEventListener('keydown', onKeyDown);
      currentMount.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [level, setPower, memoizedOnStroke, memoizedOnHoleComplete, state]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" tabIndex={0} />;
};

export default GolfCanvas;
