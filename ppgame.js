window.addEventListener("load", init, false);
window.addEventListener("keydown", onKeyDown, false);

var game = false;
var bgLeft = 0;
var cloudLeft = 0;
var first = 1;
var last = 0;
var clFirst = 1;
var clLast = 0;
var bgImgCnt = 0;
var clImgCnt = 0;
var keyCnt = 0;
var question = 0;
var answer = false;
var keyStopPoint = 50;
var keyAddPoint = keyStopPoint - 10;

// mobile
$(document).ready(function() {

	// space
	$('.c32').bind( "click", function(e) {
		if ( game === false ) {
			gameStart();
		} else {
			gamePause();
		}
		e.preventDefault();	// 이벤트취소
		// console.log(e.target.textContent);
	});

	$('.c49').bind( "click", function() {
		// console.log(e.target.textContent);
		if ( question > 0 ) {
			var selectKey = 49 - 48;
			var childKey = 49 - 49;
			problemSolving(selectKey, childKey);
		}
	});

	$('.c50').bind( "click", function() {
		if ( question > 0 ) {
			var selectKey = 50 - 48;
			var childKey = 50 - 49;
			problemSolving(selectKey, childKey);
		}
	});

	$('.c51').bind( "click", function() {
		if ( question > 0 ) {
			var selectKey = 51 - 48;
			var childKey = 51 - 49;
			problemSolving(selectKey, childKey);
		}
	});

	$('.c39').bind('touchstart', function(e) {
		if ( game === false ) {
			alert('시작버튼으로 시작할 수 있습니다.');
			return;
		} else {
			// $("#msg").html("터치가 시작되었어요.");
			$(this).addClass('keydown');
			e.preventDefault();	// 이벤트취소
		}
	});

	$('.c39').bind('touchmove', function(e) {
		if ( game === false ) {
			alert('space 로 시작할 수 있습니다.');
			return;
		} else {
			//	jQuery 이벤트 객체를 자바스크립트 표준 이벤트 객체로 바꾸기
			//	이유는 jQuery 에서 자바 스크립트
			var event = e.originalEvent;
			$('#msg').html('touch 이벤트 중입니다.'); 
			//	div에 터치한 좌표값 넣기
			event.preventDefault();
			if( keyCnt < (keyStopPoint+(keyAddPoint*2)+(keyAddPoint/2)+1) ) {
				ppGame();
			}
		}
	});

	$('.c39').bind('touchend', function(e) {
		// $("#msg").append("<div>터치이벤트가 종료되었어요</div>"); 
		$(this).removeClass('keydown');
	});

});

// pc
$(window).keydown(function(e) {
	if ( game === true ) {
		key = (e.keyCode) ? e.keyCode : e.which;
		$('.key.c' + key).addClass('keydown');
		// console.log(key);
	}
});

$(window).keyup(function(e) {
	if ( game === true ) {
		key = (e.keyCode) ? e.keyCode : e.which;
		$('.key.c' + key).removeClass('keydown');
	}
});

// 게임 세팅
function init() {
	$('.background').each(function(){   // 5px 간격으로 배너 처음 위치 시킴
		$(this).css("left",bgLeft);
		bgLeft += $(this).width();
		$(this).attr("id", "bg_"+(++bgImgCnt));  // img에 id 속성 추가
		last = bgImgCnt;
	});
	$('.cloud').each(function(){
		// $(this).css("left",cloudLeft);
		// cloudLeft += $(this).width();
		$(this).attr("id", "cl_"+(++clImgCnt));
		clLast = clImgCnt;
	});
}

// space - 게임시작
function gameStart() {
	game = true;

	// 메세지 알림
	$('.game-msg').text('Game Start !');
	$('.game-msg').show();
	setTimeout(function(){
		$('.game-msg').fadeOut( "slow" );
	}, 1500);

	// jump 후에 옆으로 돌기
	$('.user').animate({ top : -133 }, 300, function(){
		$(this).animate({ top : -65 }, 300, function() {
			// Animation complete
			$(this).css('background-position', '-55px -237px');
			$(this).css('width', '40px');
			// $(this).css('height', '55px');
			$(this).css('top', '-62px');
		});
	});
}

