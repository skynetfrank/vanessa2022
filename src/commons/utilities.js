//funcion para convertir fecha a formato DD-MM-AAAA
export function strToDMA(nfecha) {
  //parametro: string en forma AAAA-MM-DD
  //return: string en forma DD-MM-AAAA
  const dma = nfecha.split('-').reverse().join('-');
  return dma;
}

export function dateToAMD(cfecha) {
  //parametro: una fecha tipo Date();
  //return: string en forma AAAA-MM-DD
  let year = cfecha.getFullYear(); // YYYY
  let month = ('0' + (cfecha.getMonth() + 1)).slice(-2); // MM
  let day = ('0' + cfecha.getDate()).slice(-2); // DD
  return year + '-' + month + '-' + day;
}

export function dolarToday(inputcambio, inputdolares, inputbs) {
  fetch('https://s3.amazonaws.com/dolartoday/data.json')
    .then(res => res.json())
    .then(data => {
      const cambio = data.USD.dolartoday;
      inputcambio.value = cambio;
      inputcambio.parentNode.classList.add('focus');
      inputbs.parentNode.classList.add('focus');
      inputbs.value = (parseFloat(cambio) * parseFloat(inputdolares.value)).toFixed(2);
    })
    .catch(err => {
      inputcambio.value = 0;
      inputbs.value = (parseFloat(cambio) * parseFloat(inputdolares.value)).toFixed(2);
      alert('Dolar-Today No esta disponible, ingrese el cambio de forma manual');
    });
}

export function firstUpperCase(param) {
  let param2 = param.toLowerCase().trim();
  return param2.charAt(0).toUpperCase() + param2.slice(1);
}

export function calcEdad(fnacimiento) {
  const fechaActual = new Date();
  const anoActual = parseInt(fechaActual.getFullYear());
  const mesActual = parseInt(fechaActual.getMonth() + 1);
  const diaActual = parseInt(fechaActual.getDate());
  const anoNacimiento = parseInt(String(fnacimiento).substring(0, 4));
  const mesNacimiento = parseInt(String(fnacimiento).substring(5, 7));
  const diaNacimiento = parseInt(String(fnacimiento).substring(8, 10));

  let edad = 0;
  edad = anoActual - anoNacimiento;
  if (mesActual < mesNacimiento) {
    edad--;
  } else if (mesActual == mesNacimiento) {
    if (diaActual < diaNacimiento) {
      edad--;
    }
  }
  return edad;
}
