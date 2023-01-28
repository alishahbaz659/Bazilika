import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, useCallback, useEffect, ChangeEvent, Fragment } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import './App.css';
import Credits from "./components/Credits";
import Camera from "./components/Camera";
import Home from './components/Home';
import BottomLink from "./components/BottomLink";

const Hello = () => {

  const navigate = useNavigate();


  const [deviceId, setDeviceId] = useState<null | string>(null);
  const [devices, setDevices] = useState([]);

  const handleDevices = useCallback(
    mediaDevices =>
      setDevices(
        mediaDevices.filter(
          (info: MediaDeviceInfo) => info.kind === "videoinput"
        )
      ),
    [setDevices]
  );

  useEffect(() => {
    let ignore = false;
    const fn = async () => {
      try {
        const foundDevices = await navigator.mediaDevices.enumerateDevices();
        if (!ignore) handleDevices(foundDevices);
      } catch (e) {
        // continue regardless of error
      }
    };

    fn();

    return () => {
      ignore = true;
    };
  }, [handleDevices]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setDeviceId(e.target.value);
  };


  if (deviceId) {

    return navigate('./camera',{
      state:{
        id: deviceId
      }
    });
  }

  return (
    <div className="cameraChoosecontainer">
      <div className="cameraChoose">
        <select onChange={onChange} value="">
          <option value="">
            Select a camera
          </option>
          {devices.map((device: MediaDeviceInfo) => (
            <option value={device.deviceId} key={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>

      </div>
      {/* <BottomLink to="/credits">Terms & Conditons</BottomLink> */}
    </div>
  );
};


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element= {<Hello />} />
        <Route path="/home" element={<Home />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="home/camera" element={<Camera />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </Router>
  );
}
