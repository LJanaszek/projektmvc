import styles from "@/styles/footer.module.scss"
export default function Footer() {
    const currentDate = new Date()
    return <div className={styles.footer}>
        <div className={styles.content}>
            <div className={styles.creators}>
                <h3>Project created by: </h3>
                <div className={styles.creatorsList}>
                    <div className={styles.team}>
                        <h4>Programmers:</h4>
                        <ul>
                            <li>Sebastian Golatowski - back-end developer</li>
                            <li>Łukasz Janaszek front-end developer</li>
                        </ul>
                    </div>
                    <div className={styles.team}>
                        <h4>Project Manager & Software Tester:</h4>
                        <ul>
                            <li>Hubert Getter</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div>
            &copy; {currentDate.getFullYear()}
        </div>

    </div>
}