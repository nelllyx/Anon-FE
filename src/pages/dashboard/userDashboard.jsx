const Home = ()=>{
    return(
        <div className=" bg-white flex w-screen gap-12 h-screen">
            <div className="flex flex-col w-65  p-4" style={{backgroundColor: '#111827'}}>
                <div className="flex">
                <h2 className="text-white text-2xl font-bold p-4 mt-5">Anonymous Therapy</h2>
                </div>
            <div className="mt-4">
                <ul className="list-none space-y-2 w-59">
                <li className="cursor-pointer text-gray-500 p-4 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white">
                    <i className="fa-solid fa-grind-horizontal"></i>Dashboard</li>
                <li className="cursor-pointer text-gray-500 p-4 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4">
                <i className="fa-solid fa-message"></i> Chat</li>
                <li className="cursor-pointer text-gray-500 p-4 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4">
                <i className="fa-solid fa-square-h"></i>  Talk to a therapist</li>
                <li className="cursor-pointer text-gray-500 p-4 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4">
                <i className="fa-brands fa-blogger"></i>  Blog</li>
                <li className="cursor-pointer text-gray-500 p-4 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4">
                <i className="fa-solid fa-user"></i>    Profile</li>
                <li className="cursor-pointer text-gray-500 p-4 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4">
                <i className="fa-solid fa-credit-card"></i>   Payments </li>
                <li className="cursor-pointer text-gray-500 p-4 mt-8 transition duration-300 ease-in-out hover:scale-105 rounded flex items-center shadow-sm hover:bg-gray-500 hover:text-white gap-4">
                <i className="fa-solid fa-right-from-bracket"></i>  Logout</li>
                </ul>
            
            </div>
            
            </div>
       <div className="flex flex-col w-full p-4 ">
        <div className="flex">
        <div className="mt-3">
        <h1 className="text-2xl font-mono font-bold">Welcome Back, dadaBoy</h1>
        </div>

        <div className="ml-auto rounded-full bg-gray-300 flex items-center justify-center w-16 h-16 mt-3">
        <span>0</span>
        </div>
        </div>


        <div className="flex mt-8 gap-10">
            <div className="">
                <h2 className="text-xl font-semibold mb-4">Upcoming Session</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p>Therapist Name: Akewe Nelson</p>
                    <p className="mt-5">Date: 23-04-2025</p>
                    <p className="mt-5">Time: 6:00 pm</p>
                    <button className="mt-9 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">  
          Reschedule  
        </button>  

                </div>
            </div>

            <div className="">
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p>Therapist Name: Akewe Nelson</p>
                    <p className="mt-5">Date: 23-04-2025</p>
                    <p className="mt-5">Time: 6:00 pm</p>
                    <button className="mt-9 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">  
          Reschedule  
        </button>  

                </div>
            </div>

            <div className="">
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p>Therapist Name: Akewe Nelson</p>
                    <p className="mt-5">Date: 23-04-2025</p>
                    <p className="mt-5">Time: 6:00 pm</p>
                    <button className="mt-9 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">  
          Reschedule  
        </button>  

                </div>
            </div>

        </div>
      
       </div>

       

        </div>
    )
}

export default Home 