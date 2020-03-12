const navbar = document.getElementById('navbar');
const bannerField = document.getElementById('bannerField');
const cardField = document.getElementById('cardField');
const footerField = document.getElementById('footerField');

const desktopSearchBar = document.getElementById('desktopSearchBar');
const desktopSearchBtn = document.getElementById('desktopSearchBtn');

const mobileSearchBar = document.getElementById('mobileSearchBar');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');

const paramsString = decodeURI(window.location.href).slice(-2);

const bannerDomElements = {
    bannerOne: '',
    bannerTwo: '',
    bannerThree: '',
    bannerBtnsOne: '',
    bannerBtnsTwo: '',
    bannerBtnsThree: ''
}

const productDomElements = {
    productSelectField: ''
}

const flag = {
    pageState: '',
    nextPage: '',
    slideIndex: 0,
    totalImg: '',
    isLoading: false
}


function getAllItems(){
    fetch('https://api.appworks-school.tw/api/1.0/products/all')
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const allItems = res.data;
        allItems.forEach(product =>{
            generateCardTemplate(product)
        })
        flag.pageState = 'all';
        flag.slideIndex = 0;
        flag.nextPage = res.next_paging;
    }).catch(error => console.log(error));  
}


function getWomenItems(){
    fetch('https://api.appworks-school.tw/api/1.0/products/women')
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const womenCloth = res.data;
        womenCloth.forEach(product =>{
            generateCardTemplate(product)
        })
        flag.pageState = 'women';
        flag.nextPage = res.next_paging || '';
        flag.slideIndex = 0;
    }).catch(error => console.log(error));  
}


function getMenItems(){
    fetch('https://api.appworks-school.tw/api/1.0/products/men')
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const menCloth = res.data;
        menCloth.forEach(product =>{
            generateCardTemplate(product)
        })
        flag.pageState = 'men';
        flag.nextPage = res.next_paging || '';
        flag.slideIndex = 1;
    }).catch(error => console.log(error));  
}


function getAccessoriesItems(){
    fetch('https://api.appworks-school.tw/api/1.0/products/accessories')
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const accessoriesCloth = res.data;
        accessoriesCloth.forEach(product =>{
            generateCardTemplate(product)
        })
        flag.pageState = 'accessories';
        flag.nextPage = res.next_paging || '';
        flag.slideIndex = 2;
    }).catch(error => console.log(error));  
}


function getBannerItems(){
    fetch('https://api.appworks-school.tw/api/1.0/marketing/campaigns')
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const bannerData = res.data;
        let bannerImg_URL = '';
        let story = '';
        const campaignsLength = bannerData.length;
        bannerData.forEach(category => {
            bannerImg_URL = "https://api.appworks-school.tw/" + category.picture;
            story = category.story.replace(/\r\n/g, '<br>');
            generateBannerTemplate(category, bannerImg_URL, story, campaignsLength);
        })
        flag.totalImg = bannerData.length;
        slideImgEffect();
    }).catch(error => console.log(error));  
}


function generateBannerTemplate(campaign, image, word, length){
    const bannerHTML = `
    <div class="banner-container banner-container${campaign.id}" style="background-image: url(${image})">
        <div class="campaign-words">
            <p>${word}</p>
        </div>
        <div class="switch-bannerImg-btns switch-bannerImg-btns${campaign.id}">
            ${generateDot(length)}
        </div>
    </div>
    `
    bannerField.innerHTML += bannerHTML;
    bannerDomElements.bannerOne = document.querySelector('.banner-container1');
    bannerDomElements.bannerTwo = document.querySelector('.banner-container2');
    bannerDomElements.bannerThree = document.querySelector('.banner-container3');
    bannerDomElements.bannerBtnsOne = document.querySelector('.switch-bannerImg-btns1');
    bannerDomElements.bannerBtnsTwo = document.querySelector('.switch-bannerImg-btns2');
    bannerDomElements.bannerBtnsThree = document.querySelector('.switch-bannerImg-btns3');
}


function generateCardTemplate(product){
    const cardsHTML = `
    <div class="card">
        <a href="./views/product.html?id=${product.id}">
            <img src="${product.main_image}" alt="item-img" class="card-image" data-id="${product.id}">
            <div class="item-body">
                <div class="color-field">
                    <div class="color">
                        ${generateColor(product.colors)}
                    </div>
                </div>
                <div class="item-name">
                    ${product.title}
                </div>
                <div class="item-price">
                    TWD.${product.price}
                </div>
            </div>
        </a>
    </div>`
    cardField.innerHTML += cardsHTML;
}


function generateColor(colors){
    let colorBlock = '';
    colors.forEach(color => {
        colorBlock += `
        <div style="background-color:${'#' + color.code}" class="each-color product-color" data-color="${'#' + color.code}">
        </div>
    `
    })
    return colorBlock;
}


