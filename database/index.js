const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher');
mongoose.set('autoIndex', false);

let repoSchema = mongoose.Schema({
	id: Number,
	html_url: {
		type: String,
		unique: true,
		index: true
	},
	name: String,
	owner: {
		login: String,
		id: Number,
		avatar_url: String,
		html_url: String
	},
	description: String,
	updated_at: Date,
	size: Number
});

let Repo = mongoose.model('Repo', repoSchema);

// let save = APIResponse => {
// 	var resInSch = new Repo(APIResponse);
// 	resInSch.save(function(err, fluffy) {
// 		if (err) {
// 			console.log('not Connected');
// 			console.error(err);
// 		} else {
// 			console.log('I think it worked', resInSch);
// 		}
// 	});
// };

// let query = Repo.find({ name: /john/i }, null, { limit: 25 });
// query.exec(function(err, docs) {});

// module.exports.save = save;

module.exports.Repo = Repo;
module.exports.repoSchema = repoSchema;
repoSchema;
