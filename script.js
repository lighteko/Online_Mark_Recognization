// csv 읽는법: 단원,문항번호,문제타입(d,o(단답식,객관식)),정답
// range ex) A1-A16

const card = document.getElementById("card-place");
const root = document.getElementById("root");

// 단답형 입력값을 최대 세자리 수의 양의 정수로 제한하는 함수
function checkNum(event) {
		event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		event.target.value = event.target.value.slice(0,3);
	if (event.target.value.length >=2 && event.target.value[0]==0) {
		event.target.value = event.target.value.slice(1,3);
	}
	else if (event.target.value.length >=2 && event.target.value[0]==0 && event.target.value[1]==0) {
		event.target.value = event.target.value.slice(2,3);
	}
}

// 채점 범위를 입력했을 때, 선택한 문제집의 답지 정보를 입력한 범위 만큼만 추출해서 답안 리스트로 만드는 함수
function answerParser(jsonData, range) {
	let keepAppend = false;
	let appendStarted = false;
    const [start,end] = range.split('-');
	const [startChr,startNum,endChr,endNum] = [start.charAt(0),start.substring(1,start.length-1),end.charAt(0),end.substring(1,end.length-1)];
	let parsedAns = [];
	for (let i = 0; i < jsonData.length+1; i++) {
		if(startChr in jsonData[i]["Chapter"] && startNum in jsonData[i]["Number"]){
			keepAppend = true;
			appendStarted = true;
		}
		else if (endChr in jsonData[i]["chapter"] && endNum in jsonData[i]["Number"]) {
			keepAppend = false;
			parseAns.push(jsonData[i]["Answer"]);
		}
		if(keepAppend == true){
            parsedAns.push(jsonData[i]["Answer"]);
		}
		else if (appendStarted==true && keepAppend==false) {
			break
		}
	}
	console.log(parsedAns);
    return parsedAns;
}




// 문제집 선택, omr카드가 포함되는 컴포넌트
function Workbooks() {
	const [wbIndex, setWbIndex] = React.useState();
	const [showRangeInput, setShowRangeInput] = React.useState("none");
	let omrDisplay = "none";
	const onSelect = (event) => {
		const val = event.target.value;
		if (val != "") {
			setWbIndex(val);
			setShowRangeInput("block");
		}
		else {
			setShowRangeInput("none");
		}

	};

	const MarkRange = () => {
		return (
			<div id={wbIndex} style={{display: showRangeInput}}>
				<input id="select-range" placeholder="채점 범위를 입력해 주세요"/>
				<button onClick={renderOMR} id="range-submit-btn">확인</button>
			</div>
		);
	}
	// 채점 범위와 문제집 아이디를 OMR카드 컴포넌트로 보내는 함수
	function renderOMR() {
		const rangeText = document.getElementById("select-range").value;
		console.log(rangeText);
		if (rangeText != "") {
			omrDisplay = "block";
		}
		else {
			omrDisplay = "none";
		}
        ReactDOM.render(<OMRcard workbook={wbIndex} range={rangeText} display={omrDisplay} />,card);
	}
	return (
		<div id="container">
			<div id="select-workbooks">
				<select name="workbooks" onChange={onSelect}>
					<option value="">채점할 문제집을 선택해 주세요</option>
					<option value="23xi-mathI3">2023 자이스토리 수학I (고3)</option>
					<option value="23xi-mathII3">2023 자이스토리 수학II (고3)</option>
					<option value="23xi-calculus3">2023 자이스토리 미적분 (고3)</option>
				</select>
			</div>
			<MarkRange/>
		</div>
	);
}

// OMR카드 컴포넌트
function OMRcard({workbook,display,range}) {
	const [Answers,setAnswers] = React.useState();
	fetch(`./${workbook}.json`)
		.then((response) => {
			return response.json();
		})
		.then(jsonData => setAnswers(answerParser(jsonData,range)));
    const OmrCell = ({Num}) => {
		return (
		<div id="omr-block">
		    <input type="radio" name={"omr-cell_"+Num} value="1"/>
			<input type="radio" name={"omr-cell_"+Num} value="2"/>
			<input type="radio" name={"omr-cell_"+Num} value="3"/>
			<input type="radio" name={"omr-cell_"+Num} value="4"/>
			<input type="radio" name={"omr-cell_"+Num} value="5"/>
			<input style={{width:"50px"}} type="text" onInput={checkNum} name={"omr-dir-cell_"+Num} placeholder="단답형"/>
		</div>
		);
	};
	
	return (
		<div style={{display:display}} id="omr-card">
            <OmrCell Num="1"/>
			<OmrCell Num="2"/>
			<OmrCell Num="3"/>
		</div>
	);
	
}

// 합체
const App = () => (
	<div id="app">
		<h1>OMR: 온라인 문제집 자동 채점 서비스</h1>
		<h3>이용해 주셔서 감사합니다.</h3>
		<Workbooks />
	</div>
);

ReactDOM.render(<App/>,root);