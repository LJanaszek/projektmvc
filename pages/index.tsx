import MainContainer from "@/components/mainContainer";
import styles from "@/styles/Home.module.scss";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Home() {

  const [userName, setUserName] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/auth/user")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUserName(data.user.username);
        }
        else {
          router.push("/login")
        }
      })
      .catch(error => { console.error(error); router.push("/login") });
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
            .then(() => router.push("/login"))}>
          <LogoutIcon />
        </button>
      </div>


    </>
  );
}


