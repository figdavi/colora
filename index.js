let btnElement = document.getElementById('generate-btn');
let colorElements = document.getElementsByClassName('color');
let schemeElements = document.getElementsByClassName('scheme');
let colorCode = document.getElementsByClassName('code');
let header = document.querySelector('header');
let headerArrowImg = document.querySelector('.header-arrow-img');
let tipElement = document.getElementById('tip');
let colorQuantSelect = document.getElementById('color-quant');
let mainElement = document.getElementById('main');
let languageElements = document.getElementsByClassName('language');

let colorQuant = colorQuantSelect.value;

let hueArray = new Array(colorQuant);
let saturationArray = new Array(colorQuant);
let lightnessArray = new Array(colorQuant);

let hexCode = new Array(colorQuant);
let colorCodeP = new Array(colorQuant);

let genCount = 0;
let spaceCount = 0;
let tipShown = 0;

document.querySelector('body').onload = genPalette;

//Language Display

function switchLanguage(number) {
  switch(number) {
    case 1: // English
      document.getElementById('default').innerText = 'Default';
      document.getElementById('mono').innerText = 'Monochromatic';
      document.getElementById('analogous').innerText = 'Analogous';
      document.getElementById('generate-btn').innerText = 'Generate Palette';
      document.querySelector('#tip p').innerText = 'Press \'Spacebar\' to generate';
      break;
  
    case 2: // Português
      document.getElementById('default').innerText = 'Padrão';
      document.getElementById('mono').innerText = 'Monocromático';
      document.getElementById('analogous').innerText = 'Análogo';
      document.getElementById('generate-btn').innerText = 'Gerar Paleta';
      document.querySelector('#tip p').innerText = 'Pressione \'Espaço\' para gerar';
      break;
  }
}

//Set Quantity of Colors in the palette

function setColorQuant() {
  colorQuant = colorQuantSelect.value;
  mainElement.innerHTML = '';
  for(let i = 0; i < colorQuant; i++) {
    mainElement.innerHTML += `<div class = "color">
    <p class = "code"></p>
  </div>`;
  }
  mainElement.style.gridTemplateColumns = `repeat(${colorQuant}, 1fr)`;
  genPalette();
}

//Select Function

let scheme = 1;

function select(element, number) {
  if(element[number-1].classList.contains('selected')) {
    return;
  }
  currentElement = element[number-1];

  for(let i = 0; i < element.length; i++) {
      element[i].classList.remove('selected');
  }
  element[number-1].classList.add('selected');

  if(element === schemeElements) {
    scheme = number;
  }
}

//Generation Functions

function genPalette() {
  genCount++;
  switch(scheme) {
    case 1:
      genDefault();
      break;

    case 2: 
      genMono(); 
      break; 

    case 3:
      genAnalogous();
      break;

    case 4:
      break;

    case 5:
      break;
  }
  for(i = 0; i < colorQuant; i++) {
    colorElements[i].style.backgroundColor = `hsl(${hueArray[i]} ${saturationArray[i]}% ${lightnessArray[i]}%)`

    hexCode[i] = hslToHex(hueArray[i] ,saturationArray[i], lightnessArray[i]);
 
    colorCode[i].innerHTML = hexCode[i];
    if(lightnessArray[i] > 60 || 
      (saturationArray[i] > 70 && lightnessArray[i] > 55) ||
      (saturationArray[i] > 85 && saturationArray[i] < 92 && lightnessArray[i] > 40)){
      colorCode[i].style.color = "var(--blacker)";
      colorCodeP[i] = 0;
    } else {
      colorCode[i].style.color = "var(--white)";
      colorCodeP[i] = 1;
    }
  }
  if(genCount > 4 && tipShown === 0 && !navigator.userAgentData.mobile) {
    tipElement.classList.remove('off');
    tipElement.classList.add('on');
  }
}


function genDefault() {
  for (let i = 0; i < colorQuant; i++) {
    hueArray[i] = randomBetween(0, 360)
    saturationArray[i] = randomBetween(0, 100);
    lightnessArray[i] = randomBetween(0, 100);
  }
}

function genMono() {
  hueArray[0] = Math.random() * 360;
  saturationArray[0] = randomBetween(0, 100);
  let j = colorQuant-1;

  for(let i = 0; i < colorQuant; i++) {
    let hueDivision = 100/colorQuant;
    let min = hueDivision * i + 7;
    let max = hueDivision * (i + 1)

    min = (i === 0) ? min + 3 : min;
    max = (i === colorQuant-1) ? max - 10 : max;


    hueArray[j] = hueArray[0];
    saturationArray[j] = saturationArray[0];
    lightnessArray[j] = randomBetween(min, max);

    j--;
  }
}

function genAnalogous() {
  randomHue = Math.random() * 360;
  const degreeAdd = 30; //In the color wheel, the variation for each color will be of 30 degrees
  let curDegrees = degreeAdd;

  saturationArray[0] = randomBetween(40, 70);  
  lightnessArray[0] = randomBetween(30, 70);

  for(let i = 0; i < colorQuant; i++) {
    if(randomHue < 0) {
      randomHue = 360 - randomHue;
    }

    hueArray[i] = randomHue;
    randomHue += curDegrees;
    curDegrees = (curDegrees + degreeAdd) * (-1);

    lightnessArray[i] = lightnessArray[0] + randomBetween(-10, 10);
    saturationArray[i] = saturationArray[0] + randomBetween(-10, 10);
  }
  sort(hueArray);
}

//Other Button Functions

function toggleHeader(){
  if(header.classList.contains('on')) {
    header.classList.remove('on');
    header.classList.add('off');
    headerArrowImg.src = 'images/arrowDown.svg';
  } else {
    header.classList.remove('off');
    header.classList.add('on');
    headerArrowImg.src = 'images/arrowUp.svg';
  }
}

document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    genPalette();
    if(tipElement.classList.contains('on') && spaceCount > 0){
      tipElement.classList.remove('on');
      tipElement.classList.add('off');
      tipShown = 1;
    }
    genCount++; 
    spaceCount++;
  }
});

function closeTip() {
  tipElement.classList.remove('on');
  tipElement.classList.add('off');
  tipShown = 1;
}

//Useful Functions

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function sort(inputArr) {
  let n = inputArr.length;
  for (let i = 1; i < n; i++) {
    let current = inputArr[i];
    let j = i-1; 
    while ((j > -1) && (current < inputArr[j])) {
      inputArr[j+1] = inputArr[j];
      j--;
    }
    inputArr[j+1] = current;
  }
  return inputArr;
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}