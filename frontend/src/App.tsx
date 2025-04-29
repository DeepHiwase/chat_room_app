import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import ChatBubble from "./components/ChatBubble";

const App = () => {
  const [inputMessage, setInputMessage] = useState<string>('')
  const [chats, setChats] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    
    ws.onclose = () => {
      console.log("Connection disconnected!");
    }

    ws.onerror = (err) => {
      console.error(err);
    }

    ws.onmessage = (message) => {
      setChats(c => c.concat(message.data));
    }

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'join',
        payload: {
          roomId: 'red'
        }
      }))
    }

    setSocket(ws);

    return () => {
      ws.close();
    }
  }, [])
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket?.send(JSON.stringify({
      type: 'chat',
      payload: {
        message: inputMessage
      }
    }));
    setInputMessage('')
    // window.scrollTo(0, document.body.scrollHeight)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
  }

  return (
    <div className="bg-black w-screen h-screen flex flex-col items-center justify-center relative">
      <div id="ChatsBox" className="h-[85%] w-[700px] flex flex-col gap-1 items-end overflow-auto ">{chats.map((chat, index) => (
        <ChatBubble key={index} message={chat} />
      ))}</div>
      <form onSubmit={handleSubmit} className="flex gap-4 absolute bottom-0 bg-black">
        <input type="text" placeholder="Chat here..." value={inputMessage} onChange={handleChange} className="bg-white p-4 rounded focus:border-white w-[600px]" />
        <button type="submit" className="text-black bg-gray-300 px-6 rounded ">Send</button>
      </form>
    </div>
  )
}

export default App