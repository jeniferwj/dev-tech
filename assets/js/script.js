// ========================================
// CONFIGURAÇÃO SUPABASE
// ========================================

const supabaseClient = supabase.createClient(
    "https://chcshzruympfsqxqzfay.supabase.co",
    "sb_publishable_fvrhSvXEV0KrY1UqWI88kQ_Hcqs5RYT"
);


// ========================================
// CONTADOR DO EVENTO
// ========================================

const dataEvento = new Date(2026, 7, 23, 19, 0, 0);

function atualizarContador() {

    const agora = new Date();

    const diferenca = dataEvento - agora;

    const dias = Math.floor(
        diferenca / (1000 * 60 * 60 * 24)
    );

    const horas = Math.floor(
        (diferenca / (1000 * 60 * 60)) % 24
    );

    const minutos = Math.floor(
        (diferenca / (1000 * 60)) % 60
    );

    const segundos = Math.floor(
        (diferenca / 1000) % 60
    );

    // verifica se o elemento existe antes de usar
    let tempo = document.getElementById("tempo");

    if (tempo) {

        tempo.innerText = `
            ${dias} dias,
            ${horas}h
            ${minutos}m
            ${segundos}s
        `;
    }
}

setInterval(atualizarContador, 1000);

atualizarContador();

// ========================================
// DOM LOADED
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTOS
    // ========================================

    const form = document.getElementById("formCadastro");

    const botao = document.getElementById("btnEnviar");

    const cpf = document.getElementById("cpf");

    const telefone = document.getElementById("telefone");

    const outrosCheck = document.getElementById("outrosCheck");

    const outrosTexto = document.getElementById("outrosTexto");


    // ========================================
    // CHECKBOX OUTROS
    // ========================================

    if (outrosCheck && outrosTexto) {

        outrosCheck.addEventListener("change", function () {

            outrosTexto.disabled = !this.checked;

            outrosTexto.required = this.checked;

            if (!this.checked) {

                outrosTexto.value = "";

            }

        });

    }


    // ========================================
    // MÁSCARA TELEFONE
    // ========================================

    if (telefone) {

        telefone.addEventListener("input", function () {

            let v = telefone.value.replace(/\D/g, "");

            if (v.length > 11) {
                v = v.slice(0, 11);
            }

            if (v.length > 6) {

                telefone.value =
                    `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;

            } else if (v.length > 2) {

                telefone.value =
                    `(${v.slice(0, 2)}) ${v.slice(2)}`;

            } else {

                telefone.value = v;

            }

        });

    }


    // ========================================
    // MÁSCARA CPF
    // ========================================

    if (cpf) {

        cpf.addEventListener("input", function () {

            let v = cpf.value
                .replace(/\D/g, "")
                .slice(0, 11);

            v = v.replace(/(\d{3})(\d)/, "$1.$2");

            v = v.replace(/(\d{3})(\d)/, "$1.$2");

            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            cpf.value = v;

        });

    }


    // ========================================
    // VALIDAÇÃO CPF
    // ========================================

    function validarCPF(cpfValor) {

        cpfValor = cpfValor.replace(/\D/g, "");

        if (
            cpfValor.length !== 11
            ||
            /^(\d)\1+$/.test(cpfValor)
        ) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {

            soma += parseInt(cpfValor[i]) * (10 - i);

        }

        let resto = (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }

        if (resto !== parseInt(cpfValor[9])) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {

            soma += parseInt(cpfValor[i]) * (11 - i);

        }

        resto = (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }

        return resto === parseInt(cpfValor[10]);
    }


    // ========================================
    // FORMULÁRIO
    // ========================================

    if (form) {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            // valida CPF se existir
            if (cpf && !validarCPF(cpf.value)) {

                alert("CPF inválido!");

                cpf.focus();

                return;
            }

            botao.disabled = true;

            botao.innerText = "Enviando...";

            const formData = new FormData(form);

            const dados = {

                nome: formData.get("nome"),

                email: formData.get("email"),

                telefone: formData.get("telefone"),

                nascimento:
                    formData.get("nascimento") || null,

                atuacao: formData.get("atuacao"),

                interesse: formData.get("interesse"),

                fonte:
                    formData.getAll("fonte[]").join(", "),

                fonte_outros:
                    formData.get("fonte_outros"),

                outros:
                    formData.get("outros"),

                data:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            };

            try {

                const { error } = await supabaseClient

                    .from("Cadastro")

                    .insert([dados]);

                if (error) {

                    console.error(error);

                    let mensagemErro =
                        "Erro ao salvar inscrição.";

                    if (
                        error.message.includes("duplicate key")
                    ) {

                        mensagemErro =
                            "Já existe uma inscrição com este e-mail.";

                    }

                    alert(mensagemErro);

                    return;
                }

                window.location.href = "obrigado.html";

            } catch (err) {

                console.error(err);

                alert("Erro ao salvar no banco.");

            } finally {

                botao.disabled = false;

                botao.innerText =
                    "Confirmar Inscrição";

            }

        });

    }


    // ========================================
    // RELATÓRIO
    // ========================================

    if (document.getElementById("tabelaInscritos")) {

        carregarInscritos();

    }

});


// ========================================
// CARREGAR INSCRITOS
// ========================================

async function carregarInscritos() {

    const { data, error } = await supabaseClient

        .from("Cadastro")

        .select("*");

    console.log(data);

    console.log(error);

    if (error) {

        console.error(error);

        alert(error.message);

        return;
    }

    const tabela =
        document.getElementById("tabelaInscritos");

    if (!tabela) return;

    tabela.innerHTML = "";

    data.forEach(inscrito => {

        tabela.innerHTML += `
            <tr>
                <td>${inscrito.nome ?? ""}</td>
                <td>${inscrito.email ?? ""}</td>
                <td>${inscrito.telefone ?? ""}</td>
                <td>${inscrito.atuacao ?? ""}</td>
            </tr>
        `;

    });

    const totalInscritos =
        document.getElementById("totalInscritos");

    if (totalInscritos) {

        totalInscritos.innerText = data.length;

    }

    const totalAreas =
        document.getElementById("totalAreas");

    if (totalAreas) {

        const areas = [
            ...new Set(data.map(i => i.atuacao))
        ];

        totalAreas.innerText = areas.length;

    }

}