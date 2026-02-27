function validateForm(){
    var msg= '';
    if (form.getValue("dataPublicacao") == ''){
        msg += 'Data de Publicação é obrigatória!\n'   
    }
    if (form.getValue("numeroVersao")== ''){
        msg += 'Numero da Versão é obrigatório!\n'
    }
    if (form.getValue("titulo") == ''){
        msg += 'Título é obrigatório!\n'  
    }
    if ( msg != ''){
        fluigForm.showAlert(msg);
    }
}