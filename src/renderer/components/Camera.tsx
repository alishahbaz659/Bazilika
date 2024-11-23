import React, { useState, useRef, useCallback,useEffect } from "react";
import Webcam from "react-webcam";
import { Link, useLocation  } from "react-router-dom"

import Swal from "sweetalert2";
import 'react-image-picker/dist/index.css';
import overlayDesign1 from "../BackgroundImages/overlayDesign1.png";
import overlayDesign2 from "../BackgroundImages/overlayDesign2.png";
import overlayDesign3 from "../BackgroundImages/overlayDesign3.png";
import BazilikaLogo from "../BackgroundImages/Bazilikalogo.png"
import cameraIcon from "../BackgroundImages/Camera-icon.png"

/* ES6 */
import * as htmlToImage from 'html-to-image';
// const express = require('express')
// const serveStatic = require('serve-static')

import ReactCountryFlag from "react-country-flag"
import bg1 from "../BackgroundImages/bg1.svg";
import bg2 from "../BackgroundImages/bg2.svg";
import bg3 from "../BackgroundImages/bg3.svg";
import bg4 from "../BackgroundImages/bg4.svg";
import './Camera.css';
// import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import screenSaver from "../BackgroundImages/screensaver.svg";
const { ipcRenderer } = window.electron;




require("react-bootstrap/ModalHeader")

// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

let imageList = [
  {
    id: "1",
    name: bg1,
  },

  {
    id: "2",
    name: bg2,
  },

  {
    id: "3",
    name: bg3,
  },
];

let countriesList = [
  { id: "1", countryCode: "al", title: "Albania" },
  { id: "2", countryCode: "am", title: "Armenia" },
  { id: "3", countryCode: "ba", title: "Bosnia" },
  { id: "4", countryCode: "bg", title: "Bulgaria" },
  { id: "5", countryCode: "hr", title: "Croatia" },
  { id: "6", countryCode: "cz", title: "Czech Republic" },
  { id: "7", countryCode: "dk", title: "Denmark" },
  { id: "8", countryCode: "ee", title: "Estonia" },
  { id: "9", countryCode: "fi", title: "Finland" },
  { id: "10", countryCode: "fr", title: "France" },
  { id: "11", countryCode: "de", title: "Germany" },
  { id: "12", countryCode: "gr", title: "Greece" },
  { id: "13", countryCode: "hu", title: "Hungary" },
  { id: "14", countryCode: "is", title: "Iceland" },
  { id: "15", countryCode: "ie", title: "Ireland" },
  { id: "16", countryCode: "il", title: "Israel" },
  { id: "17", countryCode: "it", title: "Italy" },
  { id: "18", countryCode: "jp", title: "Japan" },
  { id: "19", countryCode: "kp", title: "Korea" },
  { id: "20", countryCode: "lv", title: "Latvia" },
  { id: "21", countryCode: "lt", title: "Lithuania" },
  { id: "22", countryCode: "lu", title: "Luxembourg" },
  { id: "23", countryCode: "mk", title: "Macedonia" },
  { id: "24", countryCode: "mt", title: "Malta" },
  { id: "25", countryCode: "no", title: "Norway" },
  { id: "26", countryCode: "pl", title: "Poland" },
  { id: "27", countryCode: "pt", title: "Portugal" },
  { id: "28", countryCode: "ro", title: "Romania" },
  { id: "29", countryCode: "ru", title: "Russia" },
  { id: "30", countryCode: "rs", title: "Serbia" },
  { id: "31", countryCode: "sk", title: "Slovakia" },
  { id: "32", countryCode: "si", title: "Slovenia" }, 
  { id: "33", countryCode: "es", title: "Spain" },
  { id: "34", countryCode: "se", title: "Sweden" },
  { id: "35", countryCode: "th", title: "Thailand" },
  { id: "36", countryCode: "tr", title: "Turkey" },
  { id: "37", countryCode: "ua", title: "Ukraine" },
  { id: "38", countryCode: "vn", title: "Vietnam" },
  { id: "39", countryCode: "us", title: "America" },
  { id: "40", countryCode: "au", title: "Australia" },
  { id: "41", countryCode: "br", title: "Brazil" },
  { id: "42", countryCode: "ca", title: "Canada" },
  { id: "43", countryCode: "cn", title: "China" },
  { id: "44", countryCode: "in", title: "India" },
  { id: "45", countryCode: "mx", title: "Mexico" },
  { id: "46", countryCode: "nl", title: "Netherlands" },
  { id: "47", countryCode: "nz", title: "New Zealand" },
  { id: "48", countryCode: "za", title: "South Africa" },
  { id: "49", countryCode: "ch", title: "Switzerland" },
  { id: "50", countryCode: "gb", title: "United Kingdom" },
  { id: "51", countryCode: "ge", title: "Georgia" },
  { id: "52", countryCode: "kz", title: "Kazakhstan" },
  { id: "53", countryCode: "ps", title: "Palestine" },
  { id: "54", countryCode: "ir", title: "Iran" },
];


