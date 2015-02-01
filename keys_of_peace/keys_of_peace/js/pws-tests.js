'use strict';

var PWS_STORE_STRING_NO_TAG = 'aGVsbG8=';
var PWS_STORE_STRING = 'UFdTM2NSi7EkqAv5MLStsmg0rWHZKHtU4TT7jnnSKK3KhCkDAAgAAPhH3PZH5MPRO4mP8m8Nji0wqr39DbE7dJ2pREJkyEH/fZTLERwvBrZk7YqaoFbLvPieXUWG2DeHndka2jO+rvDtccLn246+RK04oD7PRReLd5syBOogLeE0vjfVdWglCDJ2G/vHOHF7al4P6w1xWLEyGFc+oBKq12FD+8Y/PDNDH5to4KXwbf5OfIr7TzAmDL3kXmiZy/bIT547mk3Cz6Hz14eteALqb+Rz3xkC18zPHiRbPmKMyqpOveOmN726WqPHqRo8SkkXo9Xkpsns+MofjdmrQUUVsh6ZWnew8am/+bLsaBSQADgQb7sxb5MDE+qlJqyz8nl3uJqfAbsxpK0tQ1CYhS26ykzeebAPdL3nA2lC82ISrBR9EPEFZXDnSoG55/ppimp3LkILVPlC23zjoijdJxojnVuVzYCQqLT1HaZ2v8TgPu1TLX/f5IUwk7oc+p9L1aQ9uFrKYQHrHRqsqyHlKb8EVtfJcuyjoPyfzoiiTMpfV0arzV/ngO9mMlSxK/ttLolpjtQf6EcEQmbJFfwNVY0s8HguAt3ShvraaMq1wK4bq+lsa6fZ1tBwKtm652iqq7aas4kk49mMyMFCRd+TWorzSM1VPUhncg1wo8fn+qpDB3Ruv0uebBJReoEWQu4pPnCeV3cny1hh1pTG3rY6vhnt/dYBqvMWmjn2vw9eR0e6/OhnvuhLAoI/je7vv4Sz71RqlvIp5z/7YdKkE+/pA4g7NxNqyIB48/WWAcOSOooh4w742dHdWFz+glLfVNc4J2kWy6bnKf1ubwZ5eHmM/c47/yaomWCAgSeaTc1eZ+8BG3VlNKxRBNfLLA0LaLPX4XvsYehRop4UhXzKWUpwSCnJVF4GBjSkexubvWVVG1rB1+MCFGx8vD0O/ZxpUpzK2aTz6pc0BJ57o/zIS+sj1OVWNqp188CxnKRDIg2FoQrx8tr+xnLQSr2u8CT0tuQOb718ppiNKNJ9mG8w3cJmY8+XQFDodxpTHkei7kJyyYrQBc0w2FPTj9VPU7W2JJiMKTtoYDEzJejhMZcExZEO1Vv1wSHwubGqeC8UZjShNUE0trXVS69ZlrOsdMkAxDGPo2gIE48yahq/Ic4u23sDBPc8vUNdDz6xwSjwqYInT9Rf4l1ior1Sn/vHbL+rgL9q3ykDu31Q8cKDiM0FVTePXcOF+kFbDhRn7u2FolKM1JQEjoIIjvW0a6cWJrEoZUiSbp3tDLIBfz1jOZUj+B3Hooy4edKI9ui9loyQPe0FviFyO4cPEbEamvZvUFbUdTtwtmub77NnvaMb6n0Gj9h9MB6KBNMs047qTCauwKs7/cRC5dOX/d7eNJkmCostrPk36joics5WR1VG0UAdII1OI4agzT3JAaCyKvYu0HEpuGNnfV27d4nsjrGwGmPJZVpz3f5UyG2kxnJiGK6DBczv5ZAR2DizW5fGYUbfT7bDjonC0LXWBLktZ4WPWDbA+WelpWAwPr79SiNYjYVBp7K6yemobxge2XT5VcqoFjfYbg1ZwB5DFjC3Vq3zmQPSg/MWwRjOaS6cdxJeHIga2OeRJW8QBW7QjnZkqg9KSZwFM0HtvDUeLybVxPlVjFBXUzMtRU9GUFdTMy1FT0bCepE2z8eIsr9z66YnQ2a4kTVbAXsv/40EUo2z5/lcBg==';
var PWS_STORE_STRING_INCORRECT_HMAC = 'UFdTM2NSi7EkqAv5MLStsmg0rWHZKHtU4TT7jnnSKK3KhCkDAAgAAPhH3PZH5MPRO4mP8m8Nji0wqr39DbE7dJ2pREJkyEH/fZTLERwvBrZk7YqaoFbLvPieXUWG2DeHndka2jO+rvDtccLn246+RK04oD7PRReLd5syBOogLeE0vjfVdWglCDJ2G/vHOHF7al4P6w1xWLEyGFc+oBKq12FD+8Y/PDNDH5to4KXwbf5OfIr7TzAmDL3kXmiZy/bIT547mk3Cz6Hz14eteALqb+Rz3xkC18zPHiRbPmKMyqpOveOmN726WqPHqRo8SkkXo9Xkpsns+MofjdmrQUUVsh6ZWnew8am/+bLsaBSQADgQb7sxb5MDE+qlJqyz8nl3uJqfAbsxpK0tQ1CYhS26ykzeebAPdL3nA2lC82ISrBR9EPEFZXDnSoG55/ppimp3LkILVPlC23zjoijdJxojnVuVzYCQqLT1HaZ2v8TgPu1TLX/f5IUwk7oc+p9L1aQ9uFrKYQHrHRqsqyHlKb8EVtfJcuyjoPyfzoiiTMpfV0arzV/ngO9mMlSxK/ttLolpjtQf6EcEQmbJFfwNVY0s8HguAt3ShvraaMq1wK4bq+lsa6fZ1tBwKtm652iqq7aas4kk49mMyMFCRd+TWorzSM1VPUhncg1wo8fn+qpDB3Ruv0uebBJReoEWQu4pPnCeV3cny1hh1pTG3rY6vhnt/dYBqvMWmjn2vw9eR0e6/OhnvuhLAoI/je7vv4Sz71RqlvIp5z/7YdKkE+/pA4g7NxNqyIB48/WWAcOSOooh4w742dHdWFz+glLfVNc4J2kWy6bnKf1ubwZ5eHmM/c47/yaomWCAgSeaTc1eZ+8BG3VlNKxRBNfLLA0LaLPX4XvsYehRop4UhXzKWUpwSCnJVF4GBjSkexubvWVVG1rB1+MCFGx8vD0O/ZxpUpzK2aTz6pc0BJ57o/zIS+sj1OVWNqp188CxnKRDIg2FoQrx8tr+xnLQSr2u8CT0tuQOb718ppiNKNJ9mG8w3cJmY8+XQFDodxpTHkei7kJyyYrQBc0w2FPTj9VPU7W2JJiMKTtoYDEzJejhMZcExZEO1Vv1wSHwubGqeC8UZjShNUE0trXVS69ZlrOsdMkAxDGPo2gIE48yahq/Ic4u23sDBPc8vUNdDz6xwSjwqYInT9Rf4l1ior1Sn/vHbL+rgL9q3ykDu31Q8cKDiM0FVTePXcOF+kFbDhRn7u2FolKM1JQEjoIIjvW0a6cWJrEoZUiSbp3tDLIBfz1jOZUj+B3Hooy4edKI9ui9loyQPe0FviFyO4cPEbEamvZvUFbUdTtwtmub77NnvaMb6n0Gj9h9MB6KBNMs047qTCauwKs7/cRC5dOX/d7eNJkmCostrPk36joics5WR1VG0UAdII1OI4agzT3JAaCyKvYu0HEpuGNnfV27d4nsjrGwGmPJZVpz3f5UyG2kxnJiGK6DBczv5ZAR2DizW5fGYUbfT7bDjonC0LXWBLktZ4WPWDbA+WelpWAwPr79SiNYjYVBp7K6yemobxge2XT5VcqoFjfYbg1ZwB5DFjC3Vq3zmQPSg/MWwRjOaS6cdxJeHIga2OeRJW8QBW7QjnZkqg9KSZwFM0HtvDUeLybVxPlVjFBXUzMtRU9GUFdTMy1FT0bCepE2z8eIsr9z66YnQ2a4kTVbAXsv/40EUo2z5/lcBw==';
var PWS_STORE_STRING_RICH_HEADER = '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';
var PWS_STORE_STRING_TOO_FEW_ITERATIONS = 'UFdTM2NSi7EkqAv5MLStsmg0rWHZKHtU4TT7jnnSKK3KhCkD/wAAAPhH3PZH5MPRO4mP8m8Nji0wqr39DbE7dJ2pREJkyEH/fZTLERwvBrZk7YqaoFbLvPieXUWG2DeHndka2jO+rvDtccLn246+RK04oD7PRReLd5syBOogLeE0vjfVdWglCDJ2G/vHOHF7al4P6w1xWLEyGFc+oBKq12FD+8Y/PDNDH5to4KXwbf5OfIr7TzAmDL3kXmiZy/bIT547mk3Cz6Hz14eteALqb+Rz3xkC18zPHiRbPmKMyqpOveOmN726WqPHqRo8SkkXo9Xkpsns+MofjdmrQUUV';
var PASSWORD = 'W<u;]-CS>a%sF/N8+-93';

