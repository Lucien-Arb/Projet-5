// Réccupération des informations sur les caméras
const url = "http://localhost:3000/api/cameras";
let addCart = document.querySelectorAll('.add');
let item = {};
let infos = new URLSearchParams(document.location.search.substring(1));
document.querySelector('#cart').textContent = localStorage.getItem('productNumbers');

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Switch sur toutes les pages pour faire passer les infos produits entre chacunes d'elles
console.log(window.location.pathname)

switch (window.location.pathname) {
    case '/index.html':
    case '/':
        listing(url);
        break
    case '/products.html':
    case '/':
        let id = infos.get("id");
        console.log('Produit, id : ' + id)
        id ? prod(id) : notfound();
        break
    case '/panier.html':
    case '/':
        console.log('Panier')
        displayCart();
        document.querySelector('.commande').addEventListener('click', (e) => {
            e.preventDefault();
            let inputs = document.querySelectorAll('input.form-control');
            validRegex(inputs);
        });
        break
    case '/order.html':
        let order = infos.get("order");
        console.log(order);
        order ? orderItems(order) : notfound();
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Réccupération des informations sur les caméras et affichage sur la page d'accueil
function listing(url) {
    fetch(url).then(function (response) {
        if (response.status !== 200) {
            // TEST : Permet d'afficher si il y a un problème lors de la récupération des fiches produits de l'API
            console.log('Il y a un problème. Status Code: ' + response.status);
            return;
        }
        // Affiche le contenu HTML avec les produits de manière dynamique
        response.json().then(function (data) {
            for (let i = 0; i < data.length; i++) {
                let mainContainer = document.getElementById("camerasInformations");
                let div = document.createElement("div");
                div.innerHTML += `
                <div class="col-md-4 col-sm-8 my-3 ">
                    <div class="card" style="width: 18rem;">
                    <img src="${data[i].imageUrl}" class="card-img-top" alt="${data[i].name}">
                    <div class="card-body">
                        <h5 class="card-title">${data[i].name}</h5>
                        <p class="card-text">${data[i].description}</p>
                        <p class="card-text"><strong>${data[i].price / 100} €</strong></p>
                        <a href="products.html?id=${data[i]._id}" class="btn btn-color" onclick="product(this.id)">Voir le produit</a>
                    </div>
                    </div>
                </div>
                `
                mainContainer.appendChild(div);
            };
        });
    })
        .catch(function (err) {
            console.log('Fetch Error :', err);
        });
};

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Quand la page n'est pas trouvée => 404
function notfound() {
    document.location = '404.html';
};