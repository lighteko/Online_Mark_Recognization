// json 읽는법: 단원 chapter,문항번호 number,문제타입 type(d,o(단답식,객관식)),정답 answer
const root = document.getElementById("root");
const omrcard = document.getElementById("omr-card");
const result = document.getElementById("result");


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
				<img style={{width: "410px"}} src="./img/Tiny student sitting on book pile and reading.jpg" border="0"/>
			</div>
			<div id="text-container">
				<div style={{display:"flex",justifyContent: "center",}} id="title-text">
					<h1 style={{lineHeight:"30px"}}>ONLINE<br/>MARKING READER</h1>
				</div>
				<p style={{fontSize:"1.3em"}}>채점이 귀찮으시다고요?</p>
				<p>OMR이 자동으로 문제집을 채점해 드립니다.<br/>지금 바로 시작하세요!!</p>
			</div>
			<div style={{display :"flex",flexDirection:"column", justifyContent: "center",marginTop:"150px"}} id="start-btn-container">
				<Button onclick={showMainPage} id="start" value={"시작하기"}/>
				<div style={{marginTop:"10px"}}>
				<Button onclick={()=>(window.open("https://forms.gle/8pH3hckDVSkbTkgd9", '_blank'))} id="add" value={"문제집 추가 신청"} />
				</div>
			</div>
		</div>
	);
}