casper.test.comment('PWS Store');

function checkPWSStoreHeader(param){
	var store = new PWS.Store(param.string, param.password);
	var result = 1;
	result &= 0x03 === store.version.major;
	result &= 0x0d === store.version.minor;
	result &= '3ac852d20cc445e6937e5db545b7ec70' === store.uuid;
	result &= 'B 1 1 B 2 1 B 31 1 I 11 2 ' === store.preferences;
	result &= 1422744976000 === store.lastSave.getTime();
	result &= 'pwsafe V0.94' === store.whatPerformedLastSave;
	result &= 'quasiyoke' === store.lastSavedByUser;
	result &= 'quasiyoke-sony' === store.lastSavedOnHost;
	result &= 2 === store.namedPasswordPolicies.length;
	var googlePolicy = store.namedPasswordPolicies['G0ogle' === store.namedPasswordPolicies[0].name ? 0 : 1];
	var icqPolicy = store.namedPasswordPolicies['ICQ' === store.namedPasswordPolicies[0].name ? 0 : 1];
	result &= 'G0ogle' === googlePolicy.name;
	result &= 40 === googlePolicy.length;
	result &= false === googlePolicy.useLowercase;
	result &= 1 === googlePolicy.lowercaseCountMin;
	result &= false === googlePolicy.useUppercase;
	result &= 1 === googlePolicy.uppercaseCountMin;
	result &= false === googlePolicy.useDigits;
	result &= 1 === googlePolicy.digitsCountMin;
	result &= true === googlePolicy.useHexDigits;
	result &= false === googlePolicy.useSymbols;
	result &= 1 === googlePolicy.symbolsCountMin;
	result &= false === googlePolicy.useEasyVision;
	result &= false === googlePolicy.makePronounceable;
	result &= '+-=_@#$%^&;:,.<>/~\\[](){}?!|' === googlePolicy.specialSymbols;
	result &= 'ICQ' === icqPolicy.name;
	result &= 6 === icqPolicy.length;
	result &= true === icqPolicy.useLowercase;
	result &= 1 === googlePolicy.lowercaseCountMin;
	result &= false === icqPolicy.useUppercase;
	result &= 1 === googlePolicy.uppercaseCountMin;
	result &= true === icqPolicy.useDigits;
	result &= 1 === googlePolicy.digitsCountMin;
	result &= false === icqPolicy.useHexDigits;
	result &= true === icqPolicy.useSymbols;
	result &= 1 === googlePolicy.symbolsCountMin;
	result &= false === icqPolicy.useEasyVision;
	result &= true === icqPolicy.makePronounceable;
	result &= '@&(#!|$+' === icqPolicy.specialSymbols;
	result &= 2 === store.emptyGroups.length;
	result &= store.emptyGroups.indexOf('Work') >= 0;
	result &= store.emptyGroups.indexOf('Work.Banks') >= 0;
	return !!result;
}

