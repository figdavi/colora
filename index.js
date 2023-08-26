// Constants and Objects
const COLOR_QUANT = 5;

let scheme = 1;
let hexCode = new Array(COLOR_QUANT);

const color = Array.from({ length: COLOR_QUANT }, () => ({
  hue: 0,
  saturation: 0,
  lightness: 0
}));

const counters = JSON.parse(localStorage.getItem('counters')) || {
  space: 0,
  gen: 0,
  tipShown: 0
};

function clearCounters() {
  counters.space = 0;
  counters.gen = 0;
  counters.tipShown = 0;
  localStorage.removeItem('counters');
}


// DOM Elements
const languageElements = document.querySelectorAll('.language');
const languageDropdownImg = document.querySelector('.language-img');
const colorPicker = document.getElementById('color-picker');
const colorPickerText = document.querySelector('#color-picker .text');
const colorPickerInput = document.querySelector('#color-picker input');
const tipElement = document.getElementById('tip');
const colorElements = document.querySelectorAll('.color');
const colorCodes = document.querySelectorAll('.code');
const randomBtn = document.querySelector('.random-btn');
const schemeElements = document.querySelectorAll('.scheme');
const currentSchemeText = document.querySelector('.dropdown-scheme-btn p');
const menuArrow = document.querySelector('.menu-arrow')


// Event Listeners
document.querySelector('body').onload = pickColor;
colorPickerInput.addEventListener('input', pickColor);
randomBtn.onclick = randomColor;

document.addEventListener('click', handleDropdown);
menuArrow.addEventListener('click', handleMenuClick);

window.onkeyup = handleSpacebar;
window.onkeydown = preventSpacebarDefault;

document.querySelector(".close-tip").onclick = closeTip;

schemeElements.forEach((button, index) => {
  button.addEventListener('click', () => {
    handleSchemeSelection(index);
  });
});

languageElements.forEach((button, index) => {
  button.addEventListener('click', () => {
    handleLanguageSelection(index);
  });
});

colorElements.forEach((div, index) => {
  div.addEventListener('click', () => {
    handleCodeCopy(index);
  });
});



//Event Listeners Functions

function pickColor() {
  let colorPickerValue = colorPickerInput.value;
  
  [color[0].hue, color[0].saturation, color[0].lightness] = hexToHSL(colorPickerValue);

  colorPicker.style.backgroundColor = colorPickerValue;

  // contrastColor also returns a value
  let strokeColor = contrastColor(colorPickerValue, colorPickerText);

  document.querySelector('#color-picker svg').setAttribute('stroke', strokeColor);

  genPalette();
}

function randomColor() {
  counters.gen++;
  let randomHue = Math.random() * 360;
  let randomSaturation = randomBetween(40, 90);
  let randomLightness = randomBetween(30, 90);
  colorPickerInput.value = hslToHex(randomHue, randomSaturation, randomLightness);

  pickColor();
}

function handleDropdown(e) {
  let dropDownBtn = e.target.matches('[data-dropdown-btn]');

  if (!dropDownBtn && e.target.closest('[data-dropdown]') != null) {
    return;
  }
  let currentDropdown;
  if (dropDownBtn) {
    currentDropdown = e.target.closest('[data-dropdown]');
    currentDropdown.classList.toggle('active');
  }
  document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
    if (dropdown === currentDropdown) {
      return;
    }
    dropdown.classList.remove('active');
  });
}

function handleMenuClick() {
  if (menu.classList.contains('off')) {
    menuArrow.src = 'images/arrowUp.svg';
  } else {
    menuArrow.src = 'images/arrowDown.svg';
  }
  document.getElementById('menu').classList.toggle('off');
}

function handleSpacebar(e) {
  if (e.code === 'Space') {
    randomColor();
    if(counters.space > 0) {
      tipElement.classList.remove('on');
      counters.tipShown = 1;
    }
    counters.space++;
  }
}

function preventSpacebarDefault(e) {
  if (e.code === 'Space') {
    e.preventDefault();
  }
}

