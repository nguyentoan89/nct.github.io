var cards = ['img/f1.jpg', 'img/f2.jpg', 'img/f3.jpg', 'img/f4.png', 'img/f5.jpg', 'img/f6.jpg', 'img/f7.jpg', 'img/f8.jpg', 'img/f9.jpg', 'img/f10.png', 'img/f11.png', 'img/f12.jpg'];
var backgroundmusic = {
    audiobackground: 'backgroundmusic/nhacnen.mp3',
    audiovictory: 'backgroundmusic/victory.mp3',
    audiogameover: 'backgroundmusic/dianguc.mp3',
    audiocorrect: 'backgroundmusic/correct.mp3'
};
var backCard = 'img/behind.jpg';
var current = null;
var check = [];
var normalModeTime = 30;
var hardModeTime = 25;
var progressBarNumber = 100;
var proressPercent = Number($('.progress-bar').attr('style').substring(6, 10));
var count = 0;

/*random quan bai*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function music(backgroundmusic) {
    var audio = document.createElement("audio");
    audio.src = backgroundmusic;
    audio.addEventListener("ended", function () {
        document.removeChild(this);
    }, false);
    return audio;
}

/*progress-bar chay thoi gian choi*/
function progressTime(timeMode) {
    proressPercent -= (100 / timeMode);
    if (proressPercent <= 100 && proressPercent >= 80) {
        $('.progress-bar').addClass('progress-bar-info');
        $('.progress-bar').css({
            'transition': 'width 1s linear',
            'width': proressPercent + '%',
            'transition-duration': '1s'
        });
    } else if (proressPercent < 80 && proressPercent >= 50) {
        $('.progress-bar').removeClass('progress-bar-info');
        $('.progress-bar').addClass('progress-bar-success');
        $('.progress-bar').css({
            'transition': 'width 1s linear',
            'width': proressPercent + '%',
            'transition-duration': '1s'
        });

    } else if (proressPercent < 50 && proressPercent >= 20) {
        $('.progress-bar').removeClass('progress-bar-info');
        $('.progress-bar').addClass('progress-bar-warning');
        $('.progress-bar').css({
            'transition': 'width 1s linear',
            'width': proressPercent + '%',
            'transition-duration': '1s'
        });
    } else if (proressPercent >= 0 && proressPercent < 20) {
        $('.progress-bar').removeClass('progress-bar-warning');
        $('.progress-bar').addClass('progress-bar-danger')
        $('.progress-bar').css({
            'transition': 'width 1s linear',
            'width': proressPercent + '%',
            'transition-duration': '100ms'
        });

    }
};

/*thang thua*/
function run(timeRemaining) {
    var runtime = timeRemaining;
    var rungame = setInterval(function () {
        timeRemaining--;
        console.log(timeRemaining);
        progressTime(runtime);
        if (count == 12) {
            clearInterval(rungame);
            $('.victoryBlock').css('display', 'block');
            document.getElementById('backgroundmusic').pause();
            music(backgroundmusic.audiovictory).play();
        }
        if (timeRemaining == -1) {
            clearInterval(rungame);
            $('#endGameModal').modal({
                show: true,
                backdrop: false,
                keyboard: false
            });
            $('.victoryBlock').css('opacity', '0');
            document.getElementById('backgroundmusic').pause();
            music(backgroundmusic.audiogameover).play();
        }
    }, 1000);
}

function play() {
    $('#startGameModal').modal({
        show: true,
        backdrop: false,
        keyboard: false
    });
    $('.btn-choose').on('click', function () {
        event.preventDefault();
        var gamemode = $(this).attr('value');
        $('#startGameModal').modal({
            show: false
        });
        document.getElementById('backgroundmusic').play();
        run(gamemode);
    });
}

function replay() {
    window.location.reload();
}

/*chon bai*/
function flip(card) {
    //check so lan click vao anh
    if (check.length < 2) {
        if (!$(card).hasClass('flipped')) {
            $(card).toggleClass('flipped');
            check.push($(card));

            if (!current) {
                current = $(card);
            }
            else {
                if (current.attr('data-name') != $(card).attr('data-name')) {
                    setTimeout(function () {
                        console.log('khac nhau');
                        current.toggleClass('flipped');
                        $(card).toggleClass('flipped');
                        current = null;
                        check = [];
                    }, 500);
                }
                else {
                    setTimeout(function () {
                        console.log('giong nhau');
                        $(card).css('opacity', '0');
                        current.css('opacity', '0');
                        current = null;
                        check = [];
                        count++;
                    }, 200)
                    music(backgroundmusic.audiocorrect).play();
                }
            }
        }
    }

}

$(function () {
    //Nhân đôi mảng để tạo ra các cặp bài
    cards = cards.concat(cards);
    // Đảo vị trí các quân bài
    cards = shuffle(cards);
    //Chèn nội dung( các quân bài) vào trong các element có class là content
    var html = '';
    for (var i = 0; i < cards.length; i++) {
        html +=
            '<div class="card"  data-name="' + cards[i] + '" + onclick="flip(this)">' +
            '<div class="front">' +
            '<img src="' + backCard + '">' +
            '</div>' +
            '<div class="back">' +
            '<img src="' + cards[i] + '">' +
            '</div>' +
            '</div>';

    }
    ;
    $('.content').html(html);
    play();
})