function checkPWSStoreIncorrect(param){
	try{
		new PWS.Store(param.string, param.password);
	}catch(e){
		return e instanceof PWS.Error;
	}
}

function checkPWSStoreIncorrectHmac(param){
	try{
		new PWS.Store(param.string, param.password);
	}catch(e){
		return e instanceof PWS.HmacError;
	}
}

function checkPWSStoreIncorrectPassword(param){
	try{
		new PWS.Store(param.string, param.password);
	}catch(e){
		return e instanceof PWS.IncorrectPasswordError;
	}
}

function checkPWSStoreIncorrectVersion(param){
	var majorVersion = PWS.Store._VERSION.major;
	try{
		++PWS.Store._VERSION.major;
		new PWS.Store(param.string, param.password);
	}catch(e){
		return e instanceof PWS.VersionError;
	}finally{
		PWS.Store._VERSION.major = majorVersion;
	}
}

function checkPWSStoreStructureCorrect(param){
	var store = new PWS.Store(param.string, param.password);
	var result = 1;
	result &= '63528bb124a80bf930b4adb26834ad61d9287b54e134fb8e79d228adca842903' === store._salt.toString();
	result &= 2048 === store._iter;
	result &= 'f847dcf647e4c3d13b898ff26f0d8e2d30aabdfd0db13b749da9444264c841ff' === store._stretchedKeyHash.toString();
	result &= '7d94cb111c2f06b664ed8a9aa056cbbcf89e5d4586d837879dd91ada33beaef0' === store._b1b2.toString();
	result &= 'ed71c2e7db8ebe44ad38a03ecf45178b779b3204ea202de134be37d575682508' === store._b3b4.toString();
	result &= '32761bfbc738717b6a5e0feb0d7158b1' === store._iv.toString();
	result &= '3218573ea012aad76143fbc63f3c33431f9b68e0a5f06dfe4e7c8afb4f30260cbde45e6899cbf6c84f9e3b9a4dc2cfa1f3d787ad7802ea6fe473df1902d7cccf1e245b3e628ccaaa4ebde3a637bdba5aa3c7a91a3c4a4917a3d5e4a6c9ecf8ca1f8dd9ab414515b21e995a77b0f1a9bff9b2ec6814900038106fbb316f930313eaa526acb3f27977b89a9f01bb31a4ad2d435098852dbaca4cde79b00f74bde7036942f36212ac147d10f1056570e74a81b9e7fa698a6a772e420b54f942db7ce3a228dd271a239d5b95cd8090a8b4f51da676bfc4e03eed532d7fdfe4853093ba1cfa9f4bd5a43db85aca6101eb1d1aacab21e529bf0456d7c972eca3a0fc9fce88a24cca5f5746abcd5fe780ef663254b12bfb6d2e89698ed41fe847044266c915fc0d558d2cf0782e02ddd286fada68cab5c0ae1babe96c6ba7d9d6d0702ad9bae768aaabb69ab38924e3d98cc8c14245df935a8af348cd553d4867720d70a3c7e7faaa4307746ebf4b9e6c12517a811642ee293e709e577727cb5861d694c6deb63abe19edfdd601aaf3169a39f6bf0f5e4747bafce867bee84b02823f8deeefbf84b3ef546a96f229e73ffb61d2a413efe903883b37136ac88078f3f59601c3923a8a21e30ef8d9d1dd585cfe8252df54d738276916cba6e729fd6e6f067978798cfdce3bff26a899608081279a4dcd5e67ef011b756534ac5104d7cb2c0d0b68b3d7e17bec61e851a29e14857cca594a704829c9545e060634a47b1b9bbd65551b5ac1d7e302146c7cbc3d0efd9c69529ccad9a4f3ea9734049e7ba3fcc84beb23d4e55636aa75f3c0b19ca443220d85a10af1f2dafec672d04abdaef024f4b6e40e6fbd7ca6988d28d27d986f30ddc26663cf974050e8771a531e47a2ee4272c98ad005cd30d853d38fd54f53b5b624988c293b6860313325e8e1319704c5910ed55bf5c121f0b9b1aa782f146634a1354134b6b5d54baf5996b3ac74c900c4318fa36808138f326a1abf21ce2edb7b0304f73cbd435d0f3eb1c128f0a982274fd45fe25d62a2bd529ffbc76cbfab80bf6adf2903bb7d50f1c28388cd0555378f5dc385fa415b0e1467eeed85a2528cd494048e82088ef5b46ba71626b1286548926e9ded0cb2017f3d63399523f81dc7a28cb879d288f6e8bd968c903ded05be21723b870f11b11a9af66f5056d4753b70b66b9befb367bda31bea7d068fd87d301e8a04d32cd38eea4c26aec0ab3bfdc442e5d397fddede3499260a8b2dacf937ea3a2272ce56475546d1401d208d4e2386a0cd3dc901a0b22af62ed07129b863677d5dbb7789ec8eb1b01a63c9655a73ddfe54c86da4c6726218ae8305ccefe59011d838b35b97c66146df4fb6c38e89c2d0b5d604b92d67858f5836c0f967a5a560303ebefd4a23588d8541a7b2bac9e9a86f181ed974f955caa81637d86e0d59c01e431630b756adf39903d283f316c118ce692e9c77125e1c881ad8e791256f10056ed08e7664aa0f4a499c053341edbc351e2f26d5c4f9558c' === store._ciphertext.toString();
	result &= 'c27a9136cfc788b2bf73eba6274366b891355b017b2fff8d04528db3e7f95c06' === store._hmacValue.toString();
	return !!result;
}

