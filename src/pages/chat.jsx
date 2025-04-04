const Chat = ()=>{
    return (
        <div className="flex flex-col h-screen bg-gray-100"> 

        <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-semi-bold text-center">With love from the team</h1>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">

            <div className="flex mb-4">
            <div class="bg-white rounded-lg p-3 max-w-[70%]">  
        <p class="text-gray-800">Hello! How can I help you today?</p>  
        <span class="text-xs text-gray-500">10:00 AM</span>  
        </div>  
            </div>

            <div class="flex mb-4 justify-end">  
      <div class="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">  
        <p>Hi, I need assistance with my account.</p>  
        <span class="text-xs text-gray-200">10:01 AM</span>  
      </div>  
    </div>  


    <div class="flex mb-4">  
      <div class="bg-white rounded-lg p-3 max-w-[70%]">  
        <p class="text-gray-800">Sure! Can you provide your account details?</p>  
        <span class="text-xs text-gray-500">10:02 AM</span>  
      </div>  
    </div>  
  </div>  

    <div class="bg-white p-4 border-t border-gray-200">  
    <div class="flex gap-2">  
      <input  
        type="text"  
        placeholder="Type a message..."  
        class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"  
      />  
      <button class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">  
        Send  
      </button>  
    </div>  
  </div>  

        </div>

    
    )
}

export default Chat 