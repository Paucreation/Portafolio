((d) => {
    const $btnMenu = d.querySelector(".menu-btn"),
      $menu = d.querySelector(".menu"),
      $body = d.body;

    const toggleMenu = (force) => {
      const isActive = $menu.classList.toggle("is-active", force === undefined ? undefined : force);
      $btnMenu.firstElementChild.classList.toggle("none", isActive);
      $btnMenu.lastElementChild.classList.toggle("none", !isActive);
      $body.classList.toggle("no-scroll", isActive);
      $btnMenu.setAttribute("aria-label", isActive ? "Cerrar menú" : "Abrir menú");
    };

    $btnMenu.addEventListener("click", () => toggleMenu());

    $menu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") toggleMenu(false);
    });

    d.addEventListener("click", (e) => {
      if ($menu.classList.contains("is-active") && !$menu.contains(e.target) && !$btnMenu.contains(e.target)) {
        toggleMenu(false);
      }
    });
  })(document);


((d) => {
  const $form = d.querySelector(".contact-form"),
    $loader = d.querySelector(".contact-form-loader"),
    $response = d.querySelector(".contact-form-response"),
    $body = d.body;

  const showModal = (show) => {
    const $modal = d.querySelector(".modal");
    if (!$modal) return;
    $modal.classList.toggle("is-active", show);
    $body.classList.toggle("no-scroll", show);
  };

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    $loader.classList.remove("none");
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
        let message =
          err.statusText || "Ocurrió un error al enviar, intenta nuevamente";
        $response.querySelector(
          "h3"
        ).innerHTML = `Error ${err.status}: ${message}`;
        showModal(true);
      })
      .finally(() => {
        $loader.classList.add("none");
        setTimeout(() => {
          showModal(false);
        }, 3000);
      });
  });

  d.addEventListener("click", (e) => {
    const $modal = d.querySelector(".modal");
    if ($modal && $modal.classList.contains("is-active") && e.target === $modal) {
      showModal(false);
    }
  });
})(document);
