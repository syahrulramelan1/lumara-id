import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateOrder = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/orders", { replace: true }); }, [navigate]);
  return null;
};
export default CreateOrder;
