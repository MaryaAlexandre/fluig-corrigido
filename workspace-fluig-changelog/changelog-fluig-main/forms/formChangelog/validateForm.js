function validateForm(form) {
  var hasErros = false;
  var message = "";

  if (isEmpty(form.getValue("numeroVersao"))) {
    message += getMessage("Numero da Versao", 1);
    hasErros = true;
  }

  if (isEmpty(form.getValue("dataPublicacao"))) {
    message += getMessage("Data de Publicacao", 1);
    hasErros = true;
  }

  if (isEmpty(form.getValue("statusVersao"))) {
    message += getMessage("Status da Versao", 1);
    hasErros = true;
  }

  if (isEmpty(form.getValue("titulo"))) {
    message += getMessage("Titulo da Release", 1);
    hasErros = true;
  }

  if (isEmpty(form.getValue("tagsSelecionadas"))) {
    message += getMessage("Tags da Versao", 1);
    hasErros = true;
  }

  // Validar  na tabela pai-filho
  var rows = document.querySelectorAll("#itemsBody tr");
  if (rows.length === 0) {
    message += getMessage("Adicione pelo menos um item de mudanca", 3);
    hasErros = true;
  } else {
    rows.forEach(function (row, i) {
      var idx = row.getAttribute("data-index");
      var cat = document.getElementById("itemCategoria___" + idx);
      var desc = document.getElementById("itemDescricao___" + idx);

      if (cat && isEmpty(cat.value)) {
        message += getMessage("Categoria (linha " + (i + 1) + ")", 1);
        hasErros = true;
      }
      if (desc && isEmpty(desc.value)) {
        message += getMessage("Descricao (linha " + (i + 1) + ")", 1);
        hasErros = true;
      }
    });
  }

  if (hasErros) {
    var feedbackDiv = document.getElementById("div_feedback");
    if (feedbackDiv) {
      feedbackDiv.style.display = "block";
      feedbackDiv.innerHTML =
        "<ul class='alert-danger'>" + message + "</ul>";
    }
    throw (
      "<ul style='list-style-type:disc;padding-left:40px' class='alert alert-danger'>" +
      message +
      "</ul>"
    );
  }

  
  var fb = document.getElementById("div_feedback");
  if (fb) {
    fb.style.display = "none";
    fb.innerHTML = "";
  }
}


function isEmpty(valor) {
  return (
    valor == null ||
    valor === "" ||
    typeof valor === "undefined" ||
    valor === "null"
  );
}

function getMessage(texto, tipoMensagem) {
  switch (tipoMensagem) {
    case 1:
      return "<li>Campo: <b>" + texto + "</b> nao pode estar vazio</li>";
    case 2:
      return "<li>Selecione uma opcao em: <b>" + texto + "</b></li>";
    case 3:
      return "<li><b>" + texto + "</b></li>";
    case 4:
      return "<li>Campo <b>" + texto + "</b> nao pode ser anterior a data da solicitacao</li>";
    default:
      return "<li>" + texto + "</li>";
  }
}

function createFormAdapter() {
  return {
    getValue: function (id) {
      var el = document.getElementById(id);
      return el ? el.value : "";
    },
  };
}