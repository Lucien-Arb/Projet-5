// Réccupération des informations sur les caméras
const url = "http://localhost:3000/api/cameras";
let addCart = document.querySelectorAll('.add');
let item = {};
let infos = new URLSearchParams(document.location.search.substring(1));
document.querySelector('#cart').textContent = localStorage.getItem('productNumbers');

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

// Fonction pour passer la commande et afficher le contenu du panier sous forme de liste récapitulative sur la page de confirmation de commande
function orderItems(id) {
    let order = JSON.parse(localStorage.getItem('order'));
    if (id === order.orderId) {
        document.querySelector('#orderID').textContent = `Commande n°: ${order.orderId}`;
        let total = 0;
        Object.values(order.products).map(items => {
            document.querySelector('#products-list').innerHTML += `
            <tr>
                <th scope ="row">${items._id}</th>
                <td>${items.name}</td>
                <td>${items.price / 100 + '€'}</td>
            </tr>
            `
            total += items.price;
        })
        document.querySelector('.price').textContent = `Prix total : ${total / 100 + '€'}`
        document.querySelector('#thankYou').textContent = `Merci ${order.contact.lastName} pour votre commande.`
    }
}

// Quand la page n'est pas trouvée => 404
function notfound() {
    document.location = '404.html'
}