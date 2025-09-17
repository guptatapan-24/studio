
"use client";

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Level } from '@/lib/levels';

// --- A dedicated class to manage the Three.js game world ---
class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private ballMesh: THREE.Mesh;
  private holeMesh: THREE.Mesh;
  private obstacles: THREE.Mesh[] = [];
  private aimLine: THREE.Line;

  // Game state
  private isBallMoving = false;
  private isCharging = false;
  private chargePower = 0;
  private aimDirection = new THREE.Vector3(0, 0, -1);
  private ballVelocity = new THREE.Vector3();
  private isHoleCompleted = false;
  
  // Constants
  private gravity = new THREE.Vector3(0, -0.01, 0);

  // Callbacks
  private onStroke: () => void;
  private onHoleComplete: () => void;
  private setPower: (power: number) => void;
  private isGamePaused: () => boolean;
  
  constructor(
    private mount: HTMLDivElement,
    private level: Level,
    callbacks: {
        onStroke: () => void;
        onHoleComplete: () => void;
        setPower: (power: number) => void;
        isGamePaused: () => boolean;
    }
  ) {
    this.onStroke = callbacks.onStroke;
    this.onHoleComplete = callbacks.onHoleComplete;
    this.setPower = callbacks.setPower;
    this.isGamePaused = callbacks.isGamePaused;

    // --- Basic setup ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

    this.camera = new THREE.PerspectiveCamera(60, this.mount.clientWidth / this.mount.clientHeight, 0.1, 1000);
    this.camera.position.set(this.level.startPosition[0], 5, this.level.startPosition[2] + 8);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.mount.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.screenSpacePanning = false; // Right-click to pan
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.target.set(this.level.startPosition[0], this.level.startPosition[1], this.level.startPosition[2]);

    this.addLights();
    this.createLevel();
    this.bindEventHandlers();
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(10, 20, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
  }

  private createLevel() {
    // Ground
    const groundGeo = new THREE.PlaneGeometry(50, 50);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x55aa55, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Ball
    const ballGeo = new THREE.SphereGeometry(0.15, 32, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
    this.ballMesh = new THREE.Mesh(ballGeo, ballMat);
    this.ballMesh.castShadow = true;
    this.ballMesh.position.fromArray(this.level.startPosition);
    this.scene.add(this.ballMesh);

    // Hole
    const holeGeo = new THREE.CircleGeometry(this.level.holeRadius, 32);
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    this.holeMesh = new THREE.Mesh(holeGeo, holeMat);
    this.holeMesh.position.fromArray(this.level.holePosition);
    this.holeMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.holeMesh);

    // Obstacles
    this.level.obstacles.forEach(obs => {
      const obsGeo = new THREE.BoxGeometry(...obs.size);
      const obsMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
      const obstacle = new THREE.Mesh(obsGeo, obsMat);
      obstacle.position.fromArray(obs.position);
      if (obs.rotation) obstacle.rotation.fromArray(obs.rotation as [number, number, number]);
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      this.scene.add(obstacle);
      this.obstacles.push(obstacle);
    });

    // Aim Line
    const aimLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    aimLineMat.depthTest = false;
    const aimLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    this.aimLine = new THREE.Line(aimLineGeo, aimLineMat);
    this.aimLine.renderOrder = 999;
    this.scene.add(this.aimLine);
  }

  private bindEventHandlers() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.isGamePaused() || this.isBallMoving || this.isHoleCompleted) return;
    
    switch(event.key.toLowerCase()) {
        case 'arrowleft':
            event.preventDefault();
            this.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 45);
            break;
        case 'arrowright':
            event.preventDefault();
            this.aimDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 45);
            break;
        case ' ': // Changed from 'p' to spacebar
            event.preventDefault();
            if (!this.isCharging) {
                this.isCharging = true;
            }
            break;
    }
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    if (this.isGamePaused() || this.isHoleCompleted) return;
    
    if (event.key.toLowerCase() === ' ' && this.isCharging) { // Changed from 'p' to spacebar
        event.preventDefault();
        
        if (this.chargePower < 5) { // Cancel shot if not enough power
            this.isCharging = false;
            this.setPower(0);
            this.chargePower = 0;
            return;
        }

        const powerMultiplier = 0.0025;
        this.ballVelocity.copy(this.aimDirection).multiplyScalar(this.chargePower * powerMultiplier);
        this.isBallMoving = true;
        this.onStroke();

        // Reset charge state AFTER the shot is taken
        this.isCharging = false;
        this.setPower(0);
        this.chargePower = 0;
    }
  }

  private handleResize = () => {
    this.camera.aspect = this.mount.clientWidth / this.mount.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.mount.clientWidth, this.mount.clientHeight);
  };
  
  private checkCollisions() {
    const ballRadius = (this.ballMesh.geometry as THREE.SphereGeometry).parameters.radius;
    const groundLevel = 0.15; // Ball radius
    let onSurface = false;

    // --- Gravity ---
    this.ballVelocity.add(this.gravity);
    
    // --- Ground collision & friction ---
    if (this.ballMesh.position.y < groundLevel && this.ballVelocity.y < 0) {
        this.ballMesh.position.y = groundLevel;
        this.ballVelocity.y = -this.ballVelocity.y * 0.3; // Dampen bounce on ground
        onSurface = true;
    }

    // --- Obstacle collision ---
    for (const obstacle of this.obstacles) {
        obstacle.updateWorldMatrix(true, false);
        const inverseObstacleMatrix = new THREE.Matrix4().copy(obstacle.matrixWorld).invert();
        const localBallPosition = this.ballMesh.position.clone().applyMatrix4(inverseObstacleMatrix);
        
        const obstacleAABB = new THREE.Box3();
        obstacle.geometry.computeBoundingBox();
        obstacleAABB.copy(obstacle.geometry.boundingBox!);

        if (obstacleAABB.intersectsSphere(new THREE.Sphere(localBallPosition, ballRadius))) {
            const closestPoint = new THREE.Vector3();
            obstacleAABB.clampPoint(localBallPosition, closestPoint);
            
            const collisionNormalLocal = localBallPosition.clone().sub(closestPoint).normalize();
            
            // Transform the collision normal back to world space
            const collisionNormalWorld = collisionNormalLocal.clone().transformDirection(obstacle.matrixWorld);

            // Reflect velocity
            this.ballVelocity.reflect(collisionNormalWorld);
            this.ballVelocity.multiplyScalar(0.7); // Energy loss on collision

            // Push the ball out of the obstacle slightly to prevent sticking
            this.ballMesh.position.add(collisionNormalWorld.multiplyScalar(0.01));
            
            if (collisionNormalWorld.y > 0) {
              onSurface = true;
            }
        }
    }

    // --- Apply friction if on any surface ---
    if(onSurface) {
        this.ballVelocity.x *= 0.96;
        this.ballVelocity.z *= 0.96;
    }
  }

  private update() {
    if (this.isGamePaused()) return;
    
    const chargeSpeed = 0.75;
    if (this.isCharging) {
        const newPower = Math.min(this.chargePower + chargeSpeed, 100);
        this.chargePower = newPower;
        this.setPower(newPower);
    }
    
    this.aimLine.visible = !this.isBallMoving && !this.isHoleCompleted;
    if(this.aimLine.visible) {
        const startPoint = this.ballMesh.position;
        const endPoint = startPoint.clone().add(this.aimDirection.clone().multiplyScalar(3));
        this.aimLine.geometry.setFromPoints([startPoint, endPoint]);
        this.aimLine.geometry.attributes.position.needsUpdate = true;
    }
    
    if (this.isBallMoving) {
      // Apply new position
      this.ballMesh.position.add(this.ballVelocity);
      
      this.checkCollisions();
      
      // Stop condition
      if (this.ballVelocity.lengthSq() < 0.0001) {
          this.ballVelocity.set(0, 0, 0);
          this.isBallMoving = false;
      }
      
      // Out of bounds check
      const { x, y, z } = this.ballMesh.position;
      if (y < -2 || Math.abs(x) > 25 || Math.abs(z) > 25) {
        this.onStroke(); // Add penalty stroke
        this.ballMesh.position.fromArray(this.level.startPosition);
        this.ballVelocity.set(0, 0, 0);
        this.isBallMoving = false;
      }
    }
    
    if (!this.isHoleCompleted) {
      const distToHole = this.ballMesh.position.clone().setY(0).distanceTo(this.holeMesh.position.clone().setY(0));
      if (distToHole < this.level.holeRadius && this.ballVelocity.lengthSq() < 0.2) {
        const fallDirection = new THREE.Vector3().subVectors(this.holeMesh.position, this.ballMesh.position);
        fallDirection.y = -0.1;
        this.ballMesh.position.add(fallDirection.multiplyScalar(0.2));

        if (this.ballMesh.position.y < this.holeMesh.position.y) {
            this.ballVelocity.set(0, 0, 0);
            this.isBallMoving = false;
            this.isHoleCompleted = true;
            this.onHoleComplete();
        }
      }
    }
  }

  public animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.update();
    
    // Force the aim line to always render on top.
    (this.aimLine.material as THREE.LineBasicMaterial).depthTest = false;
    this.aimLine.renderOrder = 999;
    (this.aimLine.material as THREE.LineBasicMaterial).needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  };

  public cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);

    if (this.mount && this.renderer.domElement) {
        try {
            this.mount.removeChild(this.renderer.domElement);
        } catch (e) {
            console.error("Failed to remove renderer DOM element.", e);
        }
    }
    
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    this.renderer.dispose();
    this.controls.dispose();
  }
}

// --- The React Component ---
type GolfCanvasProps = {
  level: Level;
  onStroke: () => void;
  onHoleComplete: () => void;
  setPower: (power: number) => void;
  isGamePaused?: boolean;
};

const GolfCanvas: React.FC<GolfCanvasProps> = ({ level, onStroke, onHoleComplete, setPower, isGamePaused = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isGamePausedRef = useRef(isGamePaused);

  useEffect(() => {
    isGamePausedRef.current = isGamePaused;
  }, [isGamePaused]);

  useEffect(() => {
    if (!mountRef.current) return;

    const game = new Game(mountRef.current, level, {
        onStroke,
        onHoleComplete,
        setPower,
        isGamePaused: () => isGamePausedRef.current,
    });
    
    game.animate();

    return () => {
      game.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]); // Key change: This effect now ONLY re-runs if the level itself changes.

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default GolfCanvas;
