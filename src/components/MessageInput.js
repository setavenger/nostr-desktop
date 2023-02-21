import React, {useState, useRef, useEffect} from "react";
import {sendDM} from "../nostr/dms.js";

export const MessageInput = ({activeConvo}) => {
    const [text, setText] = useState("");
    const [rows, setRows] = useState(1);
    const textareaRef = useRef(null);

    useEffect(() => {
        const updateRows = () => {
            const lineHeight = textareaRef.current.offsetHeight / textareaRef.current.rows;
            let rowsInterim = Math.ceil(textareaRef.current.scrollHeight / lineHeight);
            if (rowsInterim > 8) {
                rowsInterim = 8;
            }
            setRows(rowsInterim > 1 ? rowsInterim : 1);
        };

        updateRows();
        window.addEventListener("resize", updateRows);

        return () => {
            window.removeEventListener("resize", updateRows);
        };
    }, [text]);


    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            await sendDM(activeConvo, text)
            setText("");
            setRows(1);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="w-full p-1 flex">
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full py-1 px-4 border border-gray-400 rounded-3xl resize-none"
                rows={rows}
            />
            {/*<button type="submit" className="p-2 ml-2 bg-blue-800 text-white rounded-full">*/}
            {/*    Send*/}
            {/*</button>*/}
        </form>
    );
};
