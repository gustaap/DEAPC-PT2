
  let metodoPagamentoSelecionado = 'cartao';

  function selecionarMetodo(el) {
    metodoPagamentoSelecionado = el.dataset.metodo;

    document.querySelectorAll('.metodo').forEach(m => {
      m.classList.remove('selecionado');
    });

    el.classList.add('selecionado');

    document.querySelectorAll('.pagamento-detalhes').forEach(secao => {
      secao.classList.remove('visivel');
    });

    const secaoSelecionada = document.getElementById(`pagamento-${metodoPagamentoSelecionado}`);

    if (secaoSelecionada) {
      secaoSelecionada.classList.add('visivel');
    }

    limparErroPagamento();
  }

  function mostrarErroPagamento(texto) {
    const erro = document.getElementById('erro-pagamento');

    if (!erro) return;

    erro.textContent = texto;
    erro.classList.add('visivel');
  }

  function limparErroPagamento() {
    const erro = document.getElementById('erro-pagamento');

    if (!erro) return;

    erro.textContent = '';
    erro.classList.remove('visivel');
  }

  function apenasNumeros(valor) {
    return String(valor).replace(/\D/g, '');
  }

  function validarDadosCliente() {
    const nomeInput = document.getElementById('nome');
    const apelidoInput = document.getElementById('apelido');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');

    if (!nomeInput || !apelidoInput || !emailInput || !telefoneInput) {
      mostrarErroPagamento('Erro interno: os campos de dados do cliente não existem na página.');
      return false;
    }

    const nome = nomeInput.value.trim();
    const apelido = apelidoInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();

    if (!nome || !apelido || !email || !telefone) {
      mostrarErroPagamento('Preenche os dados principais do cliente: nome, apelido, e-mail e telefone.');
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      mostrarErroPagamento('Insere um e-mail válido.');
      return false;
    }

    return true;
  }

  function validarCartao() {
    const numeroCartao = apenasNumeros(document.getElementById('num-cartao').value);
    const titular = document.getElementById('titular').value.trim();
    const validade = document.getElementById('validade').value.trim();
    const cvv = apenasNumeros(document.getElementById('cvv').value);

    if (numeroCartao.length < 16) {
      mostrarErroPagamento('Insere um número de cartão válido com 16 dígitos.');
      return false;
    }

    if (!titular) {
      mostrarErroPagamento('Insere o nome do titular do cartão.');
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(validade)) {
      mostrarErroPagamento('Insere a validade no formato MM/AA.');
      return false;
    }

    if (cvv.length < 3) {
      mostrarErroPagamento('Insere um CVV válido.');
      return false;
    }

    return true;
  }

  function validarMBWay() {
    const telefoneMBWay = apenasNumeros(document.getElementById('telefone-mbway').value);

    if (telefoneMBWay.length < 9) {
      mostrarErroPagamento('Insere um número MB Way válido.');
      return false;
    }

    return true;
  }

  function validarTermos() {
    const termos = document.getElementById('termos');

    if (!termos.checked) {
      mostrarErroPagamento('Tens de aceitar os Termos e Condições para confirmar a reserva.');
      return false;
    }

    return true;
  }

  function validarPagamento() {
    limparErroPagamento();

    if (!validarDadosCliente()) {
      return false;
    }

    if (metodoPagamentoSelecionado === 'cartao' && !validarCartao()) {
      return false;
    }

    if (metodoPagamentoSelecionado === 'mbway' && !validarMBWay()) {
      return false;
    }

    if (!validarTermos()) {
      return false;
    }

    return true;
  }

  function formatarInputsPagamento() {
    const numCartao = document.getElementById('num-cartao');
    const validade = document.getElementById('validade');
    const cvv = document.getElementById('cvv');

    if (numCartao) {
      numCartao.addEventListener('input', () => {
        let valor = apenasNumeros(numCartao.value).slice(0, 16);
        valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ');
        numCartao.value = valor;
      });
    }

    if (validade) {
      validade.addEventListener('input', () => {
        let valor = apenasNumeros(validade.value).slice(0, 4);

        if (valor.length >= 3) {
          valor = valor.slice(0, 2) + '/' + valor.slice(2);
        }

        validade.value = valor;
      });
    }

    if (cvv) {
      cvv.addEventListener('input', () => {
        cvv.value = apenasNumeros(cvv.value).slice(0, 4);
      });
    }
  }

  const itensDatabase = window.itensDatabase || [];

  const params = new URLSearchParams(window.location.search);

  const id = Number(params.get('id'));
  const tipo = params.get('tipo') || '';
  const entrada = params.get('entrada') || '';
  const saida = params.get('saida') || '';
  const pessoas = Number(params.get('pessoas')) || 1;

  const item = itensDatabase.find(i => i.id === id && i.tipo === tipo) ||
               itensDatabase.find(i => i.id === id);

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    });
  }

  function formatarData(dataISO) {
    if (!dataISO) return '';

    const data = new Date(dataISO);

    return data.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function calcularNoites(entrada, saida) {
    if (!entrada || !saida) return 1;

    const dataEntrada = new Date(entrada);
    const dataSaida = new Date(saida);
    const diferencaMs = dataSaida - dataEntrada;
    const noites = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

    return Math.max(noites, 1);
  }

  function calcularSubtotal(item) {
    const noites = calcularNoites(entrada, saida);

    if (item.tipo === 'hotel') {
      return item.preco * noites;
    }

    return item.preco * pessoas;
  }

  function calcularTaxas(item, subtotal) {
    if (item.tipo === 'hotel') {
      return subtotal * 0.09;
    }

    return 0;
  }

  function atualizarResumoReserva() {
    if (!item) {
      document.getElementById('reserva-titulo').textContent = 'Reserva não encontrada';
      document.getElementById('reserva-detalhe').innerHTML =
        'Volta aos resultados e seleciona uma opção válida.';
      return;
    }

    const noites = calcularNoites(entrada, saida);
    const subtotal = calcularSubtotal(item);
    const taxas = calcularTaxas(item, subtotal);
    const total = subtotal + taxas;

    let icone = '';
    let detalhe = '';
    let precoLabel = '';
    let taxasLabel = '';
    let taxasTexto = '';
    let extraLabel = '';
    let extraTexto = '';
    let nota = '';

    if (item.tipo === 'hotel') {
      icone = '★'.repeat(Number(item.estrelas));

      detalhe = `
        ${item.destino}<br>
        ${formatarData(entrada)} – ${formatarData(saida)} · ${noites} noite${noites !== 1 ? 's' : ''}<br>
        ${pessoas} pessoa${pessoas !== 1 ? 's' : ''}<br>
        ${item.comodidades}
      `;

      precoLabel = `${item.preco} € × ${noites} noite${noites !== 1 ? 's' : ''}`;
      taxasLabel = 'Taxas e impostos';
      taxasTexto = formatarMoeda(taxas);
      extraLabel = 'Serviços';
      extraTexto = 'incluídos';
      nota = 'Cancelamento gratuito até 48h antes do check-in.<br>Sem taxas ocultas.';
    }

    if (item.tipo === 'voo') {
      icone = '✈';

      detalhe = `
        ${item.origem} para ${item.destino}<br>
        ${formatarData(entrada)}<br>
        ${pessoas} passageiro${pessoas !== 1 ? 's' : ''}<br>
        ${item.comodidades}
      `;

      precoLabel = `${item.preco} € × ${pessoas} passageiro${pessoas !== 1 ? 's' : ''}`;
      taxasLabel = 'Taxas aeroportuárias';
      taxasTexto = 'incluídas';
      extraLabel = 'Bagagem';
      extraTexto = 'incluída';
      nota = 'Alterações sujeitas às condições da companhia aérea.<br>Sem taxas ocultas.';
    }

    if (item.tipo === 'evento') {
      icone = '🎟';

      detalhe = `
        ${item.destino}<br>
        ${formatarData(entrada)}<br>
        ${pessoas} bilhete${pessoas !== 1 ? 's' : ''}<br>
        ${item.comodidades}
      `;

      precoLabel = `${item.preco} € × ${pessoas} bilhete${pessoas !== 1 ? 's' : ''}`;
      taxasLabel = 'Taxas de serviço';
      taxasTexto = 'incluídas';
      extraLabel = 'Tipo de entrada';
      extraTexto = 'geral';
      nota = 'Bilhete válido apenas para a data indicada.<br>Sem taxas ocultas.';
    }

    document.getElementById('reserva-icone').textContent = icone;
    document.getElementById('reserva-titulo').textContent = item.nome;
    document.getElementById('reserva-detalhe').innerHTML = detalhe;

    document.getElementById('reserva-preco-label').textContent = precoLabel;
    document.getElementById('reserva-subtotal').textContent = formatarMoeda(subtotal);

    document.getElementById('reserva-taxas-label').textContent = taxasLabel;
    document.getElementById('reserva-taxas').textContent = taxasTexto;

    document.getElementById('reserva-extra-label').textContent = extraLabel;
    document.getElementById('reserva-extra').textContent = extraTexto;

    document.getElementById('reserva-total').textContent = formatarMoeda(total);
    document.getElementById('reserva-nota').innerHTML = nota;
  }

  atualizarResumoReserva();
  document.querySelectorAll('.metodo').forEach(metodo => {
    metodo.addEventListener('click', () => {
      selecionarMetodo(metodo);
    });
  });

  formatarInputsPagamento();

  const btnConfirmarReserva = document.getElementById('btn-confirmar-reserva');

  if (btnConfirmarReserva) {
    btnConfirmarReserva.addEventListener('click', () => {
      if (!validarPagamento()) {
        return;
      }

      if (metodoPagamentoSelecionado === 'referencia') {
        alert('Reserva criada com referência Multibanco simulada. Estado: pendente de pagamento.');
      } else {
        alert('Reserva confirmada com sucesso.');
      }

      window.location.href = 'historico.html';
    });
  }
