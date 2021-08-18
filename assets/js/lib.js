"use strict";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/* ===================== Functions ===================== */
export function loader1(parentSelector, isLoading, loaderMessage = "Loading....") {
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
      `
   }
   
};

export function loader2(parentElement, isLoading, loaderMessage = "Loading....") {
   if (isLoading === true) {
      const loaderElement = document.createElement('div');
      loaderElement.className = 'loader'
      loaderElement.innerHTML =
         `
      <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
            <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round" />
            <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round" />
            <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round" />
            <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round" />
         </svg>

         <span class="loader-desc">${loaderMessage}</span>
      `
      parentElement.classList.add('pos-relative');
      parentElement.classList.add('o-hidden');
      parentElement.appendChild(loaderElement);
      loaderElement.classList.add('loader--2')
   } else {
      parentElement.classList.remove('pos-relative');
      parentElement.classList.remove('o-hidden');
      parentElement.querySelector('.loader').remove();
   }

};

export function displayElement(element, status = true) {
   if (status) {
      if (element) {
         element.classList.remove('d-none');
         displayElement(element.closest('.d-none'))
      }
   } else {
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

export function FormValidate(options) {
   const form = $(options.formSelector);

   function validate(rule) {
      const errorMessage = rule.test($(rule.selector).value);
      if (errorMessage) {
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
      if (isValidForm) {
         const formResult = {}
         form.querySelectorAll('input').forEach(item => {
            if (item.type === 'checkbox')
               formResult[item.name] = item.checked;
            else
               formResult[item.name] = item.value;
         })
         options.submit(formResult);
      }

   }

}

// Form Validate Function

FormValidate.isRequired = (selector, message) => {
   return {
      selector,
      test(value) {
         return value ? undefined : message || "Please fill this field";
      }
   }
}

FormValidate.minLength = (selector, min, message) => {
   return {
      selector,
      test(value) {
         return value.length >= min ? undefined : message || `Please enter at least ${min} characters `
      }
   }
}

FormValidate.isEmail = (selector, message) => {
   return {
      selector,
      test(value) {
         const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
         return regex.test(value) ? undefined : message || 'Please enter a valid email address';
      }
   }
}

FormValidate.isConfirmed = (selector, confirmSelector, message) => {
   return {
      selector,
      test(value) {
         const confirmValue = $(confirmSelector).value;
         return value === confirmValue ? undefined : message || 'The entered value does not match';
      }
   }
}

FormValidate.isChecked = (selector, message) => {
   return {
      selector,
      test() {
         return $(selector).checked === true ? undefined : message || 'Please check this field ';
      }
   }
}




// Authenticate

export async function authenticate(api, reqBody) { 
   try {
      const res = await fetch(api, {
         method: 'POST',
         mode: 'cors',
         cache: 'no-cache',
         credentials: 'same-origin',
         headers: {
            'Content-Type': 'application/json'
         },
         redirect: 'follow',
         referrerPolicy: 'no-referrer',
         body: JSON.stringify(reqBody)
      });

      if(res.status >= 400 && res.status < 500) {
         return Promise.reject(await res.json());
      }
      return await res.json();
   }catch(err) {
      console.log(err);
   }

   
}


export function sendFormError(fieldName, formOptions, customMessage) {
   function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
   }
   const form = $(formOptions.formSelector);
   const formInput = form.querySelector(`input[name*="${fieldName}"]`) || form.querySelector(`input[name*="${capitalizeFirstLetter(fieldName)}"]`)
   const formGroup = formInput.closest(formOptions.formGroupSelector)
   const formLabel = formGroup.querySelector('label');
   const formMessage = formGroup.querySelector(formOptions.formMessageSelector)
   const errorMessage = `${formLabel.innerHTML} ${customMessage}`
   
   formMessage.innerHTML = errorMessage;
   formGroup.classList.add(formOptions.formInvalidClassName)

   formInput.oninput = () => {
      formMessage.innerHTML = ``;
      formGroup.classList.remove(formOptions.formInvalidClassName)
   }

}

export function authSuccess (data) {

}  





