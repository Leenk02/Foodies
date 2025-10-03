(function(){
    console.log('Loading cart system...');

    // Simple cart implementation
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');

    window.cart = {
        items: cartData,

        save() {
            localStorage.setItem('cart', JSON.stringify(this.items));
            this.updateCount();
        },

        add(dish) {
            const existing = this.items.find(item => item.id === dish.id);
            if (existing) {
                existing.qty += 1;
            } else {
                this.items.push({
                    id: dish.id,
                    name: dish.name,
                    price: dish.price,
                    qty: 1
                });
            }
            this.save();
        },

        inc(id) {
            const item = this.items.find(item => item.id === id);
            if (item) {
                item.qty += 1;
                this.save();
            }
        },

        dec(id) {
            const item = this.items.find(item => item.id === id);
            if (item && item.qty > 1) {
                item.qty -= 1;
                this.save();
            } else {
                this.remove(id);
            }
        },

        remove(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.save();
        },

        clear() {
            this.items = [];
            this.save();
        },

        total() {
            return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        },

        count() {
            return this.items.reduce((sum, item) => sum + item.qty, 0);
        },

        updateCount() {
            const countEl = document.getElementById('cart-count');
            if (countEl) {
                const count = this.count();
                countEl.textContent = count > 0 ? `(${count})` : '';
            }
        }
    };

    // Create cartAPI interface
    window.cartAPI = {
        get items() {
            return window.cart.items;
        },

        get total() {
            return { value: window.cart.total() };
        },

        inc(id) {
            window.cart.inc(id);
        },

        dec(id) {
            window.cart.dec(id);
        },

        remove(id) {
            window.cart.remove(id);
        },

        clear() {
            window.cart.clear();
        }
    };
    // Test data - tilføj nogle produkter til kurven for testing
    console.log('Adding test products to cart...');

    // Test produkter
    const testProducts = [
        { id: 1, name: 'Test Pizza', price: 85, image: '' },
        { id: 2, name: 'Test Burger', price: 65, image: '' }
    ];

    // Tilføj til kurv hvis den er tom
    if (window.cart.items.length === 0) {
        testProducts.forEach(product => {
            window.cart.add(product);
        });
        console.log('Test products added to cart:', window.cart.items);
    }

    console.log('Cart system loaded. Items:', window.cart.items);

    // Initialize
    window.cart.updateCount();
    console.log('Cart system loaded. Items:', window.cart.items);
})();
