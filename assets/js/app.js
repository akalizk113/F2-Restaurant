"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import {
   loader,
   displayElement,
}
from './lib.js';

const app = (() => {
   let isLoggedIn = false;
   let foodContainer;
   let displayFoodContainer;
   const api = "https://ptanhf2restaurant.herokuapp.com/api/";

   // Functions
   // Render & Display
   async function loadFoods(apis, callback, loaderSelector) {
      try {
         loader($(`${loaderSelector}`), true)
         const res = await fetch(apis);
         foodContainer = await res.json();
         loader($(`${loaderSelector}`), false)
         if (typeof callback === "function")
            callback(foodContainer);
      } catch (err) {
         console.error(err);
      }
   };

   function displayFoods(foods) {
      const rowFoodContainer = $('.food-container > .row');
      const htmlString = foods.map(food => `
      <div class="col-4">
         <div data-foodid="${food.id}" data-foodtype=${food.foodType} class="food">
            <img src="${food.img}" alt=""
               class="food__img">
            <div class="food__contents">
               <div class="food__info">
                  <h3 class="food__info-name">${food.name}</h3>
                  <div class="food__info-rating">
                     <ion-icon name="star"></ion-icon>
                     <ion-icon name="star"></ion-icon>
                     <ion-icon name="star"></ion-icon>
                     <ion-icon name="star"></ion-icon>
                     <ion-icon name="star"></ion-icon>
                  </div>
                  <p class="food__info-price"><span>$</span>${food.price}</p>
               </div>
               <button class="food__contents-add-btn">+</button>
   
            </div>
            <div class="food__favorite-icon">
               <ion-icon name="heart-half"></ion-icon>
            </div>
         </div>
      </div>
      `)
         .join('');
      rowFoodContainer.innerHTML = htmlString;
   };

   return {
      // Cookie
      setCookie(data) {
         document.cookie = data;
      },

      getCookie() {
         return document.cookie;
      },

      // DOM handle
      handleEvent() {
         const orderFoods = $$('.order__food');
         function updateTotalCost() {
            orderFoods.forEach(food => {
               
            })
         }



         // Common
         (function commonHandler() {
            // Auth Requried onclick
            const loginBtnList = $$('.auth-required-login');
            const signupBtnList = $$('.auth-required-signup');

            loginBtnList.forEach(btn => {
               btn.onclick = () => {
                  displayElement($('.login-form-container'));
                  displayElement($('.register-form-container'), false);
               }
            })
            signupBtnList.forEach(btn => {
               btn.onclick = () => {
                  displayElement($('.register-form-container'));
                  displayElement($('.login-form-container'), false);
               }
            })

            // Close Modal
            const closeModalBtn = $('.modal__body-close-btn')
            const modalBody = $('.modal__body');
            const modal = $('.modal');
            closeModalBtn.onclick = () => {
               displayElement(modal, false);
               for (let i = 1; i < modalBody.children.length; i++) {
                  displayElement(modalBody.children[i], false);
               }
            }
         })();

         // Home container
         (function homeMainContainerHandler() {
            // Menu Category onclick
            const menuCategoryList = $$('.menu__category-item');
            menuCategoryList.forEach(item => {
               item.onclick = e => {
                  const itemActived = $('.menu__category-item.menu__category-item--actived');
                  const itemClicked = e.target.closest('.menu__category-item');
                  if (itemActived !== itemClicked) {
                     const foodType = itemClicked.dataset.foodtype;
                     if (itemActived)
                        itemActived.classList.remove('menu__category-item--actived');
                     itemClicked.classList.add('menu__category-item--actived');
                     displayFoodContainer = foodContainer[foodType];
                     displayFoods(displayFoodContainer);
                  } else
                     return;
               }
            })

            // View All onclick
            $('.menu__category-control').onclick = () => {
               displayFoodContainer = [];
               const itemActived = $('.menu__category-item.menu__category-item--actived');
               if (itemActived)
                  itemActived.classList.remove('menu__category-item--actived');
               for (const key in foodContainer) {
                  displayFoodContainer.push(...foodContainer[key]);
               }
               displayFoods(displayFoodContainer);
            }

            // Search Event
            const headerSearchInput = $('.header__search-input')
            headerSearchInput.oninput = e => {
               const filtedFoods = displayFoodContainer.filter(food => 
                  food.name.toLowerCase().includes(`${headerSearchInput.value.toLowerCase()}`))
               displayFoods(filtedFoods);
            }

            // Add food to order
            const foodContainerElement = $('.food-container');
            const orderFoodContainer = $('.order__container');
            foodContainerElement.onclick = e => {
               const addBtnClicked = e.target.closest('.food__contents-add-btn');
               if(addBtnClicked) {
                  const foodClicked = addBtnClicked.closest('.food');
                  const foodExisted = findExistOrderFood(foodClicked.dataset.foodtype, foodClicked.dataset.foodid);
                  if(foodExisted) {

                  }
                  else {
                     const newOrderFood = document.createElement('div');
                     newOrderFood.className = 'order__food';
                     newOrderFood.dataset.foodtype = foodClicked.dataset.foodtype;
                     newOrderFood.dataset.foodid = foodClicked.dataset.foodid;
                     const foodInfo = {
                        img: foodClicked.querySelector('.food__img').src,
                        name: foodClicked.querySelector('.food__info-name').innerText,
                        price: foodClicked.querySelector('.food__info-price').lastChild.textContent,
                     }

                     newOrderFood.innerHTML = `
                     <div class="order__food-img bgc-${orderFoodContainer.childElementCount % 10}">
                        <img src="${foodInfo.img}" alt="">
                     </div>
                     <div class="order__food-info">
                        <h3 class="order__food-info-name">${foodInfo.name}</h3>
                        <div class="order__food-info-amount">
                           <span class="multiple-icon">x</span>
                           <input min="1" max="100" type="number" class="order__food-info-amount-number"
                              value="1">
                           <button class="order__food-delete-btn">Delete</button>
                        </div>
                     </div>
                     <span class="order__food-cost"><span>$</span>${foodInfo.price}</span>
                     `;
                     if(orderFoodContainer.querySelector('.order__food')) 
                        orderFoodContainer.insertBefore(newOrderFood, orderFoodContainer.childNodes[0]);
                     else 
                        orderFoodContainer.appendChild(newOrderFood);
                  }
               }
            }

            function findExistOrderFood(foodType, foodId) {
               const orderFoods = $$('.order__food');
               return Array.from(orderFoods).find(food => food.dataset.foodid == foodId 
                  && food.dataset.foodtype == foodType);
            }

         })();
      },




      // Init
      init() {
         const categoryItemActived = $('.menu__category-item.menu__category-item--actived');

         // Display Init
         loadFoods(`${api}foods`, foodContainer => {
            const foodType = categoryItemActived.dataset.foodtype;

            for( let key in foodContainer) {
               for(let item of foodContainer[key]) {
                  item.foodType = key; 
               }
            }


            displayFoodContainer = foodContainer[foodType]
            displayFoods(displayFoodContainer);
         }, '.food-container .row');

         $('.order__container').innerHTML = ``;

         // Handel Event
         this.handleEvent();

      }



   }
})();


app.init();