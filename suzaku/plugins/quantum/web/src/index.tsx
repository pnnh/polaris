import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import {randomPassword} from './utils/rand'

//import $ from 'jquery'

window.randomString = (length = 16, number = true, letter = true,
  uppercaseLetter = true, symbol = true) => {
  const password = randomPassword(16, {
    number,
    letter,
    uppercaseLetter,
    symbol,
  })
  return password
}

function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}


function blobToBase64(blob:any): Promise<String> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) {
        return "";
      }
      //const base64String = btoa(String.fromCharCode(...new Uint8Array(reader.result as ArrayBuffer)));
      var arrayBuffer = reader.result as ArrayBuffer;
      //const base64String = arrayBuffer.toString("base64")
      const base64String = arrayBufferToBase64(arrayBuffer);
      resolve(base64String);
    }
    reader.readAsArrayBuffer(blob);
  });
}

async function getFontData(fontName: string) {
  const pickedFonts = await window.queryLocalFonts();
  for (const metadata of pickedFonts) {
    console.log("metadata.family: ", metadata.family)
    // 我们只对特定字体感兴趣。
    if (metadata.family !== fontName) {
      continue;
    } 
    const sfnt = await metadata.blob();
    console.log("getFontData: ", fontName, sfnt.size)
    var result = await blobToBase64(sfnt); 
    var stringResult = String(result);
    return stringResult;
  }
  return "xxxxxxx";
}

async function getFontData2(fontName: string) {
  const pickedFonts = await window.queryLocalFonts();
  for (const metadata of pickedFonts) {
    console.log("metadata.family: ", metadata.family)
    // 我们只对特定字体感兴趣。
    if (metadata.family !== fontName) {
      continue;
    } 
    const sfnt = await metadata.blob(); 
    return sfnt;
  }
  return null;
}

window.getFontData = getFontData
window.getFontData2 = getFontData2


async function testFontApi() {

  // 请求使用 API 的权限
  try {
    //const status = await navigator.permissions.request({    name: 'local-fonts',  });
    const status = await navigator.permissions.query({name: "local-fonts"})
    // if (status.state !== 'granted') {
    //   throw new Error('Permission to access local fonts not granted.');
    // }
    const opts = {};
    const pickedFonts = await window.queryLocalFonts();
    for (const fontData of pickedFonts) {
      console.log(fontData.postscriptName);
      console.log(fontData.fullName);
      console.log(fontData.family);
      console.log(fontData.style);
    }
  } catch (err) {
    // `TypeError` 指示 'local-fonts'
    // 权限尚未实现，因此，
    // 只有这不是问题时，才会 `throw`。
    if (err.name !== 'TypeError') {    throw err;  }
  }
}



function MyButton () { 
  return <button onClick={() => {
    // testFontApi().then(()=>{
    //   console.log("jjjj")
    // })
    getFontData('WenQuanYi Micro Hei Light').then((aa)=>{
        console.log('getFontData: ', aa)
    })
  }} title="回到顶部"> 
  点击申请权限
  </button>
}

const goTopElement = document.getElementById('root')
if (goTopElement) {
  //ReactDOM.render(<GoTop/>, goTopElement)
  const root = ReactDOM.createRoot(goTopElement)
  root.render(<MyButton/>)
}

