"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import { loader } from './lib.js';

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
         if(typeof callback === "function")
            callback(foodContainer);
      }
      catch(err) {
         console.error(err);
      }
   }

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

      

      

      // Init
      init() {
         const categoryItemActived = $('.menu__category-item.menu__category-item--actived');

         loadFoods(`${api}foods`, foodContainer => {
            const foodType = categoryItemActived.dataset.foodtype;
            displayFoods(foodContainer[foodType]);
         }, '.food-container .row');

         $('.order__container').innerHTML = ``;
      }
      
      

   }
})();


app.init();
console.log(app);

const a = "asdas"