import { db, auth } from './js/firebaseconfig';
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  deleteDoc,
  where,
  onSnapshot,
  orderBy,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import TableToExcel from '@linways/table-to-excel';
import { dateToAMD, strToDMA } from './commons/utilities';

import './css/index.css';

const hamburguesa = document.getElementById('hamburguesa');
const barraMenu = document.getElementById('barra__menu');
const menu = document.querySelectorAll('nav ul li');
const menuLinks = document.querySelectorAll('nav ul li a');
const sesion = document.getElementById('sesion');
const formSesion = document.getElementById('form-sesion');
const logout = document.getElementById('logout-link');
const forgotPassword = document.getElementById('forgot-pw');
const seccionPacientes = document.getElementById('seccion__pacientes');
const seccionInicio = document.getElementById('seccion__inicio');
const seccionAgenda = document.getElementById('seccion__agenda');
const seccionDashboard = document.getElementById('seccion__dashboard');
const imgLogo = document.querySelector('.img-logo');
const buscador = document.querySelector('.search__input');
const tablaContainer = document.querySelector('.tabla-container');
const infoContainer = document.querySelector('.info-container');
const btnCerrarInfo = document.querySelector('.volver-info');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navOverlay = document.querySelector('.nav-overlay');
const closeNav = document.querySelector('.close');
const fechaAgenda = document.querySelector('.head > p');
const cardIngresos = document.getElementById('total-ingresos');
const cardActividad = document.getElementById('total-procedimientos');
const cardPacientes = document.getElementById('total-pacientes');
const cardCitas = document.getElementById('total-citas');
const mySpinner = document.querySelector('.myspinner-container');
const allSections = document.querySelectorAll('section');
const btnExcel = document.getElementById('btn-excel');
const consulta = query(collection(db, 'pacientes'), orderBy('nombre', 'asc'));
const fechaCorte = new Date(2021, 11, 31);

var usuariosWeb = [];

