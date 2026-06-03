((d) => {
    const $btnMenu = d.querySelector(".menu-btn"),
      $menu = d.querySelector(".menu"),
      $backdrop = d.querySelector(".menu-backdrop"),
      $body = d.body;
    let lastFocused;

    const toggleMenu = (force) => {
      const isActive = $menu.classList.toggle("is-active", force === undefined ? undefined : force);
      $backdrop.classList.toggle("is-active", isActive);
      $btnMenu.firstElementChild.classList.toggle("none", isActive);
      $btnMenu.lastElementChild.classList.toggle("none", !isActive);
      $body.classList.toggle("no-scroll", isActive);
      $btnMenu.setAttribute("aria-label", isActive ? "Cerrar menú" : "Abrir menú");

      if (isActive) {
        lastFocused = d.activeElement;
        $menu.querySelector("a").focus();
      } else if (lastFocused) {
        lastFocused.focus();
      }
    };

    $btnMenu.addEventListener("click", () => toggleMenu());

    $menu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") toggleMenu(false);
    });

    $backdrop.addEventListener("click", () => toggleMenu(false));

    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && $menu.classList.contains("is-active")) {
        toggleMenu(false);
      }
    });
  })(document);


((d) => {
  const $form = d.querySelector(".contact-form"),
    $loader = d.querySelector(".contact-form-loader"),
    $response = d.querySelector(".contact-form-response"),
    $errorEl = d.querySelector(".contact-form-error"),
    $body = d.body;
  let lastFocused;

  const showModal = (show) => {
    const $modal = d.querySelector(".modal");
    if (!$modal) return;
    $modal.classList.toggle("is-active", show);
    $body.classList.toggle("no-scroll", show);

    if (show) {
      lastFocused = d.activeElement;
      const $heading = $modal.querySelector("h3");
      if ($heading) $heading.focus();
    } else if (lastFocused) {
      lastFocused.focus();
    }
  };

  const showFormError = (msg) => {
    if (!$errorEl) return;
    $errorEl.textContent = msg || "Ocurrió un error al enviar, intenta nuevamente";
    $errorEl.classList.remove("none");
  };

  const hideFormError = () => {
    if ($errorEl) $errorEl.classList.add("none");
  };

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideFormError();
    $loader.classList.remove("none");

    const name = $form.querySelector("#contact-name");
    const email = $form.querySelector("#contact-email");

    if (!name.validity.valid) {
      $loader.classList.add("none");
      showFormError("Por favor ingresa un nombre válido (solo letras)");
      name.focus();
      return;
    }
    if (!email.validity.valid) {
      $loader.classList.add("none");
      showFormError("Por favor ingresa un correo electrónico válido");
      email.focus();
      return;
    }

    fetch("https://formsubmit.co/paula.mar@gmx.com", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        console.log(json);
        $response.querySelector("h3").innerHTML = "¡Gracias! Pronto estaremos en contacto";
        showModal(true);
        $form.reset();
      })
      .catch((err) => {
        console.log(err);
        let message = err.statusText || "Ocurrió un error al enviar, intenta nuevamente";
        showFormError(message);
      })
      .finally(() => {
        $loader.classList.add("none");
      });
  });

  d.addEventListener("click", (e) => {
    const $modal = d.querySelector(".modal");
    if ($modal && $modal.classList.contains("is-active") && e.target === $modal) {
      showModal(false);
    }
  });

  d.addEventListener("keydown", (e) => {
    const $modal = d.querySelector(".modal");
    if (!$modal || !$modal.classList.contains("is-active")) return;

    if (e.key === "Escape") {
      showModal(false);
      return;
    }

    if (e.key === "Tab") {
      const focusable = $modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && d.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && d.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  d.addEventListener("click", (e) => {
    const $modalClose = e.target.closest(".modal-close");
    if ($modalClose) {
      showModal(false);
    }
  });
})(document);
