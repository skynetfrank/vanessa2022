import { auth } from './js/firebaseconfig';
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import './css/index.css';

const formSesion = document.getElementById('form-sesion');
const forgotPassword = document.getElementById('forgot-pw');
const btnInicio = document.querySelector('.btn');
const btnCerrar = document.querySelector('.btn.cerrar');
const sesion = document.getElementById('sesion');

btnCerrar.addEventListener('click', () => {
  sesion.style.display = 'none';
  btnInicio.style.display = 'block';
});

btnInicio.addEventListener('click', () => {
  sesion.style.display = 'flex';
  btnInicio.style.display = 'none';
});

onAuthStateChanged(auth, user => {
  if (user) {
    window.open('pacientes.html', '_self');
  } else {
    sesion.style.display = 'none';
    btnInicio.style.display = 'block';
  }
});

formSesion.addEventListener('submit', e => {
  e.preventDefault();
  const email = formSesion.email.value;
  const pw = formSesion.password.value;
  signInWithEmailAndPassword(auth, email, pw)
    .then(cred => {
      const admin = cred.user.email;
      if (admin != 'admin@demo.com') {
        alert('Acceso denegado... Ud. no es Administrador');
        signOut(auth);
      }
      formSesion.reset();
      sesion.style.display = 'none';
    })
    .catch(err => {
      if (err.code == 'auth/network-request-failed') {
        alert('No hay conexion a Internet!');
      }
      if (err.code === 'auth/user-not-found') {
        alert('Usuario No existe');
      }
      if (err.code == 'auth/invalid-email') {
        alert('email mal escrito!');
      }
      if (err.code == 'auth/wrong-password') {
        alert('Clave incorrecta!');
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

formSesion.addEventListener('focusin', e => {
  e.target.parentNode.classList.add('focus');
});

formSesion.addEventListener('focusout', e => {
  if (e.target.value == '' || e.target.value == ' ') {
    e.target.parentNode.classList.remove('focus');
  }
});
