  function mostrarTab(id, btn) {
    document.querySelectorAll('.painel').forEach(p => p.classList.remove('visivel'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativa'));

    document.getElementById('painel-' + id).classList.add('visivel');
    btn.classList.add('ativa');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const CURRENT_USER_KEY = 'lavi_current_user';

    function lerJSON(storage, key) {
      try {
        const dados = storage.getItem(key);
        return dados ? JSON.parse(dados) : null;
      } catch {
        return null;
      }
    }

    function obterUtilizadorAtual() {
      return (
        lerJSON(localStorage, CURRENT_USER_KEY) ||
        lerJSON(sessionStorage, CURRENT_USER_KEY)
      );
    }

    function obterPrimeiroNome(utilizador) {
      const nome = utilizador.nome || utilizador.email || 'Utilizador';
      return nome.trim().split(/\s+/)[0];
    }

    function obterIniciais(utilizador) {
      const base = utilizador.nome || utilizador.email || 'Utilizador';
      const partes = base.trim().split(/\s+/);

      if (partes.length === 1) {
        return partes[0].slice(0, 2).toUpperCase();
      }

      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }

    function terminarSessao(event) {
      event.preventDefault();

      localStorage.removeItem(CURRENT_USER_KEY);
      sessionStorage.removeItem(CURRENT_USER_KEY);

      window.location.href = 'index.html';
    }

    function mostrarSecao(secao) {
      document.querySelectorAll('.secao-conteudo').forEach(section => {
        section.classList.remove('visivel');
      });

      const secaoEscolhida = document.getElementById(`secao-${secao}`);

      if (secaoEscolhida) {
        secaoEscolhida.classList.add('visivel');
      }

      document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('ativo');
      });

      const botaoAtivo = document.querySelector(`.sidebar-btn[data-section="${secao}"]`);

      if (botaoAtivo) {
        botaoAtivo.closest('li').classList.add('ativo');
      }
    }

    const utilizador = obterUtilizadorAtual();

    if (!utilizador || !utilizador.email) {
      window.location.href = 'login.html';
      return;
    }

    const primeiroNome = obterPrimeiroNome(utilizador);
    const nomeCompleto = utilizador.nome || primeiroNome;
    const email = utilizador.email;
    const iniciais = obterIniciais(utilizador);

    const navUserName = document.getElementById('nav-user-name');
    const perfilAvatar = document.getElementById('perfil-avatar');
    const perfilNome = document.getElementById('perfil-nome');
    const perfilEmail = document.getElementById('perfil-email');
    const tituloPagina = document.getElementById('titulo-pagina');

    const perfilPaginaNome = document.getElementById('perfil-pagina-nome');
    const perfilPaginaEmail = document.getElementById('perfil-pagina-email');

    if (navUserName) {
      navUserName.textContent = primeiroNome;
    }

    if (perfilAvatar) {
      perfilAvatar.textContent = iniciais;
    }

    if (perfilNome) {
      perfilNome.textContent = nomeCompleto;
    }

    if (perfilEmail) {
      perfilEmail.textContent = email;
    }

    if (tituloPagina) {
      tituloPagina.textContent = `Reservas de ${primeiroNome}`;
    }

    if (perfilPaginaNome) {
      perfilPaginaNome.textContent = nomeCompleto;
    }

    if (perfilPaginaEmail) {
      perfilPaginaEmail.textContent = email;
    }

    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', terminarSessao);
    });

    document.querySelectorAll('.sidebar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        mostrarSecao(btn.dataset.section);
      });
    });

    mostrarSecao('reservas');
  });