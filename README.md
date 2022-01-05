# Module: BIRTHDAYS, a module to display upcoming birthdays

The 'BIRTHDAYS' module is a costum module for [MagicMirror](https://github.com/MichMich/MagicMirror). 
It displays the name, birthday and remaining days of a list of people sorted by whoever is next.

The module is simple and can be used to learn about how modules for MagicMirror are done.

The names and birthdays are provided on configuration. The module then calculates which one is next and the remaining days.
The dates are recalculated every hour.

## Installation instructions 
Just pull down this repo and copy it in the modules folder under your Magic Mirror installation folder


## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
  {
    module: 'BIRTHDAYS',
    position: 'top_right',  // This can be any of the regions.
    config: {
      // See 'Configuration options' for more information.
      limit:4,
	people:[{name:"Marco",birthdate:"1973-12-30"}]

    }
  }
]
````

## Configuration options

<table width="100%">
  <!-- why, markdown... -->
  <thead>
    <tr>
      <th>Option</th>
      <th width="100%">Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td><code>limit</code></td>
      <td>This is number of birthdays you want to show in the future. Default is 4. It's the length of the table.
      </td>
</tr>
    <tr>
      <td><code>people</code></td>
      <td>This is an array of people with their name and birthdates. The date is in ISO formaty YYYY-MM-DD. 
	Default is just a example of one.
      </td>
    </tr>
  </tbody>
</table>
