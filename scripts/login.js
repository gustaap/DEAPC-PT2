    const USERS_KEY = 'lavi_users';
    const CURRENT_USER_KEY = 'lavi_current_user';

    const ADMIN_EMAIL = 'laviadmin@hotmail.com';
    const ADMIN_PASSWORD = 'lavi123';

    const form = document.getElementById('auth-form');
    const titulo = document.getElementById('titulo-auth');
    const subtitulo = document.getElementById('subtitulo-auth');
    const campoNome = document.getElementById('campo-nome');
    const campoConfirmarPassword = document.getElementById('campo-confirmar-password');
    const inputNome = document.getElementById('nome');
    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');
    const inputConfirmarPassword = document.getElementById('confirmar-password');
    const inputLembrar = document.getElementById('lembrar');
    const opcoesLogin = document.getElementById('opcoes-login');
    const mensagem = document.getElementById('mensagem-auth');
    const btnSubmit = document.getElementById('btn-submit');
    const btnToggleMode = document.getElementById('btn-toggle-mode');

    let modoCriarConta = false;

    function obterUtilizadores() {
      const dados = localStorage.getItem(USERS_KEY);

      if (!dados) {
        return [];
      }

      try {
        return JSON.parse(dados);
      } catch {
        return [];
      }
    }

    function guardarUtilizadores(utilizadores) {
      localStorage.setItem(USERS_KEY, JSON.stringify(utilizadores));
    }

    function normalizarEmail(email) {
      return String(email).trim().toLowerCase();
    }

    function mostrarMensagem(texto, tipo) {
      mensagem.textContent = texto;
      mensagem.className = `mensagem ${tipo}`;
    }

    function limparMensagem() {
      mensagem.textContent = '';
      mensagem.className = 'mensagem';
    }

    function guardarSessao(utilizador, lembrar) {
      const dadosSessao = {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
        role: utilizador.role || 'user'
      };

      localStorage.removeItem(CURRENT_USER_KEY);
      sessionStorage.removeItem(CURRENT_USER_KEY);

      if (lembrar) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(dadosSessao));
      } else {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(dadosSessao));
      }
    }

    function mudarModo(criarConta) {
      modoCriarConta = criarConta;

      limparMensagem();
      form.reset();

      if (modoCriarConta) {
        titulo.textContent = 'Criar conta';
        subtitulo.textContent = 'Cria uma conta para poderes aceder às tuas reservas';

        campoNome.classList.remove('hidden');
        campoConfirmarPassword.classList.remove('hidden');
        opcoesLogin.classList.add('hidden');

        inputNome.required = true;
        inputConfirmarPassword.required = true;

        btnSubmit.textContent = 'Criar conta';
        btnToggleMode.textContent = 'Já tenho conta';
      } else {
        titulo.textContent = 'Bem-vindo de volta';
        subtitulo.textContent = 'Inicia sessão para aceder às tuas reservas';

        campoNome.classList.add('hidden');
        campoConfirmarPassword.classList.add('hidden');
        opcoesLogin.classList.remove('hidden');

        inputNome.required = false;
        inputConfirmarPassword.required = false;

        btnSubmit.textContent = 'Iniciar sessão';
        btnToggleMode.textContent = 'Criar conta';
      }
    }

    function criarConta() {
      const nome = inputNome.value.trim();
      const email = normalizarEmail(inputEmail.value);
      const password = inputPassword.value;
      const confirmarPassword = inputConfirmarPassword.value;

      if (!nome || !email || !password || !confirmarPassword) {
        mostrarMensagem('Preenche todos os campos para criar a conta.', 'erro');
        return;
      }

      if (password.length < 4) {
        mostrarMensagem('A password deve ter pelo menos 4 caracteres.', 'erro');
        return;
      }

      if (password !== confirmarPassword) {
        mostrarMensagem('As passwords não coincidem.', 'erro');
        return;
      }

      const utilizadores = obterUtilizadores();

      const emailJaExiste = utilizadores.some(user => user.email === email);

      if (emailJaExiste) {
        mostrarMensagem('Já existe uma conta com este e-mail. Inicia sessão.', 'erro');
        return;
      }

      const novoUtilizador = {
        id: Date.now(),
        nome,
        email,
        password,
        role: 'user'
      };

      utilizadores.push(novoUtilizador);
      guardarUtilizadores(utilizadores);
      guardarSessao(novoUtilizador, true);

      mostrarMensagem('Conta criada com sucesso. A redirecionar...', 'sucesso');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    }

    function iniciarSessao() {
      const email = normalizarEmail(inputEmail.value);
      const password = inputPassword.value;

      if (!email || !password) {
        mostrarMensagem('Insere o e-mail e a password.', 'erro');
        return;
      }

      // Login especial do administrador
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const admin = {
          id: 'admin',
          nome: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'
        };

        guardarSessao(admin, inputLembrar.checked);

        mostrarMensagem('Sessão de administrador iniciada. A redirecionar...', 'sucesso');

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 700);

        return;
      }

      const utilizadores = obterUtilizadores();

      const utilizador = utilizadores.find(user => user.email === email);

      if (!utilizador) {
        mostrarMensagem('Esta conta ainda não existe. Cria uma conta primeiro.', 'erro');
        return;
      }

      if (utilizador.password !== password) {
        mostrarMensagem('Password incorreta.', 'erro');
        return;
      }

      guardarSessao(utilizador, inputLembrar.checked);

      mostrarMensagem('Sessão iniciada com sucesso. A redirecionar...', 'sucesso');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (modoCriarConta) {
        criarConta();
      } else {
        iniciarSessao();
      }
    });

    btnToggleMode.addEventListener('click', () => {
      mudarModo(!modoCriarConta);
    });

    document.getElementById('esqueci-password').addEventListener('click', (event) => {
      event.preventDefault();
      mostrarMensagem('Como este projeto usa uma pseudo-base local, ainda não existe recuperação real de password.', 'erro');
    });

    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get('mode') === 'register' || parametros.get('modo') === 'criar') {
      mudarModo(true);
    }
    const loginSlides = document.querySelectorAll('.login-bg-slide');

    if (loginSlides.length > 0) {
      let slideAtualLogin = 0;

      setInterval(() => {
        loginSlides[slideAtualLogin].classList.remove('active');

        slideAtualLogin = (slideAtualLogin + 1) % loginSlides.length;

        loginSlides[slideAtualLogin].classList.add('active');
      }, 4000);
    }