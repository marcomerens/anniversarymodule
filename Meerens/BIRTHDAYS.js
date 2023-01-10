/* Magic Mirror
 * Module: BIRTHDAYS
 *
 * By Marco Merens
 * MIT Licensed.
 */
Module.register("BIRTHDAYS", {


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
			var diff=new Date(thisyear,bmonth,bday).getTime()-today
			if (diff<0) {


				diff=new Date(thisyear+1,bmonth,bday).getTime()-today}
			p.days=Math.floor(diff/1000/60/60/24)
			p.date=bday+" "+months[bmonth]
			
		})
		this.config.people.sort(function(a,b){return a.days-b.days})
		
	},



	getTemplate: function () {
		return "BIRTHDAYS.njk";
	},

	getTemplateData: function () {

		return this.config;
	}
	
});
