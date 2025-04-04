import { useEffect, useState } from "react"

const Register = ()=>{

    const [isValid , setValid] = useState(false)
    const [user, setUser] = useState({
        username:'',
        password:'',
        confirmPass:'',
        email:'',
        gender:false
    })
    const validate =()=>{
        setValid(user.username.trim().length>2 && (user.password.trim().length>7 && user.confirmPass.trim().length>7 && user.password === user.confirmPass)&& user.email.endsWith('mail.com'))

    }
    useEffect(function(){
        validate()
    },[user.username,user.password, user.confirmPass, user.email, user.gender])
    return(
        <div className="flex w-full bg-white bg-opacity-75 bg-white min-h-screen">
            <div className="lg:flex flex-col w-[25%] bg-stone-200 hidden ">
                <div className="w-full h-screen">
                <h3 className="p-8 mt-2 font-bold text-blue-600">Anonymous Therapy</h3>

                </div>

            </div>

            <div className="flex flex-grow ">
                <div className="w-full flex justify-center p-15">
                    <div className="justify-center">     
                    <p className="text-black text-2xl font-sans p-3 text-center text-blue-600">Create a free account</p>
                    <span className="text-black p-25 text-nowrap">Please provide your valid credentials</span>

                    <form className="max-w-lg mx-auto p-3">

                        <div className="mb-2 px-4 mt-5">
                            <label htmlFor="username" className="block text-sm font-mono text-5xl mb-2">Username</label>
                            <input type="name"
                                    name="username"
                                    value={user.username}
                                    className="shadow apperance-none border rounded-lg w-full py-3 px-5 h-11 text-gray leading-tight "
                                    placeholder="dadaBoy"
                                    required
                                    onChange={function(e){setUser(()=>({...user,username:e.target.value}))}}

                            />
                        </div>


                        <div className="mb-2 px-4 mt-5">
                            <label htmlFor="email" className="block text-sm font-mono text-5xl mb-2">Email</label>
                            <input type="email"
                                    name="email"
                                    value={user.email}
                                    className="shadow apperance-none border rounded-lg w-full py-3 px-5 h-11 text-gray leading-tight "
                                    placeholder="example@gmail.com"
                                    required
                                    onChange={function(e){setUser(()=>({...user,email:e.target.value}))}}

                            
                            />
                        </div>



                        <div className="mb-2 px-4 mt-5">
                            <label htmlFor="password" className="block text-sm font-mono text-5xl mb-2">Password</label>
                            <input type="password"
                                    value={user.password}
                                    name="password"
                                    className="shadow apperance-none border rounded-lg w-full py-3 px-5 h-11 text-gray leading-tight "
                                    placeholder="****"
                                    required
                                    onChange={function(e){setUser(()=>({...user,password:e.target.value}))}}

                            />
                        </div>


                        <div className="mb-2 px-4 mt-5">
                            <label htmlFor="password" className="block text-sm font-mono text-5xl mb-2">Confirm Password</label>
                            <input type="password"
                                    value={user.confirmPass}
                                    name="confirmPass"
                                    className="shadow apperance-none border rounded-lg w-full py-3 px-5 h-11 text-gray leading-tight "
                                    placeholder="*****"
                                    required
                                    onChange={function(e){setUser(()=>({...user,confirmPass:e.target.value}))}}

                            
                            />
                        </div>
                          
                        <div className="flex items-center mb-6 px-4 mt-5">  
  
  <label htmlFor="gender" className="flex items-center cursor-pointer p-3 text-sm font-mono text-gray-700 bg-white">  
    <span className="mr-2 font-mono text-sm text-5xl">Gender</span>  
  </label>  

  <div className="flex items-center mr-4">  
    <input  
      type="radio"  
      id="male"  
      name="gender"  
      value="male"  
      required  
      className="mr-2 cursor-pointer"  
      onClick={function(){setUser(()=>({...user,gender:true}))}}

      checked={user.gender}
    />  
    <label htmlFor="male" className="cursor-pointer text-gray-700">Male</label>  
  </div>  

  <div className="flex items-center">  
    <input  
      type="radio"  
      id="female"  
      name="gender"  
      value={user.gender} 
      checked={!user.gender} 
      onClick={function(){setUser(()=>({...user,gender:false}))}}
      required  
      className="mr-2 cursor-pointer"  
    />  
    <label htmlFor="female" className="cursor-pointer text-gray-700">Female</label>  
  </div>  
</div>

                    <div className="flex items-center justify-center">
                        <button 
                        type='submit' disabled={isValid}
                        className={`text-white font-bold py-2 px-4 mt-3 rounded-lg focus:outline-none focus:shadow-outline w-full ${isValid?'bg-emerald-500':'bg-gray-200'}`}
                        >
                        
                            Proceed
                        </button>

                    </div>

                    </form>
                    </div>
                </div>
               </div>

        </div>
    )
}

export default Register 