function closeTip() {
  tipElement.classList.remove('on');
  counters.tipShown = 1;
  localStorage.setItem('counters', JSON.stringify(counters));
}

function handleSchemeSelection(index) {
  scheme = index + 1;
  currentSchemeText.textContent = schemeElements[index].textContent;
  select(schemeElements, scheme);
}

function handleLanguageSelection(index) {
  select(languageElements, index + 1);
  switchLanguage(index + 1);
}

function select(element, number) {
  if(element[number-1].classList.contains('selected')) {
    return;
  }
  currentElement = element[number-1];

  for(let i = 0; i < element.length; i++) {
      element[i].classList.remove('selected');
  }
  element[number-1].classList.add('selected');
}

function handleCodeCopy(index) {
  const colorCodeElement = colorCodes[index];
  const colorElement = colorElements[index];
  const textToCopy = hexCode[index];

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard:", textToCopy);
        if (!colorCodeElement.classList.contains('copied')) {
          colorCodeElement.classList.add('copied');
          colorCodeElement.innerHTML = 'Copied!';
          
          setTimeout(() => {
            colorCodeElement.classList.remove('copied');
            colorCodeElement.innerHTML = textToCopy;
          }, "1200");
          
        } else {
          colorCodeElement.classList.remove('copied');
          colorCodeElement.innerHTML = textToCopy;
        }
      })
      .catch((err) => {
        console.error("Unable to copy text to clipboard: ", err);
      });
  } else {
    console.error("Clipboard API is not supported in this browser.");
  }
}

// Language Switch

const languages = {
  1: {
    name: 'Português',
    flagImage: 'images/pt-br.png',
    randomBtnText: 'Paleta Aleatória',
    tipText: 'Pressione \'Espaço\' para gerar',
    pickerText: 'Cor Principal',

    monoText: 'Monocromático',
    analogousText: 'Análogo',
    triadicText: 'Tríade',
    complementaryText: 'Complementar',
    splitComplementaryText: 'Meio Complementar',
    squareText: 'Quadrado',
    tetradicText: 'Tetrádico',
    randomText: 'Aleatório'
  },
  2: {
    name: 'English',
    flagImage: 'images/en.png',
    randomBtnText: 'Random Palette',
    tipText: 'Press \'Spacebar\' to generate',
    pickerText: 'Main Color',

    monoText: 'Monochromatic',
    analogousText: 'Analogous',
    triadicText: 'Triadic',
    complementaryText: 'Complementary',
    splitComplementaryText: 'Split Complementary',
    squareText: 'Square',
    tetradicText: 'Tetradic',
    randomText: 'Random'
  }
};

function switchLanguage(number) {
let selectedLanguage = languages[number];
languageDropdownImg.src = selectedLanguage.flagImage;

randomBtn.textContent = selectedLanguage.randomBtnText;
document.querySelector('#tip p').textContent = selectedLanguage.tipText;
colorPickerText.textContent = selectedLanguage.pickerText,

document.getElementById('mono').textContent = selectedLanguage.monoText;
document.getElementById('analogous').textContent = selectedLanguage.analogousText;
document.getElementById('triadic').textContent = selectedLanguage.triadicText;
document.getElementById('complementary').textContent = selectedLanguage.complementaryText;
document.getElementById('split-complementary').textContent = selectedLanguage.splitComplementaryText;
document.getElementById('square').textContent = selectedLanguage.squareText;
document.getElementById('tetradic').textContent = selectedLanguage.tetradicText;
document.getElementById('random').textContent = selectedLanguage.randomText;

currentSchemeText.textContent = schemeElements[scheme - 1].textContent;
}

// Generation and Schemes Functions

