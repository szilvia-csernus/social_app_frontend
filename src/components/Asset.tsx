import { Spinner } from "react-bootstrap";
import classes from "./Asset.module.css";

type AssetProps = {
    spinner: boolean;
    src: string;
    message: string
}

const Asset = ({ spinner=false, src, message}: AssetProps) => {
  return (
    <div className={`${classes.asset} p-4`}>
        {spinner && <Spinner animation="border" />}
        {src && <img src={src} alt={message} width={60} height={60}/>}
        {message && <p className="mt-4">{message}</p>}
    </div>
  )
}

export default Asset