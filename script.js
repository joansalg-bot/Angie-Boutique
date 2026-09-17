document.addEventListener("DOMContentLoaded", () => {

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
       ESTADO
       ========================================================= */

    let selectedGender = "todos";
    let selectedCategory = "todos";
    let searchText = "";

    let cartProducts = [];


    /* =========================================================
       NOMBRES DE LAS CATEGORÍAS
       ========================================================= */

    const genderLabels = {

        todos: "Toda la colección",

        mujer: "Mujer",

        hombre: "Hombre",

        nina: "Niña",

        nino: "Niño"

    };


    /* =========================================================
       PALABRAS QUE EL BUSCADOR RECONOCE
       ========================================================= */

    const genderAliases = {

        todos: [
            "todos",
            "todo",
            "coleccion",
            "coleccion completa",
            "ropa"
        ],

        mujer: [
            "mujer",
            "mujeres",
            "dama",
            "damas",
            "femenino",
            "femenina"
        ],

        hombre: [
            "hombre",
            "hombres",
            "caballero",
            "caballeros",
            "masculino",
            "masculina"
        ],

        nina: [
            "nina",
            "ninas",
            "niña",
            "niñas"
        ],

        nino: [
            "nino",
            "ninos",
            "niño",
            "niños"
        ]

    };


    const categoryAliases = {

        blusas: [
            "blusa",
            "blusas"
        ],

        vestidos: [
            "vestido",
            "vestidos"
        ],

        pantalones: [
            "pantalon",
            "pantalones"
        ],

        jeans: [
            "jean",
            "jeans",
            "denim"
        ],

        conjuntos: [
            "conjunto",
            "conjuntos"
        ],

        chaquetas: [
            "chaqueta",
            "chaquetas"
        ],

        camisas: [
            "camisa",
            "camisas"
        ],

        camisetas: [
            "camiseta",
            "camisetas",
            "playera",
            "playeras"
        ]

    };


    /* =========================================================
       NORMALIZAR TEXTO
       ========================================================= */

    function normalize(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    }


    /* =========================================================
       FORMATEAR PRECIO
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

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(text) {

        return escapeHTML(text)
            .replace(/`/g, "&#096;");

    }


    /* =========================================================
       MANTENER LOS 32 PRODUCTOS EN EL GRID
       ========================================================= */

    if (productsGrid) {

        products.forEach(product => {

            productsGrid.appendChild(product);

        });

    }


    /* =========================================================
       OBTENER LAS CATEGORÍAS DESDE EL HTML
       ========================================================= */

    const categoriesByGender = {

        todos: []

    };


    subcategories.forEach(button => {

        const gender =
            normalize(button.dataset.gender);

        const category =
            normalize(button.dataset.category);

        const label =
            button.textContent.trim();


        if (!gender || category === "todos") {

            return;

        }


        if (!categoriesByGender[gender]) {

            categoriesByGender[gender] = [];

        }


        if (
            !categoriesByGender[gender]
                .some(item => item.value === category)
        ) {

            categoriesByGender[gender].push({

                value: category,

                label: label

            });

        }


        if (
            !categoriesByGender.todos
                .some(item => item.value === category)
        ) {

            categoriesByGender.todos.push({

                value: category,

                label: label

            });

        }

    });


    /* =========================================================
       DETECTAR GÉNERO
       ========================================================= */

    function findGender(text) {

        const value = normalize(text);


        for (
            const [gender, aliases]
            of Object.entries(genderAliases)
        ) {

            if (
                aliases.some(
                    alias => value === alias
                )
            ) {

                return gender;

            }

        }


        for (
            const [gender, aliases]
            of Object.entries(genderAliases)
        ) {

            if (
                aliases.some(
                    alias => value.includes(alias)
                )
            ) {

                return gender;

            }

        }


        return null;

    }


    /* =========================================================
       DETECTAR CATEGORÍA
       ========================================================= */

    function findCategory(text) {

        const value = normalize(text);


        for (
            const [category, aliases]
            of Object.entries(categoryAliases)
        ) {

            if (
                aliases.some(
                    alias => value === alias
                )
            ) {

                return category;

            }

        }


        for (
            const [category, aliases]
            of Object.entries(categoryAliases)
        ) {

            if (
                aliases.some(
                    alias => value.includes(alias)
                )
            ) {

                return category;

            }

        }


        return null;

    }


    /* =========================================================
       NUEVO BUSCADOR INTERACTIVO
       ========================================================= */

    let smartFilter = null;

    let smartGender = null;

    let smartCategory = null;

    let smartSuggestions = null;

    let smartSummary = null;


    function createSmartFilter() {

        if (!searchInput) {

            return;

        }


        const storeSearch =
            searchInput.closest(".store-search");


        if (!storeSearch) {

            return;

        }


        /*
           Ocultamos los botones antiguos.
           No los borramos del HTML.
        */

        mainCategories.forEach(element => {

            element.style.display = "none";

        });


        subcategoriesGroups.forEach(element => {

            element.style.display = "none";

        });


        const oldContainer =
            document.querySelector(
                ".subcategory-container"
            );


        if (oldContainer) {

            oldContainer.style.display = "none";

        }


        /* =====================================================
           CREAR NUEVO PANEL
           ===================================================== */

        smartFilter =
            document.createElement("div");


        smartFilter.className =
            "smart-filter";


        smartFilter.innerHTML = `

            <div class="smart-filter-top">

                <div class="smart-filter-field">

                    <span class="smart-filter-label">
                        Explora nuestra colección
                    </span>

                    <span class="smart-filter-hint">
                        Escribe qué buscas, por ejemplo:
                        <strong>hombre</strong>,
                        <strong>camisas</strong>
                        o
                        <strong>hombre jeans</strong>.
                    </span>

                </div>

            </div>


            <div class="smart-filter-controls">

                <label class="smart-select-wrap">

                    <span>
                        ¿Para quién?
                    </span>

                    <select id="smartGender">

                        <option value="todos">
                            Toda la colección
                        </option>

                        <option value="mujer">
                            Mujer
                        </option>

                        <option value="hombre">
                            Hombre
                        </option>

                        <option value="nina">
                            Niña
                        </option>

                        <option value="nino">
                            Niño
                        </option>

                    </select>

                </label>


                <label class="smart-select-wrap">

                    <span>
                        Tipo de prenda
                    </span>

                    <select id="smartCategory">

                        <option value="todos">
                            Todas las prendas
                        </option>

                    </select>

                </label>


                <button
                    type="button"
                    class="smart-reset"
                    id="smartReset"
                >
                    Limpiar
                </button>

            </div>


            <div
                class="smart-summary"
                id="smartSummary"
            ></div>


            <div
                class="smart-suggestions"
                id="smartSuggestions"
            ></div>

        `;


        storeSearch.insertAdjacentElement(
            "afterend",
            smartFilter
        );


        smartGender =
            document.getElementById(
                "smartGender"
            );


        smartCategory =
            document.getElementById(
                "smartCategory"
            );


        smartSuggestions =
            document.getElementById(
                "smartSuggestions"
            );


        smartSummary =
            document.getElementById(
                "smartSummary"
            );


        /* =====================================================
           CAMBIAR GÉNERO
           ===================================================== */

        smartGender.addEventListener(
            "change",
            () => {

                selectedGender =
                    smartGender.value;


                selectedCategory =
                    "todos";


                searchText = "";


                updateCategoryOptions();

                updateSmartUI();

                filterProducts();

            }
        );


        /* =====================================================
           CAMBIAR TIPO DE PRENDA
           ===================================================== */

        smartCategory.addEventListener(
            "change",
            () => {

                selectedCategory =
                    smartCategory.value;


                searchText = "";


                updateSmartUI();

                filterProducts();

            }
        );


        /* =====================================================
           LIMPIAR
           ===================================================== */

        document
            .getElementById("smartReset")
            .addEventListener(
                "click",
                resetFilters
            );


        updateCategoryOptions();

        updateSmartUI();

    }


    /* =========================================================
       ACTUALIZAR CATEGORÍAS DISPONIBLES
       ========================================================= */

    function updateCategoryOptions() {

        if (!smartCategory) {

            return;

        }


        const available =
            categoriesByGender[selectedGender] ||
            categoriesByGender.todos;


        smartCategory.innerHTML = `

            <option value="todos">
                Todas las prendas
            </option>

            ${
                available.map(item => `

                    <option
                        value="${escapeAttribute(item.value)}"
                    >
                        ${escapeHTML(item.label)}
                    </option>

                `).join("")
            }

        `;


        smartCategory.value =
            available.some(
                item =>
                    item.value === selectedCategory
            )
                ? selectedCategory
                : "todos";


        selectedCategory =
            smartCategory.value;

    }


    /* =========================================================
       ACTUALIZAR INFORMACIÓN DEL PANEL
       ========================================================= */

    function updateSmartUI() {

        if (!smartGender || !smartCategory) {

            return;

        }


        smartGender.value =
            selectedGender;


        smartCategory.value =
            selectedCategory;


        if (!smartSummary) {

            return;

        }


        const parts = [];


        if (selectedGender !== "todos") {

            parts.push(
                genderLabels[selectedGender]
            );

        }


        if (selectedCategory !== "todos") {

            const available =
                categoriesByGender[selectedGender] ||
                categoriesByGender.todos;


            const item =
                available.find(
                    category =>
                        category.value ===
                        selectedCategory
                );


            parts.push(
                item
                    ? item.label
                    : selectedCategory
            );

        }


        if (searchText) {

            parts.push(
                `"${searchText}"`
            );

        }


        if (parts.length) {

            smartSummary.innerHTML =
                `Mostrando:
                <strong>
                    ${escapeHTML(parts.join(" · "))}
                </strong>`;

        } else {

            smartSummary.innerHTML =
                "Puedes escribir directamente lo que necesitas y la colección se filtrará automáticamente.";

        }

    }


    /* =========================================================
       SUGERENCIAS DEL BUSCADOR
       ========================================================= */

    function updateSuggestions() {

        if (
            !smartSuggestions ||
            !searchInput
        ) {

            return;

        }


        const query =
            normalize(searchInput.value);


        if (!query) {

            smartSuggestions.innerHTML =
                "";


            smartSuggestions.classList.remove(
                "visible"
            );


            return;

        }


        const suggestions = [];


        const gender =
            findGender(query);


        const category =
            findCategory(query);


        if (gender) {

            suggestions.push({

                type: "gender",

                value: gender,

                title:
                    genderLabels[gender],

                text:
                    `Ver toda la colección de
                    ${genderLabels[
                        gender
                    ].toLowerCase()}`

            });

        }


        if (category) {

            suggestions.push({

                type: "category",

                value: category,

                title:
                    category
                        .charAt(0)
                        .toUpperCase() +
                    category.slice(1),

                text:
                    selectedGender === "todos"

                        ? `Buscar ${category}`

                        : `Ver ${category} de
                           ${genderLabels[
                               selectedGender
                           ].toLowerCase()}`

            });

        }


        if (!suggestions.length) {

            smartSuggestions.innerHTML = `

                <div class="smart-suggestion-empty">

                    Sigue escribiendo para buscar
                    por nombre, categoría o público.

                </div>

            `;


            smartSuggestions.classList.add(
                "visible"
            );


            return;

        }


        smartSuggestions.innerHTML =

            suggestions.map(item => `

                <button
                    type="button"
                    class="smart-suggestion"

                    data-suggestion-type="${item.type}"

                    data-suggestion-value="${escapeAttribute(
                        item.value
                    )}"
                >

                    <span
                        class="smart-suggestion-icon"
                    >
                        ${
                            item.type === "gender"
                                ? "◉"
                                : "◇"
                        }
                    </span>


                    <span>

                        <strong>
                            ${escapeHTML(item.title)}
                        </strong>

                        <small>
                            ${escapeHTML(item.text)}
                        </small>

                    </span>

                </button>

            `).join("");


        smartSuggestions.classList.add(
            "visible"
        );


        smartSuggestions
            .querySelectorAll(
                ".smart-suggestion"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const type =
                            button.dataset
                                .suggestionType;


                        const value =
                            button.dataset
                                .suggestionValue;


                        if (type === "gender") {

                            selectedGender =
                                value;


                            selectedCategory =
                                "todos";


                            searchText = "";


                            searchInput.value =
                                genderLabels[value];

                        } else {

                            selectedCategory =
                                value;


                            searchText = "";

                        }


                        updateCategoryOptions();

                        updateSmartUI();

                        filterProducts();

                        closeSuggestions();

                    }
                );

            });

    }


    function closeSuggestions() {

        if (smartSuggestions) {

            smartSuggestions.classList.remove(
                "visible"
            );

        }

    }


    /* =========================================================
       PROCESAR LO QUE ESCRIBE EL CLIENTE
       ========================================================= */

    function processSearch(value) {

        const normalized =
            normalize(value);


        if (!normalized) {

            selectedGender =
                "todos";


            selectedCategory =
                "todos";


            searchText = "";


            updateCategoryOptions();

            updateSmartUI();

            filterProducts();

            return;

        }


        const detectedGender =
            findGender(normalized);


        const detectedCategory =
            findCategory(normalized);


        /*
           Si detectamos "hombre",
           automáticamente seleccionamos Hombre.
        */

        if (detectedGender) {

            selectedGender =
                detectedGender;

        }


        /*
           Si detectamos "camisas",
           automáticamente seleccionamos Camisas.
        */

        if (detectedCategory) {

            selectedCategory =
                detectedCategory;

        }


        /*
           Quitamos las palabras utilizadas
           como filtros para que no interfieran
           con la búsqueda.
        */

        let remaining =
            normalized;


        if (detectedGender) {

            [
                ...genderAliases[
                    detectedGender
                ]

            ]

                .sort(
                    (a, b) =>
                        b.length - a.length
                )

                .forEach(alias => {

                    remaining =
                        remaining.replace(
                            normalize(alias),
                            " "
                        );

                });

        }


        if (detectedCategory) {

            [
                ...categoryAliases[
                    detectedCategory
                ]

            ]

                .sort(
                    (a, b) =>
                        b.length - a.length
                )

                .forEach(alias => {

                    remaining =
                        remaining.replace(
                            normalize(alias),
                            " "
                        );

                });

        }


        searchText =
            remaining
                .replace(/\s+/g, " ")
                .trim();


        updateCategoryOptions();

        updateSmartUI();

        filterProducts();

    }


    /* =========================================================
       LIMPIAR TODO
       ========================================================= */

    function resetFilters() {

        selectedGender =
            "todos";


        selectedCategory =
            "todos";


        searchText = "";


        if (searchInput) {

            searchInput.value = "";

        }


        updateCategoryOptions();

        updateSmartUI();

        closeSuggestions();

        filterProducts();


        if (searchInput) {

            searchInput.focus();

        }

    }


    /* =========================================================
       EVENTOS DEL BUSCADOR
       ========================================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                processSearch(
                    searchInput.value
                );


                updateSuggestions();

            }
        );


        searchInput.addEventListener(
            "focus",
            updateSuggestions
        );


        searchInput.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    processSearch(
                        searchInput.value
                    );

                    closeSuggestions();

                }


                if (event.key === "Escape") {

                    closeSuggestions();

                }

            }
        );

    }


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            resetFilters
        );

    }


    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".smart-filter"
                ) &&
                !event.target.closest(
                    ".store-search"
                )
            ) {

                closeSuggestions();

            }

        }
    );


    /* =========================================================
       FILTRAR PRODUCTOS
       ========================================================= */

    function filterProducts() {

        let visible = 0;


        products.forEach(product => {

            const gender =
                normalize(
                    product.dataset.gender
                );


            const category =
                normalize(
                    product.dataset.category
                );


            const name =
                normalize(
                    product.dataset.name
                );


            const text =
                normalize(
                    product.textContent
                );


            const genderOK =
                selectedGender === "todos" ||
                gender === selectedGender;


            const categoryOK =
                selectedCategory === "todos" ||
                category === selectedCategory;


            const searchOK =
                !searchText ||
                name.includes(searchText) ||
                category.includes(searchText) ||
                text.includes(searchText);


            const show =
                genderOK &&
                categoryOK &&
                searchOK;


            product.style.display =
                show ? "" : "none";


            if (show) {

                visible++;

            }

        });


        if (noResults) {

            noResults.style.display =
                visible
                    ? "none"
                    : "block";

        }

    }


    /* =========================================================
       CARRITO
       
       ESTA PARTE SE CONSERVA.
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
       AGREGAR AL CARRITO
       ========================================================= */

    document
        .querySelectorAll(".add-cart")
        .forEach(button => {

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


                    const existing =
                        cartProducts.find(
                            product =>
                                product.name ===
                                name
                        );


                    if (existing) {

                        existing.quantity += 1;

                    } else {

                        cartProducts.push({

                            name: name,

                            price: price,

                            quantity: 1

                        });

                    }


                    renderCart();

                    showCart();

                }
            );

        });


    /* =========================================================
       MOSTRAR CARRITO
       ========================================================= */

    function renderCart() {

        if (!cartItems) {

            return;

        }


        if (!cartProducts.length) {

            cartItems.innerHTML = `

                <p class="empty-cart">
                    Tu carrito está vacío.
                </p>

            `;

        } else {

            cartItems.innerHTML =
                cartProducts
                    .map(
                        (product, index) => {

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

                                    </div>


                                    <div
                                        class="cart-item-controls"
                                    >

                                        <button
                                            class="quantity-button"
                                            data-cart-action="decrease"
                                            data-index="${index}"
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
                                        >
                                            +
                                        </button>


                                        <button
                                            class="remove-cart"
                                            data-cart-action="remove"
                                            data-index="${index}"
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


                if (!cartProducts[index]) {

                    return;

                }


                if (
                    action ===
                    "increase"
                ) {

                    cartProducts[
                        index
                    ].quantity += 1;

                }


                if (
                    action ===
                    "decrease"
                ) {

                    cartProducts[
                        index
                    ].quantity -= 1;


                    if (
                        cartProducts[
                            index
                        ].quantity <= 0
                    ) {

                        cartProducts.splice(
                            index,
                            1
                        );

                    }

                }


                if (
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
       TOTALES DEL CARRITO
       ========================================================= */

    function updateCartTotals() {

        const quantity =
            cartProducts.reduce(
                (total, product) =>
                    total +
                    product.quantity,
                0
            );


        const total =
            cartProducts.reduce(
                (sum, product) =>
                    sum +
                    product.price *
                    product.quantity,
                0
            );


        if (cartCount) {

            cartCount.textContent =
                quantity;

        }


        if (cartTotal) {

            cartTotal.textContent =
                formatPrice(total);

        }

    }


    /* =========================================================
       FINALIZAR PEDIDO
       ========================================================= */

    if (checkout) {

        checkout.addEventListener(
            "click",
            () => {

                if (!cartProducts.length) {

                    alert(
                        "Tu carrito está vacío."
                    );

                    return;

                }


                const lines =
                    cartProducts.map(
                        product =>
                            `${product.quantity} x ${product.name} - ${formatPrice(
                                product.price *
                                product.quantity
                            )}`
                    );


                const total =
                    cartProducts.reduce(
                        (sum, product) =>
                            sum +
                            product.price *
                            product.quantity,
                        0
                    );


                alert(

                    "Resumen del pedido:\n\n" +

                    lines.join("\n") +

                    "\n\nTotal: " +

                    formatPrice(total)

                );

            }
        );

    }


    /* =========================================================
       INICIAR
       ========================================================= */

    createSmartFilter();

    filterProducts();

    renderCart();

});
