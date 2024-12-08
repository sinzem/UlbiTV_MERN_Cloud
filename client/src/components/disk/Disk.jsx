import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDir, getFiles, uploadFile } from "../../actions/file";
import FileList from "./fileList/FileList";
import "./disk.scss";
import Popup from "./Popup";
import { setCurrentDir, setFileView, setPopupDisplay } from "../../reducers/fileReducer";
import { useState } from "react";
import Uploader from "./uploader/Uploader";


const Disk = () => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.files.currentDir);
    const dirStack = useSelector(state => state.files.dirStack);
    const loader = useSelector(state => state.app.loader);
    const [dragEnter, setDragEnter] = useState(false); /* (для загрузки файлов при перетаскивании) */
    const [sort, setSort] = useState("type"); /* (для сортировки, добавляем в get запрос) */

    useEffect(() => {
        dispatch(getFiles(currentDir, sort));
    }, [currentDir, sort])

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

    function dragEnterHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);
    }

    function dragLeaveHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);
    }

    function dropHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        let files = [...event.dataTransfer.files];
        files.forEach(file => dispatch(uploadFile(file, currentDir)));
        setDragEnter(false);
    }
    
    if (loader) {
        return (
            <div className="loader">
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
 
    return ( !dragEnter 
        ?
        <div className="disk disk__container"
             onDragEnter={dragEnterHandler}
             onDragLeave={dragLeaveHandler}
             onDragOver={dragEnterHandler}>
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
                <select className="disk__select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}>
                    <option value="name">By name</option>
                    <option value="type">By type</option>
                    <option value="date">By date</option>
                </select>
                <button className="disk__plate" onClick={() => dispatch(setFileView("plate"))} />
                <button className="disk__list" onClick={() => dispatch(setFileView("list"))} />
            </div>
            <FileList />
            <Popup />
            <Uploader />
        </div> 
        :
        <div className="drop_area"
             onDrop={dropHandler}
             onDragEnter={dragEnterHandler}
             onDragLeave={dragLeaveHandler}
             onDragOver={dragEnterHandler}>
            Drag files here...
        </div>
    );
};

export default Disk;