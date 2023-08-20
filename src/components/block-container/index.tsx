import { useRef, useState } from "react";
import "./style.css";

type Position = { x: number; y: number; z: number };

interface BlockContainerProps {
    children?: React.ReactElement;
    position?: Position;
    setPosition?: (p: Position) => void;
}

export default (p: BlockContainerProps) => {
    const { children, position = { x: 200, y: 200, z: 0 } } = p;

    const dragState = useRef({ dragable: false, sx: 0, sy: 0, px: 0, py: 0 });
    const [ps, setPs] = useState(position);

    const onDragMove = (e: MouseEvent) => {
        if (!dragState.current.dragable) return;
        const { px, py, sx, sy } = dragState.current;
        setPs({ x: px + (e.clientX - sx), y: py + (e.clientY - sy), z: 0 });
    };

    const onDragEnd = () => {
        dragState.current = { dragable: false, sx: 0, sy: 0, px: 0, py: 0 };
        window.removeEventListener("mousemove", onDragMove);
        window.removeEventListener("mouseup", onDragEnd);
    };

    const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        dragState.current = { dragable: true, sx: e.clientX, sy: e.clientY, px: ps.x, py: ps.y };
        window.addEventListener("mousemove", onDragMove);
        window.addEventListener("mouseup", onDragEnd);
    };

    return (
        <div className="block-container" style={{ left: ps.x, top: ps.y }} onMouseDown={onDragStart}>
            {children}
        </div>
    );
};
