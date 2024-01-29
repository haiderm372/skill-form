import "bootstrap/dist/css/bootstrap.min.css";

const Task = (props) => {
  return (
    <ul className="list-group">
      <div className="py-1">
        <li
          className={`list-group-item d-flex justify-content-between align-items-center`}
        >
          {props.item}
          <div>
            <button
              onClick={() => props.deleteTask()}
              style={{ border: "none" }}
              className="badge bg-danger rounded-pill px-3 py-2"
            >
              X
            </button>
          </div>
        </li>
      </div>
    </ul>
  );
};

export { Task };
