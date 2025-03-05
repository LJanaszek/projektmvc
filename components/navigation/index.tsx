import { fetchProjects } from "@/pages";
import { useEffect, useState } from "react";
import styles from "@/styles/elements.module.scss";
export interface NavigationProps {
    onClick?: (x: any) => void
}
export default function Navigation() {
    const [projectName, setProjectName] = useState('');
    const projects = JSON.parse(fetchProjects());
    useEffect(() => {
        if (projectName) {
            window.location.href = `/projects/${projectName}`;
        }
    })
    return (
        <div className={styles.navigation}>
            <h2>Projects</h2>
            <ul>
                {projects.map((project: any) => (
                    <li key={project.id}
                        onClick={() => setProjectName(project.name)}>
                        {project.name}
                    </li>
                ))}
            </ul>

        </div>
    );
}