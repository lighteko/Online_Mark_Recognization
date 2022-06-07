// json 읽는법: 단원 chapter,문항번호 number,문제타입 type(d,o(단답식,객관식)),정답 answer
// 범위 작성 예시 ex) A1-A16
let mainPageView ="none";
let enterancePageView="block";
let resultPageView="none";
let omrCardPageView="none";


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
			let marked = document.querySelector(`${'input[name="'+"omr_cell"+answer["Chapter"]+answer["Number"]+'"]:checked'}`).value;
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
function App() {
	return (
	<div id="app">
		<Enterance/>
	</div>
	);
}

//omr 라디오 버튼
function Radio({name, value, useAble}) {
	return(
	<div id="radio-container" >
		<input className={"value"+value} id={name+value} type="radio" name={name} value={value} disabled={useAble} style={{margin: "10px",}}/>
		<label style={{width:"23px"}} htmlFor={name+value}>{"ㅤ"}</label>
	</div>
	);
}

function Enterance() {	
	return (
		<div style={{justifyContent :"center"}} id="enterance">
			<div style={{width:"410px",margin:"auto",}} id="illust-container">
				<img style={{width: "410px"}} src="https://i.ibb.co/Qrw1MgH/Tiny-student-sitting-on-book-pile-and-reading.jpg" alt="Tiny-student-sitting-on-book-pile-and-reading" border="0"/>
			</div>
			<div id="text-container">
				<div style={{display:"flex",justifyContent: "center",}} id="title-text">
					<h1 style={{lineHeight:"30px"}}>ONLINE<br/>MARKING READER</h1>
				</div>
				<p style={{fontSize:"1.3em"}}>채점이 귀찮으시다고요?</p>
				<p>OMR이 자동으로 문제집을 채점해 드립니다.<br/>지금 바로 시작하세요!!</p>
			</div>
			<div style={{display :"flex",justifyContent: "center",marginTop:"200px"}} id="start-btn-container">
				<Button onclick={showMainPage} id="start" value={"시작하기"} />
			</div>
		</div>
	);
}

