import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AdminService } from 'src/app/_services/admins.service';
import { Colores } from 'src/app/models/color.model';
@Component({
  selector: 'app-caja7',
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
            <h2 class="titulo">Colores</h2>
            <div class="colores">
            <button *ngFor="let colores of listaColores" id="btnColores" class="btnColo" style="background-color:#{{colores.codigoHexadecimal}};" value="{{colores.codigoHexadecimal}}"></button>
            </div>
            <div class="grosor">
              <h2 class="titulo">Grosores</h2>
              <button id="btnmicro" class="boton-redondo"></button>
              <button class="boton-redondo" id="btndos" ></button>
            </div>

        </div>

      </div>
    </div>
    <div class="botones">
    <button id="btnabrir">Abrir</button>
    <button id="btncerrar">Cerrar</button>
    <br>
    <button id="btndesplegar">Desplegar</button>
    <button id="btnplegar">Plegar</button>
    </div>
  </div>
`,
  styleUrls: ['./caja7.component.scss']
})
export class Caja7Component implements AfterViewInit {

 

  @ViewChild('threeCanvas') private threeCanvasRef: ElementRef<HTMLCanvasElement>;

  listaColores: Colores[] = [];

  constructor(public adminService: AdminService,
  ) { }
  ngOnInit() {
    const coloresString = localStorage.getItem('colores');
    if (coloresString) {
      this.listaColores = JSON.parse(coloresString);
    }
  }
  public ngAfterViewInit(): void {

    const threeCanvas = this.threeCanvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threeCanvas });
    renderer.setClearColor(0x2A2A2A);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.5, 1500);
    camera.position.set(20, 100, 300);


    const mixer = new THREE.AnimationMixer(scene);

    let model: THREE.Object3D;
    let exterior = new THREE.Material;
    const gltfloader = new GLTFLoader();
    gltfloader.load('assets/images/caja/cajas/cajita.gltf', function (gltf) {
      model = gltf.scene;
      model.scale.set(0.20, 0.10, 0.15);

      // MATERIALES
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          console.log(child.material);
          if (child.material.name === 'carton_interior') {
            const texture = new THREE.TextureLoader().load('assets/images/caja/testura.png');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            child.material.map = texture;
            child.material.bumpMap = texture;
            child.material.bumpScale = 0.1;
          }
          if (child.material.name === 'EXTERIOR') {
            exterior = child.material
          }

        }
      });
      const btnColores = document.querySelectorAll('.btnColo');
      btnColores.forEach(btnColor => {
        btnColor.addEventListener('click', () => {
          const valor = (btnColor as HTMLButtonElement).value;
          const valorHexadecimal = parseInt("0x" + valor);
          exterior.color.set(valorHexadecimal)
          console.log(valor)
        });
      });
      //ANIMACIONES
      const animations = gltf.animations;
      console.log(animations)
      let action: THREE.AnimationAction;
      for (const animation of animations) {
        action = mixer.clipAction(animation);
        if (animation.name === "ABIERTA") {
          action.name = 'Animacion1';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
        }
        if (animation.name === "Desplegada") {
          action.name = 'Animacion2';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
          action.setEffectiveTimeScale(0.5);
        }
        if (animation.name === "Cube.005Action") {
          action.name = 'Animacion3';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
        }

      }
      // Boton Abrir
      const btnmicro: HTMLButtonElement = document.getElementById('btnmicro') as HTMLButtonElement;
      btnmicro.addEventListener('click', () => {
        playAnimation2('Animacion3', true);
      });
      const btndos: HTMLButtonElement = document.getElementById('btndos') as HTMLButtonElement;
      btndos.addEventListener('click', () => {
        playAnimation2('Animacion3', false);
      });

      const btnAbrir: HTMLButtonElement = document.getElementById('btnabrir') as HTMLButtonElement;
      btnAbrir.addEventListener('click', () => {
        playAnimation('Animacion1', false);
        btnAbrir.style.display = 'none';
        btnDesplegar.style.display = 'none';
        btnCerrar.style.display = 'inline-block';
        btnPlegar.style.display = 'none';
      });

      // Boton Cerrar
      const btnCerrar: HTMLButtonElement = document.getElementById('btncerrar') as HTMLButtonElement;
      btnCerrar.style.display = 'none'; // Ocultar el botón "cerrar" al principio
      btnCerrar.addEventListener('click', () => {
        playAnimation('Animacion1', true);
        btnAbrir.style.display = 'inline-block';
        btnDesplegar.style.display = 'inline-block';
        btnCerrar.style.display = 'none';
        btnPlegar.style.display = 'none';
      });

      // Boton Plegar
      const btnPlegar: HTMLButtonElement = document.getElementById('btnplegar') as HTMLButtonElement;
      btnPlegar.style.display = 'none'; // Ocultar el botón "plegar" al principio
      btnPlegar.addEventListener('click', () => {
        playAnimation('Animacion2', true);
        btnAbrir.style.display = 'inline-block';
        btnDesplegar.style.display = 'inline-block';
        btnCerrar.style.display = 'none';
        btnPlegar.style.display = 'none';
      });

      // Boton Desplegar
      const btnDesplegar: HTMLButtonElement = document.getElementById('btndesplegar') as HTMLButtonElement;
      btnDesplegar.addEventListener('click', () => {
        playAnimation('Animacion2', false);
        btnAbrir.style.display = 'none';
        btnDesplegar.style.display = 'none';
        btnCerrar.style.display = 'none';
        btnPlegar.style.display = 'inline-block';
      });

      scene.add(model);
    });


    const clock = new THREE.Clock();

    const animate = (): void => {
      requestAnimationFrame(animate);
      if (mixer) {
        mixer.update(clock.getDelta());
      }
      renderer.render(scene, camera);
    };
    animate();

    function stopAllAnimations() {
      mixer.stopAllAction();
    }
    function playAnimation(name: string, reverse: boolean) {
      stopAllAnimations();
      const action = mixer._actions.find(action => action.name === name);
      if (reverse) {
        if (action) {
          action.reset();
          const clip = action._clip;
          action.setEffectiveTimeScale(-0.5);
          action.setEffectiveWeight(1);
          action.play();
          console.log(clip);
          model.userData.animations = [clip];
          console.log(model)
        }
      }
      else {
        if (action) {
          action.reset();
          const clip = action._clip;
          action.setEffectiveTimeScale(0.5);
          action.setEffectiveWeight(2);
          action.play();
          console.log(clip);
          model.userData.animations = [clip];
        }
      }
    }
    function playAnimation2(name: string, reverse: boolean) {
      const action = mixer._actions.find(action => action.name === name);
      if (reverse) {
        if (action) {
          action.reset();
          const clip = action._clip;
          action.setEffectiveTimeScale(-1);
          action.setEffectiveWeight(1);
          action.play();
          console.log(clip);
          model.userData.animations = [clip];
          console.log(model)
        }
      }
      else {
        if (action) {
          action.reset();
          const clip = action._clip;
          action.setEffectiveTimeScale(1);
          action.setEffectiveWeight(2);
          action.play();
          console.log(clip);
          model.userData.animations = [clip];
        }
      }
    }
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

    window.addEventListener('resize', onWindowResize);
    onWindowResize();


  }
}

