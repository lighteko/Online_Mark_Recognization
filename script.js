const root = document.getElementById("root");
const Workbooks = (workbook) => (
    <button  id={workbook}>{workbook}</button>
);
/*
문제집 선택 버튼 클릭 --> 단원 선택 버튼 클릭 --> omr 입력
*/

const OMRcard = (a) => (
	<div id={a}>
		<input id="select-range" placeholder="A01~P34처럼 채점할 범위를 입력해 주세요"></input>
	</div>
);


ReactDOM.render(Workbooks("2023 자이스토리 수학I"),root);