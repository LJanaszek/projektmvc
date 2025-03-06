import styles from "@/styles/elements.module.scss";
import data from "@/data/projects.json";
export interface NavigationProps {
    onClick?: () => void
}
export default function Navigation({onClick}: NavigationProps) {
    const projects = data.projects

    return (
       <></>
    );
}