import { useEffect, useRef, useState } from "react"


function App() {

  const [messages, setMessages] = useState(["hii there","hello"]);
  const[currentmessages, setCurrentmessages] = useState("");
  const wsRef = useRef< WebSocket | null >()
  useEffect(()=>{
      const ws = new WebSocket("ws://localhost:8080")
      ws.onmessage = ((event)=>{
       setMessages( m=> [...m, event.data]);
      })

      wsRef.current = ws;

      ws.onopen = () =>{
        ws.send(JSON.stringify({
          type: "join",
          payload: {
            roomId: "red"
          }
        }))
      }

      return () =>{
        ws.close()
      }
  },[])

  const sendMessages =() =>{
    wsRef.current?.send(JSON.stringify({
      type: "chat",
      payload: {
        message: currentmessages
      }
    }))
  }

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      <div className="flex-grow p-4 bg-white overflow-y-auto">
        {messages.map(m => <div> {m} </div>)}
        <div className="space-y-2">
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 bg-gray-200 flex">
        <input
          value={currentmessages}
          onChange={(e)=> {setCurrentmessages(e.target.value)} }
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md" 
        onClick={sendMessages}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default App
