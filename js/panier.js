// Réccupération des informations sur les caméras
const url = "http://localhost:3000/api/cameras";
let addCart = document.querySelectorAll('.add');
let item = {};
let infos = new URLSearchParams(document.location.search.substring(1));
document.querySelector('#cart').textContent = localStorage.getItem('productNumbers');


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

// Vérifiation du formulaire puis envoie des données au server et affiche du récapitulatif de commande
function validRegex() {
    let inputs = document.querySelectorAll('input.form-control');
    let data = {};
    let valid = true;
    let reg = {
        "mail": /([\w-\.]+@[\w-\.]+\.{1}[\w]+)/i, // Adresse Mail
        "text": /^\S[a-z ,.'à-ÿ-]+$/i, // Nom, Prénom, Ville
        "postalcode": /^[0-9]{5}$/i, // Code postal
        "postal": /^[0-9]{1,5}[A-z0-9 'à-ÿ-]{5,30}$/i // Adresse postale
    }
    inputs.forEach(input => {
        let validation = false;
        if (input.name == "name" || input.name == "lastname" || input.name == "city") 
            validation = formV(reg.text.test(input.value), input)
         else if (input.name == "email") 
            validation = formV(reg.mail.test(input.value), input)
         else if (input.name == "adress") 
            validation = formV(reg.postal.test(input.value), input)
         else if (input.name == "postalcode")
        validation = formV(reg.postalcode.test(input.value), input)
        if (!validation) 
            valid = false;
    });

        if (valid) {
            let pducts = JSON.parse(localStorage.getItem('itemsInCart'))
            data = {
                'contact': {
                    'firstName': inputs[0].value,
                    'lastName': inputs[1].value,
                    'address': inputs[3].value,
                    'email': inputs[4].value,
                    'city': inputs[5].value
                },
                'products': [

                ]
            }
            console.log(pducts)
            Object.keys(pducts).map(pdt => {
                for (let i = 0; i < pducts[pdt].length; i++) {
                    const e = pducts[pdt][i];
                    if (e.incart > 1) {
                        for (let x = 0; x < e.incart; x++) {
                            console.log(e)
                            data.products.push(e.id)
                        }
                    } else {
                        data.products.push(e.id)
                    }
                }
            })
            console.log(pducts)

            let post = "http://localhost:3000/api/cameras/order";
            const method = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
            fetch(post, method).then((response) => {
                response.json().then((data) => {
                    console.log(data);
                    localStorage.setItem('order', JSON.stringify(data));
                    localStorage.removeItem('productNumbers');
                    localStorage.removeItem('totalCost');
                    localStorage.removeItem('itemsInCart');
                    document.location = 'order.html?order=' + data.orderId;
                });
            });
        };
    };

function formV(Regtest, input) {
    if (Regtest) {
        input.classList.remove("is-invalid")
        input.classList.add("is-valid")
        return true;
    } else {
        input.classList.remove("is-valid")
        input.classList.add("is-invalid")
    }
    return false;
}

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
};

// Fonction qui supprime un produit que ce soit sur la nav bar, bouton supprimer(produit), gérer les quantitées
function cartNumDeleted() {
    let numbers = parseInt(localStorage.getItem('productNumbers'));

    if (numbers) {
        localStorage.setItem('productNumbers', numbers - 1);
        document.querySelector('#cart').textContent = numbers - 1;

    } else {
        localStorage.setItem('productNumbers', 1);
        document.querySelector('#cart').textContent = 1;
    }
};

// Fonction pour supprimer un produit du panier
const deleteRowButtons = document.getElementsByClassName("delete-row");
let productID = JSON.parse(localStorage.getItem("itemsInCart"));

for (let i = 0; i < deleteRowButtons.length; i++) {
    deleteRowButtons[i].addEventListener('click', (e) => {

       for (let x = 0; x < productID.length; x++) {

            if (productID[productID.key(x)] == deleteRowButtons[i].getAttribute("data-id")) {

                localStorage.delete(productID[productID.key(x)]);
                localStorage.setItem('itemsInCart', productID[productID.key(x)]);
                window.location.reload(true);
                console.log(productID);
            };
       }; 
    console.log(productID.key(x));
    console.log(deleteRowButtons[i].getAttribute("data-id"));
    });
};

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

//Fonction afficher le contenu du panier 
function displayCart() {
    let cartItems = localStorage.getItem('itemsInCart');
    cartItems = JSON.parse(cartItems);

    let productsInCart = document.querySelector('.cart.additem');
    document.querySelector('#total').textContent = `${localStorage.getItem('totalCost')} €`;
    console.log(cartItems)
    if (cartItems && productsInCart) {
        productsInCart.innerHTML = '';
        
        Object.values(cartItems).map(item => {
            productsInCart.innerHTML += `
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-md-2 text-center">
                        <img class="img-responsive" src ="${item[0].img}" alt="prewiew produit choisi" width="100%">
                    </div>
  
                    <div class="col-md-12 text-sm-center col-sm-12 text-md-left col-md-4">
                        <h4 class="product-name font-weight-bold my-1">${item[0].name}</h4>
                        <p>${item[0].desc}</p>
                    </div>
  
                    <div class="col-md-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                        <div class="col-5 col-sm-5 col-md-5 text-md-right">
                            <h4>${item[0].price} €</h6>
                        </div>
                        <div class="col-3 col-sm-3 col-md-3">
                            <div class ="quantity">
                                <input id="${item[0].id}" class="itemcount" type="number" step="1" max="99" min="1" value="${item[0].incart}" title="Qty" class="qty" size = "4" >
                            </div>
                        </div>
                        <div class = "col-4 col-sm-2 col-md-2 text-right">
                            <button id="${item[0].id}" data-id="${item[0].id}" type="button" class="btn btn-outline-danger btn-xs delete-row">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg></i>Supprimer</button>
                        </div>
                    </div>
                </div>
                <hr>
                `
        });
    }

    //Boucle pour gérer le nombres de produits dans le panier ainsi que le prix total
    let inputs = document.querySelectorAll('.itemcount');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", (e) => {
            console.log(e);
            let id = inputs[i].getAttribute('id');
            cartItems[id][0].incart = parseInt(inputs[i].value);
            localStorage.setItem('itemsInCart', JSON.stringify(cartItems));

            if (parseInt(e.target.defaultValue) > parseInt(inputs[i].value)) {
                console.log('-1');
                //Prendre le nombre de caméras le soustraire au total d'objets dans le panier puis ajouter le nombre modifier
                //Prendre le prix du produit et le soustraire au total

                let price = localStorage.getItem('totalCost') - cartItems[id][0].price;
                localStorage.setItem('totalCost', price);

                let itemstotal = parseInt(localStorage.getItem('productNumbers'));
                let numCam = parseInt(e.target.defaultValue);
                let camModify = cartItems[id][0].incart;
                cartNumDeleted();

                if (itemstotal > numCam) {
                    itemstotal = itemstotal - numCam;
                    itemstotal = itemstotal + camModify;
                    localStorage.setItem('productNumbers', JSON.stringify(itemstotal));

                } else if (itemstotal === numCam) {
                    console.log("c'est le même nombre");
                    itemstotal = camModify;
                    localStorage.setItem('productNumbers', itemstotal);

                }
            } else if (parseInt(e.target.defaultValue) < parseInt(inputs[i].value)) {
                console.log('+1');
                let price = parseInt(localStorage.getItem('totalCost')) + parseInt(cartItems[id][0].price);
                localStorage.setItem('totalCost', price);
                cartNum()

            }
            window.location.reload()
        });
    }
}

// Quand la page n'est pas trouvée => 404
function notfound() {
    document.location = '404.html'
}