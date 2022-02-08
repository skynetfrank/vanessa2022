import '../css/odograma.css';
import { cloudstorage } from '../js/firebaseconfig';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { dateToAMD, strToDMA } from '../commons/utilities';

const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const nombrePaciente = JSON.parse(localStorage.getItem('nombrePaciente'));
const apellidoPaciente = JSON.parse(localStorage.getItem('apellidoPaciente'));
const mySpinner = document.querySelector('.myspinner-container');
const btnCerrar = document.getElementById('btn-cerrar');
const storageRef = ref(cloudstorage, 'images/' + idPacienteLocal + '.jpg');
const botonera = document.getElementById('botonera-grafica');
const botoneraColores = document.getElementById('botonera-colores');

mySpinner.style.display = 'none';

let fecha = strToDMA(dateToAMD(new Date()));

//SETTING CONSTANTES
const MARCAR_EXTRACCION = 1;
const MARCAR_CARIES = 2;
const MARCAR_AREA = 3;
const MARCAR_FRACTURA = 4;
const LINEA_VERTICAL = 5;
const LINEA_HORIZONTAL = 6;
const DIENTE_AUSENTE = 7;
const MARCAR_BOX_UP = 8;
const MARCAR_BOX_DOWN = 9;
const MARCAR_IMPLANTE = 10;
const MARCAR_LIMPIAR = 12;
const MARCAR_PUENTE_FIJO = 13;
const MARCAR_REMOVIBLE = 14;
const MARCAR_HIPERSENSE = 15;
const MARCAR_APICAL = 16;
const MARCAR_FISTULA = 17;
const MARCAR_EMPAQ_ALIMENTO = 18;
const MARCAR_INFRAOCLUSION = 19;
const MARCAR_PROFUNDIDAD_SONDAJE = 20;
const MARCAR_INSERSION_CLINICA = 21;
const MARCAR_SANGRAMIENTO_SONDAJE = 22;
const MARCAR_MUCOSA_MASTICADORA = 23;
const MARCAR_DEFECTO_MUCOGINGIVAL = 24;
const MARCAR_MOVILIDAD_DENTARIA = 25;
const MARCAR_COMPROMISO_FURCACION = 26;
const MARCAR_PROTESIS_DEFECTUOSA = 27;
const MARCAR_FRENILLO = 28;
const MARCAR_EXTRUSION = 29;
const MARCAR_INCLINACION = 30;
const MARCAR_ROTACION = 31;
const SIN_SELECCION = 0;

// SETTING ALL VARIABLES
var isMouseDown = false;
var isStorage = false; //switche si existe el odograma en firebase storage
var canvas = document.createElement('canvas');
var canvasContainer = document.querySelector('.canvas-container');
var ctx = canvas.getContext('2d');
var currentSize = 3;
var currentColor = 'black';
var currentAction = SIN_SELECCION;
var odograma = new Image();

//Verificar si existe un odograma en storage - sino crear uno nuevo
window.addEventListener('load', () => {
  getDownloadURL(storageRef)
    .then(function (url) {
      odograma.src = url;
      odograma.crossOrigin = 'Anonymous';
      isStorage = true;
    })
    .catch(function (error) {
      if (error.code === 'storage/object-not-found') {
        odograma.src = '../images/8c428cd3be9707b6e77d.jpg';
        odograma.crossOrigin = 'Anonymous';
        isStorage = false;
      }
    });
});

odograma.addEventListener('load', () => {
  createCanvas();
  if (!isStorage) {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Examen Clinico Intraoral - ' + fecha, 15, 20);
    ctx.font = 'bold 14px Arial';
    ctx.fillText('ID: ' + idPacienteLocal, 325, 20);
    ctx.font = 'bold 12px Arial';
    ctx.fillText('fecha: ' + fecha, 425, 450);
    ctx.fillText('Odograma: ' + nombrePaciente + ' ' + apellidoPaciente, 15, 450);
  }
  // document.querySelector('.titulo-odograma > h2').innerHTML += ' ' + nombrePaciente + ' ' + apellidoPaciente;
  document.getElementById('marcador').focus();
});

// CREATE CANVAS

function createCanvas() {
  canvas.id = 'canvas';
  canvas.width = 530;
  canvas.height = 460;
  canvas.style.zIndex = 8;
  canvas.style.position = 'absolute';
  canvas.style.border = '1px solid rgb(121, 113, 113)';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvasContainer.appendChild(canvas);
  if (!isStorage) {
    ctx.drawImage(odograma, 0, 30);
  } else {
    ctx.drawImage(odograma, 0, 0, 530, 460);
  }
}

//boton guardar odograma
document.getElementById('saveToImage').addEventListener('click', function () {
  guardarStorage(this, canvas, idPacienteLocal + '.jpg');
});

