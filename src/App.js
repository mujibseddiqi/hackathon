import Form from "./modules/form/Form";
import classes from './App.module.css';

function App() {


    return (
        <div className={classes.main}>
            <div className={classes.content}>
                <Form />
            </div>
        </div>
    );
}

export default App;
