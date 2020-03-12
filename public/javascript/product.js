const navbar = document.getElementById('navbar');
const productField = document.getElementById('productField');
const footerField = document.getElementById('footerField');

const desktopSearchBar = document.getElementById('desktopSearchBar');
const desktopSearchBtn = document.getElementById('desktopSearchBtn');

const mobileSearchBar = document.getElementById('mobileSearchBar');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');

const cartDesktopCount = document.querySelector('.desktop-nav-cart-count');
const cartMobileCount = document.querySelector('.mobile-nav-cart-count')

const productID = window.location.search.slice(4);

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

const choice = {
        id: '',
        main_image: '',
        name: '',
        price: '',
        color: {
            code: '',
            name: ''
        },
        size: '',
        stock: '',
        qty: ''
    }

const productDomElements = {
    productSelectField: '',
    size: '',
    sizes: '',
    color: '',
    productCount: '',
    selectProductBtn: ''
}


function generateProductTemplate(product, words){
    const productHTML = `
    <div class="product-details-container">
        <div class="product-img">
            <img src="${product.main_image}" alt="product-img">
        </div>
        <div class="product-demo-select" id="productSelectField">
            <div class="product-title">
                ${product.title}
            </div>
            <div class="product-number">
                ${product.id}
            </div>
            <div class="product-price">
                TWD.${product.price}
            </div>
            <div class="product-colors">
                <div class="product-color-name">
                    顏色
                </div>
                <div class="product-line">
                    |
                </div>
                ${generateColor(product.colors)}
            </div>
            <div class="product-sizes">
                <div class="product-sizes-name">
                    尺寸
                </div>
                <div class="product-line">
                    |
                </div>
                <div class="product-sizes-size">
                    ${generateSize(product.sizes)}
                </div>
            </div>
            <div class="select-field">
                <div class="desktop-count">
                    <div class="product-count-name">
                        數量
                    </div>
                    <div class="product-line">
                        |
                    </div>
                </div>
                <div class="select-field-bar">
                    <div class="minus" id="minus">
                        -
                    </div>
                    <div class="product-count" id="productCount">
                        1
                    </div>
                    <div class="plus" id="plus">
                        +
                    </div>
                </div>
            </div>
            <button type="button" class="select-size-btn">
                加入購物車
            </button>
            <div class="warning">
                <p>*${product.note}</p>  
            </div>
            <div class="composition">
                <p>組成: ${product.texture}</p>
                <p>${words}</p>
                <p>清潔方式: ${product.wash}</p>
            </div>
            <div class="makefrom">
                <p>素材產地 / ${product.place}</p>
                <p>加工產地 / ${product.place}</p>
            </div>
        </div>
        <div class="details">
            <div class="more-detail">
                <div class="detail-title-line">
                    <div class="detail-title">
                        細部說明
                    </div>
                </div>
                <p>
                    ${product.story}
                </p>
                <div class="detail-product-img">
                    <img src="${product.images[0]}" alt="detail-product-img">
                </div>
                <p>
                    ${product.story}
                </p>
                <div class="detail-product-img">
                    <img src="${product.images[1]}" alt="detail-product-img">
                </div>
            </div>
        </div>
    </div>
    `
    productField.innerHTML = productHTML;
    productDomElements.productSelectField = document.getElementById('productSelectField');
}


function generateColor(colors){
    let colorBlock = '';
    colors.forEach(color => {
        colorBlock += `
        <div style="background-color:${'#' + color.code}" class="each-color product-color" data-color="${color.code}" data-name="${color.name}">
        </div>
    `
    })
    return colorBlock;
}

function generateSize(sizes){
    let sizeHTML = '';
    sizes.forEach(size => {
        sizeHTML += `
        <p class="product-each-size" id="${size}" data-size="${size}">${size}</p>
    `
    })
    return sizeHTML;
}


function getProductDetails(productId){
    fetch(`https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`)
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const productDetail = res.data;
        const description = productDetail.description.replace(/\r\n/, '<br>');
        generateProductTemplate(productDetail, description);
        productSelect(productDetail);
    }).catch(error => console.log(error));  
}


