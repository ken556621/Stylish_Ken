const navbar = document.getElementById('navbar');
const mobileProduct = document.getElementById('mobileProduct');
const desktopCartProduct = document.getElementById('desktopCartProduct');
const footerField = document.getElementById('footerField');

const desktopSearchBar = document.getElementById('desktopSearchBar');
const desktopSearchBtn = document.getElementById('desktopSearchBtn');

const mobileSearchBar = document.getElementById('mobileSearchBar');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');

const cartDesktopCount = document.querySelector('.desktop-nav-cart-count');
const cartMobileCount = document.querySelector('.mobile-nav-cart-count');

const price = {
    total: 0,
    shipment: 30,
    payment: 0
};

const userInfo = {
    name: '',
    email: '',
    phone: '',
    address: '',
    deliveryTime: ''
};

const cartDomElement = {
    desktopQtyField: document.getElementById('desktopQtyField'),
    mobileQtyField: document.getElementById('mobileQtyField'),
    selectField: '',
    selectAccount: '',
    nameInput: document.getElementById('nameInput'),
    emailInput: document.getElementById('emailInput'),
    phoneInput: document.getElementById('phoneInput'),
    addressInput: document.getElementById('addressInput'),
    timeInput: document.querySelector('input[name="time"]:checked'),
    expensePrice: document.getElementById('expensePrice'),
    shippingPrice: document.getElementById('shippingPrice'),
    totalPrice: document.getElementById('totalPrice'),
    submitBtn: document.getElementById('submitBtn')
};

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



function getLocalstorageItems(){
    const cartList = JSON.parse(localStorage.getItem('cart')) || cart;
    const cartListOrder = cartList.order.list; 
    cartListOrder.forEach(product => {
        if(window.innerWidth <= 560){
            generateMobileTemplate(product);
        }else{
            generateDesktopTemplate(product);
        }
    });
    cartDomElement.desktopQtyField.innerHTML = `購物車(${cartListOrder.length})`;
    cartDomElement.mobileQtyField.innerHTML = `購物車(${cartListOrder.length})`;
}


function generateMobileTemplate(product){
    let cartHTML = `
    <div class="mobile-each-product-detail-wrapper">
        <div class="mobile-each-product-detail">
            <div class="column-left">
                <img src="${product.main_image}" alt="product-img">
            </div>
            <div class="column-right">
                <div class="product-name-wrapper">
                    <div class="product-name">
                        ${product.name}
                    </div>
                    <i class="fas fa-trash-alt" data-id="${product.id}"></i>
                </div>
                <div class="product-id">
                    ${product.id}
                </div>
                <div class="product-color">
                    <div class="product-color-name">
                        顏色
                    </div>
                    <div class="product-color-line">
                        |
                    </div>
                    <div class="product-color-color">
                        ${product.color.name}
                    </div>
                </div>
                <div class="product-size">
                    <div class="product-size-name">
                        尺寸
                    </div>
                    <div class="product-size-line">
                        |
                    </div>
                    <div class="product-size-size">
                        ${product.size}
                    </div>
                </div>
            </div>
        </div>
        <div class="row-bottom">
            <div class="quantity">
                <div class="quantity-name">
                    數量
                </div>
                <div class="quantity-selector">
                    <select name="quantity" class="selectField" data-id="${product.id}" data-color="${product.color.name}" data-size="${product.size}">
                    ${generateSelectQuantity(product.stock, product.qty)}
                    </select>
                </div>
            </div>
            <div class="row-bottom-price">
                <div class="row-bottom-price-name">
                    單價
                </div>
                <div class="row-bottom-price-price">
                    NT.${product.price}
                </div>
            </div>
            <div class="row-bottom-count">
                <div class="row-bottom-price-name">
                    小計
                </div>
                <div class="row-bottom-price-price" data-id="${product.id}" data-price="${product.price}" data-color="${product.color.name}" data-size="${product.size}">
                    NT.${product.qty * product.price}
                </div>
            </div>
        </div>
    </div>
    `
    mobileProduct.innerHTML += cartHTML;
    price.total += Number(product.price) * Number(product.qty);
    cartDomElement.expensePrice.innerHTML = price.total;
    cartDomElement.totalPrice.innerHTML = price.total + price.shipment;
    price.payment = price.total + price.shipment;
}


