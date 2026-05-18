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

    console.log(
        "Supabase não disponível nesta página"
    );
}

// ========================================
// CONTADOR DO EVENTO
// ========================================

const dataEvento =
    new Date(2026, 7, 23, 19, 0, 0);

function atualizarContador() {

    const agora = new Date();

    const diferenca =
        dataEvento - agora;

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

    const tempo =
        document.getElementById("tempo");

    if (tempo) {

        tempo.innerText =
            `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
    }
}

setInterval(atualizarContador, 1000);

atualizarContador();

// ========================================
// DOM LOADED
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "formCadastro"
            );

        const botao =
            document.getElementById(
                "btnEnviar"
            );

        const telefone =
            document.getElementById(
                "telefone"
            );

        const outrosCheck =
            document.getElementById(
                "outrosCheck"
            );

        const outrosTexto =
            document.getElementById(
                "outrosTexto"
            );

        // ========================================
        // CHECKBOX OUTROS
        // ========================================

        if (outrosCheck && outrosTexto) {

            outrosCheck.addEventListener(
                "change",
                function () {

                    outrosTexto.disabled =
                        !this.checked;

                    outrosTexto.required =
                        this.checked;

                    if (!this.checked) {

                        outrosTexto.value = "";
                    }
                }
            );
        }

        // ========================================
        // MÁSCARA TELEFONE
        // ========================================

        if (telefone) {

            telefone.addEventListener(
                "input",
                function () {

                    let v =
                        telefone.value.replace(
                            /\D/g,
                            ""
                        );

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
                }
            );
        }

        // ========================================
        // FORMULÁRIO
        // ========================================

        if (form) {

            form.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();

                    botao.disabled = true;

                    botao.innerText =
                        "Enviando...";

                    const formData =
                        new FormData(form);

                    const dados = {

                        nome:
                            formData.get("nome"),

                        email:
                            formData.get("email"),

                        telefone:
                            formData.get("telefone"),

                        nascimento:
                            formData.get(
                                "nascimento"
                            ) || null,

                        atuacao:
                            formData.get(
                                "atuacao"
                            ),

                        interesse:
                            formData.get(
                                "interesse"
                            ),

                        fonte:
                            formData
                                .getAll("fonte[]")
                                .join(", "),

                        fonte_outros:
                            formData.get(
                                "fonte_outros"
                            ),

                        outros:
                            formData.get("outros"),

                        data:
                            new Date()
                                .toISOString()
                                .split("T")[0]
                    };

                    try {

                        const { error } =
                            await supabaseClient
                                .from("Cadastro")
                                .insert([dados]);

                        if (error) {

                            console.error(error);

                            let mensagemErro =
                                "Erro ao salvar inscrição.";

                            if (
                                error.message.includes(
                                    "duplicate key"
                                )
                            ) {

                                mensagemErro =
                                    "Já existe uma inscrição com este e-mail.";
                            }

                            alert(mensagemErro);

                            return;
                        }

                        window.location.href =
                            "obrigado.html";

                    } catch (err) {

                        console.error(err);

                        alert(
                            "Erro ao salvar no banco."
                        );

                    } finally {

                        botao.disabled = false;

                        botao.innerText =
                            "Confirmar Inscrição";
                    }
                }
            );
        }

        // ========================================
        // LOGIN ADMIN
        // ========================================

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (e) {

                    e.preventDefault();

                    const email =
                        document.getElementById(
                            "email"
                        ).value;

                    const password =
                        document.getElementById(
                            "password"
                        ).value;

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

                        alert(
                            "Login realizado com sucesso!"
                        );

                        window.location.href =
                            "relatorio.html";

                    } else {

                        alert(
                            "Usuário ou senha incorretos!"
                        );
                    }
                }
            );
        }
    }
);

// ========================================
// CARREGAR INSCRITOS
// ========================================

if (
    document.getElementById(
        "tabelaInscritos"
    )
) {

    carregarInscritos();
}

async function carregarInscritos() {

    const { data, error } =
        await supabaseClient
            .from("Cadastro")
            .select("*")
            .order("id", {
                ascending: false
            });

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

            <tr>

                <td>
                    <input
                        type="text"
                        id="nome-${inscrito.id}"
                        value="${inscrito.nome ?? ""}"
                        readonly
                    >
                </td>

                <td>
                    <input
                        type="email"
                        id="email-${inscrito.id}"
                        value="${inscrito.email ?? ""}"
                        readonly
                    >
                </td>

                <td>
                    <input
                        type="text"
                        id="telefone-${inscrito.id}"
                        value="${inscrito.telefone ?? ""}"
                        readonly
                    >
                </td>

                <td>
                    <input
                        type="text"
                        id="atuacao-${inscrito.id}"
                        value="${inscrito.atuacao ?? ""}"
                        readonly
                    >
                </td>

                <td>
                    <input
                        type="text"
                        id="interesse-${inscrito.id}"
                        value="${inscrito.interesse ?? ""}"
                        readonly
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

    // ========================================
    // MÉTRICAS
    // ========================================

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
                data.map(
                    i => i.atuacao
                )
            )
        ];

        totalAreas.innerText =
            areas.length;
    }
}

// ========================================
// HABILITAR EDIÇÃO
// ========================================

function habilitarEdicao(id) {

    document.getElementById(
        `nome-${id}`
    ).readOnly = false;

    document.getElementById(
        `email-${id}`
    ).readOnly = false;

    document.getElementById(
        `telefone-${id}`
    ).readOnly = false;

    document.getElementById(
        `atuacao-${id}`
    ).readOnly = false;

    document.getElementById(
        `interesse-${id}`
    ).readOnly = false;

    const botao =
        document.getElementById(
            `btnEditar-${id}`
        );

    botao.innerText = "Salvar";

    botao.onclick = function () {

        salvarEdicao(id);
    };
}

// ========================================
// SALVAR EDIÇÃO
// ========================================

async function salvarEdicao(id) {

    const nome =
        document.getElementById(
            `nome-${id}`
        ).value;

    const email =
        document.getElementById(
            `email-${id}`
        ).value;

    const telefone =
        document.getElementById(
            `telefone-${id}`
        ).value;

    const atuacao =
        document.getElementById(
            `atuacao-${id}`
        ).value;

    const interesse =
        document.getElementById(
            `interesse-${id}`
        ).value;

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

        alert(
            "Erro ao atualizar registro."
        );

        return;
    }

    document.getElementById(
        `nome-${id}`
    ).readOnly = true;

    document.getElementById(
        `email-${id}`
    ).readOnly = true;

    document.getElementById(
        `telefone-${id}`
    ).readOnly = true;

    document.getElementById(
        `atuacao-${id}`
    ).readOnly = true;

    document.getElementById(
        `interesse-${id}`
    ).readOnly = true;

    const botao =
        document.getElementById(
            `btnEditar-${id}`
        );

    botao.innerText = "Editar";

    botao.onclick = function () {

        habilitarEdicao(id);
    };

    alert(
        "Registro atualizado com sucesso!"
    );
}

// ========================================
// EXCLUIR REGISTRO
// ========================================

async function excluirRegistro(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir?"
        );

    if (!confirmar) return;

    const { error } =
        await supabaseClient
            .from("Cadastro")
            .delete()
            .eq("id", id);

    if (error) {

        console.error(error);

        alert(
            "Erro ao excluir registro."
        );

        return;
    }

    alert(
        "Registro excluído!"
    );

    carregarInscritos();
}