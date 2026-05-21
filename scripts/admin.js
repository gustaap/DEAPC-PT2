
    document.addEventListener('DOMContentLoaded', () => {
      const CURRENT_USER_KEY = 'lavi_current_user';
      const USERS_KEY = 'lavi_users';

      const area = document.querySelector('.area');
      const topbarTitle = document.querySelector('.topbar h1');
      const dashboardHTML = area.innerHTML;

      let reservas = [
        {
          ref: 'RES-20260512-001',
          cliente: 'João Silva',
          email: 'joao@email.com',
          servico: 'Hotel Avenida Palace',
          tipo: 'Hotel',
          total: '1.062,75 €',
          estado: 'Ativa'
        },
        {
          ref: 'RES-20260512-002',
          cliente: 'João Silva',
          email: 'joao@email.com',
          servico: 'Voo TP401 LIS→BCN',
          tipo: 'Voo',
          total: '145,00 €',
          estado: 'Ativa'
        },
        {
          ref: 'RES-20260519-003',
          cliente: 'Maria Costa',
          email: 'maria@email.com',
          servico: 'Hotel Bairro Alto',
          tipo: 'Hotel',
          total: '356,00 €',
          estado: 'Pendente'
        },
        {
          ref: 'RES-20260520-004',
          cliente: 'Rui Ferreira',
          email: 'rui@email.com',
          servico: 'Festival NOS Alive',
          tipo: 'Evento',
          total: '75,00 €',
          estado: 'Pendente'
        },
        {
          ref: 'RES-20260410-005',
          cliente: 'Ana Rodrigues',
          email: 'ana@email.com',
          servico: 'Hotel Rossio',
          tipo: 'Hotel',
          total: '178,00 €',
          estado: 'Cancelada'
        }
      ];

      let alojamentos = [
        { nome: 'Hotel Avenida Palace', cidade: 'Lisboa', estrelas: 5, preco: '195 €' },
        { nome: 'Hotel Bairro Alto', cidade: 'Lisboa', estrelas: 4, preco: '145 €' },
        { nome: 'Residencial Rossio', cidade: 'Lisboa', estrelas: 3, preco: '55 €' }
      ];

      let voos = [
        { nome: 'TAP Air Portugal', rota: 'LIS → BCN', preco: '89 €', estado: 'Ativo' },
        { nome: 'Ryanair', rota: 'MAD → LIS', preco: '35 €', estado: 'Ativo' }
      ];

      let eventos = [
        { nome: 'Festival NOS Alive', cidade: 'Lisboa', preco: '75 €', estado: 'Ativo' }
      ];

      function lerJSON(storage, key) {
        try {
          const dados = storage.getItem(key);
          return dados ? JSON.parse(dados) : null;
        } catch {
          return null;
        }
      }

      const utilizador =
        lerJSON(localStorage, CURRENT_USER_KEY) ||
        lerJSON(sessionStorage, CURRENT_USER_KEY);

      if (!utilizador || utilizador.role !== 'admin') {
        window.location.href = 'login.html';
        return;
      }

      function terminarSessao(event) {
        event.preventDefault();

        localStorage.removeItem(CURRENT_USER_KEY);
        sessionStorage.removeItem(CURRENT_USER_KEY);

        window.location.href = 'index.html';
      }

      const sairBtn = document.querySelector('.btn-sair-admin');

      if (sairBtn) {
        sairBtn.addEventListener('click', terminarSessao);
      }

      function definirTitulo(titulo) {
        if (topbarTitle) {
          topbarTitle.textContent = titulo;
        }
      }

      function limparMenuAtivo() {
        document.querySelectorAll('.sidebar-menu li').forEach(li => {
          li.classList.remove('ativo');
        });
      }

      function ativarMenuPorTexto(texto) {
        limparMenuAtivo();

        document.querySelectorAll('.sidebar-menu li a').forEach(link => {
          if (link.textContent.trim().toLowerCase().includes(texto.toLowerCase())) {
            link.closest('li').classList.add('ativo');
          }
        });
      }

      function badgeEstado(estado) {
        const estadoNormalizado = estado.toLowerCase();

        if (estadoNormalizado === 'ativa' || estadoNormalizado === 'ativo') {
          return `<span class="badge-estado badge-ativa">${estado}</span>`;
        }

        if (estadoNormalizado === 'pendente') {
          return `<span class="badge-estado badge-pendente">${estado}</span>`;
        }

        return `<span class="badge-estado badge-cancelada">${estado}</span>`;
      }

      function renderDashboard() {
        definirTitulo('Dashboard');
        ativarMenuPorTexto('Dashboard');

        area.innerHTML = dashboardHTML;
        ligarBotoesDashboard();
      }

      function renderReservas() {
        definirTitulo('Reservas');
        ativarMenuPorTexto('Reservas');

        area.innerHTML = `
          <div class="painel">
            <div class="painel-header">
              <h2>Gestão de reservas</h2>
              <button class="admin-btn" id="btn-nova-reserva">+ Nova reserva</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Referência</th>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Tipo</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                ${reservas.map(reserva => `
                  <tr>
                    <td data-label="Referência">${reserva.ref}</td>
                    <td data-label="Cliente">${reserva.cliente}</td>
                    <td data-label="Serviço">${reserva.servico}</td>
                    <td data-label="Tipo">${reserva.tipo}</td>
                    <td data-label="Total">${reserva.total}</td>
                    <td data-label="Estado">${badgeEstado(reserva.estado)}</td>
                    <td data-label="Ações">
                      <button class="admin-btn secondary" data-ver-reserva="${reserva.ref}">Ver</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        document.querySelectorAll('[data-ver-reserva]').forEach(btn => {
          btn.addEventListener('click', () => {
            renderDetalheReserva(btn.dataset.verReserva);
          });
        });

        document.getElementById('btn-nova-reserva').addEventListener('click', () => {
          alert('Função simulada: numa aplicação real, aqui abriria o formulário de criação de reserva.');
        });
      }

      function renderDetalheReserva(ref) {
        const reserva = reservas.find(r => r.ref === ref);

        if (!reserva) {
          renderReservas();
          return;
        }

        definirTitulo('Detalhe da reserva');

        area.innerHTML = `
          <div class="detalhe-box">
            <h2>${reserva.ref}</h2>

            <div class="detalhe-linha">
              <span>Cliente</span>
              <span>${reserva.cliente}</span>
            </div>

            <div class="detalhe-linha">
              <span>E-mail</span>
              <span>${reserva.email}</span>
            </div>

            <div class="detalhe-linha">
              <span>Serviço</span>
              <span>${reserva.servico}</span>
            </div>

            <div class="detalhe-linha">
              <span>Tipo</span>
              <span>${reserva.tipo}</span>
            </div>

            <div class="detalhe-linha">
              <span>Total</span>
              <span>${reserva.total}</span>
            </div>

            <div class="detalhe-linha">
              <span>Estado</span>
              <span>${badgeEstado(reserva.estado)}</span>
            </div>

            <div class="acoes-linha">
              <button class="admin-btn secondary" id="voltar-reservas">← Voltar</button>
              <button class="admin-btn success" id="confirmar-reserva">Confirmar</button>
              <button class="admin-btn danger" id="cancelar-reserva">Cancelar</button>
            </div>
          </div>
        `;

        document.getElementById('voltar-reservas').addEventListener('click', renderReservas);

        document.getElementById('confirmar-reserva').addEventListener('click', () => {
          reserva.estado = 'Ativa';
          renderDetalheReserva(ref);
        });

        document.getElementById('cancelar-reserva').addEventListener('click', () => {
          reserva.estado = 'Cancelada';
          renderDetalheReserva(ref);
        });
      }

      function obterUtilizadores() {
        const usersGuardados = lerJSON(localStorage, USERS_KEY) || [];

        const exemplos = [
          { nome: 'João Silva', email: 'joao@email.com', role: 'user' },
          { nome: 'Maria Costa', email: 'maria@email.com', role: 'user' },
          { nome: 'Rui Ferreira', email: 'rui@email.com', role: 'user' }
        ];

        const todos = [...usersGuardados, ...exemplos];

        return todos.filter((user, index, arr) => {
          return arr.findIndex(u => u.email === user.email) === index;
        });
      }

      function renderUtilizadores() {
        definirTitulo('Utilizadores');
        ativarMenuPorTexto('Utilizadores');

        const users = obterUtilizadores();

        area.innerHTML = `
          <div class="painel">
            <div class="painel-header">
              <h2>Utilizadores registados</h2>
              <button class="admin-btn" id="exportar-users">Exportar lista</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                ${users.map(user => `
                  <tr>
                    <td data-label="Nome">${user.nome || 'Utilizador'}</td>
                    <td data-label="E-mail">${user.email}</td>
                    <td data-label="Perfil">${user.role || 'user'}</td>
                    <td data-label="Estado">${badgeEstado('Ativa')}</td>
                    <td data-label="Ações">
                      <button class="admin-btn secondary" data-user-email="${user.email}">Ver</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        document.querySelectorAll('[data-user-email]').forEach(btn => {
          btn.addEventListener('click', () => {
            renderDetalheUtilizador(btn.dataset.userEmail);
          });
        });

        document.getElementById('exportar-users').addEventListener('click', () => {
          alert('Função simulada: lista de utilizadores exportada.');
        });
      }

      function renderDetalheUtilizador(email) {
        const user = obterUtilizadores().find(u => u.email === email);

        if (!user) {
          renderUtilizadores();
          return;
        }

        definirTitulo('Detalhe do utilizador');

        area.innerHTML = `
          <div class="detalhe-box">
            <h2>${user.nome || 'Utilizador'}</h2>

            <div class="detalhe-linha">
              <span>E-mail</span>
              <span>${user.email}</span>
            </div>

            <div class="detalhe-linha">
              <span>Perfil</span>
              <span>${user.role || 'user'}</span>
            </div>

            <div class="detalhe-linha">
              <span>Estado</span>
              <span>${badgeEstado('Ativa')}</span>
            </div>

            <div class="acoes-linha">
              <button class="admin-btn secondary" id="voltar-users">← Voltar</button>
              <button class="admin-btn danger" id="bloquear-user">Bloquear utilizador</button>
            </div>
          </div>
        `;

        document.getElementById('voltar-users').addEventListener('click', renderUtilizadores);

        document.getElementById('bloquear-user').addEventListener('click', () => {
          alert('Função simulada: utilizador bloqueado.');
        });
      }

      function renderAlojamentos() {
        definirTitulo('Alojamentos');
        ativarMenuPorTexto('Alojamentos');

        area.innerHTML = `
          <div class="painel">
            <div class="painel-header">
              <h2>Alojamentos</h2>
              <button class="admin-btn" id="novo-alojamento">+ Adicionar alojamento</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cidade</th>
                  <th>Estrelas</th>
                  <th>Preço/noite</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                ${alojamentos.map((hotel, index) => `
                  <tr>
                    <td>${hotel.nome}</td>
                    <td>${hotel.cidade}</td>
                    <td>${'★'.repeat(hotel.estrelas)}</td>
                    <td>${hotel.preco}</td>
                    <td>
                      <button class="admin-btn danger" data-remover-alojamento="${index}">Remover</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        document.getElementById('novo-alojamento').addEventListener('click', () => {
          alojamentos.push({
            nome: 'Novo Alojamento',
            cidade: 'Lisboa',
            estrelas: 4,
            preco: '120 €'
          });

          renderAlojamentos();
        });

        document.querySelectorAll('[data-remover-alojamento]').forEach(btn => {
          btn.addEventListener('click', () => {
            alojamentos.splice(Number(btn.dataset.removerAlojamento), 1);
            renderAlojamentos();
          });
        });
      }

      function renderVoos() {
        definirTitulo('Voos');
        ativarMenuPorTexto('Voos');

        area.innerHTML = `
          <div class="painel">
            <div class="painel-header">
              <h2>Voos</h2>
              <button class="admin-btn" id="novo-voo">+ Adicionar voo</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Companhia</th>
                  <th>Rota</th>
                  <th>Preço</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                ${voos.map((voo, index) => `
                  <tr>
                    <td>${voo.nome}</td>
                    <td>${voo.rota}</td>
                    <td>${voo.preco}</td>
                    <td>${badgeEstado(voo.estado)}</td>
                    <td>
                      <button class="admin-btn danger" data-remover-voo="${index}">Remover</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        document.getElementById('novo-voo').addEventListener('click', () => {
          voos.push({
            nome: 'Nova Companhia',
            rota: 'OPO → LIS',
            preco: '59 €',
            estado: 'Ativo'
          });

          renderVoos();
        });

        document.querySelectorAll('[data-remover-voo]').forEach(btn => {
          btn.addEventListener('click', () => {
            voos.splice(Number(btn.dataset.removerVoo), 1);
            renderVoos();
          });
        });
      }

      function renderEventos() {
        definirTitulo('Eventos');
        ativarMenuPorTexto('Eventos');

        area.innerHTML = `
          <div class="painel">
            <div class="painel-header">
              <h2>Eventos</h2>
              <button class="admin-btn" id="novo-evento">+ Adicionar evento</button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Cidade</th>
                  <th>Preço</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                ${eventos.map((evento, index) => `
                  <tr>
                    <td>${evento.nome}</td>
                    <td>${evento.cidade}</td>
                    <td>${evento.preco}</td>
                    <td>${badgeEstado(evento.estado)}</td>
                    <td>
                      <button class="admin-btn danger" data-remover-evento="${index}">Remover</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

        document.getElementById('novo-evento').addEventListener('click', () => {
          eventos.push({
            nome: 'Novo Evento',
            cidade: 'Porto',
            preco: '45 €',
            estado: 'Ativo'
          });

          renderEventos();
        });

        document.querySelectorAll('[data-remover-evento]').forEach(btn => {
          btn.addEventListener('click', () => {
            eventos.splice(Number(btn.dataset.removerEvento), 1);
            renderEventos();
          });
        });
      }

      function renderRelatorios() {
        definirTitulo('Relatórios');
        ativarMenuPorTexto('Relatórios');

        area.innerHTML = `
          <div class="admin-grid">
            <div class="admin-card">
              <h2>Receita mensal</h2>
              <div class="kpi-valor">48.320 €</div>
              <p class="kpi-delta delta-up">↑ 8% vs mês anterior</p>
            </div>

            <div class="admin-card">
              <h2>Taxa de cancelamento</h2>
              <div class="kpi-valor">4,8%</div>
              <p class="kpi-delta delta-down">↑ 0,7% vs mês anterior</p>
            </div>

            <div class="admin-card">
              <h2>Serviço mais reservado</h2>
              <div class="kpi-valor">Hotéis</div>
              <p class="kpi-delta delta-up">62% das reservas</p>
            </div>

            <div class="admin-card">
              <h2>Destino principal</h2>
              <div class="kpi-valor">Lisboa</div>
              <p class="kpi-delta delta-up">74% das pesquisas</p>
            </div>
          </div>
        `;
      }

      function renderDefinicoes() {
        definirTitulo('Definições');
        ativarMenuPorTexto('Definições');

        area.innerHTML = `
          <div class="admin-card">
            <h2>Definições do sistema</h2>

            <form class="admin-form" id="form-definicoes">
              <label>
                Nome da plataforma
                <input type="text" value="LAVI Reservas">
              </label>

              <label>
                Moeda
                <select>
                  <option>EUR</option>
                  <option>USD</option>
                  <option>GBP</option>
                </select>
              </label>

              <label>
                Reservas automáticas
                <select>
                  <option>Ativas</option>
                  <option>Desativadas</option>
                </select>
              </label>

              <label>
                Notificações por e-mail
                <select>
                  <option>Ativas</option>
                  <option>Desativadas</option>
                </select>
              </label>

              <div class="full">
                <button class="admin-btn" type="submit">Guardar definições</button>
              </div>
            </form>
          </div>
        `;

        document.getElementById('form-definicoes').addEventListener('submit', event => {
          event.preventDefault();
          alert('Definições guardadas com sucesso.');
        });
      }

      function renderNotificacoes() {
        definirTitulo('Notificações');
        ativarMenuPorTexto('Notificações');

        area.innerHTML = `
          <div class="alertas">
            <div class="alerta alerta-warn">
              <span class="alerta-icone">⚠️</span>
              3 reservas pendentes de confirmação.
            </div>

            <div class="alerta alerta-info">
              <span class="alerta-icone">ℹ️</span>
              Novo utilizador registado hoje.
            </div>
          </div>

          <div class="painel">
            <div class="painel-header">
              <h2>Centro de notificações</h2>
              <button class="admin-btn secondary" id="limpar-notificacoes">Marcar como lidas</button>
            </div>

            <p style="color: var(--cinza-texto); font-size: 0.9rem;">
              Todas as notificações administrativas aparecem aqui.
            </p>
          </div>
        `;

        document.getElementById('limpar-notificacoes').addEventListener('click', () => {
          alert('Notificações marcadas como lidas.');
        });
      }

      function ligarBotoesDashboard() {
        const notifBtn = document.querySelector('.btn-notif');

        if (notifBtn) {
          notifBtn.addEventListener('click', renderNotificacoes);
        }

        const linksAlerta = document.querySelectorAll('.alerta a');

        if (linksAlerta[0]) {
          linksAlerta[0].addEventListener('click', event => {
            event.preventDefault();
            renderReservas();
          });
        }

        if (linksAlerta[1]) {
          linksAlerta[1].addEventListener('click', event => {
            event.preventDefault();
            renderUtilizadores();
          });
        }

        const verTodas = document.querySelector('.btn-ver-todos');

        if (verTodas) {
          verTodas.addEventListener('click', event => {
            event.preventDefault();
            renderReservas();
          });
        }

        const verTodosUsers = document.querySelectorAll('.btn-ver-todos')[1];

        if (verTodosUsers) {
          verTodosUsers.addEventListener('click', event => {
            event.preventDefault();
            renderUtilizadores();
          });
        }

        document.querySelectorAll('.acao-link').forEach((link, index) => {
          link.addEventListener('click', event => {
            event.preventDefault();

            if (reservas[index]) {
              renderDetalheReserva(reservas[index].ref);
            }
          });
        });
      }

      function ligarMenuLateral() {
        document.querySelectorAll('.sidebar-menu li a').forEach(link => {
          const texto = link.textContent.trim().toLowerCase();

          link.addEventListener('click', event => {
            event.preventDefault();

            if (texto.includes('dashboard')) renderDashboard();
            else if (texto.includes('relatórios')) renderRelatorios();
            else if (texto.includes('reservas')) renderReservas();
            else if (texto.includes('utilizadores')) renderUtilizadores();
            else if (texto.includes('alojamentos')) renderAlojamentos();
            else if (texto.includes('voos')) renderVoos();
            else if (texto.includes('eventos')) renderEventos();
            else if (texto.includes('definições')) renderDefinicoes();
            else if (texto.includes('notificações')) renderNotificacoes();
          });
        });
      }

      ligarMenuLateral();
      ligarBotoesDashboard();
    });