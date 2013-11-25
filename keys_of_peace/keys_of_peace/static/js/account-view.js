'use strict';
(function($, global){
	var AccountView = global.AccountView = Backbone.View.extend({
		events: {
			'click .account-options-link': 'onOptionsLinkClick',
			'click .account-remove-link': 'onRemoveClick'
		},

		initialize: function(){
			this.model.on('remove', this.onModelRemove, this);
		},
		
		render: function(){
			this.setElement(
				$(
					AccountView.template({
						login: this.model.get('login'),
						password: this.model.get('password')
					})
				)
			);

			var accounter = this.model.get('accounter');
			var site = accounter.get('mainSite');
			var login = this.$('.account-login');
			var loginRow = this.$('.account-login-row');
			login.clipboard();
			var email = this.model.get('email');
			if(email && email !== this.model.get('login')){
				var emailElement = $('<span>')
					.clipboard()
				;
				emailElement.html(email);
				var emailRow = $('<p>');
				emailRow.html('Email: ');
				emailRow.append(emailElement);
				loginRow.after(emailRow);
			}
			if(site){
				var siteLink = $('<a class="account-accounter-link account-title">')
					.attr('href', site.get('host'))
					.html(site.get('name'))
				;
				this.$el.prepend(siteLink);
			}else{
				var name = $('<span class="account-title">')
					.html(accounter.get('name'))
				;
				this.$el.prepend(name);
			}
			
			var password = this.$('.account-password')
				.password()
				.clipboard()
			;

			var notes = this.model.get('notes');
			if(notes){
				var notesRow = $('<p>');
				notesRow.html('Notes: ' + notes);
				this.$('.account-options').prepend(notesRow);
				this.$('.account-options-link').append(' notes');
			}

			return this;
		},

		onOptionsLinkClick: function(e){
			e.preventDefault();
			if(this.$('.account-options').is(':visible')){
				this.hideOptions();
			}else{
				this.showOptions();
			}
		},

		onRemoveClick: function(e){
			e.preventDefault();
			this.model.destroy();
		},

		onModelRemove: function(){
			this.remove();
		},

		showOptions: function(){
			this.$('.account-options')
				.slideDown('fast')
			;
		},

		hideOptions: function(){
			this.$('.account-options')
				.slideUp('fast')
			;
		},

		remove: function(){
			this.$el
				.slideUp({
					duration: 'fast',
					complete: _.bind(AccountView.__super__.remove, this)
				})
			;
		}
	});

	$(function(){
		AccountView.template = _.template($('.account-template').html());
	});
})(jQuery, this);