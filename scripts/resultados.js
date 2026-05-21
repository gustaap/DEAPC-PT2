document.addEventListener('DOMContentLoaded', () => {

    // If this JS is accidentally loaded on index.html, stop here.
    const hotelListContainer = document.querySelector('.hotel-list');
    if (!hotelListContainer) return;
    
    const itensDatabase = window.itensDatabase || [];
    // ==========================================================================
    // 1. PSEUDO BASE DE DADOS
    // ==========================================================================

    // ==========================================================================
    // 2. LER PARÂMETROS VINDOS DO INDEX.HTML
    // ==========================================================================

    const params = new URLSearchParams(window.location.search);

    const pesquisa = {
        tipo: normalizarTipo(params.get('tipo')),
        destino: normalizarTexto(params.get('destino') || ''),
        entrada: params.get('entrada') || '',
        saida: params.get('saida') || '',
        pessoas: Number(params.get('pessoas')) || 1
    };

    // ==========================================================================
    // 3. ELEMENTOS DO HTML
    // ==========================================================================

    const sortSelect = document.getElementById('sort-options');
    const priceSlider = document.getElementById('price-slider');
    const priceLabel = document.getElementById('price-label');
    const applyBtn = document.querySelector('.apply-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const resultsCount = document.getElementById('results-count');

    // ==========================================================================
    // 4. FUNÇÕES AUXILIARES
    // ==========================================================================

    function normalizarTexto(texto) {
        return String(texto)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function normalizarTipo(tipo) {
        const valor = normalizarTexto(tipo || '');

        if (valor.includes('hotel')) return 'hotel';
        if (valor.includes('voo')) return 'voo';
        if (valor.includes('evento')) return 'evento';

        return '';
    }

    function calcularNoites(entrada, saida) {
        if (!entrada || !saida) return 1;

        const dataEntrada = new Date(entrada);
        const dataSaida = new Date(saida);

        const diferencaMs = dataSaida - dataEntrada;
        const noites = Math.ceil(diferencaMs / (1000 * 60 * 60 * 24));

        return Math.max(noites, 1);
    }

    function datasCompativeis(item) {
        if (!pesquisa.entrada && !pesquisa.saida) return true;

        const inicioPesquisa = pesquisa.entrada || pesquisa.saida;
        const fimPesquisa = pesquisa.saida || pesquisa.entrada;

        return inicioPesquisa >= item.disponivelDe && fimPesquisa <= item.disponivelAte;
    }

    function destinoCompativel(item) {
        if (!pesquisa.destino) return true;

        const textoItem = normalizarTexto(`
            ${item.nome}
            ${item.destino}
            ${item.origem || ''}
            ${item.localizacao}
        `);

        return textoItem.includes(pesquisa.destino);
    }

    function calcularTotal(item) {
        const noites = calcularNoites(pesquisa.entrada, pesquisa.saida);

        if (item.tipo === 'hotel') {
            return item.preco * noites;
        }

        if (item.tipo === 'voo' || item.tipo === 'evento') {
            return item.preco * pesquisa.pessoas;
        }

        return item.preco;
    }

    function criarUrlReserva(item) {
    const reservaParams = new URLSearchParams();

    reservaParams.set('id', item.id);
    reservaParams.set('tipo', item.tipo);
    reservaParams.set('pessoas', pesquisa.pessoas);

    if (pesquisa.entrada) reservaParams.set('entrada', pesquisa.entrada);
    if (pesquisa.saida) reservaParams.set('saida', pesquisa.saida);

    if (item.destino) reservaParams.set('destino', item.destino);
    if (item.origem) reservaParams.set('origem', item.origem);

    return `reserva.html?${reservaParams.toString()}`;
}

    function itemCorrespondePesquisa(item) {
        const tipoMatch = !pesquisa.tipo || item.tipo === pesquisa.tipo;
        const destinoMatch = destinoCompativel(item);
        const datasMatch = datasCompativeis(item);
        const pessoasMatch = pesquisa.pessoas <= item.capacidadeMax;

        return tipoMatch && destinoMatch && datasMatch && pessoasMatch;
    }

    // First filter: data coming from index.html
    const itensPesquisaBase = itensDatabase.filter(itemCorrespondePesquisa);

    let itensAtuais = [...itensPesquisaBase];

    // ==========================================================================
    // 5. RENDERIZAR RESULTADOS
    // ==========================================================================

    function renderizarCards(lista) {
        hotelListContainer.innerHTML = '';
        
        if (lista.length === 0) {
            hotelListContainer.innerHTML = `
                <p style="padding: 40px; text-align: center; color: #888; font-weight: bold;">
                    Nenhum resultado encontrado para os filtros selecionados.
                </p>
            `;

            if (resultsCount) {
                resultsCount.textContent = '0 resultados';
            }

            return;
        }

        lista.forEach(item => {
            const article = document.createElement('article');
            article.className = 'hotel-card';

            let badgeHTML = '';

            if (item.destaque) {
                let textoBadge = '★ Destaque';

                if (item.tipo === 'voo') textoBadge = '✈️ Voo direto';
                if (item.tipo === 'evento') textoBadge = '🎟️ Evento popular';

                badgeHTML = `<div class="badge">${textoBadge}</div>`;
            }

            const noites = calcularNoites(pesquisa.entrada, pesquisa.saida);
            const total = calcularTotal(item);

            let subtextoPreco = '';

            if (item.tipo === 'hotel') {
                subtextoPreco = `por noite • ${noites} noite${noites !== 1 ? 's' : ''}`;
            } else if (item.tipo === 'voo') {
                subtextoPreco = 'ida e volta / pessoa';
            } else if (item.tipo === 'evento') {
                subtextoPreco = 'por bilhete';
            }

            article.innerHTML = `
                ${badgeHTML}

                <div class="hotel-image" style="overflow: hidden; width: 220px; min-height: 180px; display: flex; align-items: center; justify-content: center; background-color: #d8dde6; border-right: 1px solid #e0e0e0;">
                    <img 
                        src="${item.imagem}" 
                        alt="${item.nome}" 
                        style="width: 100%; height: 100%; object-fit: cover;"
                        onerror="this.style.display='none'; this.parentNode.innerHTML='<span style=\\'color: #888; font-size: 14px; padding: 20px; text-align: center;\\'>Imagem não encontrada</span>'">
                </div>

                <div class="hotel-info">
                    <h3>${item.nome}</h3>

                    ${
                        item.tipo === 'hotel'
                            ? `<span class="stars">${'★'.repeat(Number(item.estrelas))}</span>`
                            : ''
                    }

                    <p class="details">${item.localizacao}</p>
                    <p class="amenities">${item.comodidades}</p>
                    <p class="details">Capacidade disponível: até ${item.capacidadeMax} pessoa${item.capacidadeMax !== 1 ? 's' : ''}</p>
                </div>

                <div class="hotel-price">
                    <span class="price">${item.preco} €</span>
                    <span class="price-sub">${subtextoPreco}</span>
                    <span class="price-total">Total: ${total} €</span>
                    <a class="book-btn" href="${criarUrlReserva(item)}">${item.textoBotao}</a>
                </div>
            `;

            hotelListContainer.appendChild(article);
        });

        if (resultsCount) {
            resultsCount.textContent = `${lista.length} resultado${lista.length !== 1 ? 's' : ''}`;
        }
    }

    // ==========================================================================
    // 6. FILTROS EXTRA DA PÁGINA RESULTADOS
    // ==========================================================================

    function obterAliasesComodidade(valor) {
        const aliases = {
            'wi-fi': ['wi-fi', 'wifi', 'internet'],
            'piscina': ['piscina'],
            'estacionamento': ['estacionamento'],
            'pet-friendly': ['pet-friendly', 'animais permitidos', 'animais'],
            'spa': ['spa'],
            'ginasio': ['ginasio', 'ginásio', 'academia']
        };

        return aliases[valor] || [valor];
    }

    function comodidadesCompativeis(item, comodidadesSelecionadas) {
        if (comodidadesSelecionadas.length === 0) {
            return true;
        }

        const textoComodidades = normalizarTexto(item.comodidades || '');

        return comodidadesSelecionadas.every(comodidade => {
            const aliases = obterAliasesComodidade(comodidade);

            return aliases.some(alias => {
                return textoComodidades.includes(normalizarTexto(alias));
            });
        });
    }

    function aplicarFiltros() {
    const maxPrice = priceSlider ? Number(priceSlider.value) : Infinity;

    const checkedStars = Array.from(document.querySelectorAll('.star-filter:checked'))
        .map(cb => cb.value);

    const checkedAmenities = Array.from(document.querySelectorAll('.amenity-filter:checked'))
        .map(cb => cb.value);

    itensAtuais = itensPesquisaBase.filter(item => {
        const priceMatch = item.preco <= maxPrice;

        const starsMatch =
            checkedStars.length === 0 ||
            item.tipo === 'voo' ||
            item.tipo === 'evento' ||
            checkedStars.includes(item.estrelas);

        const amenitiesMatch =
            item.tipo !== 'hotel' ||
            comodidadesCompativeis(item, checkedAmenities);

        return priceMatch && starsMatch && amenitiesMatch;
    });

    executarOrdenacao();
    renderizarCards(itensAtuais);
}

    function executarOrdenacao() {
        if (!sortSelect) return;

        const order = sortSelect.value;

        itensAtuais.sort((a, b) => {
            if (order === 'asc') {
                return a.preco - b.preco;
            }

            return b.preco - a.preco;
        });
    }

    // ==========================================================================
    // 7. EVENT LISTENERS
    // ==========================================================================

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            executarOrdenacao();
            renderizarCards(itensAtuais);
        });
    }

    if (priceSlider && priceLabel) {
        priceSlider.addEventListener('input', (e) => {
            priceLabel.textContent = `até ${e.target.value} €`;
        });
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            aplicarFiltros();

            applyBtn.textContent = 'Filtros Aplicados ✓';
            applyBtn.style.backgroundColor = '#27ae60';

            setTimeout(() => {
                applyBtn.textContent = 'Aplicar filtros';
                applyBtn.style.backgroundColor = '#1a6ef5';
            }, 1200);
        });
    }

    if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (priceSlider) {
            priceSlider.value = 1000;
        }

        if (priceLabel) {
            priceLabel.textContent = 'até 1000 €';
        }

        document.querySelectorAll('.star-filter').forEach(cb => {
            cb.checked = true;
        });

        document.querySelectorAll('.amenity-filter').forEach(cb => {
            cb.checked = false;
        });

        itensAtuais = [...itensPesquisaBase];

        executarOrdenacao();
        renderizarCards(itensAtuais);
    });
}

    // ==========================================================================
    // 8. INIT
    // ==========================================================================

    executarOrdenacao();
    renderizarCards(itensAtuais);
});