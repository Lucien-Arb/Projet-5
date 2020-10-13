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
function product(id) {
    document.location = 'products.html?id=' + id
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Ajoute le produit au panier
for (let i = 0; i < addCart.length; i++) {
    addCart[i].addEventListener('click', (e) => {
        e.preventDefault();
        // Appel la fonction qui incrémente le bouton panier dans la nav bar
        cartNum();
        // Appel la fonction qui ajoute un appareil photo dans le panier avec ses infos
        cartItems();
    })
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Affiche le produit sélectionné en page d'acceuil sur la page produit pour voir plus de détails et aussi l'ajouter au panier
function prod(id) {
    fetch(url + '/' + id).then((response) => {
        if (response.ok) {
            response.json().then((json) => {
                document.querySelector('#name').textContent = json.name;
                document.querySelector('#price').textContent = json.price / 100 + '€';
                document.querySelector('#description').textContent = json.description;
                document.querySelector('img').setAttribute('src', json.imageUrl);
                document.querySelector('.add').setAttribute('id', json._id);
                for (let i = 0; i < json.lenses.length; i++) {
                    const lenses = json.lenses[i];
                    try {
                        document.querySelector('#options').appendChild(new Option(lenses, i));
                    } catch (e) {
                        document.querySelector('#options').appendChild(new Option(lenses, null));
                    }
                }
            })
        }
    })
}


//---------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction qui incrémente le bouton panier dans la nav bar
function cartNum() {
    let numbers = parseInt(localStorage.getItem('productNumbers'));

    if (numbers) {
        localStorage.setItem('productNumbers', numbers + 1);
        document.querySelector('#cart').textContent = numbers + 1;

    } else {
        localStorage.setItem('productNumbers', 1);
        document.querySelector('#cart').textContent = 1;
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction qui ajoute un produit dans le localStorage et dans le panier avec son ID
function cartItems() {
    //Si le produit est différent de null donc présent dans le panier
    if (localStorage.getItem('itemsInCart') != null) {
        let inCart = JSON.parse(localStorage.getItem('itemsInCart'));
        let product = updateProduct();
        total();
        
        //Ajouter le produit à un objet
        let ids = Object.keys(inCart)

        //Si l'ID est déjà dans le panier
        if (ids.indexOf(product[0].id) != -1) {
            let i = ids.indexOf(product[0].id);
            let curid = ids[i];

            inCart[curid][0].incart += 1;
            localStorage.setItem('itemsInCart', JSON.stringify(inCart))
        } else {
            //Ajoute le produit au panier
            localStorage.setItem('itemsInCart', JSON.stringify(addItem(product[0].id, product, inCart)));
            console.log(localStorage.getItem('itemsInCart'));
        }

    } else {
        //Ajoute le nouveau tableau au localStorage
        let product = updateProduct();
        total();
        localStorage.setItem('itemsInCart', JSON.stringify(addItem(product[0].id, product)));
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction de mise à jour du produit et de ses informations
function updateProduct() {
    let product = [{
        name: $("#name").text(),
        desc: $("#description").text(),
        img: $("img").attr('src'),
        price: parseInt($("#price").text()),
        id: $(".add").attr('id'),
        incart: 1
    }]
    return product;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction pour ajouter un produit
function addItem(id, product, json) {
    let item;
    if (json != null) {
        if (json[id] === undefined) {
            item = {
                ...json,
                [id]: product
            }
        }
    } else {
        item = {
            [id]: product
        }
    }
    return item;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Fonction pour faire le total de produits dans le panier
function total() {
    let product = updateProduct();
    let cartCost = localStorage.getItem('totalCost');
    if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product[0].price);
    } else {
        localStorage.setItem('totalCost', product[0].price);
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
// Quand la page n'est pas trouvée => 404
function notfound() {
    document.location = '404.html'
}