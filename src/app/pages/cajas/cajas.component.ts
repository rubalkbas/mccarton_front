import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Clock } from 'three';

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
          <button id="btnplegar">Plegar</button>
          <button id="btndesplegar">Desplegar</button>
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
    const camera = new THREE.PerspectiveCamera(30, threeCanvas.clientWidth / threeCanvas.clientHeight, 0.5, 1500);
    camera.position.set(-10, 20, 10);

    const mixer = new THREE.AnimationMixer(scene);

    let model: THREE.Object3D;

    const gltfloader = new GLTFLoader();
    gltfloader.load('assets/images/caja/PLANOS.gltf', function (gltf) {
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
      let action: THREE.AnimationAction;
      for (const animation of animations) {
        action = mixer.clipAction(animation);
        if (animation.name === "Key.003Action") {
          action.name = 'Animacion1';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
        }
        if (animation.name === "Key.003Action.001") {
          action.name = 'Animacion2';
          action.setLoop(THREE.LoopRepeat, 1); // Se repetirá 1 vez
          action.clampWhenFinished = true;
        }
      }
      // Boton Plegar
      const btnPlegar: HTMLButtonElement = document.getElementById('btnplegar') as HTMLButtonElement;
      btnPlegar.addEventListener('click', () => {
        playAnimation('Animacion1');
        setTimeout(() => {
          action.timeScale = 0;
          action.setEffectiveWeight(1);
          btnPlegar.disabled = true; // Desactivar botón Plegar
          btnDesplegar.disabled = false; // Activar botón Desplegar
        }, 4166);
      });

      // Boton Desplegar
      const btnDesplegar: HTMLButtonElement = document.getElementById('btndesplegar') as HTMLButtonElement;
      btnDesplegar.addEventListener('click', () => {
        playAnimation('Animacion2');
        setTimeout(() => {
          action.timeScale = -1;
          action.setEffectiveWeight(1);
          const currentTime = action.getClip().duration - (3180 / 30);
          action.time = currentTime;
          btnPlegar.disabled = false; // Activar botón Plegar
          btnDesplegar.disabled = true; // Desactivar botón Desplegar
        }, 3180);
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


    function playAnimation(name: string) {
      const action = mixer._actions.find(action => action.name === name);
      if (action) {
        action.reset();
        const clip = action._clip;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
        action.play();
        console.log(clip);
        model.userData.animations = [clip];
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