const populateTabla = () => {
  const pacientesData = onSnapshot(consulta, snapshot => {
    let pacientesTbody = document.getElementById('pacientes-tbody');
    let dashboardTbody = document.getElementById('dash-pacientes-tbody');
    let excelTbody = document.getElementById('excel-body');
    pacientesTbody.innerHTML = '';
    dashboardTbody.innerHTML = '';
    excelTbody.innerHTML = '';
    cardPacientes.innerHTML = snapshot.docs.length;

    snapshot.forEach(doc => {
      let data = doc.data();
      // **************************TABLA SECTION PACIENTES **************************************
      let prow = `<tr> 
                        <td id="td-titulo">Paciente</td>   
                        <td id="td-id-hidden">${doc.id}</td>                          
                        <td data-label="Nombre">${data.nombre}</td>
                        <td data-label="Apellido">${data.apellido}</td>
                        <td data-label="Edad">${data.edad}</td>
                        <td data-label="Telefono">${data.celular}</td>
                        <td data-label="" class="ver-paciente">  
                           <button class="td-btn t-tip top" id="btn-info-paciente" tip="Ver Historia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/6723388c86c0ed2b02e0.png" alt="control"</span>
                           </button> 
                           <button  class="td-btn t-tip top" id="btn-ver-paciente" tip="Editar Historia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/26790e10b578c609f86f.png" alt="control"</span>
                           </button>        
                           <button class="td-btn t-tip top" id="btn-control-paciente" tip="Control de Asistencia" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/051ef99d37ac35349b05.png" alt="control"</span>
                           </button>                       
                           <button  class="td-btn t-tip top" id="btn-odograma" tip="Ver/Editar Odograma" data-id=${doc.id}  data-nom=${data.nombre} data-ape=${data.apellido}>
                             <span class="img-btn"><img src="images/34042cb0b9d6eb31f644.png" alt="odograma"</span>
                           </button>                            
                           <button  class="td-btn t-tip left" id="btn-eliminar-paciente" tip="Eliminar este Paciente" data-id=${doc.id}>
                              <span class="img-btn"><img src="images/d17db51e63836a5fa5aa.png" alt="control"</span>
                           </button>
                        </td>
                     </tr>`;

      pacientesTbody.innerHTML += prow;
      //seleccionar todos los botones de la tabla
      const btnVerPaciente = document.querySelectorAll('.td-btn');
      //loop de botones de la tabla
      btnVerPaciente.forEach(boton => {
        boton.addEventListener('click', e => {
          let pacienteSeleccionado = e.target.dataset.id;
          localStorage.setItem('pacienteActual', JSON.stringify(pacienteSeleccionado));
          localStorage.setItem('nombrePaciente', JSON.stringify(e.target.dataset.nom));
          localStorage.setItem('apellidoPaciente', JSON.stringify(e.target.dataset.ape));

          if (e.target.id == 'btn-info-paciente') {
            verInfoPaciente(pacienteSeleccionado);
          }

          if (e.target.id == 'btn-ver-paciente') {
            window.open('editar-historia.html', '_self');
          }
          if (e.target.id == 'btn-control-paciente') {
            window.open('control-asistencias.html', '_self');
          }
          if (e.target.id == 'btn-odograma') {
            window.open('odograma.html', '_self');
          }
          if (e.target.id == 'btn-eliminar-paciente') {
            deletePaciente(pacienteSeleccionado);
          }
        });
      }); //fin del  forEach para loop de todos los botones de la table
      // **********************>>>>> FIN DE CODIGO TABLA SECTION PACIENTES <<<<<<<<<****************

      // **************************TABLA SECTION DASBOARD **************************************
      let drow = `<tr> 
                        <td class="td-id-hidden">${doc.id}</td> 
                        <td><img src='../images/0f10931cfc0a3ee46188.png'/></td>
                        <td>${data.nombre}</td>
                        <td>${data.apellido}</td>
                        <td>${data.edad}</td>
                        <td>${data.celular}</td>
                        <td>${data.tlflocal}</td>                       
                     </tr>`;
      dashboardTbody.innerHTML += drow;
      // >>>>>>>>>>>>>>>>>>>>>> FIN DE CODIGO TABLA SECTION DASHBOARD <<<<<<<<<<<<<<<<<<<<<<<<<<<<

      // **************************TABLA DESCARGA A EXCEL **************************************
      let myAlergias = [];
      let myPersonales = [];
      let myFamiliares = [];
      data.alergias.forEach(el1 => {
        el1 === '' ? '' : myAlergias.push(el1);
      });

      data.antecedentesPersonales.forEach(el2 => {
        el2 === '' ? '' : myPersonales.push(el2);
      });

      data.antecedentesFamiliares.forEach(el3 => {
        el3 === '' ? '' : myFamiliares.push(el3);
      });

      let excelrow = `<tr> 
                        <td class="td-id-hidden">${doc.id}</td> 
                        <td data-a-v="middle">${data.nombre}</td>
                        <td data-a-v="middle">${data.apellido}</td>
                        <td data-a-v="middle" data-a-h="center">${data.edad}</td>
                        <td data-a-v="middle">${data.celular}</td>
                        <td data-a-v="middle">${data.tlflocal}</td>
                        <td data-a-v="middle">${data.fnacimiento}</td>
                        <td data-a-v="middle">${data.email}</td>
                        <td data-a-v="middle" data-a-h="center">${data.genero}</td>
                        <td data-a-v="middle" data-a-h="center">${data.edocivil}</td>
                        <td data-a-v="middle">${data.direccion1}</td>
                        <td data-a-v="middle">${data.contacto}</td>
                        <td data-a-v="middle" data-a-h="center">${data.estatura}</td>
                        <td data-a-v="middle" data-a-h="center">${data.peso}</td>
                        <td data-a-v="middle">${data.tratadopormedico == 'true' ? 'SI' : 'NO'}</td>
                        <td data-a-v="middle">${data.tratadoporenfermedad}</td>
                        <td data-a-v="middle">${data.checktomamedicamento == 'true' ? 'SI' : 'NO'}</td>
                        <td data-a-v="middle">${data.cualesmedicamentos}</td>
                        <td data-a-v="middle">${data.dosismeds}</td>
                        <td data-a-v="middle" data-a-wrap="true">${myAlergias}</td>
                        <td data-a-v="middle">${data.textalergicootros}</td>
                        <td data-a-v="middle" data-a-wrap="true">${myPersonales}</td>
                        <td data-a-v="middle">${data.texthabitos}</td>
                        <td data-a-wrap="true">${myFamiliares}</td>
                        <td data-a-v="middle">${data.otraenfermedad}</td>
                        <td data-a-v="middle">${data.motivoprincipalconsulta}</td>
                        <td data-a-v="middle">${data.fechaultimaconsulta}</td>
                        <td data-a-v="middle">${data.motivoultimaconsulta}</td>
                        <td data-a-v="middle">${data.checkcomplicaciones == 'true' ? 'SI' : 'NO'}</td>
                        <td data-a-v="middle">${data.cualescomplicaciones}</td>
                     </tr>`;

      excelTbody.innerHTML += excelrow;
      myAlergias = [];
      myFamiliares = [];
      myPersonales = [];
      // >>>>>>>>>>>>>>>>>>>>>> FIN DE CODIGO TABLA DESCARGA A EXCEL <<<<<<<<<<<<<<<<<<<<<<<<<<<<
    }); //fin de snapshot iterable
  }); //fin de pacientesData
}; //fin de populateTabla()

