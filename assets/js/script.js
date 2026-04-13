function mensagem() {
    alert("Inscrição realizada com sucesso.");
}

const dataEvento = new Date(2026, 7, 23, 19, 0, 0); 

function atualizarContador() {
  const agora = new Date();
  const diferenca = dataEvento - agora;

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);

  document.getElementById("tempo").innerText =
    `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
}

setInterval(atualizarContador, 1000);

atualizarContador();

let outrosCheck = document.getElementById("outrosCheck");
let outrosTexto = document.getElementById("outrosTexto");

outrosCheck.addEventListener("change", function () {

    if (outrosCheck.checked) {
        outrosTexto.disabled = false;
        outrosTexto.required = true;
    } else {
        outrosTexto.disabled = true;
        outrosTexto.required = false;
        outrosTexto.value = "";
    }

});