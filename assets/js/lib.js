"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


// Functions
export function loader(parentSelector, isLoading, loaderMessage = "Loading....") {
   if (isLoading === true) {
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
   
};

export function displayElement(element, status = true) {
   if(status) {
      if(element) {
         element.classList.remove('d-none');
         displayElement(element.closest('.d-none'))
      }
   }
   else {
      element.classList.add('d-none');
   }
}
