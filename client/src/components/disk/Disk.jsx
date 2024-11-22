import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDir, getFiles, uploadFile } from "../../actions/file";
import FileList from "./fileList/FileList";
import "./disk.scss";
import Popup from "./Popup";
import { setCurrentDir, setPopupDisplay } from "../../reducers/fileReducer";


const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const dirStack = useSelector(state => state.files.dirStack);

    useEffect(() => {
        dispatch(getFiles(currentDir));
    }, [currentDir])

    function showPopupHandler() {
        dispatch(setPopupDisplay("flex"));
    }

    function backClickHandler() { /* (для возврата из дочерних папок вверх - id посещенных папок пишутся в dirStack) */
        const backDirId = dirStack.pop(); /* (получаем последний id из стека) */
        dispatch(setCurrentDir(backDirId)); /* (делаем его текущим) */
    }

    function fileUploadHandler (event) { /* (для загрузки нескольких файлов) */
        const files = [...event.target.files];
        files.forEach(file => dispatch(uploadFile(file, currentDir)));
    }
 
    return (
        <div className="disk disk__container">
            <div className="disk__btns">
                <button className="disk__back" onClick={() => backClickHandler()}>Back</button>
                <button className="disk__create" onClick={() => showPopupHandler()}>Create Folder</button>
                <div className="disk__upload">
                    <label htmlFor="disk__upload_input" className="disk__upload_label">Upload file</label>
                    <input type="file" 
                            id="disk__upload_input" 
                            className="disk__upload_input"
                            multiple={true}
                            onChange={(event) => fileUploadHandler(event)}/>
                </div>
            </div>
            <FileList />
            <Popup />
        </div>
    );
};

export default Disk;