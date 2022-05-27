const root = document.getElementById("root");
const Workbooks = (workbook) => (
    <button onClick={goToOMR} id={workbook}>{workbook}</button>
);
/*
문제집 선택 버튼 클릭 --> 단원 선택 버튼 클릭 --> omr 입력
*/
function goToOMR(workbook) {
	<div id={"omr_"+workbook}>
		
	</div>
}

ReactDOM.render(Workbooks("XI_STORY"),root);