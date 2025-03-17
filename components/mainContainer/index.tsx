import styles from "../../styles/mainContainer.module.scss"
import Footer from "../footer";
import ProjectContent from "../projectContent";
const MainContainer = () => {
 
    
    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.title}>title</h1>
                <ProjectContent />
                <Footer></Footer>
        </div>
    )
};

export default MainContainer;