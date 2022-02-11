import { db } from '../js/firebaseconfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { calcEdad, dolarToday, firstUpperCase, dateToAMD } from '../commons/utilities';

const historia = document.getElementById('historia-form');
const hoy = new Date();
localStorage.clear();

historia.addEventListener('focusout', e => {
  e.preventDefault();
  let elemento = e.target.id;
  console.log('blur event fired');
  console.log('Elemento seleccionado id (blur):', elemento);
  switch (elemento) {
    case 'fnacimiento':
      document.getElementById('edad').parentNode.classList.add('focus');
      document.getElementById('edad').value = calcEdad(document.getElementById('fnacimiento').value);
      break;
    case 'montopagado':
      e.preventDefault();
      dolarToday(
        document.getElementById('cambiodia'),
        document.getElementById('montopagado'),
        document.getElementById('montopagadobs')
      );
      break;
    case 'cambiodia':
      const cambio = historia['cambiodia'].value;
      const dolares = document.getElementById('montopagado').value;
      historia['montopagadobs'].value = (parseFloat(cambio) * parseFloat(dolares)).toFixed(2);
      break;
    case 'edad':
      const valorEdad = parseInt(document.getElementById('edad').value);
      if (valorEdad < 2 || valorEdad > 99) {
        document.getElementById('edad').value = '';
        alert('La edad debe estar entre 2 y 99 años');
      }
      break;
    case 'peso':
      const valorPeso = parseInt(document.getElementById('peso').value);
      if (valorPeso < 5 || valorPeso > 250) {
        document.getElementById('peso').value = '';
        alert('El peso debe estar entre 5 y 250 kgs.');
      }
      break;
    case 'estatura':
      const valorEstatura = parseInt(document.getElementById('estatura').value);
      if (valorEstatura < 0.5 || valorEstatura > 2.3) {
        document.getElementById('estatura').value = '';
        alert('La Estatura debe estar entre 0.5 y 2.30 mts');
      }
      break;
    default:
      console.log('default switch for blur');
  }
});

historia.addEventListener('change', e => {
  e.preventDefault();
  let elemento = e.target.id;
 
  switch (elemento) {
    case 'selector-evaluacion':
      document.getElementById('evaluaciongeneral').value +=
        ' - ' + document.getElementById('selector-evaluacion').value + '\r\n';
      break;
    case 'selector-tratamiento':
      document.getElementById('tratamientoaplicado').value +=
        ' - ' + document.getElementById('selector-tratamiento').value + '\r\n';
      break;
    case 'celular':
      const celularRegex = /^(0414|0424|0412|0416|0426)[-][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/g;
      if (!validarInput(document.getElementById('celular').value, celularRegex)) {
        alert('Ejemplo: 0412-555-55-55');
        document.getElementById('celular').value = '';
      }
      break;
    case 'tlflocal':
      const telefonoRegex = /^[0-9]{4}[-][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/g;
      validarInput(document.getElementById('tlflocal').value, telefonoRegex)
        ? ''
        : (document.getElementById('tlflocal').value = '');
      if (!validarInput(document.getElementById('tlflocal').value, telefonoRegex)) {
        alert('Ejemplo: 0212-555-55-55');
        document.getElementById('tlflocal').value = '';
      }
      break;
    case 'cedula':
      const cedulaRegex = /^[V|E|J|P][-][0-9]{5,9}$/;
      if (!validarInput(document.getElementById('cedula').value, cedulaRegex)) {
        alert('Ejemplo: V-999999999');
        document.getElementById('cedula').value = '';
      }
      break;
    case 'formadepago':
      document.getElementById('referenciapago').parentNode.classList.add('focus');
      if (document.getElementById('formadepago').value == 'Efectivo') {
        document.getElementById('referenciapago').value = 'cash$';
        document.getElementById('select-banco').value = 'Otro';
        document.getElementById('tipo-pago').value = 'Total';
      } else {
        document.getElementById('referenciapago').value = '';
        document.getElementById('select-banco').value = '';
        document.getElementById('tipo-pago').value = '';
      }
      break;
    default:
      console.log('default switch for change');
  }
});

document.querySelector('.fechacontrolasistencia').value = dateToAMD(hoy);

historia.addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = firstUpperCase(historia['nombre'].value);
  const apellido = firstUpperCase(historia['apellido'].value);
  const cedula = historia['cedula'].value || ' ';
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
  const montopagado = parseFloat(historia['montopagado'].value).toFixed(2);
  const montopagadobs = parseFloat(historia['montopagadobs'].value).toFixed(2);
  const cambiodia = parseFloat(historia['cambiodia'].value).toFixed(2);

  const objPaciente = {
    nombre,
    apellido,
    celular,
    edad,
    createdAt: serverTimestamp(),
  };

  const { id } = await addDoc(collection(db, 'pacientes'), objPaciente);

  const objHistoria = {
    idPaciente: id,
    cedula,
    fnacimiento,
    tlflocal,
    email,
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
    createdAt: serverTimestamp(),
  };

  addDoc(collection(db, 'historias'), objHistoria);

  const objControl = {
    idPaciente: id,
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

  addDoc(collection(db, 'controlasistencias'), objControl);

  alert('Paciente Agregado con exito!');
  historia.reset();
  window.close();
});

function validarInput(valor, exp) {
  return valor.match(exp) ? true : false;
}

historia.addEventListener('focusin', e => {
  e.target.parentNode.classList.add('focus');
});

historia.addEventListener('focusout', e => {
  if (e.target.value == '' || e.target.value == ' ') {
    e.target.parentNode.classList.remove('focus');
  }
});

document.querySelector('.volver').addEventListener('click', e => {
  e.preventDefault();
  window.close();
});
