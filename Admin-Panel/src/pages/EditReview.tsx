import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditReview = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/reviews", { replace: true }); }, [navigate]);
  return null;
};
export default EditReview;