function Main() {
    const [mainView, setMainView] = React.useState("flex");	
	const [step1Load,setStep1Load] = React.useState(true);
	const [step2Load,setStep2Load] = React.useState(true);
	const [step3Load,setStep3Load] = React.useState(true);

	const [workbooks,setWorkbooks] = React.useState();
	React.useEffect(async () => {
		let workbooksJSON = await (await fetch("./workbooks.json")).json();
		setWorkbooks(workbooksJSON);
	},[]);
	
	//step1
	const [subject,setSubject] = React.useState();
	function Step1() {
		function Subject({value, className}) {
			return(
				<div  className="subject-container" id={"subject-"+className.slice(3,className.length)}>
					<input type="radio" id={className.slice(3,className.length)} onChange={onChange} className={className} name="subject-radio" value={className.slice(3,className.length)} checked={subject === className.slice(3,className.length)}/>
					<label htmlFor={className.slice(3,className.length)}>{value}</label>
				</div>
			);
		}
		function ChooseSubject() {
			return(
				<div id="sb-container"  style={{display:"flex",justifyContent:"center",marginTop:"40px",marginBottom:"50px"}}>
	 			   	<Subject value="국어" className="sb korean"/>
				    <Subject value="수학" className="sb math"/>
				    <Subject value="영어" className="sb english"/>
				    <Subject value="과학" className="sb science"/>
				    <Subject value="사회" className="sb sociology"/>
	  		  	</div>
			);
		}
		function onChange(e) {
			setSubject(e.target.value);
			setStep1Load(false);
		}
		return (
			<div id="step1">
				<H1 value="STEP1"/>
				<P value="과목 선택하기"/>
				<ChooseSubject/>
			</div>
		);
	}

	//step2
	const [workbook,setWorkbook] = React.useState("");
	const [workbookData,setWorkbookData] = React.useState();
	function Step2() {
		function onSelect(event){
			let wbIndex = event.target.value;
			setWorkbook(wbIndex);
            fetch(`./workbooks/${wbIndex}.json`)
	            .then((data) => data.json())
	            .then((data)=>dataUpdate(data));
		    function dataUpdate(d) {
			    setWorkbookData(d);
				window.sessionStorage.setItem("workbookData", JSON.stringify(d));
				window.sessionStorage.getItem("workbookData");
			    setStep2Load(false);
			}	
		}

		function WbDropdown() {
			let options = workbooks[subject];
			return(
			<div id="wbdropdown-container">
				<select id="wbdropdown" onChange={onSelect} value={workbook}>
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
				<WbDropdown/>
			</div>
		);
	}
	
    //step3
	function Step3() {
		const [startChapter,setStartChapter] = React.useState();
		const [startNumber,setStartNumber] = React.useState();
		const [endChapter,setEndChapter] = React.useState();
		const [endNumber,setEndNumber] = React.useState();
		//range states

		const [Sloading,setSLoading] = React.useState(true); //start range loaded boolean
		const [Eloading,setELoading] = React.useState(true);

		const [sNumber,setsNumber] = React.useState([]); //range number list
		function RangeStart() {
			function StartChapter({workbook}) {
				let chapters = Array.from(new Set(workbook.map((Q)=>(Q["Chapter"]))));
				function onChange(e) {
					let maxNum;
					let numbers = [];
					setStartChapter(e.target.value);
					for (let i=workbook.length-1;i>=0;i--) {
						if(workbook[i]["Chapter"]==e.target.value) {
							maxNum = workbook[i]["Number"];
							break
						}
					}
					for (let i=1; i<= maxNum; i++) {
						numbers.push(i);
						if (i==maxNum) {
							setsNumber(numbers);
						}
					}
				}
				return (
					<div id="range-chapter-start">
						<h3 style={{width: "40px"}}>시작</h3>
						<select onChange={onChange} id="start-chapter" value={startChapter}>
							<option id="placeholder" value="">단원 선택</option>
							{chapters.map((chapter) => (<option id={chapter} key={chapter} value={chapter}>{chapter}</option>))}
						</select>
						<h3 style={{width: "40px"}}>단원</h3>
					</div>
				);
			}
			function StartNumber({numbers}) {
				function onChange(e) {
					setStartNumber(e.target.value);
					setSLoading(false);
				}
				return (
					<div id="range-number-start">
						<select onChange={onChange} id="start-number" value={startNumber}>
							<option id="placeholder" value="">문제 선택</option>
							{numbers.map((number) => (<option id={"n_"+number} key={number} value={number}>{number+" 번"}</option>))}
						</select>
						<h3 style={{width:"40px"}}>문제</h3>
					</div>
				);
			}
			return (
				<div id="range-start">
					<StartChapter workbook={workbookData}/>
					<StartNumber numbers={sNumber}/>
				</div>
			);
		}

		const [eNumber,seteNumber] = React.useState([]); // range number list
		function RangeEnd() {
			let chapters = Array.from(new Set(workbookData.map((Q)=>(Q["Chapter"]))));
			chapters = chapters.slice(chapters.indexOf(startChapter),chapters.length);
			function EndChapter({workbook, chapters}) {
				function onChange(e) {
					let maxNum;
					let Numbers = [];
					setEndChapter(e.target.value);
					if (e.target.value===startChapter) {
						const startNumberInt = Number(startNumber);
						const res = sNumber.slice(sNumber.indexOf(startNumberInt),sNumber.length);
						seteNumber(res);
					}
					else {
						for (let i=workbook.length-1;i>=0;i--) {
							if(workbook[i]["Chapter"]==e.target.value) {
								maxNum = workbook[i]["Number"];
								break
							}
						}
						for (let i=1; i<= maxNum; i++) {
							Numbers.push(i);
							if (i==maxNum) {
								seteNumber(Numbers);
							}
						}
					}
				}
				return(
					<div id="range-chapter-end">
						<h3 style={{width: "40px"}}>끝</h3>
						<select onChange={onChange} id="end-chapter" value={endChapter}>
							<option id="placeholder" value="">단원 선택</option>
							{chapters.map((chapter) => (<option id={chapter} key={chapter} value={chapter}>{chapter}</option>))}
						</select>
						<h3 style={{width: "40px"}}>단원</h3>
					</div>
				);
			}
				
			function EndNum({numbers}) {
				function onChange(e) {
					setEndNumber(e.target.value);
					setELoading(false);
				}
				return (
					<div id="range-number-end">
						<select onChange={onChange} id="end-number" value={endNumber}>
							<option id="placeholder" value="">문제 선택</option>
							{numbers.map((number) => (<option id={"n_"+number} key={number} value={number}>{number+" 번"}</option>))}
						</select>
						<h3 style={{width:"40px"}}>문제</h3>
					</div>
				);
			}
			
			return(
				<div id="range-end">
					<EndChapter workbook={workbookData} chapters={chapters}/>
					<EndNum numbers={eNumber}/>
				</div>
			);
		}
			
		function ChooseRange() {
			function onClick() {
				window.sessionStorage.setItem("range", [startChapter,startNumber,endChapter,endNumber]);
				showOMRPage();
				setMainView("none");
			}
			return(
				<div id="select-range-container">
					<RangeStart/>
					{Sloading==false ? <RangeEnd/> : null}
					{Eloading==false ? <Button id="range-submit-btn" onclick={onClick} value="답안지 작성" /> : null}
				</div>
			);
		}
		return(
			<div id="step3">
				<H1 value="STEP3"/>
				<P value="범위 선택하기"/>
				<ChooseRange/>
			</div>
		);
	}

	return (
		<div id="main" style={{display: mainView,justifyContent:"center"}}>
			<div id="container">
				<Step1/>
				{step1Load == false ? <Step2/> : null}
				{step2Load == false ? <Step3/> : null}
			</div>
		</div>
	);
}

// OMR카드 컴포넌트
function OMR() {
	const [workbook, setWorkbook] = React.useState([]);
	const [range,setRange] = React.useState([]);
	const [omrView, setOmrView] = React.useState("flex");
	const [cells, setCells] = React.useState([]);
	
	// 채점 범위를 입력했을 때, 선택한 문제집의 답지 정보를 입력한 범위 만큼만 추출해서 답안 리스트로 만드는 함수
	function answerParser(range,jsonData) {
		let keepAppend = false;
		let appendStarted = false;
		const [startCh,startNum,endCh,endNum] = range;
		let parsedAns = [];
		let answersList = [];
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
				setCells(parsedAns);
				break
			}
		}
	}
	React.useEffect(() => {
		let range = window.sessionStorage.getItem("range");
		range = range.split(",");
		let jsonData = window.sessionStorage.getItem("workbookData");
		jsonData = JSON.parse(jsonData);
		setWorkbook(jsonData);
		answerParser(range, jsonData);
	},[]);

	function Mark({name, value}) {
		return(
		<div id="radio-container" >
			<input className={"mark value"+value} id={name+value} type="radio" name={name} value={value} style={{margin: "10px",}} />
			<label style={{width:"23px"}} htmlFor={name+value}>{"ㅤ"}</label>
		</div>
		);
	}
	
	function OmrCell({Num,Type}) {
		function Objective({Num}) {
			return (
				<div id="objective" style={{display:"flex"}}>
					<Mark name={"cell"+Num} value="1"/>
					<Mark name={"cell"+Num} value="2"/>
					<Mark name={"cell"+Num} value="3"/>
					<Mark name={"cell"+Num} value="4"/>
					<Mark name={"cell"+Num} value="5"/>
				</div>
			);
		}
		function Directive({Num}) {
			function onInput(event) {
				event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
				event.target.value = event.target.value.slice(0,3);
				if (event.target.value.length >=2 && event.target.value[0]==0) {
					event.target.value = event.target.value.slice(1,3);
				}
				else if (event.target.value.length >=2 && event.target.value[0]==0 && event.target.value[1]==0) {
					event.target.value = event.target.value.slice(2,3);
				}
			}
			return(
				<>
					<span id="input-text" style={{color: "#035A58",marginRight:"10px",marginLeft:"50px"}}>단답형</span>
					<input style={{width:"50px",textAlign:"center",borderRadius:"5px",border:"0px",background:"#CDEADD",color:"#035A58"}} type="text" onInput={onInput} name={"dir-cell"+Num}/>
				</>
			);
		}
		return (
		<div className="omr-block" id={"omr-block"+Num} style={{display: "flex",}}>
			<div id="omr-container" style={{display:"flex", alignItems: "center"}}>
				<span style={{width: "50px",fontFamily: "GmarketSansBold", color: "#035A58"}}>{Num}</span>
				{Type==="O" ? <Objective Num={Num}/> : <Directive Num={Num}/>}
			</div>
		</div>
		);
	}
	
	function OMRblocks() {
		function checkAnswer() {
			let wrongMarks = [];
			let counter = 0;
			for (let cell of cells) {
				if (cell["Type"]==="D") {
					let mark = document.querySelector(`input[name="dir-cell${cell["Chapter"]+cell["Number"]}"]`).value;
					if (mark != cell["Answer"]) {
						wrongMarks.push(String(cell["Chapter"]+cell["Number"]))
					}
				}
				else {
					let mark = document.querySelector(`input[name="cell${cell["Chapter"]+cell["Number"]}"]`).value;
					if (mark != cell["Answer"]) {
						wrongMarks.push(String(cell["Chapter"]+cell["Number"]))
					}
				}
				if (counter === cells.length-1) {
					window.sessionStorage.setItem("wrongAnswers", wrongMarks);
					return 
				}
				counter += 1;
			}
		}
		function onClick() {
			checkAnswer();
			showResultPage();
			setOmrView("none");
		}
		const Blocks = cells.map((cell) => <OmrCell key={cell["Chapter"] + cell["Number"]} Num={cell["Chapter"] + cell["Number"]} Type={cell["Type"]}/>);
		return (
			<div style={{display: omrView, flexDirection:"column"}}>
				<div id="top-bar" style={{display: "flex",zIndex:"3",background:"#ffffff",height: "auto",position:"absolute",left:"0px",top:"0px"}}>
					<h2 style={{width: "70px",margin:"0px",lineHeight:"55px",marginLeft:"30px"}}>OMR</h2>
				</div>
			    <div id="omr-blocks">{Blocks}</div>
			    <Button onclick={onClick} id="check" value="채점하기"/>
			</div>
		);
	}
	return <OMRblocks/>
}

