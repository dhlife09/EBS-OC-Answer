

var tuieditor;
var tuiEditor_cnsrExplna;

$(document).ready(function(){

	var content = [ $("#qestnCn").val() ].join('\n');
	
	//TOAST UI VIEWER
	tuieditor = new tui.Editor({
		el: document.querySelector('#toastUiEditorViewer'),
        height: '300px',
		initialValue: content,
		exts: [
			'uml',
			'mark',
			'table'
		]
	});

	var cnsrExplnaContent = [ $("#cnsrExplna").val() ].join('\n');
	
	//TOAST UI VIEWER
	tuiEditor_cnsrExplna = new tui.Editor({
		el: document.querySelector('#tuiEditor_cnsrExplna'),
        height: '300px',
		initialValue: cnsrExplnaContent,
		exts: [
			'uml',
			'mark',
			'table'
		]
	});
	
	
	$('.ordlst a').click(function(){
		$('.navigation').css('left','-286px');
		$('.contentWrap').css('margin-left','0');
		$('.menu_open').css('display','block');
	});
	$('.menu_open').click(function(){
		$('.navigation').css('left','0px');
		$('.contentWrap').css('margin-left','286px');
		$(this).css('display','none');
	});

//	$('.radioselect').click(function(){
//		if($(this).hasClass('on')){
//			$(this).removeClass('on'); 		
//		} else {
//			$(this).addClass('on'); 
//		} 
//	});

// 	$('.show_comment').click(function(){
// 		$('.q_group .comment').css('display','block');
// 	});

// 	$("#beforeQuizBtn").hide();
// 	$("#nextQuizBtn").hide();

// 	//강의 학습 완료한 경우 왼쪽 메뉴에 class 변경
// 	var lctreSn = "5999010";
// 	var lrnAt = "";
// 	if( !fncIsEmpty( lrnAt ) && lrnAt == 1 ){
// 		$("#leftLctre_" + lctreSn).removeClass("on");
// 		$("#leftLctre_" + lctreSn).addClass("on");
// 	}

});

function fn_radioselect( obj ) {
// 		$('#oo').parent().addClass('on');
// 		$('#xx').parent().removeClass('on');
		
	$(obj).parent().addClass('on');
	$(obj).parent().siblings().removeClass('on');
}

