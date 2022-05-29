const root = document.getElementById("root");

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
	const MarkRange = () => {
		return (
			<div id={wbIndex} style={{display: showRange}}>
				<input id="select-range" placeholder="채점 범위를 입력해 주세요"/>
			</div>
		);
	};
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



ReactDOM.render(<App/>,root);