/* =========================================================
   ANGIE BOUTIQUE
   SISTEMA DE CATEGORÍAS, SUBCATEGORÍAS Y BÚSQUEDA
========================================================= */


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


/* =========================================================
   VARIABLES DEL FILTRO
========================================================= */

let selectedGender = "todos";

let selectedCategory = "todos";

let searchText = "";


/* =========================================================
   FUNCIÓN PARA NORMALIZAR TEXTO
========================================================= */

function normalizeText(text) {

    return String(text || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/* =========================================================
   CAMBIAR CATEGORÍA PRINCIPAL
========================================================= */

mainCategories.forEach(button => {

    button.addEventListener("click", function () {

        /* -----------------------------------------
           Obtener género seleccionado
        ----------------------------------------- */

        selectedGender = normalizeText(
            button.dataset.gender
        );


        /* -----------------------------------------
           Reiniciar subcategoría
        ----------------------------------------- */

        selectedCategory = "todos";


        /* -----------------------------------------
           Quitar activo de todas las categorías
        ----------------------------------------- */

        mainCategories.forEach(item => {

            item.classList.remove("active");

        });


        /* -----------------------------------------
           Activar categoría seleccionada
        ----------------------------------------- */

        button.classList.add("active");


        /* -----------------------------------------
           Ocultar todos los grupos
        ----------------------------------------- */

        subcategoriesGroups.forEach(group => {

            group.classList.remove("active");

        });


        /* -----------------------------------------
           Mostrar grupo correspondiente
        ----------------------------------------- */

        if (selectedGender !== "todos") {

            const selectedGroup =
                document.querySelector(
                    `.subcategories[data-subcategory-group="${selectedGender}"]`
                );


            if (selectedGroup) {

                selectedGroup.classList.add("active");


                /* -----------------------------------------
                   Reiniciar botones de subcategoría
                ----------------------------------------- */

                selectedGroup
                    .querySelectorAll(".subcategory")
                    .forEach(item => {

                        item.classList.remove("active");

                    });


                /* -----------------------------------------
                   Activar "Todas"
                ----------------------------------------- */

                const allButton =
                    selectedGroup.querySelector(
                        '.subcategory[data-category="todos"]'
                    );


                if (allButton) {

                    allButton.classList.add("active");

                }

            }

        }


        /* -----------------------------------------
           Si se selecciona TODOS
        ----------------------------------------- */

        if (selectedGender === "todos") {

            subcategories.forEach(item => {

                item.classList.remove("active");

            });

        }


        /* -----------------------------------------
           Aplicar filtro
        ----------------------------------------- */

        filterProducts();

    });

});


/* =========================================================
   CAMBIAR SUBCATEGORÍA
========================================================= */

subcategories.forEach(button => {

    button.addEventListener("click", function () {

        /* -----------------------------------------
           Obtener género de la subcategoría
        ----------------------------------------- */

        const buttonGender =
            normalizeText(button.dataset.gender);


        /* -----------------------------------------
           Obtener categoría
        ----------------------------------------- */

        selectedCategory =
            normalizeText(button.dataset.category);


        /* -----------------------------------------
           Asegurar que el género corresponda
        ----------------------------------------- */

        if (buttonGender) {

            selectedGender = buttonGender;

        }


        /* -----------------------------------------
           Grupo actual
        ----------------------------------------- */

        const currentGroup =
            button.closest(".subcategories");


        /* -----------------------------------------
           Quitar activo del grupo
        ----------------------------------------- */

        if (currentGroup) {

            currentGroup
                .querySelectorAll(".subcategory")
                .forEach(item => {

                    item.classList.remove("active");

                });

        }


        /* -----------------------------------------
           Activar botón
        ----------------------------------------- */

        button.classList.add("active");


        /* -----------------------------------------
           Activar categoría principal correspondiente
        ----------------------------------------- */

        mainCategories.forEach(categoryButton => {

            const categoryGender =
                normalizeText(categoryButton.dataset.gender);


            if (categoryGender === selectedGender) {

                mainCategories.forEach(item => {

                    item.classList.remove("active");

                });

                categoryButton.classList.add("active");

            }

        });


        /* -----------------------------------------
           Aplicar filtro
        ----------------------------------------- */

        filterProducts();

    });

});


/* =========================================================
   BUSCADOR
========================================================= */

if (searchInput) {

    searchInput.addEventListener("input", function () {

        searchText =
            normalizeText(searchInput.value);


        filterProducts();

    });

}


/* =========================================================
   LIMPIAR BÚSQUEDA
========================================================= */

if (clearSearch) {

    clearSearch.addEventListener("click", function () {

        if (searchInput) {

            searchInput.value = "";

        }


        searchText = "";


        filterProducts();


        if (searchInput) {

            searchInput.focus();

        }

    });

}


/* =========================================================
   FUNCIÓN PRINCIPAL DE FILTRADO
========================================================= */

function filterProducts() {

    let visibleProducts = 0;


    /* -----------------------------------------
       Recorrer productos
    ----------------------------------------- */

    products.forEach(product => {

        /* -----------------------------------------
           Datos del producto
        ----------------------------------------- */

        const productGender =
            normalizeText(product.dataset.gender);


        const productCategory =
            normalizeText(product.dataset.category);


        const productName =
            normalizeText(product.dataset.name);


        const productText =
            normalizeText(product.textContent);


        /* -----------------------------------------
           Coincidencia de género
        ----------------------------------------- */

        const genderMatches =
            selectedGender === "todos" ||
            productGender === selectedGender;


        /* -----------------------------------------
           Coincidencia de categoría
        ----------------------------------------- */

        const categoryMatches =
            selectedCategory === "todos" ||
            productCategory === selectedCategory;


        /* -----------------------------------------
           Coincidencia de búsqueda
        ----------------------------------------- */

        const searchMatches =
            searchText === "" ||
            productName.includes(searchText) ||
            productCategory.includes(searchText) ||
            productText.includes(searchText);


        /* -----------------------------------------
           Resultado final
        ----------------------------------------- */

        const shouldShow =
            genderMatches &&
            categoryMatches &&
            searchMatches;


        /* -----------------------------------------
           Mostrar / ocultar
        ----------------------------------------- */

        if (shouldShow) {

            product.style.display = "";

            visibleProducts++;

        } else {

            product.style.display = "none";

        }

    });


    /* =====================================================
       MENSAJE SIN RESULTADOS
    ===================================================== */

    if (noResults) {

        if (visibleProducts === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }


    /* =====================================================
       ACTUALIZAR CONTADOR DE PRODUCTOS
    ===================================================== */

    console.log(
        "Angie Boutique:",
        visibleProducts,
        "productos visibles |",
        "Género:",
        selectedGender,
        "| Categoría:",
        selectedCategory
    );

}


/* =========================================================
   INICIALIZAR TIENDA
========================================================= */

filterProducts();
