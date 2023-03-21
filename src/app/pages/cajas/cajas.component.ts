import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-cajas',
  template: `
    <div class="container" fxLayout="row wrap">
      <div fxFlex.gt-xs="200" fxFlex.gt-md="50" fxFlex="100">
        <div class="card-info" fxLayout="row" fxLayoutAlign="start center">
          <div class="scene-container">
            <canvas #threeCanvas></canvas>
          </div>
        </div>
      </div>
      <div fxFlex.gt-xs="50" fxFlex.gt-md="50" fxFlex="100">
        <div class="card-form" fxLayout="row" fxLayoutAlign="start center">
          <div class="formularios">
            <mat-tab-group color="green">
              <mat-tab label="Colores">

              </mat-tab>
              <mat-tab label="Tamaños">

              </mat-tab>
              <mat-tab label="Grosores">

              </mat-tab>
            </mat-tab-group>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements AfterViewInit {
  @ViewChild('threeCanvas') private threeCanvasRef: ElementRef<HTMLCanvasElement>;

  constructor() { }

  public ngAfterViewInit(): void {
    const threeCanvas = this.threeCanvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threeCanvas });
    renderer.setClearColor(0xCBE6D2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.3, 1500);
    camera.position.set(2, 2, 2);

    const gltfloader = new GLTFLoader();
    gltfloader.load('assets/images/caja/cajasolapas/scene.gltf', function (gltf) {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);

      // Asignar sombras al modelo
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.minDistance = 5;
    orbit.maxDistance = 20;
    orbit.update();

    function onWindowResize(): void {
      const width = threeCanvas.clientWidth;
      const height = threeCanvas.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    const animate = (): void => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }
}
