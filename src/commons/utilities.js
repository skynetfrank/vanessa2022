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
