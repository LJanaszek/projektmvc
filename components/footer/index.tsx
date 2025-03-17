import styles from "@/styles/footer.module.scss"
export default function Footer() {
    const currentDate = new Date()
    return <div className={styles.footer}>&copy; {currentDate.getFullYear()}</div>
}