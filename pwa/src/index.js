import m from "mithril";
import IMask from "imask";

const RegistrationPage = {
  oncreate: (vnode) => {
    const phoneInput = vnode.dom.querySelector("#phone");
    IMask(phoneInput, {
      mask: "000-000-0000",
    });

    // Gradient transition logic
    const background = vnode.dom.querySelector(".background");
    const colors = [
      { start: "#87CEEB", end: "#98FB98" }, // Spring
      { start: "#90EE90", end: "#7FFF00" }, // Late Spring
      { start: "#FFD700", end: "#32CD32" }, // Summer
      { start: "#FFA500", end: "#DAA520" }, // Late Summer
      { start: "#D2691E", end: "#8B4513" }, // Fall
      { start: "#8B4513", end: "#4A4A4A" }, // Late Fall
      { start: "#B0E0E6", end: "#F0F8FF" }, // Winter
      { start: "#ADD8E6", end: "#98FB98" }, // Late Winter
    ];

    let currentIndex = 0;
    let nextIndex = 1;
    let step = 0;
    const steps = 300; // Number of steps for transition

    function interpolateColor(color1, color2, factor) {
      const result = color1
        .slice(1)
        .match(/.{2}/g)
        .map((hex, i) => {
          const val1 = parseInt(hex, 16);
          const val2 = parseInt(color2.slice(1).match(/.{2}/g)[i], 16);
          const val = Math.round(val1 + factor * (val2 - val1));
          return val.toString(16).padStart(2, "0");
        });
      return `#${result.join("")}`;
    }

    function updateBackground() {
      const factor = step / steps;
      const startColor = interpolateColor(
        colors[currentIndex].start,
        colors[nextIndex].start,
        factor
      );
      const endColor = interpolateColor(
        colors[currentIndex].end,
        colors[nextIndex].end,
        factor
      );
      background.style.background = `linear-gradient(45deg, ${startColor} 0%, ${endColor} 100%)`;

      step++;
      if (step > steps) {
        step = 0;
        currentIndex = nextIndex;
        nextIndex = (nextIndex + 1) % colors.length;
      }

      requestAnimationFrame(updateBackground);
    }

    updateBackground();
  },

  view: () => {
    return m(".page", [
      m(".background"),
      m(
        "form.registration-form",
        {
          onsubmit: (e) => {
            e.preventDefault();
            const phone = document.querySelector("#phone").value;
            const optIn = document.querySelector("#opt-in").checked;
            console.log("Phone Number:", phone);
            console.log("Opt-in for Texts:", optIn);
          },
        },
        [
          m("h2.form-title", "Temperature Blanket Updates"),
          m(".form-group", [
            m("label[for=phone]", "Phone Number"),
            m("input#phone[type=text][placeholder=XXX-XXX-XXXX][required]"),
          ]),
          m(".form-group.checkbox-group", [
            m("input#opt-in[type=checkbox]"),
            m(
              "label[for=opt-in]",
              "I agree to receive text messages from wolfhoundjesse"
            ),
          ]),
          m("button[type=submit]", "Submit"),
        ]
      ),
    ]);
  },
};

m.mount(document.getElementById("app"), RegistrationPage);
