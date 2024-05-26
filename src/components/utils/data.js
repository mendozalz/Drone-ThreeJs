export const motores = [
  {
    name: "Motor 1",
    group: "motor",
    rute: "./modelos/motor/Motor1.gltf",
  },
  {
    name: "Motor 2",
    group: "motor",
    rute: "./modelos/motor/Motor2.gltf",
  },
  {
    name: "Motor 3",
    group: "motor",
    rute: "./modelos/motor/Motor3.gltf",
  },
];

export const helices = [
  {
    name: "Helice 1",
    group: "helices",
    rute: "./modelos/helices/Helice1.gltf",
  },
  {
    name: "Helice 2",
    group: "helices",
    rute: "./modelos/helices/Helice2.gltf",
  },
  {
    name: "Helice 3",
    group: "helices",
    rute: "./modelos/helices/Helice3.gltf",
  },
];

export const camaras = [
  {
    name: "Camara 1",
    group: "camara",
    rute: "./modelos/cam/Cam1.gltf",
  },
  {
    name: "Camara 2",
    group: "camara",
    rute: "./modelos/cam/Cam2.gltf",
  },
  {
    name: "Camara 3",
    group: "camara",
    rute: "./modelos/cam/Cam3.gltf",
  },
];


export const animationMotor = {
  motores: {
    target: {
      x: -0.4818,
      y: -0.4818,
      z: 0,
    },
    camara:{
        x: -7,
        y: 4.8436,
        z: 10, 
    },
    zoom: 3
  }
};

export const animationCamara = {
  camaras: {
    target: {
      x: 0.8066,
      y: -0.0523,
      z: 0,
    },
    camara:{
        x: -10,
        y: -2.8869,
        z: 10, 
    },
    zoom: 4.6719
  }
};

export const animationHelice = {
  helices: {
    target: {
      x: 0.2053,
      y: -0.5,
      z: 0,
    },
    camara:{
        x: 8.4512,
        y: 6.5615,
        z: 10, 
    },
    zoom: 2.095
  }
};