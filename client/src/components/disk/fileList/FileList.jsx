import { useSelector } from "react-redux";
import "./filelist.scss";
import File from "./file/File";

const FileList = () => {

    const files = useSelector(state => state.files.files).map(file => <File key={file.id} file={file}/>)
    // const files = [{_id: 1, name: "direc", type: "dir", size: "5gb", date: "21.11.2024"}, {_id: 2, name: "direc2", type: "dir", size: "2gb", date: "21.11.2024"}].map(file => <File file={file} key={file.id}/>)

    return (
        <div className="filelist">
            <div className="filelist__header">
                <div className="filelist__name">Name</div>
                <div className="filelist__date">Date</div>
                <div className="filelist__size">Size</div>
            </div>
            {files}
        </div>
    );
};

export default FileList;