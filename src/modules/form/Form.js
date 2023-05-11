import { useState } from "react";
import { Oval } from "react-loader-spinner";

import classes from "./Form.module.css";

const Form = () => {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const response = await fetch('http://localhost:3001/q', {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({  q: prompt })
        }).then((response) => response.json()).then((data) => { setLoading(false); return data; } ).catch((err) => {
            console.log(err);
            setLoading(false);
        });

        if (response) {
            setResult(response);
        }
    }

    const exportUserInfo = (userInfo) => {
        const fileData = JSON.stringify(userInfo);
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "user-info.json";
        link.href = url;
        link.click();
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <textarea
                    type="text"
                    name="prompt"
                    placeholder=""
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button type="submit" disabled={!prompt}>
                    {
                        !loading
                            ? "Send"
                            : <Oval
                                height={18}
                                width={18}
                                color="#fff"
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#ccc"
                                strokeWidth={2}
                                strokeWidthSecondary={2}
                            />
                    }
                </button>
            </form>
            <div className={classes.result}>
                {
                    result &&
                    <div className={classes.result_container}>
                        <h2>Details</h2>

                        <div className={classes.result_details}>
                            <h3>{
                                result.product ?
                                    result.product?.GeneralInfo.TitleInfo.GeneratedIntTitle
                                    : result.answer }</h3>
                            <div className={classes.result_details_item}>
                                <ul>
                                    {
                                        result.product?.GeneralInfo.GeneratedBulletPoints.Values.map((item, key) => {
                                            return <li key={key}>{item}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>

                        {result?.product &&
                            <div className={classes.code_block}>
                                <button className={classes.download_button}
                                        type="submit"
                                        onClick={() => exportUserInfo(result.product)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                        <path fill="#fff" d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/>
                                        <path fill="#fff" d="M10 15l5-6h-4V1H9v8H5l5 6z"/>
                                    </svg>
                                </button>
                                <pre>
                                    <code>{JSON.stringify(result.product?.GeneralInfo, null, '\t')}</code>
                                </pre>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    );
}

export default Form;