//Upload a firebase storage
function guardarStorage(link, canvas, filename) {
  link.href = canvas.toDataURL('image/jpeg', 1.0);
  mySpinner.style.display = 'flex';

  const uploadTask = uploadString(storageRef, link.href.substring(23), 'base64', {
    contentType: 'image/jpg',
  })
    .then(result => {
      setTimeout(() => {
        mySpinner.style.display = 'none';
      }, 1000);
    })
    .catch(error => {
      mySpinner.style.display = 'none';
      alert('Ocurrio un error al guardar..');
    });
}

// BUTTON COLORES EVENT HANDLERS

botoneraColores.addEventListener('click', e => {
  e.preventDefault();
  let botonColor = e.target.id;

  switch (botonColor) {
    case 'btncolor-negro':
      currentColor = 'rgba(0, 0, 0, 0.9)';
      document.getElementById('color-actual').style.backgroundColor = currentColor;
      break;
    case 'btncolor-azul':
      currentColor = 'rgba(0, 0, 255, 0.9)';
      document.getElementById('color-actual').style.backgroundColor = currentColor;
      break;
    case 'btncolor-naranja':
      currentColor = '#e68106';
      document.getElementById('color-actual').style.backgroundColor = currentColor;
      break;
    case 'btncolor-rojo':
      currentColor = '#FF0000';
      document.getElementById('color-actual').style.backgroundColor = currentColor;
      break;
    case 'btncolor-verde':
      currentColor = '#008800';
      document.getElementById('color-actual').style.backgroundColor = currentColor;
      break;
    case '  ':
      break;
    default:
      console.log('default switch');
  }
});

botonera.addEventListener('click', e => {
  e.preventDefault();
  let boton = e.target.id;
  console.log('target', e.target.id);
  switch (boton) {
    case 'download':
      const link = document.getElementById('downloadToImage');
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      const filename = idPacienteLocal + '.jpg';
      link.download = filename;
      link.click();
      console.log('link', link);
      console.log('link.href', link.href);
      console.log('filename', filename);
      break;
    case 'caries':
      currentAction = MARCAR_CARIES;
      break;
    case 'marcador':
      currentAction = MARCAR_AREA;
      break;
    case 'extraccion':
      currentAction = MARCAR_EXTRACCION;
      break;
    case 'ausente':
      currentAction = DIENTE_AUSENTE;
      break;
    case 'lineaH':
      currentAction = LINEA_HORIZONTAL;
      break;
    case 'lineaV':
      currentAction = LINEA_VERTICAL;
      break;
    case 'implante':
      currentAction = MARCAR_IMPLANTE;
      break;
    case 'clear':
      //todo: verificar que no se borre data anterior ver metodo
      //createCanvas();
      break;
    case 'puenteFijo':
      currentAction = MARCAR_PUENTE_FIJO;
      break;
    case 'removible':
      currentAction = MARCAR_REMOVIBLE;
      break;
    case 'hipersense':
      currentAction = MARCAR_HIPERSENSE;
      break;
    case 'apical':
      currentAction = MARCAR_APICAL;
      break;
    case 'fistula':
      currentAction = MARCAR_FISTULA;
      break;
    case 'empaq-alimento':
      currentAction = MARCAR_EMPAQ_ALIMENTO;
      break;
    case 'infraoclusion':
      currentAction = MARCAR_INFRAOCLUSION;
      break;
    case 'profundidad-sondaje':
      currentAction = MARCAR_PROFUNDIDAD_SONDAJE;
      break;
    case 'nivel-insersion':
      currentAction = MARCAR_INSERSION_CLINICA;
      break;
    case 'sangramiento-sondaje':
      currentAction = MARCAR_SANGRAMIENTO_SONDAJE;
      break;
    case 'mucosa-masticadora':
      currentAction = MARCAR_MUCOSA_MASTICADORA;
      break;
    case 'defecto-mucogingival':
      currentAction = MARCAR_DEFECTO_MUCOGINGIVAL;
      break;
    case 'movilidad-dentaria':
      currentAction = MARCAR_MOVILIDAD_DENTARIA;
      break;
    case 'compromiso-furcacion':
      currentAction = MARCAR_COMPROMISO_FURCACION;
      break;
    case 'protesis-defectuosa':
      currentAction = MARCAR_PROTESIS_DEFECTUOSA;
      break;
    case 'frenillo':
      currentAction = MARCAR_FRENILLO;
      break;
    case 'extrusion':
      currentAction = MARCAR_EXTRUSION;
      break;
    case 'inclinacion':
      currentAction = MARCAR_INCLINACION;
      break;
    case 'rotacion':
      currentAction = MARCAR_ROTACION;
      break;
    default:
      console.log('default switch');
  }
  btnActivo(boton);
});

