import { useSelector } from "react-redux";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import "./filelist.scss";
import File from "./file/File";

const FileList = () => {

    const fileView = useSelector(state => state.files.view);
    const files = useSelector(state => state.files.files);
    // const files = [{_id: 1, name: "direc", type: "dir", size: "5gb", date: "21.11.2024"}, {_id: 2, name: "direc2", type: "dir", size: "2gb", date: "21.11.2024"}].map(file => <File file={file} key={file.id}/>)

    if (files.length === 0) {
        return (
            <div className="loader">Files not found</div>
        )
    }

    if (fileView === "plate") {
        return (
            <div className="fileplate">
                {files.map(file => 
                    <File key={file._id} file={file} />
                )}
            </div>
        );
    }

    if (fileView === "list") {
        return (
            <div className="filelist">
                <div className="filelist__header">
                    <div className="filelist__name">Name</div>
                    <div className="filelist__date">Date</div>
                    <div className="filelist__size">Size</div>
                </div>
                <TransitionGroup>
                    {files.map(file => 
                        <CSSTransition 
                            key={file._id}
                            timeout={500}
                            classNames={"file"}
                            exit={false}> 
                            <File key={file._id} file={file}/>
                        </CSSTransition>
                    )}
                </TransitionGroup>
            </div>
        );
    }
  
};

export default FileList;