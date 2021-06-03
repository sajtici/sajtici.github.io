document.addEventListener("DOMContentLoaded", () => {
  handleScrolling();

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");

        document.querySelector("html").classList.toggle("is-clipped");
      });
    });
  }

  document.querySelectorAll(".navbar-item").forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();

      const element = document.querySelector(item.getAttribute("href"));

      document.querySelector(".navbar-menu").classList.remove("is-active");
      document.querySelector(".navbar-burger").classList.remove("is-active");

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  document.addEventListener("scroll", function (e) {
    handleScrolling();

    $("section").each(function () {
      if (
        $(this).position().top - 125 <= $(document).scrollTop() &&
        $(this).position().top - 125 + $(this).outerHeight() >
          $(document).scrollTop()
      ) {
        $(".navbar-item:not([href='#" + $(this).attr("id") + "'])").removeClass(
          "is-active"
        );
        $(".navbar-item[href='#" + $(this).attr("id") + "']").addClass(
          "is-active"
        );
      }
    });
  });

  $(".responsive").slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: `<span>
    <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M1.19324 15.9022C0.935587 15.6947 0.935587 15.3575 1.19324 15.15L9.4219 8.53541L1.19324 1.90788C0.935588 1.70037 0.935588 1.36315 1.19324 1.15564C1.45089 0.948121 1.86957 0.948121 2.12721 1.15564L10.8068 8.14632C10.9356 8.25008 11 8.37978 11 8.52244C11 8.65214 10.9356 8.79481 10.8068 8.89857L2.12721 15.8893C1.86956 16.1097 1.45088 16.1097 1.19324 15.9022Z" fill="#FF0000" stroke="#FF0000" stroke-width="0.5"/>
    </svg>
    </span>`,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});

function handleScrolling() {
  if (document.scrollingElement.scrollTop > 10) {
    document.querySelector(".navbar").classList.add("moved");
  } else {
    document.querySelector(".navbar").classList.remove("moved");
  }
}

$.fn.serializeObject = function () {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function () {
    if (o[this.name]) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || "");
    } else {
      o[this.name] = this.value || "";
    }
  });
  return o;
};

function formSubmit(e) {
  e.preventDefault();

  const form = $(".contact-form").serializeObject();

  form.id = "cf";

  console.log(form);

  $.post("./actions/mail.php", form);

  document.querySelector(".form-container").classList.add("d-none");
  document.querySelector(".thankyou-container").classList.remove("d-none");
}
