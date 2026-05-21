const CURRENT_USER_KEY = 'lavi_current_user';

function obterSessaoAtual() {
  const dados =
    localStorage.getItem(CURRENT_USER_KEY) ||
    sessionStorage.getItem(CURRENT_USER_KEY);

  if (!dados) {
    return null;
  }

  try {
    return JSON.parse(dados);
  } catch {
    return null;
  }
}

function terminarSessao() {
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = 'index.html';
}

function atualizarNavbarAuth() {
  const navAuth = document.getElementById('nav-auth');

  if (!navAuth) {
    return;
  }

  const utilizador = obterSessaoAtual();

  if (!utilizador) {
    navAuth.innerHTML = `
      <a href="login.html" class="btn-nav-login">Login</a>
      <a href="login.html?mode=register" class="btn-nav-conta">Criar conta</a>
    `;
    return;
  }

  const linkAdmin =
    utilizador.role === 'admin'
      ? `<a href="admin.html" class="btn-nav-login">Admin</a>`
      : '';

  navAuth.innerHTML = `
    <a href="historico.html" class="btn-nav-login">Olá, ${utilizador.nome}</a>
    ${linkAdmin}
    <button type="button" class="btn-nav-sair" id="btn-logout">Sair</button>
  `;

  const btnLogout = document.getElementById('btn-logout');

  if (btnLogout) {
    btnLogout.addEventListener('click', terminarSessao);
  }
}

document.addEventListener('DOMContentLoaded', atualizarNavbarAuth);