function generateDesktopTemplate(product){
    let cartHTML = `
    <div class="desktop-cart-product">
        <div class="desktop-column-left">
            <img src="${product.main_image}">
            <div class="desktop-product">
                <div class="desktop-product-name">
                    ${product.name}
                </div>
                <div class="desktop-product-id">
                    ${product.id}
                </div>
                <div class="desktop-product-color">
                    <div class="desktop-product-color-name">
                        顏色
                    </div>
                    <div class="desktop-product-color-line">
                        |
                    </div>
                    <div class="desktop-product-color-color">
                        ${product.color.name}
                    </div>
                </div>
                <div class="desktop-product-size">
                    <div class="desktop-product-size-name">
                        尺寸
                    </div>
                    <div class="desktop-product-size-line">
                        |
                    </div>
                    <div class="desktop-product-size-size">
                        ${product.size}
                    </div>
                </div>
            </div>
        </div>
        <div class="desktop-column-right">
            <div class="desktop-column-right-quantity">
                <select name="quantity" class="selectField" data-id="${product.id}" data-color="${product.color.name}" data-size="${product.size}">
                    ${generateSelectQuantity(product.stock, product.qty)}
                </select>
            </div>
            <div class="desktop-column-right-price">
                NT. ${product.price}
            </div>
            <div class="desktop-column-right-account" data-id="${product.id}" data-price="${product.price}">
                NT. ${product.price * product.qty}
            </div>
            <div class="desktop-column-right-trash">
                <i class="fas fa-trash-alt" data-id="${product.id}" data-color="${product.color.name}" data-size="${product.size}"></i>
            </div>
        </div>
    </div>
    `
    desktopCartProduct.innerHTML += cartHTML;
    cartDomElement.selectField = document.querySelectorAll('.selectField');
    cartDomElement.selectAccount = document.querySelectorAll('.desktop-column-right-account');
    price.total += Number(product.price) * Number(product.qty);
    cartDomElement.expensePrice.innerHTML = price.total;
    cartDomElement.totalPrice.innerHTML = price.total + price.shipment;
    price.payment = price.total + price.shipment;
}


function generateSelectQuantity(stock, quantity){
    let selectHTML = '';
    for(let i = 1;i <= Number(stock);i++){
        if(Number(quantity) === i){
            selectHTML += `
                <option value="${i}" class="selectOption" selected>${i}</option>
            `
        }else{
            selectHTML += `
                <option value="${i}" class="selectOption">${i}</option>
            `
        }
    }
    return selectHTML;
}


function changeStorageItem(selectProduct, quantity){
    let storageList = JSON.parse(localStorage.getItem('cart'));
    let cartList = storageList.order.list;
    price.total = 0;
    cartList.map(product => {
        if(product.id === Number(selectProduct.id) && product.color.name === selectProduct.color && product.size === selectProduct.size){
            product.qty = quantity;
        }
    })
    storageList.order.list = cartList;
    cartList.forEach(product => {
        price.total += product.price * product.qty;
    })
    localStorage.setItem('cart', JSON.stringify(storageList));
    cartDomElement.expensePrice.innerHTML = price.total;
    cartDomElement.totalPrice.innerHTML = price.total + price.shipment;
    price.payment = price.total + price.shipment;
}


function removeStorageItem(productId){
    let storageList = JSON.parse(localStorage.getItem('cart'));
    let cartList = storageList.order.list;
    cartList.forEach(product => {
        if(product.id === Number(productId)){
            cartList.splice(cartList.indexOf(product), 1);
            price.total -= product.price * product.qty;
        }
    })
    storageList.order.list = cartList;
    localStorage.setItem('cart', JSON.stringify(storageList));
    cartDomElement.desktopQtyField.innerHTML = `購物車(${cartList.length})`;
    cartDomElement.mobileQtyField.innerHTML = `購物車(${cartList.length})`;
    cartDomElement.expensePrice.innerHTML = price.total;
    cartDomElement.totalPrice.innerHTML = price.total + price.shipment;
    price.payment = price.total + price.shipment;
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


window.addEventListener('load', function(){
    const cartDesktopCount = document.querySelector('.desktop-nav-cart-count');
    const cartMobileCount = document.querySelector('.mobile-nav-cart-count');
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart){
        cartDesktopCount.innerHTML = cart.order.list.length;
        cartMobileCount.innerHTML = cart.order.list.length;
    }
    getLocalstorageItems();
})

navbar.addEventListener('click', function(event){
    if(event.target.matches('.member-img') || event.target.matches('.member-word')){
        checkLoginState();
    }
})

