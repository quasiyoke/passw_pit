(function($){
	var credentials;
	var store;

	var Dashboard = window.Dashboard = function(selector, _credentials){
		credentials = _credentials;
		
		var element = $(selector);
		element.html(this.render());

		$('.dashboard-title').qtip();

		this.bar = $('.bar');

		var that = this;
		store = new Store().on({
			constructionDecryption: function(){
				that.setStoreStatus({
					text: 'Decrypting…',
					gauge: true
				});
			},
			constructionDone: _.bind(this.onStoreConstructionDone, this),
			savingEncryption: function(){
				that.setStoreStatus({
					text: 'Encrypting…',
					gauge: true
				});
			},
			savingFetching: function(){
				that.setStoreStatus({
					text: 'Fetching…',
					gauge: true
				})
			},
			savingDone: function(){
				that.setStoreStatus({
					text: 'Saved at ' + new Date().toLocaleTimeString()
				})
			},
			savingFail: function(xhr){
				var options = {
					error: true
				};
				if(!xhr.status){
					options.text = 'Saving failed. Check your internet connection.'
				}else if(401 === xhr.status){
					options.text = 'Unauthorized. <a href="' + CONFIGURATION.LOGIN_URL + '">Login</a>';
				}else if(500 === xhr.status){
					options.text = 'Server error during saving.';
				}else{
					options.text = 'Unknown error during saving.';
				}
				that.setStoreStatus(options)
			}
		});

		var searchForm = element.find('.search-form');
		searchForm.form({
			focus: true,
			submit: function(){
				that.search(searchForm.find('[name=query]').val());
			}
		});
		searchForm.on('formdelayedchange', function(){
			that.search(searchForm.find('[name=query]').val());
		});

		this.searchResultsElement = element.find('.search-results');

		this.accountForm = element.find('.account-form');
		this.accountForm.accountForm({
			validation: {
				rules: {
					link: {
						required: true
					},
					login: {
						required: true
					},
					email: {
						email: true
					},
					length: {
						range: [3, 50]
					},
					password: {
						required: true
					},
					notes: {
						maxlength: 100
					}
				},
				messages: {
					link: {
						required: 'Enter the link or name for account.'
					},
					login: {
						required: 'Enter account login or email.'
					},
					length: {
						range: 'Passw length should be ≥ 3 and ≤ 50.'
					},
					password: {
						required: 'Enter password for account.'
					}
				}
			},

			submit: function(){
				store.accounts.create({
					link: this.linkInput.val(),
					login: this.loginInput.val(),
					email: this.emailInput.val(),
					password: this.passwordInput.val(),
					passwordAlphabet: this.alphabetInput.val(),
					passwordLength: this.lengthInput.val(),
					notes: this.notesInput.val()
				});
			}
		});

		store.setCredentials(credentials);
	};
	
	_.extend(Dashboard.prototype, {
		render: function(){
			return _.template(
				$('.dashboard-template').html(),
				{
					email: credentials.email
				}
			);
		},

		setStoreStatus: function(options){
			if(!this.storeStatus){
				this.storeStatus = $('<div class="status">');
				this.bar.append(this.storeStatus);
			}
			if(options.error){
				this.storeStatus.addClass('status-error');
			}else{
				this.storeStatus.removeClass('status-error');
			}
			if(options.gauge){
				this.storeStatus.addClass('status-gauge');
			}else{
				this.storeStatus.removeClass('status-gauge');
			}
			this.storeStatus.html(options.text);
			this.storeStatus
				.position({
					my: 'center top',
					at: 'center bottom+5',
					of: this.bar
				})
			;
		},

		clearStoreStatus: function(){
			if(this.storeStatus){
				this.storeStatus.remove();
				delete this.storeStatus;
			}
		},

		onStoreConstructionDone: function(){
			this.clearStoreStatus();
			this.setSearchResults(store.accounts);
			if(!store.accounts.length){
				this.accountForm.accountForm('focus');
			}
			this.accountForm.accountForm('value', 'login', store.logins.last().get('login'));
			this.accountForm.accountForm('value', 'email', store.emails.last().get('email'));
			this.accountForm.accountForm('value', 'alphabet', store.accounters.suggestPasswordAlphabet());
			this.accountForm.accountForm('value', 'length', store.accounters.suggestPasswordLength());
			this.accountForm.accountForm('generatePassword');
		},

		setSearchResults: function(searchResults){
			if(this.searchResults){
				this.offSearchResults();
			}
			this.searchResults = searchResults;
			this.onSearchResults();

			this.searchResultsElement.html('');
			if(this.searchResults.length){
				var that = this;
				this.searchResults.each(function(model){
					that.addSearchResult(model, {
						effects: false
					})
				});
			}else{
				this.showNoSearchResults({
					effects: false
				});
			}
		},

		onSearchResults: function(){
			this.searchResults.on({
				add: _.bind(this.onAddSearchResult, this),
				remove: _.bind(this.onRemoveSearchResult, this)
			});
		},

		onAddSearchResult: function(model, options){
			if(1 === this.searchResults.length){
				this.hideNoSearchResults(options);
			}
			this.addSearchResult(model, options);
		},

		onRemoveSearchResult: function(model, options){
			if(!this.searchResults.length){
				this.showNoSearchResults(options);
			}
		},

		addSearchResult: function(model, options){
			options = _.defaults(options || {}, {
				effects: true
			});
			var view;
			if(model instanceof Account){
				view = new AccountView({
					model: model
				});
			}else{
				throw 'Model is not recognized.';
			}
			view.render();
			this.searchResultsElement.append(view.$el);
			if(options.effects){
				view.$el
					.hide()
					.slideDown('fast')
				;
			}
		},

		offSearchResults: function(){
			
		},

		showNoSearchResults: function(options){
			var element = $(this.query ? '.no-search-results-template' : '.no-accounts-template');
			element = $(element.html());
			this.searchResultsElement.append(element);
			if(options.effects !== false){
				element
					.hide()
					.slideDown('fast')
				;
			}
		},

		hideNoSearchResults: function(options){
			var element = this.searchResultsElement.find('.no-search-results');
			if(false === options.effects){
				element.remove();
			}else{
				element
					.slideUp({
						duration: 'fast',
						complete: function(){
							element.remove();
						}
					})
				;
			}
		},

		search: function(query){
			if(this.query === query){
				return;
			}
			var accounts;
			if(query){
				accounts = store.accounts.filter(function(account){
					return account.contains(query);
				});
				accounts = new Accounts(accounts);
			}else{
				accounts = store.accounts;
			}
			this.query = query;
			this.setSearchResults(accounts);
		}
	});
})(jQuery);