onAuthStateChanged(auth, user => {
  if (user) {
    sesion.style.display = 'none';
    logout.style.display = 'inline-block';
    document.getElementById('usuario').innerText = user.email;
    menuLinks.forEach(link => {
      link.style.pointerEvents = 'all';
      link.style.color = 'white';
    });
    imgLogo.style.pointerEvents = 'all';
    barraMenu.classList.toggle('mostrar');
    menuLinks[0].click();
    getUsuarios();
    populateTabla();
  } else {
    seccionActiva(seccionInicio);
    sesion.style.display = 'flex';
    logout.style.display = 'none';
    document.getElementById('usuario').innerText = '';
    imgLogo.style.pointerEvents = 'none';
    menuLinks.forEach(link => {
      link.classList.remove('pulsate-bck');
      link.style.pointerEvents = 'none';
      link.style.color = 'grey';
    });
  }
});

imgLogo.addEventListener('click', () => {
  seccionActiva(seccionInicio);
  menuActivo(menuLinks[3]);
});

formSesion.addEventListener('submit', e => {
  e.preventDefault();
  const email = formSesion.email.value;
  const pw = formSesion.password.value;
  signInWithEmailAndPassword(auth, email, pw)
    .then(cred => {
      const admin = cred.user.email;
      if (admin != 'rony@gmail.com') {
        logout.click();
        alert('Acceso denegado... Ud. no es Administrador');
      }
      formSesion.reset();
    })
    .catch(err => {
      if (err.code == 'auth/network-request-failed') {
        alert('No esta conectado a Internet...conectese');
      }
      if (err.code === 'auth/user-not-found') {
        alert('Usuario No existe.. Registrese');
      }
      if (err.code == 'auth/invalid-email') {
        alert('El email esta mal escrito. Verifique!');
      }
      if (err.code == 'auth/wrong-password') {
        alert('La clave que ingreso no es correcta. Verifique.');
      }
    });
});

forgotPassword.addEventListener('click', e => {
  e.preventDefault();
  const email = formSesion.email.value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Se ha enviado un correo de restablecimiento de contraseña al email: ' + email);
    })
    .catch(error => {
      alert('Ocurrio un error!...' + error.message);
    });
});

hamburguesa.addEventListener('click', () => {
  barraMenu.classList.toggle('mostrar');
});

menu.forEach(item => {
  item.addEventListener('click', () => {
    barraMenu.classList.toggle('mostrar');
  });
});

menuLinks[0].addEventListener('click', () => {
  tablaContainer.style.display = 'block';
  infoContainer.style.display = 'none';
  menuActivo(menuLinks[0]);
  seccionActiva(seccionPacientes);
});

menuLinks[1].addEventListener('click', () => {
  menuActivo(menuLinks[1]);
  seccionActiva(seccionAgenda);
  horario();
  populateAgenda();
});

menuLinks[2].addEventListener('click', () => {
  menuActivo(menuLinks[2]);
  seccionActiva(seccionDashboard);
  getDatos();
  populateAgenda();
});

