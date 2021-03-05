import React, { Component } from "react";

import "./style/style.css";
import "./style/bootstrap.min.css";
import 'w3-css/w3.css';
import {
    PdfLoader,
    PdfHighlighter,
    Tip,
    Highlight,
    Popup,
    AreaHighlight
} from "../../src";
import Spinner from "./Spinner";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => location.hash.slice("#highlight-".length);

const resetHash = () => {
    location.hash = "";
};

const HighlightPopup = ({ comment }) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

export default class PDFViewer extends Component {

    constructor(props) {
        super(props);
    }

    // resetHighlights = () => {
    //     this.setState({
    //         highlights: []
    //     });
    // };

    // scrollViewerTo = (highlight: any) => { };

    // scrollToHighlightFromHash = () => {
    //     const highlight = this.getHighlightById(parseIdFromHash());

    //     if (highlight) {
    //         this.scrollViewerTo(highlight);
    //     }
    // };

    // componentDidMount() {
    //     window.addEventListener(
    //         "hashchange",
    //         this.scrollToHighlightFromHash,
    //         false
    //     );
    // }

    // getHighlightById(id: string) {
    //     const { highlights } = this.state;

    //     return highlights.find(highlight => highlight.id === id);
    // }

    addHighlight(highlight: T_NewHighlight) {
        console.log(highlight);
        const { highlights } = this.state;
        this.setState({
            highlights: [{ ...highlight, id: getNextId() }, ...highlights]
        });
    }

    // updateHighlight(highlightId: string, position: Object, content: Object) {
    //     console.log("Updating highlight", highlightId, position, content);

    //     this.setState({
    //         highlights: this.state.highlights.map(h => {
    //             return h.id === highlightId
    //                 ? {
    //                     ...h,
    //                     position: { ...h.position, ...position },
    //                     content: { ...h.content, ...content }
    //                 }
    //                 : h;
    //         })
    //     });
    // }

    render() {
        const { highlights, url, res, sentence,onPressSentence } = this.props;
        return (
            <PdfLoader url={url} beforeLoad={<Spinner />}>
                {pdfDocument => (
                    <PdfHighlighter
                        pdfDocument={pdfDocument}
                        // enableAreaSelection={event => event.altKey}
                        // onScrollChange={resetHash}
                        // scrollRef={scrollTo => {
                        //   this.scrollViewerTo = scrollTo;

                        //   this.scrollToHighlightFromHash();
                        // }}
                        onSelectionFinished={(
                            position,
                            content,
                            hideTipAndSelection,
                            transformSelection
                        ) => (
                                <Tip
                                    onOpen={transformSelection}
                                    onConfirm={comment => {
                                        this.addHighlight({ content, position, comment });

                                        hideTipAndSelection();
                                    }}
                                />
                            )}
                        highlightTransform={(
                            highlight,
                            index,
                            setTip,
                            hideTip,
                            viewportToScaled,
                            screenshot,
                            isScrolledTo
                        ) => {
                            const isTextHighlight = !Boolean(
                                highlight.content && highlight.content.image
                            );

                            const component = isTextHighlight ? (
                                <Highlight
                                    isScrolledTo={isScrolledTo}
                                    position={highlight.position}
                                    comment={highlight.comment}
                                />
                            ) : (
                                    <AreaHighlight
                                        highlight={highlight}
                                        onChange={boundingRect => {
                                            this.updateHighlight(
                                                highlight.id,
                                                { boundingRect: viewportToScaled(boundingRect) },
                                                { image: screenshot(boundingRect) }
                                            );
                                        }}
                                    />
                                );

                            return (
                                <Popup
                                    popupContent={<HighlightPopup {...highlight} />}
                                    // onMouseOver={popupContent =>
                                    //     setTip(highlight, highlight => popupContent)
                                    // }
                                    // onMouseOut={hideTip}
                                    onPressSentence={onPressSentence}
                                    key={index}
                                    children={component}
                                    res={res}
                                />
                                
                            );
                        }}
                        highlights={highlights}
                    />
                )}
                
            </PdfLoader>
        );
    }
}