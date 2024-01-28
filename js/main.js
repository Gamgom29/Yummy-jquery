/// <reference types="../@types/jquery" />

let mainscreen = document.querySelector('.main-screen');
let secscreen = $('.sec-loading-screen');
let inputArea = document.querySelector('#search-frm');
let leftside = $('.leftside-nav');
let navIcon = $('.rightside-nav .icon');
let rightside = $('.rightside-nav');

$(document).ready(function(){
    searchByName("").then(function(){
        $('.loadingscreen').fadeOut(500);
        $('body').css('overflow' , 'visible');
    })

});

$('.logo-ico').on('click' , function (){
    inputArea.classList.add('d-none');
    defaultDisplay();
});
function navAnimation(){
    leftside.animate({width : 'toggle'},500,function(){
        if(rightside.offset().left == 0 ){
            navIcon.removeClass('fa-xmark');
            navIcon.addClass('fa-bars')
        }
        else {
            navIcon.addClass('fa-xmark');
            navIcon.removeClass('fa-bars');
        }
    })
}
$('.rightside-nav .icon').on('click' , function(){
   navAnimation();
});
let catresult;
async function getcategories(){
    $('.loadingscreen').fadeIn(500);
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    catresult = await response.json();
    displaycat();
    $('.loadingscreen').fadeOut(500);
};


function displaycat(){
    let content = ``;
    for (let i = 0; i < catresult.categories.length; i++) {
        content+=`
        <div class="col-md-3">
        <div onclick="getMeals('${catresult.categories[i].strCategory}');" class="rounded-3 cat-item position-relative overflow-hidden">
        <div class="cat-item-layer text-center p-2">
        <h5>${catresult.categories[i].strCategory}</h5>
        <p>${catresult.categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
        <img class="w-100" src="${catresult.categories[i].strCategoryThumb}"></div>
        </div>
        `; 
    }
    mainscreen.innerHTML = content ;
}

let catebtn = $('#categories');
catebtn.on('click' , function (){
    inputArea.classList.add('d-none');
    getcategories();
    navAnimation();
});
let meals;
async function getMeals(category){
    $('.loadingscreen').fadeIn(500);
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    meals = await response.json();
    displayMeals(meals);
    $('.loadingscreen').fadeOut(500);
}
function displayMeals(meal){
    let content = ``;
    let size = meal.meals.length;
    if(size > 20){
        size = 20;
    }
    for (let i = 0; i < size; i++) {
        content+= `
        <div class="col-md-3">
        <div class="rounded-3 cat-item position-relative overflow-hidden">
        <div onclick="itemIngredients('${meal.meals[i].idMeal}')" class="cat-item-layer d-flex align-items-center justify-content-center p-2">
        <h5>${meal.meals[i].strMeal}</h5>
        </div>
        <img class="w-100" src="${meal.meals[i].strMealThumb}"></div>
        </div>
        `
    };
    console.log(meals);
    mainscreen.innerHTML = content ;
}
let ingredients ;
async function itemIngredients (id){
    $('.loadingscreen').fadeIn(500);
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    ingredients = await response.json();
    displayIngre();
    $('.loadingscreen').fadeOut(500);
}
function displayIngre(){
    let content = ``;
    let ing = ``;
    let tags = ingredients.meals[0].strTags?.split(",");
    if(!tags)tags = [];
    console.log(tags);
    let tag = ``;
    for (let i = 0; i < tags.length; i++) {
        tag+=`<li class="alert alert-warning m-2 p-1">${tags[i]}</li>`;
    }
    for (let i = 1; i <=20; i++) {
        if(ingredients.meals[0][`strIngredient${i}`]){
            ing+=`<li class="alert alert-info m-2 p-1">${ingredients.meals[0][`strMeasure${i}`]} ${ingredients.meals[0][`strIngredient${i}`]}</li>`;
        }
    }
    content+=`
    <div class="col-md-4">
    <div class=" py-3 d-flex flex-column">
    <img class="w-100" src = "${ingredients.meals[0].strMealThumb}">
    <h3 class="mt-3 text-white text-center">${ingredients.meals[0].strMeal}</h3>
    </div>
    
    </div>
    <div class="col-md-8">
    <div class="  text-white">
    <h3>Instrunctions</h3>
    <p>${ingredients.meals[0].strInstructions.split(" ").slice(0,300).join(" ")}</p>
    <h4>Area : ${ingredients.meals[0].strArea}</h4>
    <h4>Category : ${ingredients.meals[0].strCategory}</h4>
    <h4>Recipes :</h4>
    <ul id="recipes" class=" d-flex list-unstyled g-3 flex-wrap">
    ${ing}
    </ul>
    <h4>Tags :</h4>
    <ul class=" list-unstyled d-flex">
    ${tag}
    </ul>
    <a target="_blank" href="${ingredients.meals[0].strSource}" class="btn text-decoration-none btn-success">source</a>
    <a target="_blank" href="${ingredients.meals[0].strYoutube}" class="btn text-decoration-none btn-danger">Youtube</a>
    </div>
    
    </div>
    `;
    mainscreen.innerHTML = content ;
    console.log(ingredients.meals[0]);
}

