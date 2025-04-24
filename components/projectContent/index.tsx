/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import styles from "@/styles/elements.module.scss";
import { useEffect, useState, useRef, useMemo } from "react";
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import Popup from "../popup";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { TextField } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';


interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}
interface Task {
  id: string;
  status: string;
  assignedTo: string;
  projectId: string;
  createdAt: string;
  label: string;
  description: string;
}
interface Comment {
  id: string;
  body: string;
  madeBy: string;
  taskId: string;
  createdAt: string;
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
  const [addedUsers, setAddedUsers] = useState([]);
  const [nameOccupied, setNameOccupied] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [showMembersList, setShowMembersList] = useState(false);
  const [tasks, setTasks] = useState([]);
  const labels = ['To Do', 'In Progress', 'Done'];
  const [assignedUser, setAssignedUser] = useState('');
  let selectedComment = "";
  const [createNewComment, setCreateNewComment] = useState(false);
  const [commentBody, setCommentBody] = useState('');


  //hooki

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
        console.log("no i chuj, no i cześć 1") // ~Hubert Getter~
      }

    }
    fetchProjects()
  }, [addedUsers]);
  const fetchTasks = async () => {
    if (!selectedProject) {
      return
    }
    const res = await fetch(`/api/project/${selectedProject}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json()
    if (res.status == 200) {
      setTasks(data.tasks);
    }
    else {
      console.log("no i chuj, no i cześć") // ~Hubert Getter~
    }
  }

  useEffect(() => {

    fetchTasks();
    allUsers();


  }, [selectedProject]);


  // Raj którego nocą pragniesz
  // tak jak ja
  // to niebo, to raj
  // dalej dalej proszę leć, proszę gnaj.

  //projekty

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
      setNameOccupied(false);
    }
  }

  async function renameProject() {
    const updatedProjects = await Promise.all(
      projects.map(async (project: Project) => {
        if (project.id === selectedProject) {
          const res = await fetch(`/api/project/${project.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: projectName
            })
          });

          if (res.status !== 200) {
            console.log("error updating project name");
          }

          return { ...project, name: projectName };
        }

        return project;
      })
    );

    setProjects(updatedProjects);
  }
  async function deleteProjectById(id: string) {
    setProjects(projects.filter((project: Project) => project.id !== id));

    const res = await fetch(`/api/project/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    })
    if (res.status !== 200) {
      console.log("erro")
    }
  }


  //taski


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

      })
    })
    if (res.status == 201) {
      const data = await res.json()
      setTasks([...tasks, {
        id: data.task.id,
        label: data.task.label,
        description: data.task.description,
        status: data.task.status,
        assignedTo: "",
        projectId: data.task.projectId,
        createdAt: data.task.createdAt,
      }])
    }
    setCreateNewTask(false);
    if (selectedProject) {

      if (createNewTask && taskLabel && taskDescription && taskStatus) {

      }
    }
  }
  async function deleteTaskFromTasks(id: string) {
    setTasks(tasks.filter((task: Task) => task.id !== id));
    const res = await fetch(`/api/task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    })
    if (res.status !== 200) {
      console.log("erro")
    }
  }
  async function changeTaskStatus(id: string, taskStatus: string) {
    setTasks(tasks.map((task: Task) => {
      if (task.id === id) {
        return { ...task, status: taskStatus };
      }
      return task;
    }));
    const res = await fetch(`/api/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: taskStatus,
        assgnedTo: " "
      })
    })
  }
  async function changeTaskLabel(id: string, taskLabel: string, taskDescription: string) {
    setTasks(tasks.map((task: Task) => {
      if (task.id === id) {
        return { ...task, label: taskLabel, description: taskDescription };
      }
      return task;
    }));
    const res = await fetch(`/api/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        label: taskLabel,
        description: taskDescription,
        assgnedTo: " "
      })
    })
  }




  const allUsers = async () => {
    const res = await fetch(`/api/user/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const users = await res.json();
    setUsers(users.users);

  }

  const assignedUsers = async () => {
    // @Sebastian-Golatowski - zrobienie requesta do wyciągania userów przypisanych do projektu
    //setAddedUsers(users.users);

    const res = await fetch(`/api/user/${selectedProject}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const users = await res.json();
    setAddedUsers(users);
  }

  async function assignUser(userId: string) {
    const res = await fetch(`/api/task/${selectedTaskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        assignedTo: userId
      })
    })
  }

  async function addUserToProject(userId: string) {
    // setTasks(tasks.filter((task: Task) => task.id !== id));
    const res = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        projectId: selectedProject
      })
    })
    if (res.status !== 201) {
      console.log("erro")
    }
    assignedUsers()
  }
  async function removeUserFromProject(userId: string) {
    const res = await fetch(`/api/user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        projectId: selectedProject
      })
    })
    if (res.status !== 200) {
      console.log("erro")
    }
    assignedUsers()
  }


  async function addComment() {
    await fetch(`/api/coment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        body: commentBody,
        taskId: selectedTaskId,
        projectId: selectedProject
      })
    })
    fetchTasks()
  }

  async function deleteComment() {
    await fetch(`/api/coment/${selectedComment}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    fetchTasks()
  }

  return (
    <div className={styles.projects}>
      <div className={styles.navigation}>
        <div className={styles.projectHeader}>
          <h2>Projects </h2>
          <button onClick={async () => {
            setAddProject(true)
          }}>
            <AddIcon />
          </button>
        </div>
        <ul className={styles.projectList}>
          {projects.map((project: Project) => (
            <li key={project.id}
              onClick={() => {
                setSelectedProject(project.id);
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
                          assignedUsers();
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
                        {tasks.filter((task: Task) => task.status.toLowerCase() === label.toLowerCase() && task.projectId === selectedProject)
                          .map((task: Task, index: number) => {
                            console.log(addedUsers);
                            return <div key={index} className={styles.taskSingleRow}>
                              <div className={styles.taskInfo}>
                                <p>
                                  {task.label}
                                </p>
                                <span>
                                  {users.find((user) => user.id === task.assignedTo)?.username}
                                </span>
                              </div>
                              <div className={styles.taskNav}>
                                <button onClick={() => {
                                  assignedUsers();
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
                          }
                          )}
                      </ul>
                    </div>
                  })
                }
              </div>
            ))}
          {changeState &&
            <Popup closeButton={() =>
              createNewComment ? setCreateNewComment(false) : setChangeState(!changeState)
            }>
              {!createNewComment &&
                <div className={styles.changeTask}>

                  <div className={styles.changeState}>
                    <label htmlFor="state">change state</label>
                    <select name="state" id="state" onChange={(e) => {
                      changeTaskStatus(selectedTaskId, e.currentTarget.value)
                    }}>
                      <option value="---">---</option>
                      {labels.map((label, index) => {
                        return <option key={index} value={label.toLowerCase()}>{label}</option>
                      })}
                    </select>
                  </div>

                  <div className={styles.changeLabel}>
                    <label htmlFor="taskLabel">change task label</label>
                    <TextField
                      sx={{
                        minHeight: '3em',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(0, 0, 0, 1)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#fff',
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: 'rgba(255, 255, 255, 0.5)',
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
                      label="Task label"
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
                      placeholder={tasks.find((task: Task) => task.id === selectedTaskId).description || ''}
                      onChange={(e) => {
                        setTaskDescription(e.currentTarget.value);
                        console.log(tasks.find((task: Task) => task.id === selectedTaskId).description)
                        console.log(selectedTaskId)
                      }}
                    />


                  </div>
                  <div className={styles.addUser}>
                    <label htmlFor="addUser">add user</label>
                    <select
                      name="addUser"
                      id=""
                      onChange={(e) => {
                        setAssignedUser(e.currentTarget.value);
                      }}>
                      <option value="---">---</option>
                      {addedUsers.map((user) => {
                        return <option key={user.id} value={user.id}>{user.username}</option>
                      })}
                    </select>
                  </div>
                  <div className={styles.comments}>
                    <div className={styles.commentsLabel}>
                      <label>Comments: </label>
                      <button
                        onClick={() => {
                          // addComment()
                          setCreateNewComment(true);
                        }}>
                        <AddIcon />
                      </button>
                    </div>
                    <div className={styles.commentsContainer}>
                      {tasks.find((task: Task) => task.id === selectedTaskId)?.comments?.map((comment: Comment) => {
                        return <div key={comment.id} className={styles.singleComment}>
                          <div className={styles.commentHeader}>
                            <div>
                              <h4>{addedUsers.find((user) => user.id === comment.madeBy)?.username}
                              </h4>
                              <span>
                                {comment.createdAt.split('T')[0]} {comment.createdAt.split('T')[1].split('.')[0]}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                selectedComment = (comment.id)
                                deleteComment()
                              }}
                              className={styles.removeComment}
                            >
                              <RemoveIcon />
                            </button>
                          </div>
                          <div className={styles.commentBody}>


                            <p>{comment.body}</p>
                          </div>

                        </div>
                      })}
                    </div>
                  </div>
                  <div className={styles.save}>
                    <button className={styles.saveButton}
                      onClick={(e) => {
                        e.preventDefault();
                        changeTaskLabel(selectedTaskId, taskLabel, taskDescription)
                        setChangeState(!changeState);
                        if (assignedUser !== '') assignUser(assignedUser);
                      }}>
                      save
                      <SaveOutlinedIcon />
                    </button>
                  </div>
                </div>}
              {createNewComment &&

                <div className={styles.addComment}>
                  <div className={styles.addCommentHeader}>
                    <h4>Add new comment</h4>
                  </div>
                  <div className={styles.addCommentBody}>
                    <textarea
                      placeholder="Comment body"
                      name="comment"
                      id="comment"
                      onChange={(e) => {
                        setCommentBody(e.currentTarget.value);
                      }}
                    ></textarea>
                  </div>
                  <div className={styles.save}>
                    <button
                      className={styles.saveButton}
                      onClick={() => {
                        addComment();
                        setCreateNewComment(false)
                      }}
                    >
                      save
                      <SaveOutlinedIcon />
                    </button>
                  </div>
                </div>

              }
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
                  <TextField
                    sx={{
                      minHeight: '3em',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 1)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#fff',
                        }
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'rgba(255, 255, 255, 0.5)',
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
                      placeholder={tasks.find((task: Task) => task.id === selectedTaskId)?.description}
                      onChange={(e) => {
                        setTaskDescription(e.currentTarget.value);
                        console.log(taskDescription)
                        console.log(tasks)
                      }}
                    />
                  </div>
                  <div className={styles.save}
                    style={{
                      position: 'absolute',
                      bottom: '1em',
                      right: '1em'
                    }}
                  >
                    <button
                      type="button"
                      className={styles.saveButton}
                      onClick={() => {
                        setCreateNewTask(!createNewTask);
                        addTask();
                      }}>
                      save
                      <SaveOutlinedIcon />
                    </button>
                  </div>
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
              setShowMembersList(false);
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
                    allUsers();
                    assignedUsers();
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
                        minHeight: '3em',
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
                        add members
                      </button>
                    </nav>
                    {showMembersList &&
                      <div>
                        <h3>Assigned users</h3>
                        <ul>

                          {addedUsers.length > 0 &&
                            addedUsers.map((user, index) => {
                              return <li
                                key={index}
                                className={styles.member}>
                                {user.username}
                                <section>
                                  <button onClick={() => {
                                    removeUserFromProject(user.id);
                                  }}
                                  >
                                    <RemoveIcon className={styles.deleteIcon} />
                                  </button>
                                </section>
                              </li>
                            })}
                        </ul>
                      </div>
                    }
                    {!showMembersList &&
                      <div>
                        <h3>Select members to add</h3>
                        <ul>

                          {addedUsers.length > 0 &&
                            users.filter((user) => !addedUsers.map((addedUser) => addedUser.id).includes(user.id)).length > 0 &&
                            users.filter((user) => !addedUsers.map((addedUser) => addedUser.id).includes(user.id)).map((user, index) => {

                              return <li
                                key={index}
                                className={styles.member}>
                                {user.username}

                                <section>

                                  <button onClick={() => {

                                    addUserToProject(user.id);
                                  }}>
                                    <AddIcon className={styles.addIcon} />
                                  </button>
                                </section>
                              </li>
                            })}
                          {
                            addedUsers.length > 0 &&
                            users.filter((user) => !addedUsers.map((addedUser) => addedUser.id).includes(user.id)).length === 0 &&
                            <p
                              style={{
                                textAlign: 'center'
                              }}
                            >
                              no more users to add
                            </p>
                          }
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
                  <div className={styles.save}>
                    <button className={styles.saveButton}
                      onClick={() => {
                        renameProject();
                        setProjectSettings(!projectSettings);
                        setOpenSettings(!openSettings);
                        setRename(false);
                        setMenageMembers(false);
                        setDeleteProject(false);
                        location.reload();
                      }}
                    >
                      save <SaveOutlinedIcon />
                    </button>
                  </div>
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
                      minHeight: '3em',
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
                <div className={styles.save}>
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
              </div>
            </Popup>
          }
        </div>
      </div>
      {
        nameOccupied &&
        <Popup closeButton={() => setNameOccupied(false)}>
          <div className={styles.addProject}>
            <h2 >Project name already exists</h2>
            <p>
              please choose another name
            </p>
          </div>
        </Popup>
      }
    </div>
  );
}