//AQUI ESTA LA ACCION PRINCIPAL DE DIBUJAR AL LEVANTER EL MOUSE
canvas.addEventListener('mousedown', function (e) {
  mousedown(canvas, e);
});

canvas.addEventListener('mousemove', function (e) {
  mousemove(canvas, e);
});

canvas.addEventListener('mouseup', mouseup);

// GET MOUSE POSITION
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function calibrarY(y) {
  if (y >= 215 && y <= 380) {
    let newy = 295;
    return newy;
  }
  if (y >= 0 && y <= 236) {
    let newy = 110;
    return newy;
  }
  return y;
}

function esDibujable(posx, posy) {
  if (posx < 5 || posx >= 515) {
    return false;
  }
  if (posy < 20 || posy >= 380) {
    return false;
  }

  if (posy >= 195 && posy <= 215) {
    return false;
  }
  return true;
}

// ON MOUSE DOWN DIBUJA UNA LINEA POLIGONAL MIENTRAS SE TENGA EL MOUSE PRESIONADO

function mousedown(canvas, evt) {
  if (currentAction === SIN_SELECCION) {
    alert('No has seleccionado ningun comando');
    return;
  }
  isMouseDown = true;
  var currentPosition = getMousePos(canvas, evt);
  ctx.moveTo(currentPosition.x, currentPosition.y);
  ctx.beginPath();
  ctx.lineWidth = currentSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = currentColor;

  if (currentAction === MARCAR_EXTRACCION) {
    extraccion(currentPosition.x, currentPosition.y);
  }
  if (currentAction === DIENTE_AUSENTE) {
    ausente(currentPosition.x, currentPosition.y);
  }
}

// ON MOUSE MOVE

function mousemove(canvas, evt) {
  if (currentAction === MARCAR_AREA) {
    if (isMouseDown) {
      var currentPosition = getMousePos(canvas, evt);
      if (esDibujable(currentPosition)) {
        ctx.lineTo(currentPosition.x, currentPosition.y);
        ctx.stroke();
      }
    }
  }
}

// ON MOUSE UP

