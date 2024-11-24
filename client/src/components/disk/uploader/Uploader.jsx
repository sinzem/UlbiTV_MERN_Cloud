import "./uploader.scss";
import UploadFile from "./UploadFile";

const Uploader = () => {

    const files = [{id:1, name: "file", progress: 40}, {id:2, name: "file2", progress: 0}]

    return (
        <div className="uploader">
            <div className="uploader__header">
                <div className="uploader__title">Downloads</div>
                <button className="uploader__close">X</button>
            </div>
            {files.map(file => 
                <UploadFile key={file.id} file={file} />
            )}
        </div>
    );
};

export default Uploader;