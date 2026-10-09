(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    status.textContent = '';
    status.className = 'form-status';

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          status.textContent = 'Thanks! Your message has been sent.';
          status.classList.add('success');
          form.reset();
        } else {
          return response.json().then(function (json) {
            var msg = 'Something went wrong.';
            if (json && json.errors && json.errors.length) {
              msg = json.errors.map(function (err) { return err.message; }).join(', ');
            }
            throw new Error(msg);
          }).catch(function () {
            throw new Error('Something went wrong. Please try again.');
          });
        }
      })
      .catch(function (error) {
        status.textContent = error.message || 'Network error. Please try again.';
        status.classList.add('error');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
  });
})();