import "./file.scss";
import dirLogo from "../../../../assets/fxemoji_filefolder.svg";
import fileLogo from "../../../../assets/flat-color-icons_file.svg";
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";

const File = ({file}) => {

    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);

    function openHandler(file) {
        if (file.type === "dir") {
            dispatch(pushToStack(currentDir)); /* (добавляем id текущей папки в массив - для возможности перехода обратно) */
            dispatch(setCurrentDir(file._id));
        }
    }

    return (
        <div className="file" onClick={() => openHandler(file)}>
            <img src={file.type === "dir" ? dirLogo : fileLogo} alt="folder" className="file__img" />
            <div className="file__name">{file.name}</div>
            <div className="file__date">{file.date.slice(0, 10)}</div>
            <div className="file__size">{file.size}</div>
        </div>
    );
};

export default File;