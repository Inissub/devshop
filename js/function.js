
//...........Arricher tous les produits
async function toutProduits(){
    let liste_produit = document.getElementById('liste_produit');
    try{
        const reponse = await fetch('https://fakestoreapi.com/products');
        if(reponse.ok){
            const jsonReponse = await reponse.json();
            let produit = '';
            for(let el of jsonReponse){
                    produit += `<div class="produit_item">
                    <img src="${el.image}">
                    <div class="conteneur">
                    <h3> ${el.title} </h3>
                    <span> ${el.price}  €</span>
                    <span> ${el.category} </span>
                    <button class="acheter"  data-id="${el.id}" data-titre="${el.title}" data-prix="${el.price}" data-desc="${el.description}"  >acheter</button>
                    </div>
                </div>`
            }
            liste_produit.innerHTML = produit;
        }else{
            throw new Error('Requete Echouée');
        }
    }catch(error){
        liste_produit.innerHTML = `<p>${error}</p>`;
    }
}
document.addEventListener('DOMContentLoaded', () =>{toutProduits()})



// .......Rechercher un produit
async function trouveProduit(){
    let liste_produit = document.getElementById('liste_produit');
    const recup = document.forms['rech_form']['categorie'].value;
    const categorie = recup.toLowerCase();
    let categorie_liste = [];
    let produit = '';
    try{
        const reponse = await fetch('https://fakestoreapi.com/products');
        if(reponse.ok){
            const jsonReponse = await reponse.json();
            for(let el of jsonReponse){
                const cat = el.category.toLowerCase();
                const titre = el.title.toLowerCase();
                const descip = el.description.toLowerCase();
                if(cat.includes(categorie) || titre.includes(categorie) || descip.includes(categorie)){
                    categorie_liste.push(el);
                }
            }
            if(categorie_liste.length == 0){
                liste_produit.innerHTML = `<p>Aucun element ne correspond à votre recherche</p>`;
            }else{
                for(let el of categorie_liste){
                    produit += `<div class="produit_item">
                    <img src="${el.image}">
                    <div class="conteneur">
                    <h3> ${el.title} </h3>
                    <span> ${el.price}  € </span>
                    <span> ${el.category} </span>
                    <button class="acheter"  data-id="${el.id}" data-titre="${el.title}" data-prix="${el.price}" data-desc="${el.description}" >acheter</button>
                    </div>
                </div>`
                }
                liste_produit.innerHTML = produit;
            }
        }else{
            throw new Error('Requete Echouée');
        }
    }catch(error){
        liste_produit.innerHTML = `<p>${error}</p>`;
    }
}
document.forms['rech_form'].addEventListener('submit', (e) =>{
    e.preventDefault();
    trouveProduit();
})

//...........Filtrer les produits
async function filtreProduit(categorie){
    let liste_produit = document.getElementById('liste_produit');
    let produit = '';
    try{
        const reponse = await fetch('https://fakestoreapi.com/products');
        if(reponse.ok){
            const jsonReponse = await reponse.json();
            let categorie_liste = jsonReponse.filter( (el) =>{
                return el.category === categorie;
            });
            for(let el of categorie_liste){
                    produit += `<div class="produit_item">
                    <img src="${el.image}">
                    <div class="conteneur">
                    <h3> ${el.title} </h3>
                    <span> ${el.price}  € </span>
                    <span> ${el.category} </span>
                    <button class="acheter"  data-id="${el.id}" data-titre="${el.title}" data-prix="${el.price}" data-desc="${el.description}"  >acheter</button>
                    </div>
                </div>`
            }
            liste_produit.innerHTML = produit;
        }else{
            throw new Error('Requete Echouée');
        }
    }catch(error){
        liste_produit.innerHTML = `<p>${error}</p>`;
    }
}

const categorie = document.querySelectorAll('button[data-cat]');
for(let el of categorie){
    el.addEventListener('click', () =>{filtreProduit(el.dataset.cat)});
}


//......... Pour gerer le panier
let liste_produit = document.getElementById('liste_produit');
liste_produit.addEventListener('click', (e) =>{
    if(e.target.className == "acheter"){
        let produit_select = e.target;
        const produit ={
            id : produit_select.dataset.id,
            titre : produit_select.dataset.titre,
            prix : produit_select.dataset.prix,
            description : produit_select.dataset.desc
        }
        remplisPanier(produit);
        afficheNombre();
    }
})

function remplisPanier(produit){
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.push(produit);
    localStorage.setItem('panier', JSON.stringify(panier))
}

function afficherPanier(){
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    let body = document.querySelector('body');
    let liste_panier = document.querySelector('.liste_panier')
    if(liste_panier){
        liste_panier.remove();
    }else{
        let produit =''
        for(let [ index, el] of panier.entries() ){
            produit+=`<ul>
            <li>${el.titre}</li>
            <li>${el.prix} € </li>
            <button data-index="${index}">supprimer</button>
            </ul>`
        }
        let barre_laterale = document.createElement('div')
        barre_laterale.classList.add('liste_panier')
        barre_laterale.innerHTML = produit
        body.appendChild(barre_laterale)
    }
}

function afficheNombre(){
    let cadi = document.getElementById('cadi')
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    if(panier.length==0){
        return cadi.textContent = 0
    }else{
        return cadi.textContent = panier.length
    }
}

let change = document.getElementById('change')
change.addEventListener('click', ()=>{
    let page = document.querySelector('html');
    if(page.dataset.theme == 'sombre'){
        page.dataset.theme = 'clair';
    }else{
        page.dataset.theme = 'sombre';
    }
})

let shop = document.getElementById('shop')
shop.addEventListener('click', ()=>{
    afficherPanier();
})