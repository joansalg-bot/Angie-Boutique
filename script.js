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
       PEDIDO
       ========================================================= */

    if (checkout) {

        checkout.addEventListener(
            "click",
            () => {

                if (
                    cartProducts.length ===
                    0
                ) {

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

                                `${product.name} ` +

                                `(${product.color}, ` +

                                `Talla ${product.size}) - ` +

                                `${formatPrice(
                                    subtotal
                                )}`

                            );

                        }
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


                const message =

                    "Resumen del pedido:\n\n" +

                    orderLines.join(
                        "\n"
                    ) +

                    "\n\nTotal: " +

                    formatPrice(
                        totalPrice
                    );


                alert(message);

            }
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
