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

function Radio({name, value, useAble}) {
	return(
	<div id="radio-container" >
		<input className={"value"+value} id={name+value} type="radio" name={name} value={value} disabled={useAble} style={{margin: "10px",}}/>
		<label style={{width:"23px"}} htmlFor={name+value}>{"ㅤ"}</label>
	</div>
	);
}

function H1({value}) {
	return(<h1 style={{marginBottom:"0px",display:"flex",justifyContent:"center"}}>{value}</h1>)
}

function P({value}) {
	return(<p style={{marginTop:"0px",lineHeight:"0px"}}>{value}</p>)
}

function Button({id,cls,value,onclick}) {
	return(
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} id={id+"-container"}>
			<button type="button" id={id} onClick={onclick} className={cls}>
				<span style={{fontSize :"1.7em", color :"#ffffff"}}>{value}</span>
			</button>
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
	const [step1Load,setStep1Load] = React.useState();
	const [step2Load,setStep2Load] = React.useState();
	const [step3Load,setStep3Load] = React.useState();
	function Step1() {
		function Subject({value, className}) {
			return(
				<button type="button" className={className} onClick={onSubjectClick}>{value}</button>
			);
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

		return (
			<div id="step1">
				<H1 value="STEP1"/>
				<P value="과목 선택하기"/>
				<ChooseSubject/>
			</div>
		);
	}

	function Step2() {
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

		return(
			<div id="step2">
				<H1 value="STEP2"/>
				<P value="문제집 선택하기"/>
				<WbDropdown options={workbooks[subject]}/>
			</div>
		);
	}

	function Step3() {
		function onRangeStart(event) {
			setRsloading(false);
			setStartNum(event.target.value);
		}
	
		function onRangeEnd(event) {
			setReloading(false);
			setEndNum(event.target.value);
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
				for (let i=workbook.length-1;i>=0;i--) {
					if(workbook[i]["Chapter"]==startCh) {
						maxNum = workbook[i]["Number"];
						setMaxNum(maxNum);
						break
					}
				}
				for (let i=1; i<= maxNum; i++) {
					numbers.push(i);
				}
				return (
					<div id="range-number-start">
						<select onChange={(event)=>onRangeStart(event)} id="start-number">
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
			function EndCh({workbook, startCh, startNum}) {
			const [pickAbleChaps, setPickAbleChaps] = React.useState([]);
			let chapters = [];
			async function chapterfinder() {
				for (let i=0;i<workbook.length;i++) {
					if (startCh == workbook[i]["Chapter"]) {
						if (startNum == workbook[i]["Number"]) {
							chapters.push(workbook[i]["Chapter"]);
						}
					}
				}
			function chaptermaker() {
				chapters = chapters.slice(1,chapters.length);
				chapters = Array.from(new Set(chapters));
				setPickAbleChaps(chapters);
			}
			
			chapterfinder().then(()=>chaptermaker());
			
			return(
				<div id="range-number-start">
					<h3 style={{width: "40px"}}>끝</h3>
					<select onChange={(event)=>setEndChp(event.target.value)} id="end-chapter">
						<option id="placeholder" value="">단원 선택</option>
						{pickAbleChaps.map((chapter) => (<option id={chapter} key={chapter} value={chapter}>{chapter}</option>))}
					</select>
					<h3 style={{width: "40px"}}>단원</h3>
				</div>
			);
		}
		function EndNum({workbook, endCh}) {
			let maxNum; 
			let numbers = [];
			for (let i=workbook.length-1;i>=0;i--) {
				if(workbook[i]["Chapter"]==startChp) {
					maxNum = workbook[i]["Number"];
					break
				}
			}
			for (let i=1; i<= maxNum; i++) {
				numbers.push(i);
			}
			return (
				<div id="range-number-end">
					<select onChange={(event)=>onRangeEnd(event)} id="end-number">
						<option id="placeholder" value="">문제 선택</option>
						{numbers.map((number) => (<option id={"n_"+number} key={number} value={number}>{number+" 번"}</option>))}
					</select>
					<h3 style={{width:"40px"}}>문제</h3>
				</div>
			);
		}
		return(
			<div id="range-end">
				<EndCh workbook={workBook} startCh={startChp} startNum={startNum}/>
				<EndNum workbook={workBook} endCh={endChp}/>
			</div>
		);
	}
		}
		
		function ChooseRange() {
		return(
			<div id="select-range-container">
				<RangeStart/>
				{rsloading==false ? <RangeEnd/> : null}
				{reloading==false ? <Button id="range-submit-btn" value="답안지 작성" /> : null}
			</div>
		);
	}	
		
		return(
			<div id="step3">
				<H1 value="STEP3"/>
				<P value="범위 선택하기"/>
				{wbLoading==false ? <ChooseRange/> : null}
			</div>
		);
	}

	return (
		<div id="main" style={{display: "flex",justifyContent:"center"}}>
			<div id="container">
				<div id="revert-btn-container"></div>
				<Step1/>
				{step1Load == false ? <Step2/> : null}
				{step2Load == false ? <Step3/> : null}
				{step3Load == false ? <submit/> : null}
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

ReactDOM.render(<App/>,root);