import styles from './HeroSection.module.css'
const HeroSection = ()=>{
    return (
        <div className={`${styles.hero_bg} w-full flex flex-col items-center justify-end text-blue-700 mt-3 p-18`}>
            <h1 className={`${styles.custom_p} tracking-wide leading-loose` }>Need someone to talk to? Our Therapist are standing by. <br/>
            Your mental health is our priority</h1>
        </div>
    )
}   

export default HeroSection