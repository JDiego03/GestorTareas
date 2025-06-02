import { Navigate, Route, Routes } from "react-router-dom";
import ListTareas from "./components/ListTareas";
import DetailsTarea from "./components/DetailsTarea";
import CreateTasks from "./components/CreateTasks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateTipo from "./components/createTipo";
import DeleteTipo from "./components/deleteTipo";
import EditTarea from "./components/EditTarea";
import EditSeccion from "./components/EditSeccion";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login"></Navigate>} />
        <Route path="/deleteTipo" element={<DeleteTipo />} />
        <Route path="/listTareas" element={<ListTareas />} />
        <Route path="/listTareas/:id" element={<DetailsTarea />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/postTasks" element={<CreateTasks />} />
        <Route path="/createTipo" element={<CreateTipo />} />
        <Route path="/editTarea/:id" element={<EditTarea />} />
        <Route path="/editSeccion/" element={<EditSeccion />} />
      </Routes>
    </>
  );
}

export default App;
