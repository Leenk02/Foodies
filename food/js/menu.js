(function(){
    // elementer
    const qEl = document.getElementById('q');
    const categoryEl = document.getElementById('category');
    const sortByEl = document.getElementById('sortBy');
    const cardsRoot = document.querySelector('#menu-app .cards');

    // state
    let q = '';
    let category = 'Alle';
    let sortBy = 'none';

    // events
    qEl.addEventListener('input',  () => { q = qEl.value; filterAndRender(); });
    categoryEl.addEventListener('change', () => { category = categoryEl.value; filterAndRender(); });
    sortByEl.addEventListener('change',   () => { sortBy = sortByEl.value; filterAndRender(); });

    // SÆT START-KATEGORI)
    const initialTag = location.hash.replace('#','') || new URL(location.href).searchParams.get('tag');
    const tagToCat = { pizza:'Pizza', burger:'Burger', pasta:'Pasta', salad:'Salad', best:'Pizza', new:'Pizza', ugen:'Pizza' };
    if (initialTag && tagToCat[initialTag]) {
        category = tagToCat[initialTag];
        if (categoryEl) categoryEl.value = category;
    }

    // filter + sort
    function getFiltered() {
        let arr = (window.DISHES || []).slice();

        const s = q.trim().toLowerCase();
        if (s) {
            arr = arr.filter(d =>
                d.name.toLowerCase().includes(s) ||
                (d.ingredients || []).join(' ').toLowerCase().includes(s)
            );
        }
        if (category !== 'Alle') {
            arr = arr.filter(d => d.category === category);
        }
        if (sortBy === 'price-asc') arr.sort((a,b)=> a.price - b.price);
        else if (sortBy === 'price-desc') arr.sort((a,b)=> b.price - a.price);
        else if (sortBy === 'name-asc') arr.sort((a,b)=> a.name.localeCompare(b.name));

        return arr;
    }

    // render kort
    function renderCards(list){
        cardsRoot.innerHTML = '';
        if (!list.length) {
            const empty = document.createElement('div');
            empty.className = 'empty';
            empty.textContent = 'Ingen retter matcher søgningen eller filtrene.';
            cardsRoot.appendChild(empty);
            return;
        }
        const frag = document.createDocumentFragment();
        list.forEach(d => {
            const art = document.createElement('article'); art.className = 'card';

            const aImg = document.createElement('a'); aImg.className = 'card-link'; aImg.href = `details.html?id=${d.id}`;
            const img = document.createElement('img'); img.className = 'card-img'; img.src = d.image; img.alt = d.name; img.loading='lazy';
            aImg.appendChild(img);

            const body = document.createElement('div'); body.className = 'card-body';

            const h3 = document.createElement('h3'); h3.className = 'card-name';
            const aName = document.createElement('a'); aName.className = 'name-link'; aName.href = `details.html?id=${d.id}`;
            aName.textContent = d.name; h3.appendChild(aName);

            const price = document.createElement('p'); price.className = 'card-price'; price.textContent = `${d.price} DKK`;

            const actions = document.createElement('div'); actions.className = 'card-actions';
            const detailsBtn = document.createElement('a'); detailsBtn.className = 'btn details'; detailsBtn.href = `details.html?id=${d.id}`; detailsBtn.textContent = 'Detaljer';
            const addBtn = document.createElement('button'); addBtn.className = 'btn primary'; addBtn.type='button'; addBtn.textContent='Tilføj';
            addBtn.addEventListener('click', () => {
                if (window.cart && window.cart.add) {
                    window.cart.add(d);

                    // Vis en lille toast/besked i stedet for alert
                    const toast = document.createElement('div');
                    toast.textContent = `✓ ${d.name} tilføjet`;
                    toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
                    document.body.appendChild(toast);

                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 2000);

                } else {
                    console.error('Cart system not loaded');
                }
            });

// Tilføj CSS animation
            const style = document.createElement('style');
            style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;
            document.head.appendChild(style);
            actions.append(detailsBtn, addBtn);
            body.append(h3, price, actions);
            art.append(aImg, body);
            frag.appendChild(art);
        });
        cardsRoot.appendChild(frag);
    }

    // hovedfunktion til filtrering og rendering
    function filterAndRender() {
        const filtered = getFiltered();
        renderCards(filtered);
    }

    // første rendering
    filterAndRender();

    // loop til at fange ændringer og opdatere UI
    let last = '';
    (function loop(){
        const cur = getFiltered();
        const sig = JSON.stringify(cur.map(x=>x.id));
        if (sig !== last) { renderCards(cur); last = sig; }
        requestAnimationFrame(loop);
    })();
})();
