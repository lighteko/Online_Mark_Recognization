// csv 읽는법: 단원,문항번호,문제타입(d,o(단답식,객관식)),정답

const root = document.getElementById("root");

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

const App = () => (
	<div id="app">
		<h1>OMR: 온라인 문제집 자동 채점 서비스</h1>
		<h3>이용해 주셔서 감사합니다.</h3>
		<Workbooks />
	</div>
);


function Workbooks() {
	const [wbIndex, setWbIndex] = React.useState();
	const [showRange, setShowRange] = React.useState("none");
	const [showOMR, setShowOMR] = React.useState("none");
	const [omrRange, setOmrRange] = React.useState();
	const onSelect = (event) => {
		const val = event.target.value;
		if (val != "") {
			setWbIndex(val);
			setShowRange("block");
		}
		else {
			setShowRange("none");
		}

	};
	const onRange = (event) => {
		const val = event.target.value;
		if (val != "") {
			setOmrRange(val);
			console.log(val);
			setShowOMR("block");
		}
		else {
			setOmrRange();
			console.log(val);
			setShowOMR("none");
		}
	}
	function MarkRange() {
		return (
			<div id={wbIndex} style={{display: showRange}}>
				<input onInput={onRange} id="select-range" placeholder="채점 범위를 입력해 주세요"/>
			</div>
		);
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
			<OMRcard workbook={wbIndex} display={showOMR} range={omrRange}/>
		</div>
	);
}

function OMRcard({workbook,display,range}) {
	fetch(`./${workbook}.json`)
		.then((response) => {
			return response.json();
		})
		.then(jsonData => console.log(jsonData));
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

ReactDOM.render(<App/>,root);