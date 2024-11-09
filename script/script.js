// 諸々初期化
q_nums = [];
game_state = false;
q_count = 0;
correct_a = 0;
incorrect_a = 0;
rightORwrong = [];
level = localStorage.getItem('level')!= null ? localStorage.getItem('level') : 'level1';
document.getElementById(level).firstElementChild.checked = true;
document.getElementById('answer-btn').style.pointerEvents = 'none'; // クリック無効化

// 素数判定
function judge(n) {
    if (n === 2) {
        return true;
    }
    if (n % 2 === 0) {
        return false;
    }
    for (let i = 3; i < n; i += 2) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}

function generate(level) {
    // 素数の数(後に素数が追加される可能性があるため1/2より確率低め)
    if (level == 'level1' || level == 'level2') {
        var q = 12;
    } else {
        var q = 14;
    }
    var p_num = 0;
    for (var i = 0; i < q; i++) {
        var r_1 = Math.floor(Math.random() * 2);
        if (r_1 == 1) {
            p_num += 1;
        }
    }

    // レベル別範囲指定
    switch (level) {
        case 'level1':
            var min = 2;
            var max = 100;
            break;
        case 'level2':
            var min = 2;
            var max = 100;
            break;
        case 'level3':
            var min = 100;
            var max = 300;
            break;
        case 'level4':
            var min = 300;
            var max = 1000;
            break;
        case 'level5':
            var min = 1000;
            var max = 9999;
            break;
        case 'level6':
            var min = 10000;
            var max = 99999;
            break;
    }

    // 素数生成
    var prime = [];
    for (var i = min; i <= max; i++) {
        if (judge(i) == true) {
            prime.push(i);
        }
    }

    // 使用素数取り出し
    var use_prime = [];
    for (var j = 0; j < p_num; j++) {
        var r_2 = Math.floor(Math.random() * prime.length);
        use_prime.push(prime[r_2]); // 配列に追加
        // prime配列から使用する素数を除いて再定義
        prime = prime.filter(item => item != prime[r_2]);
    }

    // 問題配列作成
    var add_nums = [];
    var add_num_count = 20 - p_num;
    for (var k = 0; k < add_num_count; k++) {
        var add_num = Math.floor(Math.random() * (max - min)) + min;
        // レベルがeasy以外かつ偶数なら+1
        if (level != 'level1' && add_num % 2 == 0) {
            add_num += 1;
        }
        add_nums.push(add_num);
    }
    // 配列結合
    var question_nums = use_prime.concat(add_nums);
    // 配列シャッフル
    for (var l = question_nums.length - 1; l > 0; l--) {
        var r_3 = Math.floor(Math.random() * (l + 1));
        var tmp = question_nums[l];
        question_nums[l] = question_nums[r_3];
        question_nums[r_3] = tmp;
    }

    // 出力！
    return question_nums;
}

function start() {
    // 難易度取得
    var level_element = document.getElementsByName('levelSelect');
    var level_len = level_element.length;
    for (var i = 0; i < level_len; i++) {
        if (level_element.item(i).checked) {
            var checked_level = level_element.item(i).value;
        }
    }
    level = checked_level;

    // 設定難易度をlocalStrageに保存
    localStorage.setItem('level', level);

    // 画面遷移
    document.getElementById('first').style.display = 'none';
    document.getElementById('play').style.display = 'block';

    // 問題作成
    q_nums = generate(level);

    // パス！
    ready();
}

// 定義
var question = document.getElementById('question');
var num_box = document.getElementById('number');

function ready() {

    // スタート合図
    num_box.innerHTML = '・・・';
    setTimeout(() => {
        num_box.innerHTML = '・・　';
    }, 1000);
    setTimeout(() => {
        num_box.innerHTML = '・　　';
    }, 2000);
    setTimeout(() => {
        num_box.innerHTML = 'Start';
    }, 3000);
    setTimeout(() => {
        play();
    }, 4000);
}

// 時間表示
var startTime; // 開始時間
var stopTime = 0; // 停止時間
var timeoutID; // タイムアウトID
function displayTime() {
    var currentTime = new Date(Date.now() - startTime + stopTime);
    var m = String(currentTime.getMinutes()).padStart(2, '0');
    var s = String(currentTime.getSeconds()).padStart(2, '0');
    var ms = String(currentTime.getMilliseconds()).padStart(3, '0');

    document.getElementById('time-display').textContent = `${m}:${s}.${ms}`;
    timeoutID = setTimeout(displayTime, 10);
}

// 問題表示等
function play() {
    game_state = true;
    if (q_count == 0) {
        document.getElementById('answer-btn').style.pointerEvents = 'auto'; // クリック有効化
        question.innerHTML = 'この数は素数？合成数？';
        // タイム計測開始
        startTime = Date.now();
        displayTime();
    } else if (q_count == 20) {
        // タイム計測終了
        clearTimeout(timeoutID);
        stopTime += (Date.now() - startTime);
        // 結果画面へ
        result(stopTime);
    }
    num_box.innerHTML = q_nums[q_count];
    q_count += 1;
    document.getElementById('q-count').innerHTML = q_count + '問目/20問';
    document.getElementById('corrent-count').innerHTML = correct_a + '問/' + (q_count - 1) + '問';
}

