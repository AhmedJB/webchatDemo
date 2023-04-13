import React,{useState,useEffect} from 'react'
import {io} from "socket.io-client"

function Show() {

	const [sock,setSock] = useState(null);
	const [room,setRoom] = useState(["room1","room2"]);
	const [selectedRoom,setSelectedRoom] = useState(null);
	const [messages,setMessages] = useState([]);
	const [socketId,setSocketId] = useState(null);

	useEffect(() => {
		let  s = io("http://127.0.0.1:3000")
		setSock(s);
		console.log(s.id);
		s.on("message",(params)  => {
			setMessages((old) => [...old,params])
		})

		s.on("socketid",(params)=> {
			console.log(params);
			setSocketId(params.socketid);
		})

	},[])



	const sendMessage =  async (e) => {
		e.preventDefault();

		if (sock.connected){
			let inp = document.getElementById("message");
			let msg = inp.value;
			inp.value = "";
			let body = {
				room:selectedRoom,
				message :msg
			}
			console.log(body);
			sock.emit("message",body);
			//let temp = [...messages,body];
			//console.log('sent  message is ',temp)
			//setMessages(temp);
		}else{
			console.log("not connecteed")
		}
		
		
	}

	const  join = async (room) => {
		let body = {
			room
		}
		sock.emit("join",body);
		setSelectedRoom(room);

	}




  const test = () => {
	if (sock.connected){
		console.log("sending test message")
		sock.emit("message",{
			test : "hello world"
		})
	}else{
		console.log("not connected")
	}
  }

  

  const selectionPage = <>
  <div  className=' flex flex-col '>
	<h1 className="text-2xl my-6 font-semibold text-white">Select Room</h1>
	<button className="p-4 font-semibold shadow-sm rounded-[5px] text-white transition-transform hover:scale-110 cursor-pointer bg-[#0b0b0bb3] my-5" onClick={() => join("room1")}>Room1</button>
	<button className="p-4 font-semibold shadow-sm rounded-[5px] text-white transition-transform hover:scale-110 cursor-pointer bg-[#0b0b0bb3]" onClick={() => join("room2")}>Room2</button>
  </div>
  
  </>


  const roomPage = <>
  <h1 className='text-lg text-white'>Room : {selectedRoom}</h1>

  <div className="flex flex-col items-start w-full">
	{
		messages.map((e,i) => {
			return <div className={`flex flex-col my-1 w-3/6 ${socketId == e.sender ? "self-end" : ""}`}>
					<div className='p-3 shadow-lg rounded-md bg-stone-900 text-white'>
						{e.message}
					</div>	
					<p className='text-gray-500 text-sm my-3'> {e.sender === socketId ? "Me" : `Sent by ${e.sender}` } </p>
				</div>
			 
		})
	}
  </div>
  
<div className="relative overflow-x-auto shadow-md sm:rounded-lg hidden">
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-white uppercase bg-[#000000]  ">
      <tr>
        <th scope="col" className="px-6 py-3">
          Sender
        </th>
        
        <th scope="col" className="px-6 py-3">
          Message
        </th>
      </tr>
    </thead>
    <tbody>

		{
			messages.map((e,i) => {
				return <tr key={`message-${i}`} className=" border-b bg-[#262626] text-white">
					<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
						{e.sender}
					</th>
					<td className="px-6 py-4">
						{e.message}
					</td>				
				</tr>
			})
		}
      
      
    </tbody>
  </table>
</div>

<div class="w-3/5 ">
	
<form>
  <div className="mb-6">
    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Message</label>
    <input type="text" id="message" className=" text-sm rounded-lg  block w-full p-2.5 bg-stone-900 border-gray-600 placeholder-gray-400 text-white  focus:border-stone-900 outline-none" placeholder="message..." required />
  </div>
  
  <button onClick={sendMessage}  className="text-white bg-stone-700 hover:bg-stone-800 focus:ring-4 focus:outline-none focus:ring-stone-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-stone-800">Submit</button>
</form>



</div>


  
  </>



  return (
	<>
	{
		!selectedRoom &&  selectionPage
	}
	{
		selectedRoom && roomPage
	}
	</>
	
  )
}

export default Show