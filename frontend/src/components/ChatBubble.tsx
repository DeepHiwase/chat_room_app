const ChatBubble = ({ message }: { message: string; }) => {
  return (
    <div className="p-4 text-black bg-white rounded-4xl">
      {message}
    </div>
  )
}

export default ChatBubble