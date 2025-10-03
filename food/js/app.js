// --- Global cart med lokal lagring ---
const cart = {
    items: JSON.parse(localStorage.getItem('cart') || '[]'),
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        updateCartCount();
    },
    add(dish, qty = 1) {
        const q = Math.max(1, Number(qty) || 1);
        const existing = this.items.find(i => i.id === dish.id);
        if (existing) existing.qty += q;
        else this.items.push({ id: dish.id, name: dish.name, price: dish.price, qty: q, image: dish.image });
        this.save();
    },
    inc(id) {
        const it = this.items.find(i => i.id === id);
        if (it) {
            it.qty++;
            this.save();
        }
    },
    dec(id) {
        const it = this.items.find(i => i.id === id);
        if (it && it.qty > 1) {
            it.qty--;
            this.save();
        }
    },
    remove(id) {
        const idx = this.items.findIndex(i => i.id === id);
        if (idx !== -1) {
            this.items.splice(idx, 1);
            this.save();
        }
    },
    clear() {
        this.items.length = 0;
        this.save();
    },
    total() {
        return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },
    count() {
        return this.items.reduce((sum, i) => sum + i.qty, 0);
    }
};

function updateCartCount(){
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = `(${cart.count()})`;
}

// --- UI funktioner ---

// Render kategorier
function renderCategories(categories, selectEl) {
    selectEl.innerHTML = '';
    categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        selectEl.appendChild(opt);
    });
}

// Render retter (dishes)
function renderDishes(list, root) {
    root.innerHTML = '';
    if (!list.length) {
        const empty = document.createElement('div');
        empty.className = 'empty';
        empty.textContent = 'Ingen retter matcher søgningen eller filtrene.';
        root.appendChild(empty);
        return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(d => {
        const art = document.createElement('article');
        art.className = 'card';

        const aImg = document.createElement('a');
        aImg.className = 'card-link';
        aImg.href = `details.html?id=${d.id}`;
        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = d.image;
        img.alt = d.name;
        img.loading = 'lazy';
        aImg.appendChild(img);

        const body = document.createElement('div');
        body.className = 'card-body';

        const h3 = document.createElement('h3');
        h3.className = 'card-name';
        const aName = document.createElement('a');
        aName.className = 'name-link';
        aName.href = `details.html?id=${d.id}`;
        aName.textContent = d.name;
        h3.appendChild(aName);

        const price = document.createElement('p');
        price.className = 'card-price';
        price.textContent = `${d.price.toFixed(2)} DKK`;

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const detailsBtn = document.createElement('a');
        detailsBtn.className = 'btn details';
        detailsBtn.href = `details.html?id=${d.id}`;
        detailsBtn.textContent = 'Detaljer';

        const addBtn = document.createElement('button');
        addBtn.className = 'btn primary';
        addBtn.type = 'button';
        addBtn.textContent = 'Tilføj';
        addBtn.addEventListener('click', () => {
            cart.add(d, 1);
            alert(`Tilføjet ${d.name} til kurven.`);
        });

        actions.append(detailsBtn, addBtn);
        body.append(h3, price, actions);
        art.append(aImg, body);
        frag.appendChild(art);
    });
    root.appendChild(frag);
}

// Filtrering af retter
function filterDishes(dishes, q, category, minPrice, maxPrice, sortBy) {
    let arr = dishes.slice();

    const s = q.trim().toLowerCase();
    if (s) {
        arr = arr.filter(d =>
            d.name.toLowerCase().includes(s) ||
            (d.ingredients || []).join(' ').toLowerCase().includes(s)
        );
    }
    if (category !== 'All') {
        arr = arr.filter(d => d.category === category);
    }
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!isNaN(min)) {
        arr = arr.filter(d => d.price >= min);
    }
    if (!isNaN(max) && max > 0) {
        arr = arr.filter(d => d.price <= max);
    }

    if (sortBy === 'price-asc') arr.sort((a,b) => a.price - b.price);
    else if (sortBy === 'price-desc') arr.sort((a,b) => b.price - a.price);
    else if (sortBy === 'name-asc') arr.sort((a,b) => a.name.localeCompare(b.name));

    return arr;
}

