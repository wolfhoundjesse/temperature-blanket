import m from "mithril";
import IMask from "imask";

const Layout = {
  view: (vnode) => m("main", vnode.children)
};

const YarnConfigPage = {
  view: () => {
    return m(".page", [
      m(".background"),
      m("form.registration-form", {
        onsubmit: (e) => {
          e.preventDefault();
          const ranges = [];
          const inputs = document.querySelectorAll('.temp-range');
          inputs.forEach(range => {
            ranges.push({
              minTemp: parseFloat(range.querySelector('.min-temp').value),
              maxTemp: parseFloat(range.querySelector('.max-temp').value),
              colorName: range.querySelector('.color-name').value
            });
          });
          // Store ranges
          localStorage.setItem('yarnConfig', JSON.stringify(ranges));
          m.route.set('/dashboard');
        }
      }, [
        m("h2.form-title", "Configure Temperature Ranges"),
        m(".temp-range", [
          m("input.min-temp[type=number][placeholder=Min Temp][required]"),
          m("input.max-temp[type=number][placeholder=Max Temp][required]"),
          m("input.color-name[type=text][placeholder=Color Name][required]")
        ]),
        m("button[type=submit]", "Save Configuration")
      ])
    ]);
  }
};

const Dashboard = {
  view: () => {
    return m(".page", [
      m(".background"),
      m("h1", "Temperature Blanket Dashboard"),
      m("p", "Welcome back!")
    ]);
  }
};

const RegistrationPage = {
  oncreate: (vnode) => {
    // Reference existing IMask setup
    const phoneInput = vnode.dom.querySelector("#phone");
    IMask(phoneInput, {
      mask: "000-000-0000",
    });
  },

  view: () => {
    return m(".page", [
      m(".background"),
      m("form.registration-form", {
        onsubmit: async (e) => {
          e.preventDefault();
          const phone = document.querySelector("#phone").value;
          const optIn = document.querySelector("#opt-in").checked;
          
          // Store registration
          localStorage.setItem('userPhone', phone);
          localStorage.setItem('userOptIn', optIn);

          // Check for yarn configuration
          const yarnConfig = localStorage.getItem('yarnConfig');
          if (!yarnConfig) {
            m.route.set('/config');
          } else {
            m.route.set('/dashboard');
          }
        }
      }, [
        m("h2.form-title", "Temperature Blanket Updates"),
        m(".form-group", [
          m("label[for=phone]", "Phone Number"),
          m("input#phone[type=text][placeholder=XXX-XXX-XXXX][required]")
        ]),
        m(".form-group.checkbox-group", [
          m("input#opt-in[type=checkbox]"),
          m("label[for=opt-in]", "I agree to receive text messages")
        ]),
        m("button[type=submit]", "Submit")
      ])
    ]);
  }
};

// Route configuration
m.route(document.getElementById("app"), "/", {
  "/": {
    onmatch: () => {
      const userPhone = localStorage.getItem('userPhone');
      if (userPhone) {
        const yarnConfig = localStorage.getItem('yarnConfig');
        if (!yarnConfig) {
          m.route.set('/config');
        } else {
          m.route.set('/dashboard');
        }
        return null;
      }
      return RegistrationPage;
    }
  },
  "/config": YarnConfigPage,
  "/dashboard": Dashboard
});
