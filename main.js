(function () {
  "use strict";

  var S = window.SITE || {};
  var B = S.booking || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Settings applied to the page ---------- */
  function applySettings() {
    $$('[data-bind="rating"]').forEach(function (el) { el.textContent = S.rating; });
    $$('[data-bind="reviewCount"]').forEach(function (el) { el.textContent = S.reviewCount; });
    $$(".stars").forEach(function (el) {
      el.style.setProperty("--r", S.rating);
      el.setAttribute("aria-label", "Rated " + S.rating + " out of 5");
    });
    if (S.whatsappNumber) {
      $("#wa-fab").href = "https://wa.me/" + S.whatsappNumber + "?text=" +
        encodeURIComponent("Hello Shear Desire, I found you on your website.");
    }
    if (S.mapsLink) {
      $("#maps-link").href = S.mapsLink;
      $("#reviews-link").href = S.mapsLink;
    }
    if (S.lat && S.lng) {
      $("#map").src = "https://www.google.com/maps?q=" + S.lat + "," + S.lng + "&z=17&output=embed";
      $("#directions-link").href = "https://www.google.com/maps/dir/?api=1&destination=" + S.lat + "," + S.lng;
    }
    var fb = $("#fb-line");
    if (S.facebook) {
      fb.hidden = false;
      fb.innerHTML = S.facebook.recommend + "% of " + S.facebook.reviews +
        ' Facebook reviewers recommend us. <a href="' + S.facebook.url + '" target="_blank" rel="noopener">Facebook page</a>';
    }
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- Mobile menu ---------- */
  function initNav() {
    var toggle = $(".nav-toggle");
    var nav = $("#nav");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Services ---------- */
  function renderServices() {
    var list = $("#service-list");
    var select = $("#f-service");
    var services = S.services || [];

    list.innerHTML = "";
    services.forEach(function (s) {
      var li = document.createElement("li");
      var h = document.createElement("h3");
      var p = document.createElement("p");
      h.textContent = s.name;
      p.textContent = s.text;
      li.appendChild(h);
      li.appendChild(p);
      list.appendChild(li);
    });

    select.innerHTML = "";
    var first = document.createElement("option");
    first.value = "";
    first.textContent = "Choose a service";
    select.appendChild(first);
    services.concat([{ name: "Not sure yet" }]).forEach(function (s) {
      var o = document.createElement("option");
      o.value = s.name;
      o.textContent = s.name;
      select.appendChild(o);
    });
  }

  /* ---------- Gallery + lightbox ---------- */
  function initGallery() {
    var grid = $("#gallery-grid");
    var items = $$("li", grid);
    var chips = $$(".chip");
    var dlg = $("#lightbox");
    var img = $("#lb-img");
    var cap = $("#lb-cap");
    var current = 0;
    var lastFocus = null;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        items.forEach(function (li) {
          li.hidden = !(f === "all" || li.getAttribute("data-cat") === f);
        });
      });
    });

    function visibleButtons() {
      return items.filter(function (li) { return !li.hidden; })
                  .map(function (li) { return $(".shot", li); });
    }

    function show(i) {
      var btns = visibleButtons();
      if (!btns.length) return;
      current = (i + btns.length) % btns.length;
      var b = btns[current];
      img.src = b.getAttribute("data-full");
      img.alt = b.getAttribute("data-alt");
      cap.textContent = b.getAttribute("data-alt");
    }

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".shot");
      if (!btn) return;
      lastFocus = btn;
      var idx = visibleButtons().indexOf(btn);
      show(idx);
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    });

    $(".lb-close").addEventListener("click", function () { dlg.close(); });
    $(".lb-prev").addEventListener("click", function () { show(current - 1); });
    $(".lb-next").addEventListener("click", function () { show(current + 1); });

    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(current - 1); }
      if (e.key === "ArrowRight") { show(current + 1); }
    });

    /* swipe on touch screens */
    var x0 = null;
    dlg.addEventListener("touchstart", function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
      x0 = null;
    });
  }

  /* ---------- Reviews ---------- */
  function renderReviews() {
    var box = $("#review-list");
    var reviews = window.REVIEWS || [];
    box.innerHTML = "";

    if (!reviews.length) {
      var empty = document.createElement("div");
      empty.className = "review-empty";
      empty.innerHTML =
        "<p><strong>Read what clients say on Google Maps.</strong></p>" +
        "<p>Every review is on our Google listing, where you can also add your own after your visit.</p>";
      box.appendChild(empty);
      return;
    }

    reviews.forEach(function (r) {
      var art = document.createElement("article");
      art.className = "review";

      var stars = document.createElement("span");
      stars.className = "stars";
      stars.style.setProperty("--r", r.rating || 5);
      stars.setAttribute("role", "img");
      stars.setAttribute("aria-label", "Rated " + (r.rating || 5) + " out of 5");

      var p = document.createElement("p");
      p.textContent = r.text;

      var foot = document.createElement("footer");
      var strong = document.createElement("strong");
      strong.textContent = r.name;
      foot.appendChild(strong);
      if (r.date) foot.appendChild(document.createTextNode(", " + r.date));

      art.appendChild(stars);
      art.appendChild(p);
      art.appendChild(foot);
      box.appendChild(art);
    });
  }

  /* ---------- Booking form ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function toISO(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseDate(v) { var p = v.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function label12(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + pad(m) + " " + suffix;
  }

  function initBooking() {
    var form = $("#booking-form");
    var dateEl = $("#f-date");
    var timeEl = $("#f-time");
    var status = $("#form-status");

    var today = new Date();
    dateEl.min = toISO(today);
    var max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (B.daysAhead || 90));
    dateEl.max = toISO(max);

    function setError(id, msg) {
      var field = $("#" + id);
      var err = $("#e-" + id.replace("f-", ""));
      if (msg) {
        err.textContent = msg;
        err.hidden = false;
        field.setAttribute("aria-invalid", "true");
        field.setAttribute("aria-describedby", err.id);
      } else {
        err.hidden = true;
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
      }
    }

    function buildTimes() {
      timeEl.innerHTML = "";
      setError("f-date", "");
      if (!dateEl.value) {
        timeEl.disabled = true;
        timeEl.innerHTML = '<option value="">Choose a date first</option>';
        return;
      }
      var d = parseDate(dateEl.value);
      var closed = (B.closedWeekdays || []).indexOf(d.getDay()) !== -1;
      if (closed) {
        timeEl.disabled = true;
        timeEl.innerHTML = '<option value="">Closed that day</option>';
        setError("f-date", "The studio is closed on that day. Please pick another date.");
        return;
      }

      var start = toMin(B.openTime || "09:30");
      var end = toMin(B.closeTime || "17:00");
      var step = B.slotMinutes || 30;
      var earliest = 0;
      var now = new Date();
      if (toISO(d) === toISO(now)) {
        earliest = now.getHours() * 60 + now.getMinutes() + (B.minNoticeMinutes || 60);
      }

      var slots = [];
      for (var m = start; m <= end; m += step) {
        if (m >= earliest) slots.push(m);
      }

      var first = document.createElement("option");
      first.value = "";
      if (!slots.length) {
        first.textContent = "No times left today";
        timeEl.appendChild(first);
        timeEl.disabled = true;
        setError("f-date", "No times left today. Please pick another date.");
        return;
      }
      first.textContent = "Choose a time";
      timeEl.appendChild(first);
      slots.forEach(function (m) {
        var o = document.createElement("option");
        o.value = label12(m);
        o.textContent = label12(m);
        timeEl.appendChild(o);
      });
      timeEl.disabled = false;
    }

    dateEl.addEventListener("change", buildTimes);

    function validate() {
      var ok = true;
      var name = $("#f-name").value.trim();
      setError("f-name", name ? "" : "Please enter your name.");
      if (!name) ok = false;

      var svc = $("#f-service").value;
      setError("f-service", svc ? "" : "Please choose a service.");
      if (!svc) ok = false;

      if (!dateEl.value) { setError("f-date", "Please choose a date."); ok = false; }
      else if (dateEl.value < dateEl.min || dateEl.value > dateEl.max) {
        setError("f-date", "Please choose a date from today up to " + (B.daysAhead || 90) + " days ahead."); ok = false;
      } else if ($("#e-date").hidden === false) { ok = false; }

      var timeOk = !!timeEl.value && !timeEl.disabled;
      setError("f-time", timeOk ? "" : "Please choose a time.");
      if (!timeOk) ok = false;
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.hidden = true;
      if (!validate()) {
        var bad = $("[aria-invalid='true']", form);
        if (bad) bad.focus();
        return;
      }

      var d = parseDate(dateEl.value);
      var dateText = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      var notes = $("#f-notes").value.trim();

      var lines = [
        "Hello Shear Desire, I would like to book an appointment.",
        "",
        "Name: " + $("#f-name").value.trim(),
        "Service: " + $("#f-service").value,
        "Date: " + dateText,
        "Time: " + timeEl.value
      ];
      if (notes) lines.push("Notes: " + notes);
      lines.push("", "Please confirm if this time is available. Thank you!");

      var url = "https://wa.me/" + S.whatsappNumber + "?text=" + encodeURIComponent(lines.join("\n"));

      status.innerHTML = 'Opening WhatsApp with your request. If nothing opens, <a href="' + url +
        '" target="_blank" rel="noopener">tap here to open it</a>.';
      status.hidden = false;

      /* Open WhatsApp in a new tab. The visible link above is the fallback
         if a pop-up blocker stops this. */
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  /* ---------- Start ---------- */
  applySettings();
  initNav();
  renderServices();
  initGallery();
  renderReviews();
  initBooking();
})();