function mouseup(evt) {
  var p = getMousePos(canvas, evt);
  let x = p.x;
  let y = p.y;
  var contorno = canvas.getBoundingClientRect();
  console.log('Posicion Actual==>: ', 'X: ', p.x, 'Y: ', p.y);

  if (!esDibujable(p.x, p.y)) {
    return;
  }
  ctx.fillStyle = currentColor;
  ctx.font = 'bold 16px serif';
  if (currentAction === MARCAR_CARIES) {
    ctx.beginPath();
    ctx.arc(evt.clientX - contorno.left, evt.clientY - contorno.top, 5, 0, 2 * Math.PI);
    ctx.fillStyle = currentColor;
    ctx.fill();
  }

  if (currentAction === LINEA_VERTICAL) {
    ctx.strokeStyle = 'rgb(0, 0,255)';
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x - 3, y - 10);
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 2, y - 10);
    ctx.moveTo(x - 3, y);
    ctx.lineTo(x - 3, y + 10);
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + 2, y + 10);
  }

  if (currentAction === MARCAR_BOX_UP) {
    ctx.strokeStyle = 'rgb(0, 0,255)';
    ctx.moveTo(x, y); //300,250
    ctx.lineTo(x, y + 15);
    ctx.lineTo(x + 15, y + 15);
    ctx.lineTo(x + 15, y);
  }

  if (currentAction === MARCAR_BOX_DOWN) {
    ctx.strokeStyle = 'rgb(0, 0,255)';
    ctx.moveTo(x, y); //300,245
    ctx.lineTo(x, y - 15);
    ctx.lineTo(x + 15, y - 15);
    ctx.lineTo(x + 15, y);
  }

  if (currentAction === MARCAR_IMPLANTE) {
    y = y - 5;

    ctx.lineWidth = 3;
    ctx.moveTo(x, y); //295,250
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x - 10, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 7);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + 10, y + 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x - 10, y + 8);
  }

  if (currentAction === MARCAR_PUENTE_FIJO) {
    let xoffset = 12;
    x = x - xoffset;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = currentColor;
    ctx.fill();
    ctx.lineTo(x + 20, y); // Red line
    ctx.arc(x + 25, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  if (currentAction === MARCAR_REMOVIBLE) {
    x = x - 15;
    ctx.lineWidth = 2;

    ctx.beginPath();
    moveTo(x, y);
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.lineTo(x + 10, y - 6);
    ctx.lineTo(x + 17, y);
    ctx.lineTo(x + 25, y - 6);
    ctx.lineTo(x + 32, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 35, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  if (currentAction === MARCAR_HIPERSENSE) {
    y = y - 15;
    x = x - 5;
    ctx.lineWidth = 2;
    ctx.beginPath();
    moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 8, y + 4);
    ctx.lineTo(x, y + 8);
    ctx.lineTo(x + 8, y + 12);
    ctx.lineTo(x, y + 16);
    ctx.lineTo(x + 8, y + 20);
    ctx.lineTo(x, y + 24);
  }

  if (currentAction === MARCAR_APICAL) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.strokeStyle = currentColor;
    ctx.closePath();
  }

  if (currentAction === MARCAR_FISTULA) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  if (currentAction === MARCAR_EMPAQ_ALIMENTO) {
    ctx.fillText('E', x - 7, y + 5);
  }

  if (currentAction === MARCAR_INFRAOCLUSION) {
    x = x - 5;
    y = y - 5;
    ctx.lineWidth = 2;
    ctx.moveTo(x + 5, y - 10);
    ctx.lineTo(x + 5, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y);
    ctx.lineTo(x + 5, y + 15);
    ctx.fill();
    ctx.closePath();
  }

  if (currentAction === MARCAR_PROFUNDIDAD_SONDAJE) {
    ctx.fillText('PS', x - 10, y + 5);
  }

  if (currentAction === MARCAR_INSERSION_CLINICA) {
    ctx.fillText('N.I.C', x - 20, y + 5);
  }

  if (currentAction === MARCAR_SANGRAMIENTO_SONDAJE) {
    ctx.fillText('S.S', x - 12, y + 5);
  }

  if (currentAction === MARCAR_MUCOSA_MASTICADORA) {
    ctx.fillText('M.M', x - 15, y + 5);
  }

  if (currentAction === MARCAR_DEFECTO_MUCOGINGIVAL) {
    ctx.fillText('D.M.G', x - 25, y + 5);
  }

  if (currentAction === MARCAR_MOVILIDAD_DENTARIA) {
    ctx.fillText('M.O.V.', x - 25, y + 5);
  }

  if (currentAction === MARCAR_COMPROMISO_FURCACION) {
    ctx.fillText('C.F.', x - 15, y + 5);
  }

  if (currentAction === MARCAR_PROTESIS_DEFECTUOSA) {
    ctx.fillText('P.D.', x - 13, y + 5);
  }

  if (currentAction === MARCAR_FRENILLO) {
    ctx.fillText('Y', x - 7, y + 5);
  }

  if (currentAction === MARCAR_EXTRUSION) {
    ctx.lineWidth = 2;
    x = x - 5;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y - 15);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y + 10);
    ctx.fill();
    ctx.closePath();
  }

  if (currentAction === MARCAR_INCLINACION) {
    ctx.lineWidth = 2;
    y = y - 5;
    //triangulo
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y + 5);
    ctx.lineTo(x, y + 10);
    ctx.moveTo(x + 5, y + 5);
    ctx.lineTo(x - 10, y + 5);
    ctx.fill();
    ctx.closePath();
  }

  if (currentAction === MARCAR_ROTACION) {
    ctx.lineWidth = 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y - 15);
    ctx.lineTo(x + 10, y);
    ctx.moveTo(x, y);
    ctx.fill();
    ctx.arc(x - 5, y, 10, 0, Math.PI, false);
  }

  if (currentAction === MARCAR_FRACTURA) {
    ctx.strokeStyle = currentColor;
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y);
    ctx.lineTo(x - 5, y + 5);
    ctx.lineTo(x - 10, y + 5);
    ctx.lineTo(x - 10, y + 10);
    ctx.lineTo(x - 15, y + 10);
  }

  if (currentAction === LINEA_HORIZONTAL) {
    ctx.strokeStyle = 'rgb(0, 0,255)';
    x = x - 10;
    y = y - 3;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x + 20, y + 5);
  }
  ctx.stroke();
  isMouseDown = false;
}

function extraccion(posx, posy) {
  if (esDibujable(posx, posy)) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(posx - 15, calibrarY(posy) - 80);
    ctx.lineTo(posx + 15, calibrarY(posy) + 80); // Red line
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(posx + 15, calibrarY(posy) - 80);
    ctx.lineTo(posx - 15, calibrarY(posy) + 80); // Red line
    ctx.closePath();
    ctx.stroke();
  }
}

function ausente(posx, posy) {
  //verificar que no se hizo click en areas no dibujable (fuera del cuadro de odontograma)
  if (esDibujable(posx, posy)) {
    ctx.beginPath();
    ctx.moveTo(posx, calibrarY(posy) - 95);
    ctx.lineTo(posx, calibrarY(posy) + 90); // Red line
    ctx.closePath();
    ctx.stroke();
  }
}

function btnActivo(id) {
  let comandos = document.getElementsByClassName('btn-dibujo');
  Array.from(comandos).forEach(el => {
    el.classList.remove('activo');
  });
  document.getElementById(id).classList.toggle('activo');
}

btnCerrar.addEventListener('click', () => {
  window.close();
});
