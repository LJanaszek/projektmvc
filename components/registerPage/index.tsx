/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import styles from "@/styles/elements.module.scss";
import data from "@/data/projects.json";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import Popup from "../popup";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TextField } from "@mui/material";
import { UserData } from "@/data/user";
import DoneIcon from '@mui/icons-material/Done';
import RemoveIcon from '@mui/icons-material/Remove';


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
  const [addProject, setAddProject] = useState(false);
  const [addedUsers, setAddedUsers] = useState();
  const [nameOccupied, setNameOccupied] = useState(false);
  const users = UserData;
  // const userId = ;
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [showMembersList, setShowMembersList] = useState(false);
  // const [userName, setUserName] = useState(false);

  // const tasks = useRef(data.tasks);
  const [tasks, setTasks] = useState([]);
  const labels = ['To Do', 'In Progress', 'Done'];
  let count =0




  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/project", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      if (res.status == 200) {
        setProjects(data)
      }
      else {
        console.log("Failed to fetch projects")
      }

    }
    fetchProjects()
  }, []);

  const fetchTasks = useCallback(async () => {
    const res = await fetch(`/api/project/${selectedProject}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()
    if (res.status == 200) {
      setTasks(data)
      console.log(data)
    }
    else {
      console.log("Failed to fetch tasks for project") 
    }

  }, [count])


  useEffect(() => {

    const addTask = async () => {
      const res = await fetch(`/api/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          label: taskLabel,
          description: taskDescription,
          status: taskStatus,
          projectId: selectedProject,



          // Moje uda, moja broń
          // Znów przesuwam po kolanie dłoń
          // Oczy na mnie, spotlight, kurtyna
          // Masti czas się dopiero zaczyna



          
        })
      })
      if (res.status == 201) {
        const data = await res.json()
        setTasks([...tasks, {
          id: data.task.id,
          label: data.task.label,
          description: data.task.description,
          status: data.task.status,
          assigned_to: "",
          project_id: data.task.projectId,
          created_at: data.task.createdAt,
        }])

      }
    }
    if (selectedProject) {
      
      console.log(selectedProject)
      if (createNewTask && taskLabel && taskDescription && taskStatus) {

        addTask();
        setCreateNewTask(false);
      }
    }
  }, [selectedProject, createNewTask, taskLabel, taskDescription, taskStatus, tasks, fetchTasks]);


  function deleteTaskFromTasks(id: string) {
    setTasks(tasks.filter((task: Task) => task.id !== id));

    
    // miejsce na request 
  }

  function menageUsers(userId: string) {


    //miejsce na request do zarządzania userami 
    // @Sebastian-Golatowski
  }

  async function addNewProject() {
    const res = await fetch("/api/project/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: projectName,
      })

    })
    if (res.status === 409) {
      console.log("name already exists")
      setNameOccupied(true);
    }
    else if (res.status === 201) {
      const data = await res.json()
      setProjects([...projects, {
        id: data.project.id,
        name: data.project.name,
        description: "",
        createdAt: data.project.createdAt //get current date without time
        //miejsce na request do dodawania nowego projektu 
        // @Sebastian-Golatowski
      }]);
      setSelectedProject(projectName);
      setNameOccupied(false);
    }
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
              onClick={(e) => {
                e.preventDefault();
                setSelectedProject(project.id);
                fetchTasks();
                count++;
                // sessionStorage.setItem('selectedProject', project.name);
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

              {projects.find((project: Project) => project.id === selectedProject)?.createdAt ? <p> {projects.find((project: Project) => project.id === selectedProject)?.createdAt.slice(0, 10)}</p> : <p className={styles.noProject}>please select project or create new one</p>}

            </div>
            <div className={styles.projectActions}>
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
            .filter((project: Project) => project.id === (projects.find((project: Project) => project.id === selectedProject)?.id))
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
                          console.log(selectedProject);
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
                  onClick={(e) => {
                    e.preventDefault();
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



                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={(e) => {
                      e.preventDefault();
                      setCreateNewTask(!createNewTask);
                    }}>
                    save
                    <SaveOutlinedIcon />
                  </button>
                </div>
              </div>
            </Popup>
          }
          {projectSettings &&
            <Popup closeButton={() => {
              setOpenSettings(false);
              setProjectSettings(false);
              setDeleteProject(false);
              setRename(false);
              setMenageMembers(false);
            }}>
              <div className={styles.projectSettingsPopup}>
                <nav>
                  <button onClick={() => {
                    setRename(true);
                    setMenageMembers(false);
                    setDeleteProject(false);
                  }}
                    style={rename ? { opacity: 0.5 } : {}}
                  >
                    Rename
                  </button>
                  <button onClick={() => {
                    setMenageMembers(true);
                    setRename(false);
                    setDeleteProject(false);
                  }}
                    style={menageMembers ? { opacity: 0.5 } : {}}
                  >
                    Members
                  </button>
                  <button onClick={() => {
                    setDeleteProject(true);
                    setRename(false);
                    setMenageMembers(false);
                  }}
                    style={deleteProject ? { opacity: 0.5 } : {}}
                  >
                    Delete
                  </button>
                </nav>
                {!rename && !menageMembers && !deleteProject &&
                  <div className={styles.noOption}>
                    <p>
                      Please select an option from the menu
                    </p>
                  </div>
                }
                {rename &&
                  <div className={styles.renameProject}>
                    <h4>Change current project name</h4>
                    <TextField
                      type="text"
                      label="Project Name"
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
                          color: '#393939',
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
                          color: '#fff',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'rgba(255, 255, 255, 0.5)',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#fff',
                        },
                      }}
                      onChange={(e) => {
                        setProjectName(e.currentTarget.value);
                      }} />
                  </div>
                }
                {
                  menageMembers &&
                  <div className={styles.members}>
                    <nav
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        margin: '0 auto',
                        marginTop: '3em',
                        gap: '3em',
                        justifyContent: 'space-evenly',
                        maxWidth: '50%'
                      }}>
                      <button onClick={() => { setShowMembersList(true) }}
                        style={showMembersList ? { opacity: 0.5 } : {}}
                      >
                        show project members
                      </button>
                      <button
                        onClick={() => { setShowMembersList(false) }}
                        style={!showMembersList ? { opacity: 0.5 } : {}}
                      >
                        menage members
                      </button>
                    </nav>
                    {showMembersList &&
                      <div>
                        <h3>Assigned users</h3>
                        {/* display assigned users */}
                      </div>
                    }
                    {!showMembersList &&
                      <div>
                        <h3>Select members to add</h3>
                        <ul>

                          {users.map((user, index) => {
                            return <li
                              key={index}
                              className={styles.member}>
                              {user.username}
                              <section>
                                {addedUsers.includes(user.id) ?
                                  <button onClick={() => {
                                    setAddedUsers(addedUsers.filter((id) => id !== user.id));
                                    menageUsers(user.id);
                                  }}>
                                    <RemoveIcon className={styles.removeIcon} />
                                  </button> : <button></button>}

                                {!addedUsers.includes(user.id) ?
                                  <button onClick={() => {
                                    setAddedUsers([...addedUsers, user.id]);
                                    menageUsers(user.id);
                                  }}>
                                    <AddIcon className={styles.addIcon} />
                                  </button> :
                                  <DoneIcon />}
                              </section>
                            </li>
                          })}

                        </ul>
                      </div>
                    }
                  </div>
                }
                {deleteProject &&

                  <div className={styles.delete}>
                    <h3>are you sure you want to delete this project?</h3>
                    <div className={styles.deleteContent}>

                      <button onClick={() => {
                        deleteProjectById(selectedProject);
                        setProjectSettings(false);
                      }}
                        className={styles.deleteButton}
                      >
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
                <h2>Add your new project</h2>
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
                    if (projectName) {
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
