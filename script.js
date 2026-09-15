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
   CAMBIAR CATEGORÍA PRINCIPAL
========================================================= */

mainCategories.forEach(button => {

    button.addEventListener("click", () => {

        /* -----------------------------------------
           Obtener categoría seleccionada
        ----------------------------------------- */

        selectedGender = button.dataset.gender;

        /* -----------------------------------------
           Quitar estado activo de todas
        ----------------------------------------- */

        mainCategories.forEach(item => {
            item.classList.remove("active");
        });

        /* -----------------------------------------
           Activar la seleccionada
        ----------------------------------------- */

        button.classList.add("active");


        /* -----------------------------------------
           Mostrar las subcategorías correspondientes
        ----------------------------------------- */

        subcategoriesGroups.forEach(group => {

            group.classList.remove("active");

        });


        if (selectedGender !== "todos") {

            const selectedGroup = document.querySelector(
                `[data-subcategory-group="${selectedGender}"]`
            );

            if (selectedGroup) {

                selectedGroup.classList.add("active");

            }

        }


        /* -----------------------------------------
           Reiniciar subcategoría
        ----------------------------------------- */

        selectedCategory = "todos";


        subcategories.forEach(item => {

            item.classList.remove("active");

        });


        /* Activar "Todas" dentro del grupo seleccionado */

        if (selectedGender !== "todos") {

            const selectedGroup = document.querySelector(
                `[data-subcategory-group="${selectedGender}"]`
            );

            if (selectedGroup) {

                const allButton = selectedGroup.querySelector(
                    '[data-category="todos"]'
                );

                if (allButton) {

                    allButton.classList.add("active");

                }

            }

        }


        /* -----------------------------------------
           Aplicar filtros
        ----------------------------------------- */

        filterProducts();

    });

});


/* =========================================================
   CAMBIAR SUBCATEGORÍA
========================================================= */

subcategories.forEach(button => {

    button.addEventListener("click", () => {

        /* -----------------------------------------
           Obtener categoría seleccionada
        ----------------------------------------- */

        selectedCategory = button.dataset.category;


        /* -----------------------------------------
           Quitar estado activo
        ----------------------------------------- */

        const currentGroup = button.closest(".subcategories");

        if (currentGroup) {

            currentGroup
                .querySelectorAll(".subcategory")
                .forEach(item => {

                    item.classList.remove("active");

                });

        }


        /* -----------------------------------------
           Activar botón seleccionado
        ----------------------------------------- */

        button.classList.add("active");


        /* -----------------------------------------
           Aplicar filtros
        ----------------------------------------- */

        filterProducts();

    });

});


/* =========================================================
   BUSCADOR
========================================================= */

if (searchInput) {

    searchInput.addEventListener("input", () => {

        searchText = searchInput.value
            .toLowerCase()
            .trim();


        filterProducts();

    });

}


/* =========================================================
   LIMPIAR BÚSQUEDA
========================================================= */

if (clearSearch) {

    clearSearch.addEventListener("click", () => {

        searchInput.value = "";

        searchText = "";

        filterProducts();

        searchInput.focus();

    });

}


/* =========================================================
   FUNCIÓN PRINCIPAL DE FILTRADO
========================================================= */

function filterProducts() {

    let visibleProducts = 0;


    products.forEach(product => {

        /* -----------------------------------------
           Información del producto
        ----------------------------------------- */

        const productGender =
            product.dataset.gender;

        const productCategory =
            product.dataset.category;

        const productName =
            product.dataset.name.toLowerCase();


        /* -----------------------------------------
           Texto completo del producto
           para la búsqueda
        ----------------------------------------- */

        const productText =
            product.textContent.toLowerCase();


        /* -----------------------------------------
           Comprobar género
        ----------------------------------------- */

        const genderMatches =
            selectedGender === "todos" ||
            productGender === selectedGender;


        /* -----------------------------------------
           Comprobar categoría
        ----------------------------------------- */

        const categoryMatches =
            selectedCategory === "todos" ||
            productCategory === selectedCategory;


        /* -----------------------------------------
           Comprobar búsqueda
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
       MENSAJE CUANDO NO HAY RESULTADOS
    ===================================================== */

    if (noResults) {

        if (visibleProducts === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }

}


/* =========================================================
   INICIALIZAR TIENDA
========================================================= */

filterProducts();
