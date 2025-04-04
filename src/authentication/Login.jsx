import phone from "../assets/loginPhoto.jpg"
import { Link } from "react-router-dom"

const Login = ()=>{
    return(
       <div className="flex  justify-center bg-white w-full h-screen p-9 ">

        <div className="flex  justify-items-center rounded border border-gray-300  h-full ">
          <div className="w-[45%] ">
          <img
                      src={phone}
                      alt="female therapist"
                      className="w-full h-full"
                    ></img>
          </div>
          <div className="w-[55%] p-10 ">
            <div className="w-98 mt-8">
              <span className="text-yellow-400 font-sans text-4xl font-bold tracking-wide">Anonymous Therapy</span>
              <p className="mt-4 font-mono">Sign into your account</p>
            </div>
            <form className="max-w-lg mx-auto">
            <div className="mb-2 mt-5 w-98">
                            <label htmlFor="Email" className="block font-serif  mb-3">Email Address</label>
                            <input type="Email"
                                    name="Email"
                                    className="shadow apperance-none border rounded-lg w-94 py-3 px-5 h-13 text-gray border-gray-400 leading-tight "
                                    required
                            />
                        </div>

                        <div className="mb-2  mt-5 w-98">
                            <label htmlFor="username" className="block font-serif  mb-3">Password</label>
                            <input type="password"
                                    name="password"
                                    className="shadow apperance-none border rounded-lg w-94 py-3 px-5 h-13 text-gray leading-tight border-gray-400"
                                    required
                              
                            />
                        </div>


                        <div className="flex items-center justify-center ">
                        <button 
                        type='submit' 
                        className="text-white font-serif bg-black font-bold py-2 px-4 mt-3 rounded-lg focus:outline-none focus:shadow-outline w-1/2"
                        >
                        
                            Login
                        </button>

                    </div>

                  <div className="mt-12">

                  <Link to="/" className="text-gray-400 font-sans underline text-sm font-bold" >Forgot Password?</Link>  
                  <p className="text-blue-800 text-sm/7">Don't have an account? <Link to="/register" className="underline">Register Here</Link></p>
                  </div>


          </form>
          </div>
        </div>
       </div>
    )
}

export default Login 