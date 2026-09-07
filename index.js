document.addEventListener('DOMContentLoaded', () => {

  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const sections = document.querySelectorAll('main section, main article');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => observer.observe(section));
  }

  const speedEl = document.querySelector('.puck-speed');

  if (speedEl && 'IntersectionObserver' in window) {
    const target = 160;
    let animated = false;

    const speedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const duration = 900;
          const start = performance.now();

          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            speedEl.textContent = `${Math.round(progress * target)} km/h`;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          speedObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    speedObserver.observe(speedEl);
  }

  const form = document.querySelector('#contato form');
  const feedback = document.querySelector('#form-feedback');

  if (form && feedback) {
    const submitButton = form.querySelector('button');

    submitButton.addEventListener('click', () => {
      const nome = form.querySelector('#nome');
      const email = form.querySelector('#email');
      const mensagem = form.querySelector('#mensagem');

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      if (!nome.value.trim() || !emailValido || !mensagem.value.trim()) {
        feedback.textContent = 'Preencha nome, e-mail válido e mensagem antes de enviar.';
        feedback.className = 'error';
        return;
      }

      feedback.textContent = `Obrigado, ${nome.value.trim()}! Sua mensagem foi registrada (envio de demonstração, sem servidor real).`;
      feedback.className = 'success';
      form.reset();
    });
  }

});