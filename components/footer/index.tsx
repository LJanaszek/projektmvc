import styles from "@/styles/footer.module.scss"
export default function Footer() {
    const currentDate = new Date()
    return <div className={styles.footer}>
        <div className={styles.content}>

            <div className={styles.creators}>
                <h3>Project created by: </h3>
                <ul>
                    <li>Sebastian Golatowski</li>
                    <li>Hubert Getter</li>
                    <li>Łukasz Janaszek</li>
                </ul>
            </div>
            {/* <div>
                <h3>Privacy Policy</h3>
                <p></p>
            </div> */}
        </div>
        <div>

            &copy; {currentDate.getFullYear()}
        </div>

    </div>
}