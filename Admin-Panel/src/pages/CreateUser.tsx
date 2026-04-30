import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/users", { replace: true }); }, [navigate]);
  return null;
};
export default CreateUser;
