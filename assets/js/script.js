// FUNÇÃO DE MENSAGEM
function mensagem() {
    alert("Inscrição realizada com sucesso.");
    return false; // impede envio do form (caso use onsubmit)
}

// CONTADOR DO EVENTO
const dataEvento = new Date(2026, 7, 23, 19, 0, 0); 

function atualizarContador() {
    const agora = new Date();
    const diferenca = dataEvento - agora;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    // verifica se o elemento existe antes de usar
    let tempo = document.getElementById("tempo");

    if (tempo) {
        tempo.innerText = `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
    }
}

// executa contador a cada 1 segundo
setInterval(atualizarContador, 1000);
atualizarContador();


// CHECKBOX "OUTROS"
document.addEventListener("DOMContentLoaded", function () {

    let outrosCheck = document.getElementById("outrosCheck");
    let outrosTexto = document.getElementById("outrosTexto");

    outrosCheck.addEventListener("change", function () {

        if (this.checked) {
            outrosTexto.disabled = false;
            outrosTexto.required = true;
        } else {
            outrosTexto.disabled = true;
            outrosTexto.required = false;
            outrosTexto.value = "";
        }

    });

});

const check = document.getElementById("outrosCheck");
const campo = document.getElementById("outrosTexto");

if (check) {
    check.addEventListener("change", () => {
        campo.disabled = !check.checked;
    });
}