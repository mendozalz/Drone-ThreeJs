import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { gsap } from "gsap";

//Global variables
let currentRef = null;

const timeLine = new gsap.timeline({
  defaults: { duration: 1 }
});

// Controles DEBUG
/* const gui = new dat.GUI({
  width: 600,
  load: false,
  closed: true,
});
 */
// Partes del Drone
const partesDrone = {
  base: new THREE.Group(),
  motor: new THREE.Group(),
  helices: new THREE.Group(),
  camara: new THREE.Group()
};

//Scene, camera, renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8aaa58);
const camera = new THREE.PerspectiveCamera(15, 100 / 100, 1, 100);
scene.add(camera);
camera.position.set(-10, 5, 10);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.setSize(100, 100);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3.5;
renderer.setPixelRatio(2);
renderer.setPixelRatio(window.devicePixelRatio);

//OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.maxPolarAngle = Math.PI * 0.55;
orbitControls.minPolarAngle = Math.PI * 0.2;

//Resize canvas
export const resize = () => {
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

// LoaderManager para castear sombras a las mallas
const loadingManager = new THREE.LoadingManager(() => {
  castShadow();
});

// Instanciando Loader
const gltfLoader = new GLTFLoader(loadingManager);

// Casteo de sombras a todas las mallas
const castShadow = () => {
  scene.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.envMapIntensity = 0.38;
    }
  });
};

// Plano base del Drone
const geometriaPlanoBase = new THREE.PlaneGeometry(5, 5);
const materialPlanoBase = new THREE.ShadowMaterial({
  opacity: 0.3
});
const planoBase = new THREE.Mesh(
  geometriaPlanoBase,
  materialPlanoBase
);
planoBase.rotation.x = -Math.PI * 0.5;
planoBase.position.y = -0.75;
scene.add(planoBase);

//Animación de escena para el Drone
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const movimientoArribaAbajo = Math.sin(elapsedTime);
  partesDrone.base.position.y = movimientoArribaAbajo * 0.05;
  partesDrone.motor.position.y = movimientoArribaAbajo * 0.05;
  partesDrone.helices.position.y = movimientoArribaAbajo * 0.05;
  partesDrone.camara.position.y = movimientoArribaAbajo * 0.05;

  try {
    for (let i = 0; i < partesDrone.helices.children.length; i++) {
      partesDrone.helices.children[i].rotation.y = elapsedTime * -0.5;
    }
  } catch (error) {
    console.log(error);
  }

  orbitControls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};
animate();

// Luces
const luz1 = new THREE.DirectionalLight(0xfcfcfc, 10);
luz1.position.set(0, 6, 1);
luz1.castShadow = true;
luz1.shadow.mapSize.set(2048, 2048);
luz1.shadow.bias = -0.000131;
scene.add(luz1);

const AmbientalLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(AmbientalLight);

// Luces adicionales
const luz2 = new THREE.PointLight(0xffffff, 1.5);
luz2.position.set(5, 5, 5);
scene.add(luz2);

const luz3 = new THREE.PointLight(0xffffff, 1.5);
luz3.position.set(-5, 5, -5);
scene.add(luz3);

// Agregando en envMap
const envMap = new THREE.CubeTextureLoader().load([
  "./envMap/nx.png",
  "./envMap/ny.png",
  "./envMap/nz.png",
  "./envMap/px.png",
  "./envMap/py.png",
  "./envMap/pz.png",
]);

scene.environment = envMap;

//Init and mount the scene
export const initScene = (mountRef) => {
  currentRef = mountRef.current;
  resize();
  currentRef.appendChild(renderer.domElement);
};

//Dismount and clean up the buffer from the scene
export const cleanUpScene = () => {
  gui.destroy();
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose();
      child.material.dispose();
    }
    if (child.dispose) {
      child.dispose();
    }
  });
  scene.dispose();
  if (currentRef && currentRef.contains(renderer.domElement)) {
    currentRef.removeChild(renderer.domElement);
  }
};

// Cargando la funcion para los grupos de las partes del Drone
export const cargarGrupos = () => {
  scene.add(partesDrone.base);
  scene.add(partesDrone.camara);
  scene.add(partesDrone.helices);
  scene.add(partesDrone.motor);
};

