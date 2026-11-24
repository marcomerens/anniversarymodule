/* Magic Mirror
 * Module: MMM-Birthdays
 *
 * By Jean-Marie Straetemans
 * Derived from BIRTHDAYS by Marco Merens
 * MIT Licensed.
 */
Module.register("MMM-Birthdays", {
	defaults: {
		limit: 4,
		showHeader: true,
		people: [
			{ name: "Marco", birthdate: "1973-12-30" }
		]
	},

	supportedLanguages: ["nl", "en"],

	getStyles: function () {
		return ["MMM-Birthdays.css"];
	},

	getTargetLangCode: function () {
		const mmLang = (typeof config !== "undefined" && config.language ? config.language : "en").toLowerCase();
		const code = mmLang.split("-")[0];
		return this.supportedLanguages.includes(code) ? code : "en";
	},

	loadLocaleFile: function (langCode) {
		const url = this.file(`locales/${langCode}.js`);
		return fetch(url)
			.then(function (response) {
				if (!response.ok) {
					throw new Error(`HTTP ${response.status} bij laden van ${url}`);
				}
				return response.text();
			})
			.then(function (scriptText) {
				const scriptEl = document.createElement("script");
				scriptEl.textContent = scriptText;
				document.head.appendChild(scriptEl);
				document.head.removeChild(scriptEl);
				return window.MMMBirthdaysLocales && window.MMMBirthdaysLocales[langCode];
			});
	},

	start: async function () {
		this.upcomingPeople = [];
		const targetLang = this.getTargetLangCode();

		try {
			this.activeLocale = await this.loadLocaleFile(targetLang);
		} catch (err) {
			Log.warn(`[${this.name}] Kon taalbestand '${targetLang}' niet laden, terugval naar 'en': ${err.message}`);
			try {
				this.activeLocale = await this.loadLocaleFile("en");
			} catch (fallbackErr) {
				Log.error(`[${this.name}] Kon ook 'en' taalbestand niet laden: ${fallbackErr.message}`);
				this.activeLocale = null;
			}
		}

		this.calculate();
		this.updateDom();

		const self = this;
		setInterval(function () {
			self.calculate();
			self.updateDom();
		}, 60 * 60 * 1000); // Elk uur bijwerken
	},

	parseBirthdate: function (dateStr) {
		if (typeof dateStr !== "string") {
			return null;
		}
		const parts = dateStr.trim().split("-");
		if (parts.length !== 3) {
			return null;
		}
		const year = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10);
		const day = parseInt(parts[2], 10);
		if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
			return null;
		}
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

	calculate: function () {
		const locale = this.activeLocale || {
			months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			day: "day",
			days: "days",
			yearSuffix: "Years",
			bornOn: "born on",
			inYear: "in",
			noBirthdays: "No birthdays configured."
		};
		const months = locale.months;

		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const currentYear = todayStart.getFullYear();
		const msPerDay = 24 * 60 * 60 * 1000;

		const list = Array.isArray(this.config.people) ? this.config.people : [];
		const calculated = [];

		for (const person of list) {
			const parsed = this.parseBirthdate(person.birthdate);
			if (!parsed) {
				Log.warn(`[${this.name}] Ongeldige geboortedatum voor ${person.name || "onbekend"}: ${person.birthdate}`);
				continue;
			}

			let nextBirthday = new Date(currentYear, parsed.month, parsed.day);
			if (nextBirthday < todayStart) {
				nextBirthday = new Date(currentYear + 1, parsed.month, parsed.day);
			}

			const days = Math.round((nextBirthday - todayStart) / msPerDay);
			const age = nextBirthday.getFullYear() - parsed.year;
			const monthName = months[parsed.month] || "";

			calculated.push({
				name: person.name || "",
				days: days,
				isToday: days === 0,
				age: age,
				day: parsed.day,
				monthName: monthName,
				date: `${parsed.day} ${monthName}`,
				birthyear: parsed.year
			});
		}

		calculated.sort(function (a, b) {
			return a.days - b.days || a.name.localeCompare(b.name);
		});

		this.upcomingPeople = calculated.slice(0, this.config.limit);
	},

	getTemplate: function () {
		return "MMM-Birthdays.njk";
	},

	getTemplateData: function () {
		return {
			people: this.upcomingPeople,
			showHeader: this.config.showHeader,
			lang: this.activeLocale || {}
		};
	}
});
