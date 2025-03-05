import styles from "../../styles/mainContainer.module.scss"
import Navigation from "../navigation";
import ProjectContent from "../projectContent";
const MainContainer = () => {
 
    
    return (
        <div className={styles.mainContainer}>
            <h1 className={styles.title}>title</h1>
            <div className={styles.content}>
                <Navigation />
                <ProjectContent />
            </div>
        </div>
    )
};

export default MainContainer;