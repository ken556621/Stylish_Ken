 const profileField = document.getElementById('profileField');


function generateProfileTemplate(){
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const profileHTML = `
        <img src="${userInfo.photo}" alt="profile-img">
        <div class="profile-name">
            ${userInfo.name}
        </div>
        <div class="profile-email">
            ${userInfo.email}
        </div>
    `
    profileField.innerHTML = profileHTML;
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
      userInfo.accessToken = response.authResponse.accessToken;   
      if (response.status === "connected") {
        FB.api("/me", "POST", {
          "fields": "id,name,email,picture"
        }, function(res) {
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
    generateProfileTemplate();
})

navbar.addEventListener('click', function(event){
    if(event.target.matches('.member-img') || event.target.matches('.member-word')){
        checkLoginState();
    }
})