const defaultCount = 6;
const intervalGap = 1000;
const SCREENSHOT_EXT = "png";


export default function Camera(props) {


  const location = useLocation();
  const deviceId  = location.state.id;
  const webcamRef = useRef(null);
  const [mirrored, setMirrored] = useState(true);
  const [timerCount, setTimerCount] = useState(defaultCount);
  const [showTimer, setTimerText] = useState(false);
  const [agree, setAgree] = useState(false);
  const ref = useRef(null);
  const [images,setImages] =useState(null);
  const [active,setActive]=useState(null);
  const [source,setSource] = useState(overlayDesign1);
  const [activeLang,setActiveLang]=useState(null);
  const [sourceLang,setSourceLang] = useState("");
  const [picture, setPicture] = useState('');
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();
  const [screenSaverStatus,setScreenSaverStatus] = useState(true);
  const [nonMirroredCapture, setNonMirroredCapture] = useState(false);


  let timer = null;

  useEffect(() => {
    timer = idleTimer();
    return () => clearInterval(timer);
  }, []);

  function idleTimer(){
    setInterval(goBackToIdle, 300000);
  }

  function goBackToIdle(){
    setPicture("");
    setSourceLang("");
    setSource(overlayDesign1);
    setScreenSaverStatus(true);
    updateUI();
    window.electron.ipcRenderer.send("language-changed", "");
    console.log("Going back to idle screen");
  }


  useEffect(()=>{

    document.body.addEventListener("click", (e) => {
      clearInterval(timer);
      console.log("screen clicked");
    });

  },[]);

  const onChange = input => {
    setInput(input);
    console.log("Input changed", input);
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = button => {
    console.log("Button pressed", button);

    /**
    * If you want to handle the shift and caps lock buttons
    */
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const onChangeInput = event => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };


  var consentText="<div class='align-left'>Hozzájárulok, hogy az AVB Rendezvényszervező Kft. (székhely: 1024 Budapest, Margit körút 5. A épület 3.emelet 1.ajtó, cégjegyzék szám: 01-09-971831 adószám: 23569975-2-41) (továbbiakban: Egyesület), mint adatkezelő az általam megadott személyes adataimat jelen tájékoztatóban foglaltaknak megfelelően kezelje. <br><br> Az Adatkezelő és az esetlegesen általa igénybe vett adatfeldolgozók a megadott személyes adatokat az AVB Selfie Ponttal összefüggésben, a készülék használatának időtartama alatt kizárólag a résztvevő regisztrációja céljából kezeli, illetve dolgozza fel. A kezelt személyes adatok az e-mail kiküldését követően törlésre kerülnek. <br><br> Adatkezelés jogalapja: <br><br> Az Európai Parlament és a Tanács (EU) 2016/679 számú a természetes személyeknek a személyes adatok kezelése tekintetében történő védelméről és az ilyen adatok szabad áramlásáról, valamint a 95/46/ EK rendelet hatályon kívül helyezéséről (továbbiakban: GDPR, általános adatvédelmi rendelet) rendelet 6. cikk (1) bekezdés a) pontja szerinti érintett hozzájárulás személyes adatok meghatározott céljából történő kezeléséhez."
  var consentText2="I agree that AVB Rendezvényszervező Kft. (registered office: 1024 Budapest, Margit körút 5. Building A, 3rd floor, 1st door, company registration number: 01-09-971831, tax number: 23569975-2-41) (hereinafter referred to as the Association), as the data controller, may use my personal data provided by me in accordance with this notice. <br><br> The Data Controller and any data processors it may use will process the personal data provided in connection with the AVB Selfie Point for the sole purpose of the participant's registration during the period of use of the device. The processed personal data will be deleted after the e-mail is sent. <br><br> Legal basis for processing: <br><br> The REGULATION (EU) 2016/679 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation) and Article 6(1)(a) of the REGULATION (EU) 2016/679 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (GDPR), which enshrines the consent to the processing of personal data for specified purposes.<br><br> </div>"
  const checkboxHandler = () => {
    if (ref.current.checked) {
      // console.log('✅ Checkbox is checked');
      (async () => {
        const { value: accept } = await Swal.fire({
          title: 'Hozzájáruló nyilatkozat',
          html:consentText+consentText2,
          confirmButtonText:
          'Continue <i class="fa fa-arrow-right"></i>'
        })

        // if (accept) {
        //   Swal.fire('You agreed with T&C :)')
        // }

      })()
    } else {
      // console.log('⛔️ Checkbox is NOT checked');
    }
  }


  const saveAs = (blob, fileName) =>{
    var elem = window.document.createElement('a');
    elem.href = blob
    elem.download = fileName;
    elem.style = 'display:none;';
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === 'function') {
      elem.click();
    } else {
      elem.target = '_blank';
      elem.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
    URL.revokeObjectURL(elem.href);
    elem.remove()
  }

  // UseEffect to handle mirroring toggle when preparing for capture
  useEffect(() => {
    if (nonMirroredCapture) {
      // Disable mirroring
      setMirrored(false);

      // Wait for mirroring to be set and then take the screenshot
      const timeout = setTimeout(() => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          setPicture(imageSrc);

          // Restore mirroring after capture
          setMirrored(true);
          setNonMirroredCapture(false); // Reset the capture state
        }
      }, 100); // A slight delay to ensure the DOM updates

      // Cleanup timeout
      return () => clearTimeout(timeout);
    }
  }, [nonMirroredCapture]);

  const captureScreenshot = useCallback(() => {

    // Set non-mirrored capture to true
    setNonMirroredCapture(true);

  }, [webcamRef,setPicture]);



  function mailSentToast(){
    Swal.fire({
      icon: 'success',
      title: 'Mail sent Successfully',
      showConfirmButton: true,
      timer: 3000
    })
    setScreenSaverStatus(true);
    setPicture("");
    setSourceLang("");
    setSource(overlayDesign1);
    setScreenSaverStatus(true);
    updateUI();
    window.electron.ipcRenderer.send("language-changed", "");

  }

  const toggleMirroring = useCallback(() => {
    if (webcamRef.current) setMirrored(val => !val);
  }, [webcamRef]);

  const startTimerWrapper = useCallback((func)=>{
    let timeInterval: NodeJS.Timer;
    return () => {
      if(ref.current.checked){
        if(timeInterval) {
          clearInterval(timeInterval)
        }
        setTimerCount(defaultCount)
        timeInterval = setInterval(() => {
          func(timeInterval)
        }, intervalGap)
      }else{
        Swal.fire({
          icon: 'warning',
          title: 'Please agree to terms & conditions',
        })
        return
      }


    }
  }, []);


  function startCapturing(){

    if(ref.current.checked){
      Swal.fire({
        title: 'Step Back!',
        html: 'Count down about to begin...',
        timer: 2500,
        allowOutsideClick:false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        },

      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          start_capture_timer();
        }
      })
    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Please agree to terms & conditions',
      })
      return
    }



  }

  const start_capture_timer = useCallback(startTimerWrapper((intervalfn: NodeJS.Timeout) => {

    setTimerCount((val) => {
      setTimerText(!showTimer)
      if(val === 0 ) {
        clearInterval(intervalfn);
        captureScreenshot();

        setTimerText(showTimer)
        return val
      }
      return val - 1
    })
  }), []);

  const webcamProps = {
    mirrored:mirrored,
    audio: false,
    forceScreenshotSourceSize: true,
    screenshotQuality: 1,
    ref: webcamRef,
    screenshotFormat: `image/${SCREENSHOT_EXT}`,
    width: "100%",
    height: "200vh",
    videoConstraints: {
      width: 1920,
      height: 1080,
      deviceId
    }
  };

  const webcamPropsIdle = {
    mirrored:mirrored,
    audio: false,
    forceScreenshotSourceSize: true,
    screenshotQuality: 1,
    ref: webcamRef,
    screenshotFormat: `image/${SCREENSHOT_EXT}`,
    width: "100%",
    height: "270vh",
    videoConstraints: {
      width: 1920,
      height: 1080,
      deviceId
    }
  };

  function selected(id) {


    // console.log(id)
    // console.log(document.getElementsByClassName("overlayImage")[0]);
    // console.log(e.currentTarget.id);
    if(id == "1"){
      setSource(overlayDesign1);
    }else if(id=="2"){
      setSource(overlayDesign3);
    }else if(id=="3"){
      setSource(overlayDesign2);
    }else if(id=="4"){
      setSource(overlayDesign1);
    }else{
      setSource("");
    }

    // let target = e.currentTarget;
    // target.classList.toggle('selected')
    // console.log(target);
  }

  
  function selectedLanguage(countryCode) {
    let languageText = "";

    switch (countryCode) {
      case "al":
        languageText = "GËZUAR KRISHTLINDJET NGA BUDAPESTI!";
        break;
      case "am":
        languageText = "ՇՆՈՐՀԱՎՈՐ Սուրբ Ծնունդ ԲՈՒԴԱՊԵՇՏԻՑ:";
        break;
      case "ba":
        languageText = "SRETAN BOŽIĆ IZ BUDIMPEŠTA!";
        break;
      case "bg":
        languageText = "ЧЕСТИТА КОЛЕДА ОТ БУДАПЕЩА!";
        break;
      case "hr":
        languageText = "SRETAN BOŽIĆ IZ BUDIMPEŠTE!";
        break;
      case "cz":
        languageText = "VESELÉ VÁNOCE Z BUDAPEŠTĚ!";
        break;
      case "dk":
        languageText = "GLÆDELIG JUL FRA BUDAPEST!";
        break;
      case "ee":
        languageText = "HÄID JÕULE BUDAPESTIST!";
        break;
      case "fi":
        languageText = "HYVÄÄ JOULUA BUDAPESTISTA!";
        break;
      case "fr":
        languageText = "JOYEUX NOËL DEPUIS BUDAPEST!";
        break;
      case "de":
        languageText = "FROHE WEIHNACHTEN AUS BUDAPEST!";
        break;
      case "gr":
        languageText = "ΚΑΛΑ ΧΡΙΣΤΟΥΓΕΝΝΑ ΑΠΟ ΒΟΥΔΑΠΕΣΤΗ!";
        break;
      case "hu":
        languageText = "BOLDOG KARÁCSONYT BUDAPESTRŐL!";
        break;
      case "ie":
      case "is":
        languageText = "NOLLAG Shona ó Bhúdaipeist!";
        break;
      case "il":
        languageText = "חג שמח מבודפשט!";
        break;
      case "it":
        languageText = "BUON NATALE DA BUDAPEST!";
        break;
      case "jp":
        languageText = "ブダペストからメリークリスマス！";
        break;
      case "kp":
        languageText = "부다페스트에서 온 메리 크리스마스!";
        break;
      case "lv":
        languageText = "LĪCUS ZIEMASSVĒTKUS NO BUDAPESTES!";
        break;
      case "lt":
        languageText = "KALĖDŲ IŠ BUDAPESTO!";
        break;
      case "lu":
        languageText = "SCHÉI SCHÉI KRËSCHDEG VUN BUDAPEST!";
        break;
      case "mk":
        languageText = "СРЕЌЕН БОЖИЌ ОД БУДИМПЕШТА!";
        break;
      case "mt":
        languageText = "IL-MILIED IT-TIENI MINN BUDAPEST!";
        break;
      case "no":
        languageText = "GOD JUL FRA BUDAPEST!";
        break;
      case "pl":
        languageText = "WESOŁYCH ŚWIĄT OD BUDAPESZTU!";
        break;
      case "pt":
        languageText = "FELIZ NATAL DE BUDAPESTE!";
        break;
      case "ro":
        languageText = "CRACIUN FERICIT DE LA BUDAPEST!";
        break;
      case "ru":
        languageText = "С РОЖДЕСТВОМ ИЗ БУДАПЕШТА!";
        break;
      case "gb sct":
        languageText = "Nollaig Chridheil bho BUDAPEST!";
        break;
      case "rs":
        languageText = "СРЕЋАН БОЖИЋ ИЗ БУДИМПЕШТА!";
        break;
      case "sk":
        languageText = "VESELÉ VIANOCE Z BUDAPEŠTI!";
        break;
      case "si":
        languageText = "VESEL BOŽIČ IZ BUDIMPEŠTE!";
        break;
      case "es":
        languageText = "¡FELIZ NAVIDAD DESDE BUDAPEST!";
        break;
      case "se":
        languageText = "GOD JUL FRÅN BUDAPEST!";
        break;
      case "th":
        languageText = "สุขสันต์วันคริสต์มาสจากบูดาเปสต์!";
        break;
      case "tr":
        languageText = "BUDAPEŞTE'DEN MUTLU NOELLER!";
        break;
      case "ua":
        languageText = "З РІЗДВОМ БУДАПЕШТУ!";
        break;
      case "vn":
        languageText = "MERRY CHRISTMAS TỪ BUDAPEST!";
        break;
      case "us":
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
      case "au":
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
      case "br":
        languageText = "FELIZ NATAL DE BUDAPESTE!";
        break;
      case "ca":
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
      case "cn":
        languageText = "来自布达佩斯的圣诞快乐！";
        break;
      case "in":
        languageText = "बुडापेस्ट से मैरी क्रिसमस!";
        break;
      case "mx":
        languageText = "¡FELIZ NAVIDAD DESDE BUDAPEST!";
        break;
      case "nl":
        languageText = "VROLIJK KERSTFEEST UIT BOEDAPEST!";
        break;
      case "nz":
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
      case "za":
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
      case "ch":
        languageText = "FROHE WEIHNACHTEN AUS BUDAPEST!";
        break;
      case "gb":
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
      case "ge":
        languageText = "გილოცავთ შობას ბუდაპეშტიდან!";
        break;
      case "kz":
        languageText = "Рождесто мерекесі құтты болсын!";
        break;
      case "ps":
        languageText = "تحيات من بودابست!";
        break;
      case "ir":
        languageText = "کریسمس مبارک، از بوداپست";
        break;
      default:
        languageText = "MERRY CHRISTMAS FROM BUDAPEST!";
        break;
    }

    // Update the language text and send it to the projector screen via IPC
    setSourceLang(languageText);
    window.electron.ipcRenderer.send("language-changed", languageText);
  }
  

  function onPickImages(images) {
    setImages({images})
  }

  const Overlay = () => (
    <div className="overlay">
    <img className="overlayImage" src={source} alt=""/>
    {/* <img className="overlayImage" src={overlayDesign} alt=""/> */}
    </div>
    );

  const OverlayText = () => (
    <div className="textOverlay" style={{margin:"-2.2%"}}>
    <p className="overlayText">{sourceLang}</p>
    </div>
    );

  const OverlayTimer = () => (
    <div className="textOverlayTimer">
    {showTimer && <div className="timerStyle"> {timerCount}</div>}
    </div>
    );


    const fireAlert = () => {

      Swal.fire({
        title: "Confirmation",
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick:false,
        confirmButtonText: "LIKE IT",
        cancelButtonText: "TRY AGAIN",
        icon: 'question'
      }
      ).then((result) => {

        if (result.isConfirmed) {

          var node = document.getElementById('webcamdiv');
          if(node){
            htmlToImage.toPng(node, { quality: 1,canvasWidth:1920,canvasHeight:1080,pixelRatio:1})
            .then(function (dataUrl) {
              // var img = new Image();
              // img.src = dataUrl;
              // saveAs(dataUrl, 'exported-vis.png')

              const imageSrc =dataUrl;

              (async () => {
                const { value: email } = await Swal.fire({
                  title: 'LET US SHARE YOUR SELFIE WITH YOU !',
                  input: 'email',
                  inputPlaceholder: 'Enter your email address',
                  showCancelButton: true,
                  allowOutsideClick:false,
                })

                if (email) {
                  Swal.fire({
                    title: 'Sending...',
                    html: 'Please wait...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 20000,
                    timerProgressBar: true,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.timer) {
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Internet connectivity issue! Please try again',
                      })
                      setPicture("");
                      // setSourceLang("");
                      // setSource(overlayDesign1);
                      // setScreenSaverStatus(true);
                      // updateUI();
                      // console.log('Failed! Internet connectivity issue')
                    }
                  });
                  window.electron.ipcRenderer.sendMessage('ipc-example', [imageSrc,email]);
                  // calling IPC exposed from preload script

                  window.electron.ipcRenderer.once('ipc-example', (arg) => {
                    Swal.hideLoading()
                    Swal.close()
                    mailSentToast();
                    setPicture("");
                    setSourceLang("");
                    setSource(overlayDesign1);
                    setScreenSaverStatus(true);
                    updateUI();
                  });
                }else{
                  setPicture("");
                  // setSourceLang("");
                  // setSource(overlayDesign1);
                  // setScreenSaverStatus(true);
                  // updateUI();
                }

              })()


            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error);
            });
          } else{
            setPicture("");
            // setSourceLang("");
            // setSource(overlayDesign1);

            // setScreenSaverStatus(true);
            // updateUI();
            // Swal.fire(' Cancelled', '', 'error')
          }
          }else if(result.dismiss === Swal.DismissReason.cancel){
            // Reset to live webcam when "Try Again" is clicked
            setPicture("");
            setScreenSaverStatus(false); // Ensure screensaver mode is turned off
          }
      })
    }

    const screenSaverClick = () =>{
      setScreenSaverStatus(false);
      document.body.style.backgroundImage=`url(${null})`;
    }

        function updateUI(){
          // document.body.style.backgroundImage = `url('${screenSaver}')`;
          if(screenSaverStatus){
            document.body.style.width='100vw';
            document.body.style.height='100vh';
            document.body.style.backgroundImage=`url(${screenSaver})`;
            document.body.style.backgroundPosition='center';
            document.body.style.backgroundSize='cover';
            document.body.style.backgroundRepeat='no-repeat';}

          }

          return (
            <>


            {updateUI()}
            { screenSaverStatus ? (
              <div onClick={screenSaverClick} className="screenSaverContainer">
              {/* <h2 className="textStyleScreenSaver">SPECIAL <br></br>SELFIE POINT</h2> */}
              <div onClick={screenSaverClick} ></div>
              <div className="webcamMainContainerScreenSaver" >
              <div className="containerLayover"  >
              <Webcam {...webcamPropsIdle} />
              </div>
              </div>

              {/* <img
              src={cameraIcon}
              style={{width:100,height:95,marginBottom:20}}
              >
              </img>
            <img src={BazilikaLogo} style={{width:200,height:170}}></img> */}

            </div>
            ) : (
              <div className="camContainer">

              <img src={BazilikaLogo} style={{width:220,height:190}}></img>

              <h2 className="textStyle">Take A #SELFIE</h2>

              {picture == '' ? (
                <div className="webcamMainContainer" >
                <div className="containerLayover"  >

                <Webcam {...webcamProps} />
                <OverlayTimer />
                <Overlay />

                <OverlayText />

                </div>
                </div>
                ):(
                  <div className="webcamMainContainer" >

                  <div className="containerLayover"   id="webcamdiv">
                  {/* <Webcam {...webcamProps} /> */}
                  <img style={{width:"370px",height:"220px"}} src={picture} />

                  {source!=null && <Overlay />}
                  <OverlayText />
                  </div>
                  {fireAlert()}
                  </div>
                  )}

                  <h5 className="textStyle">1 - CHOOSE YOUR STYLE</h5>
                  <div className="webcamMainContainer">
                  <div style={{display:"flex",flexDirection:"row"}}>
                  {
                    imageList.map((style,index)=>(
                      <div style={{alignItems: "center",paddingRight:10,opacity: active == index ? 1 : 0.7}}  id={style.id}
                      onClick={()=>{setActive(index);selected(style.id);}}>
                      <img className="overlayDesignStyle"
                      src={style.name}  alt="asd"/>
                      </div>
                      ))
                    }
                    </div>
                    </div>
                    <h5 className="textStyle">2 - SELECT YOUR LANGUAGE</h5>
                    <div className="webcamMainContainer">
                    <div className="parent-wrapper">
                    <div className="parent">
                    {
                      countriesList.map((country,index)=>(
                        <ReactCountryFlag
                        className="child"
                        style={{height:30,width:30,borderRadius:100,padding:5,opacity: activeLang == index ? 1 : 0.7}}
                        countryCode={country.countryCode}
                        svg
                        id={country.id}
                        onClick={()=>{setActiveLang(index);selectedLanguage(country.countryCode);}}
                        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                        cdnSuffix="svg"
                        title={country.title} />
                        ))
                      }

                      </div></div></div>
                      <h5 className="textStyle">3 - TIME TO TAKE A SELFIE</h5>
                      <div className="webcamMainContainer">
                      <div className="parent-wrapper">
                      <div className="parent">
                      <div className="webcamMainContainer">
                      <div className="btnGroup">


                      <img
                      src={cameraIcon}
                      style={{width:100,height:95,marginBottom:20}}
                      onClick={startCapturing}
                      >
                      </img>


                      {/* <button
                      type="button"
                      onClick={toggleMirroring}
                      className="btn"
                      >
                      <FaRegWindowMaximize className="icn" ></FaRegWindowMaximize>
                    </button> */}
                    </div>
                    </div>


                    </div></div></div>

                    <div className="container">
                    <div className="labelStyle">
                    <input type="checkbox" id="agree" defaultChecked={true} ref={ref} onClick={checkboxHandler} />
                    <label> HOZZAJÁRULÓNYILATKOZAT A KÉPMÁS KÉSZITÉSÉHEZ ÉS FELHASZNÁLÁSÄHOZ

                    <br></br>
                    <br></br>
                    I agree to <b>terms and conditions</b></label>
                    {/* <label htmlFor="agree" className="labelStyle"> I agree to <b>terms and conditions</b></label> */}
                    </div>

                    {/* <Link className="link" to="/">Home</Link> */}
                    </div>
                    </div>
                    )}
                    </>
                    );
                  }


                  //   <Keyboard
                  //   keyboardRef={r => (keyboard.current = r)}
                  //   theme= {'hg-theme-default myTheme1'}
                  //   layoutName={layout}
                  //   onChange={onChange}
                  //   onKeyPress={onKeyPress}
                  // />

