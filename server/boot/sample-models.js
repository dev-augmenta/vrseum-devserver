/*var async = require('async');
module.exports = function(app, cb)
{
	//data sources
	var mongolab = app.dataSources.mongolab;
	var dbMemory = app.dataSources.db;

	//data vars
	var users = [];
	var roles = [];
	var museums = [];

	// create users
	mongolab.automigrate('AppUser', function(err) {
		if (err) return cb(err);
		var User = app.models.AppUser;
		// check if user 0 (Erik) exists
		var where = { email : 'erik.podetti@gmail.com' };
		User.findOne({where : where}, function(err, user){
			if( user === null)
			{
					User.create(
						{username: 'Erik', email: 'erik.podetti@gmail.com', password: 'opensesame'}
					, function(err, user){
						users[0] = user; //store it do data vars
						console.log('Created users: ', user);

						mongolab.automigrate('Museum', function(err){
						if(err) return cb(err);

						users[0].museums.create({
							name: 'Primo Museo',
							description: 'Descrizione del primo museo',
							isOpen : true
						}, function(err, museum){
							museums[0] = museum;
							console.log('Created museum:', museum);
						});
						});
					});
			}
		});
		// check if user 1 (VRDev) exists
		where = { email : 'dev@augmenta.it' };
		User.findOne({where : where}, function(err, user){
		if (user === null)//if not create it
		{
			User.create(
			{username: 'VRDev', email: 'dev@augmenta.it', password: 'PieroAugmenta15'}
			, function(err, user){
			users[1] = user; //store it to data vars
				console.log('Created users: ', user);
				//create the admin role
				mongolab.autoupdate('Role', function(err) {
				if (err) return cb(err);
					var Role = app.models.Role;
					Role.create({
					name: 'admin'
					}, function(err, role){
					if (err) return(err);
						// Make user[1] an admin
						var RoleMapping = app.models.RoleMapping;
						role.principals.create({
						principalType: RoleMapping.USER,
							principalId: users[1].id
						});
					});
				});
			});
		}
		});
	});
};*/