// Cargando los modelos desde la carpeta publica
export const cargarModelos = (rute, group) => {
  gltfLoader.load(rute, (gltf) => {
    while (gltf.scene.children.length) {
      partesDrone[group].add(gltf.scene.children[0]);
    }
  });
};

// Removiendo el elemento del modelo cargado anteriormente
export const removerModelo = (rute, group) => {
  // referenciar el modelo antes de removerlo
  const referenciaModelo = new THREE.Group();
  while (partesDrone[group].children.length) {
    referenciaModelo.add(partesDrone[group].children[0]);
  }

  // remover modelos
  while (partesDrone[group].children.length) {
    partesDrone[group].remove(partesDrone[group].children[0]);
  }

  // Ahora hacemos un dispose de los modelos
  referenciaModelo.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material.dispose();
      child.geometry.dispose();
    }
  });
  partesDrone[group].clear();

  cargarModelos(rute, group);
};

// Cargando los controles
// Punto de referencia
const cubeDebug = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.1, 0.1),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,  // se ha ocultado aqui el punto de debug
  })
);

scene.add(cubeDebug);

// target position
/* gui.add(cubeDebug.position, "x").min(-10).max(10).step(0.0001).name("Target X").onChange(() => {
  orbitControls.target.x = cubeDebug.position.x;
});
gui.add(cubeDebug.position, "y").min(-10).max(10).step(0.0001).name("Target Y").onChange(() => {
  orbitControls.target.x = cubeDebug.position.y;
});
gui.add(cubeDebug.position, "z").min(-10).max(10).step(0.0001).name("Target Z").onChange(() => {
  orbitControls.target.x = cubeDebug.position.z;
}); */

// target camara
/* gui.add(camera.position, "x").min(-10).max(10).step(0.0001).name("Camara X");
gui.add(camera.position, "y").min(-10).max(10).step(0.0001).name("Camara Y");
gui.add(camera.position, "z").min(-10).max(10).step(0.0001).name("Camara Z"); */

// target Zoom
 /* gui.add(camera, "zoom").min(-10).max(10).step(0.0001).onChange(() => {
  camera.updateProjectionMatrix();
});
 */
// Animacion GSAP
export const gsapAnimation = (targetPos, camPos, zoom) => {
  timeLine.to(orbitControls.target, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
  }).to(camera.position, {
    x: camPos.x,
    y: camPos.y,
    z: camPos.z,
  }, "-=1.0").to(camera, {
    zoom: zoom,
    onUpdate: () => camera.updateProjectionMatrix()
  }, "-=1.0");
};

export const valorInicial = () => {
  gsapAnimation(
    {
      x: 0,
      y: 0,
      z: 0,
    },
    {
      x: -10,
      y: 5,
      z: 10,
    },
    1
  );
};

// Solo para dispositivos Moviles

export const configurarCamaraGeneral = (isMobile) => {
  if (isMobile) {
    // Valores para dispositivos móviles
    gsapAnimation(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: -7.697,
        y: 2.3527,
        z: 8.0217,
      },
      0.27
    );
  } else {
    // Valores para dispositivos de escritorio
    valorInicial();
  }
};

export const valorInicialMovil = (isMobile) => {
  if (isMobile) {
    gsapAnimation(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      {
        x: -7.697,
        y: 2.3527,
        z: 8.0217,
      },
      0.27
    );
  } else {
    valorInicial();
  }
}

export const animacionCamaraMovil = (isMobile) => {
  if (isMobile) {
    gsapAnimation(
      {
        x: 0.9716,
        y: 0,
        z: 0,
      },
      {
        x: -10,
        y: -3.1445,
        z: 10,
      },
      2.9018
    );
  } else {
    valorInicial();
  }
}

export const animacionHelicesMovil = (isMobile) => {
  if (isMobile) {
    gsapAnimation(
      {
        x: 0.2912,
        y: 0,
        z: 0,
      },
      {
        x: 8.3064,
        y: 4.3283,
        z: 10,
      },
      0.7786
    );
  } else {
    valorInicial();
  }
}