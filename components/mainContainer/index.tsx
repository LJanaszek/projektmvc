import Image from "next/image";
import styles from "../../styles/mainContainer.module.scss"
import Footer from "../footer";
import ProjectContent from "../projectContent";
// import Image from "next/image";
const MainContainer = () => {
 
    
    return (
        <div className={styles.mainContainer}>
            <Image src="/logo.png" alt="logo" width={280} height={120} />
            
                <ProjectContent />
                <Footer></Footer>
        </div>
    )
};

export default MainContainer;