import { db } from '../js/firebaseconfig';
import { collection, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';

const btnCerrar = document.querySelector('.volver');
const idPacienteLocal = JSON.parse(localStorage.getItem('pacienteActual'));
const nombrePaciente = JSON.parse(localStorage.getItem('nombrePaciente'));
const apellidoPaciente = JSON.parse(localStorage.getItem('apellidoPaciente'));
var slides;
var btns;
var inputs;
var navigation = document.querySelector('.navigation');
const controlesRef = collection(db, 'controlasistencias');
const myQuery = query(controlesRef, where('idPaciente', '==', idPacienteLocal), where('esCita1', '==', true));
const btnAgregar = document.getElementById('btn-agregar');
const btnEditar = document.getElementById('btn-editar');
const btnEliminar = document.getElementById('btn-eliminar');
var controlActivo;

const slidesObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target.classList.contains('active')) {
      console.log('watch observer entry:', entry.target.childNodes[0].value);
      controlActivo = entry.target.childNodes[0].value;
    }
  });
});

window.addEventListener('load', () => {
  document.getElementById('paciente').innerText = nombrePaciente + ' ' + apellidoPaciente;
  getControl();
});

btnAgregar.addEventListener('click', () => {
  window.open('agregar-control.html', '_self');
});

btnEliminar.addEventListener('click', () => {
  console.log('Eliminar el control actual:', controlActivo);
  deleteAsistencia(controlActivo);
});

btnEditar.addEventListener('click', () => {
  localStorage.setItem('controltoupdate', JSON.stringify(controlActivo));
  window.open('editar-control.html', '_self');
});

function getControl() {
  getDocs(myQuery).then(res => {
    res.forEach(doc => {
      const myData = doc.data();
      const idControl = doc.id;
      addSlide(myData, idControl);
    });
  });
}

//fin del codigo para los custom inputs de la seccion contacto

