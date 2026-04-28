import { Link } from "react-router-dom";

const WhiteButton = ({
  link, text, children, textSize: _ts, width: _w, py: _py,
}: {
  link: string; text: string; children?: React.ReactNode;
  textSize?: string; width?: string; py?: string;
}) => {
  return (
    <Link
      to={link}
      className="dark:bg-whiteSecondary bg-blackPrimary w-full py-2 text-lg dark:hover:bg-white hover:bg-gray-800 duration-200 flex items-center justify-center gap-x-2"
    >
      {children}
      <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">{text}</span>
    </Link>
  );
};
export default WhiteButton;
