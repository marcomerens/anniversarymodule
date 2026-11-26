# MMM-Birthdays

A [MagicMirror²](https://magicmirror.builders/) module that displays upcoming birthdays, the number of days remaining, the age the person will turn, and their birth date.

![MMM-Birthdays screenshot](IMG_2165.jpeg)

Derived from [`BIRTHDAYS` (`anniversarymodule`)](https://github.com/marcomerens/anniversarymodule) by Marco Merens.

## Features

- Automatically sorts upcoming birthdays and limits the number of shown entries (`limit`).
- Highlights birthdays occurring today (`isToday`) with a cake icon (`🎂`) and gold accent styling (`#ffd000`).
- Displays `Vandaag` / `Today`, `1 dag` / `1 day`, or `<n> dagen` / `<n> days`.
- Shows the age the person will reach on their next birthday and their birth year.
- Uses separate JSON locale files in `locales/` (`nl.json`, `en.json`) via `getTranslations()` based on MagicMirror's global `config.language` setting.

## Installation

1. Navigate to your MagicMirror `modules` directory:

    cd ~/MagicMirror/modules

2. Clone the repository:

    git clone https://github.com/jms3700/MMM-Birthdays.git

## Configuration

Add the module to your `~/MagicMirror/config/config.js` file:

    {
        module: "MMM-Birthdays",
        position: "top_right",
        config: {
                limit: 4,
                showHeader: true,
                people: [
                        { name: "Marco", birthdate: "1973-12-30" },
                        { name: "Anna", birthdate: "1985-04-12" }
                ]
        }
    }

### Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `limit` | `number` | `4` | Maximum number of upcoming birthdays displayed. |
| `showHeader` | `boolean` | `true` | Shows or hides the table column headers. |
| `people` | `array` | `[{ name: "Marco", birthdate: "1973-12-30" }]` | List of people with `name` and `birthdate` (`YYYY-MM-DD`). |

## Adding or Editing Languages

Language texts and month abbreviations are stored in JSON files inside `locales/`:

- `locales/nl.json` (Dutch)
- `locales/en.json` (English)

To add another language (for example `fr`):

1. Copy `locales/en.json` to `locales/fr.json`.
2. Translate the strings and `months` array inside `locales/fr.json`.
3. Add `"fr"` to `getTranslations()` in `MMM-Birthdays.js`.

## License

MIT — see the `LICENSE` file for details. Originally derived from work by Marco Merens.