function addSlide(datos, id) {
  var controlSliderDiv = document.getElementById('control-slider');
  var slideDiv = document.createElement('div');
  var idInput = document.createElement('input');
  idInput.classList.add('hidden');
  idInput.value = id;
  var infoDiv = document.createElement('div');
  var flexorDiv = document.createElement('div');
  var controlDiv = document.createElement('div');
  var inputFecha = document.createElement('input');

  var h3 = document.createElement('h3');
  var h3Content = document.createTextNode('Informacion del Pago');
  h3.appendChild(h3Content);

  var itemTextArea1 = document.createElement('div');
  var itemTextArea2 = document.createElement('div');

  var h61 = document.createElement('h6');
  var h61Content = document.createTextNode('Evaluacion General');
  var h62 = document.createElement('h6');
  var h62Content = document.createTextNode('Tratamiento Aplicado');
  h61.appendChild(h61Content);
  h62.appendChild(h62Content);

  var textEvaluacion = document.createElement('textarea');
  var textTratamiento = document.createElement('textarea');

  textEvaluacion.value = datos.evaluaciongeneral;
  textTratamiento.value = datos.tratamientoaplicado;

  var selectEval = document.createElement('select');
  selectEval.classList.add('selector-conceptos');
  selectEval.classList.add('selector-evaluacion');
  selectEval.classList.add('hidden');

  var opcion1 = document.createElement('option');
  var opcion2 = document.createElement('option');
  var opcion3 = document.createElement('option');
  var opcion4 = document.createElement('option');
  var opcion5 = document.createElement('option');
  var opcion6 = document.createElement('option');
  var opcion7 = document.createElement('option');
  var opcion8 = document.createElement('option');
  var opcion9 = document.createElement('option');
  var opcion10 = document.createElement('option');

  opcion1.text = 'Concepto de evaluacion y Diagnostico de Paciente #1';
  opcion2.text = 'Concepto de evaluacion y Diagnostico de Paciente #2';
  opcion3.text = 'Concepto de evaluacion y Diagnostico de Paciente #3';
  opcion4.text = 'Concepto de evaluacion y Diagnostico de Paciente #4';
  opcion5.text = 'Concepto de evaluacion y Diagnostico de Paciente #5';
  opcion6.text = 'Concepto de evaluacion y Diagnostico de Paciente #6';
  opcion7.text = 'Concepto de evaluacion y Diagnostico de Paciente #7';
  opcion8.text = 'Concepto de evaluacion y Diagnostico de Paciente #8';
  opcion9.text = 'Concepto de evaluacion y Diagnostico de Paciente #9';
  opcion10.text = 'Concepto de evaluacion y Diagnostico de Paciente #10';

  opcion1.value = 'evaluacion-concepto1';
  opcion2.value = 'evaluacion-concepto2';
  opcion3.value = 'evaluacion-concepto3';
  opcion4.value = 'evaluacion-concepto4';
  opcion5.value = 'evaluacion-concepto5';
  opcion6.value = 'evaluacion-concepto6';
  opcion7.value = 'evaluacion-concepto7';
  opcion8.value = 'evaluacion-concepto8';
  opcion9.value = 'evaluacion-concepto9';
  opcion10.value = 'evaluacion-concepto10';

  selectEval.add(opcion1);
  selectEval.add(opcion2);
  selectEval.add(opcion3);
  selectEval.add(opcion4);
  selectEval.add(opcion5);
  selectEval.add(opcion6);
  selectEval.add(opcion7);
  selectEval.add(opcion8);
  selectEval.add(opcion9);
  selectEval.add(opcion10);

  var selectTrat = document.createElement('select');
  selectTrat.classList.add('selector-conceptos');
  selectTrat.classList.add('selector-tratamiento');
  selectTrat.classList.add('hidden');

  var opcion11 = document.createElement('option');
  var opcion12 = document.createElement('option');
  var opcion13 = document.createElement('option');
  var opcion14 = document.createElement('option');
  var opcion15 = document.createElement('option');
  var opcion16 = document.createElement('option');
  var opcion17 = document.createElement('option');
  var opcion18 = document.createElement('option');
  var opcion19 = document.createElement('option');
  var opcion20 = document.createElement('option');

  opcion11.text = 'Concepto de tratamiento aplicado a Paciente #1';
  opcion12.text = 'Concepto de tratamiento aplicado a Paciente #2';
  opcion13.text = 'Concepto de tratamiento aplicado a Paciente #3';
  opcion14.text = 'Concepto de tratamiento aplicado a Paciente #4';
  opcion15.text = 'Concepto de tratamiento aplicado a Paciente #5';
  opcion16.text = 'Concepto de tratamiento aplicado a Paciente #6';
  opcion17.text = 'Concepto de tratamiento aplicado a Paciente #7';
  opcion18.text = 'Concepto de tratamiento aplicado a Paciente #8';
  opcion19.text = 'Concepto de tratamiento aplicado a Paciente #9';
  opcion20.text = 'Concepto de tratamiento aplicado a Paciente #10';

  opcion11.value = 'Tratamiento-concepto1';
  opcion12.value = 'Tratamiento-concepto2';
  opcion13.value = 'Tratamiento-concepto3';
  opcion14.value = 'Tratamiento-concepto4';
  opcion15.value = 'Tratamiento-concepto5';
  opcion16.value = 'Tratamiento-concepto6';
  opcion17.value = 'Tratamiento-concepto7';
  opcion18.value = 'Tratamiento-concepto8';
  opcion19.value = 'Tratamiento-concepto9';
  opcion20.value = 'Tratamiento-concepto10';

  selectTrat.add(opcion11);
  selectTrat.add(opcion12);
  selectTrat.add(opcion13);
  selectTrat.add(opcion14);
  selectTrat.add(opcion15);
  selectTrat.add(opcion16);
  selectTrat.add(opcion17);
  selectTrat.add(opcion18);
  selectTrat.add(opcion19);
  selectTrat.add(opcion20);

  selectTrat.setAttribute('disabled', 'disabled');
  selectEval.setAttribute('disabled', 'disabled');
  slideDiv.classList.add('slide');
  controlSliderDiv.insertBefore(slideDiv, navigation);
  slideDiv.appendChild(idInput);
  slideDiv.appendChild(infoDiv).classList.add('info');
  infoDiv.appendChild(flexorDiv).classList.add('flexor');
  infoDiv.appendChild(controlDiv).classList.add('div-control-asistencia');
  inputFecha.setAttribute('type', 'date');
  inputFecha.classList.add('fechacontrolasistencia');
  inputFecha.classList.add('control');
  inputFecha.value = datos.fecha;

  flexorDiv.appendChild(inputFecha);

  controlDiv.appendChild(h61);
  controlDiv.appendChild(itemTextArea1);
  controlDiv.appendChild(itemTextArea2);
  itemTextArea1.appendChild(textEvaluacion);
  itemTextArea1.appendChild(selectEval);
  controlDiv.insertBefore(h62, itemTextArea2);
  itemTextArea2.appendChild(textTratamiento);
  itemTextArea2.appendChild(selectTrat);

  textEvaluacion.classList.add('evaluaciongeneral');
  textTratamiento.classList.add('tratamientoaplicado');

  textEvaluacion.setAttribute('rows', '5');
  textTratamiento.setAttribute('rows', '5');

  textEvaluacion.setAttribute('disabled', 'disabled');
  textTratamiento.setAttribute('disabled', 'disabled');

  var divPago = document.createElement('div');
  divPago.classList.add('inputs-collection');

  var selectFormaPago = document.createElement('select');
  selectFormaPago.classList.add('formadepago');

  var fpopcion1 = document.createElement('option');
  var fpopcion2 = document.createElement('option');
  var fpopcion3 = document.createElement('option');
  var fpopcion4 = document.createElement('option');
  var fpopcion5 = document.createElement('option');

  fpopcion1.text = 'efectivo$';
  fpopcion2.text = 'Transferencia';
  fpopcion3.text = 'Pago-Movil';
  fpopcion4.text = 'Zelle';
  fpopcion5.text = 'Otro';

  fpopcion1.value = 'Efectivo';
  fpopcion2.value = 'Transferencia';
  fpopcion3.value = 'Pago-Movil';
  fpopcion4.value = 'Zelle';
  fpopcion5.value = 'Otro';

  selectFormaPago.add(fpopcion1);
  selectFormaPago.add(fpopcion2);
  selectFormaPago.add(fpopcion3);
  selectFormaPago.add(fpopcion4);
  selectFormaPago.add(fpopcion5);

  selectFormaPago.value = datos.formadepago;

  var selectBanco = document.createElement('select');
  selectBanco.classList.add('select-banco');

  var bopcion0 = document.createElement('option');
  var bopcion1 = document.createElement('option');
  var bopcion2 = document.createElement('option');
  var bopcion3 = document.createElement('option');
  var bopcion4 = document.createElement('option');
  var bopcion5 = document.createElement('option');
  var bopcion6 = document.createElement('option');
  var bopcion7 = document.createElement('option');
  var bopcion8 = document.createElement('option');
  var bopcion9 = document.createElement('option');
  var bopcion10 = document.createElement('option');
  var bopcion11 = document.createElement('option');

  bopcion0.text = 'Banco';
  bopcion1.text = 'Banesco Banco Universal';
  bopcion2.text = 'Banco de Venezuela';
  bopcion3.text = 'Banco Mercantil';
  bopcion4.text = 'Banco Provincial';
  bopcion5.text = 'Banco del Caribe';
  bopcion6.text = 'Banco Nacional de Credito';
  bopcion7.text = 'Banco del Tesoro';
  bopcion8.text = 'Bancamiga';
  bopcion9.text = 'Banco Vzlno. de Credito';
  bopcion10.text = 'Banco BOD';
  bopcion11.text = 'Otro';

  bopcion0.value = '';
  bopcion0.selected = 'selected';
  bopcion0.disabled = true;
  bopcion1.value = 'Banesco';
  bopcion2.value = 'Venezuela';
  bopcion3.value = 'Mercantil';
  bopcion4.value = 'Provincial';
  bopcion5.value = 'Caribe';
  bopcion6.value = 'BNC';
  bopcion7.value = 'Tesoro';
  bopcion8.value = 'Bancamiga';
  bopcion9.value = 'BVC';
  bopcion10.value = 'BOD';
  bopcion11.value = 'Otro';

  selectBanco.add(bopcion0);
  selectBanco.add(bopcion1);
  selectBanco.add(bopcion2);
  selectBanco.add(bopcion3);
  selectBanco.add(bopcion4);
  selectBanco.add(bopcion5);
  selectBanco.add(bopcion5);
  selectBanco.add(bopcion7);
  selectBanco.add(bopcion8);
  selectBanco.add(bopcion9);
  selectBanco.add(bopcion10);
  selectBanco.add(bopcion11);

  selectBanco.value = datos.banco;

  var selectTipoPago = document.createElement('select');
  selectTipoPago.classList.add('tipo-pago');

  var tpopcion1 = document.createElement('option');
  var tpopcion2 = document.createElement('option');
  var tpopcion3 = document.createElement('option');

  tpopcion1.text = 'Pago Total de Consulta';
  tpopcion2.text = 'Pago Abono a Cuenta';
  tpopcion3.text = 'Pago Saldo Pendiente';

  tpopcion1.value = 'Total';
  tpopcion2.value = 'Abono';
  tpopcion3.value = 'Saldo';

  selectTipoPago.add(tpopcion1);
  selectTipoPago.add(tpopcion2);
  selectTipoPago.add(tpopcion3);

  selectTipoPago.value = datos.tipopago;

  selectFormaPago.setAttribute('disabled', 'disabled');
  selectBanco.setAttribute('disabled', 'disabled');
  selectTipoPago.setAttribute('disabled', 'disabled');

  divPago.appendChild(selectFormaPago);
  divPago.appendChild(selectBanco);
  divPago.appendChild(selectTipoPago);

  var inputContainer1 = document.createElement('div');
  inputContainer1.classList.add('input-container');
  inputContainer1.classList.add('pagos');
  inputContainer1.classList.add('focus');

  var input1 = document.createElement('input');
  input1.classList.add('input');
  input1.classList.add('referenciapago');
  input1.value = datos.referencia;
  input1.setAttribute('disabled', 'disabled');

  var labelcontent1 = document.createTextNode('Referencia');
  var spanContent1 = document.createTextNode('Referencia');
  var label1 = document.createElement('label');
  var span1 = document.createElement('span');
  label1.appendChild(labelcontent1);
  span1.appendChild(spanContent1);

  inputContainer1.appendChild(input1);
  inputContainer1.appendChild(label1);
  inputContainer1.appendChild(span1);

  var inputContainer2 = document.createElement('div');
  inputContainer2.classList.add('input-container');
  inputContainer2.classList.add('pagos');
  inputContainer2.classList.add('focus');

  var input2 = document.createElement('input');
  input2.classList.add('input');
  input2.classList.add('montopagado');
  input2.value = datos.montoUsd;
  input2.setAttribute('disabled', 'disabled');

  var labelcontent2 = document.createTextNode('Monto US$');
  var spanContent2 = document.createTextNode('Monto US$');
  var label2 = document.createElement('label');
  var span2 = document.createElement('span');
  label2.appendChild(labelcontent2);
  span2.appendChild(spanContent2);

  inputContainer2.appendChild(input2);
  inputContainer2.appendChild(label2);
  inputContainer2.appendChild(span2);

  var inputContainer3 = document.createElement('div');
  inputContainer3.classList.add('input-container');
  inputContainer3.classList.add('pagos');
  inputContainer3.classList.add('focus');

  var input3 = document.createElement('input');

  input3.classList.add('input');
  input3.classList.add('cambiodia');
  input3.value = datos.cambiodia;
  input3.setAttribute('disabled', 'disabled');

  var labelcontent3 = document.createTextNode('Cambio Dia');
  var spanContent3 = document.createTextNode('Cambio Dia');
  var label3 = document.createElement('label');
  var span3 = document.createElement('span');
  label3.appendChild(labelcontent3);
  span3.appendChild(spanContent3);

  inputContainer3.appendChild(input3);
  inputContainer3.appendChild(label3);
  inputContainer3.appendChild(span3);

  var inputContainer4 = document.createElement('div');
  inputContainer4.classList.add('input-container');
  inputContainer4.classList.add('pagos');
  inputContainer4.classList.add('focus');

  var input4 = document.createElement('input');
  input4.classList.add('input');
  input4.classList.add('montopagadobs');
  input4.value = datos.montoBs;
  input4.setAttribute('disabled', 'disabled');

  var labelcontent4 = document.createTextNode('Monto Bs.');
  var spanContent4 = document.createTextNode('Monto Bs.');
  var label4 = document.createElement('label');
  var span4 = document.createElement('span');
  label4.appendChild(labelcontent4);
  span4.appendChild(spanContent4);

  inputContainer4.appendChild(input4);
  inputContainer4.appendChild(label4);
  inputContainer4.appendChild(span4);

  divPago.appendChild(inputContainer1);
  divPago.appendChild(inputContainer2);
  divPago.appendChild(inputContainer3);
  divPago.appendChild(inputContainer4);

  controlDiv.appendChild(h3);
  controlDiv.appendChild(divPago);

  slides = document.querySelectorAll('.slide');

  let btnNavigation = document.createElement('div');
  btnNavigation.classList.add('btn');
  navigation.appendChild(btnNavigation);

  btns = document.querySelectorAll('.btn');
  slides[0].classList.add('active');
  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      slides.forEach(slide => {
        slide.classList.remove('active');
        btns.forEach(btn => {
          btn.classList.remove('active');
        });
      });
      slides[i].classList.add('active');
      btns[i].classList.add('active');
    });
  });

  slides.forEach(slide => {
    slidesObserver.observe(slide);
  });
}

function deleteAsistencia(id) {
  const eliminar = confirm('Esta Seguro que quiere Eliminar este Paciente?');
  if (eliminar) {
    const docRef = doc(db, 'controlasistencias', id);
    deleteDoc(docRef)
      .then(result => {
        alert('Registro Eliminado', result);
      })
      .catch(error => {
        alert('Error: ', error.message);
      });
  }
} //FIN DE DELETEASISTENCIA

btnCerrar.addEventListener('click', () => {
  window.history.back();
});