// space - 게임 정지
function gamePause() {
	game = false;

	// 메세지 알림
	$('.game-msg').text('Pause');
	$('.game-msg').show();

	// 앞으로 돌고 jump 하기
	$('.user').animate({ top : -133 }, 300, function(){
		$(this).animate({ top : -65 }, 300);
	});
	$('.user').each(function(){
		$(this).css('background-position', '-3px -12px');
		$(this).css('width', '45px');
		// $(this).css('height', '59px');
		$(this).css('top', '-65px');
	});
}

// key 입력 - 게임 모든 상황을 지배
function onKeyDown() {
	var $question;
	var keycode = event.keyCode;
	// alert(keycode);

	// 백스페이스 8 // F5 116
	if ( keycode == 8 || keycode == 116 ) {
		event.returnValue = false; // 브라우저 기능 키 무효화
	}

	if ( (game === false) && (keycode != 32) ) {
		alert('space 로 시작할 수 있습니다.');
		return;
	}

	// 32 스페이스바
	if ( keycode == 32 ) {
		if ( game === false ) {
			gameStart();
		} else {
			gamePause();
		}
		return;
	}

	// 39 오른쪽 방향키 // 37 왼쪽 방향키
	if ( keycode == 39 ) {
		if( keyCnt < (keyStopPoint+(keyAddPoint*2)+(keyAddPoint/2)+1) ) {
			ppGame();
		}
		
		return;
	}

	// 숫자1 49
	if ( (keycode == 49) || (keycode == 50) || (keycode == 51) ) {
		// 아무때나 눌리면 안됨 !!
		if ( question > 0 ) {
			var selectKey = keycode - 48;
			var childKey = keycode - 49;
			problemSolving(selectKey, childKey);
		}
	}
}

// 걸어가는 모습 - 이미지 css change
function walking() {

	// 1번 -5px -240px // 2번 -55px -237px // 3번 -105px -240px // 4번 -155px -237px
	$('.user').each(function(){
		if ( $('.user').css('background-position') == '-155px -237px' ) {
			$(this).css('background-position', '-5px -240px');
		} else if ( $('.user').css('background-position') == '-5px -240px' ) {
			$(this).css('background-position', '-55px -237px');
		} else if ( $('.user').css('background-position') == '-55px -237px' ) {
			$(this).css('background-position', '-105px -240px');
		} else { // 기본 1번
			$(this).css('background-position', '-155px -237px');
		}
	});
}

// 배경 움직이기
function bgBack() {
	var $first;
	var $last;

	$('.background').each(function(){
		$(this).css("left", $(this).position().left-20); // 1px씩 왼쪽으로 이동
	});
	$first = $("#bg_"+first);
	$last = $("#bg_"+last);
	if($first.position().left < -300) {    // 제일 앞에 배너 제일 뒤로 옮김
		$first.css("left", $last.position().left + $last.width() );
		first++;
		last++;
		if(last > bgImgCnt) { last=1; }   
		if(first > bgImgCnt) { first=1; }
	}
}

// 구름 움직이기
function bgCloud() {
	var $first;
	var $last;

	$('.cloud').each(function(){
		$(this).css("left", $(this).position().left-3); // 1px씩 왼쪽으로 이동
	});
	$first = $("#cl_"+clFirst);
	$last = $("#cl_"+clLast);
	if($first.position().left < -90) {    // 제일 앞에 배너 제일 뒤로 옮김
		$first.css("left", $last.position().left + $last.width() + 50 );
		clFirst++;
		clLast++;
		if(clLast > clImgCnt) { clLast=1; }   
		if(clFirst > clImgCnt) { clFirst=1; }
	}
}

