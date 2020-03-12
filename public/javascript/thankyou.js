const navbar = document.getElementById('navbar');
const numberField = document.getElementById('numberField');
const recommandField = document.getElementById('recommandField');
const homeBtn = document.getElementById('homeBtn');
const footerField = document.getElementById('footerField');

const desktopSearchBar = document.getElementById('desktopSearchBar');
const desktopSearchBtn = document.getElementById('desktopSearchBtn');

const mobileSearchBar = document.getElementById('mobileSearchBar');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');

const cartDesktopCount = document.querySelector('.desktop-nav-cart-count');
const cartMobileCount = document.querySelector('.mobile-nav-cart-count');

let cart = {
    prime: '',
    order: {
        shipping: '',
        payment: '',
        subtotal: '',
        freight: '',
        total: '',
        recipient: {
            name: '',
            phone: '',
            email: '',
            address: '',
            time: ''
        },
        list: [
            
        ]
    },

};

function getAllItems(){
    fetch('https://api.appworks-school.tw/api/1.0/products/all')
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const allItems = res.data;
        const selectedItem = [];
        for(let i = 0;i < 3;i++){
            const index = Math.floor(Math.random() * allItems.length);
            selectedItem.push(allItems[index]);
        }
        selectedItem.forEach(product => {
            generateRecommandTemplate(product)
        })
    }).catch(error => console.log(error));  
} 


function generateRecommandTemplate(product){
    const recommandHTML = `
    <div class="card">
        <a href="./product.html?id=${product.id}">
            <div class="product-img">
                <img src="${product.main_image}" alt="product-img">
            </div>
            <div class="item-body" data-id="${product.id}>
                <div class="item-name">
                    ${product.title}
                </div>
            </div>
        </a>
    </div>
    `
    recommandField.innerHTML += recommandHTML;
}

//fb
function statusChangeCallback(res){
    if(res.status === 'connected'){
        console.log('success', res);
    }else{
        console.log('fail');
    }
}

function checkLoginState() {
    FB.getLoginStatus(response => {
        if(response.status === 'connected'){
            window.location.href = "./profile.html";
        }else{
            login();
            console.log('ken')
        }
    });
}

function login() {
    let userInfo = {
        accessToken: '',
        photo: '',
        name: '',
        email: ''
    };
    FB.login(function(response) {
      console.log(response);
      userInfo.accessToken = response.authResponse.accessToken;   
      if (response.status === "connected") {
        FB.api("/me", "POST", {
          "fields": "id,name,email,picture"
        }, function(res) {
          console.log(res);
          userInfo.photo = res.picture.data.url;
          userInfo.name = res.name;
          userInfo.email = res.email;
          localStorage.setItem('user', JSON.stringify(userInfo));
          window.location.href = "./profile.html";
        });
      }
    }, {
        scope: 'email', 
        auth_type: 'rerequest'
      });
}



//預設 
window.addEventListener('load', function(){
    cart = JSON.parse(localStorage.getItem('cart')) || cart;
    cartDesktopCount.innerHTML = cart.order.list.length;
    cartMobileCount.innerHTML = cart.order.list.length;
    numberField.innerHTML = window.location.search.slice(9);
    getAllItems();
})

navbar.addEventListener('click', function(event){
    if(event.target.matches('.member-img') || event.target.matches('.member-word')){
        checkLoginState();
    }
})

mobileSearchBtn.addEventListener('click', function(){
    mobileSearchBar.parentElement.classList.toggle('search-input-field-show');
})

homeBtn.addEventListener('click', function(){
    window.location.href = "../index.html";
})

















