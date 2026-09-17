/* =========================================================
   ANGIE BOUTIQUE
   FILTROS, BÚSQUEDA Y CARRITO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTOS DEL HTML
       ========================================================= */

    const mainCategories = document.querySelectorAll(".main-category");
    const subcategoriesGroups = document.querySelectorAll(".subcategories");
    const subcategories = document.querySelectorAll(".subcategory");
    const products = document.querySelectorAll(".product-card");

    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const noResults = document.getElementById("noResults");

    const productsGrid = document.getElementById("productsGrid");

    const openCart = document.getElementById("openCart");
    const closeCart = document.getElementById("closeCart");
    const cart = document.getElementById("cart");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");
    const checkout = document.getElementById("checkout");


    /* =========================================================
       VARIABLES DEL FILTRO
       ========================================================= */

    let selectedGender = "todos";
    let selectedCategory = "todos";
    let searchText = "";


    /* =========================================================
       CARRITO
       ========================================================= */

    let cartProducts = [];


    /* =========================================================
       NORMALIZAR TEXTO
       ========================================================= */

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }


    /* =========================================================
       FORMATEAR PRECIOS
       ========================================================= */

    function formatPrice(price) {

        return "$" + Number(price || 0).toLocaleString("es-CO");

    }


    /* =========================================================
       ORGANIZAR PRODUCTOS
       ========================================================= */

    /*
       El HTML actual tiene productos fuera de #productsGrid.
       Los colocamos todos dentro del mismo contenedor desde
       JavaScript sin modificar el HTML.
    */

    if (productsGrid) {

        products.forEach(product => {

            productsGrid.appendChild(product);

        });

    }


    /* =========================================================
       CATEGORÍA PRINCIPAL
       ========================================================= */

    mainCategories.forEach(button => {

        button.addEventListener("click", () => {

            selectedGender =
                normalizeText(button.dataset.gender);

            selectedCategory = "todos";


            mainCategories.forEach(item => {

                item.classList.remove("active");

            });


            button.classList.add("active");


            subcategoriesGroups.forEach(group => {

                group.classList.remove("active");

            });


            if (selectedGender !== "todos") {

                const selectedGroup =
                    document.querySelector(
                        `.subcategories[data-subcategory-group="${selectedGender}"]`
                    );


                if (selectedGroup) {

                    selectedGroup.classList.add("active");


                    selectedGroup
                        .querySelectorAll(".subcategory")
                        .forEach(item => {

                            item.classList.remove("active");

                        });


                    const allButton =
                        selectedGroup.querySelector(
                            '.subcategory[data-category="todos"]'
                        );


                    if (allButton) {

                        allButton.classList.add("active");

                    }

                }

            }


            filterProducts();

        });

    });


    /* =========================================================
       SUBCATEGORÍAS
       ========================================================= */

    subcategories.forEach(button => {

        button.addEventListener("click", () => {

            const buttonGender =
                normalizeText(button.dataset.gender);


            selectedCategory =
                normalizeText(button.dataset.category);


            if (buttonGender) {

                selectedGender = buttonGender;

            }


            const currentGroup =
                button.closest(".subcategories");


            if (currentGroup) {

                currentGroup
                    .querySelectorAll(".subcategory")
                    .forEach(item => {

                        item.classList.remove("active");

                    });


                button.classList.add("active");

            }


            mainCategories.forEach(categoryButton => {

                const categoryGender =
                    normalizeText(
                        categoryButton.dataset.gender
                    );


                categoryButton.classList.remove("active");


                if (categoryGender === selectedGender) {

                    categoryButton.classList.add("active");

                }

            });


            filterProducts();

        });

    });


    /* =========================================================
       BUSCADOR
       ========================================================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            searchText =
                normalizeText(searchInput.value);


            filterProducts();

        });

    }


    /* =========================================================
       LIMPIAR BÚSQUEDA
       ========================================================= */

    if (clearSearch) {

        clearSearch.addEventListener("click", () => {

            if (searchInput) {

                searchInput.value = "";

                searchInput.focus();

            }


            searchText = "";

            filterProducts();

        });

    }


    /* =========================================================
       FILTRAR PRODUCTOS
       ========================================================= */

    function filterProducts() {

        let visibleProducts = 0;


        products.forEach(product => {

            const productGender =
                normalizeText(
                    product.dataset.gender
                );


            const productCategory =
                normalizeText(
                    product.dataset.category
                );


            const productName =
                normalizeText(
                    product.dataset.name
                );


            const productText =
                normalizeText(
                    product.textContent
                );


            const genderMatches =
                selectedGender === "todos" ||
                productGender === selectedGender;


            const categoryMatches =
                selectedCategory === "todos" ||
                productCategory === selectedCategory;


            const searchMatches =
                searchText === "" ||
                productName.includes(searchText) ||
                productCategory.includes(searchText) ||
                productText.includes(searchText);


            const shouldShow =
                genderMatches &&
                categoryMatches &&
                searchMatches;


            if (shouldShow) {

                product.style.display = "";

                visibleProducts++;

            } else {

                product.style.display = "none";

            }

        });


        if (noResults) {

            if (visibleProducts === 0) {

                noResults.style.display = "block";

            } else {

                noResults.style.display = "none";

            }

        }

    }


    /* =========================================================
       ABRIR CARRITO
       ========================================================= */

    function showCart() {

        if (cart) {

            cart.classList.add("active");

        }


        if (cartOverlay) {

            cartOverlay.classList.add("active");

        }


        document.body.classList.add("cart-open");

    }


    /* =========================================================
       CERRAR CARRITO
       ========================================================= */

    function hideCart() {

        if (cart) {

            cart.classList.remove("active");

        }


        if (cartOverlay) {

            cartOverlay.classList.remove("active");

        }


        document.body.classList.remove("cart-open");

    }


    if (openCart) {

        openCart.addEventListener(
            "click",
            showCart
        );

    }


    if (closeCart) {

        closeCart.addEventListener(
            "click",
            hideCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            hideCart
        );

    }


    /* =========================================================
       AGREGAR PRODUCTOS AL CARRITO
       ========================================================= */

    document
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener("click", () => {

                const name =
                    button.dataset.name ||
                    "Producto";


                const price =
                    Number(
                        button.dataset.price || 0
                    );


                const existingProduct =
                    cartProducts.find(
                        product =>
                            product.name === name
                    );


                if (existingProduct) {

                    existingProduct.quantity += 1;

                } else {

                    cartProducts.push({

                        name: name,

                        price: price,

                        quantity: 1

                    });

                }


                renderCart();

                showCart();

            });

        });


    /* =========================================================
       MOSTRAR CARRITO
       ========================================================= */

    function renderCart() {

        if (!cartItems) {

            return;

        }


        if (cartProducts.length === 0) {

            cartItems.innerHTML = `
                <p class="empty-cart">
                    Tu carrito está vacío.
                </p>
            `;

        } else {

            cartItems.innerHTML =
                cartProducts.map(
                    (product, index) => {

                        const subtotal =
                            product.price *
                            product.quantity;


                        return `
                            <div class="cart-item">

                                <div class="cart-item-info">

                                    <strong>
                                        ${escapeHTML(product.name)}
                                    </strong>

                                    <span>
                                        ${formatPrice(product.price)}
                                    </span>

                                </div>


                                <div class="cart-item-controls">

                                    <button
                                        class="quantity-button"
                                        data-cart-action="decrease"
                                        data-index="${index}"
                                        aria-label="Disminuir cantidad"
                                    >
                                        −
                                    </button>


                                    <span>
                                        ${product.quantity}
                                    </span>


                                    <button
                                        class="quantity-button"
                                        data-cart-action="increase"
                                        data-index="${index}"
                                        aria-label="Aumentar cantidad"
                                    >
                                        +
                                    </button>


                                    <button
                                        class="remove-cart"
                                        data-cart-action="remove"
                                        data-index="${index}"
                                        aria-label="Eliminar producto"
                                    >
                                        ✕
                                    </button>

                                </div>


                                <strong class="cart-item-subtotal">

                                    ${formatPrice(subtotal)}

                                </strong>

                            </div>
                        `;

                    }
                ).join("");

        }


        updateCartTotals();

    }


    /* =========================================================
       CONTROLES DEL CARRITO
       ========================================================= */

    if (cartItems) {

        cartItems.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-cart-action]"
                    );


                if (!button) {

                    return;

                }


                const index =
                    Number(button.dataset.index);


                const action =
                    button.dataset.cartAction;


                if (!cartProducts[index]) {

                    return;

                }


                if (action === "increase") {

                    cartProducts[index].quantity += 1;

                }


                else if (action === "decrease") {

                    cartProducts[index].quantity -= 1;


                    if (
                        cartProducts[index].quantity <= 0
                    ) {

                        cartProducts.splice(
                            index,
                            1
                        );

                    }

                }


                else if (action === "remove") {

                    cartProducts.splice(
                        index,
                        1
                    );

                }


                renderCart();

            }
        );

    }


    /* =========================================================
       ACTUALIZAR TOTALES
       ========================================================= */

    function updateCartTotals() {

        const totalQuantity =
            cartProducts.reduce(
                (total, product) =>
                    total + product.quantity,
                0
            );


        const totalPrice =
            cartProducts.reduce(
                (total, product) =>
                    total +
                    product.price *
                    product.quantity,
                0
            );


        if (cartCount) {

            cartCount.textContent =
                totalQuantity;

        }


        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(totalPrice);

        }

    }


    /* =========================================================
       FINALIZAR PEDIDO
       ========================================================= */

    if (checkout) {

        checkout.addEventListener(
            "click",
            () => {

                if (cartProducts.length === 0) {

                    alert(
                        "Tu carrito está vacío."
                    );

                    return;

                }


                const orderLines =
                    cartProducts.map(
                        product => {

                            const subtotal =
                                product.price *
                                product.quantity;


                            return (
                                `${product.quantity} x ` +
                                `${product.name} - ` +
                                `${formatPrice(subtotal)}`
                            );

                        }
                    );


                const totalPrice =
                    cartProducts.reduce(
                        (total, product) =>
                            total +
                            product.price *
                            product.quantity,
                        0
                    );


                const message =
                    "Resumen del pedido:\n\n" +
                    orderLines.join("\n") +
                    "\n\nTotal: " +
                    formatPrice(totalPrice);


                alert(message);

            }
        );

    }


    /* =========================================================
       SEGURIDAD HTML
       ========================================================= */

    function escapeHTML(text) {

        return String(text)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =========================================================
       ESTADO INICIAL
       ========================================================= */

    const allMainCategory =
        document.querySelector(
            '.main-category[data-gender="todos"]'
        );


    if (allMainCategory) {

        mainCategories.forEach(item => {

            item.classList.remove("active");

        });


        allMainCategory.classList.add("active");

    }


    subcategoriesGroups.forEach(group => {

        group.classList.remove("active");

    });


    /* =========================================================
       INICIAR
       ========================================================= */

    filterProducts();

    renderCart();

});
