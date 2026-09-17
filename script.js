/* =========================================================
   ANGIE BOUTIQUE
   FILTROS, BÚSQUEDA Y CARRITO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTOS DEL HTML
       ========================================================= */

    const mainCategories =
        document.querySelectorAll(".main-category");

    const subcategoriesGroups =
        document.querySelectorAll(".subcategories");

    const subcategories =
        document.querySelectorAll(".subcategory");

    const products =
        document.querySelectorAll(".product-card");

    const searchInput =
        document.getElementById("searchInput");

    const clearSearch =
        document.getElementById("clearSearch");

    const noResults =
        document.getElementById("noResults");

    const productsGrid =
        document.getElementById("productsGrid");

    const openCart =
        document.getElementById("openCart");

    const closeCart =
        document.getElementById("closeCart");

    const cart =
        document.getElementById("cart");

    const cartOverlay =
        document.getElementById("cartOverlay");

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    const checkout =
        document.getElementById("checkout");


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
       COLORES Y TALLAS DISPONIBLES
       ========================================================= */

    const variantOptions = {

        mujer: {

            sizes: [
                "XS",
                "S",
                "M",
                "L",
                "XL"
            ],

            colors: [

                {
                    name: "Negro",
                    hex: "#1f1f1f"
                },

                {
                    name: "Blanco",
                    hex: "#ffffff"
                },

                {
                    name: "Rosa",
                    hex: "#e6b7bd"
                },

                {
                    name: "Beige",
                    hex: "#d8c2a7"
                },

                {
                    name: "Azul",
                    hex: "#6f91b8"
                }

            ]

        },


        hombre: {

            sizes: [
                "S",
                "M",
                "L",
                "XL",
                "XXL"
            ],

            colors: [

                {
                    name: "Negro",
                    hex: "#1f1f1f"
                },

                {
                    name: "Blanco",
                    hex: "#ffffff"
                },

                {
                    name: "Azul",
                    hex: "#587ca5"
                },

                {
                    name: "Beige",
                    hex: "#d8c2a7"
                },

                {
                    name: "Gris",
                    hex: "#929292"
                }

            ]

        },


        nina: {

            sizes: [
                "4",
                "6",
                "8",
                "10",
                "12"
            ],

            colors: [

                {
                    name: "Rosa",
                    hex: "#e6b7bd"
                },

                {
                    name: "Blanco",
                    hex: "#ffffff"
                },

                {
                    name: "Lila",
                    hex: "#b8a5d1"
                },

                {
                    name: "Azul",
                    hex: "#79a5c9"
                },

                {
                    name: "Beige",
                    hex: "#d8c2a7"
                }

            ]

        },


        nino: {

            sizes: [
                "4",
                "6",
                "8",
                "10",
                "12"
            ],

            colors: [

                {
                    name: "Azul",
                    hex: "#587ca5"
                },

                {
                    name: "Negro",
                    hex: "#1f1f1f"
                },

                {
                    name: "Blanco",
                    hex: "#ffffff"
                },

                {
                    name: "Gris",
                    hex: "#929292"
                },

                {
                    name: "Verde",
                    hex: "#7c9a7c"
                }

            ]

        }

    };


    /* =========================================================
       NORMALIZAR TEXTO
       ========================================================= */

    function normalizeText(text) {

        return String(text || "")

            .toLowerCase()

            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .trim();

    }


    /* =========================================================
       FORMATEAR PRECIOS
       ========================================================= */

    function formatPrice(price) {

        return "$" +
            Number(price || 0)
                .toLocaleString("es-CO");

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
       MANTENER LOS PRODUCTOS DENTRO DEL GRID
       ========================================================= */

    if (productsGrid) {

        products.forEach(product => {

            productsGrid.appendChild(
                product
            );

        });

    }


    /* =========================================================
       ESTILOS DE COLORES Y TALLAS
       ========================================================= */

    function injectVariantStyles() {

        if (
            document.getElementById(
                "angie-variant-styles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "angie-variant-styles";


        style.textContent = `

            .product-variants {

                margin: 6px 0 8px;

                padding-top: 7px;

                border-top:
                    1px solid #eee5e1;

            }


            .variant-group {

                margin-bottom: 7px;

            }


            .variant-group:last-child {

                margin-bottom: 0;

            }


            .variant-heading {

                display: flex;

                align-items: center;

                justify-content:
                    space-between;

                gap: 8px;

                margin-bottom: 4px;

                color: #5f5551;

                font-size: 10px;

                letter-spacing: .02em;

            }


            .variant-heading strong {

                color: #9a7770;

                font-size: 9px;

                font-weight: 500;

            }


            .color-options,
            .size-options {

                display: flex;

                align-items: center;

                flex-wrap: wrap;

                gap: 5px;

            }


            .color-swatch {

                width: 20px;

                height: 20px;

                padding: 0;

                border:
                    1px solid #d6ceca;

                border-radius: 50%;

                background:
                    var(--swatch-color);

                cursor: pointer;

                position: relative;

                box-shadow:
                    0 0 0 1px
                    rgba(255,255,255,.7)
                    inset;

                transition:
                    transform .2s ease,
                    box-shadow .2s ease;

            }


            .color-swatch:hover {

                transform:
                    translateY(-1px);

            }


            .color-swatch.selected {

                box-shadow:
                    0 0 0 2px
                    #a77973,
                    0 0 0 3px
                    #fff;

            }


            .size-option {

                min-width: 27px;

                height: 25px;

                padding: 0 6px;

                border:
                    1px solid #d8ceca;

                border-radius: 4px;

                background: #fff;

                color: #514946;

                cursor: pointer;

                font-family: inherit;

                font-size: 10px;

                transition:
                    all .2s ease;

            }


            .size-option:hover,
            .size-option.selected {

                border-color:
                    #a77973;

                background:
                    #a77973;

                color: #fff;

            }


            .cart-item-variant {

                display: block;

                margin-top: 3px;

                color: #8b7d78;

                font-size: 11px;

            }


            @media (max-width: 650px) {

                .product-variants {

                    margin-top: 5px;

                    margin-bottom: 7px;

                    padding-top: 6px;

                }


                .variant-heading {

                    font-size: 10px;

                }


                .color-swatch {

                    width: 21px;

                    height: 21px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =========================================================
       OBTENER OPCIONES SEGÚN EL PRODUCTO
       ========================================================= */

    function getVariantOptions(gender) {

        return (
            variantOptions[gender] ||
            variantOptions.mujer
        );

    }


    /* =========================================================
       CREAR SELECTORES EN CADA PRODUCTO
       ========================================================= */

    function addVariantSelectors() {

        products.forEach(product => {

            const productInfo =
                product.querySelector(
                    ".product-info"
                );


            const addButton =
                product.querySelector(
                    ".add-cart"
                );


            if (
                !productInfo ||
                !addButton
            ) {

                return;

            }


            if (
                productInfo.querySelector(
                    ".product-variants"
                )
            ) {

                return;

            }


            const gender =
                normalizeText(
                    product.dataset.gender
                );


            const options =
                getVariantOptions(
                    gender
                );


            const variants =
                document.createElement(
                    "div"
                );


            variants.className =
                "product-variants";


            variants.innerHTML = `

                <div class="variant-group">

                    <div class="variant-heading">

                        <span>
                            Color disponible
                        </span>

                        <strong
                            class="selected-color-label"
                        >
                            Selecciona un color
                        </strong>

                    </div>


                    <div
                        class="color-options"
                    >

                        ${
                            options.colors
                                .map(
                                    color => `

                                        <button
                                            type="button"

                                            class="color-swatch"

                                            data-color="${escapeHTML(
                                                color.name
                                            )}"

                                            title="${escapeHTML(
                                                color.name
                                            )}"

                                            aria-label="Color ${escapeHTML(
                                                color.name
                                            )}"

                                            style="
                                                --swatch-color:
                                                ${color.hex};
                                            "
                                        ></button>

                                    `
                                )
                                .join("")
                        }

                    </div>

                </div>


                <div class="variant-group">

                    <div class="variant-heading">

                        <span>
                            Talla disponible
                        </span>

                        <strong
                            class="selected-size-label"
                        >
                            Selecciona una talla
                        </strong>

                    </div>


                    <div
                        class="size-options"
                    >

                        ${
                            options.sizes
                                .map(
                                    size => `

                                        <button
                                            type="button"

                                            class="size-option"

                                            data-size="${escapeHTML(
                                                size
                                            )}"
                                        >
                                            ${escapeHTML(
                                                size
                                            )}
                                        </button>

                                    `
                                )
                                .join("")
                        }

                    </div>

                </div>

            `;


            productInfo.insertBefore(
                variants,
                addButton
            );


            const colorButtons =
                variants.querySelectorAll(
                    ".color-swatch"
                );


            const sizeButtons =
                variants.querySelectorAll(
                    ".size-option"
                );


            const colorLabel =
                variants.querySelector(
                    ".selected-color-label"
                );


            const sizeLabel =
                variants.querySelector(
                    ".selected-size-label"
                );


            colorButtons.forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            colorButtons
                                .forEach(
                                    item => {

                                        item.classList
                                            .remove(
                                                "selected"
                                            );

                                    }
                                );


                            button.classList.add(
                                "selected"
                            );


                            colorLabel.textContent =
                                button.dataset.color;

                        }
                    );

                }
            );


            sizeButtons.forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            sizeButtons
                                .forEach(
                                    item => {

                                        item.classList
                                            .remove(
                                                "selected"
                                            );

                                    }
                                );


                            button.classList.add(
                                "selected"
                            );


                            sizeLabel.textContent =
                                button.dataset.size;

                        }
                    );

                }
            );

        });

    }


    /* =========================================================
       OBTENER COLOR Y TALLA SELECCIONADOS
       ========================================================= */

    function getSelectedVariant(
        product
    ) {

        const colorButton =
            product.querySelector(
                ".color-swatch.selected"
            );


        const sizeButton =
            product.querySelector(
                ".size-option.selected"
            );


        return {

            color:
                colorButton
                    ? colorButton.dataset.color
                    : "",

            size:
                sizeButton
                    ? sizeButton.dataset.size
                    : ""

        };

    }


    /* =========================================================
       CATEGORÍA PRINCIPAL
       ========================================================= */

    mainCategories.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectedGender =
                        normalizeText(
                            button.dataset.gender
                        );


                    selectedCategory =
                        "todos";


                    mainCategories.forEach(
                        item => {

                            item.classList
                                .remove(
                                    "active"
                                );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    subcategoriesGroups
                        .forEach(
                            group => {

                                group.classList
                                    .remove(
                                        "active"
                                    );

                            }
                        );


                    if (
                        selectedGender !==
                        "todos"
                    ) {

                        const selectedGroup =
                            document.querySelector(
                                `.subcategories[data-subcategory-group="${selectedGender}"]`
                            );


                        if (
                            selectedGroup
                        ) {

                            selectedGroup.classList
                                .add(
                                    "active"
                                );


                            selectedGroup
                                .querySelectorAll(
                                    ".subcategory"
                                )
                                .forEach(
                                    item => {

                                        item.classList
                                            .remove(
                                                "active"
                                            );

                                    }
                                );


                            const allButton =
                                selectedGroup
                                    .querySelector(
                                        '.subcategory[data-category="todos"]'
                                    );


                            if (
                                allButton
                            ) {

                                allButton.classList
                                    .add(
                                        "active"
                                    );

                            }

                        }

                    }


                    filterProducts();

                }
            );

        }
    );


    /* =========================================================
       SUBCATEGORÍAS
       ========================================================= */

    subcategories.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const buttonGender =
                        normalizeText(
                            button.dataset.gender
                        );


                    selectedCategory =
                        normalizeText(
                            button.dataset.category
                        );


                    if (buttonGender) {

                        selectedGender =
                            buttonGender;

                    }


                    const currentGroup =
                        button.closest(
                            ".subcategories"
                        );


                    if (currentGroup) {

                        currentGroup
                            .querySelectorAll(
                                ".subcategory"
                            )
                            .forEach(
                                item => {

                                    item.classList
                                        .remove(
                                            "active"
                                        );

                                }
                            );


                        button.classList.add(
                            "active"
                        );

                    }


                    mainCategories.forEach(
                        categoryButton => {

                            const categoryGender =
                                normalizeText(
                                    categoryButton
                                        .dataset
                                        .gender
                                );


                            categoryButton.classList
                                .remove(
                                    "active"
                                );


                            if (
                                categoryGender ===
                                selectedGender
                            ) {

                                categoryButton.classList
                                    .add(
                                        "active"
                                    );

                            }

                        }
                    );


                    filterProducts();

                }
            );

        }
    );


    /* =========================================================
       BUSCADOR
       ========================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                searchText =
                    normalizeText(
                        searchInput.value
                    );


                filterProducts();

            }
        );

    }


    /* =========================================================
       LIMPIAR BÚSQUEDA
       ========================================================= */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";

                    searchInput.focus();

                }


                searchText = "";


                filterProducts();

            }
        );

    }


    /* =========================================================
       FILTRAR PRODUCTOS
       ========================================================= */

    function filterProducts() {

        let visibleProducts = 0;


        products.forEach(
            product => {

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
                    selectedGender ===
                        "todos" ||

                    productGender ===
                        selectedGender;


                const categoryMatches =
                    selectedCategory ===
                        "todos" ||

                    productCategory ===
                        selectedCategory;


                const searchMatches =
                    searchText === "" ||

                    productName.includes(
                        searchText
                    ) ||

                    productCategory.includes(
                        searchText
                    ) ||

                    productText.includes(
                        searchText
                    );


                const shouldShow =
                    genderMatches &&
                    categoryMatches &&
                    searchMatches;


                if (
                    shouldShow
                ) {

                    product.style.display =
                        "";

                    visibleProducts++;

                } else {

                    product.style.display =
                        "none";

                }

            }
        );


        if (noResults) {

            noResults.style.display =
                visibleProducts === 0
                    ? "block"
                    : "none";

        }

    }


    /* =========================================================
       ABRIR CARRITO
       ========================================================= */

    function showCart() {

        if (cart) {

            cart.classList.add(
                "active"
            );

        }


        if (cartOverlay) {

            cartOverlay.classList.add(
                "active"
            );

        }


        document.body.classList.add(
            "cart-open"
        );

    }


    /* =========================================================
       CERRAR CARRITO
       ========================================================= */

    function hideCart() {

        if (cart) {

            cart.classList.remove(
                "active"
            );

        }


        if (cartOverlay) {

            cartOverlay.classList.remove(
                "active"
            );

        }


        document.body.classList.remove(
            "cart-open"
        );

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
       PREPARAR COLORES Y TALLAS
       ========================================================= */

    injectVariantStyles();

    addVariantSelectors();


    /* =========================================================
       AGREGAR PRODUCTO AL CARRITO
       ========================================================= */

    document
        .querySelectorAll(".add-cart")
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const name =
                            button.dataset.name ||
                            "Producto";


                        const price =
                            Number(
                                button.dataset.price ||
                                0
                            );


                        const productCard =
                            button.closest(
                                ".product-card"
                            );


                        const variant =
                            productCard
                                ? getSelectedVariant(
                                    productCard
                                )
                                : {
                                    color: "",
                                    size: ""
                                };


                        if (
                            !variant.color ||
                            !variant.size
                        ) {

                            alert(
                                "Selecciona un color y una talla antes de agregar el producto al carrito."
                            );


                            return;

                        }


                        const existingProduct =
                            cartProducts.find(
                                product =>

                                    product.name ===
                                        name &&

                                    product.color ===
                                        variant.color &&

                                    product.size ===
                                        variant.size
                            );


                        if (
                            existingProduct
                        ) {

                            existingProduct.quantity +=
                                1;

                        } else {

                            cartProducts.push({

                                name:
                                    name,

                                price:
                                    price,

                                color:
                                    variant.color,

                                size:
                                    variant.size,

                                quantity:
                                    1

                            });

                        }


                        renderCart();

                        showCart();

                    }
                );

            }
        );


    /* =========================================================
       RENDERIZAR CARRITO
       ========================================================= */

    function renderCart() {

        if (!cartItems) {

            return;

        }


        if (
            cartProducts.length ===
            0
        ) {

            cartItems.innerHTML = `

                <p class="empty-cart">
                    Tu carrito está vacío.
                </p>

            `;

        } else {

            cartItems.innerHTML =

                cartProducts
                    .map(
                        (
                            product,
                            index
                        ) => {

                            const subtotal =
                                product.price *
                                product.quantity;


                            return `

                                <div
                                    class="cart-item"
                                >

                                    <div
                                        class="cart-item-info"
                                    >

                                        <strong>
                                            ${escapeHTML(
                                                product.name
                                            )}
                                        </strong>


                                        <span>
                                            ${formatPrice(
                                                product.price
                                            )}
                                        </span>


                                        <small
                                            class="cart-item-variant"
                                        >
                                            ${escapeHTML(
                                                product.color ||
                                                "Color no indicado"
                                            )}
                                            · Talla
                                            ${escapeHTML(
                                                product.size ||
                                                "No indicada"
                                            )}
                                        </small>

                                    </div>


                                    <div
                                        class="cart-item-controls"
                                    >

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


                                    <strong
                                        class="cart-item-subtotal"
                                    >
                                        ${formatPrice(
                                            subtotal
                                        )}
                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("");

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
                    Number(
                        button.dataset.index
                    );


                const action =
                    button.dataset.cartAction;


                if (
                    !cartProducts[index]
                ) {

                    return;

                }


                if (
                    action ===
                    "increase"
                ) {

                    cartProducts[
                        index
                    ].quantity +=
                        1;

                }


                else if (
                    action ===
                    "decrease"
                ) {

                    cartProducts[
                        index
                    ].quantity -=
                        1;


                    if (
                        cartProducts[
                            index
                        ].quantity <=
                        0
                    ) {

                        cartProducts.splice(
                            index,
                            1
                        );

                    }

                }


                else if (
                    action ===
                    "remove"
                ) {

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
                (
                    total,
                    product
                ) =>
                    total +
                    product.quantity,
                0
            );


        const totalPrice =
            cartProducts.reduce(
                (
                    total,
                    product
                ) =>
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
                formatPrice(
                    totalPrice
                );

        }

    }


    /* =========================================================
       PAGO / FINALIZAR PEDIDO
       ========================================================= */

    function injectPaymentStyles() {

        if (document.getElementById("angie-payment-styles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "angie-payment-styles";

        style.textContent = `
            .payment-modal-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 18px;
                background: rgba(32, 25, 23, .58);
                backdrop-filter: blur(4px);
            }

            .payment-modal-overlay.active {
                display: flex;
            }

            .payment-modal {
                width: min(500px, calc(100vw - 28px));
                max-width: 500px;
                max-height: min(90vh, 760px);
                overflow-x: hidden;
                overflow-y: auto;
                box-sizing: border-box;
                background: #fff;
                border-radius: 18px;
                box-shadow: 0 20px 60px rgba(45, 31, 27, .25);
                padding: 24px;
                position: relative;
                color: #4f4541;
            }

            .payment-modal,
            .payment-modal * {
                box-sizing: border-box;
            }

            .payment-close {
                position: absolute;
                top: 12px;
                right: 14px;
                width: 34px;
                height: 34px;
                border: 0;
                border-radius: 50%;
                background: #f5efec;
                color: #665955;
                font-size: 18px;
                cursor: pointer;
            }

            .payment-header {
                text-align: center;
                padding: 4px 34px 18px;
            }

            .payment-label {
                display: inline-block;
                margin-bottom: 7px;
                color: #a77973;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: .12em;
            }

            .payment-header h2 {
                margin: 0 0 7px;
                font-size: 24px;
                color: #4a403c;
            }

            .payment-header p {
                margin: 0;
                font-size: 13px;
                line-height: 1.5;
                color: #857772;
            }

            .payment-total {
                margin: 0 0 16px;
                padding: 14px 16px;
                border: 1px solid #eee3df;
                border-radius: 12px;
                background: #fcf9f7;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .payment-total span {
                font-size: 13px;
                color: #766a65;
            }

            .payment-total strong {
                color: #9a7770;
                font-size: 20px;
            }

            .payment-methods-title {
                margin: 0 0 9px;
                font-size: 13px;
                font-weight: 700;
                color: #514844;
            }

            .payment-method {
                display: block;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
                border: 1px solid #e5dad6;
                border-radius: 13px;
                background: #fff;
                padding: 14px;
                margin-bottom: 10px;
                text-align: left;
                font-family: inherit;
                font-size: inherit;
                cursor: pointer;
                transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
            }

            .payment-method:hover,
            .payment-method.active {
                border-color: #b58b83;
                box-shadow: 0 6px 18px rgba(100, 70, 62, .08);
            }

            .payment-method:active {
                transform: translateY(1px);
            }

            .payment-method-top {
                display: flex;
                width: 100%;
                min-width: 0;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }

            .payment-method-name {
                display: flex;
                min-width: 0;
                align-items: center;
                gap: 9px;
                font-weight: 700;
                font-size: 14px;
                color: #4e4541;
            }

            .payment-method-icon {
                width: 31px;
                height: 31px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 9px;
                background: #f4ebe8;
                font-size: 16px;
            }

            .payment-method-arrow {
                color: #a77973;
                font-size: 18px;
                transition: transform .2s ease;
            }

            .payment-method.active .payment-method-arrow {
                transform: rotate(180deg);
            }

            .payment-details {
                display: none;
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #eee6e2;
            }

            .payment-method.active .payment-details {
                display: block;
            }

            .payment-detail-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin: 7px 0;
                font-size: 12px;
            }

            .payment-detail-row span:first-child {
                color: #8b7e79;
            }

            .payment-detail-value {
                display: flex;
                align-items: center;
                min-width: 0;
                flex-wrap: wrap;
                gap: 7px;
                text-align: right;
                font-weight: 700;
                color: #504642;
            }

            .copy-payment {
                border: 1px solid #dfd3cf;
                border-radius: 7px;
                padding: 5px 8px;
                background: #fff;
                color: #8f6e68;
                font-size: 10px;
                cursor: pointer;
            }

            .demo-payment-note {
                margin-top: 13px;
                padding: 11px 12px;
                border-radius: 10px;
                background: #fff8e8;
                border: 1px solid #f0dfb7;
                color: #806b43;
                font-size: 11px;
                line-height: 1.5;
            }

            .payment-confirm {
                width: 100%;
                margin-top: 14px;
                border: 0;
                border-radius: 10px;
                padding: 13px 16px;
                background: #a77973;
                color: #fff;
                font-weight: 700;
                font-size: 13px;
                cursor: pointer;
            }

            .payment-confirm:hover {
                filter: brightness(.96);
            }

            .payment-confirmation {
                display: none;
                text-align: center;
                padding: 10px 4px 4px;
            }

            .payment-confirmation.active {
                display: block;
            }

            .payment-success-icon {
                width: 56px;
                height: 56px;
                margin: 0 auto 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: #f0e7e4;
                font-size: 26px;
            }

            .payment-confirmation h3 {
                margin: 0 0 8px;
                font-size: 21px;
                color: #4d433f;
            }

            .payment-confirmation p {
                margin: 0 auto 14px;
                max-width: 390px;
                font-size: 13px;
                line-height: 1.55;
                color: #7c706b;
            }

            .payment-order-summary {
                text-align: left;
                max-height: 180px;
                overflow-y: auto;
                padding: 12px;
                border-radius: 10px;
                background: #faf7f5;
                border: 1px solid #eee4e0;
                font-size: 11px;
                line-height: 1.6;
                white-space: pre-line;
            }

            .payment-close-final {
                width: 100%;
                margin-top: 12px;
                border: 1px solid #d9cbc7;
                border-radius: 10px;
                padding: 11px 16px;
                background: #fff;
                color: #685b56;
                font-weight: 600;
                cursor: pointer;
            }

            @media (max-width: 650px) {
                .payment-modal-overlay {
                    padding: 10px;
                    align-items: center;
                }

                .payment-modal {
                    width: min(100%, 500px);
                    max-width: 100%;
                    max-height: 92vh;
                    border-radius: 18px;
                    padding: 20px 16px 16px;
                }

                .payment-detail-row {
                    flex-wrap: wrap;
                }

                .payment-detail-value {
                    width: 100%;
                    justify-content: flex-end;
                }

                .payment-header h2 {
                    font-size: 21px;
                }

                .payment-detail-row {
                    align-items: flex-start;
                }
            }
        `;

        document.head.appendChild(style);
    }


    function createPaymentModal() {

        if (document.getElementById("paymentModalOverlay")) {
            return document.getElementById("paymentModalOverlay");
        }

        const overlay = document.createElement("div");
        overlay.className = "payment-modal-overlay";
        overlay.id = "paymentModalOverlay";

        overlay.innerHTML = `
            <div class="payment-modal" role="dialog" aria-modal="true" aria-labelledby="paymentModalTitle">

                <button
                    type="button"
                    class="payment-close"
                    id="closePaymentModal"
                    aria-label="Cerrar pago"
                >
                    ✕
                </button>

                <div id="paymentStep">
                    <div class="payment-header">
                        <span class="payment-label">ANGIE BOUTIQUE</span>
                        <h2 id="paymentModalTitle">Finaliza tu pedido</h2>
                        <p>Selecciona el medio de pago que prefieras para completar tu compra.</p>
                    </div>

                    <div class="payment-total">
                        <span>Total a pagar</span>
                        <strong id="paymentTotal">$0</strong>
                    </div>

                    <p class="payment-methods-title">Selecciona un método de pago</p>

                    <div class="payment-method" data-payment-method="nequi" role="button" tabindex="0">
                        <div class="payment-method-top">
                            <span class="payment-method-name">
                                <span class="payment-method-icon">💜</span>
                                Nequi
                            </span>
                            <span class="payment-method-arrow">⌄</span>
                        </div>
                        <div class="payment-details">
                            <div class="payment-detail-row">
                                <span>Número</span>
                                <span class="payment-detail-value">
                                    <span>300 000 0000</span>
                                    <button type="button" class="copy-payment" data-copy="3000000000">Copiar</button>
                                </span>
                            </div>
                            <div class="payment-detail-row">
                                <span>Titular</span>
                                <span class="payment-detail-value">Angie Boutique</span>
                            </div>
                        </div>
                    </div>

                    <div class="payment-method" data-payment-method="bancolombia" role="button" tabindex="0">
                        <div class="payment-method-top">
                            <span class="payment-method-name">
                                <span class="payment-method-icon">🏦</span>
                                Bancolombia
                            </span>
                            <span class="payment-method-arrow">⌄</span>
                        </div>
                        <div class="payment-details">
                            <div class="payment-detail-row">
                                <span>Cuenta</span>
                                <span class="payment-detail-value">
                                    <span>000-000000-00</span>
                                    <button type="button" class="copy-payment" data-copy="0000000000">Copiar</button>
                                </span>
                            </div>
                            <div class="payment-detail-row">
                                <span>Titular</span>
                                <span class="payment-detail-value">Angie Boutique</span>
                            </div>
                        </div>
                    </div>

                    <div class="demo-payment-note">
                        <strong>DEMO:</strong> los datos de pago mostrados son ficticios y no corresponden a una cuenta real. En un negocio real se reemplazan por los datos bancarios del cliente.
                    </div>

                    <button type="button" class="payment-confirm" id="paymentConfirm">
                        Ya realicé el pago
                    </button>
                </div>

                <div class="payment-confirmation" id="paymentConfirmation">
                    <div class="payment-success-icon">✓</div>
                    <h3>Pedido registrado</h3>
                    <p>
                        Tu pedido quedó preparado correctamente. Recuerda que esta es una demostración y el pago no se realiza realmente.
                    </p>
                    <div class="payment-order-summary" id="paymentOrderSummary"></div>
                    <button type="button" class="payment-close-final" id="paymentCloseFinal">
                        Volver a la tienda
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(overlay);

        const closeModal = () => {
            overlay.classList.remove("active");
            document.body.classList.remove("payment-open");
        };

        overlay.querySelector("#closePaymentModal")
            .addEventListener("click", closeModal);

        overlay.querySelector("#paymentCloseFinal")
            .addEventListener("click", closeModal);

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                closeModal();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && overlay.classList.contains("active")) {
                closeModal();
            }
        });

        const selectPaymentMethod = method => {
            overlay.querySelectorAll(".payment-method")
                .forEach(item => item.classList.remove("active"));

            method.classList.add("active");
        };

        overlay.querySelectorAll(".payment-method")
            .forEach(method => {
                method.addEventListener("click", event => {

                    if (event.target.closest(".copy-payment")) {
                        return;
                    }

                    selectPaymentMethod(method);
                });

                method.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectPaymentMethod(method);
                    }
                });
            });

        overlay.querySelectorAll(".copy-payment")
            .forEach(button => {
                button.addEventListener("click", async event => {
                    event.stopPropagation();

                    const value = button.dataset.copy || "";

                    try {
                        await navigator.clipboard.writeText(value);
                        const originalText = button.textContent;
                        button.textContent = "Copiado";

                        setTimeout(() => {
                            button.textContent = originalText;
                        }, 1400);
                    } catch (error) {
                        alert("No fue posible copiar el dato automáticamente.");
                    }
                });
            });

        overlay.querySelector("#paymentConfirm")
            .addEventListener("click", () => {

                if (cartProducts.length === 0) {
                    alert("Tu carrito está vacío.");
                    closeModal();
                    return;
                }

                const orderLines = cartProducts.map(product => {
                    const subtotal = product.price * product.quantity;

                    return `${product.quantity} x ${product.name} (${product.color}, Talla ${product.size}) - ${formatPrice(subtotal)}`;
                });

                const totalPrice = cartProducts.reduce(
                    (total, product) =>
                        total + product.price * product.quantity,
                    0
                );

                const summary =
                    orderLines.join("\n") +
                    "\n\nTotal: " +
                    formatPrice(totalPrice);

                overlay.querySelector("#paymentOrderSummary").textContent = summary;
                overlay.querySelector("#paymentStep").style.display = "none";
                overlay.querySelector("#paymentConfirmation").classList.add("active");
            });

        return overlay;
    }


    function openPaymentModal() {

        if (cartProducts.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        hideCart();

        const overlay = createPaymentModal();

        const totalPrice = cartProducts.reduce(
            (total, product) =>
                total + product.price * product.quantity,
            0
        );

        overlay.querySelector("#paymentTotal").textContent =
            formatPrice(totalPrice);

        overlay.querySelector("#paymentStep").style.display = "block";
        overlay.querySelector("#paymentConfirmation").classList.remove("active");
        overlay.querySelectorAll(".payment-method")
            .forEach(item => item.classList.remove("active"));

        overlay.classList.add("active");
        document.body.classList.add("payment-open");
    }


    injectPaymentStyles();


    if (checkout) {

        checkout.addEventListener(
            "click",
            openPaymentModal
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

        mainCategories.forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );


        allMainCategory.classList.add(
            "active"
        );

    }


    subcategoriesGroups.forEach(
        group => {

            group.classList.remove(
                "active"
            );

        }
    );


    /* =========================================================
       INICIAR
       ========================================================= */

    filterProducts();

    renderCart();

});
