import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Task } from "./task";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const capitalizedValue = e.target.value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setNewTask(capitalizedValue);
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  const addTask = () => {
    if (newTask.trim() === "" || newTask.trim().length === 0) {
      return;
    }

    let found = todoList.find((value) => {
      return value.toLowerCase().trim() === newTask.toLowerCase().trim();
    });
    if (found) {
      toast(`${newTask} is Already Added`);
      return;
    }
    setTodoList([...todoList, newTask.trim()]);
    setNewTask("");
  };

  const deleteTask = (index) => {
    const newList = todoList.filter((_val, i) => {
      return !(index === i);
    });
    setTodoList(newList);
  };

  const submitOnDatabase = async () => {
    if (todoList.length === 0 || loading) {
      return;
    }

    setLoading(true);

    try {
      await Axios.post(
        "http://asyrus-backend-code.eba-uwpb7juq.ap-southeast-2.elasticbeanstalk.com/api/skill/addSkills",
        {
          skills: todoList,
        }
      ).then((res) => {
        if (res.status === 200) {
          if (res.data.result) {
            toast.success(res.data.message);
            if (res.data.data.length !== 0) {
              res.data.data.map((value) => {
                return toast.warning(value + " - Already Existed");
              });
            }
            setTodoList([]);
          } else {
            toast.error(res.data.message);
          }
        }
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div style={{ backgroundColor: "#af7eeb" }} className="row px-5 py-5">
        <div className="col">
          <div className="input-group mb-3">
            <input
              value={newTask}
              onChange={handleChange}
              onKeyDown={handleKey}
              type="text"
              className="form-control"
              placeholder="Write New Task"
              aria-label="Write New Task"
              aria-describedby="basic-addon2"
            />
            <span className="input-group-text" id="basic-addon2">
              New Skill
            </span>
          </div>
        </div>
        <div className="col">
          <button
            type="button"
            className="btn btn-dark"
            onClick={submitOnDatabase}
          >
            Post Skills
          </button>
        </div>
      </div>

      <>
        {loading ? (
          <div style={{ padding: "20px" }}>
            <center>
              <ClipLoader
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </center>
          </div>
        ) : (
          <div className="px-5 py-5">
            <div className="list">
              {todoList.map((item, key) => {
                return (
                  <Task
                    key={key}
                    item={item}
                    deleteTask={() => deleteTask(key)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default App;
