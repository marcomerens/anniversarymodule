# Module: MMM-Birthdays, a module to display upcoming birthdays

The MMM-Birthdays modules is derived from the inital development BIRTHDAYS created by Marco Merens.

Essentially it is a workout of the reporting in the display screen.

You can now see, what will be the age on the anniversary of someone and his/her year of borning.

The 'BIRTHDAYS' module is a costum module for [MagicMirror](https://github.com/MichMich/MagicMirror). 
It displays the name, birthday and remaining days of a list of people sorted by whoever is next.

The module is simple and can be used to learn about how modules for MagicMirror are done.

The names and birthdays are provided on configuration. The module then calculates which one is next and the remaining days.
The dates are recalculated every hour.

## Installation instructions 
Just pull down this repo and copy it in the modules folder under your Magic Mirror installation folder
```
cd ~/MagicMirror/modules/
git clone https://github.com/jms3700/anniversarymodule MMM-Birthdays
cd BIRTHDAYS
npm i
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
  {
    module: 'MMM-Birthdays',
    position: 'top_right',  // This can be any of the regions.
    config: {
      // See 'Configuration options' for more information.
      limit:4,
	people:[
		{name:"Marco",birthdate:"1973-12-30"},
		{name:"Steve",birthdate:"1988-11-25"},
		// You can add more names by adding more lines of the same format. 
	]

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
