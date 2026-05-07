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
// MÁSCARA TELEFONE
// ========================================

if (telefone) {

    telefone.addEventListener("input", function () {

        let v = telefone.value
            .replace(/\D/g, "")
            .slice(0, 11);

        // Coloca DDD
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");

        // Celular: 11 dígitos
        if (v.replace(/\D/g, "").length === 11) {
            v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
        }

        // Fixo: 10 dígitos
        else {
            v = v.replace(/(\d{4})(\d{4})$/, "$1-$2");
        }

        telefone.value = v;

    });

}

    // ========================================
    // FORMULÁRIO
    // ========================================

    if (form) {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

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
                <td>${inscrito.interesse ?? ""}</td>
                <td>${inscrito.data ?? ""}</td>

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