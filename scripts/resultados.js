document.addEventListener('DOMContentLoaded', () => {
    // Apanhar os elementos do ecrã
    const sortSelect = document.getElementById('sort-options');
    const hotelList = document.querySelector('.hotel-list');
    const priceSlider = document.getElementById('price-slider');
    const priceLabel = document.getElementById('price-label');
    
    // Apanhar todos os cards que existem na lista
    let cards = Array.from(document.querySelectorAll('.hotel-card'));

    // 1. SISTEMA DE ORDENAÇÃO (Crescente / Decrescente)
    sortSelect.addEventListener('change', (e) => {
        const order = e.target.value;
        
        cards.sort((a, b) => {
            // Vai buscar o valor que metemos no data-price do HTML
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            
            if (order === 'asc') return priceA - priceB;
            if (order === 'desc') return priceB - priceA;
            return 0;
        });

        // Limpa a lista e volta a meter os cards ordenados
        hotelList.innerHTML = '';
        cards.forEach(card => hotelList.appendChild(card));
    });

    // 2. SISTEMA DE FILTRO DE PREÇO NO SLIDER
    priceSlider.addEventListener('input', (e) => {
        const maxPrice = parseFloat(e.target.value);
        priceLabel.textContent = `até ${maxPrice} €`; // Atualiza o texto visual

        // Esconde ou mostra os cards com base no preço
        cards.forEach(card => {
            const cardPrice = parseFloat(card.getAttribute('data-price'));
            if (cardPrice <= maxPrice) {
                card.style.display = 'flex'; // Mostra o card (usa flex por causa do teu CSS)
            } else {
                card.style.display = 'none'; // Esconde o card
            }
        });
    });
});