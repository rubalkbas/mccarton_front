import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AdminService } from '../../_services/admins.service';
import { Colores } from '../../models/color.model';

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
              <button id="btnColores" class="btnColo" style="background-color:#c69d6d ;" value="c69d6d"></button>
              <button id="btnColores" class="btnColo" style="background-color:#ffffff ;" value="ffffff"></button>
              <button id="btnColores" class="btnColo" style="background-color:#212121 ;" value="212121"></button>
              <button id="btnColores" class="btnColo" style="background-color:#c74f62;" value="c74f62"></button>
              <button id="btnColores" class="btnColo" style="background-color:#5a836f ;" value="5a836f"></button>
              <button id="btnColores" class="btnColo" style="background-color:#427aaf ;" value="427aaf"></button>
              </mat-tab>
              <mat-tab label="Grosores">

              </mat-tab>
            </mat-tab-group>
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
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements AfterViewInit {
  @ViewChild('threeCanvas') private threeCanvasRef: ElementRef<HTMLCanvasElement>;

  listaColores: Colores[] = [];

  constructor(public adminService: AdminService,
  ) { }
  public ngAfterViewInit(): void {
    const threeCanvas = this.threeCanvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threeCanvas });
    renderer.setClearColor(0xCBE6D2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.5, 1500);
    camera.position.set(-5, 40, 10);

    const mixer = new THREE.AnimationMixer(scene);

    let model: THREE.Object3D;
    let exterior = new THREE.Material;
    const gltfloader = new GLTFLoader();
    gltfloader.load('assets/images/caja/cajita_grosor_2/cajita_grosor_2.gltf', function (gltf) {
      model = gltf.scene;
      model.scale.set(0.25, 0.25, 0.25);

      // MATERIALES
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          console.log(child.material);
          if (child.material.name === 'carton_interior') {
            const texture = new THREE.TextureLoader().load('assets/images/caja/textura.jpg');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            child.material.map = texture;
            child.material.bumpMap = texture;
            child.material.bumpScale = 0.1;
          }
          if (child.material.name === 'EXTERIOR') {
            exterior = child.material
          }
          /*
          if (child.material.name === 'Carton_medio') {
            const texture = new THREE.TextureLoader().load('assets/images/caja/corrugado.png');
            texture.wrapS = THREE.RepeatWrapping;
            child.material.map = texture;
            child.material.color.set(0xc69d6d)
          }
          */

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
        if (animation.name === "DESPLEGADA_2") {
          action.name = 'Animacion2';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
        }
        if (animation.name === "Key.002Action") {
          action.name = 'Animacion3';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
        }

      }

      // Boton Abrir
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

    this.adminService.listarColoresActivos().subscribe(colores => {
      this.listaColores = colores.response;
      console.log(this.listaColores);
    })
  }
}



/*

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
        function reverseAnimation(): void {
      const action = mixer._actions.find(action => action.isPlaying);
      if (action) {
        action.paused = true;
        action.enabled = false;
        action.reversed = !action.reversed;
        action.enabled = true;
        action.paused = false;
      }
    }



     public ngAfterViewInit(): void {
    const threeCanvas = this.threeCanvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threeCanvas });
    renderer.setClearColor(0xCBE6D2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.5, 1500);
    camera.position.set(-10, 20, 10);

    const mixer = new THREE.AnimationMixer(scene);

    let model: THREE.Object3D;

    const gltfloader = new GLTFLoader();
    gltfloader.load('assets/images/caja/prueba1/caja1.gltf', function (gltf) {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const animations = gltf.animations;
      console.log(animations)
      for (const animation of animations) {
        const action = mixer.clipAction(animation);
        if (animation.name === "PlaneAction") {
          action.name = 'Animacion1';
          action.loop = THREE.LoopRepeat;
          action.clampWhenFinished = true;
        }
      }

      scene.add(model);
      playAnimation('Animacion1');
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

    function playAnimation(name: string) {
      const action = mixer._actions.find(action => action.name === name);
      if (action) {
        const clip = action._clip;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.play();
        console.log(clip);
        model.userData.animations = [clip];
      }
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
  }
    
*/



/**
 * 
 * 
 *   public ngAfterViewInit(): void {
    const threeCanvas = this.threeCanvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: threeCanvas });
    renderer.setClearColor(0xCBE6D2);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.5, 1500);
    camera.position.set(-10, 20, 10);

    const mixer = new THREE.AnimationMixer(scene);

    let model: THREE.Object3D;

    const gltfloader = new GLTFLoader();
    gltfloader.load('assets/images/caja/prueba4/caja1.gltf', function (gltf) {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      const animations = gltf.animations;

      const animClip = animations.find((animation) => animation.name === 'PlaneAction_Plane.003');
      if (animClip) {
        const convertedTracks = [];
        animClip.tracks.forEach((track) => {
          if (track instanceof THREE.VectorKeyframeTrack) {
            const times = track.times;
            const values = track.values;
            const newValues = [];
            for (let i = 0; i < values.length; i += 3) {
              newValues.push(values[i]);
            }
            const newTrack = new THREE.NumberKeyframeTrack(track.name.replace('.morphTargetInfluences', '.weights'), times, newValues);
            convertedTracks.push(newTrack);
          } else {
            convertedTracks.push(track);
          }
        });
        const convertedClip = new THREE.AnimationClip(animClip.name, animClip.duration, convertedTracks);
        const action = mixer.clipAction(convertedClip);
        action.name = 'Animacion1';
        action.loop = THREE.LoopRepeat;
        action.clampWhenFinished = true;
        if (convertedClip) {
          action.setClip(convertedClip);
        }
      }

      scene.add(model);
      playAnimation('Animacion1');
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

    function playAnimation(name: string) {
      const action = mixer._actions.find(action => action.name === name);
      if (action) {
        const clip = action._clip;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.play();
        console.log(clip);
        model.userData.animations = [clip];
      }
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
  }
 */