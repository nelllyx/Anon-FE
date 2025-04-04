import teen from "../../assets/young-people.jpg"

const TeenSection = ()=>{

    return(

        <div className="flex p-3 justify-between mt-3">

            <div className="w-[50%] p-4">
            <h1 className="text-3xl font-medium text-center mt-15 ">We're here for teens too</h1>
            <p className=" w-auto p-5 font-medium">
            We have free sessions available especially for teenagers from 13-17 years, 
            so you can chat confidentially whenever you need to.
			You can also join our lively teen community forums and 
            chat rooms to share with peers who understand what you're going through. 
			Get support and make new friends along the way.
            </p>
            </div>

            <div className="w-[50%] p-2 mt-4">
                <img src={teen} alt="teen pic" className="w-[95%] h-[90%]"></img>
            </div>
        
        </div>
    )
}

export default TeenSection