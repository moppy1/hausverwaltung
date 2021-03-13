const  mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'ms3.bplaced.net',
  user     : 'ms3',
  password : 'robert',
  database : 'ms3'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});
 
connection.end();