function generateDot(campaignsLength){
    let dotHTML = '';
    for(let i = 0;i < campaignsLength;i++){
        dotHTML +=`
            <div class="banner-btn banner-btn-${i}"></div>
        `
    }
    return dotHTML;
}


function errorMessage(product){
    const errorHTML = `
        <h1 class="error-message">
            Sorry, can't find ${product}...
        </h1>
    `
    cardField.innerHTML = errorHTML;
}


function searchByName(searchInput){
    fetch(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${searchInput}`)
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const searchResults = res.data;
        if(searchResults.length === 0){
            errorMessage(searchInput)
        }
        searchResults.forEach(product => {
            generateCardTemplate(product)
        })
        flag.pageState = '';
    }).catch(error => console.log(error)); 
}


function changePage(category, nowPage){
    fetch(`https://api.appworks-school.tw/api/1.0/products/${category}?paging=${nowPage}`)
    .then((response) => {
        return response.json();
    })
    .then((res) => {
        const pageData = res.data;
        pageData.forEach(product =>{
            generateCardTemplate(product)
        });
        if(res.next_paging){
            flag.nextPage = res.next_paging;
        }else if(!res.next_paging){
            flag.pageState = '';
            flag.isLoading = false;
            return
        }
        flag.isLoading = false;
    }).catch(error => console.log(error)); 
}


function slideImgEffect(){
    if(flag.slideIndex > flag.totalImg - 1){
        flag.slideIndex = 0
    }
    switch (flag.slideIndex){
        case 0:
            bannerDomElements.bannerOne.style.display = 'flex';
            bannerDomElements.bannerTwo.style.display = 'none';
            bannerDomElements.bannerThree.style.display = 'none';
            bannerDomElements.bannerBtnsOne.children[0].style.opacity = 1;
            bannerDomElements.bannerBtnsOne.children[1].style.opacity = .5;
            bannerDomElements.bannerBtnsOne.children[2].style.opacity = .5;
            break;
        case 1:
            bannerDomElements.bannerOne.style.display = 'none';
            bannerDomElements.bannerTwo.style.display = 'flex';
            bannerDomElements.bannerThree.style.display = 'none';
            bannerDomElements.bannerBtnsTwo.children[0].style.opacity = .5;
            bannerDomElements.bannerBtnsTwo.children[1].style.opacity = 1;
            bannerDomElements.bannerBtnsTwo.children[2].style.opacity = .5;
            break;
        case 2:
            bannerDomElements.bannerOne.style.display = 'none';
            bannerDomElements.bannerTwo.style.display = 'none';
            bannerDomElements.bannerThree.style.display = 'flex';
            bannerDomElements.bannerBtnsThree.children[0].style.opacity = .5;
            bannerDomElements.bannerBtnsThree.children[1].style.opacity = .5;
            bannerDomElements.bannerBtnsThree.children[2].style.opacity = 1;
            break;
        default:
            console.log('Error');
    }
    flag.slideIndex++
    window.setTimeout(slideImgEffect, 10000);
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
            window.location.href = "./views/profile.html";
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
          window.location.href = "./views/profile.html";
        });
      }
    }, {
        scope: 'email', 
        auth_type: 'rerequest'
      });
}


//預設 
window.addEventListener('load', function(){
    const cartDesktopCount = document.querySelector('.desktop-nav-cart-count');
    const cartMobileCount = document.querySelector('.mobile-nav-cart-count')
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart){
        cartDesktopCount.innerHTML = cart.order.list.length;
        cartMobileCount.innerHTML = cart.order.list.length;
    }
    getBannerItems();
    if(window.location.search === '?tag=women'){
        getWomenItems();
    }else if(window.location.search === '?tag=man'){
        getMenItems();
    }else if(window.location.search === '?tag=accessories'){
        getAccessoriesItems();
    }else if(window.location.search === ''){
        getAllItems();
    }else if(decodeURI(window.location.href).slice(-2) === paramsString){
        searchByName(paramsString);
    }
})

