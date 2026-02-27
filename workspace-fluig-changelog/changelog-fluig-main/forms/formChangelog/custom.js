
var itemIndex = 0;

function addItem() {
  var tbody = document.getElementById("itemsBody");
  var hint = document.getElementById("emptyHint");
  if (hint) hint.style.display = "none";

  var tr = document.createElement("tr");
  tr.setAttribute("data-index", itemIndex);

  tr.innerHTML =
    '<td>' +
      '<select name="itemCategoria___' + itemIndex + '" id="itemCategoria___' + itemIndex + '">' +
        '<option value="">Selecione...</option>' +
        '<option value="Novidade">Novidade</option>' +
        '<option value="Melhoria">Melhoria</option>' +
        '<option value="Correcao">Correcao</option>' +
        '<option value="Seguranca">Seguranca</option>' +
      '</select>' +
    '</td>' +
    '<td>' +
      '<input type="text" name="itemDescricao___' + itemIndex + '" id="itemDescricao___' + itemIndex + '" placeholder="Descricao da mudanca..." />' +
    '</td>' +
    '<td>' +
      '<select name="itemImpacto___' + itemIndex + '" id="itemImpacto___' + itemIndex + '">' +
        '<option value="">--</option>' +
        '<option value="Baixo">Baixo</option>' +
        '<option value="Medio">Medio</option>' +
        '<option value="Alto">Alto</option>' +
      '</select>' +
    '</td>' +
    '<td>' +
      '<input type="text" name="itemModulo___' + itemIndex + '" id="itemModulo___' + itemIndex + '" placeholder="Ex: Financeiro" />' +
    '</td>' +
    '<td style="text-align:center">' +
      '<button type="button" class="btn-icon-danger" onclick="removeItem(this)" title="Remover item">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>' +
      '</button>' +
    '</td>';

  tbody.appendChild(tr);
  itemIndex++;
}

function removeItem(btn) {
  var tr = btn.closest("tr");
  tr.parentNode.removeChild(tr);

  var tbody = document.getElementById("itemsBody");
  var hint = document.getElementById("emptyHint");
  if (tbody.children.length === 0 && hint) {
    hint.style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  // tags salvas
  var tagsSalvas = document.getElementById("tagsSelecionadas").value;
  if (tagsSalvas && tagsSalvas !== "tagsSelecionadas") {
    var arrayTags = tagsSalvas.split(",");
    var badges = document.querySelectorAll(".tag-badge");
    badges.forEach(function (badge) {
      if (arrayTags.indexOf(badge.getAttribute("data-tag")) !== -1) {
        badge.classList.add("active");
      }
    });
  }

  // pra clicar nas tags
  document.querySelectorAll(".tag-badge").forEach(function (badge) {
    badge.addEventListener("click", function () {
      this.classList.toggle("active");
      var selecionadas = [];
      document.querySelectorAll(".tag-badge.active").forEach(function (b) {
        var t = b.getAttribute("data-tag");
        if (t) selecionadas.push(t);
      });
      document.getElementById("tagsSelecionadas").value = selecionadas.join(",");
    });
  });
});

document.addEventListener("click", function (e) {
  var btn = e.target.closest("[data-action]");
  if (!btn) return;

  var container = btn.closest(".file-container");
  if (!container) return;

  var inputNome = container.querySelector(".anexo");
  var inputId = container.querySelector(".anexoId");
  var action = btn.getAttribute("data-action");

  if (action === "upload") {
    if (inputId.value) {
      alert("Ja existe um arquivo anexado. Remova antes de enviar outro.");
      return;
    }

    var extensions = btn.getAttribute("data-extensions") || ".png,.jpg,.jpeg";
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = extensions;
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function (ev) {
      var file = ev.target.files[0];
      if (!file) return;

      inputId.value = "doc_" + Date.now();
      inputNome.value = file.name;
      alert("Upload concluido: " + file.name);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  if (action === "trash") {
    inputId.value = "";
    inputNome.value = "";
    alert("Arquivo removido.");
  }
});