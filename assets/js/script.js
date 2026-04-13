// TESTE DE CARREGAMENTO
console.log("JS carregado");

// ==============================
// FUNÇÃO DE MENSAGEM
// ==============================
function mensagem() {
    alert("Inscrição realizada com sucesso.");
    return false; // impede envio do form (caso use onsubmit)
}

// ==============================
// CONTADOR DO EVENTO
// ==============================
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


// ==============================
// CHECKBOX "OUTROS"
// ==============================
document.addEventListener("DOMContentLoaded", function () {

    let outrosCheck = document.getElementById("outrosCheck");
    let outrosTexto = document.getElementById("outrosTexto");

    // segurança: evita erro se não existir na página
    if (!outrosCheck || !outrosTexto) {
        console.log("Elementos 'outros' não encontrados nesta página");
        return;
    }

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