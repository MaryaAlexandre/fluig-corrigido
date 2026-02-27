
function displayFields(form, customHTML) {
  var usuario = typeof getValue === "function" ? getValue("WKUser") : "admin";
  var activity = typeof getValue === "function" ? getValue("WKNumState") : "0";
  var MODE = form.getFormMode ? form.getFormMode() : "ADD";

  if (customHTML && customHTML.append) {
    customHTML.append("<script>");
    customHTML.append("function getUser(){ return '" + usuario + "'};");
    customHTML.append("function getActivity(){ return '" + activity + "'};");
    customHTML.append("function getMode(){ return '" + MODE + "'};");
    customHTML.append("</script>");
  }

  
  setVisible("div_feedback", false);

  if (activity !== "0" && activity !== "4") {
    setVisible("btn_add_item", false);

    if (form.getValue && form.getValue("statusVersao") === "Publicado") {
        setVisible("btn_publicar", false);
    }
  }

  if (MODE === "ADD") {
    var hoje = new Date();
    var dataFormatada =
      pad(hoje.getDate()) +
      "/" +
      pad(hoje.getMonth() + 1) +
      "/" +
      hoje.getFullYear();

    setFieldValue("createdBy", usuario);
    setFieldValue("createdDate", dataFormatada);
  }

  if (MODE === "EDIT") {
    var tagsSalvas = form.getValue("tagsSelecionadas");
    if (tagsSalvas) {
      setFieldValue("tagsSelecionadas", tagsSalvas);
    }
}


function setVisible(id, visible) {
  var el = document.getElementById(id);
  if (el) {
    el.style.display = visible ? "" : "none";
  }
}

function setFieldValue(id, value) {
  var el = document.getElementById(id);
  if (el) el.value = value;
}

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}
}