import { useState } from "react";
import classes from "./Form.module.css";

const Form = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState([]);

    const onSubmit = (event) => {
        event.preventDefault();

        const result = [];

        setResult(result);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="prompt"
                    placeholder=""
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <input type="submit" value="Send"/>
            </form>
            <div className={classes.result}>
                {result}
            </div>
        </>
    );
}

export default Form;