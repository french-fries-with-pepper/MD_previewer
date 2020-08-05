import React from "react";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import marked from "marked";
import DOMpurify from "dompurify";
import initialMD from "./initialMD";
import "./app.css";

// MD to clearn html

const mdToClearnHtml = (mdText) => {
  return DOMpurify.sanitize(marked(mdText, { breaks: true }), {
    FORBID_ATTR: ["id"],
  });
};

//Redux:

const INPUT_CHANGED = "INPUT_CHANGED";

const getNewConvertedMd = (mdText) => {
  return {
    type: INPUT_CHANGED,
    mdText,
    htmlText: mdToClearnHtml(mdText),
  };
};

const initialState = {
  input: initialMD,
  output: mdToClearnHtml(initialMD),
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case INPUT_CHANGED:
      return {
        input: action.mdText,
        output: action.htmlText,
      };
    default:
      return state;
  }
};

const store = createStore(mainReducer);
//--------------------------------------------------
// tests
//console.log(store.getState());
//store.dispatch(getNewConvertedMd("### test"));
//console.log(store.getState());

//--------------------------------------------------

//React:
class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.updatePreview(event.target.value);
  }

  render() {
    return (
      <div className="inputWrap">
        <h2 className="inputWrap__header">Input MarkDown</h2>

        <textarea
          className="inputWrap__input"
          name=""
          id="editor"
          cols="30"
          rows="10"
          placeholder="please type your markdown texet here"
          value={this.props.mdText}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

const MarkDownPreview = (props) => {
  return (
    <div className="outputWrap">
      <h2 className="outputWrap__header">Result</h2>
      <article
        className="outputWrap__view"
        id="preview"
        dangerouslySetInnerHTML={{ __html: props.somehtml }}
      />
    </div>
  );
};

function ConverterMd(props) {
  return (
    <div className="appWrap">
      <Editor mdText={props.input} updatePreview={props.updatePreview} />
      <MarkDownPreview somehtml={props.output} />
    </div>
  );
}

//React-Redux:
const putStateToProps = (state) => {
  return { input: state.input, output: state.output };
};

const putActionsToProps = (dispatch) => {
  return {
    updatePreview: (md) => {
      dispatch(getNewConvertedMd(md));
    },
  };
};

const Container = connect(putStateToProps, putActionsToProps)(ConverterMd);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

export default App;