logout.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      alert('Ha cerrado la sesion! ...Hasta luego.');
    })
    .catch(err => {
      alert('Ocurrio un error al cerrar la sesion!');
    });
});

buscador.addEventListener('input', e => {
  tableSearcher('tabla-paciente', e.target.value.toLowerCase());
});

function verInfoPaciente(id) {
  tablaContainer.style.display = 'none';
  infoContainer.style.display = 'block';

  const docRef = doc(db, 'pacientes', id);
  getDoc(docRef)
    .then(doc => {
      let tableInfo = document.getElementById('info-pacientes-tbody');
      tableInfo.innerHTML = '';
      const historia = doc.data();
      let row = `<tr class="pad-left"> 
                         <td id="td-titulo-info">Historia: ${' ' + historia.nombre + ' ' + historia.apellido}
                         </td> 
                         <td data-label="Cedula">${historia.cedula}</td>  
                         <td data-label="Fecha de Nacimiento">${historia.fnacimiento}</td>
                         <td data-label="Edad">${historia.edad}</td>
                         <td data-label="Telefono Celular">${historia.celular}</td>
                         <td data-label="Telefono Local">${historia.tlflocal}</td>
                         <td data-label="Direccion">${historia.direccion1}</td>
                         <td data-label="Contacto">${historia.contacto}</td>
                         <td data-label="Email">${historia.email}</td>
                         <td data-label="Genero">${historia.genero}</td>
                         <td data-label="Estado Civil">${historia.edocivil}</td>
                         <td data-label="Estatura (mts.)">${historia.estatura}</td>
                         <td data-label="Peso (Kgs.)">${historia.peso}</td>
                         <td data-label="Esta siendo Tratado por un Medico?">${
                           historia.tratadopormedico ? 'si' : 'no'
                         }</td>
                         <td data-label="Es Tratado por alguna enfermedad?">${historia.tratadoporenfermedad}</td>
                         <td data-label="Toma Medicamentos?">${historia.checktomamedicamento ? 'si' : 'no'}</td>
                         <td data-label="Cuales medicamentos">${historia.cualesmedicamentos}</td>
                         <td data-label="Dosis de los medicamentos">${historia.dosismeds}</td>
                         <td data-label="Alergias">${historia.alergias.filter(a => {
                           return a != '';
                         })}</td>
                         <td data-label="Otras Alergias">${historia.textalergicootros}</td>
                         <td data-label="Antecedentes Personales">${historia.antecedentesPersonales.filter(p => {
                           return p != '';
                         })}</td>
                         <td data-label="Antecedentes Familiares">${historia.antecedentesFamiliares.filter(f => {
                           return f != '';
                         })}</td>
                         <td data-label="Sufre alguna otra enfermedad?">${historia.otraenfermedad}</td>
                         <td data-label="Habitos">${
                           historia.texthabitos
                         }</td>                                                               
                  </tr>`;
      tableInfo.innerHTML += row;
    })
    .catch(error => console.log(error.message));
} //fin de info paciente

btnCerrarInfo.addEventListener('click', () => {
  infoContainer.style.display = 'none';
  tablaContainer.style.display = 'block';
});

