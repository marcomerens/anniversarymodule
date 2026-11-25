Module.register("MMM-Birthdays", {
  defaults: {
    limit: 5,
    showHeader: true,
    updateInterval: 60 * 60 * 1000,
    people: [],
    headerDays: "Within",
    headerName: "Birthday",
    headerAge: "Will be",
    headerDate: "Born on",
    today: "Today",
    day: "day",
    days: "days",
    yearSuffix: "Years",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },

  getStyles: function () {
    return ["MMM-Birthdays.css"];
  },

  getScripts: function () {
    return ["locales/en.js", "locales/nl.js"];
  },

  start: function () {
    this.scheduleUpdate();
  },

  scheduleUpdate: function () {
    setInterval(() => {
      this.updateDom(300);
    }, this.config.updateInterval);
  },

  parseBirthdate: function (dateStr) {
    if (typeof dateStr !== "string") return null;
    const parts = dateStr.trim().split("-");
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;

    const dt = new Date(year, month - 1, day);
    if (
      dt.getFullYear() !== year ||
      dt.getMonth() !== month - 1 ||
      dt.getDate() !== day
    ) {
      return null;
    }

    return { year, month: month - 1, day };
  },

  getLocaleObject: function () {
    const lang = (typeof config !== "undefined" && config.language ? config.language : "en")
      .toLowerCase()
      .slice(0, 2);
    const locales = typeof window !== "undefined" && window.MMMBirthdaysLocales
      ? window.MMMBirthdaysLocales
      : {};
    return locales[lang] || locales.en || {};
  },

  getLabel: function (key) {
    const locale = this.getLocaleObject();
    const aliasMap = {
      headerDays: ["headerDays", "headerWithin"],
      headerName: ["headerName"],
      headerAge: ["headerAge", "headerWillBe"],
      headerDate: ["headerDate", "headerBirthday"]
    };
    const candidates = aliasMap[key] || [key];

    for (const k of candidates) {
      if (locale[k] !== undefined && locale[k] !== "") {
        return locale[k];
      }
    }

    return this.config[key] || key;
  },

  getMonths: function () {
    const locale = this.getLocaleObject();
    if (Array.isArray(locale.months) && locale.months.length === 12) {
      return locale.months;
    }

    return this.config.months;
  },

  calculateUpcoming: function () {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentYear = todayStart.getFullYear();
    const msPerDay = 24 * 60 * 60 * 1000;
    const months = this.getMonths();

    const list = [];

    for (const person of this.config.people) {
      const parsed = this.parseBirthdate(person.birthdate);
      if (!parsed) continue;

      let nextBirthday = new Date(currentYear, parsed.month, parsed.day);
      if (nextBirthday < todayStart) {
        nextBirthday = new Date(currentYear + 1, parsed.month, parsed.day);
      }

      const days = Math.round((nextBirthday - todayStart) / msPerDay);
      const age = nextBirthday.getFullYear() - parsed.year;
      const monthName = months[parsed.month] || "";

      list.push({
        name: person.name || "",
        days: days,
        isToday: days === 0,
        age: age,
        day: parsed.day,
        monthName: monthName,
        birthyear: parsed.year
      });
    }

    list.sort((a, b) => a.days - b.days || a.name.localeCompare(b.name));
    return list.slice(0, this.config.limit);
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "mmm-birthdays";

    const items = this.calculateUpcoming();
    if (items.length === 0) {
      wrapper.innerHTML = "<div class='dimmed light small'>No birthdays configured.</div>";
      return wrapper;
    }

    const table = document.createElement("table");
    table.className = "mmm-birthdays-table";

    if (this.config.showHeader) {
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");

      const headers = [
        { className: "days", text: this.getLabel("headerDays") },
        { className: "name", text: this.getLabel("headerName") },
        { className: "age", text: this.getLabel("headerAge") },
        { className: "date", text: this.getLabel("headerDate") }
      ];

      for (const h of headers) {
        const th = document.createElement("th");
        th.className = h.className;
        th.textContent = h.text;
        headRow.appendChild(th);
      }

      thead.appendChild(headRow);
      table.appendChild(thead);
    }

    const tbody = document.createElement("tbody");

    for (const p of items) {
      const tr = document.createElement("tr");
      if (p.isToday) {
        tr.className = "is-today";
      }

      const tdDays = document.createElement("td");
      tdDays.className = "days";
      if (p.isToday) {
        const badge = document.createElement("span");
        badge.className = "today-badge";
        badge.innerHTML = `<span aria-hidden="true">🎂</span><span>${this.getLabel("today")}</span>`;
        tdDays.appendChild(badge);
      } else if (p.days === 1) {
        tdDays.textContent = `1 ${this.getLabel("day")}`;
      } else {
        tdDays.textContent = `${p.days} ${this.getLabel("days")}`;
      }

      const tdName = document.createElement("td");
      tdName.className = "name";
      tdName.textContent = p.name;

      const tdAge = document.createElement("td");
      tdAge.className = "age";
      tdAge.textContent = `${p.age} ${this.getLabel("yearSuffix")}`;

      const tdDate = document.createElement("td");
      tdDate.className = "date";

      const spanDay = document.createElement("span");
      spanDay.className = "bday-num";
      spanDay.textContent = p.day;

      const spanMonth = document.createElement("span");
      spanMonth.className = "bday-month";
      spanMonth.textContent = p.monthName;

      const spanYear = document.createElement("span");
      spanYear.className = "bday-year";
      spanYear.textContent = p.birthyear;

      tdDate.append(spanDay, spanMonth, spanYear);
      tr.append(tdDays, tdName, tdAge, tdDate);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    wrapper.appendChild(table);
    return wrapper;
  }
});
