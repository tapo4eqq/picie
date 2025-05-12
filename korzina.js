document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.product-card button');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    let cart = [];

    // Функция для обновления отображения корзины
    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; // Очищаем список
        let total = 0;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            listItem.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <div class="cart-item-quantity">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
                <span>${item.price * item.quantity} руб.</span>
            `;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `Итого: ${total} руб.`;

        // Обновляем localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Функция для добавления товара в корзину
    function addItemToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCartDisplay();
    }

    // Функция для изменения количества товара
    function changeQuantity(id, amount) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        item.quantity += amount;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id); // Удаляем из корзины
        }

        updateCartDisplay();
    }

    // Обработчики событий для кнопок "В корзину"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addItemToCart(id, name, price);
        });
    });

    // Обработчики событий для кнопок увеличения/уменьшения количества
    cartItemsList.addEventListener('click', function(event) {
        if (event.target.classList.contains('decrease')) {
            const id = event.target.dataset.id;
            changeQuantity(id, -1);
        } else if (event.target.classList.contains('increase')) {
            const id = event.target.dataset.id;
            changeQuantity(id, 1);
        }
    });

    // Загрузка корзины из localStorage при загрузке страницы
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartDisplay();
    }
});