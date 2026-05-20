document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. BASE DE DADOS 
    // ==========================================================================
    const itensDatabase = [
        {
            id: 1,
            tipo: 'hotel',
            nome: 'Hotel Avenida Palace',
            estrelas: '5',
            preco: 195,
            noites: 5,
            total: 975,
            localizacao: 'Lisboa, Avenida da Liberdade • 0,5 km do centro',
            comodidades: 'Wi-Fi gratuito • Piscina • Spa • Restaurante',
            imagem: 'images/avenida-palace.webp',
            destaque: true,
            textoBotao: 'Reservar'
        },
        {
            id: 2,
            tipo: 'hotel',
            nome: 'Hotel Bairro Alto',
            estrelas: '4',
            preco: 145,
            noites: 5,
            total: 725,
            localizacao: 'Lisboa, Chiado • 1,2 km do centro',
            comodidades: 'Wi-Fi gratuito • Bar • Vista cidade • Animais permitidos',
            imagem: 'images/bairro-alto.webp',
            destaque: false,
            textoBotao: 'Reservar'
        },
        {
            id: 3,
            tipo: 'hotel',
            nome: 'Residencial Rossio',
            estrelas: '3',
            preco: 55,
            noites: 5,
            total: 275,
            localizacao: 'Lisboa, Baixa • Centro histórico',
            comodidades: 'Wi-Fi gratuito • Pequeno-almoço incluído • Ar condicionado',
            imagem: 'images/rossio.webp',
            destaque: false,
            textoBotao: 'Reservar'
        },
        {
            id: 4,
            tipo: 'hotel',
            nome: 'Pestana CR7 Lisboa',
            estrelas: '4',
            preco: 130,
            noites: 5,
            total: 650,
            localizacao: 'Lisboa, Rua do Comércio • 0,3 km do centro',
            comodidades: 'Wi-Fi gratuito • Ginásio • Bar Desportivo',
            imagem: 'images/pestana-cr7.webp',
            destaque: true,
            textoBotao: 'Reservar'
        },
        {
            id: 5,
            tipo: 'hotel',
            nome: 'Tivoli Avenida Liberdade',
            estrelas: '5',
            preco: 260,
            noites: 5,
            total: 1300,
            localizacao: 'Lisboa, Avenida da Liberdade • 0,8 km do centro',
            comodidades: 'Piscina Exterior • Sky Bar • Spa de Luxo',
            imagem: 'images/tivoli.webp',
            destaque: true,
            textoBotao: 'Reservar'
        },
        {
            id: 6,
            tipo: 'hotel',
            nome: 'Selina Secret Garden',
            estrelas: '3',
            preco: 42,
            noites: 5,
            total: 210,
            localizacao: 'Lisboa, Cais do Sodré • 1,5 km do centro',
            comodidades: 'Wi-Fi gratuito • Piscina • Cozinha partilhada',
            imagem: 'images/selina.webp',
            destaque: false,
            textoBotao: 'Reservar'
        },
        {
            id: 7,
            tipo: 'hotel',
            nome: 'Hotel Mundial',
            estrelas: '4',
            preco: 98,
            noites: 5,
            total: 490,
            localizacao: 'Lisboa, Martim Moniz • 0,1 km do centro',
            comodidades: 'Rooftop Bar • Estacionamento Grátis',
            imagem: 'images/mundial.webp',
            destaque: false,
            textoBotao: 'Reservar'
        },
        {
            id: 8,
            tipo: 'hotel',
            nome: 'Myriad by SANA',
            estrelas: '5',
            preco: 310,
            noites: 5,
            total: 1550,
            localizacao: 'Lisboa, Parque das Nações • Frente ao Rio',
            comodidades: 'Vista Panorâmica • Spa • Restaurante Michelin',
            imagem: 'images/myriad.webp',
            destaque: true,
            textoBotao: 'Reservar'
        },
        {
            id: 9,
            tipo: 'voo',
            nome: 'TAP Air Portugal (OPO ✈ LIS)',
            estrelas: 'voo',
            preco: 85,
            noites: 0,
            total: 170,
            localizacao: 'Voo OPO ➝ LIS • Direto',
            comodidades: 'Bagagem de mão • Refeição a bordo',
            imagem: 'images/tap.webp',
            destaque: true,
            textoBotao: 'Selecionar'
        },
        {
            id: 10,
            tipo: 'voo',
            nome: 'Ryanair (MAD ✈ LIS)',
            estrelas: 'voo',
            preco: 35,
            noites: 0,
            total: 70,
            localizacao: 'Voo MAD ➝ LIS • Económico • Direto',
            comodidades: 'Artigo pessoal pequeno',
            imagem: 'images/ryanair.webp',
            destaque: false,
            textoBotao: 'Selecionar'
        }
    ];

    // Elementos do HTML
    const hotelListContainer = document.querySelector('.hotel-list');
    const sortSelect = document.getElementById('sort-options');
    const priceSlider = document.getElementById('price-slider');
    const priceLabel = document.getElementById('price-label');
    const applyBtn = document.querySelector('.apply-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const resultsCount = document.getElementById('results-count');

    let itensAtuais = [...itensDatabase];

    // ==========================================================================
    // 2. FUNÇÃO DE RENDERIZAÇÃO
    // ==========================================================================
    function renderizarCards(lista) {
        hotelListContainer.innerHTML = ''; 

        if (lista.length === 0) {
            hotelListContainer.innerHTML = '<p style="padding: 40px; text-align: center; color: #888; font-weight: bold;">Nenhum resultado encontrado para os filtros selecionados.</p>';
            resultsCount.textContent = '0 resultados';
            return;
        }

        lista.forEach(item => {
            const article = document.createElement('article');
            article.className = 'hotel-card';
            
            let badgeHTML = '';
            if (item.destaque) {
                const corBadge = item.tipo === 'voo' ? '#1a6ef5' : '#f5a623';
                const textoBadge = item.tipo === 'voo' ? '✈️ Voo direto' : '★ Destaque';
                badgeHTML = `<div class="badge" style="background-color: ${corBadge}">${textoBadge}</div>`;
            }

            const subtextoPreco = item.tipo === 'hotel' ? `por noite • ${item.noites} noites` : 'ida e volta / pessoa';

            article.innerHTML = `
                ${badgeHTML}
                <div class="hotel-image" style="overflow: hidden; width: 220px; min-height: 180px; display: flex; align-items: center; justify-content: center; background-color: #d8dde6; border-right: 1px solid #e0e0e0;">
                    <img src="${item.imagem}" alt="${item.nome}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentNode.innerHTML='<span style=\\'color: #888; font-size: 14px; padding: 20px; text-align: center;\\'>[Adiciona a foto ${item.imagem} na pasta]</span>'"> 
                </div>
                <div class="hotel-info">
                    <h3>${item.nome}</h3>
                    ${item.tipo === 'hotel' ? `<span class="stars">${'★'.repeat(parseInt(item.estrelas))}</span>` : ''}
                    <p class="details">${item.localizacao}</p>
                    <p class="amenities">${item.comodidades}</p>
                </div>
                <div class="hotel-price">
                    <span class="price">${item.preco} €</span>
                    <span class="price-sub">${subtextoPreco}</span>
                    <span class="price-total">Total: ${item.total} €</span>
                    <button class="book-btn">${item.textoBotao}</button>
                </div>
            `;
            
            hotelListContainer.appendChild(article);
        });

        resultsCount.textContent = `${lista.length} resultado${lista.length !== 1 ? 's' : ''}`;
    }

    // ==========================================================================
    // 3. CONTROLADORES
    // ==========================================================================
    function aplicarFiltros() {
        const maxPrice = parseFloat(priceSlider.value);
        const checkedStars = Array.from(document.querySelectorAll('.star-filter:checked')).map(cb => cb.value);

        itensAtuais = itensDatabase.filter(item => {
            const priceMatch = item.preco <= maxPrice;
            const starsMatch = (item.tipo === 'voo') || checkedStars.includes(item.estrelas);
            return priceMatch && starsMatch;
        });

        executarOrdenacao();
        renderizarCards(itensAtuais);
    }

    function executarOrdenacao() {
        const order = sortSelect.value;
        itensAtuais.sort((a, b) => {
            return order === 'asc' ? a.preco - b.preco : b.preco - a.preco;
        });
    }

    sortSelect.addEventListener('change', () => {
        executarOrdenacao();
        renderizarCards(itensAtuais);
    });

    priceSlider.addEventListener('input', (e) => {
        priceLabel.textContent = `até ${e.target.value} €`;
    });

    applyBtn.addEventListener('click', () => {
        aplicarFiltros();
        applyBtn.textContent = 'Filtros Aplicados ✓';
        applyBtn.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            applyBtn.textContent = 'Aplicar filtros';
            applyBtn.style.backgroundColor = '#1a6ef5';
        }, 1200);
    });

    resetBtn.addEventListener('click', () => {
        priceSlider.value = 1000;
        priceLabel.textContent = 'até 1000 €';
        
        document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });

        itensAtuais = [...itensDatabase];
        executarOrdenacao();
        renderizarCards(itensAtuais);
    });

    // INIT
    executarOrdenacao();
    renderizarCards(itensAtuais);
});