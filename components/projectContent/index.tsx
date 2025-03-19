'use client';
import styles from "@/styles/elements.module.scss";
import data from "@/data/projects.json";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import Popup from "../popup";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
interface Task {
  id: string;
  label: string;
  description: string;
  status: string;
  assigned_to: string;
  project_id: string;
  created_at: string;
}
export default function ProjectContent() {
  const [selectedProject, setSelectedProject] = useState('');
  const projects = data.projects;
  const [changeState, setChangeState] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskLabel, setTaskLabel] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [createNewTask, setCreateNewTask] = useState(false);
  const [projectSettings, setProjectSettings] = useState(false);

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
  console.log(labels2);
  const labels = ['To Do', 'In Progress', 'Done', 'chuj'];

  function deleteTaskFromTasks(id: string) {
    setTasks(tasks.filter((task: Task) => task.id !== id));

    // miejsce na request 
  }
  function changeTaskStatus(id: string, taskStatus: string) {
    setTasks(tasks.map((task: Task) => {
      if (task.id === id) {
        return { ...task, status: taskStatus };
      }
      return task;
    }));
  }

  function changeTaskLabel(id: string, taskLabel: string, taskDescription: string) {
    setTasks(tasks.map((task: Task) => {
      if (task.id === id) {
        return { ...task, label: taskLabel, description: taskDescription };
      }
      return task;
    }));
  }

  function addNewTask() {
    setTasks([...tasks, {
      id: selectedTaskId,
      label: taskLabel,
      description: taskDescription,
      status: taskStatus,
      assigned_to: "",
      project_id: selectedProject,
      created_at: new Date().toISOString()
    }]);

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
          <div className={styles.projectHeader}>
            <div className={styles.projectInfo}>
              <h2>{projects.find((project: Project) => project.id === selectedProject)?.name || 'No project selected'}</h2>
              <p>
                {projects.find((project: Project) => project.id === selectedProject)?.createdAt || ''}
              </p>
            </div>
            <div className={styles.projectActions}>
              <div className={styles.projectSettingsPopup}>
                {projectSettings &&
                  <div className={styles.settings}>
                    <button>change project name</button>
                    <button>menage members</button>
                    <button>delete project</button>
                  </div>
                }
              </div>
              {projects.find((project: Project) => project.id === selectedProject)?.name && (
                <button className={styles.projectSettings}
                  onClick={() => {
                    setProjectSettings(!projectSettings);
                  }}>
                  <MoreHorizIcon fontSize="large" />
                </button>
              )}


            </div>
          </div>
          {projects
            .filter((project: Project) => project.id === selectedProject)
            .map((project: Project) => (
              <div key={project.id} className={styles.task}>
                {
                  labels.map((label, index) => {
                    return <div className={styles.toDo} key={index}>
                      <div className={styles.taskHeader}>
                        <h3>{label}</h3>
                        <button onClick={() => {
                          setCreateNewTask(!createNewTask);
                          setTaskLabel('');
                          setTaskDescription('');
                          const newTaskId = tasks.map((task: Task) => task.id).length + 1;
                          setSelectedTaskId(newTaskId.toString());
                        }}>
                          <AddIcon />
                        </button>
                      </div>
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
                                {/* <button>
                                  
                                </button> */}


                                <button onClick={() => {
                                  setChangeState(!changeState);
                                  setSelectedTaskId(task.id);
                                  setTaskDescription(task.description);
                                  setTaskLabel(task.label);
                                }}>
                                  <DescriptionIcon />
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
          {changeState &&
            <Popup closeButton={() => setChangeState(!changeState)}>
              <div className={styles.changeTask}>

                <div className={styles.changeState}>
                  <label htmlFor="state">change state</label>
                  <select name="state" id="state" onChange={(e) => {
                    changeTaskStatus(selectedTaskId, e.currentTarget.value)
                    console.log(e.currentTarget.value);
                  }}>
                    {labels.map((label, index) => {
                      return <option key={index} value={label.toLowerCase()}>{label}</option>
                    })}
                  </select>
                </div>

                <div className={styles.changeLabel}>
                  <label htmlFor="taskLabel">change task label</label>
                  <input
                    name="taskLabel"
                    id="taskLabel"
                    defaultValue={tasks.find((task: Task) => task.id === selectedTaskId)?.label || ''}
                    onChange={(e) => {
                      setTaskLabel(e.currentTarget.value);
                    }}
                  />
                  <div className={styles.changeDescription}>
                    <label htmlFor="taskDescription">change task description</label>
                    <textarea
                      name="taskDescription"
                      id="taskDescription"
                      defaultValue={tasks.find((task: Task) => task.id === selectedTaskId)?.description || ''}
                      onChange={(e) => {
                        setTaskDescription(e.currentTarget.value);
                      }}
                    />
                  </div>



                  <button className={styles.saveButton}
                    onClick={() => {
                      changeTaskLabel(selectedTaskId, taskLabel, taskDescription)
                      console.log(taskLabel, taskDescription);
                      setChangeState(!changeState);

                    }}>
                    save
                    <SaveOutlinedIcon />
                  </button>
                </div>
              </div>
            </Popup>
          }
          {createNewTask &&
            <Popup closeButton={() => setCreateNewTask(!createNewTask)}>
              <div className={styles.changeTask}>

                <div className={styles.changeState}>
                  <label htmlFor="state">set state</label>
                  <select name="state" id="state" onChange={(e) => {
                    setTaskStatus(e.currentTarget.value);
                  }}>
                    <option value="---">---</option>
                    {labels.map((label, index) => {
                      return <option key={index} value={label.toLowerCase()}>{label}</option>
                    })}
                  </select>
                </div>

                <div className={styles.changeLabel}>
                  <label htmlFor="taskLabel">set task label</label>
                  <input
                    name="taskLabel"
                    id="taskLabel"
                    defaultValue={tasks.find((task: Task) => task.id === selectedTaskId)?.label || ''}
                    onChange={(e) => {
                      setTaskLabel(e.currentTarget.value);
                    }}
                  />
                  <div className={styles.changeDescription}>
                    <label htmlFor="taskDescription">set task description</label>
                    <textarea
                      name="taskDescription"
                      id="taskDescription"
                      defaultValue={tasks.find((task: Task) => task.id === selectedTaskId)?.description || ''}
                      onChange={(e) => {
                        setTaskDescription(e.currentTarget.value);
                      }}
                    />
                  </div>



                  <button className={styles.saveButton}
                    onClick={() => {
                      addNewTask();
                      setCreateNewTask(!createNewTask);
                    }}>
                    save
                    <SaveOutlinedIcon />
                  </button>
                </div>
              </div>
            </Popup>
          }
        </div>
      </div>
    </div>
  );
}
