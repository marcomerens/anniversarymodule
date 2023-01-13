/* Magic Mirror
 * Module: MMM-Birthdays
 *
 * By Jean-Marie Straetemans
 * derived from BIRTHDAYS
 * Initially By Marco Merens
 * Module: BIRTHDAYS
 * MIT Licensed.
 */
Module.register("MMM-Birthdays", {


	defaults: {
		limit:4,
		people:[{name:"Marco",birthdate:"1973-12-30"}]
	},
	start:function() {
		this.calculate()		

		var self=this

			
			setInterval(function(){
				self.calculate()
				self.updateDom()
				},60*60*1000) // update every hour
			
	},
	calculate : function(){
		var now=new Date(new Date().toLocaleString("sv").substring(0,10))
		var thisyear=now.getUTCFullYear()
		var today=new Date(thisyear,now.getUTCMonth(),now.getUTCDate()).getTime()
		Log.log(now)
		var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
		this.config.people.forEach(function(p){
			var bdate=new Date(p.birthdate)
			var bmonth=bdate.getUTCMonth()
			var bday=bdate.getUTCDate()
			var byear=bdate.getUTCFullYear()
			p.age=thisyear-byear
			var diff=new Date(thisyear,bmonth,bday).getTime()-today
			if (diff<0) {diff=new Date(thisyear+1,bmonth,bday).getTime()-today
				      p.age=thisyear-byear}
			p.days=Math.floor(diff/1000/60/60/24)
			p.date=bday+" "+months[bmonth]
			p.birthyear=byear
			p.day=bday
		})
		this.config.people.sort(function(a,b){return a.days-b.days})
		
	},



	getTemplate: function () {
		return "MMM-Birthdays.njk";
	},

	getTemplateData: function () {

		return this.config;
	}
	
});
