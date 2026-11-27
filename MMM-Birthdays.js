Module.register("MMM-Birthdays", {
  defaults: {
    limit: 4,
    showHeader: true,
    updateInterval: 60 * 60 * 1000,
    people: [
      { name: "Marco", birthdate: "1973-12-30" },
      { name: "Anna", birthdate: "1985-04-12" }
    ]
  },

  getStyles() {
    return ["MMM-Birthdays.css"];
  },

  getTemplate() {
    return "MMM-Birthdays.njk";
  },

  getTranslations() {
    return {
      nl: "locales/nl.json",
      en: "locales/en.json",
      fr: "locales/fr.json",
      de: "locales/de.json"
    };
  },

  start() {
    this.scheduleUpdate();
  },

  scheduleUpdate() {
    setInterval(() => {
      this.updateDom();
    }, this.config.updateInterval);
  },

  getLocaleObject() {
    const fallbackMonths = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
    const rawMonths = this.translate("months");
    const months = Array.isArray(rawMonths) && rawMonths.length === 12
      ? rawMonths
      : (typeof rawMonths === "string" && rawMonths.includes(",")
          ? rawMonths.split(",").map((s) => s.trim())
          : fallbackMonths);

    const pick = (primaryKey, fallbackKey, defaultVal) => {
      const v1 = this.translate(primaryKey);
      if (v1 && v1 !== primaryKey) return v1;
      if (fallbackKey) {
        const v2 = this.translate(fallbackKey);
        if (v2 && v2 !== fallbackKey) return v2;
      }
      return defaultVal;
    };

    return {
      headerWithin: pick("headerWithin", "headerDays", "Binnen"),
      headerName: pick("headerName", "headerName", "Jarige"),
      headerWillBe: pick("headerWillBe", "headerAge", "Wordt"),
      headerBirthday: pick("headerBirthday", "headerDate", "Geboren op"),
      today: pick("today", "today", "Vandaag"),
      day: pick("day", "day", "dag"),
      days: pick("days", "days", "dagen"),
      yearSuffix: pick("yearSuffix", "yearSuffix", "Jaar"),
      inYear: pick("inYear", null, ""),
      noBirthdays: pick("noBirthdays", null, "Geen verjaardagen"),
      months
    };
  },

  getTemplateData() {
    const lang = this.getLocaleObject();
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;

    const list = Array.isArray(this.config.people)
      ? this.config.people
      : (Array.isArray(this.config.birthdays) ? this.config.birthdays : []);

    const people = list
      .map((entry) => {
        const rawDate = entry.birthdate || entry.date || entry.birthday || "";
        const match = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(String(rawDate).trim());
        if (!match) return null;

        const birthYear = parseInt(match[1], 10);
        const birthMonth = parseInt(match[2], 10);
        const birthDay = parseInt(match[3], 10);

        if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
          return null;
        }

        let nextBirthday = new Date(todayStart.getFullYear(), birthMonth - 1, birthDay);
        if (nextBirthday < todayStart) {
          nextBirthday = new Date(todayStart.getFullYear() + 1, birthMonth - 1, birthDay);
        }

        const days = Math.round((nextBirthday - todayStart) / msPerDay);
        const age = nextBirthday.getFullYear() - birthYear;
        const monthName = `${lang.months[birthMonth - 1] || String(birthMonth).padStart(2, "0")} `;

        return {
          name: entry.name || "",
          days,
          isToday: days === 0,
          age,
          day: `${birthDay} `,
          monthName,
          birthyear: birthYear
        };
      })
      .filter((item) => item !== null)
      .sort((a, b) => a.days - b.days)
      .slice(0, this.config.limit || 4);

    return {
      showHeader: this.config.showHeader !== false,
      lang,
      people
    };
  }
});
