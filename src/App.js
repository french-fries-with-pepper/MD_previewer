import React from "react";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";
import marked from "marked";
import DOMpurify from "dompurify";

// MD to clearn html

const mdToClearnHtml = mdText => {
  return DOMpurify.sanitize(marked(mdText), {
    FORBID_ATTR: ["id"]
  });
};

//Redux:

const INPUT_CHANGED = "INPUT_CHANGED";

const getNewConvertedMd = mdText => {
  return {
    type: INPUT_CHANGED,
    mdText,
    htmlText: mdToClearnHtml(mdText)
  };
};

const initialMD = "## Marked in the browser\n\nRendered by **marked**.";

const initialState = {
  input: initialMD,
  output: mdToClearnHtml(initialMD)
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case INPUT_CHANGED:
      return {
        input: action.mdText,
        output: action.htmlText
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
      <div>
        <textarea
          name=""
          id="editor"
          cols="30"
          rows="10"
          value={this.props.mdText}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

const MarkDownPreview = props => {
  return (
    <div>
      <article dangerouslySetInnerHTML={{ __html: props.somehtml }} />
    </div>
  );
};

function ConverterMd(props) {
  return (
    <div>
      <Editor mdText={props.input} updatePreview={props.updatePreview} />
      <MarkDownPreview somehtml={props.output} />
    </div>
  );
}

//React-Redux:
const putStateToProps = state => {
  return { input: state.input, output: state.output };
};

const putActionsToProps = dispatch => {
  return {
    updatePreview: md => {
      dispatch(getNewConvertedMd(md));
    }
  };
};

const Container = connect(
  putStateToProps,
  putActionsToProps
)(ConverterMd);

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
