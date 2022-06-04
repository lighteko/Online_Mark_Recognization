// json 읽는법: 단원 chapter,문항번호 number,문제타입 type(d,o(단답식,객관식)),정답 answer
// 범위 작성 예시 ex) A1-A16
let answerBox = [];
let wrongAns = [];
const card = document.getElementById("card-place");
const result = document.getElementById("result-place");
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
	const Range = range.toUpperCase();
	let keepAppend = false;
	let appendStarted = false;
    const [start,end] = Range.split('-');
	const [[startCh,startNum],[endCh,endNum]] = [start.split('.'),end.split('.')];
	let parsedAns = [];
	for (let i = 0; i < jsonData.length+1; i++) {
		if(startCh == jsonData[i]["Chapter"] && startNum == jsonData[i]["Number"]){
			keepAppend = true;
			appendStarted = true;
		}
		else if (endCh == jsonData[i]["Chapter"] && endNum == jsonData[i]["Number"]) {
			keepAppend = false;
			parsedAns.push(jsonData[i]);
		}
		if(keepAppend == true) {
            parsedAns.push(jsonData[i]);	
		}
		if (appendStarted==true && keepAppend==false) {
			break
		}
	answerBox = [];
	answerBox = parsedAns;
	}
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
		if (rangeText != "") {
			omrDisplay = "block";
		}
		else {
			omrDisplay = "none";
		}
		fetch(`./${wbIndex}.json`)
		.then((response) => {
			return response.json();
		})
		.then((jsonData) => ReactDOM.render(<OMRcard workbook={wbIndex} answers={answerParser(jsonData,rangeText)} display={omrDisplay} />,card));
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
function OMRcard({workbook,display,answers}) {
	const amount = answers.length; 
	function OmrCell({Num,Type}) {
		return (
		<div id={"omr-block"+Num} style={{display: "flex",marginTop: "10px", marginBottom: "10px"}}>
			<span style={{width: "50px"}}>{Num}</span>
			<div id="radios" style={{display:"flex"}}>
				<Radio name={"omr_cell"+Num} value="1" useAble={Type=="O"? false : true}/>
				<Radio name={"omr_cell"+Num} value="2" useAble={Type=="O"? false : true}/>
				<Radio name={"omr_cell"+Num} value="3" useAble={Type=="O"? false : true}/>
				<Radio name={"omr_cell"+Num} value="4" useAble={Type=="O"? false : true}/>
				<Radio name={"omr_cell"+Num} value="5" useAble={Type=="O"? false : true}/>
			</div>
			<input style={{width:"50px"}} type="text" onInput={checkNum} name={"omr-dir-cell_"+Num} disabled={Type=="O"? true : false} placeholder="단답형"/>
		</div>
		);
	}
	const OMRblocks = () => {
		const Blocks = answers.map((answer) => <OmrCell key={answer["Chapter"] + answer["Number"]} Num={answer["Chapter"] + answer["Number"]} Type={answer["Type"]}/>);
		return (
			<div id="omr-card">
			    <div id="omr-blocks">{Blocks}</div>
			    <button onClick={onSubmitClick} id="submit">채점하기</button>
			</div>
		);
	}
	return (
		<div style={{display:display}} id={workbook+"omr-card"}>
            <OMRblocks/>
		</div>
	);	
}

//채점하기 버튼 클
function onSubmitClick() {
	checkAns().then(()=>renderResult());
}

async function checkAns() {
	wrongAns = [];
	for(let answer of answerBox) {
		if(answer["Type"]=="O"){
			try {
	            let marked = document.querySelector(`${'input[name="'+"omr_cell"+answer["Chapter"]+answer["Number"]+'"]:checked'}`).value;
			}
			catch{
				window.alert("답안을 작성해 주세요!");
                return
			}

			if (marked!=answer["Answer"]) {
				wrongAns.push(answer["Chapter"]+answer["Number"]);
			}
	    }
		else if(answer["Type"]=="D") {
			let markedD = document.getElementsByName(`${"omr-dir-cell_"+answer["Chapter"]+answer["Number"]}`)[0].value;
			if (markedD!=answer["Answer"]) {
				wrongAns.push(answer["Chapter"]+answer["Number"]);
			}
		}
	}
}
function Result({marking}) {
	let [wrong, right] = ["none","none"];
	marking.length==0 ? [wrong,right]=["none","block"] : [wrong,right]=["block","none"];
	return (
		<div id="result">
			<span id="wrong-result" style={{display: wrong}}>{"채점 결과 " + marking.join(",")+ ` 총 ${marking.length}문항이 틀렸습니다.`}</span>
			<span id="right-result" style={{display: right}}>채점 결과 모두 맞았습니다!! 축하합니다!!</span>
		</div>
	);
}

function renderResult() {
    ReactDOM.render(<Result marking={wrongAns}/>,result);
}
// 합체
const App = () => (
	<div id="app">
		<h1>OMR: 온라인 문제집 자동 채점 서비스</h1>
		<h3>이용해 주셔서 감사합니다.</h3>
		<Workbooks />
	</div>
);

function Radio({name, value, useAble}) {
	return(
	<div id="radio-container" >
		<input className={"value"+value} id={name+value} type="radio" name={name} value={value} disabled={useAble} style={{margin: "10px",}}/>
		<label style={{width:"23px"}} htmlFor={name+value}>{"ㅤ"}</label>
	</div>
	);
}

ReactDOM.render(<App/>,root);