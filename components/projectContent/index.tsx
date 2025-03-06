'use client';
import styles from "@/styles/elements.module.scss";
import data from "@/data/projects.json";
import { useEffect, useState } from "react";
import Navigation from "../navigation";

export default function ProjectContent() {
    const [selectedProject, setSelectedProject] = useState('');
    const projects = data.projects;
    const tasks = data.tasks;
    useEffect(() => {
        console.log(selectedProject);
    }, [selectedProject]);
    return (
        <div className={styles.projects}>
            <div className={styles.navigation}>
                <h2>Projects</h2>
                <ul className={styles.projectList}>
                    {projects.map((project: any) => (
                        <li key={project.id}
                            onClick={() => {
                                setSelectedProject(project.id);
                                sessionStorage.setItem('selectedProject', project.name);
                            }}>
                            {project.name}
                        </li>
                    ))}
                </ul>

            </div>
            <div className={styles.projectContent}>
                <div className={styles.tasks}>
                    <h2>{projects.find((project: any) => project.id === selectedProject)?.name}</h2>
                    {projects
                        .filter((project: any) => project.id === selectedProject)
                        .map((project: any) => (
                            <div key={project.id} className={styles.task}>
                                <div className={styles.toDo}>
                                    <h2>{project.name}</h2>
                                    <p>{project.description}</p>
                                    <p>{project.createdAt}</p>
                                    <ul>
                                        {tasks.filter((task: any) => task.project_id === selectedProject).map((task: any, index: number) => (
                                            <li key={index}>{task.status}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