// --- App start ---
document.addEventListener('DOMContentLoaded', () => {
    // Elementer
    const qEl = document.querySelector('input[type="search"]');
    const categoryEl = document.querySelector('select[name="category"]');
    const minPriceEl = document.querySelector('input[name="minPrice"]');
    const maxPriceEl = document.querySelector('input[name="maxPrice"]');
    const sortByEl = document.querySelector('select[name="sortBy"]');
    const dishesRoot = document.querySelector('.grid');

    if (!window.DISHES) {
        console.error('DISHES data mangler');
        return;
    }

    // Opbyg kategorier
    const categoriesSet = new Set(['All']);
    window.DISHES.forEach(d => categoriesSet.add(d.category));
    const categories = Array.from(categoriesSet);
    if (categoryEl) renderCategories(categories, categoryEl);

    // Funktion til at opdatere visning af retter
    function updateView() {
        const filtered = filterDishes(
            window.DISHES,
            qEl.value || '',
            categoryEl.value || 'All',
            minPriceEl.value || '',
            maxPriceEl.value || '',
            sortByEl.value || 'none'
        );
        renderDishes(filtered, dishesRoot);
    }

    // Event listeners
    qEl.addEventListener('input', updateView);
    categoryEl.addEventListener('change', updateView);
    minPriceEl.addEventListener('input', updateView);
    maxPriceEl.addEventListener('input', updateView);
    sortByEl.addEventListener('change', updateView);

    updateView();
    updateCartCount();

    function showPage() {
        const hash = location.hash || '#/';
        if (hash.startsWith('#/dish/')) {
            const id = hash.split('/')[2];
            renderDishDetails(id);
        } else if (hash === '#/cart') {
            renderCart();
        } else {
            renderHome();
        }
    }
    window.addEventListener('hashchange', showPage);
    showPage();

    // --- Rendering views ---

    // Home
    function renderHome() {
        // Vis grid (alle filtrerede retter)
        if (dishesRoot) dishesRoot.style.display = 'grid';
        clearContainer(document.getElementById('dish-details'));
        clearContainer(document.getElementById('cart-view'));
    }

    // Ret detaljer
    function renderDishDetails(id) {
        const container = document.getElementById('dish-details');
        clearContainer(container);
        clearContainer(document.getElementById('cart-view'));
        if (dishesRoot) dishesRoot.style.display = 'none';

        const dish = window.DISHES.find(d => String(d.id) === String(id));
        if (!dish) {
            container.textContent = 'Ret ikke fundet.';
            return;
        }
        const img = document.createElement('img');
        img.src = dish.image;
        img.alt = dish.name;
        img.style = 'max-height:320px; width:100%; object-fit:cover; border-radius:10px;';

        const h2 = document.createElement('h2');
        h2.textContent = dish.name;

        const categoryP = document.createElement('p');
        categoryP.innerHTML = `<strong>Kategori:</strong> ${dish.category}`;

        const priceP = document.createElement('p');
        priceP.className = 'price';
        priceP.textContent = `${dish.price.toFixed(2)} DKK`;

        const ingH3 = document.createElement('h3');
        ingH3.textContent = 'Ingredienser';

        const ul = document.createElement('ul');
        dish.ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.textContent = ing;
            ul.appendChild(li);
        });

        const allergH3 = document.createElement('h3');
        allergH3.textContent = 'Allergener';

        const badgesDiv = document.createElement('div');
        badgesDiv.className = 'badges';
        dish.allergens.forEach(a => {
            const span = document.createElement('span');
            span.className = 'badge ' + String(a).toLowerCase();
            span.textContent = a;
            badgesDiv.appendChild(span);
        });

        const descP = document.createElement('p');
        descP.className = 'desc';
        descP.textContent = dish.description;

        const btn = document.createElement('button');
        btn.className = 'btn primary';
        btn.textContent = 'Læg i kurv';
        btn.addEventListener('click', () => {
            cart.add(dish, 1);
            alert(`${dish.name} tilføjet til kurven.`);
            location.hash = '#/';
        });

        clearContainer(container);
        container.append(img, h2, categoryP, priceP, ingH3, ul, allergH3, badgesDiv, descP, btn);
    }

    // Kurv visning
    function renderCart() {
        const container = document.getElementById('cart-view');
        clearContainer(container);
        if (dishesRoot) dishesRoot.style.display = 'none';
        clearContainer(document.getElementById('dish-details'));

        if (cart.items.length === 0) {
            const p = document.createElement('p');
            p.className = 'empty';
            p.textContent = 'Kurven er tom.';
            container.appendChild(p);
            return;
        }

        cart.items.forEach(i => {
            const art = document.createElement('article');
            art.className = 'row';

            const img = document.createElement('img');
            img.src = i.image;
            img.alt = i.name;

            const col = document.createElement('div');
            col.className = 'col';

            const h3 = document.createElement('h3');
            h3.textContent = i.name;

            const p = document.createElement('p');
            p.textContent = `${i.qty} × ${i.price.toFixed(2)} DKK`;

            const qtyDiv = document.createElement('div');
            qtyDiv.className = 'qty';

            const decBtn = document.createElement('button');
            decBtn.className = 'btn';
            decBtn.textContent = '-';
            decBtn.addEventListener('click', () => {
                cart.dec(i.id);
                renderCart();
            });

            const spanQty = document.createElement('span');
            spanQty.textContent = i.qty;

            const incBtn = document.createElement('button');
            incBtn.className = 'btn';
            incBtn.textContent = '+';
            incBtn.addEventListener('click', () => {
                cart.inc(i.id);
                renderCart();
            });

            qtyDiv.append(decBtn, spanQty, incBtn);

            const remBtn = document.createElement('button');
            remBtn.className = 'btn danger';
            remBtn.textContent = 'Slet';
            remBtn.addEventListener('click', () => {
                cart.remove(i.id);
                renderCart();
            });

            col.append(h3, p, qtyDiv);
            art.append(img, col, remBtn);
            container.appendChild(art);
        });

        const hr = document.createElement('hr');

        const totalP = document.createElement('p');
        totalP.className = 'total';
        totalP.textContent = `Total: ${cart.total().toFixed(2)} DKK`;

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn';
        clearBtn.textContent = 'Tøm kurv';
        clearBtn.addEventListener('click', () => {
            cart.clear();
            renderCart();
        });

        container.append(hr, totalP, clearBtn);
    }

    function clearContainer(el) {
        if (el) el.innerHTML = '';
    }
});