function genPalette() {
 //Add tip
  tipElement.classList.toggle('on', counters.gen > 4 && counters.tipShown === 0 && !navigator.userAgentData.mobile);

  switch(scheme) {
    case 1:
      genMono();
      break;
    case 2: 
      genAnalogous();
      break; 
    case 3:
      genTriadic();
      break;
    case 4:
      genComplementary();
      break;
    case 5:
      genSplitComplementary();
      break;
    case 6:
      genSquare();
      break;
    case 7:
      genTetradic();
      break;
    case 8:
      genRandom();
      break;
  }

  if(scheme > 2 && scheme != 8) {
    genLSValues();
  }

  for(let i = 0; i < COLOR_QUANT; i++) {
    const backgroundColor = `hsl(${color[i].hue} ${color[i].saturation}% ${color[i].lightness}%)`

    colorElements[i].style.backgroundColor = backgroundColor

    hexCode[i] = hslToHex(color[i].hue ,color[i].saturation, color[i].lightness); 

    colorCodes[i].textContent = hexCode[i]
    contrastColor(hexCode[i], colorCodes[i]);
  }

  localStorage.setItem('counters', JSON.stringify(counters));
}

function genMono() {  
  color[1].lightness = randomBetween(75, 93);
  color[2].lightness = randomBetween(50, 75);
  color[3].lightness = randomBetween(25, 50);
  color[4].lightness = randomBetween(7, 25);

  let multiplier = 1;
  for(let i = 1; i < COLOR_QUANT; i++) {
    color[i].saturation = color[0].saturation * multiplier;
    multiplier -= 1/(COLOR_QUANT-1);

    color[i].hue = color[0].hue;
  }
}

function genAnalogous() {
  const offsets = [15, 30, -15, -30];
  const baseHue = color[0].hue;

  for(i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = (offsets[i-1] + baseHue);
    color[i].lightness = randomBetween(40, 80);
    color[i].saturation = color[0].saturation;
  }
}

function genTriadic() { 
  const offsets = [120, 120, -120, -120];
  const baseHue = color[0].hue;

  for(i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = (offsets[i-1] + baseHue);
  }
}

function genComplementary() {
  const offsets = [180, 180, 0, 0];
  const baseHue = color[0].hue;

  for(i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = (offsets[i-1] + baseHue);
  }
}

function genSplitComplementary() {
  const offsets = [-150, -150, 150, 150];
  const baseHue = color[0].hue;

  for(i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = (offsets[i-1] + baseHue);
  }
}

function genSquare() {
  const offsets = [90, 180, 270, 0];
  const baseHue = color[0].hue;

  for(i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = (offsets[i-1] + baseHue);
  }
}

function genTetradic() {
  const offsets = [30, 180, -180, 0];
  const baseHue = color[0].hue;

  for(i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = (offsets[i-1] + baseHue);
  }
}

function genRandom() {
  for (let i = 1; i < COLOR_QUANT; i++) {
    color[i].hue = randomBetween(0, 360);
    color[i].lightness = randomBetween(0, 100);
    color[i].saturation = randomBetween(0, 100);
  }
}

function genLSValues() {
  color[1].lightness = randomBetween(60, 95);
  color[2].lightness = randomBetween(50, 80);
  color[3].lightness = randomBetween(45, 70);
  color[4].lightness = randomBetween(0, 60);

  color[1].saturation = color[0].saturation * (randomBetween(60, 100) / 100);
  color[2].saturation = color[0].saturation * (randomBetween(50, 90) / 100);
  color[3].saturation = color[0].saturation * (randomBetween(60, 100) / 100);
  color[4].saturation = color[0].saturation * (randomBetween(40, 70) / 100);
}




// Useful Functions

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
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

function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;
  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0)
    h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

function contrastColor(hexColor, element){
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);

  // Remove existing classes
  element.classList.remove("black", "white");

  if (((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) > 0.5) {
    element.classList.add("black");
    return 'black';
  } else {
    element.classList.add("white");
    return 'white';
  }
}

/*function setColorQuant() {
  COLOR_QUANT = colorQuantSelect.value;
  mainElement.innerHTML = '';
  for(let i = 0; i < COLOR_QUANT; i++) {
    mainElement.innerHTML += `<div class = "color">
    <p class = "code"></p>
  </div>`;
  }
  mainElement.style.gridTemplateColumns = `repeat(${COLOR_QUANT}, 1fr)`;
  genPalette();
}*/