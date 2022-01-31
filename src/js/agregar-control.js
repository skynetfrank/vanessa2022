import { db } from '../js/firebaseconfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const nombrePaciente = JSON.parse(localStorage.getItem('nombrePaciente'));
const apellidoPaciente = JSON.parse(localStorage.getItem('apellidoPaciente'));
const historia = document.getElementById('historia-form');
const inputs = document.querySelectorAll('.input');
const btnCerrar = document.querySelector('.volver');
const inputDolares = document.getElementById('montopagado');
const inputCambio = document.getElementById('cambiodia');
const inputBolivares = document.getElementById('montopagadobs');
const selectorEvaluacion = document.getElementById('selector-evaluacion');
const selectorTratamiento = document.getElementById('selector-tratamiento');
const textboxEvaluacion = document.getElementById('evaluaciongeneral');
const textboxTratamiento = document.getElementById('tratamientoaplicado');
const inputFormapago = document.getElementById('formadepago');

//trigger focus event on element

document.getElementById('paciente').innerText = nombrePaciente + ' ' + apellidoPaciente;

const eventoFocus = new FocusEvent('focus', {
  view: window,
  bubbles: true,
  cancelable: true,
});

function dolarToday() {
  fetch('https://s3.amazonaws.com/dolartoday/data.json')
    .then(res => res.json())
    .then(data => {
      console.log('dolar today data', data);
      const cambio = data.USD.dolartoday;
      const dolares = document.getElementById('montopagado').value;
      inputCambio.dispatchEvent(eventoFocus);
      inputBolivares.dispatchEvent(eventoFocus);
      historia['cambiodia'].value = cambio;
      historia['montopagadobs'].value = (parseFloat(cambio) * parseFloat(dolares)).toFixed(2);
    })
    .catch(err => {
      alert('La api de Dolar Today No esta disponible');
      historia['cambiodia'].value = 0;
      historia['montopagadobs'].value = (parseFloat(cambio) * parseFloat(dolares)).toFixed(2);
    });
}

inputDolares.addEventListener('blur', e => {
  e.preventDefault();
  dolarToday();
});

inputCambio.addEventListener('blur', () => {
  const cambio = historia['cambiodia'].value;
  const dolares = document.getElementById('montopagado').value;
  inputBolivares.dispatchEvent(eventoFocus);
  historia['montopagadobs'].value = (parseFloat(cambio) * parseFloat(dolares)).toFixed(2);
});
//localStorage.clear();
var date = new Date();
document.querySelector('.fechacontrolasistencia').value =
  date.getFullYear().toString() +
  '-' +
  (date.getMonth() + 1).toString().padStart(2, 0) +
  '-' +
  date.getDate().toString().padStart(2, 0);

function autoCapital(cadena) {
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}
inputFormapago.addEventListener('change', e => {
  e.preventDefault();
  document.getElementById('referenciapago').dispatchEvent(eventoFocus);
  if (inputFormapago.value == 'Efectivo') {
    document.getElementById('referenciapago').value = 'cash$';
  } else {
    document.getElementById('referenciapago').value = '';
  }
});


historia.addEventListener('submit', async e => {
  e.preventDefault();

  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const evaluaciongeneral = historia['evaluaciongeneral'].value;
  const tratamientoaplicado = historia['tratamientoaplicado'].value;
  const formadepago = historia['formadepago'].value;
  const banco = historia['select-banco'].value;
  const tipopago = historia['tipo-pago'].value;
  const referenciapago = historia['referenciapago'].value;
  const montopagado = parseInt(historia['montopagado'].value).toFixed(2);
  const montopagadobs = parseInt(historia['montopagadobs'].value).toFixed(2);
  const cambiodia = parseInt(historia['cambiodia'].value).toFixed(2);
  //Crear Objeto para enviar a firebase con todos los campos

  const controlAsistencia = {
    idPaciente: idPacienteLocal,
    fecha: fechacontrolasistencia,
    esCita1: true,
    evaluaciongeneral: evaluaciongeneral,
    tratamientoaplicado: tratamientoaplicado,
    formadepago: formadepago,
    tipopago: tipopago,
    banco: banco,
    montoBs: montopagadobs,
    referencia: referenciapago,
    montoUsd: montopagado,
    cambiodia: cambiodia,
    createdAt: serverTimestamp(),
  };

  addDoc(collection(db, 'controlasistencias'), controlAsistencia)
    .then(result => {
      historia.reset();
      alert('Nuevo Control de Asistencias Agregado con exito');
      window.history.back();
    })
    .catch(err => {
      console.log('Hubo un error al agregar control de asistencias', err.message);
    });
}); //end of formulario submit

inputs.forEach(input => {
  input.addEventListener('focus', focusFunc);
  input.addEventListener('blur', blurFunc);
});

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add('focus');
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == '') {
    parent.classList.remove('focus');
  }
}
//fin del codigo para los custom inputs de la seccion contacto

selectorEvaluacion.addEventListener('change', () => {
  textboxEvaluacion.value += '- ' + selectorEvaluacion.value + '\r\n';
});

selectorTratamiento.addEventListener('change', () => {
  textboxTratamiento.value += '- ' + selectorTratamiento.value + '\r\n';
});

btnCerrar.addEventListener('click', () => {
  window.history.back();
});
