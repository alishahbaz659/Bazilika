import React, { useState, useCallback, useEffect, ChangeEvent, Fragment } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";

import './Home.css';


const Home = () => {

  const location = useLocation();
  const deviceId  = location.state.id;

  const navigate = useNavigate();
  const [designId, setDesignId] = useState<null | string>(null);

  const DesignOptions = [{
    value: 'designOne',
    text: 'Design 1'
    },
  {
    value: 'designTwo',
    text: 'Design 2'
  },
 ]


  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDesignId(e.target.value);
  };


  if (designId) {
    return navigate('./camera',{
      state:{
        deviceId: deviceId,
        designId: designId
      }
    });
  }


  return (
    <div className="homeContainer">
      <div className="designChoose">
        <select onChange={onChange} value={""}>
          <option value="" disabled>
            Choose your preferred Design
          </option>
          {DesignOptions.map((c) => <option key={c.text} value={c.value} >{c.text}</option>)}
        </select>
      </div>
    </div>
  );
};

export default Home;
