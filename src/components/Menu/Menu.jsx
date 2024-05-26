import "./Style.css";
import {
  motores,
  camaras,
  helices,
  animationMotor,
  animationCamara,
  animationHelice,
} from "../utils/data";
import {
  animacionCamaraMovil,
  animacionHelicesMovil,
  gsapAnimation,
  removerModelo,
  valorInicial,
  valorInicialMovil,
} from "../Scene/Script";
import { isMobile } from "react-device-detect";
import { useState } from "react";

const Menu = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);
  console.log(isMobileDevice);

  const handleCamaraClick = () => {
    const targetPosition = animationCamara.camaras.target;
    const cameraPosition = animationCamara.camaras.camara;
    const zoom = animationCamara.camaras.zoom;

    gsapAnimation(targetPosition, cameraPosition, zoom);
  };

  const handleCamaraClickMovil = () => {
    animacionCamaraMovil(isMobileDevice);
  };

  const handleHelicesClick = () => {
    const targetPosition = animationHelice.helices.target;
    const cameraPosition = animationHelice.helices.camara;
    const zoom = animationHelice.helices.zoom;

    gsapAnimation(targetPosition, cameraPosition, zoom);
  };

  const handleHelicesClickMovil = () => {
    animacionHelicesMovil(isMobileDevice);
  };
  return (
    <div className="MenuContainer">
      <div className="MenuWrapper">
        <div className="MenuOptions">
          <h1>Drone Customizable</h1>
          <ul className="MenuOptionsList">
            <li>
              <label htmlFor="motor">Seleccion de Motores</label>
              <select
                onClick={() => {
                  gsapAnimation(
                    animationMotor.motores.target,
                    animationMotor.motores.camara,
                    animationMotor.motores.zoom
                  );
                }}
                onChange={(e) => {
                  const motor = motores.find(
                    (motor) => motor.name === e.target.value
                  );
                  removerModelo(motor.rute, motor.group);
                }}
                className="motor"
              >
                {motores.map((i, index) => (
                  <option key={index} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="camara">Seleccion de Camara</label>
              <select
                onClick={() => {
                  isMobile ? handleCamaraClickMovil() : handleCamaraClick();
                }}
                onChange={(e) => {
                  const camara = camaras.find(
                    (camara) => camara.name === e.target.value
                  );
                  removerModelo(camara.rute, camara.group);
                }}
                className="camara"
              >
                {camaras.map((i, index) => (
                  <option key={index} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="helices">Seleccion de Helices</label>
              <select
                onClick={() =>
                  {isMobile ? handleHelicesClickMovil() : handleHelicesClick()}
                }
                onChange={(e) => {
                  const helice = helices.find(
                    (helice) => helice.name === e.target.value
                  );
                  removerModelo(helice.rute, helice.group);
                }}
                className="helices"
              >
                {helices.map((i, index) => (
                  <option key={index} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
        </div>
        <div className="VistaGeneral">
          {isMobile ? (
            <button onClick={() => valorInicialMovil(isMobileDevice)}>
              Vista Inicial
            </button>
          ) : (
            <button onClick={() => valorInicial()}>Vista Inicial</button>
          )}
        </div>
      </div>
      <footer>
        <small>
          Base del model 3D por John Script modificaciones |{" "}
          <b>Lenin Mendoza</b>
        </small>
      </footer>
    </div>
  );
};

export default Menu;
