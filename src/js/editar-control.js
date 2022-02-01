import { db } from '../js/firebaseconfig';
import { collection, doc, query, where, updateDoc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
const idControlLocal = JSON.parse(localStorage.getItem('controltoupdate'));
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
inputFormapago.addEventListener('change', e => {
  e.preventDefault();
  document.getElementById('referenciapago').dispatchEvent(eventoFocus);
  if (inputFormapago.value == 'Efectivo') {
    document.getElementById('referenciapago').value = 'cash$';
  } else {
    document.getElementById('referenciapago').value = '';
  }
});

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

//GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************
window.addEventListener('DOMContentLoaded', () => {
  console.log('domContentLoadedlistener');
  const controlRef = doc(db, 'controlasistencias', idControlLocal);
  getDoc(controlRef).then(doc => {
    const data = doc.data();
    console.log('data a editar', doc.id, data);
    document.querySelector('.fechacontrolasistencia').value = data.fecha;
    document.getElementById('evaluaciongeneral').value = data.evaluaciongeneral;
    document.getElementById('tratamientoaplicado').value = data.tratamientoAplicado;

    document.getElementById('formadepago').value = data.pago;
    document.getElementById('select-banco').value = data.banco;
    document.getElementById('tipo-pago').value = data.tipopago;
    document.getElementById('referenciapago').value = data.referencia;
    document.getElementById('montopagado').value = data.monto;
    document.getElementById('cambiodia').value = data.cambiodia;
    document.getElementById('montopagadobs').value = data.montoBs;
  });
}); //getDoc promise end

//END OF :  GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************

historia.addEventListener('submit', e => {
  e.preventDefault();

  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const evaluaciongeneral = historia['evaluaciongeneral'].value;
  const tratamientoaplicado = historia['tratamientoaplicado'].value;
  const formadepago = historia['formadepago'].value;
  const banco = historia['select-banco'].value;
  const tipopago = historia['tipo-pago'].value;
  const referenciapago = historia['referenciapago'].value;
  const montopagado = parseFloat(historia['montopagado'].value).toFixed(2);
  const montopagadobs = parseFloat(historia['montopagadobs'].value).toFixed(2);
  const cambiodia = parseFloat(historia['cambiodia'].value).toFixed(2);
  //Crear Objeto para enviar a firebase con todos los campos

  const controlAsistencia = {
    fecha: fechacontrolasistencia,
    evaluaciongeneral: evaluaciongeneral,
    tratamientoAplicado: tratamientoaplicado,
    pago: formadepago,
    tipopago: tipopago,
    banco: banco,
    montoBs: montopagadobs,
    referencia: referenciapago,
    monto: montopagado,
    cambiodia: cambiodia,
    createdAt: serverTimestamp(),
  };
  const updateControlRef = doc(db, 'controlasistencias', idControlLocal);
  updateDoc(updateControlRef, controlAsistencia).then(res => {
    historia.reset();
    alert('Control Actualizado con exito!');
    window.history.back();
  });
});

btnCerrar.addEventListener('click', e => {
  e.preventDefault();
  window.history.back();
});

selectorEvaluacion.addEventListener('change', () => {
  textboxEvaluacion.value += '- ' + selectorEvaluacion.value + '\r\n';
});

selectorTratamiento.addEventListener('change', () => {
  textboxTratamiento.value += '- ' + selectorTratamiento.value + '\r\n';
});
