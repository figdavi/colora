// Constants and Objects
const COLOR_QUANT = 5;
const isOnMobile = detectMobile();
function detectMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||window.opera);
  return check;
}


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
const menuArrow = document.querySelector('.menu-arrow');


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
    if(counters.space > 0 && !isOnMobile) {
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
            if(window.innerWidth > 550) {
              colorCodeElement.innerHTML = textToCopy;
            } else {
              colorCodeElement.innerHTML = '';
            }
          }, "1200");
        } else {
          colorCodeElement.classList.remove('copied');
          if(window.innerWidth > 550) {
            colorCodeElement.innerHTML = textToCopy;
          } else {
            colorCodeElement.innerHTML = '';
          }
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
  tipElement.classList.toggle('on', counters.gen > 4 && counters.tipShown === 0 && !isOnMobile);

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
    contrastColor(hexCode[i], colorCodes[i]);
    

    if(window.innerWidth > 550) {
      
      colorCodes[i].textContent = hexCode[i]
    }
    
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