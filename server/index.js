import {Server }  from "socket.io"
import express from "express"
import  http from "http"
import cors from "cors"
import { generalHandler } from "./helpers.js"

function initServer(){
	const app = express();
	app.use(cors({
		origin : "*"
	}));
	const server = http.createServer(app);
	const io = new Server(server,{
		cors: {
		  origin: "*"
		}
	  });
	return [server,io,app]
}

const [server,socket,app] = initServer();



const rooms = {
	"room1" : [],
	"room2" : []
}


socket.on("connection" , s => {
	s.on("message", (params) => {
		console.log("socket id is :  " , s.id)
		console.log(params);
		let room = params.room;
		
		if (room && rooms[room].includes(s.id)){
			console.log("found user")
			socket.in(room).emit("message",{
				"sender" : s.id,
				message : params.message
			})
		}
	})
	s.on("join" , params => {
		console.log(params);
		let r = params.room;
		if (r) {
			if (Object.keys(rooms).includes(r)){
				rooms[r].push(s.id);
				s.join(r);
			}
			
		}
	})

	console.log('received login now sending id')

	socket.to(s.id).emit("socketid",{
		socketid : s.id
	})

});




server.listen(3000, () => {
	console.log('listening on *:3000');
  });

// logic here