mobileSearchBtn.addEventListener('click', function(){
    mobileSearchBar.parentElement.classList.toggle('search-input-field-show');
})

//remove 
desktopCartProduct.addEventListener('click', function(event){
    if(event.target.matches('.fa-trash-alt') && window.confirm('You sure want to delete?')){
        event.target.parentElement.parentElement.parentElement.remove();
        removeStorageItem(event.target.dataset.id);
        const cartDesktopCount = document.querySelector('.desktop-nav-cart-count');
        const cartMobileCount = document.querySelector('.mobile-nav-cart-count')
        const cart = JSON.parse(localStorage.getItem('cart'));
        if(cart){
            cartDesktopCount.innerHTML = cart.order.list.length;
            cartMobileCount.innerHTML = cart.order.list.length;
        }
    }
})

//remove mobile
mobileProduct.addEventListener('click', function(event){
    if(event.target.matches('.fa-trash-alt') && window.confirm('You sure want to delete?')){
        event.target.parentElement.parentElement.parentElement.parentElement.remove();
        removeStorageItem(event.target.dataset.id);
    }
})

//change quantity desktop
desktopCartProduct.addEventListener('change', function(event){
    if(event.target.matches('.selectField')){
        const selectedQty = event.target.options[event.target.selectedIndex].value;
        const price = event.target.parentElement.nextElementSibling.innerHTML.split('.')[1];
        event.target.parentElement.nextElementSibling.nextElementSibling.innerHTML = 'NT. ' + Number(price) * Number(selectedQty);
        changeStorageItem(event.target.dataset, selectedQty);
    }
})

//change quantity mobile
mobileProduct.addEventListener('change', function(event){
    if(event.target.matches('.selectField')){
        const selectedQty = event.target.options[event.target.selectedIndex].value;
        const price = event.target.parentElement.parentElement.nextElementSibling.children[1].innerHTML.split('.')[1];
        event.target.parentElement.parentElement.nextElementSibling.nextElementSibling.children[1].innerHTML = 'NT. ' + Number(price) * Number(selectedQty);
        changeStorageItem(event.target.dataset, selectedQty);
    }
})

//name input
cartDomElement.nameInput.addEventListener('input', function(){
    userInfo.name = cartDomElement.nameInput.value;
})

//email input
cartDomElement.emailInput.addEventListener('input', function(){
    userInfo.email = cartDomElement.emailInput.value;
})

//phone input
cartDomElement.phoneInput.addEventListener('input', function(){
    userInfo.phone = cartDomElement.phoneInput.value;
})

//address input
cartDomElement.addressInput.addEventListener('input', function(){
    userInfo.address = cartDomElement.addressInput.value;
})

//tappay
// 選填 CCV Example
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: '後三碼'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

function onSubmit(event) {
    const loader = document.getElementById('loader');
    event.preventDefault();
    loader.style.display = 'block';
    if(cartDomElement.nameInput.value === '' || cartDomElement.phoneInput.value === '' || cartDomElement.addressInput.value === ''){
        window.alert('Please fill all the blanks.');
        loader.style.display = 'none';
        return 
    }
    
    userInfo.deliveryTime = cartDomElement.timeInput;

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg)
            return
        }
        console.log('get prime 成功，prime: ' + result.card.prime);
        checkoutAPI(result.card.prime);
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}


function checkoutAPI(prime){
    const storageList = JSON.parse(localStorage.getItem('cart'));
    const userList = JSON.parse(localStorage.getItem('user'));
    const fbAccessToken = userList.accessToken || '';
    storageList.prime = prime;
    storageList.order.payment = 'credit_card';
    storageList.order.subtotal = price.total;
    storageList.order.total = price.payment;
    storageList.order.recipient.name = userInfo.name;
    storageList.order.recipient.email = userInfo.email;
    storageList.order.recipient.phone = userInfo.phone;
    storageList.order.recipient.address = userInfo.address;
    storageList.order.recipient.time = userInfo.deliveryTime;

    fetch("https://api.appworks-school.tw/api/1.0/order/checkout", {
        body: JSON.stringify(storageList), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
          'user-agent': 'Mozilla/4.0 MDN Example',
          'content-type': 'application/json',
          'Authorization': fbAccessToken
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log('Success:', response);
        localStorage.removeItem('cart');
        loader.style.display = 'none';
        window.alert('Payment success');
        window.location.href = `./thankyou.html?number=${response.data.number}`;
      });
}

cartDomElement.submitBtn.addEventListener('click', onSubmit);



















