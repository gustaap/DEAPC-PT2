document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort-options');
    const hotelList = document.querySelector('.hotel-list');
    const priceSlider = document.getElementById('price-slider');
    const priceLabel = document.getElementById('price-label');
    const applyBtn = document.querySelector('.apply-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const resultsCount = document.getElementById('results-count');

    let cards = Array.from(document.querySelectorAll('.hotel-card'));

    // 1. ORDENAÇÃO
    sortSelect.addEventListener('change', (e) => {
        const order = e.target.value;
        cards.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute('data-price'));
            const priceB = parseFloat(b.getAttribute('data-price'));
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        });
        hotelList.innerHTML = '';
        cards.forEach(card => hotelList.appendChild(card));
    });

    // 2. ATUALIZAR LABEL DO SLIDER
    priceSlider.addEventListener('input', (e) => {
        priceLabel.textContent = `até ${e.target.value} €`;
    });

    // 3. APLICAR FILTROS (Agorra com Estrelas A SERIO!)
    applyBtn.addEventListener('click', () => {
        const maxPrice = parseFloat(priceSlider.value);
        
        // Vai buscar quais as caixinhas de estrelas que o user ativou (ex: "5", "4", "3")
        const checkedStars = Array.from(document.querySelectorAll('.star-filter:checked')).map(cb => cb.value);
        
        let count = 0;

        cards.forEach(card => {
            const cardPrice = parseFloat(card.getAttribute('data-price'));
            const cardStars = card.getAttribute('data-stars');

            // Regra 1: Preço tem de ser menor ou igual ao slider
            const priceMatch = cardPrice <= maxPrice;
            
            // Regra 2: Ou é um voo, ou o número de estrelas tem de estar marcado nas checkboxes
            const starsMatch = (cardStars === 'voo') || checkedStars.includes(cardStars);

            // Se bater certo com as DUAS regras, o card aparece
            if (priceMatch && starsMatch) {
                card.style.display = 'flex'; 
                count++;
            } else {
                card.style.display = 'none'; 
            }
        });

        resultsCount.textContent = `${count} resultado${count !== 1 ? 's' : ''}`;

        // Feedback de Sucesso no botão
        applyBtn.textContent = 'Filtros Aplicados ✓';
        applyBtn.style.backgroundColor = '#27ae60';
        setTimeout(() => {
            applyBtn.textContent = 'Aplicar filtros';
            applyBtn.style.backgroundColor = '#1a6ef5';
        }, 1500);
    });

    // 4. RESETAR TUDO
    resetBtn.addEventListener('click', () => {
        priceSlider.value = 1000;
        priceLabel.textContent = 'até 1000 €';
        
        // Mete os vistos em todas as checkboxes da barra lateral
        document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });

        cards.forEach(card => card.style.display = 'flex');
        resultsCount.textContent = `${cards.length} resultados`;
    });
});