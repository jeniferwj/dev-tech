// ========================================
// CONFIGURAÇÃO SUPABASE
// ========================================

let supabaseClient = null;

try {
    if (typeof supabase !== "undefined") {
        supabaseClient = supabase.createClient(
            "https://chcshzruympfsqxqzfay.supabase.co",
            "sb_publishable_fvrhSvXEV0KrY1UqWI88kQ_Hcqs5RYT"
        );
    }
} catch (e) {
    console.log("Supabase não disponível nesta página");
}

// ========================================
// CONTADOR DO EVENTO
// ========================================

const dataEvento = new Date(2026, 7, 23, 19, 0, 0);

function atualizarContador() {
    const agora = new Date();
    const diferenca = dataEvento - agora;

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    const tempo = document.getElementById("tempo");

    if (tempo) {
        tempo.innerText = `
${dias} dias, ${horas}h ${minutos}m ${segundos}s
        `;
    }
}

setInterval(atualizarContador, 1000);
atualizarContador();

// ========================================
// DOM LOADED
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formCadastro");
    const botao = document.getElementById("btnEnviar");
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
                nascimento: formData.get("nascimento") || null,
                atuacao: formData.get("atuacao"),
                interesse: formData.get("interesse"),
                fonte: formData.getAll("fonte[]").join(", "),
                fonte_outros: formData.get("fonte_outros"),
                outros: formData.get("outros"),
                data: new Date().toISOString().split("T")[0]
            };

            try {

                const { error } = await supabaseClient
                    .from("Cadastro")
                    .insert([dados]);

                if (error) {

                    console.error(error);

                    let mensagemErro =
                        "Erro ao salvar inscrição.";

                    if (error.message.includes("duplicate key")) {
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
                botao.innerText = "Confirmar Inscrição";
            }
        });
    }

    // ========================================
    // LOGOUT ADMIN
    // ========================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {

            if (confirm("Tem certeza que deseja sair?")) {

                sessionStorage.removeItem("adminLoggedIn");
                sessionStorage.removeItem("adminEmail");

                window.location.href = "index.html";
            }
        });
    }

    // ========================================
    // INFO ADMIN
    // ========================================

    const adminInfo =
        document.getElementById("adminInfo");

    if (
        adminInfo &&
        sessionStorage.getItem("adminLoggedIn") === "true"
    ) {
        const adminEmail =
            sessionStorage.getItem("adminEmail");

        adminInfo.textContent =
            `Administrador: ${adminEmail}`;
    }

    // ========================================
    // LOGIN ADMIN
    // ========================================

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            if (
                email === "adm" &&
                password === "1234"
            ) {

                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );

                sessionStorage.setItem(
                    "adminEmail",
                    email
                );

                alert("Login realizado com sucesso!");

                window.location.href =
                    "relatorio.html";

            } else {

                alert(
                    "Usuário ou senha incorretos!"
                );
            }
        });
    }

    // ========================================
    // ESQUECI SENHA
    // ========================================

    const forgotPasswordLink =
        document.getElementById(
            "forgotPassword"
        );

    if (forgotPasswordLink) {

        forgotPasswordLink.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                alert(
                    "Credenciais de acesso:\n\nUsuário: adm\nSenha: 1234"
                );
            }
        );
    }

});

// ========================================
// CARREGAR INSCRITOS
// ========================================

if (document.getElementById("tabelaInscritos")) {
    carregarInscritos();
}

