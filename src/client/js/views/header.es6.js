/*jshint globalstrict: true*/
define('views/header', [
		'text!templates/roomTemplates/header.html',
		'backbone',
		'underscore'
], function(headerTemplate, Backbone, _) {
	let Header = Backbone.View.extend({
		el: '.content__header',
		template : _.template(headerTemplate),
		initialize: function(){
			this.render();
		},
		render: function(){
			$(this.el).html(this.template(this.model.toJSON()));
		}
	});

	return Header;

});