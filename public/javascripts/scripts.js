/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
if (document.querySelector('#new-pet')) {
  document.querySelector('#new-pet').addEventListener('submit', (e) => {
    e.preventDefault();

    let pet = {};
    const inputs = document.querySelectorAll('.form-control');
    for (const input of inputs) {
      pet[input.name] = input.value;
    }
    axios.post('/pets', pet)
      .then((response) => {
        window.location.replace(`/pets/${response.data.pet._id}`)
      })
      .catch((error) => {
        const alert = document.getElementById('alert');
        alert.classList.add('alert-warning');
        alert.textContent = 'Oops, Something went wrong saving your pet. Please check your information and try again.';
        alert.style.display = 'block';
        setTimeout(() => {
          alert.style.display = 'none';
          alert.classList.remove('alert-warning');
        }, 3000);
      });
  });
}
