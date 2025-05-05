import atpng from "../../assets/atpng.png"
const NavBar = ()=>{
    return(
        <div className="flex  justify-around gap-5 p-5 items-center md:flex-row  h-[50px]">
            <div className="">
                <img src={atpng} alt="logo" style={{width: '100px', height: '50px'}}></img>
            </div>
            <ul className="flex justify-space-end gap-30 items-center w-full">
                <li className="cursor-pointer">Home</li>
                <li className="cursor-pointer">About Us</li>
                <li className="cursor-pointer">Blog</li>
                <li className="text-red font-bold cursor-pointer">Book a Session</li>

            </ul>
            <div>
            <button 
            className="bg-blue-500 font-bold px-6 rounded-lg w-[130px] transition duration-300 text-white cursor-grab "
            onClick={()=>{window.location.href="/register"}}
            >Sign Up</button>
            </div>
            
        
        </div>
    )
}

export default NavBar