function Result() {
	let wrongAns = window.sessionStorage.getItem("wrongAnswers");
	wrongAns = wrongAns.split(",");
	const length = wrongAns.length;
	return (
		<div id="result-container">
			<div id="top-bar" style={{display: "flex",zIndex:"3",background:"#ffffff",height: "auto",position:"absolute",left:"0px",top:"0px"}}>
				<h2 style={{width: "70px",margin:"0px",lineHeight:"55px",marginLeft:"30px"}}>Result</h2>
			</div>
			<div style={{marginTop:"200px",display:"flex",flexWrap:"wrap",justifyContent:"center"}}>
			{wrongAns.map((Ans)=> (<span key={Ans} style={{fontSize:"2em",fontFamily:"GmarketSansBold",height:"fit-content",marginLeft:"3px",marginRight:"3px"}}>{Ans}</span>))}
			</div>
			<div style={{display:"flex",justifyContent:"center",marginBottom:"200px"}}>
			{wrongAns.length === 0 ? <h2 style={{display:"flex",justifyContent:"center"}}>틀린 문제가 없습니다!!</h2> : <h2 style={{display:"flex",justifyContent:"center"}}>총 {length} 문제를 틀렸습니다</h2>}
			</div>
			<Button id="refresh" value="처음으로" onclick={()=>(window.location.reload())}/>
			<div style={{marginTop:"20px"}}>
			<Button id="feedback" value="피드백 하기" onclick={()=>(window.open("https://forms.gle/2MEyBs1tDmJ6adA77", '_blank'))}/>
			</div>
		</div>
	);
}

function showMainPage() {
	ReactDOM.render(<Main/>,root);
}

function showOMRPage() {
	ReactDOM.render(<OMR/>,omrcard);
}

function showResultPage() {
	ReactDOM.render(<Result/>,result);
}

ReactDOM.render(<Enterance/>,root);