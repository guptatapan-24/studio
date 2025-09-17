
"use client";

import React, { useRef, useEffect, useCallback } from 'react';
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
    const aimLineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    this.aimLine = new THREE.Line(aimLineGeo, aimLineMat);
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
        case ' ':
            event.preventDefault();
            if (!this.isCharging) {
                this.isCharging = true;
            }
            break;
    }
  }

  private handleKeyUp = (event: KeyboardEvent) => {
    if (this.isGamePaused() || this.isHoleCompleted) return;
    
    if (event.key.toLowerCase() === ' ' && this.isCharging) {
        event.preventDefault();
        
        if (this.chargePower < 5) { // Cancel shot if not enough power
            this.isCharging = false;
            this.setPower(0);
            this.chargePower = 0;
            return;
        }

        const powerMultiplier = 0.02; // Reduced power sensitivity
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

  private getCollisionNormal(ball: THREE.Mesh, obstacle: THREE.Mesh): THREE.Vector3 | null {
    const ballBox = new THREE.Box3().setFromObject(ball);
    const obstacleBox = new THREE.Box3().setFromObject(obstacle);
    if (!ballBox.intersectsBox(obstacleBox)) return null;

    const ballCenter = new THREE.Vector3();
    ballBox.getCenter(ballCenter);
    
    const closestPoint = new THREE.Vector3();
    obstacleBox.clampPoint(ballCenter, closestPoint);
    
    const normal = ballCenter.sub(closestPoint).normalize();
    return normal;
}


  private update() {
    if (this.isGamePaused()) return;
    
    // Update charge power
    const chargeSpeed = 0.75;
    if (this.isCharging) {
        const newPower = Math.min(this.chargePower + chargeSpeed, 100);
        this.chargePower = newPower;
        this.setPower(newPower);
    }
    
    // Update aim indicator
    this.aimLine.visible = !this.isBallMoving && !this.isHoleCompleted;
    if(this.aimLine.visible) {
        const startPoint = this.ballMesh.position;
        const endPoint = startPoint.clone().add(this.aimDirection.clone().multiplyScalar(3));
        this.aimLine.geometry.setFromPoints([startPoint, endPoint]);
    }
    
    // Update ball physics
    if (this.isBallMoving) {
      this.ballMesh.position.add(this.ballVelocity);
      this.ballVelocity.multiplyScalar(0.97); // Slightly increased friction

      // Obstacle collision
      this.obstacles.forEach(obstacle => {
          const normal = this.getCollisionNormal(this.ballMesh, obstacle);
          if (normal) {
              this.ballVelocity.reflect(normal);
              this.ballVelocity.multiplyScalar(0.7); // Energy loss on bounce
          }
      });

      // Check if ball has stopped
      if (this.ballVelocity.lengthSq() < 0.0001) {
          this.ballVelocity.set(0, 0, 0);
          this.isBallMoving = false;
      }
    }
    
    // Check for hole completion
    if (!this.isHoleCompleted) {
      const distToHole = this.ballMesh.position.distanceTo(this.holeMesh.position);
      if (distToHole < this.level.holeRadius && this.ballVelocity.lengthSq() < 0.2) {
        this.ballVelocity.set(0, 0, 0);
        this.isBallMoving = false;
        this.isHoleCompleted = true;
        this.onHoleComplete();
      }
    }
  }

  public animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.update();
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
    // We want this effect to run ONLY when the level changes, to create a new game instance.
    // All other props are passed as callbacks or refs to the Game class.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default GolfCanvas;

    

    