import { db, auth } from '../js/firebaseconfig';
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
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { dateToAMD, strToDMA } from '../commons/utilities';

import '../css/pacientes.css';

const hamburguesa = document.getElementById('hamburguesa');
const barraMenu = document.getElementById('barra__menu');
const menu = document.querySelectorAll('nav ul li');
const menuLinks = document.querySelectorAll('nav ul li a');
const logout = document.getElementById('logout-link');
const seccionPacientes = document.getElementById('seccion__pacientes');
const seccionAgenda = document.getElementById('seccion__agenda');
const seccionDashboard = document.getElementById('seccion__dashboard');
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
const allSections = document.querySelectorAll('section');
const btnExcel = document.getElementById('btn-excel');
const btnAddPaciente = document.querySelector('.btn-add-paciente');
const pacientesTbody = document.getElementById('pacientes-tbody');

var usuariosWeb = [];

onAuthStateChanged(auth, user => {
  if (user) {
    getAllPacientes();
    document.getElementById('usuario').innerText = user.email;
    barraMenu.classList.toggle('mostrar');
    menuLinks[0].click();
  }
});

btnAddPaciente.addEventListener('click', () => {
  window.open('historia.html');
});

buscador.addEventListener('input', e => {
  tableSearcher('tabla-paciente', e.target.value.toLowerCase());
});

//event delegation para el menu de la tabla principal de pacientes
pacientesTbody.addEventListener('click', e => {
  const elemento = e.target;
  let pacienteSeleccionado = e.target.dataset.docid;
  localStorage.setItem('pacienteActual', JSON.stringify(pacienteSeleccionado));
  localStorage.setItem('nombrePaciente', JSON.stringify(e.target.dataset.nom));
  localStorage.setItem('apellidoPaciente', JSON.stringify(e.target.dataset.ape));

  if (elemento.id == 'btn-info-paciente') {
    verInfoPaciente(elemento.dataset.docid);
  }
  if (elemento.id == 'btn-editar-paciente') {
    window.open('editar-historia.html');
  }
  if (elemento.id == 'btn-control-paciente') {
    window.open('control-asistencias.html');
  }
  if (elemento.id == 'btn-odograma') {
    window.open('odograma.html');
  }
  if (elemento.id == 'btn-eliminar-paciente') {
    deletePaciente(elemento.dataset.docid);
  }
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
  infoContainer.style.display = 'none';
  tablaContainer.style.display = 'block';
  menuActivo(menuLinks[0]);
  seccionActiva(seccionPacientes);
});

menuLinks[1].addEventListener('click', () => {
  menuActivo(menuLinks[1]);
  seccionActiva(seccionAgenda);
  getUsuarios();
  horario();
  populateAgenda();
});

menuLinks[2].addEventListener('click', () => {
  menuActivo(menuLinks[2]);
  seccionActiva(seccionDashboard);
  getDatos();
  populateAgenda();
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
}

btnCerrarInfo.addEventListener('click', () => {
  menuLinks[0].click();
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
               <button class="btn btn-eliminar-cita t-tip top" tip="Eliminar Esta Cita" data-idcita=${doc.id}>${
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
    const queryHistoria = query(collection(db, 'historias'), where('idPaciente', '==', id));
    deleteDoc(docRef);
    //delete controles asociados al paciente
    getDocs(queryControles).then(res => {
      res.forEach(doc => {
        deleteControl(doc.id);
      });
    });

    getDocs(queryHistoria).then(res => {
      res.forEach(doc => {
        deleteHistoria(doc.id);
      });
    });
  }
}

function deleteControl(id) {
  const ctrlRef = doc(db, 'controlasistencias', id);
  deleteDoc(ctrlRef);
}

function deleteHistoria(id) {
  const historRef = doc(db, 'historias', id);
  deleteDoc(historRef);
}

function templatePacientes(paramsnapdoc, docid) {
  const paciente = paramsnapdoc;
  let prow = `<tr> 
            <td id="td-titulo" class="hidden">Paciente</td>   
            <td id="td-id-hidden">${docid}</td>                          
            <td data-label="Nombre">${paciente.nombre}</td>
            <td data-label="Apellido">${paciente.apellido}</td>
            <td data-label="Edad">${paciente.edad}</td>
            <td data-label="Telefono">${paciente.celular}</td>
            <td data-label="" class="ver-paciente">  
                <button class="td-btn info t-tip top" id="btn-info-paciente" tip="Ver Historia" data-docid=${docid}  data-nom=${paciente.nombre} data-ape=${paciente.apellido}>
                   <ion-icon name="information-circle-outline" class="btn-menu-table info"></ion-icon>
                </button> 
                <button  class="td-btn t-tip top" id="btn-editar-paciente" tip="Editar Historia" data-docid=${docid}  data-nom=${paciente.nombre} data-ape=${paciente.apellido}>
                   <ion-icon name="construct" class="btn-menu-table"></ion-icon>
                </button>        
                <button class="td-btn t-tip top" id="btn-control-paciente" tip="Control Asistencia" data-docid=${docid}  data-nom=${paciente.nombre} data-ape=${paciente.apellido}>
                   <ion-icon name="clipboard" class="btn-menu-table"></ion-icon>   
                </button>                       
                <button  class="td-btn odo t-tip top" id="btn-odograma" tip="Odograma" data-docid=${docid}  data-nom=${paciente.nombre} data-ape=${paciente.apellido}>
                   <span class="img-btn"><img src="../images/68a7a414591f9f349923.png" alt="odograma"></span>
                </button>                            
                <button  class="td-btn t-tip left" id="btn-eliminar-paciente" tip="Eliminar este Paciente" data-docid=${docid}>
                   <ion-icon name="trash" class="btn-menu-table"></ion-icon>
                </button>
            </td>
      </tr>`;

  pacientesTbody.innerHTML += prow;
}

const getAllPacientes = async () => {
  const qallpacientes = query(collection(db, 'pacientes'), orderBy('nombre', 'asc'));
  onSnapshot(qallpacientes, snapshot => {
    pacientesTbody.innerHTML = ' ';
    snapshot.forEach(doc => {
      cardPacientes.innerHTML = snapshot.docs.length;
      const paciente = doc.data();
      templatePacientes(paciente, doc.id);
    });
  });
};

logout.addEventListener('click', e => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      window.close();
      window.open('index.html', '_self');
    })
    .catch(err => {
      alert('error al cerrar la sesion!');
    });
});
