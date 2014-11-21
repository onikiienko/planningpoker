var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bb = require('backbone');
var _ = require('underscore');

//plugin server
app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/client/js/utils/jquery.js', function(req, res){
  res.sendfile('client/js/utils/jquery.js');
});
app.get('/client/js/utils/underscore.js', function(req, res){
  res.sendfile('client/js/utils/underscore.js');
});
app.get('/client/js/utils/backbone.js', function(req, res){
  res.sendfile('client/js/utils/backbone.js');
});
app.get('/client/js/utils/require.js', function(req, res){
  res.sendfile('client/js/utils/require.js');
});
app.get('/client/js/script.js', function(req, res){
  res.sendfile('client/js/script.js');
});
app.get('/client/js/views/startView.js', function(req, res){
  res.sendfile('client/js/views/startView.js');
});
app.get('/client/js/views/createOrJoinView.js', function(req, res){
  res.sendfile('client/js/views/createOrJoinView.js');
});
app.get('/client/js/views/loginView.js', function(req, res){
  res.sendfile('client/js/views/loginView.js');
});
app.get('/client/js/views/tableView.js', function(req, res){
  res.sendfile('client/js/views/tableView.js');
});
app.get('/client/css/styles.css', function(req, res){
  res.sendfile('client/css/styles.css');
});
app.get('/client/bootstrap/css/bootstrap.min.css', function(req, res){
  res.sendfile('client/bootstrap/css/bootstrap.min.css');
});
app.get('/client/bootstrap/css/bootstrap-theme.min.css', function(req, res){
  res.sendfile('client/bootstrap/css/bootstrap-theme.min.css');
});
app.get('/client/bootstrap/js/bootstrap.min.js', function(req, res){
  res.sendfile('client/bootstrap/js/bootstrap.min.js');
});

// create object for new gamers
// var standardCurrency = ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'infinity', '?', 'coffee'];
var standardCurrency = [{'0': 0}, {'0.5' : 1}, {'1' : 2}, {'2' : 3}, {'3' : 4}, {'5' : 5}, {'8' : 6}, {'13' : 7}, {'20' : 8}, {'40' : 9}, {'100' : 10}, {'infinity' : 11}, {'?' : 12}, {'coffee' : 13}];

// standardCurrency.set([{'0': 0}, {'0.5' : 1}, {'1' : 2}, {'2' : 3}, {'3' : 4}, {'5' : 6}, 
	// {'8' : 7}, {'13' : 8}, {'20' : 10}, {'40' : 11}, {'100' : 12}, {'infinity' : 13}, {'?' : 14}, {'coffee' : 15}]);
// var tShirtCurrency = ['0', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'infinity', '?', 'coffee'];
// var fibonacciCurrency = ['0', '1', '2', '3', '5', '8', '13', '21', '34', 'infinity', '?', 'coffee'];

var TableSocket = function(room){
	return io.of(room);
} 
var Table = bb.Collection.extend();

// create first stream for unset user
io.on('connection', function(socket){
	socket.on('enter room', function(room, typeOfCards){
		if(!socket.server.nsps[room]){
			var tableSocket = io.of(room);
			tableSocket.table = new Table;
			tableSocket.on('connection', function(socket){
				tableSocket.emit('connectionReady', standardCurrency, tableSocket.table.toJSON());
				socket.on('vote', function(hand){
					if (tableSocket.table.findWhere({'name': hand.name})){
						tableSocket.table.remove(tableSocket.table.findWhere({'name': hand.name}));
					}
					tableSocket.table.add(hand);
					tableSocket.emit('updateTable', tableSocket.table.toJSON());
				});
			});
		}
	})
})

// swich on server
http.listen(3000, function(){
  console.log('Planning started, listening on port:3000');
});