function Main() {
	const [subject,setSubject] = React.useState("loading");
	const [workbooks,setWorkbooks] = React.useState({loading:[{id:"loading",value:"loading"}]});
	const [loading,setLoading] = React.useState(true);
	const [workBook, setworkBook] = React.useState([]);
	const [wbLoading,setwbLoading] = React.useState(true);
	const [focus, setFocus] = React.useState({bg:"#32A37A",bs:"0px 0px 20px #6BE2B8"});
	const [startChp, setStartChp] = React.useState("");
	const [startNum, setStartNum] = React.useState("");
	const [maxNum, setMaxNum] = React.useState("1");

	function H1({value}) {
		return(<h1 style={{marginBottom:"0px",display:"flex",justifyContent:"center"}}>{value}</h1>)
	}
	function P({value}) {
		return(<p style={{marginTop:"0px",lineHeight:"0px"}}>{value}</p>)
	}
	async function onSubjectClick(event) {
		let classname = event.target.className;
		await focusing(event);
		if (event.target.className.includes("focused")) {
			classname = classname.replace("focused","");
		}
		setSubject(classname.slice(3,classname.length));
		fetch('./workbooks.json').then((response)=>response.json()).then((jsonData) => {
			console.log(jsonData);
			setWorkbooks(jsonData);
			setLoading(false);
		});
	}
	function Subject({value, className}) {
		return(
			<button type="button" className={className} onClick={onSubjectClick}>{value}</button>
		);
	}
	function focusing(event) {
		for (let elem of document.getElementsByClassName("sb")) {
			if(elem.className == event.target.className) {
				setFocus({bg:"#32A37A",bs:"0px 0px 20px #6BE2B8"});
				event.target.style.background = focus["bg"];
				event.target.style.boxShadow = focus["bs"];
			}
			else {
				setFocus({bg:"",bs:""});
				event.target.style.background = focus["bg"];
				event.target.style.boxShadow = focus["bs"];
			}
		}
	}
	function ChooseSubject() {
		return(
			<div id="sb-container" style={{display:"flex",justifyContent:"center",marginTop:"40px",marginBottom:"50px"}}>
				<Subject value="국어" className="sb korean"/>
				<Subject value="수학" className="sb math"/>
				<Subject value="영어" className="sb english"/>
				<Subject value="과학" className="sb science"/>
				<Subject value="사회" className="sb sociology"/>
			</div>
		);
	}
	async function onSelectWb(event){
		let wbIndex = event.target.value;
		let wbData = await (await fetch(`./workbooks/${wbIndex}.json`)).json();
		setworkBook(wbData);
		setwbLoading(false);
	}
	function WbDropdown({options}) {
		return(
			<div id="wbdropdown-container">
				<select id="wbdropdown" onChange={(event)=>onSelectWb(event)}>
					<option id="placeholder" value="">문제집을 선택하세요</option>
					{options.map((option) => (<option value={option["id"]} key={option["id"]}>{option["value"]}</option>))}
				</select>
			</div>
		);
	}
	function RangeStart() {	
		function StartCh({workbook}) {
			let chapters = Array.from(new Set(workbook.map((Q)=>(Q["Chapter"]))));
			return (
				<div id="range-chapter-start">
					<h3 style={{width: "40px"}}>시작</h3>
					<select onChange={(event)=>setStartChp(event.target.value)} id="start-chapter">
						<option id="placeholder" value="">단원 선택</option>
						{chapters.map((chapter) => (<option id={chapter} key={chapter} value={chapter}>{chapter}</option>))}
					</select>
					<h3 style={{width: "40px"}}>단원</h3>
				</div>
			);
		}
		function StartNum({workbook, startCh}) {
			let maxNum;
			let numbers = [];
			console.log(workbook);
			console.log(startCh);
			for (let i=workbook.length-1;i>=0;i--) {
				console.log(i, workbook[i]);
				if(workbook[i]["Chapter"]==startCh) {
					maxNum = workbook[i]["Number"];
					break
				}
			}
			for (let i=1; i<= maxNum; i++) {
				numbers.push(i);
			}
			return (
				<div id="range-number-start">
					<select onChange={(event)=>setStartNum(event.target.value)} id="start-number">
						<option id="placeholder" value="">문제 선택</option>
						{numbers.map((number) => (<option id={"n_"+number} key={number} value={number}>{number+" 번"}</option>))}
					</select>
					<h3 style={{width:"40px"}}>문제</h3>
				</div>
			);
		}
		return (
			<div id="range-start">
				<StartCh workbook={workBook} />
				<StartNum workbook={workBook} startCh={startChp}/>
			</div>
		);
		
	}
	function RangeEnd() {
		function EndCh() {
			return();
		}
		function EndNum() {
			return();
		}
		return (
			<div id="range-end">
				<EndCh workbook={workBook} startCh={startChp} startNum={startNum}/>
				<EndNum workbook={workBook} startCh={startChp} startNum={startNum}/>
			</div>
		);
	}
	function ChooseRange() {
		return(
			<div id="select-range-continer">
				<RangeStart/>
				<RangeEnd/>
				<button type="button" id="submit-range-btn">답안지 작성</button>
			</div>
		);
	}
	return (
		<div id="main" style={{display: "flex",justifyContent:"center"}}>
			<div id="container" style={{}}>
				<div id="revert-btn-container"></div>
				<div id="step1">
					<H1 value="STEP1"/>
					<P value="과목 선택하기"/>
					<ChooseSubject/>
				</div>
				<div id="step2">
					<H1 value="STEP2"/>
					<P value="문제집 선택하기"/>
					{loading==false ? <WbDropdown options={workbooks[subject]}/> : null}
				</div>
				<div id="step3">
					<H1 value="STEP3"/>
					<P value="범위 선택하기"/>
					{wbLoading==false ? <ChooseRange/> : null}
				</div>
			</div>
		</div>
	);
}

function showMainPage() {
	mainPageView="block";
    enterancePageView="none";
    resultPageView="none";
    omrCardPageView="none";
	ReactDOM.render(<Main/>,root);
}

function Button({id,cls,value,onclick}) {
	return(
        <div style={{justifyContent:"center",alignItems:"center"}} id="Button">
		<button type="button" id={id} onClick={onclick} className={cls}><span style={{fontSize :"1.7em", color :"#ffffff"}}>{value}</span></button></div>
	);
}

ReactDOM.render(<App/>,root);