function productSelect(product){
    productDomElements.color = document.querySelectorAll('.product-color');
    productDomElements.sizes = document.querySelectorAll('.product-each-size');
    productDomElements.productCount = document.getElementById('productCount');
    productDomElements.selectProductBtn = document.querySelector('.select-size-btn');
    const stocks = product.variants.filter(product => product.stock)
    const emtyStocks = product.variants.filter(product => product.stock === 0);
    let chosenProduct = '';
    productDomElements.productSelectField.addEventListener('click', function(event){
        stocks.forEach(product => {
            if(event.target.matches('.product-color')){
                productDomElements.color.forEach(eachColor => eachColor.classList.remove('product-color-selected'));
                productDomElements.sizes.forEach(eachSize => eachSize.classList.remove('product-sizes-size-emty'));
                event.target.classList.toggle('product-color-selected');
                choice.color.code = event.target.dataset.color;
                choice.color.name = event.target.dataset.name;
                productDomElements.productCount.innerHTML = 1;
            }
            if(event.target.matches('.product-each-size') && !event.target.matches('.product-sizes-size-emty')){
                productDomElements.sizes.forEach(eachSize => eachSize.classList.remove('product-sizes-size-selected'));
                event.target.classList.toggle('product-sizes-size-selected');
                choice.size = event.target.dataset.size;
                productDomElements.productCount.innerHTML = 1;
            }
        })
        //emty size  
        emtyStocks.forEach(product => {
            if(event.target.matches(`[data-color="${product.color_code}"]`)){
                productDomElements.size = document.getElementById(product.size);
                productDomElements.size.classList.add('product-sizes-size-emty');
                if(productDomElements.size.matches('.product-sizes-size-selected')){
                    choice.size = '';
                    productDomElements.size.classList.remove('.product-sizes-size-selected');
                }
                productDomElements.productCount.innerHTML = 1;
            }
        })
        //plus minus check
        if(event.target.matches('.plus') && choice.color.code !== '' && choice.size !== ''){
            chosenProduct = stocks.filter(product => product.color_code === choice.color.code && product.size === choice.size);
            if(productDomElements.productCount.innerHTML < chosenProduct[0].stock){
                productDomElements.productCount.innerHTML++;
            }
        }
        if(event.target.matches('.minus') && choice.color.code !== '' && choice.size !== '' && productDomElements.productCount.innerHTML > 1){
            productDomElements.productCount.innerHTML--;
        }
        if(choice.color.code === '' || choice.size === ''){
            productDomElements.productCount.innerHTML = 0;
            productDomElements.selectProductBtn.classList.add('select-size-btn-hide');
        }else{
            productDomElements.selectProductBtn.classList.remove('select-size-btn-hide');
        }
        //store to localstorage
        if(event.target.matches('.select-size-btn') && choice.color.code !== '' && choice.size !== ''){
            storeLocalStorage(product);
        }else if(event.target.matches('.select-size-btn')){
            window.alert('Please select color or size');
        }
    })
}

function storeLocalStorage(product){
    //儲存每次選擇
    choice.id = product.id;
    choice.main_image = product.main_image;
    choice.name = product.title;
    choice.price = product.price;
    product.variants.forEach(variant => {
        if(variant.color_code === choice.color.code && variant.size === choice.size){
            choice.stock = variant.stock;
        }
    });
    choice.qty = productDomElements.productCount.innerHTML;

    //每次存之前更新 cart 的資料 + 確認是否為同一筆
    cart = JSON.parse(localStorage.getItem('cart')) || cart;
    let sameChoice = '';

    sameChoice = cart.order.list.filter(list => list.name === choice.name && list.color.name === choice.color.name && list.size === choice.size);
    let index = cart.order.list.indexOf(sameChoice[0])
    if(sameChoice.length !== 0){
        cart.order.list[index].qty = choice.qty;
        localStorage.setItem('cart', JSON.stringify(cart));
    }else{
        cart.order.list.push(choice);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    //顯示於購物車上
    cartDesktopCount.innerHTML = cart.order.list.length;
    cartMobileCount.innerHTML = cart.order.list.length;

    window.alert('Add to the cart');
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
    //每次載入頁面之前更新 cart 的資料
    cart = JSON.parse(localStorage.getItem('cart')) || cart;
     //顯示於購物車上
    cartDesktopCount.innerHTML = cart.order.list.length;
    cartMobileCount.innerHTML = cart.order.list.length;
    getProductDetails(productID);
})

mobileSearchBtn.addEventListener('click', function(){
    mobileSearchBar.parentElement.classList.toggle('search-input-field-show');
})

navbar.addEventListener('click', function(event){
    if(event.target.matches('.member-img') || event.target.matches('.member-word')){
        checkLoginState();
    }
})
















