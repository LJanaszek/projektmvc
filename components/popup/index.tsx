import styles from "@/styles/popup.module.scss"
import CloseIcon from '@mui/icons-material/Close';
interface PopupProps { 
    children: React.ReactNode,
    closeButton(): void 
}
export default function Popup({children, closeButton}: PopupProps) {
    return (
        <div className={styles.popup}>
            <div className={styles.content}>
                <button className={styles.closeButton} onClick={closeButton}>
                    <CloseIcon />
                </button>
                {children}
            </div>
            
        </div>
    );
}