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



document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formCadastro");
    const botao = document.getElementById("btnEnviar");
    const cpf = document.getElementById("cpf");
    const telefone = document.getElementById("telefone");

    // OUTROS
    const outrosCheck = document.getElementById("outrosCheck");
    const outrosTexto = document.getElementById("outrosTexto");

    outrosCheck.addEventListener("change", function () {
        outrosTexto.disabled = !this.checked;
        outrosTexto.required = this.checked;
        if (!this.checked) outrosTexto.value = "";
    });

    // TELEFONE
    telefone.addEventListener("input", function () {
        let v = telefone.value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);

        if (v.length > 6)
            telefone.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2)
            telefone.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else
            telefone.value = v;
    });

    // CPF MÁSCARA
    cpf.addEventListener("input", function () {
        let v = cpf.value.replace(/\D/g, "").slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        cpf.value = v;
    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++)
            soma += parseInt(cpf[i]) * (10 - i);

        let resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++)
            soma += parseInt(cpf[i]) * (11 - i);

        resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;

        return resto === parseInt(cpf[10]);
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!validarCPF(cpf.value)) {
            alert("CPF inválido!");
            cpf.focus();
            return;
        }

        botao.disabled = true;
        botao.innerText = "Enviando...";

        const data = new FormData(form);

        const response = await fetch("https://formspree.io/f/xykogjvg", {
            method: "POST",
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            window.location.href = "https://jeniferwj.github.io/dev-tech/obrigado.html";
        } else {
            alert("Erro ao enviar. Tente novamente.");
            botao.disabled = false;
            botao.innerText = "Confirmar Inscrição";
        }
    });

});