// 다 걷고 마지막에 걸어가기
function lastAnimate() {
	// console.log( "Here");

	var Pos = 35;
	var Status = 0;
	var MoveSpeed = 7;
	var Last = function(){
		setTimeout(function(){
			$('.result-msg').text('Would You Marry Me ?');
			$('.result-msg').show();

			setTimeout(function(){
				$('.gift-wrap').show();
			}, 5000);
		}, 400);
	};
	var Move = function(){
		setTimeout(function(){
			Status++;

			// 혼자 걸어가기
			if( Status % 4 == 0 ){
				Pos+=MoveSpeed;
				$('.user').css('background-position', '-5px -240px');
			}else if( Status % 4 == 1 ){
				Pos+=MoveSpeed+2;
				$('.user').css('background-position', '-55px -237px');
			}else if( Status % 4 == 2 ){
				Pos+=MoveSpeed+2;
				$('.user').css('background-position', '-105px -240px');
			}else if( Status % 4 == 3 ){
				Pos+=MoveSpeed;
				$('.user').css('background-position', '-155px -237px');
			}

			$(".user").css('left', Pos+'px');

			// 중심으로 이동
			if( Pos < 270 ){
				Move();
			} else {
				$('.user').css('background-position', '-3px -12px');
				$('.user').css('width', '45px');

				Last();
			}
		}, 400);
	};

	Move();
}

// 게임진행
function ppGame() {

	// 첫번째 문제
	if ( keyCnt == keyStopPoint ) {
		question = 1;
		$('.question').fadeIn( "slow" );
		$('.first').fadeIn( "slow" );
	// 두번째 문제
	} else if ( keyCnt == (keyStopPoint+keyAddPoint) ) {
		question = 2;
		$('.question').fadeIn( "slow" );
		$('.first').css('display', 'none');
		$('.second').fadeIn( "slow" );
	// 세번째 문제
	} else if ( keyCnt == (keyStopPoint+(keyAddPoint*2)) ) {
		question = 3;
		$('.question').fadeIn( "slow" );
		$('.second').css('display', 'none');
		$('.third').fadeIn( "slow" );
	// 마지막 작업
	} else if ( keyCnt == (keyStopPoint+(keyAddPoint*2)+(keyAddPoint/2)) ) {
		question = 0;
		keyCnt++; // lastAnimate 조건 때문에

		// 가운데까지 걸어나갑니다.
		lastAnimate();
	} else {

		// 사람 움직이기
		// 세 번 움직일 때 마다 동작 변경 // 2..5..8..11...
		if ( keyCnt % 3 == 2 ) {
			walking();
		}

		// 배경 움직이기
		bgBack();
		bgCloud();

		// console.log(keyCnt);
		keyCnt++;
	}
}

// 문제 풀기
function problemSolving(selectKey, childKey) {

	alert( selectKey + '번을 선택하셨습니다.' );

	if ( question == 2 ) {
		$question = $('.second span');
	} else if ( question == 3 ) {
		$question = $('.third span'); 
	} else {
		$question = $('.first span');
	}

	// 답에 체크표시
	$question.removeClass('on');
	$question.eq(childKey).addClass('on');

	if ( ( (question == 1) && (selectKey == 3) ) || ( (question == 2) && (selectKey == 1) ) || ( (question == 3) && (selectKey == 2) ) ) {
		answer = true;
	}

	// 정답 보여주기
	if ( answer === false ) {
		$('.result-msg').text('fail');
		$('.result-msg').show();
	} else if ( answer === true ) {
		$('.result-msg').text('success');
		$('.result-msg').show();

		// jump
		$('.user').each(function(){
			$(this).css('background-position', '-3px -12px');
			$(this).css('width', '45px');
			$(this).css('height', '59px');
		});
		$('.user').animate({ top : -183 }, 300, function(){
			$(this).animate({ top : -73 }, 300);
			$(this).animate({ top : -143 }, 300);
			$(this).animate({ top : -65 }, 300, function() {
				$(this).css('background-position', '-55px -237px');
				$(this).css('width', '40px');
				// $(this).css('height', '55px');
				$(this).css('top', '-62px');
			});
		});

		// animate 로 끝나고 fadeout 시키기
		// settimeout 도 써보기
		setTimeout(function(){
			$('.question').fadeOut('slow');
			$('.result-msg').hide();
			$('.game-msg').text('Go !');
			$('.game-msg').show();
			$('.key').removeClass('keydown');
			setTimeout(function(){
				$('.game-msg').fadeOut('slow');
			}, 1000);
		}, 2000);

		answer = false;
		keyCnt++;
		question = 0;
	}
}