function populateAgenda() {
  let timeLista = document.getElementById('ul-timeline');
  let fecha = dateToAMD(new Date());
  let divCitasPendientes = document.querySelector('.dash-card.customer');
  const consultaAgenda = query(collection(db, 'citas'), where('fecha', '>=', fecha), orderBy('fecha', 'asc'));
  const allCitas = onSnapshot(consultaAgenda, snapshot => {
    divCitasPendientes.innerHTML = '<h1>AGENDA</h1> <h2>Citas Pendientes</h2>';
    timeLista.innerHTML = '';
    snapshot.forEach(doc => {
      let data = doc.data();
      let found = usuariosWeb.find(p => p.id === data.paciente);

      let fila = `<li>
          <div> 
               <span class="header-cita">           
                 <h1>Dia: ${strToDMA(data.fecha)}</h1>
                 <h1>Hora: ${data.hora}</h1>
               </span>

               <h3>
               <span class="bold">Paciente:</span> ${
                 data.status === 'Bloqueada' ? 'Dra. Vanessa Mijares' : found.nombre + ' ' + found.apellido
               }
               </h3>
               <h3><span class="bold">Mensaje:</span> ${data.msg}</h3>   
                <h3><span class="bold">Telefono:</span> ${data.telefono}</h3>   
               <button class="btn-eliminar-cita t-tip top" tip="Eliminar Esta Cita" data-idcita=${doc.id}>${
        data.status === 'Bloqueada' ? 'Desbloquear' : 'Eliminar'
      }</button>
               <span id="id-cita-eliminar">${doc.id}</span>         
          </div>
          </li>`;
      timeLista.innerHTML += fila;

      //seleccionar todos los botones eliminar cita
      const allButtons = document.querySelectorAll('.btn-eliminar-cita');
      allButtons.forEach(boton => {
        boton.addEventListener('click', e => {
          let idCita = e.target.dataset.idcita;
          deleteCita(idCita);
        });
      });
      // ************************* CODIGO DE LA AGENDA PENDIENTE DEL DASHBOARD ********************

      let divCita = `
           <div class="dash-customer-wrapper">
              <img class="dash-customer-image" src="images/5ded0f468f52742d8b92.png" alt="clock">
              <div class="dash-customer-name">
              <h4>${found.nombre} ${found.apellido}</h4>
              <p>Dia: ${strToDMA(data.fecha)}</p>
              <p>Hora: ${data.hora}</p>                    
           </div>
        </div>          
          `;
      divCitasPendientes.innerHTML += divCita;
      // ************************* FIN DEL CODIGO DE LA AGENDA PENDIENTE DEL DASHBOARD ***************
    }); //fin del  forEach para el snapshot
    setInViewClass();
  });
}

//funcion para obtener el resto de horas que quedan sin apartar en el dia
function horario() {
  const fecha = dateToAMD(new Date()); //fecha de hoy
  const listaHoras = document.getElementById('listaHoras');
  //array de horas por defecto de 7 a 7 (formato militar)
  var horas = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const citasRef = collection(db, 'citas');
  const q = query(citasRef, where('fecha', '==', fecha));

  onSnapshot(q, snapshot => {
    fechaAgenda.innerHTML = strToDMA(fecha);
    snapshot.forEach(doc => {
      let position = horas.indexOf(doc.data().hora);
      if (position >= 0) {
        horas.splice(position, 1);
      }
    });
    listaHoras.innerHTML = '';
    horas.forEach(item => {
      if (item.length > 0) {
        listaHoras.innerHTML += `
        <div>
        <span>${item}</span>
        <button class="btn-bloquear" data-idhora=${item}>Bloquear</button>
        </div>
        `;
      }
    });
    //seleccionar todos los botones eliminar cita
    const allHoras = document.querySelectorAll('.btn-bloquear');
    allHoras.forEach(boton => {
      boton.addEventListener('click', e => {
        let horaX = e.target.dataset.idhora;
        bloquearHora(fecha, horaX);
      });
    }); //fin del  forEach para loop de todos los botones de la table
  });
} //END OF HORARIO()

function bloquearHora(fechaBloquear, horaBloquear) {
  addDoc(collection(db, 'citas'), {
    fecha: fechaBloquear,
    hora: horaBloquear,
    telefono: 'Dra. Vanessa',
    msg: 'Hora bloqueada por Administrador',
    paciente: auth.currentUser.uid,
    status: 'Bloqueada',
    createdAt: serverTimestamp(),
  });
  window.scroll(0, 5);
}

navToggle.addEventListener('click', () => {
  navShow();
});
closeNav.addEventListener('click', () => {
  hideNav();
});

// hide nav after clicked outside of nav
navOverlay.addEventListener('click', e => {
  hideNav();
});

function navShow() {
  navOverlay.style.transition = 'all 0.1s ease';
  navOverlay.classList.add('open');
  nav.style.transition = 'all 0.3s ease 0.5s';
  nav.classList.add('open');
}

function hideNav() {
  nav.style.transition = 'all 0.3s ease';
  nav.classList.remove('open');
  navOverlay.style.transition = 'all 0.2s ease 0.1s';
  navOverlay.classList.remove('open');
}

