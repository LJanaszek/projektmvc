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
import { TextField } from "@mui/material";

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
  const [projects, setProjects] = useState(data.projects);
  const [changeState, setChangeState] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskLabel, setTaskLabel] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [createNewTask, setCreateNewTask] = useState(false);
  const [projectSettings, setProjectSettings] = useState(false);
  const [deleteProject, setDeleteProject] = useState(false);
  const [rename, setRename] = useState(false);
  const [menageMembers, setMenageMembers] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [projectName, setProjectName] = useState(data.projects.find((project: Project) => project.id === selectedProject)?.name || '');
  const [addProject, setAddProject] = useState(false);


  // const tasks = useRef(data.tasks);
  const [tasks, setTasks] = useState(data.tasks);
  const labels = ['To Do', 'In Progress', 'Done'];

  function deleteTaskFromTasks(id: string) {
    setTasks(tasks.filter((task: Task) => task.id !== id));

    // miejsce na request 
  }

  function addNewProject() {
    setProjects([...projects, {
      id: projectName,
      name: projectName,
      description: "",
      createdAt: new Date().toISOString().split('T')[0] //get current date without time
    }]);
    setSelectedProject(projectName)
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

  function renameProject() {
    setProjects(projects.map((project: Project) => {
      if (project.id === selectedProject) {
        return { ...project, name: projectName };
      }
      return project;
    }))
  }

  function deleteProjectById(id: string) {
    setProjects(projects.filter((project: Project) => project.id !== id));
  }
  return (
    <div className={styles.projects}>
      <div className={styles.navigation}>
        <div className={styles.projectHeader}>
          <h2>Projects </h2>
          <button onClick={() => {
            setAddProject(true)
            // miejsce na request do usunięcia projektu
          }}>
            <AddIcon />
          </button>
        </div>
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
              {projects.find((project: Project) => project.id === selectedProject)?.name ?
                <h2>
                  {projects.find((project: Project) => project.id === selectedProject)?.name}
                </h2> :
                <h2 className={styles.noProject}>
                  No project selected
                </h2>}

              {projects.find((project: Project) => project.id === selectedProject)?.createdAt ? <p> {projects.find((project: Project) => project.id === selectedProject)?.createdAt}</p> : <p className={styles.noProject}>please select project or create new one</p>}

            </div>
            <div className={styles.projectActions}>
              <div className={styles.projectSettingsPopup}>
                {projectSettings &&
                  <div className={styles.settings}>
                    <button onClick={() => {
                      setRename(true)
                      setOpenSettings(true)
                    }}>
                      change project name
                    </button>
                    <button onClick={() => {
                      setMenageMembers(true)
                      setOpenSettings(true)
                    }}>
                      menage members
                    </button>
                    <button onClick={() => {
                      setDeleteProject(true)
                      setOpenSettings(true)
                    }}>
                      delete project
                    </button>
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



                </div>
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
                  <div className={styles.comments}>

                    <label htmlFor="">Comments:</label>
                    <div className={styles.commentsContainer}>
                      <div className={styles.singleComment}>
                        <h4>name</h4>
                        <p>comment </p>
                      </div>
                      <div className={styles.singleComment}>
                        <h4>name</h4>
                        <p>comment </p>
                      </div>
                    </div>
                  </div>
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
          {openSettings &&
            <Popup closeButton={() => {
              setOpenSettings(false);
              setProjectSettings(false);
              setDeleteProject(false);
              setRename(false);
              setMenageMembers(false);
            }}>
              <div>
                {rename &&
                  <input type="text" defaultValue={projectName} onChange={(e) => {
                    setProjectName(e.currentTarget.value);
                  }} />
                }
                {
                  menageMembers &&
                  <div>
                    <h3>members</h3>
                    <ul>
                      {/* {members.map((member, index) => {
                        return <li key={index}>{member}</li>
                      })} */}
                    </ul>
                  </div>
                }
                {deleteProject &&

                  <div>
                    <h3>are you sure you want to delete this project?</h3>
                    <button onClick={() => {
                      deleteProjectById(selectedProject);
                      setOpenSettings(false);
                    }}>
                      Delete
                    </button>
                    <button onClick={() => {
                      setOpenSettings(false)
                      setDeleteProject(false);
                      setProjectSettings(false);
                    }}>
                      Cancel
                    </button>
                  </div>

                }
                {!deleteProject &&
                  <button className={styles.saveButton}
                    onClick={() => {
                      renameProject();
                      setProjectSettings(!projectSettings);
                      setOpenSettings(!openSettings);

                      setRename(false);
                      setMenageMembers(false);
                      setDeleteProject(false);
                    }}
                  >
                    save <SaveOutlinedIcon />
                  </button>
                }
              </div>
            </Popup>
          }
          {
            addProject &&
            <Popup closeButton={() => setAddProject(false)}>
              <div className={styles.addProject}>
                <div className={styles.inputContainer}>
                  <h3>Set yout new project name</h3>
                  <TextField
                    className={styles.input}
                    type="text"
                    label="project name &nbsp; &nbsp; "
                    onChange={(e) => {
                      setProjectName(e.currentTarget.value);
                    }}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 1)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#fff',
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#000',
                      },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
                        color: '#fff',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(0, 0, 0, 1)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#fff',
                      },
                    }}

                  />
                </div>
                <button className={styles.saveButton}
                  onClick={() => {
                    if (projectName){
                      addNewProject();
                    }
                    setAddProject(!addProject);

                  }}>
                  save
                  <SaveOutlinedIcon />
                </button>
              </div>
            </Popup>
          }
        </div>
      </div>
    </div>
  );
}
