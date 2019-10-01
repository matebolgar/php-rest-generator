let res = [
	"use admin",
	db.createUser({
		user: 'admin',
		pwd: 'YpMmG7m2RnY5WYeu',
		roles: [{
			role: "root", db: "admin"
		}]
	}),
	"use ce-db",
	db.createUser({
		user: 'ce-user',
		pwd: 'bX27VfJ8daQdqsRN',
		roles: [{
			role: "readWrite", db: "ce-db"
		}]
	})
];
printjson(res);