function getUsuarios() {
  onSnapshot(collection(db, 'users'), snapshot => {
    snapshot.forEach(usuario => {
      let currentID = usuario.id;
      let appObj = { ...usuario.data(), ['id']: currentID };
      usuariosWeb.push(appObj);
    });
  });
}

window.addEventListener('scroll', callbackFunc);
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function callbackFunc() {
  var items = document.querySelectorAll('.timeline li');
  for (var i = 0; i < items.length; i++) {
    if (isElementInViewport(items[i])) {
      items[i].classList.add('in-view');
    } else {
      items[i].classList.remove('in-view');
    }
    if (i == 0) {
      items[i].classList.add('in-view');
    }
  } //end of for
}

function setInViewClass() {
  document.querySelector('#ul-timeline li:first-child')?.classList.add('in-view');
  window.scroll(0, 5);
}

//DASHBOARD CODE ****************************

function getDatos() {
  const consultaIngresos = query(collection(db, 'controlasistencias'));
  onSnapshot(collection(db, 'citas'), snapshot => {
    snapshot.forEach(doc => {
      cardCitas.innerHTML = snapshot.docs.length;
    });
  });

  onSnapshot(consultaIngresos, snapshot => {
    let ingresos = 0;
    snapshot.forEach(doc => {
      const fControl = Date.parse(doc.data().fecha);
      const fCorte = Date.parse('2021-12-31');

      let montoDolares = 0;

      if (!isNaN(doc.data().monto)) {
        fControl > fCorte ? (montoDolares = parseInt(Number(doc.data().monto))) : (montoDolares = 0);
        fControl > fCorte
          ? console.log('fecha control es mayor', doc.data().fecha, fControl, 'fecha corte', fCorte, doc.data().monto)
          : '';
      }
      cardActividad.innerHTML = snapshot.docs.length;
      ingresos += montoDolares;
    });
    cardIngresos.innerHTML = '$' + ingresos;
  });
}

function menuActivo(menulink) {
  Array.from(menuLinks).forEach(el => {
    el.style.color = 'white';
    el.classList.remove('pulsate-bck');
  });
  menulink.style.color = 'rgb(14, 231, 231)';
  menulink.classList.add('pulsate-bck');
}

function seccionActiva(seccion) {
  Array.from(allSections).forEach(el => {
    el.style.display = 'none';
  });
  seccion.style.display = 'block';
}

btnExcel.addEventListener('click', () => {
  TableToExcel.convert(document.getElementById('tabla-excel'), {
    name: 'pacientes.xlsx',
    sheet: {
      name: 'data',
    },
  });
});

function tableSearcher(tablename, keyword) {
  const targetRows = document.querySelectorAll('#' + tablename + ' > tbody > tr');
  if (targetRows.length == 0) {
    return;
  }
  for (const tableCell of targetRows) {
    const row = tableCell;
    const value = tableCell.textContent.toLowerCase();
    if (value.search(keyword) === -1) {
      row.style.display = 'none';
    }
    if (keyword === '' || keyword === ' ') {
      row.style.display = 'revert';
    }
  }
}

function deleteCita(id) {
  const eliminar = confirm('Esta Seguro que desea eliminar esta Cita?');
  if (eliminar) {
    const docRef = doc(db, 'citas', id);
    deleteDoc(docRef)
      .then(result => {
        horario();
        alert('Cita Eliminada OK!');
        window.scroll(0, 10);
      })
      .catch(error => {
        alert('Error: ', error.message);
      });
  }
} //FIN DE DELETE CITA

function deletePaciente(id) {
  const eliminar = confirm('Esta Seguro que quiere Eliminar este Paciente?');
  if (eliminar) {
    const docRef = doc(db, 'pacientes', id);
    const queryControles = query(collection(db, 'controlasistencias'), where('idPaciente', '==', id));
    deleteDoc(docRef);
    //delete controles asociados al paciente
    getDocs(queryControles).then(res => {
      res.forEach(doc => {
        deleteControl(doc.id);
      });
    });
  }
}

function deleteControl(id) {
  const ctrlRef = doc(db, 'controlasistencias', id);
  deleteDoc(ctrlRef).then(result => {
    alert('Paciente y Controles asociados Eliminados!');
  });
}
