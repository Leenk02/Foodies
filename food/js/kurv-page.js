(function () {
    // DOM elementer
    const root = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const notesEl = document.getElementById('notes');
    const btnOrder = document.getElementById('checkoutBtn');
    const modal = document.getElementById('order-modal');
    const modalOk = document.getElementById('modal-ok');
    const summaryEl = document.getElementById('order-summary');

    if (!root || !totalEl || !btnOrder) return;

    const NOTES_KEY = 'cartNotes';
    let lastFocused;

    // Skabelon for en række (produkt i kurven)
    function rowTemplate(item) {
        const createBtn = (text, cls, onClick, ariaLabel) => {
            const btn = document.createElement('button');
            btn.className = cls;
            btn.type = 'button';
            btn.textContent = text;
            if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
            btn.addEventListener('click', onClick);
            return btn;
        };

        const art = document.createElement('article');
        art.className = 'cart-row';

        const name = document.createElement('div');
        name.className = 'col name';
        name.textContent = item.name;

        const qty = document.createElement('div');
        qty.className = 'col qty';

        const dec = createBtn('−', 'btn sm', () => {
            window.cartAPI.dec(item.id);
            render();
        });
        const q = document.createElement('span');
        q.className = 'q';
        q.textContent = item.qty;

        const inc = createBtn('+', 'btn sm', () => {
            window.cartAPI.inc(item.id);
            render();
        });

        qty.append(dec, q, inc);

        const price = document.createElement('div');
        price.className = 'col price';
        price.textContent = `${item.price},-`;

        const del = createBtn('Slet', 'btn danger sm', () => {
            window.cartAPI.remove(item.id);
            render();
        }, `Slet ${item.name}`);

        art.append(name, qty, price, del);
        return art;
    }

    // Vis produkter og opdater total
    // Vis produkter og opdater total
    function render() {
        console.log('Rendering cart...', window.cart.items);

        root.innerHTML = '';
        if (!window.cart.items.length) {
            const p = document.createElement('p');
            p.style.margin = '10px 6px';
            p.textContent = 'Kurven er tom.';
            root.appendChild(p);
        } else {
            const frag = document.createDocumentFragment();
            window.cart.items.forEach(item => {
                console.log('Rendering item:', item);
                frag.appendChild(rowTemplate(item));
            });
            root.appendChild(frag);
        }

        // Brug window.cart.total() i stedet for window.cartAPI.total.value
        const totalValue = window.cart.total();
        console.log('Total:', totalValue);
        totalEl.textContent = `${totalValue},-`;
    }

    // Første render
    render();

    // Gem/hent noter fra localStorage
    if (notesEl) {
        try { notesEl.value = localStorage.getItem(NOTES_KEY) || ''; } catch {}
        notesEl.addEventListener('input', () => {
            try { localStorage.setItem(NOTES_KEY, notesEl.value); } catch {}
        });
    }

    // Modal logik
    function openModal(text) {
        if (!modal) { alert(text); return; }
        lastFocused = document.activeElement;
        if (summaryEl) summaryEl.textContent = text;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        modalOk?.focus();
        document.addEventListener('keydown', onEscClose);
        modal.addEventListener('click', onBackdropClose);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        modalOk?.blur();
        document.removeEventListener('keydown', onEscClose);
        modal.removeEventListener('click', onBackdropClose);
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function onEscClose(e) {
        if (e.key === 'Escape') closeModal();
    }
    function onBackdropClose(e) {
        if (e.target.classList.contains('modal-backdrop')) closeModal();
    }
    modalOk?.addEventListener('click', closeModal);

    // Gem ordrer i localStorage
    function saveOrder(order) {
        const KEY = 'orders';
        const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
        stored.push(order);
        localStorage.setItem(KEY, JSON.stringify(stored));
    }

    // Klik på "bestil"
    btnOrder.addEventListener('click', () => {
        if (!window.cart.items.length) {
            openModal('Kurven er tom.');
            return;
            // Lyt på cart events
            document.addEventListener('cart:update', render);
            document.addEventListener('cart:add', render);
            document.addEventListener('cart:remove', render);
            document.addEventListener('cart:inc', render);
            document.addEventListener('cart:dec', render);
            document.addEventListener('cart:clear', render);
        }

        const orderId = Math.floor(Math.random() * 900000 + 100000);
        const count = window.cart.items.reduce((sum, i) => sum + i.qty, 0);
        const total = window.cartAPI.total.value;
        const eta = 25;
        const notes = notesEl?.value || '';

        const order = {
            id: orderId,
            items: window.cart.items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
            total,
            notes,
            createdAt: new Date().toISOString()
        };

        saveOrder(order);

        const msg = [
            `Tak for din bestilling!`,
            `Ordrenr.: #${orderId}`,
            `Antal varer: ${count}`,
            `Samlet pris: ${total},-`,
            `Levering: ca. ${eta} min`,
            notes ? `Noter: ${notes}` : ''
        ].filter(Boolean).join('\n');

        openModal(msg);

        window.cartAPI.clear();
        render();
        if (notesEl) {
            notesEl.value = '';
            try { localStorage.removeItem(NOTES_KEY); } catch {}
        }
    });

    // Lyt på custom events fra cartAPI
    if (window.cartAPI) {
        ['add', 'remove', 'inc', 'dec', 'clear', 'updateTotal'].forEach(event => {
            document.addEventListener(`cart:${event}`, render);
        });
    }
})();
