import { useCallback, useMemo } from "react";
import { createEditor, Descendant, Editor, Element as SlateElement, Node as SlateNode } from "slate";
import { withHistory } from "slate-history";
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from "slate-react";
import withShortcuts, { SHORTCUTS } from "./shortcuts";
import Render from "./render";
import "./style.css";

const initialValue: Descendant[] = [{ type: "paragraph", children: [{ text: "" }] }];

interface MdBlockProps {
    onFocus?: () => void;
    onBlur?: () => void;
}

export default (p: MdBlockProps) => {
    const { onFocus, onBlur } = p;
    const renderElement = useCallback((props: RenderElementProps) => <Render {...props} />, []);
    const editor = useMemo(() => withShortcuts(withReact(withHistory(createEditor()))), []);

    const handleDOMBeforeInput = useCallback(
        (_: InputEvent) => {
            queueMicrotask(() => {
                const pendingDiffs = ReactEditor.androidPendingDiffs(editor);

                const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
                    if (!diff.text.endsWith(" ")) {
                        return false;
                    }

                    const { text } = SlateNode.leaf(editor, path);
                    const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1);
                    if (!(beforeText in SHORTCUTS)) {
                        return;
                    }

                    const blockEntry = Editor.above(editor, {
                        at: path,
                        match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
                    });
                    if (!blockEntry) {
                        return false;
                    }

                    const [, blockPath] = blockEntry;
                    return Editor.isStart(editor, Editor.start(editor, path), blockPath);
                });

                if (scheduleFlush) {
                    ReactEditor.androidScheduleFlush(editor);
                }
            });
        },
        [editor]
    );

    return (
        <div className="akashic-block-md heti heti--classic">
            <Slate editor={editor} initialValue={initialValue}>
                <Editable
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onDOMBeforeInput={handleDOMBeforeInput}
                    renderElement={renderElement}
                    placeholder="..."
                    spellCheck
                />
            </Slate>
        </div>
    );
};