$('#search').on('click', function(){
    let content = ` 
    <input id="srchByName" type="text" class="form-control" placeholder="Search by name">
    <input id="srchByLetter" type="text" class="form-control" placeholder="Search by First Letter">`;
    inputArea.classList.remove('d-none');
    inputArea.innerHTML = content;
    mainscreen.innerHTML = ""
    navAnimation();
    let s = $('#srchByName');
    s.on('input' , function(){
        searchByName(s.val());
    })
    let f =$('#srchByLetter');
    f.on('input' , function (){
        searchByLetter(f.val());
    });
});

async function searchByName(mealName){
    $('.loadingscreen').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`);
    meals = await response.json();
    displayMeals(meals);
    $('.loadingscreen').fadeOut(500);
}

async function searchByLetter(mealletter){
    $('.loadingscreen').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${mealletter}`);
    meals = await response.json();
    displayMeals(meals);
    $('.loadingscreen').fadeOut(500);
}

$('#area').on('click',function(){
    inputArea.classList.add('d-none');
    getArea();
    navAnimation();
});
let Area ;
async function getArea(){
    $('.loadingscreen').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    Area = await response.json();
    displayAreas();
    $('.loadingscreen').fadeOut(500);
}
function  displayAreas() {
    let cartona = ``;
    for (let i = 0; i < Area.meals.length; i++) {
        cartona+= `
        <div onclick ="filterByArea('${Area.meals[i].strArea}')" class="col-md-3 text-center text-white area-box">
        <i class="fa-solid fa-house ar-icon"></i>
        <h4>${Area.meals[i].strArea}</h4>
        </div>
        `;
        mainscreen.innerHTML = cartona;
    }
}

