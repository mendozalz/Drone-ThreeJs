import { useEffect, useRef, useState } from "react";
import { ContainerScene } from "./Scene.elements";
import { cargarGrupos, cargarModelos, cleanUpScene, configurarCamaraGeneral, initScene, resize } from "./Script";
import { isMobile } from 'react-device-detect';

const Scene = () => {
  const mountRef = useRef(null);
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);

  useEffect(() => {
    initScene(mountRef);

    cargarGrupos();
    cargarModelos("./modelos/base/Base.gltf", "base");
    cargarModelos("./modelos/motor/Motor1.gltf", "motor");
    cargarModelos("./modelos/helices/Helice1.gltf", "helices");
    cargarModelos("./modelos/cam/Cam1.gltf", "camara");

    configurarCamaraGeneral(isMobileDevice);

    return () => {
      cleanUpScene();
    };
  }, [isMobileDevice]);

  useEffect(() => {
    const handleResize = () => {
      resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ContainerScene className='SceneContainer' ref={mountRef}></ContainerScene>
  );
};

export default Scene;
