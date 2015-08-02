/*jshint globalstrict: true*/

define('login/trello', [
	'backbone',
	'underscore',
	'data/service'
], function(Backbone, _, appData){
		let publicKey = 'DR4zizVjOy_1ZXdtlmn0GBLoTcA';

		return{
			signInAndFillData: function(){
				let that = this;

				this.signIn()
				.then(function(){
					that.getRepos();
					that.getUserData();
				});
			},

			signIn: function(){
				OAuth.initialize(publicKey);
				return OAuth.popup('trello', {cache: true});
			},

			getRepos: function(){

				return OAuth.create('trello').get('/1/members/my/boards')
				.then(function(projects){
					let projectsNames = [];
					let projectsIds = [];
					let admins = [];

					_.each(projects, function(project){
						let adminId = _.findWhere(project.memberships, {memberType: 'admin'}).idMember;
						admins.push(OAuth.create('trello').get('/1/members/' + adminId + '/username'));

						projectsNames.push(project.name);
						projectsIds.push(project.id);
					});

					$.when.apply($, admins)
					.done(function(){
						let projectList = [];
						let adminLogins = [];

						_.each([].slice.call(arguments), function(admin){
							adminLogins.push(admin[0]._value);
						});

						_.map(projectsNames, function(item, i){
							projectList.push({
								name: projectsNames[i],
								owner: adminLogins[i],
								id: projectsIds[i]
							})
						});

						appData.projectsModel.set({listOfProjects: projectList});
					});
				});
			},

			getUserData: function(){
				let user = {};

				OAuth.create('trello').get('/1/members/me')
				.then(function(data){
					appData.headerModel.set({
						login: data.username,
						name: data.fullName,
						avatar: 'https://trello-avatars.s3.amazonaws.com/' + data.avatarHash + '/50.png'
					});
				});
			},

			getIssues: function(project){
				let listOfProjects = appData.projectsModel.get('listOfProjects');
				let projectName = project.substr(project.indexOf('/') + 1);
				let projectId = _.findWhere(listOfProjects, {name: projectName}).id;

				OAuth.create('trello').get('/1/boards/' + projectId + '/cards')
				.then(function(issues){
					_.each(issues, function(issue){
						let issueBodyMD = issue.desc;
						let md = window.markdownit();
    					let body = md.render(issueBodyMD);
						appData.tasksCollection.add({
							title: issue.name,
							title_url: issue.url,
							body: body,
							date: issue.dateLastActivity
						});
					});
				});
			}
		}
	}
);