async function filterByArea (area){
    $('.loadingscreen').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    meals = await response.json();
    displayMeals(meals)
    $('.loadingscreen').fadeOut(500);
}
let Ingredient; 
$('#ingredients').on('click' , function(){
    inputArea.classList.add('d-none');
    getIngredients();
    navAnimation();
})
async function getIngredients(){
    // https://www.themealdb.com/api/json/v1/1/list.php?i=list
    $('.loadingscreen').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    Ingredient = await response.json();
    displayIngredients();
    $('.loadingscreen').fadeOut(500);
}
function displayIngredients() {
    let cartona = ``;
    for (let i = 0; i < 30; i++) {
        cartona+= `
        <div onclick ="filterByIngredient('${Ingredient.meals[i].strIngredient}')" class="col-md-3 text-center text-white ingredient-box">
        <i class="fa-solid fa-drumstick-bite ing-icon"></i>
        <h4>${Ingredient.meals[i].strIngredient}</h4>
        </div>
        `;
        mainscreen.innerHTML = cartona;
    }
}
async function filterByIngredient(ing){
// www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
$('.loadingscreen').fadeIn(500);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    meals = await response.json();
    displayMeals(meals);
    $('.loadingscreen').fadeOut(500);
}
$('#Contact').on('click' , function(){
    inputArea.classList.add('d-none');
    navAnimation();
    $('.loadingscreen').fadeIn(500);
    mainscreen.innerHTML = `
    <div class=" d-flex justify-content-center align-items-center min-vh-100 ">
        <div class=" container w-75 text-center">
            <div class=" row g-4">
                <div class=" col-md-6">
                    <input id = "nameInput" class=" form-control" type="text" placeholder = " Enter Your Name">
                    <div id= "nameMsg" class="alert alert-danger mt-2 d-none">Special characters and numbers not allowed</div>
                </div>
                <div class=" col-md-6"> 
                <input id = "emailInput" class=" form-control" type="email" placeholder = " Enter Your Email">
                <div id= "emailMsg" class="alert alert-danger mt-2 d-none">Email not valid *exemple@yyy.zzz</div>
                </div>
                <div class=" col-md-6">
                    <input id = "phoneInput" class=" form-control" type="text" placeholder = " Enter Your phone">
                    <div id= "phoneMsg" class="alert alert-danger mt-2 d-none">Enter valid Phone Number</div>
                </div>
                <div class=" col-md-6">
                    <input id = "ageInput" class=" form-control" type="number" placeholder = " Enter Your Age">
                    <div id= "ageMsg" class="alert alert-danger mt-2 d-none">Enter valid age</div>
                </div>
                <div class=" col-md-6">
                    <input id = "passInput" class=" form-control" type="password" placeholder = " Enter Your Password">
                    <div id= "passMsg" class="alert alert-danger mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*</div>
                </div>
                <div class=" col-md-6">
                    <input id = "repassInput" class=" form-control" type="password" placeholder = " Enter Your Repassword">
                    <div id= "repassMsg" class="alert alert-danger mt-2 d-none">Password not match</div>
                </div>
            </div>
            <button disabled id= "submitBtn" class=" btn btn-outline-danger mt-3">Submit</button>
        </div>
    
    </div>
    `;
    $('.loadingscreen').fadeOut(500);
    let submitBtn = $('#submitBtn');
    let name = $('#nameInput');
    let email = $('#emailInput');
    let phone = $('#phoneInput');
    let age = $('#ageInput');
    let pass =$('#passInput') ;
    let repass = $('#repassInput');
    let nameFocus = false;
    let emailFocus = false;
    let phoneFocus = false ; 
    let ageFocus = false ; 
    let passFocus = false ; 
    let repassFocus = false ; 
    let emailRgx = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let nameRGx = /^[a-z ,.,A-Z'-]+$/;
    let phoneRgx = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    let ageRgx = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
    let passRgx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    name.on('focus , input' , function(){
        nameFocus = true;
        checkValidation();
    });
    email.on('focus , input' , function(){
        emailFocus = true;
        checkValidation();
    });
    phone.on('focus , input' , function(){
        phoneFocus = true;
        checkValidation();
    });
    age.on('focus, input' , function(){
        ageFocus = true;
        checkValidation();
    });
    pass.on('focus, input' , function(){
        passFocus = true;
        checkValidation();
    });
    repass.on('focus, input' , function(){
        repassFocus = true;
        checkValidation();
    });

    function checkValidation(){
        if(nameFocus){
            if(validationInputs(nameRGx , name.val())){
                $('#nameMsg').addClass('d-none');
            }
            else {
                $('#nameMsg').removeClass('d-none');
            }
        }

        if(emailFocus){
            if(validationInputs(emailRgx , email.val())){
                $('#emailMsg').addClass('d-none');
            }
            else {
                $('#emailMsg').removeClass('d-none');
            }
        }
        if(phoneFocus){
            if(validationInputs(phoneRgx , phone.val())){
                $('#phoneMsg').addClass('d-none');
            }
            else {
                $('#phoneMsg').removeClass('d-none');
            }
        }
        if(ageFocus){
            if(validationInputs(ageRgx , age.val())){
                $('#ageMsg').addClass('d-none');
            }
            else {
                $('#ageMsg').removeClass('d-none');
            }
        }
        if(passFocus){
            if(validationInputs(passRgx , pass.val())){
                $('#passMsg').addClass('d-none');
            }
            else {
                $('#passMsg').removeClass('d-none');
            }
        }
        if(repassFocus){
            if(validationInputs(passRgx , repass.val()) && repass.val() == pass.val() ){
                $('#repassMsg').addClass('d-none');
            }
            else {
                $('#repassMsg').removeClass('d-none');
            }
        }

        if(validationInputs(nameRGx , name.val())&&
            validationInputs(emailRgx , email.val())&&
            validationInputs(phoneRgx , phone.val())&&
            validationInputs(ageRgx , age.val())&&
            validationInputs(passRgx , pass.val())&&
            validationInputs(passRgx , repass.val())&&
            pass.val() == repass.val()
        ){
            submitBtn.removeAttr('disabled');
        }
        else {
            submitBtn.attr('disabled' , 'disabled');
        }
    }
})


function validationInputs(Rgx , input){
    return Rgx.test(input);
}