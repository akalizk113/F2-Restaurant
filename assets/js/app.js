"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = (() => {
   return {
      isLogin: false,
      foodContainer: [],
      commonApi: `https://desolate-ocean-13885.herokuapp.com/https://ptanhfoodsapi.herokuapp.com/foods/`,

      // Cookie
      setCookie(data) {
         document.cookie = data;
      },

      getCookie() {
         return document.cookie;
      },

      // Loader
      loader(parentSelector, isLoading, loaderMessage = "Loading....") {
         if (isLoading) {
            parentSelector.innerHTML = `
            <div class="loader">
               <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
                  <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round" />
                  <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round" />
                  <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round" />
                  <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round" />
               </svg>

               <span class="loader-desc">${loaderMessage}</span>
            </div>
            `
         }
      },

      // Render & Display
      async loadFoods(apis, callback) {
         try {
            if(Array.isArray(apis)) {
               this.foodContainer = [];
               for (const api of apis ) {
                  const res = await fetch(api)
                  foodsContainer.push(...await res.json())
               }
            }
            else {
               const res = await fetch(apis);
               this.foodContainer = await res.json();
            }
            if(typeof callback === "function")
               callback(this.foodContainer);
         }
         catch(err) {
            console.error(err);
         }
      },

      displayFoodContainer(foods) {
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
      },

      // Init
      init() {
         const categoryItemActived = $('.menu__category-item.menu__category-item--actived');
         
         this.loadFoods(`${this.commonApi}${categoryItemActived.dataset.foodtype}`, this.displayFoodContainer);
      }


   }
})();


// app.loader($('.food-container'), true);
app.init();
