"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/* ===================== Functions ===================== */
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



// Reset form
export function resetForm(formSelector, formMessageSelector, formInvalidClassName) {
   const form = $(formSelector);
   // reset validate
   form.querySelectorAll(formMessageSelector).forEach(item => {
      item.innerHTML = '';
   })
   Array.from(form.getElementsByClassName(formInvalidClassName)).forEach(item => {
      item.classList.remove(formInvalidClassName)
   })
   // reset value
   form.querySelectorAll('input').forEach(item => {
      item.value = '';
   })
   form.querySelectorAll('input[type="checkbox"]').forEach(item => {
      item.checked = false;
   })
}

// Form Validate

export function formValidate(options) {
   const form = $(options.formSelector);
   function validate(rule) {
      const errorMessage = rule.test($(rule.selector).value);
      if(errorMessage) {
         const formGroup = $(rule.selector).closest(options.formGroupSelector);
         const formMessage = formGroup.querySelector(options.formMessageSelector);

         formGroup.classList.add(options.formInvalidClassName);
         formMessage.innerHTML = errorMessage;
      }
   }

   // On blur
   options.rules.forEach(rule => {
      $(rule.selector).onblur = () => {
         validate(rule);
      }
   })

   // On input
   options.rules.forEach(rule => {
      $(rule.selector).oninput = () => {
         const formGroup = $(rule.selector).closest(options.formGroupSelector);
         const formMessage = formGroup.querySelector(options.formMessageSelector);

         formGroup.classList.remove(options.formInvalidClassName);
         formMessage.innerHTML = ``;
      }
   })

   // On submit
   form.onsubmit = e => {
      e.preventDefault();
      options.rules.forEach(rule => {
         validate(rule)
      })
      const isValidForm = form.getElementsByClassName(options.formInvalidClassName).length === 0;
      if(isValidForm) {
         const formResult = {}
         form.querySelectorAll('input').forEach(item => {
            if(item.type === 'checkbox') 
               formResult[item.name] = item.checked;
            else
               formResult[item.name] = item.value;
         })
         options.submit(formResult);
      }
      
   }

}



// Validate object function

export const validate = {
   isRequired(selector, message) {
      return {
         selector,
         test(value) {
            return value ? undefined : message || "Please fill this field";
         }
      }
   },

   minLength(selector, min, message) {
      return {
         selector,
         test(value) {
            return value.length >= min ? undefined : message || `Please enter at least ${min} characters `
         }
      }
   },

   isEmail(selector, message) {
      return {
         selector,
         test(value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please enter a valid email address';
         }
      };
   },

   isConfirmed(selector, confirmSelector, message) {
      return {
         selector,
         test: function (value) {
            const confirmValue = $(confirmSelector).value;
            return value === confirmValue ? undefined : message || 'The entered value does not match';
         }
      }
   },

   isChecked(selector, message) {
      return {
         selector,
         test: function (value) {
            return $(selector).checked === true ? undefined : message || 'Please check this field ';
         }
      }
   }
   

}



