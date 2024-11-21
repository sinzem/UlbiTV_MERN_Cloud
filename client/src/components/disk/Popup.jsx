import { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import Input from "../../utils/input/Input";
import "./disk.scss";
import { setPopupDisplay } from "../../reducers/fileReducer";
import { createDir } from "../../actions/file";


const Popup = () => {

    const [dirName, setDirName] = useState("");
    const popupDisplay = useSelector(state => state.files.popupDisplay);
    const currentDir = useSelector(state => state.files.currentDir);
    const dispatch = useDispatch();

    function createHandler() {
        dispatch(createDir(currentDir, dirName));
        dispatch(setPopupDisplay("none"));
        setDirName("");
    }

    return (
        <div className="popup"
             style={{display: popupDisplay}}
             onClick={() => dispatch(setPopupDisplay("none"))}>
            <div className="popup__content" onClick={event => event.stopPropagation()}>
                <div className="popup__header">
                    <div className="popup__title">Create new folder</div>
                    <button className="popup__close"
                            onClick={() => dispatch(setPopupDisplay("none"))}>
                        X
                    </button>
                </div>
                <Input type="text" 
                       placeholder="Enter name for new folder..." 
                       value={dirName}
                       setValue={setDirName} />
                <button className="popup__create" onClick={() => createHandler()}>Create</button>
            </div>
        </div>
    );
};

export default Popup;