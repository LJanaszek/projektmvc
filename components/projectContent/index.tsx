'use client';
import styles from "@/styles/elements.module.scss";
import data from "@/data/projects.json";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import RedoIcon from '@mui/icons-material/Redo';
import DescriptionIcon from '@mui/icons-material/Description';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
interface Task {
  id: string;
  label: string;
  status: string;
  assigned_to: string;
  project_id: string;
  created_at: string;
}
export default function ProjectContent() {
  const [selectedProject, setSelectedProject] = useState('');
  const projects = data.projects;

  // const tasks = useRef(data.tasks);
  const [tasks, setTasks] = useState(data.tasks);
  const labels2 = [
    {
      order: "1",
      projectId: "",
      label: ""
    }, {
      order: "3",
      label: ""
    }, {
      order: "2",
      label: ""
    }, {
      order: "4",
      label: ""
    }
  ]
  const labels = ['To Do', 'In Progress', 'Done', 'chuj'];

  function deleteTaskFromTasks(id: string) {
    setTasks(tasks.filter((task: Task) => task.id !== id));

    // miejsce na request 
  }
  function changeTaskStatus(id: string, status: string) {
    setTasks(tasks.map((task: Task) => {
      if (task.id === id) {
        return { ...task, status: status };
      }
      return task;
    }));
  }

  return (
    <div className={styles.projects}>
      <div className={styles.navigation}>
        <h2>Projects</h2>
        <ul className={styles.projectList}>
          {projects.map((project: Project) => (
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
          <h2>{projects.find((project: Project) => project.id === selectedProject)?.name || 'No project selected'}</h2>
          <p>
            {projects.find((project: Project) => project.id === selectedProject)?.createdAt || ''}
          </p>
          {projects
            .filter((project: Project) => project.id === selectedProject)
            .map((project: Project) => (
              <div key={project.id} className={styles.task}>
                {
                  labels.map((label, index) => {
                    return <div className={styles.toDo} key={index}>
                      <h3>{label}</h3>
                      <ul>
                        {tasks.filter((task: Task) =>
                          task.project_id === selectedProject &&
                          task.status === label.toLowerCase())
                          .map((task: Task, index: number) => (
                            <div key={index} className={styles.taskSingleRow}>
                              <p>
                                {task.label}
                              </p>
                              <div className={styles.taskNav}>
                                <button>
                                  <DescriptionIcon />
                                </button>


                                <button onClick={()=>{
                                  changeTaskStatus(task.id, task.status)
                                }}>
                                  <RedoIcon />
                                </button>




                                <button onClick={() => {
                                  deleteTaskFromTasks(task.id);
                                }}>
                                  <CloseIcon />
                                </button>
                              </div>
                            </div>
                          ))}
                      </ul>
                    </div>
                  })
                }
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
