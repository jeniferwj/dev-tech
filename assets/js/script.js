function mensagem() {
    alert("Inscrição realizada com sucesso.");
}

// DATA DO EVENTO (ano, mês-1, dia, hora, minuto)
const dataEvento = new Date(2026, 3, 30, 20, 0, 0); 
// Abril = 3 (começa do 0)

function atualizarContador() {
  const agora = new Date();
  const diferenca = dataEvento - agora;

  if (diferenca <= 0) {
    document.getElementById("tempo").innerText = "O evento começou! 🚀";
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);

  document.getElementById("tempo").innerText =
    `${dias} dias, ${horas}h ${minutos}m ${segundos}s`;
}

// Atualiza a cada 1 segundo
setInterval(atualizarContador, 1000);

// Executa na hora que carrega
atualizarContador();