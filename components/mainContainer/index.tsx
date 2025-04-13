import styles from "../../styles/mainContainer.module.scss"
import Footer from "../footer";
import ProjectContent from "../projectContent";
// import Image from "next/image";
const MainContainer = () => {
 
    
    return (
        <div className={styles.mainContainer}>
            {/* <img src="/logo.png" alt="logo" width={100} height={100}></img> */}
            <h1 className={styles.title}>Project menager</h1>
                <ProjectContent />
                <Footer></Footer>
        </div>
    )
};

export default MainContainer;