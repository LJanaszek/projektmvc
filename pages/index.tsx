import MainContainer from "@/components/mainContainer";
import styles from "@/styles/Home.module.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from "react";


export default function Home() {
  const [userName, setUserName] = useState(false);
  useEffect(() => {
    fetch("/api/auth/user")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserName(data.user.username);
        }
        else {
          window.location.href = "/login"
        }
      })
      .catch(error => { console.error(error); window.location.href = "/login" });
  }, [])
  return (
    <>

      <MainContainer />
      <div className={styles.userInfo}>
        <h3>
          Hello {userName}
        </h3>

        <button onClick={() =>
          fetch("/api/auth/logout")
            .then(() => window.location.href = "/login")}>
          <LogoutIcon />
        </button>
      </div>


    </>
  );
}


