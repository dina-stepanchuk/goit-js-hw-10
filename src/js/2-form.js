const formData = {
  email: '',
  message: '',
};
const STORAGE_KEY = 'feedback-form-state';
const form = document.querySelector('.feedback-form');

form.addEventListener('submit', onFormSubmit);
form.addEventListener('input', onFormInput);

const savedMessage = localStorage.getItem(STORAGE_KEY);

if (savedMessage) {
  const parseData = JSON.parse(savedMessage);

  formData.email = parseData.email || '';
  formData.message = parseData.message || '';

  form.elements.email.value = formData.email;
  form.elements.message.value = formData.message;
}

function onFormSubmit(event) {
  event.preventDefault();
  if (formData.email === '' || formData.message === '') {
    alert('Fill please all fields');
    return;
  }
  console.log(formData);
  localStorage.removeItem(STORAGE_KEY);

  formData.email = '';
  formData.message = '';
  form.reset();
}

function onFormInput(event) {
  const { name, value } = event.target;

  if (!name) return;
  formData[name] = value.trim();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}
