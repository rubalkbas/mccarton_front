import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Clock } from 'three';

@Component({
  selector: 'app-cajas',
  template: `

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

    let model: THREE.Object3D;
    let animationMixer: THREE.AnimationMixer;

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
      console.log(animations)

      // Selecciona la animación deseada
      const clip = animations.find((animation) => animation.name === 'PlaneAction_Plane.003');
      console.log(clip)
      // Cambia el formato de la animación a NumberKeyframe
      if (clip && clip.tracks && clip.tracks.length > 0) {
        clip.tracks.forEach((track) => {
          if (track instanceof THREE.VectorKeyframeTrack) {
            const times = track.times;
            const values = track.values;
            const newValues = [];
            for (let i = 0; i < values.length; i += 3) {
              newValues.push(values[i]);
            }
            const newTrack = new THREE.NumberKeyframeTrack(track.name.replace('.morphTargetInfluences', '.weights'), times, newValues);
            const index = clip.tracks.indexOf(track);
            if (index > -1) {
              clip.tracks.splice(index, 1, newTrack);
            }
          }
        });
      }


      // Agrega la animación al mixer
      if (model && clip) {
        animationMixer = new THREE.AnimationMixer(model);
        const action = animationMixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.play();
      }

      scene.add(model);
    });

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

    function render(): void {
      requestAnimationFrame(render);
      if (animationMixer) {
        animationMixer.update(0.1);
      }
      renderer.render(scene, camera);
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
    render();
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