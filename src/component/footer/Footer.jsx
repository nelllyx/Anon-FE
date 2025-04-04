const Footer = ()=>{
    return(
    
<div className="flex justify-around p-4 mt-9 ">

    <div className="flex flex-col text-center w-[40%]">
        <h5 className="p-3 font-bold text-lg uppercase text-yellow-500 ">About Us</h5>
        <hr className="mb-4 border-gray-400 border-t-1"></hr>
        <p className="mt-3">Annonymus Theraphy</p>
		<p className="mt-3">Contact Us</p>
		<p className="mt-3">FAQ</p>
		<p className="mt-3">Terms and Condition</p>
    </div>

    <div className="flex flex-col text-center w-[30%]">
    <h5 className="p-3 font-bold text-lg  text-yellow-500 ">Get Started</h5>
    <hr className="mb-4 border-gray-400 border-t-1"></hr>
    <p className="mt-3">
		<a href="#" class="text-dark" >Theraphy</a>
	</p>
	<p className="mt-3">
		<a href="#" class="text-dark" >Blog</a>
	</p>
	<p className="mt-3">
	    <a href="#" class="text-dark" >Payment link</a>
	</p>
	<p className="mt-3">
	    <a href="#" class="text-dark" >Your accounts</a>
    </p>
    </div>

    <div className="flex flex-col text-center w-[30%] ">
    <h5 className="p-3 font-bold text-lg  text-yellow-500  ">Let us help</h5>
    <hr className="mb-4 border-gray-400 border-t-1 "></hr>
    <p className="mt-3">24/7 Online support</p>
    <p className="mt-3">
        <a href="#" class="text-dark">Help Center</a>
	</p>
       
    </div>
    

</div>


    )
}

export default Footer