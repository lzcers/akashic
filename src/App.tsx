import { useState } from "react";
import BlockContainer from "./components/block-container";
import MdBlock from "./components/md-block";

import "./styles.css";

export default () => {
    const [dragDisable, setDragDisable] = useState(false);

    return (
        <div className="akashic-container">
            <BlockContainer dragDisable={dragDisable}>
                <MdBlock onFocus={() => setDragDisable(true)} onBlur={() => setDragDisable(false)} />
            </BlockContainer>
        </div>
    );
};
