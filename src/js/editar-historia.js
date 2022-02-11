import { db } from '../js/firebaseconfig';
import { collection, doc, query, where, updateDoc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { calcEdad, dolarToday, firstUpperCase, dateToAMD } from '../commons/utilities';

const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const historia = document.getElementById('historia-form');
const controlQuery = query(
  collection(db, 'controlasistencias'),
  where('idPaciente', '==', idPacienteLocal),
  where('esCita1', '==', true)
);
const historiaQuery = query(collection(db, 'historias'), where('idPaciente', '==', idPacienteLocal));
const allInputs = document.querySelectorAll('.input');
const hoy = new Date();
let idHistoriaActual;

historia.addEventListener('focusout', e => {
  e.preventDefault();
  let elemento = e.target.id;

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

window.addEventListener('DOMContentLoaded', () => {
  getDoc(doc(db, 'pacientes', idPacienteLocal)).then(documento => {
    const paciente = documento.data();
    document.getElementById('nombre').value = paciente.nombre;
    document.getElementById('apellido').value = paciente.apellido;
    document.getElementById('celular').value = paciente.celular;
    document.getElementById('edad').value = paciente.edad;
  });

  getDocs(historiaQuery).then(histo => {
    histo.forEach(doc => {
      idHistoriaActual = doc.id;
      getHistoria(doc.id);
    });
  });

  getDocs(controlQuery).then(res => {
    res.forEach(doc => {
      getControl(doc.id);
    });
  });
});

function getHistoria(paramid) {
  getDoc(doc(db, 'historias', paramid)).then(docu => {
    const data = docu.data();
    document.getElementById('cedula').value = data.cedula;
    document.getElementById('fnacimiento').value = data.fnacimiento;
    document.getElementById('tlflocal').value = data.tlflocal;
    document.getElementById('email').value = data.email;

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
  }); //getDoc promise end
}

function getControl(docid) {
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

//END OF :  GET DATA FOR CRUD: EDITAR HISTORIA DE PACIENTE **************************************************

historia.addEventListener('submit', e => {
  e.preventDefault();
  console.log('idHistoriaActual asignado===>>>:', idHistoriaActual);
  const nombre = firstUpperCase(historia['nombre'].value);
  const apellido = firstUpperCase(historia['apellido'].value);
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

  const objPaciente = {
    nombre,
    apellido,
    celular,
    edad,
    createdAt: serverTimestamp(),
  };

  const objHistoria = {
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

  // 1. Actualizar la coleccion de Pacientes
  updateDoc(doc(db, 'pacientes', idPacienteLocal), objPaciente);
  // 2. Actualizar la coleccion de Historias
  getDocs(historiaQuery).then(res => {
    res.forEach(doc => {
      console.log(doc.id, 'historia:', doc.data());
      actualizarHistoria(doc.id);
    });
  });
  // 3.Actualizar Coleccion de Controles (1ra. Cita)
  getDocs(controlQuery).then(res => {
    res.forEach(doc => {
      actualizarControl(doc.id);
    });
  });

  function actualizarControl(docid) {
    console.log('inside actualizarControl()');
    const updateControlRef = doc(db, 'controlasistencias', docid);
    updateDoc(updateControlRef, controlAsistencia).then(res => {
      historia.reset();
      alert('Informacion Actualizada con exito!');
      window.close();
    });
  }

  function actualizarHistoria(docid) {
    console.log('historia ID:', docid);
    const updateHistoriaRef = doc(db, 'historias', docid);
    updateDoc(updateHistoriaRef, objHistoria).then(res => {
      historia.reset();
      alert('Historia Actualizada con exito!');
      window.close();
    });
  }
}); //FIN DE SUBMIT

function validarInput(valor, exp) {
  return valor.match(exp) ? true : false;
}

allInputs.forEach(item => {
  item.parentNode.classList.add('focus');
});

document.querySelector('.volver').addEventListener('click', e => {
  e.preventDefault();
  window.close();
});
