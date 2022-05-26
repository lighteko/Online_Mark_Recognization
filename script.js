const root = document.getElementsById("root");
const Workbooks = (workbook) => (
  <div id="workbooks">
    <button id={workbook}>{workbook}</button>
  </div>
);

ReactDOM.render(Workbooks("XI_STORY",root);