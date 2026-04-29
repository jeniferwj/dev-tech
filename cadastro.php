<?php if (isset($_GET['sucesso'])): ?>
    <p style="color: green; text-align:center;">
        Inscrição realizada com sucesso!
    </p>
<?php endif; ?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>DevTech - Cadastro</title>

    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>

<body>
  <nav>
      <a href="index.html">Início</a>
      <a href="cadastro.html">Cadastro</a>
      <a href="eventos.html">Eventos</a>
  </nav>

  <section class="hero hero-geral">
    <div class="hero-text">
      <h1>Inscrição para o Evento</h1>

      <div class="info">
        <div class="info-item">
          <span class="icone"><i class="fas fa-calendar-alt"></i></span>
          23/07/2026
        </div>

        <div class="info-item">
          <span class="icone"><i class="fas fa-map-marker-alt"></i></span>
          Teatro Colégio Londrinense - Londrina/PR
        </div>

      </div>
    </div>
  </section>

  <div class="form-container">
    <p>Preencha o formulário abaixo para garantir sua participação no evento DevTech.</p>

    <form action="salvar.php" method="POST">
        <label>Nome completo:</label>
        <input type="text" name="nome">

        <label>Email:</label>
        <input type="email" name="email">

        <label>Telefone:</label>
        <input type="tel" name="telefone">

        <label>Data de nascimento:</label>
        <input type="date" name="nascimento">

        <label>Área de atuação:</label>
        <select name="area">
            <option>Estudante</option>
            <option>Desenvolvedor</option>
            <option>Profissional de TI</option>
            <option>Empreendedor</option>
            <option>Outro</option>
        </select>

        <label>Qual atividade você tem mais interesse?</label>
        <div class="grupo">
            <label><input type="radio" name="interesse" value="IA"> Palestras sobre IA</label>
            <label><input type="radio" name="interesse" value="Mobile"> Workshop Mobile</label>
            <label><input type="radio" name="interesse" value="Ambos"> Ambos</label>
        </div>

<label>Como ficou sabendo do evento?</label>
<div class="grupo">
    <label><input type="checkbox" name="origem[]" value="instagram"> Instagram</label>
    <label><input type="checkbox" name="origem[]" value="faculdade"> Faculdade / Escola</label>
    <label><input type="checkbox" name="origem[]" value="amigos"> Amigos</label>
    <label><input type="checkbox" name="origem[]" value="internet"> Internet</label>
    <label><input type="checkbox" id="outrosCheck" name="origem[]" value="outros"> Outros</label>    
   </div>

    <input type="text" id="outrosTexto" name="outrosTexto" placeholder="Digite aqui"  disabled>

        <label>Observações ou expectativas:</label>
        <textarea name="mensagem" rows="4"></textarea>

        <button type="submit" class="btnc">Confirmar Inscrição</button>

    </form>
  </div>

  <footer>
    © 2026 DevTech
  </footer>

  <script src="assets/js/script.js"></script>

</body>
</html>