function chkAnswer( quesType ) {
	
	var chkAnswerVal = false;
	var exSnArray = new Array();
	var exNoArray = new Array();

	var lctreSn = $("#lctreSn").val();
	
	var postData = {};
	postData.atnlcNo = $("#atnlcNo").val();
	postData.lctreSn = lctreSn;
	postData.cntntsSn = $("#cntntsSn").val();
	postData.qestnSn = $("#qestnSn").val();
	postData.cnsrCtrdCo = $("#cnsrCtrdCo").val();
	postData.quesTyCode = quesType;
	postData.stepSn = $("#stepSn").val();
	
	postData.lctreSeCode = $("#lctreSeCode").val();
	postData.cntntsTyCode = $("#cntntsTyCode").val();
	
	postData.sessSn = $("#sessSn").val();
	
	if( quesType == '001' ) {
		$("[name=quesType_001_answer]").each(function(){
			if( $(this).is(":checked") ){
				chkAnswerVal = true;
				
				exSnArray.push( $(this).attr("id") );
				exNoArray.push( $(this).val() );
			}
		});
		postData.exSns = exSnArray;
		postData.exNos = exNoArray;
		
	} else if( quesType == '002' ) {
		var answerVal = $.trim( $("#quesType_002_answer").val() );
		if( answerVal != '' ) {
			chkAnswerVal = true;
			
			postData.exCn = answerVal;
			postData.sbjctRspns = answerVal;
		}
	} else if( quesType == '003' ) {
		$("[name=radioselect]").each(function(){
			if( $(this).is(":checked") ){
				chkAnswerVal = true;
				
				postData.exSn = $(this).attr("id");
				postData.exNo = $(this).val();
				postData.exCn = $(this).attr("data-exCn");
			}
		});
	}
	
	if( !chkAnswerVal ) {
		alert("정답을 알려드릴게요!");
		$('.q_group .comment').show();
		$("#showCommentBtn").hide();
		$("#nextQuizBtn").show();
		alert("정답을 확인 후 페이지를 새로고침해서 정답을 입력하세요.");
	}
	
	fncPost( '/mypage/userlrn/chkQuizAnswerSelect.do', postData, function(data) {
		if (!fncIsEmpty(data)) {
			
			var lrnAt = data.lrnAt;
			if( !fncIsEmpty( lrnAt ) && lrnAt == 1 ){
				
				$("#leftLctre_" + lctreSn).removeClass("on");
				$("#leftLctre_" + lctreSn).addClass("on");
				
				if( opener ){
					opener.location.reload();
				}
				
			}
			
			if( data.result == "SUCCESS" ){
				if( data.answerChk == 'ANSWER' ) {
					$("#chkAnswerNote").text("정답입니다!");
					
					$('.q_group .comment').show();
					$("#showCommentBtn").hide();
					$("#nextQuizBtn").show();
				} else {
					if( data.tryAt == 'MAX' ) {
						// 마지막 접답시도
						$("#chkAnswerNote").text("틀렸습니다!");
						
						$('.q_group .comment').show();
						$("#showCommentBtn").hide();
						$("#nextQuizBtn").show();
					} else {
						alert("정답이 아닙니다.\n다시 시도해보세요.");
					}
				}
			} else if( data.result == "CNT_FAIL" ){
				alert("정답 시도 횟수가 초과하였습니다.");
				$('.q_group .comment').show();
				$("#showCommentBtn").hide();
				$("#nextQuizBtn").show();
			} else {
// 				alert("잠시후에 다시 시도해주세요.");
				alert("정답을 확인하는데 실패했습니다.\n다시 시도해주세요.");
				location.reload();
			}
			
		}
	});
	
}

//결과보기
function showQuizResult(){
	
	var lctreSn = "5999010";
	var cntntsSn = "88779";

	var postData = {};
	postData.lctreSn = lctreSn;
	postData.cntntsSn = cntntsSn;
	
	if( !fncIsEmpty( lctreSn ) && !fncIsEmpty( cntntsSn ) ){
		
		fncPost("/mypage/userlrn/quizResultSelect.do", postData, function(data){
			
			var quizResultVO = data.quizResultVO;
			
			if( !fncIsEmpty( quizResultVO ) ){
				
				//퀴즈 질문 갯수
				var quizCnt = quizResultVO.quizCnt;
				//퀴즈 응답 갯수
				var rspnsCnt = quizResultVO.rspnsCnt;
				//퀴즈 응답 중 맞은 갯수
				var cnsrCnt = quizResultVO.cnsrCnt;
		
				//퀴즈 질문 모두 응답한 경우
				if( quizCnt == rspnsCnt ){
					
					$("#quizCntSpan").text( quizCnt+"문제" );
					$("#cnsrCntSpan").text( cnsrCnt+"문제" );
					
					modalPopupOpen('result');
					
				//퀴즈 질문 중 응답하지 않은 질문이 있는 경우
				} else {
					alert("풀지 않은 퀴즈가 있습니다.");
				}
				
			} else {
				
			}
			
		});
		
	} else {
		alert("잘못된 요청입니다.");
	}

	
}

//상세결과보기
function showDetailResult(){
	modalPopupClose();
	loadCntnts( '5999010', '007', '1' );
}

//퀴즈 다시풀기
function resetQuizRspns(){
	
	var lctreSn = $("#lctreSn").val();
	
	var postData = {};
	postData.lctreSn = lctreSn;
	
	if( confirm("다시 풀기를 하시면 퀴즈 내역이 초기화 됩니다.\n다시 풀기를 진행하시겠습니까?") ){
		
		if( !fncIsEmpty( lctreSn ) ){
			fncPost( '/mypage/userlrn/resetQuizRspns.do', postData, function(data) {
				modalPopupClose();
				loadCntnts( '5999010', '007', '1' );
			});
		}
		
	}
	
}
