function ordenateResponse (data) {
  if (data.length > 100) {
    let indexOfSplice = data.length - 101;
    /** 100 de la cantidad que piensas mostrar pero los arreglos se muestran a partir del indice 0 */ 
    data.splice(indexOfSplice)
  }
  return data;
}

module.exports = {ordenateResponse};