async function carregarInscritos() {

    const { data, error } =
        await supabaseClient
            .from("Cadastro")
            .select("*");

    if (error) {
        console.error(error);
        alert(error.message);
        return;
    }

    const tabela =
        document.getElementById(
            "tabelaInscritos"
        );

    if (!tabela) return;

    tabela.innerHTML = "";

data.forEach(inscrito => {

    tabela.innerHTML += `
        <tr id="linha-${inscrito.id}">

            <td>
                <input 
                    type="text"
                    value="${inscrito.nome ?? ""}"
                    id="nome-${inscrito.id}"
                    disabled
                >
            </td>

            <td>
                <input 
                    type="email"
                    value="${inscrito.email ?? ""}"
                    id="email-${inscrito.id}"
                    disabled
                >
            </td>

            <td>
                <input 
                    type="text"
                    value="${inscrito.telefone ?? ""}"
                    id="telefone-${inscrito.id}"
                    disabled
                >
            </td>

            <td>
                <input 
                    type="text"
                    value="${inscrito.atuacao ?? ""}"
                    id="atuacao-${inscrito.id}"
                    disabled
                >
            </td>

            <td>
                <input 
                    type="text"
                    value="${inscrito.interesse ?? ""}"
                    id="interesse-${inscrito.id}"
                    disabled
                >
            </td>

            <td>
                ${inscrito.data ?? ""}
            </td>

            <td>

                <button 
                    id="btnEditar-${inscrito.id}"
                    onclick="habilitarEdicao(${inscrito.id})"
                >
                    Editar
                </button>

                <button 
                    onclick="excluirRegistro(${inscrito.id})"
                >
                    Excluir
                </button>

            </td>

        </tr>
    `;
});
    const totalInscritos =
        document.getElementById(
            "totalInscritos"
        );

    if (totalInscritos) {
        totalInscritos.innerText =
            data.length;
    }

    const totalAreas =
        document.getElementById(
            "totalAreas"
        );

    if (totalAreas) {

        const areas = [
            ...new Set(
                data.map(i => i.atuacao)
            )
        ];

        totalAreas.innerText =
            areas.length;
    }
}

// ========================================
// FUNÇAO PARA EDITAR
// ========================================

async function editarRegistro(id) {

    // Busca o registro
    const { data, error } = await supabaseClient
        .from("Cadastro")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

        console.error(error);
        alert("Erro ao buscar registro.");

        return;
    }

    // Prompt edição
    const novoNome =
        prompt("Nome:", data.nome);

    if (novoNome === null) return;

    const novoTelefone =
        prompt("Telefone:", data.telefone);

    if (novoTelefone === null) return;

    const novaAtuacao =
        prompt("Área:", data.atuacao);

    if (novaAtuacao === null) return;

    // UPDATE
    const { error: updateError } =
        await supabaseClient
            .from("Cadastro")
            .update({
                nome: novoNome,
                telefone: novoTelefone,
                atuacao: novaAtuacao
            })
            .eq("id", id);

    if (updateError) {

        console.error(updateError);
        alert("Erro ao atualizar.");

        return;
    }

    alert("Registro atualizado!");

    carregarInscritos();
}

// ========================================
// FUNÇAO PARA EXCLUIR
// ========================================


async function excluirRegistro(id) {

    const confirmar =
        confirm("Deseja realmente excluir?");

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("Cadastro")
        .delete()
        .eq("id", id);

    if (error) {

        console.error(error);
        alert("Erro ao excluir.");

        return;
    }

    alert("Registro excluído!");

    carregarInscritos();
}

// ========================================
// HABILITAR EDIÇÃO
// ========================================


function habilitarEdicao(id) {

    document.getElementById(`nome-${id}`)
        .disabled = false;

    document.getElementById(`email-${id}`)
        .disabled = false;

    document.getElementById(`telefone-${id}`)
        .disabled = false;

    document.getElementById(`atuacao-${id}`)
        .disabled = false;

    document.getElementById(`interesse-${id}`)
        .disabled = false;

    const botao =
        document.getElementById(`btnEditar-${id}`);

    botao.innerText = "Salvar";

    botao.onclick = function () {
        salvarEdicao(id);
    };
}

// ========================================
// SALVAR
// ========================================

async function salvarEdicao(id) {

    const nome =
        document.getElementById(`nome-${id}`).value;

    const email =
        document.getElementById(`email-${id}`).value;

    const telefone =
        document.getElementById(`telefone-${id}`).value;

    const atuacao =
        document.getElementById(`atuacao-${id}`).value;

    const interesse =
        document.getElementById(`interesse-${id}`).value;

    const { error } =
        await supabaseClient
            .from("Cadastro")
            .update({
                nome,
                email,
                telefone,
                atuacao,
                interesse
            })
            .eq("id", id);

    if (error) {

        console.error(error);
        alert("Erro ao atualizar.");

        return;
    }

    // Desabilita novamente
    document.getElementById(`nome-${id}`)
        .disabled = true;

    document.getElementById(`email-${id}`)
        .disabled = true;

    document.getElementById(`telefone-${id}`)
        .disabled = true;

    document.getElementById(`atuacao-${id}`)
        .disabled = true;

    document.getElementById(`interesse-${id}`)
        .disabled = true;

    const botao =
        document.getElementById(`btnEditar-${id}`);

    botao.innerText = "Editar";

    botao.onclick = function () {
        habilitarEdicao(id);
    };

    alert("Registro atualizado!");
}