import ClipLoader from "react-spinners/ClipLoader";
export default function LoadingPage() {
    return (
        <div className="loading">
            <ClipLoader color="red" />
            <span>Loading...</span>
        </div>
    )
}