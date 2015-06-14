var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite		DATABASE_URL 0 sqlite://:@:/

// postgres://scfupybsrnhokd:aqH0-C2ivK1FUurZYNxdzUlqnv@ec2-54-83-46-91.compute-1.amazonaws.com:5432/d321iijfolbok7
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name		= (url[6]||null);
var user			= (url[2]||null);
var pwd				= (url[3]||null);
var protocol	=	(url[1]||null);
var dialect		= (url[1]||null);
var port			= (url[5]||null);
var host			= (url[4]||null);
var storage		= process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd,
															{dialect:		dialect,
															 protocol:	protocol,
															 port:			port,
															 host:			host,
															 storage:		storage,	// solo SQLite (.env)
															 omitNull:	true,			// solo Postgres
															}
														 );

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definicion de la tabla Quiz

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function (){
	// then(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if (count === 0) { // la tabla se inicializa solo si esta vacía
			Quiz.create({pregunta: 'Capital de Italia',
									 respuesta: 'Roma'
									})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});
});
