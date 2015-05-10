define('pws/StoreSerializer', [
  'crypto-js/core',
  'jdataview',
  'pws/Store',
  'pws/VersionError'
], function(
  CryptoJS,
  jDataView,
  Store,
  VersionError
) {
  /**
   * Serializes Password Safe storage to array of "fields": objects like this:
   * { code: 12, data: 'fooBar' }
   */
  function StoreSerializer(store, file) {
    this.store = store;
    this.file = file;
  }

  StoreSerializer._HEADER_FIELDS = {};
  StoreSerializer._HEADER_FIELDS_CODES = {};
  StoreSerializer._RECORDS_FIELDS = {};
  StoreSerializer._RECORDS_FIELDS_CODES = {};

	var Field = StoreSerializer._Field = CryptoJS.lib.Base.extend({
		init: function(options){
			this.name = options.name;
			this.code = options.code;
			if (options.extendObject) {
				this.extendObject = options.extendObject;
			} else {
				this.parse = options.parse;
			}
			options.serialize && (this.serialize = options.serialize);
		},

		extendObject: function(obj, data) {
			if(!this.parse){
				return;
			}
			var value = this.parse(data);
			if(this === value){
				return this;
			}
			obj[this.name] = value;
		},

		serialize: function(){}
	});

	var HeaderField = StoreSerializer._HeaderField = Field.extend({
		init: function(options){
			HeaderField.$super.init.apply(this, arguments);
			StoreSerializer._HEADER_FIELDS_CODES[options.code] = this;
			StoreSerializer._HEADER_FIELDS[options.name] = this;
		}
	});

	HeaderField.create({
		name: 'version',
		code: 0x00,
		parse: function(data){
			if (2 != data.byteLength && 4 != data.byteLength) {
				throw new VersionError('Incorrect version field length.');
			}
			var value = {
				minor: data.getUint8(),
				major: data.getUint8()
			};
			if (Store._VERSION.major != value.major) {
				throw new VersionError(value);
			}
			return value;
		},
		serialize: function(value){
			var data = new jDataView(2);
			data.writeUint8(value.minor);
			data.writeUint8(value.major);
			return data;
		}
	});

	HeaderField.create({
		name: 'uuid',
		code: 0x01,
		parse: function(data){
			return StoreSerializer._parseUuid(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeUuid(value);
		}
	});

	HeaderField.create({
		name: 'preferences',
		code: 0x02,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	HeaderField.create({
		name: 'treeDisplayStatus',
		code: 0x03,
		parse: function(data){ // TODO: Test this.
			return _.map(StoreSerializer._parseText(data), function(c){
				return '1' === c;
			});
		},
		serialize: function(value){
			if(!value){
				return;
			}
			value = _.map(value, function(expanded){
				return expanded ? '1' : '0';
			});
			return StoreSerializer._serializeText(value.join(''));
		}
	});

	HeaderField.create({
		name: 'lastSave',
		code: 0x04,
		parse: function(data){
			return StoreSerializer._parseTime(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeTime(value);
		}
	});

	HeaderField.create({ code: 0x05 }); // Who performed last save. Should be ignored.

	HeaderField.create({
		name: 'whatPerformedLastSave',
		code: 0x06,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	HeaderField.create({
		name: 'lastSavedByUser',
		code: 0x07,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	HeaderField.create({
		name: 'lastSavedOnHost',
		code: 0x08,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	HeaderField.create({
		name: 'databaseName',
		code: 0x09,
		parse: function(data){ // TODO: Test this.
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeText(value);
		}
	});

	HeaderField.create({
		name: 'databaseDescription',
		code: 0x0a,
		parse: function(data){ // TODO: Test this.
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeText(value);
		}
	});

	HeaderField.create({
		name: 'recentlyUsedEntries',
		code: 0x0f,
		parse: function(data){ // TODO: Test this.
			var data = StoreSerializer._parseText(data);
			var count = CryptoJS.enc.Hex.parse(data.substr(0, 2));
			_.extend(count, CryptoJS.lib.WordStack);
			count = count.shiftByte();
			if(data.length !== 2 + count * StoreSerializer._UUID_LENGTH){
				return;
			}
			var value = [];
			for(var i=2; i<data.length; i+=StoreSerializer._UUID_LENGTH){
				value.push(data.substr(i, StoreSerializer._UUID_LENGTH));
			}
			return value;
		},
		serialize: function(value){
			if(!value || !value.length){
				return;
			}
			var data = CryptoJS.lib.WordStack.create();
			if(value.length > 0xff){
				value = value.slice(0, 0xff); // TODO: Check slicing.
			}
			data.pushNumberHex(value.length, 2);
			_.each(value, function(uuid){
				data.pushBytes(StoreSerializer._serializeUuid(uuid), 2);
			});
			return data;
		}
	});

	HeaderField.create({
		name: 'namedPasswordPolicies',
		code: 0x10,
		extendObject: function(store, data){
			/*
				Very sad situation here: this field code was also assigned to YUBI_SK in 3.27Y. Here we try to infer the actual type based on the actual value
				stored in the field. Specifically, YUBI_SK is StoreSerializer._YUBI_SK_LENGTH bytes of binary data, whereas NAMED_PASSWORD_POLICIES is of varying length,
				starting with at least 4 hex digits.
				@see ReadHeader at PWSfileV3.cpp
			*/
			var data = data.clone();
			data = StoreSerializer._parseText(data.shiftWords(1));
			if(data.sigBytes !== StoreSerializer._YUBI_SK_LENGTH || StoreSerializer._HEX_REGEX.test(data)){
				var count = data.shiftNumberHex(2);
				store.namedPasswordPolicies = [];
				try{
					for(var i=0; i<count; ++i){
						store.namedPasswordPolicies.push(StoreSerializer._parsePasswordPolicy(data, true));
					}
				}catch(e){
					if(e instanceof CryptoJS.lib.WordStack.IndexError){
						return;
					}else{
						throw e;
					}
				}
			}else{ // TODO: Test this.
				store.yubiSk = data.readBytes(StoreSerializer._YUBI_SK_LENGTH);
			}
		},
		serialize: function(value){
			if(!value || !value.length){
				return;
			}
			if(value.length > 0xff){
				value = value.slice(0, 0xff); // TODO: Check slicing.
			}
			var data = CryptoJS.lib.WordStack.create();
			data.pushNumberHex(value.length, 2);
			_.each(value, function(policy){
				data.pushBytes(StoreSerializer._serializePasswordPolicy(policy, true));
			});
			return data;
		}
	});

	HeaderField.create({
		name: 'emptyGroups',
		code: 0x11,
		extendObject: function(store, data){
			store.emptyGroups || (store.emptyGroups = []);
			store.emptyGroups.push(StoreSerializer._parseText(data));
		},
		serialize: function(value){
			return _.map(value, function(group){
				return StoreSerializer._serializeText(group);
			});
		}
	});

	HeaderField.create({
		name: 'yubiSk',
		code: 0x12,
		parse: function(data){ // TODO: Test this.
			return data;
		},
		serialize: function(value){ // TODO: Test this.
			return value;
		}
	});

	HeaderField.create({
		name: 'endOfEntry',
		code: 0xff,
		parse: function(){
			return null; // This means that header definition was finished. Start records parsing.
		}
	})

	var RecordField = StoreSerializer._RecordField = Field.extend({
		init: function(options){
			RecordField.$super.init.apply(this, arguments);
			StoreSerializer._RECORDS_FIELDS_CODES[options.code] = this;
			StoreSerializer._RECORDS_FIELDS[options.name] = this;
		}
	});

	RecordField.create({
		name: 'uuid',
		code: 0x01,
		parse: function(data){
			return StoreSerializer._parseUuid(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeUuid(value);
		}
	});

	RecordField.create({
		name: 'group',
		code: 0x02,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'title',
		code: 0x03,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'username',
		code: 0x04,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'notes',
		code: 0x05,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'password',
		code: 0x06,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'creationTime',
		code: 0x07,
		parse: function(data){
			return StoreSerializer._parseTime(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeTime(value);
		}
	});

	RecordField.create({
		name: 'passwordModificationTime',
		code: 0x08,
		parse: function(data){
			return StoreSerializer._parseTime(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeTime(value);
		}
	});

	RecordField.create({
		name: 'lastAccessTime',
		code: 0x09,
		parse: function(data){
			return StoreSerializer._parseTime(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeTime(value);
		}
	});

	RecordField.create({
		name: 'passwordExpiryTime',
		code: 0x0a,
		parse: function(data){
			return StoreSerializer._parseTime(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeTime(value);
		}
	});

	RecordField.create({ code: 0x0b }); // Reserved.

	RecordField.create({
		name: 'lastModificationTime',
		code: 0x0c,
		parse: function(data){
			return StoreSerializer._parseTime(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeTime(value);
		}
	});

	RecordField.create({
		name: 'url',
		code: 0x0d,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'autotype',
		code: 0x0e,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'passwordHistory',
		code: 0x0f,
		parse: function(data){
			var value = {
				on: '1'.charCodeAt(0) === data.shiftByte()
			};
			value.maxSize = data.shiftNumberHex(2);
			var length = data.shiftNumberHex(2);
			var items = value.items = [];
			for(var i=0; i<length; ++i){
				var item = {
					time: new Date(data.shiftNumberHex(8) * 1000)
				};
				item.password = StoreSerializer._parseText(data.shiftBytes(data.shiftNumberHex(4)));
				items.push(item);
			}
			return value;
		},
		serialize: function(value){
			if(!value){
				return;
			}
			var data = CryptoJS.lib.WordStack.create();
			data.pushByte((value.on ? '1' : '0').charCodeAt(0));
			data.pushNumberHex(value.maxSize, 2);
			data.pushNumberHex(value.items.length, 2);
			_.each(value.items, function(item){
				data.pushNumberHex(item.time.getTime() / 1000, 8);
				data.pushNumberHex(item.password.length, 4);
				data.pushBytes(StoreSerializer._serializeText(item.password));
			});
			return data;
		}
	});

	RecordField.create({
		name: 'passwordPolicy',
		code: 0x10,
		parse: function(data){
			return StoreSerializer._parsePasswordPolicy(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializePasswordPolicy(value);
		}
	});

	RecordField.create({
		name: 'passwordExpiryInterval',
		code: 0x11,
		parse: function(data){
			return data.shiftNumber();
		},
		serialize: function(value){
			if(!value){
				return;
			}
			var data = CryptoJS.lib.WordStack.create();
			data.pushNumber(value);
			return data;
		}
	});

	RecordField.create({
		name: 'runCommand',
		code: 0x12,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'doubleClickAction',
		code: 0x13,
		parse: function(data){
			return data.shiftShort();
		},
		serialize: function(value){
			if(undefined === value || 0xff === value){
				return;
			}
			var data = CryptoJS.lib.WordStack.create();
			data.pushShort(value);
			return data;
		}
	});

	RecordField.create({
		name: 'email',
		code: 0x14,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'protectedEntry',
		code: 0x15,
		parse: function(data){ // TODO: Test this.
			return !!data.shiftByte();
		},
		serialize: function(value){ // TODO: Test this.
			if(!value){
				return;
			}
			return StoreSerializer._serializeText('1');
		}
	});

	RecordField.create({
		name: 'ownSymbolsForPassword',
		code: 0x16,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'shiftDoubleClickAction',
		code: 0x17,
		parse: function(data){
			return data.shiftShort();
		},
		serialize: function(value){
			if(undefined === value || 0xff === value){
				return;
			}
			var data = CryptoJS.lib.WordStack.create();
			data.pushShort(value);
			return data;
		}
	});

	RecordField.create({
		name: 'passwordPolicyName',
		code: 0x18,
		parse: function(data){
			return StoreSerializer._parseText(data);
		},
		serialize: function(value){
			if(!value){
				return;
			}
			return StoreSerializer._serializeText(value);
		}
	});

	RecordField.create({
		name: 'endOfEntry',
		code: 0xff,
		parse: function(data){
			return null; // This means that record definition was finished. Begin next record.
		}
	});

	StoreSerializer.prototype.parse = function() {
    this._parseHeader();
  };

  StoreSerializer.prototype._parseHeader = function() {
		/**
		 * @see ReadHeader at PWSfileV3.cpp
		 */
		for (var i = 0; i < this.file.fields.length; ++i){
			if (null === this._parseHeaderField(this.file.fields[i])) {
        break;
      }
		}
  };

  StoreSerializer.prototype._parseHeaderField = function(field) {
    var fieldHandler = StoreSerializer._HEADER_FIELDS_CODES[field.code];
    if (fieldHandler) {
      if (null === fieldHandler.extendObject(this.store, field.data)){
        return null; // This means that header definition was finished. Start records parsing.
      }
    } else {
      this.store.unknownFields.push(field);
    }
  };

  StoreSerializer.prototype.serialize = function() {

  };

  return StoreSerializer;
});
