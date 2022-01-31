import { db } from '../js/firebaseconfig';
import { collection, doc, query, where, updateDoc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';

const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
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
const controlesRef = collection(db, 'controlasistencias');
const myQuery = query(controlesRef, where('idPaciente', '==', idPacienteLocal), where('esCita1', '==', true));
const inputEdad = document.getElementById('edad');
const inputPeso = document.getElementById('peso');
const inputEstatura = document.getElementById('estatura');
const inputCelular = document.getElementById('celular');
const inputLocal = document.getElementById('tlflocal');
const inputCedula = document.getElementById('cedula');
const fechaNacimiento = document.getElementById('fnacimiento');
const inputFormapago = document.getElementById('formadepago');

const eventoFocus = new FocusEvent('focus', {
  view: window,
  bubbles: true,
  cancelable: true,
});

fechaNacimiento.addEventListener('blur', e => {
  e.preventDefault();
  const fechaActual = new Date();
  const anoActual = parseInt(fechaActual.getFullYear());
  const mesActual = parseInt(fechaActual.getMonth() + 1);
  const diaActual = parseInt(fechaActual.getDate());

  const anoNacimiento = parseInt(String(fechaNacimiento.value).substring(0, 4));
  const mesNacimiento = parseInt(String(fechaNacimiento.value).substring(5, 7));
  const diaNacimiento = parseInt(String(fechaNacimiento.value).substring(8, 10));

  let edad = 0;

  edad = anoActual - anoNacimiento;
  if (mesActual < mesNacimiento) {
    edad--;
  } else if (mesActual == mesNacimiento) {
    if (diaActual < diaNacimiento) {
      edad--;
    }
  }
  document.getElementById('edad').dispatchEvent(eventoFocus);
  document.getElementById('edad').value = edad;
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

inputEdad.addEventListener('blur', e => {
  e.preventDefault();
  const valor = parseInt(inputEdad.value);
  if (valor < 2 || valor > 99) {
    inputEdad.value = '';
    alert('La edad debe estar entre 2 y 99 años');
  }
});

inputPeso.addEventListener('blur', e => {
  e.preventDefault();
  const valor = parseInt(inputPeso.value);
  if (valor < 5 || valor > 250) {
    inputPeso.value = '';
    alert('El peso debe estar entre 5 y 250 kgs.');
  }
});

inputEstatura.addEventListener('blur', e => {
  e.preventDefault();
  const valor = parseInt(inputEstatura.value);
  if (valor < 0.5 || valor > 2.3) {
    inputEstatura.value = '';
    alert('La Estatura debe estar entre 0.5 y 2.30 mts');
  }
});

inputCelular.addEventListener('change', e => {
  e.preventDefault();
  const celularRegex = /^(0414|0424|0412|0416|0426)[-][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/g;
  if (!validarInput(inputCelular.value, celularRegex)) {
    alert('Ejemplo: 0412-555-55-55');
    inputCelular.value = '';
  }
});

inputLocal.addEventListener('change', e => {
  e.preventDefault();
  const telefonoRegex = /^[0-9]{4}[-][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/g;
  validarInput(inputLocal.value, telefonoRegex) ? '' : (inputLocal.value = '');
  if (!validarInput(inputLocal.value, telefonoRegex)) {
    alert('Ejemplo: 0212-555-55-55');
    inputCelular.value = '';
  }
});

inputCedula.addEventListener('change', e => {
  e.preventDefault();
  const cedulaRegex = /^[V|E|J|P][-][0-9]{5,9}$/;
  if (!validarInput(inputCedula.value, cedulaRegex)) {
    alert('Ejemplo: V-999999999');
    inputCedula.value = '';
  }
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

localStorage.clear();
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

function getControl() {
  getDocs(myQuery).then(res => {
    res.forEach(doc => {
      fillTextos(doc.id);
    });
  });
}

function fillTextos(docid) {
  const controlRef = doc(db, 'controlasistencias', docid);
  getDoc(controlRef).then(doc => {
    const data = doc.data();
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
}

//GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************
window.addEventListener('DOMContentLoaded', () => {
  const docRef = doc(db, 'pacientes', idPacienteLocal);

  getDoc(docRef).then(docu => {
    const data = docu.data();
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('apellido').value = data.apellido;
    document.getElementById('cedula').value = data.cedula;
    document.getElementById('fnacimiento').value = data.fnacimiento;
    document.getElementById('celular').value = data.celular;
    document.getElementById('tlflocal').value = data.tlflocal;
    document.getElementById('email').value = data.email;
    document.getElementById('edad').value = data.edad;

    data.genero == 'hombre' ? document.getElementById('checkgenero1').setAttribute('checked', 'true') : '';
    data.genero == 'mujer' ? document.getElementById('checkgenero2').setAttribute('checked', 'true') : '';
    data.genero == 'diverso' ? document.getElementById('checkgenero3').setAttribute('checked', 'true') : '';

    data.edocivil == 'soltero' ? document.getElementById('checkedocivil1').setAttribute('checked', 'true') : '';
    data.edocivil == 'casado' ? document.getElementById('checkedocivil2').setAttribute('checked', 'true') : '';
    data.edocivil == 'divorciado' ? document.getElementById('checkedocivil3').setAttribute('checked', 'true') : '';
    data.edocivil == 'otro' ? document.getElementById('checkedocivil4').setAttribute('checked', 'true') : '';

    document.getElementById('direccion1').value = data.direccion1;
    document.getElementById('contacto').value = data.contacto;

    document.getElementById('estatura').value = data.estatura;
    document.getElementById('peso').value = data.peso;

    //para 2 radio buttons de si no
    data.tratadopormedico == 'true'
      ? document.getElementById('checktratadopormedico1').setAttribute('checked', 'true')
      : '';
    data.tratadopormedico == 'false'
      ? document.getElementById('checktratadopormedico2').setAttribute('checked', 'true')
      : '';

    document.getElementById('tratadoporenfermedad').value = data.tratadoporenfermedad;

    data.checktomamedicamento == 'true'
      ? document.getElementById('checktomamedicamento1').setAttribute('checked', 'true')
      : '';
    data.checktomamedicamento == 'false'
      ? document.getElementById('checktomamedicamento2').setAttribute('checked', 'true')
      : '';

    document.getElementById('cualesmedicamentos').value = data.cualesmedicamentos;
    document.getElementById('dosismeds').value = data.dosismeds;

    data.alergias.forEach(alergia => {
      alergia == 'aspirina' ? document.getElementById('checkaspirina').setAttribute('checked', 'true') : '';
      alergia == 'penicilina' ? document.getElementById('checkpenicilina').setAttribute('checked', 'true') : '';
      alergia == 'Anestecia-Local'
        ? document.getElementById('checkanestecialocal').setAttribute('checked', 'true')
        : '';
      alergia == 'codeina' ? document.getElementById('checkcodeina').setAttribute('checked', 'true') : '';
      alergia == 'Acrilico' ? document.getElementById('checkacrilico').setAttribute('checked', 'true') : '';
      alergia == 'Latex' ? document.getElementById('checklatex').setAttribute('checked', 'true') : '';
    });

    document.getElementById('textalergicootros').value = data.textalergicootros;

    data.antecedentesPersonales.forEach(antecedente => {
      antecedente == 'Cirugias' ? document.getElementById('checkcirugias').setAttribute('checked', 'true') : '';
      antecedente == 'Lesion-Cabeza' ? document.getElementById('checklesiones').setAttribute('checked', 'true') : '';
      antecedente == 'Tiene-Dieta' ? document.getElementById('checkdieta').setAttribute('checked', 'true') : '';
      antecedente == 'Es Fumador' ? document.getElementById('checkfumador').setAttribute('checked', 'true') : '';
      antecedente == 'Usa-Sustancias-Controladas'
        ? document.getElementById('checkcontroladas').setAttribute('checked', 'true')
        : '';
      antecedente == 'Embarazada' ? document.getElementById('checkembarazada').setAttribute('checked', 'true') : '';
      antecedente == 'Usa-Anticonceptivos'
        ? document.getElementById('checkanticonceptivos').setAttribute('checked', 'true')
        : '';
      antecedente == 'Amamantando' ? document.getElementById('checkamamantando').setAttribute('checked', 'true') : '';
    });

    document.getElementById('texthabitos').value = data.texthabitos;

    data.antecedentesFamiliares.forEach(antecedenteFam => {
      antecedenteFam == 'Cancer' ? document.getElementById('checkcancer').setAttribute('checked', 'true') : '';
      antecedenteFam == 'Tuberculosis'
        ? document.getElementById('checktuberculosis').setAttribute('checked', 'true')
        : '';
      antecedenteFam == 'H.I.V.' ? document.getElementById('checkhiv').setAttribute('checked', 'true') : '';
      antecedenteFam == 'Diabetes' ? document.getElementById('checkdiabetes').setAttribute('checked', 'true') : '';
      antecedenteFam == 'Cardiovasculares'
        ? document.getElementById('checkcardiovasculares').setAttribute('checked', 'true')
        : '';
      antecedenteFam == 'Hemorragicas'
        ? document.getElementById('checkhemorragicas').setAttribute('checked', 'true')
        : '';
      antecedenteFam == 'Venereas' ? document.getElementById('checkvenereas').setAttribute('checked', 'true') : '';
    });

    document.getElementById('otraenfermedad').value = data.otraenfermedad;

    document.getElementById('motivoprincipalconsulta').value = data.motivoprincipalconsulta;

    document.getElementById('fechaultimaconsulta').value = data.fechaultimaconsulta;

    document.getElementById('motivoultimaconsulta').value = data.motivoultimaconsulta;

    //para 2 radio buttons de si no
    data.checkcomplicaciones == 'true'
      ? document.getElementById('checkcomplicaciones1').setAttribute('checked', 'true')
      : '';
    data.checkcomplicaciones == 'false'
      ? document.getElementById('checkcomplicaciones2').setAttribute('checked', 'false')
      : '';
    document.getElementById('cualescomplicaciones').value = data.cualescomplicaciones;

    getControl();
  }); //getDoc promise end
});

//END OF :  GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************

historia.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = autoCapital(historia['nombre'].value);
  const apellido = autoCapital(historia['apellido'].value);
  const cedula = historia['cedula'].value;
  const fnacimiento = historia['fnacimiento'].value;
  const celular = historia['celular'].value;
  const tlflocal = historia['tlflocal'].value;
  const email = historia['email'].value;
  const edad = historia['edad'].value;
  const genero = document.querySelector('input[name="checkgenero"]:checked').value;
  const edocivil = document.querySelector('input[name="checkedocivil"]:checked').value;
  const direccion1 = historia['direccion1'].value;
  const contacto = historia['contacto'].value;
  const estatura = historia['estatura'].value;
  const peso = historia['peso'].value;
  const tratadopormedico = document.querySelector('input[name="checktratadopormedico"]:checked').value;
  const tratadoporenfermedad = historia['tratadoporenfermedad'].value;
  const checktomamedicamento = document.querySelector('input[name="checktomamedicamento"]:checked').value;
  const cualesmedicamentos = historia['cualesmedicamentos'].value;
  const dosismeds = historia['dosismeds'].value;
  const checkaspirina = historia['checkaspirina'].checked ? 'aspirina' : '';
  const checkpenicilina = historia['checkpenicilina'].checked ? 'penicilina' : '';
  const checkanestecialocal = historia['checkanestecialocal'].checked ? 'Anestecia-Local' : '';
  const checkcodeina = historia['checkcodeina'].checked ? 'codeina' : '';
  const checklatex = historia['checklatex'].checked ? 'Latex' : '';
  const checkacrilico = historia['checkacrilico'].checked ? 'Acrilico' : '';
  const textalergicootros = historia['textalergicootros'].value;
  const checkcirugias = historia['checkcirugias'].checked ? 'Cirugias' : '';
  const checklesiones = historia['checklesiones'].checked ? 'Lesion-Cabeza' : '';
  const checkdieta = historia['checkdieta'].checked ? 'Tiene-Dieta' : '';
  const checkfumador = historia['checkfumador'].checked ? 'Es Fumador' : '';
  const checkcontroladas = historia['checkcontroladas'].checked ? 'Usa-Sustancias-Controladas' : '';
  const checkembarazada = historia['checkembarazada'].checked ? 'Embarazada' : '';
  const checkanticonceptivos = historia['checkanticonceptivos'].checked ? 'Usa-Anticonceptivos' : '';
  const checkamamantando = historia['checkamamantando'].checked ? 'Amamantando' : '';
  const checkcancer = historia['checkcancer'].checked ? 'Cancer' : '';
  const checktuberculosis = historia['checktuberculosis'].checked ? 'Tuberculosis' : '';
  const checkhiv = historia['checkhiv'].checked ? 'H.I.V.' : '';
  const checkdiabetes = historia['checkdiabetes'].checked ? 'Diabetes' : '';
  const checkcardiovasculares = historia['checkcardiovasculares'].checked ? 'Cardiovasculares' : '';
  const checkhemorragicas = historia['checkhemorragicas'].checked ? 'Hemorragicas' : '';
  const checkvenereas = historia['checkvenereas'].checked ? 'Venereas' : '';
  const otraenfermedad = historia['otraenfermedad'].value;
  const texthabitos = historia['texthabitos'].value;
  const motivoprincipalconsulta = historia['motivoprincipalconsulta'].value;
  const fechaultimaconsulta = historia['fechaultimaconsulta'].value;
  const motivoultimaconsulta = historia['motivoultimaconsulta'].value;
  const checkcomplicaciones = document.querySelector('input[name="checkcomplicaciones"]:checked').value;
  const cualescomplicaciones = historia['cualescomplicaciones'].value;
  const fechacontrolasistencia = historia['fechacontrolasistencia'].value;
  const evaluaciongeneral = historia['evaluaciongeneral'].value;
  const tratamientoaplicado = historia['tratamientoaplicado'].value;
  const formadepago = historia['formadepago'].value;
  const banco = historia['select-banco'].value;
  const tipopago = historia['tipo-pago'].value;
  const referenciapago = historia['referenciapago'].value;
  const montopagado = historia['montopagado'].value;
  const montopagadobs = historia['montopagadobs'].value;
  const cambiodia = historia['cambiodia'].value;
  //Crear Objeto para enviar a firebase con todos los campos

  const historiaPaciente = {
    nombre,
    apellido,
    cedula,
    fnacimiento,
    celular,
    tlflocal,
    email,
    edad,
    genero,
    edocivil,
    direccion1,
    contacto,
    estatura,
    peso,
    tratadopormedico,
    tratadoporenfermedad,
    checktomamedicamento,
    cualesmedicamentos,
    dosismeds,
    alergias: [checkaspirina, checkpenicilina, checkanestecialocal, checkcodeina, checklatex, checkacrilico],
    textalergicootros,
    antecedentesPersonales: [
      checkcirugias,
      checklesiones,
      checkdieta,
      checkfumador,
      checkcontroladas,
      checkembarazada,
      checkanticonceptivos,
      checkamamantando,
    ],
    antecedentesFamiliares: [
      checkcancer,
      checktuberculosis,
      checkhiv,
      checkdiabetes,
      checkcardiovasculares,
      checkhemorragicas,
      checkvenereas,
    ],
    otraenfermedad,
    texthabitos,
    motivoprincipalconsulta,
    fechaultimaconsulta,
    motivoultimaconsulta,
    checkcomplicaciones,
    cualescomplicaciones,
  };

  const updateDocRef = doc(db, 'pacientes', idPacienteLocal);
  updateDoc(updateDocRef, historiaPaciente);

  const controlAsistencia = {
    fecha: fechacontrolasistencia,
    esCita1: true,
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

  function actualizarControl(docid) {
    console.log('inside actualizarControl()');
    const updateControlRef = doc(db, 'controlasistencias', docid);
    updateDoc(updateControlRef, controlAsistencia).then(res => {
      historia.reset();
      alert('Informacion Actualizada con exito!');
      window.history.back();
    });
  }

  getDocs(myQuery).then(res => {
    res.forEach(doc => {
      actualizarControl(doc.id);
    });
  });
});

btnCerrar.addEventListener('click', e => {
  e.preventDefault();
  window.history.back();
});

//codigo para los custom inputs de la seccion contacto
inputs.forEach(input => {
  input.addEventListener('focus', focusFunc);
  input.addEventListener('blur', blurFunc);
  input.dispatchEvent(eventoFocus);
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
  textboxEvaluacion.value += ' - ' + selectorEvaluacion.value + '\r\n';
});

selectorTratamiento.addEventListener('change', () => {
  textboxTratamiento.value += ' - ' + selectorTratamiento.value + '\r\n';
});

function validarInput(valor, exp) {
  return valor.match(exp) ? true : false;
}