// 選択
function selectTrue() {
    // 素数判定
    var trueORfalse = judge(q_nums[q_count - 1]);
    if (trueORfalse == true) {
        // 正解
        correct_a += 1;
        rightORwrong.push(true);
    } else {
        // 不正解
        incorrect_a += 1;
        rightORwrong.push(false);
    }
    play();
}

function selectFalse() {
    // 素数判定
    var trueORfalse = judge(q_nums[q_count - 1]);
    if (trueORfalse == true) {
        // 不正解
        incorrect_a += 1;
        rightORwrong.push(false);
    } else {
        // 正解
        correct_a += 1;
        rightORwrong.push(true);
    }
    play();
}

// 矢印キーでの選択
document.addEventListener('keydown', keydown_event);

function keydown_event(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (game_state == true) {
                selectTrue();
            }
            break;
        case 'ArrowRight':
            if (game_state == true) {
                selectFalse();
            }
            break;
    }
}

// リザルト表示
function result(stopTime) {
    // 得点計算(ミリ秒使用)
    var score = Math.round((correct_a / 20 * correct_a * 100) - (stopTime / 1000 * 2.1));
    if (score < 0) {
        var score = 0;
    }
    // レベル
    switch (level) {
        case 'level1':
            var level_title = 'Easy';
            break;
        case 'level2':
            var level_title = 'Basic';
            break;
        case 'level3':
            var level_title = 'Hard';
            break;
        case 'level4':
            var level_title = 'VeryHard';
            break;
        case 'level5':
            var level_title = 'Expert';
            break;
        case 'level6':
            var level_title = 'Unknown';
            break;
    }
    // 時間
    var m = ('00' + Math.floor(stopTime / 60000)).slice(-2);
    var s = ('00' + Math.floor((stopTime % 60000) / 1000)).slice(-2);
    var ms = stopTime % 1000;
    var stopTime = m + ':' + s + '.' + ms;
    // 正誤表
    var list_q = '<th>問題</th>';
    var list_kinds = '<th>種類</th>';
    var list_rw = '<th>正誤</th>';
    for (var i = 0; i < 10; i++) {
        list_q += '<td>' + q_nums[i] + '</td>';
        if (judge(q_nums[i]) == true) {
            list_kinds += '<td>素数</td>';
        } else {
            list_kinds += '<td>合成</td>';
        }
        if (judge(rightORwrong[i]) == true) {
            list_rw += '<td style="color:red;">◯</td>';
        } else {
            list_rw += '<td style="color:blue;">✕</td>';
        }
    }
    document.getElementById('list-q-1').innerHTML = list_q;
    document.getElementById('list-kinds-1').innerHTML = list_kinds;
    document.getElementById('list-rw-1').innerHTML = list_rw;
    var list_q = '<th>問題</th>';
    var list_kinds = '<th>種類</th>';
    var list_rw = '<th>正誤</th>';
    for (var i = 10; i < 20; i++) {
        list_q += '<td>' + q_nums[i] + '</td>';
        if (judge(q_nums[i]) == true) {
            list_kinds += '<td>素数</td>';
        } else {
            list_kinds += '<td>合成</td>';
        }
        if (judge(rightORwrong[i]) == true) {
            list_rw += '<td style="color:red;">◯</td>';
        } else {
            list_rw += '<td style="color:blue;">✕</td>';
        }
    }
    document.getElementById('list-q-2').innerHTML = list_q;
    document.getElementById('list-kinds-2').innerHTML = list_kinds;
    document.getElementById('list-rw-2').innerHTML = list_rw;

    document.getElementById('result-level').innerHTML = level_title;
    document.getElementById('score').innerHTML = score + 'pt';
    document.getElementById('rate-inner').innerHTML = correct_a + '/20';
    document.getElementById('time-inner').innerHTML = stopTime;
    document.getElementById('play').style.display = 'none';
    document.getElementById('result').style.display = 'block';

    // ツイートリンク生成
    tweet_content = '難易度' + level_title + 'で' + score + 'pt(正答率：' + correct_a + '/20、タイム：' + stopTime + ')でした！｜素数をジャッチメント！';
    var tweet_url = 'https://twitter.com/share?url=https://prime.3.1415.world&hashtags=PRIMEjudgement&text=' + tweet_content;
    document.getElementById('twitter-btn').setAttribute('href', tweet_url);
}

function escape() {
    location.reload();
}

function reload() {
    location.reload();
}

function copy() {
    navigator.clipboard.writeText(tweet_content + ' https://prime.3.1415.world #PRIMEjudgement').then(() => {
        document.getElementById('copy-checker').innerHTML = 'copied!';
        setTimeout(() => {
            document.getElementById('copy-checker').innerHTML = '';
        }, 1500);
    }, () => {
        document.getElementById('copy-checker').innerHTML = 'error';
        setTimeout(() => {
            document.getElementById('copy-checker').innerHTML = '';
        }, 1500);
    });
}