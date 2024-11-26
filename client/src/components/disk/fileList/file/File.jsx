import "./file.scss";
import dirLogo from "../../../../assets/fxemoji_filefolder.svg";
import fileLogo from "../../../../assets/flat-color-icons_file.svg";
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile } from "../../../../actions/file";
import sizeFormat from "../../../../utils/sizeFormat";

const File = ({file}) => {

    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const fileView = useSelector(state => state.files.view);

    function openHandler(file) {
        if (file.type === "dir") {
            dispatch(pushToStack(currentDir)); /* (добавляем id текущей папки в массив - для возможности перехода обратно) */
            dispatch(setCurrentDir(file._id));
        }
    }

    function downloadClickHandler(e) {
        e.stopPropagation();
        downloadFile(file);
    }

    function deleteClickHandler(e) {
        e.stopPropagation();
        dispatch(deleteFile(file));
    }

    if (fileView === "list") {
        return (
            <div className="file" onClick={() => openHandler(file)}>
                <img src={file.type === "dir" ? dirLogo : fileLogo} alt="folder" className="file__img" />
                <div className="file__name">{file.name}</div>
                <div className="file__date">{file.date.slice(0, 10)}</div>
                <div className="file__size">{sizeFormat(file.size)}</div>
                {file.type !== "dir" && <button  onClick={(e) => downloadClickHandler(e)} className="file__btn file__download">Download</button>}
                <button className="file__btn file__delete" onClick={(e) => deleteClickHandler(e)}>Delete</button>
            </div>
        );
    }
    
    if (fileView === "plate") {
        return (
            <div className="file-plate" onClick={() => openHandler(file)}>
                <img src={file.type === "dir" ? dirLogo : fileLogo} alt="folder" className="file-plate__img" />
                <div className="file-plate__name">{file.name}</div>
                <div className="file-plate__btns">
                    {file.type !== "dir" && 
                        <button  onClick={(e) => downloadClickHandler(e)} className="file-plate__btn file__download">
                            Download
                        </button>}
                    <button className="file-plate__btn file-plate__delete" onClick={(e) => deleteClickHandler(e)}>
                        Delete
                    </button>
                </div>
               
            </div>
        );
    }
};

export default File;