navbar.addEventListener('click', function(event){
    if(event.target.matches('.desktop-nav-women') || event.target.matches('.nav-women')){
        bannerField.style.display = 'flex';
        cardField.style.display = 'flex';
        cardField.innerHTML = '';
        bannerDomElements.bannerOne.style.display = 'flex';
        bannerDomElements.bannerTwo.style.display = 'none';
        bannerDomElements.bannerThree.style.display = 'none';
        bannerDomElements.bannerBtnsOne.children[0].style.opacity = 1;
        bannerDomElements.bannerBtnsOne.children[1].style.opacity = .5;
        bannerDomElements.bannerBtnsOne.children[2].style.opacity = .5;
        getWomenItems();
    }else if(event.target.matches('.desktop-nav-man') || event.target.matches('.nav-man')){
        bannerField.style.display = 'flex';
        cardField.style.display = 'flex';
        cardField.innerHTML = '';
        bannerDomElements.bannerOne.style.display = 'none';
        bannerDomElements.bannerTwo.style.display = 'flex';
        bannerDomElements.bannerThree.style.display = 'none';
        bannerDomElements.bannerBtnsTwo.children[0].style.opacity = .5;
        bannerDomElements.bannerBtnsTwo.children[1].style.opacity = 1;
        bannerDomElements.bannerBtnsTwo.children[2].style.opacity = .5;
        getMenItems();
    }else if(event.target.matches('.desktop-nav-accessories') || event.target.matches('.nav-accessories')){
        bannerField.style.display = 'flex';
        cardField.style.display = 'flex';
        cardField.innerHTML = '';
        bannerDomElements.bannerOne.style.display = 'none';
        bannerDomElements.bannerTwo.style.display = 'none';
        bannerDomElements.bannerThree.style.display = 'flex';
        bannerDomElements.bannerBtnsThree.children[0].style.opacity = .5;
        bannerDomElements.bannerBtnsThree.children[1].style.opacity = .5;
        bannerDomElements.bannerBtnsThree.children[2].style.opacity = 1;
        getAccessoriesItems();
    }else if(event.target.matches('.desktop-logo') || event.target.matches('.mobile-logo')){
        bannerField.style.display = 'flex';
        cardField.style.display = 'flex';
        cardField.innerHTML = '';
        getAllItems();
    }else if(event.target.matches('.member-img') || event.target.matches('.member-word')){
        checkLoginState();
    }
})

//desktop search
desktopSearchBtn.addEventListener('click', function(event){
    if(desktopSearchBar.value === ''){
        window.alert('Maybe you would like to type something!');
        return
    }
    bannerField.style.display = 'flex';
    cardField.style.display = 'flex';
    cardField.innerHTML = '';
    searchByName(desktopSearchBar.value);
})

desktopSearchBar.addEventListener('keypress', function(event){
    if(event.keyCode === 13 && desktopSearchBar.value === ''){
        window.alert('Maybe you would like to type something!');
        return
    }else if(event.keyCode === 13 && desktopSearchBar.value !== 0){
        bannerField.style.display = 'flex';
        cardField.style.display = 'flex';
        cardField.innerHTML = '';
        searchByName(desktopSearchBar.value);
    }
})

//mobile search
mobileSearchBtn.addEventListener('click', function(){
    mobileSearchBar.parentElement.classList.toggle('search-input-field-show');
})

mobileSearchBar.addEventListener('keypress', function(event){
    if(event.keyCode === 13 && mobileSearchBar.value === ''){
        window.alert('Maybe you would like to type something!');
        return
    }else if(event.keyCode === 13 && mobileSearchBar.value !== 0){
        bannerField.style.display = 'flex';
        cardField.style.display = 'flex';
        cardField.innerHTML = '';
        searchByName(mobileSearchBar.value);
    }
})

//scroll 
window.addEventListener('scroll', function(){
    if(footerField.getBoundingClientRect().top < (window.innerHeight * 0.9) && flag.pageState !== '' && flag.nextPage !== ''){
        if(!flag.isLoading){
            window.requestAnimationFrame(function(){
                changePage(flag.pageState, flag.nextPage);
                flag.isLoading = true;
            });
        }
    }
})

//banner image change
bannerField.addEventListener('click', function(event){
    if(event.target.matches('.banner-btn-0')){
        bannerDomElements.bannerOne.style.display = 'flex';
        bannerDomElements.bannerTwo.style.display = 'none';
        bannerDomElements.bannerThree.style.display = 'none';
        bannerDomElements.bannerBtnsOne.children[0].style.opacity = 1;
        bannerDomElements.bannerBtnsOne.children[1].style.opacity = .5;
        bannerDomElements.bannerBtnsOne.children[2].style.opacity = .5;
    }else if(event.target.matches('.banner-btn-1')){
        bannerDomElements.bannerOne.style.display = 'none';
        bannerDomElements.bannerTwo.style.display = 'flex';
        bannerDomElements.bannerThree.style.display = 'none';
        bannerDomElements.bannerBtnsTwo.children[0].style.opacity = .5;
        bannerDomElements.bannerBtnsTwo.children[1].style.opacity = 1;
        bannerDomElements.bannerBtnsTwo.children[2].style.opacity = .5;
    }else if(event.target.matches('.banner-btn-2')){
        bannerDomElements.bannerOne.style.display = 'none';
        bannerDomElements.bannerTwo.style.display = 'none';
        bannerDomElements.bannerThree.style.display = 'flex';
        bannerDomElements.bannerBtnsThree.children[0].style.opacity = .5;
        bannerDomElements.bannerBtnsThree.children[1].style.opacity = .5;
        bannerDomElements.bannerBtnsThree.children[2].style.opacity = 1;
    }
})