function checkPWSStoreTooFewIterations(param){
	try{
		new PWS.Store(param.string, param.password);
	}catch(e){
		return e instanceof PWS.TooFewIterationsError;
	}
}

var helper = require('./djangocasper.js');
helper.scenario(
	'/',
	function(){
		this.test.assert(true);
	},
	function(){
		this.test.assertEval(checkPWSStoreIncorrect, 'Constructing with nothing causes `PWS.Error`', {
			string: '',
			password: PASSWORD
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreIncorrect, 'Constructing with string without "TAG" causes `PWS.Error`', {
			string: '',
			password: PASSWORD
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreTooFewIterations, 'Too small "ITER" value causes `PWS.TooFewIterationsError`', {
			string: PWS_STORE_STRING_TOO_FEW_ITERATIONS,
			password: PASSWORD
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreStructureCorrect, 'Correctly structured PWS.Store string is being read', {
			string: PWS_STORE_STRING,
			password: PASSWORD
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreIncorrectPassword, 'Incorrect password causes `PWS.IncorrectPasswordError`', {
			string: PWS_STORE_STRING,
			password: 'topsecret'
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreIncorrectHmac, 'Incorrect HMAC causes `PWS.HmacError`', {
			string: PWS_STORE_STRING_INCORRECT_HMAC,
			password: PASSWORD
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreIncorrectVersion, 'Incorrect version causes `PWS.VersionError`', {
			string: PWS_STORE_STRING,
			password: PASSWORD
		});
	},
	function(){
		this.test.assertEval(checkPWSStoreHeader, 'Header is being read properly', {
			string: PWS_STORE_STRING_RICH_HEADER,
			password: PASSWORD
		});
	}
);
helper.run();