(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const money = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : `$${Math.round(n/1000)}K`;
  const inches = (n) => `${Math.floor(n/12)}'${n%12}"`;
  const positions = ["PG","SG","SF","PF","C"];
  const teams = [
    ["Atlanta Hawks","ATL"],["Boston Celtics","BOS"],["Brooklyn Nets","BKN"],["Charlotte Hornets","CHA"],["Chicago Bulls","CHI"],
    ["Cleveland Cavaliers","CLE"],["Dallas Mavericks","DAL"],["Denver Nuggets","DEN"],["Detroit Pistons","DET"],["Golden State Warriors","GSW"],
    ["Houston Rockets","HOU"],["Indiana Pacers","IND"],["LA Clippers","LAC"],["Los Angeles Lakers","LAL"],["Memphis Grizzlies","MEM"],
    ["Miami Heat","MIA"],["Milwaukee Bucks","MIL"],["Minnesota Timberwolves","MIN"],["New Orleans Pelicans","NOP"],["New York Knicks","NYK"],
    ["Oklahoma City Thunder","OKC"],["Orlando Magic","ORL"],["Philadelphia 76ers","PHI"],["Phoenix Suns","PHX"],["Portland Trail Blazers","POR"],
    ["Sacramento Kings","SAC"],["San Antonio Spurs","SAS"],["Toronto Raptors","TOR"],["Utah Jazz","UTA"],["Washington Wizards","WAS"]
  ];
  const stageNames = {hs:"HIGH SCHOOL",college:"COLLEGE / NCAA",draft:"DRAFT NIGHT",summer:"SUMMER LEAGUE",gleague:"G LEAGUE",nba:"NBA",retired:"RETIRED"};
  const stageTitles = {hs:"高校バスケの幕開け",college:"次の舞台へ",draft:"運命のドラフト",summer:"サマーリーグで証明しろ",gleague:"NBAへの扉は閉じていない",nba:"NBA — 生き残りをかけて",retired:"キャリアのその先へ"};
  let selectedPos = "SF", state = null, soundOn = false;

  function toast(msg) { const el=$("toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2300); }
  function log(msg) { if(!state) return; state.feed.unshift(msg); state.feed=state.feed.slice(0,7); renderFeed(); }
  function newPlayer() {
    const origin = $("origin").value;
    const pos = selectedPos;
    const baseHeight = {PG:74,SG:77,SF:79,PF:81,C:84}[pos];
    const height = clamp(rand(baseHeight-3,baseHeight+3)+(origin==="japan"?-1:0),69,89);
    const names = origin==="japan" ? ["Ren Sato","Kai Tanaka","Yuto Nakamura","Haruto Mori"] : ["Kai Johnson","Jordan Brooks","Marcus Reed","Noah Carter","Darius Cole","Evan Walker","Malik Hayes"];
    const name = $("playerName").value.trim() || pick(names);
    const growth = pick(["早熟","標準","晩成"]);
    state = {
      name, pos, secondary:pos, origin, age:15, stage:"hs", year:1, height, wingspan:height+rand(-1,5),
      weight:Math.round((height-60)*2.1+rand(-12,15)), growth,
      potential:rand(48,96), work:rand(35,95), iq:rand(35,90), shooting:rand(30,88),
      defense:rand(30,90), athletic:rand(35,96), durability:rand(35,95), clutch:rand(25,95),
      luck:rand(5,95), coach:rand(30,95), scout:rand(25,95), agent:rand(25,95),
      overall:rand(43,64), hype:rand(2,35), draftStock:rand(20,80), schoolRecord:0,
      team:null, salary:0, careerEarnings:0, nbaSeasons:0, games:0, starts:0, ppg:0, rpg:0, apg:0,bpg:0, spg:0,
      rings:0, allStar:0, awards:[], trades:0, injuries:0, peak:0, feed:[], history:[], lastEvent:null,
      draftPick:null, contractYears:0, role:"未定", playoffApps:0, retireAge:null
    };
    state.overall = overall();
    state.peak = state.overall;
    state.feed.push("スカウトの評価はまだ白紙。ここから全部が始まる。");
    state.lastEvent = eventForStage("hs");
    $("setupPanel").classList.add("hidden");
    $("gamePanel").classList.remove("hidden");
    render();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function overall() {
    if(!state) return 50;
    return clamp(Math.round((state.shooting*.18+state.defense*.16+state.athletic*.18+state.iq*.16+state.work*.13+state.potential*.12+state.durability*.07)),35,99);
  }
  function archetype() {
    if(state.height>=83) return state.shooting>65 ? "Stretch Big" : "Rim Protector";
    if(state.shooting>76 && state.defense>70) return "3&D Specialist";
    if(state.athletic>82 && state.shooting<60) return "Slashing Wing";
    if(state.iq>78 && state.shooting>68) return "Two-way Creator";
    return state.pos==="PG"?"Floor General":state.pos==="C"?"Interior Anchor":"Two-way Wing";
  }
  function eventForStage(stage) {
    const events = {
      hs:[
        ["🏀","COACH'S EYE","地元のコーチが注目","練習後、コーチに呼び止められた。「お前には何かある。ただ、まだ粗い」。出場時間を得るには、今季の取り組みが重要だ。"],
        ["🎒","LIFE GACHA","家庭の事情が変わる","家族の仕事の都合で生活リズムが変わった。バスケに使える時間は減るかもしれないが、責任感が育つ可能性もある。"],
        ["📈","SCOUT REPORT","小さな大会でブレイク","地域大会で予想以上の活躍。まだ全国区ではないが、数人のスカウトが名前をメモした。"],
        ["🩹","BODY CHECK","成長期の違和感","膝に軽い違和感が出た。大事には至っていないが、無理をすれば長引くかもしれない。"]
      ],
      college:[
        ["🎓","RECRUITMENT","進路の分岐点","高校での成績を受け、大学と育成プログラムから連絡が来た。どの環境を選ぶかで成長曲線が変わる。"],
        ["📹","SCOUTING","ハイライトが拡散","大会映像がSNSで話題に。注目は集まったが、次の試合で再現できなければ評価はすぐに戻る。"],
        ["🧠","DEVELOPMENT","役割を変える提案","コーチから、ボールを持つ時間を減らして守備とシュートに集中する案が出た。NBAへの近道になる可能性も。"]
      ],
      draft:[
        ["🧢","DRAFT NIGHT","運命の夜","名前が呼ばれるのか、それとも電話を待つことになるのか。練習、測定、面談、スカウト評価が一つの夜に集約される。"]
      ],
      summer:[
        ["☀️","SUMMER LEAGUE","最初のプロ舞台","結果を残せばローテーション入りが見える。ミスが続けばGリーグで経験を積む可能性もある。"]
      ],
      gleague:[
        ["🚌","G LEAGUE","遠回りのシーズン","NBAチームの練習に呼ばれる機会はある。だが、出場時間を自分で勝ち取らなければ何も始まらない。"]
      ],
      nba:[
        ["🏟️","NEW SEASON","新しいシーズン","役割、チーム事情、健康状態。実力だけでは決まらないNBAのシーズンが始まる。"]
      ],
      retired:[
        ["🏁","THE NEXT CHAPTER","現役生活に幕","毎日の試合は終わった。だが、バスケとの関わり方はまだ選べる。"]
      ]
    };
    const e=pick(events[stage]||events.nba);
    return {icon:e[0],category:e[1],title:e[2],text:e[3],age:state.age,stats:[]};
  }
  function setEvent(icon,cat,title,text,stats=[]) { state.lastEvent={icon,category:cat,title,text,age:state.age,stats}; }
  function makeChoice(title,desc,fn) { return {title,desc,fn}; }

  function choicesForStage() {
    if(state.stage==="hs") return [
      makeChoice("朝練を始める","練習量を増やす。疲労やケガのリスクも少し上がる。",()=>{state.work=clamp(state.work+rand(3,8),1,99);state.overall+=rand(1,3);state.durability-=rand(0,4);state.hype+=rand(0,5);setEvent("💪","WORK ETHIC","積み重ねが武器になる","毎朝の自主練が習慣になった。派手な変化ではないが、努力は少しずつプレーに表れ始めている。",["WORK ETHIC +","POTENTIAL DEVELOPMENT"]);advanceAge();}),
      makeChoice("大会で目立つプレーを狙う","スカウトの目に留まるかも。成功すれば評価アップ。",()=>{let success=Math.random()<(.35+state.clutch/200+state.luck/350);if(success){state.scout+=rand(5,12);state.hype+=rand(8,16);state.draftStock+=rand(6,13);state.overall+=rand(2,5);setEvent("🔥","BREAKOUT GAME","キャリアを変える一戦","勝負どころで連続得点。会場にいたスカウトが、君の名前をリストの上に移した。",["SCOUT BUZZ ↑","DRAFT STOCK ↑"]);}else{state.hype=Math.max(0,state.hype-rand(1,5));setEvent("📉","TOUGH NIGHT","焦りがプレーに出た","目立とうとしすぎて判断が遅れた。スカウトの評価は大きく動かなかったが、課題ははっきりした。",["FILM SESSION REQUIRED"]);}advanceAge();}),
      makeChoice("チームプレーに徹する","IQ・守備・コーチからの信頼を上げる。",()=>{state.iq+=rand(4,8);state.defense+=rand(2,7);state.coach+=rand(5,10);state.overall+=rand(1,3);setEvent("🧠","COACH TRUST","信頼を積み上げる","派手な数字は残らなかったが、コーチは君を終盤に起用するようになった。",["BASKETBALL IQ +","COACH TRUST +"]);advanceAge();}),
      makeChoice("個人トレーナーを探す","お金や環境の運次第で大きく伸びることも。",()=>{let roll=Math.random();if(roll<.25+state.luck/250){state.athletic+=rand(5,10);state.shooting+=rand(2,6);state.overall+=rand(2,4);setEvent("⚡","TRAINING BREAKTHROUGH","相性抜群のトレーナー","自分に合うトレーニングが見つかった。身体能力とシュートに明確な変化が出始める。",["ATHLETICISM +","SHOOTING +"]);}else{state.work+=rand(1,4);setEvent("🛠️","SLOW PROGRESS","地道な調整","劇的な成長はなかったが、フォームと身体の使い方を見直せた。",["SMALL GAINS"]);}advanceAge();})
    ];
    if(state.stage==="college") return [
      makeChoice("強豪大学に挑戦","競争は激しいが、勝てばドラフト評価が上がる。",()=>{state.coach+=rand(2,7);state.scout+=rand(3,8);state.overall+=rand(2,5);let ok=Math.random()<.48+state.iq/300;if(ok){state.draftStock+=rand(7,14);state.hype+=rand(5,10);setEvent("🏆","BIG STAGE","強豪相手に存在感","大舞台で守備と判断力を評価された。ドラフト候補として追跡するスカウトが増えた。",["DRAFT STOCK ↑"]);}else{state.draftStock-=rand(2,7);setEvent("🧱","DEPTH CHART","出場時間をつかめない","チームの層が厚く、出場時間は限られた。成長の機会をどう作るかが課題だ。",["MINUTES ↓"]);}advanceAge();}),
      makeChoice("自分が主役になれる大学へ","出場時間と数字を狙う。競争レベルは少し落ちる。",()=>{state.overall+=rand(3,7);state.shooting+=rand(2,7);state.hype+=rand(2,9);state.draftStock+=rand(-2,8);setEvent("📊","STAT SHEET","数字を残す","ボールを持つ機会が増え、得点とアシストが伸びた。スカウトは数字の裏にある効率も見ている。",["ROLE ↑","SCOUTS WATCHING"]);advanceAge();}),
      makeChoice("3&Dに役割を絞る","スター路線ではなく、NBAで需要のある役割を磨く。",()=>{state.shooting+=rand(5,10);state.defense+=rand(5,10);state.iq+=rand(2,6);state.draftStock+=rand(2,8);setEvent("🎯","ROLE SPECIALIST","武器を磨く","派手さはないが、守れて打てる選手はどのチームにも必要だ。スカウトの評価が安定してきた。",["3&D VALUE ↑"]);advanceAge();}),
      makeChoice("もう1年、身体と技術を伸ばす","ドラフトを遅らせる可能性。晩成タイプなら大きく伸びる。",()=>{state.work+=rand(3,7);state.overall+=rand(2,7)+(state.growth==="晩成"?4:0);state.draftStock+=rand(-4,9);setEvent("⏳","DEVELOPMENT YEAR","成長に賭ける","目先の評価より成長を優先した。翌年に評価が跳ねるか、機会を逃すかはまだ分からない。",["DEVELOPMENT ↑"]);advanceAge();})
    ];
    if(state.stage==="draft") return [
      makeChoice("ワークアウトで勝負","身体測定と個別練習で評価を上げる。",()=>{let success=Math.random()<.3+state.athletic/180+state.luck/500;if(success){state.draftStock+=rand(8,17);state.scout+=rand(4,9);setEvent("📈","WORKOUT WINNER","評価が急上昇","複数のチームワークアウトで印象を残した。モックドラフトの順位が上がり始める。",["STOCK ↑"]); }else{state.draftStock-=rand(3,9);setEvent("😬","MISSED OPPORTUNITY","決め手に欠ける","ワークアウトは無難な内容。大きく評価を落としたわけではないが、順位を上げる材料にもならなかった。",["STOCK ↔"]);} draftNight();}),
      makeChoice("面談と人物評価を重視","知性・メンタル・エージェントの質が効く。",()=>{let good=Math.random()<.4+state.iq/220+state.agent/500;if(good){state.draftStock+=rand(4,12);state.scout+=rand(2,6);setEvent("🤝","INTERVIEW SUCCESS","面談で好印象","バスケIQと準備の良さが伝わった。チームは君をロッカールームに合う選手として評価した。",["TEAM FIT ↑"]);}else{state.draftStock+=rand(-3,3);setEvent("🗂️","INTERVIEW COMPLETE","評価は横ばい","面談では大きな失点も加点もなかった。最後はチームのニーズと指名順に左右される。",["NO MAJOR CHANGE"]);}draftNight();}),
      makeChoice("ドラフト当日まで待つ","余計なリスクを取らず、今の評価で運命を待つ。",()=>{setEvent("🧢","DRAFT NIGHT","コミッショナーの発表を待つ","会場の空気が張り詰める。評価が高くても指名される保証はない。",[]);draftNight();})
    ];
    if(state.stage==="summer") return [
      makeChoice("得点でアピール","成功すれば契約に近づくが、効率が悪いと逆効果。",()=>{let ok=Math.random()<.42+state.shooting/250+state.clutch/350;if(ok){state.overall+=rand(2,5);state.hype+=rand(5,12);setEvent("🔥","SUMMER LEAGUE STANDOUT","得点力を証明","強気なプレーが結果につながった。コーチ陣はトレーニングキャンプへの招待を検討している。",["CONTRACT ODDS ↑"]);}else{setEvent("📉","ROUGH SHOOTING","シュートが入らない","強引なシュートが増え、効率は低かった。守備や判断力で価値を示す必要がある。",["EFFICIENCY ↓"]);}signPro();}),
      makeChoice("守備とハッスルで生き残る","派手さより、コーチが使いやすい選手を目指す。",()=>{state.defense+=rand(3,7);state.iq+=rand(2,5);let ok=Math.random()<.48+state.defense/300;if(ok){setEvent("🛡️","COACHABLE PLAYER","守備で信頼を得る","ルーズボールとスイッチ対応で評価された。ローテーション候補として名前が残った。",["DEFENSE +"]);}else{setEvent("⏳","ON THE BUBBLE","最後の枠を争う","チームは複数の選手を比較中。あと少しの差が契約を左右する。",["ROSTER SPOT UNCERTAIN"]);}signPro();}),
      makeChoice("海外・Gリーグも視野に入れる","NBA直行にこだわらず、出場時間を優先する。",()=>{if(Math.random()<.55+state.luck/300){state.stage="gleague";state.team=pick(teams)[0]+" affiliate";state.salary=rand(40000,85000);state.contractYears=1;setEvent("🚌","DEVELOPMENT DEAL","育成契約を獲得","NBA契約ではないが、プロとしての環境を得た。練習で結果を出せばコールアップの可能性がある。",["G LEAGUE"]);}else{state.team=pick(["Real Madrid","FC Barcelona","Bayern Munich","B.League Club","NBL Club"]);state.salary=rand(180000,850000);state.stage="gleague";setEvent("🌍","OVERSEAS ROUTE","海外でプロキャリア","NBAの道は残っている。海外リーグでプレー時間を確保し、スカウトに見せることが次の目標だ。",["PRO CONTRACT"]);}advanceSeason();})
    ];
    if(state.stage==="gleague") return [
      makeChoice("NBAチームの練習に食らいつく","招集のチャンスを狙う。疲労リスクあり。",()=>{let ok=Math.random()<.24+state.overall/180+state.luck/350;if(ok){state.stage="nba";state.team=pick(teams)[0];state.salary=rand(950000,2200000);state.contractYears=1;state.overall+=rand(1,4);setEvent("📞","CALL-UP!","NBAから電話が来た","NBAチームが短期契約を提示。ここからが本当の勝負だ。",["NBA CONTRACT"]);}else{state.overall+=rand(1,3);setEvent("🏋️","KEEP GRINDING","チャンスは次回へ","今回は招集されなかったが、練習で改善点が見つかった。諦める理由にはならない。",["DEVELOPMENT +"]);}advanceSeason();}),
      makeChoice("出場時間を優先して海外へ","スタッツを積み、もう一度NBAを狙う。",()=>{state.team=pick(["Real Madrid","FC Barcelona","Bayern Munich","NBL Club","B.League Club"]);state.salary=rand(250000,1200000);state.overall+=rand(2,5);setEvent("🌍","OVERSEAS OPPORTUNITY","海外リーグで主力へ","試合に出られる環境を選んだ。NBA復帰への近道になるかは、数字とスカウトの目次第。",["ROLE ↑"]);advanceSeason();}),
      makeChoice("キャリアを見直す","一度立ち止まり、次の選択をする。",()=>{retirePrompt();})
    ];
    if(state.stage==="nba") return nbaChoices();
    if(state.stage==="retired") return [
      makeChoice("コーチとして残る","若手育成やアシスタントコーチを目指す。",()=>{setEvent("📋","COACHING","次世代を育てる","現役時代の経験を伝える仕事へ。選手とは違う形でリーグに関わる道を選んだ。",["COACHING CAREER"]);state.history.push("引退後：コーチングへ");render();}),
      makeChoice("解説・メディアへ","知名度とキャラクターを活かす。",()=>{setEvent("🎙️","MEDIA CAREER","マイクの前へ","試合を分析し、ファンに伝える側へ。現役時代の実績が新しいキャリアにつながった。",["MEDIA"]);state.history.push("引退後：メディアへ");render();}),
      makeChoice("新しい人生を始める","別の人生ガチャを引く。",()=>{state=null;$("gamePanel").classList.add("hidden");$("setupPanel").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});})
    ];
    return [];
  }
  function advanceAge(){state.age++;state.year++;state.overall=clamp(state.overall+rand(-1,2),35,99);state.peak=Math.max(state.peak,state.overall);if(state.age>=18&&state.stage==="hs"){state.stage="college";state.lastEvent=eventForStage("college");}else if(state.age>=22&&state.stage==="college"){state.stage="draft";state.lastEvent=eventForStage("draft");}else{state.lastEvent=eventForStage(state.stage);}}
  function draftNight(){
    const stock=state.draftStock+(state.scout-60)*.25+(state.overall-60)*.45+(state.luck-50)*.13;
    const chance=clamp(.12+(stock-20)*.014+(state.agent-50)*.002,0.03,.94);
    if(Math.random()<chance){
      let pickNum=clamp(Math.round(60-(stock-30)*.65+rand(-12,12)),1,60);
      state.draftPick=pickNum;state.team=teams[pickNum%teams.length][0];state.stage="summer";state.salary=pickNum<=30?rand(1200000,5000000):rand(900000,2200000);state.contractYears=2;
      setEvent("🧢","DRAFTED","指名された！",`全体${pickNum}位で${state.team}が君を指名。ここまでの努力がプロへの扉を開いた。ただし、ドラフト指名は出場時間を保証しない。`,[`PICK #${pickNum}`,state.team.toUpperCase()]);
    }else{
      state.draftPick=null;state.stage="summer";state.team=pick(teams)[0];state.salary=0;state.contractYears=0;
      setEvent("📵","UNDRAFTED","名前は呼ばれなかった","ドラフトで指名されなかった。だが、サマーリーグやGリーグ、海外リーグからNBAを目指す道は残っている。",["UNDRAFTED","PROVE IT"]);
    }
    state.year++;render();
  }
  function signPro(){
    if(state.draftPick && Math.random()<.78){state.stage="nba";state.role=state.overall>76?"Rotation":"Bench";state.contractYears=2;state.salary=Math.max(state.salary,rand(1200000,4200000));setEvent("✍️","ROOKIE CONTRACT","NBA契約を獲得",`${state.team}とルーキー契約。まずはローテーション入りを目指す。契約の細部はゲーム用に簡略化している。`,["NBA ROSTER"]); }
    else if(Math.random()<.22+state.overall/250){state.stage="nba";state.team=pick(teams)[0];state.role="Two-way";state.salary=rand(650000,950000);state.contractYears=1;setEvent("📞","TWO-WAY DEAL","ツーウェイ契約","NBAとGリーグを行き来できる契約を獲得。チャンスは限られているが、実力を見せる場ができた。",["TWO-WAY"]); }
    else {state.stage="gleague";state.team=state.team||pick(teams)[0]+" affiliate";state.salary=rand(40000,85000);state.contractYears=1;setEvent("🚌","G LEAGUE","育成ルートへ","NBAロスター入りは叶わず、Gリーグでプロとしての経験を積むことに。ここからコールアップを狙う。",["G LEAGUE"]); }
    advanceSeason();
  }
  function nbaChoices(){
    const choices=[
      makeChoice("オフに弱点を徹底強化","ワークエシックが高いほど成長。",()=>{let gain=rand(2,5)+(state.work>75?2:0)+(state.growth==="晩成"&&state.age<27?2:0);state.overall=clamp(state.overall+gain,35,99);state.shooting=clamp(state.shooting+rand(0,5),25,99);state.iq=clamp(state.iq+rand(1,4),25,99);setEvent("🏋️","OFFSEASON WORK","弱点を磨く夏","個別トレーニングでプレーの幅が広がった。次のシーズンで役割を広げられるか。",[`OVERALL +${gain}`]);playSeason();}),
      makeChoice("コーチに出場時間を直談判","信頼・役割が上がるか、関係が悪化することも。",()=>{if(Math.random()<.35+state.iq/250+state.clutch/500){state.coach+=rand(4,9);state.role=state.overall>78?"Starter":"Rotation";setEvent("🗣️","ROLE CONVERSATION","役割を勝ち取る","具体的な準備と試合映像を示し、コーチと話し合った。出場時間を増やす機会を得た。",["COACH TRUST +"]);}else{state.coach-=rand(3,8);setEvent("😤","TENSION","話し合いは平行線","コーチは現状の役割を変えなかった。結果で示す必要がありそうだ。",["COACH RELATIONSHIP ↓"]);}playSeason();}),
      makeChoice("チームのために役割を変える","ポジション変更も含めて出場機会を増やす。",()=>{let newPos=state.height>=83?(state.shooting>62?"PF":"C"):state.height<=76?"PG":pick(["SG","SF","PF"]);state.secondary=state.pos;state.pos=newPos;state.defense+=rand(2,6);state.iq+=rand(2,5);state.role=state.overall>73?"Rotation":"Bench";setEvent("🔄","POSITION CHANGE",`役割変更：${newPos}` ,`サイズ、ウイングスパン、シュート力を踏まえ、チームは君を${newPos}として起用する方針に。適応できれば出場時間が増える。`,[`NEW POSITION: ${newPos}`]);playSeason();}),
      makeChoice("トレードを要求する","役割やチーム事情に不満がある時に選ぶ。",()=>{if(Math.random()<.35+state.hype/200+state.overall/300){const old=state.team;state.team=pick(teams.filter(t=>t[0]!==old))[0];state.trades++;state.coach=rand(35,75);setEvent("🔁","TRADE REQUEST","新天地へ",`移籍が成立。${old}から${state.team}へ。環境が変わればチャンスも増えるが、役割が保証されるわけではない。`,["TRADE COMPLETED"]);}else{state.coach-=rand(4,10);setEvent("📰","TRADE RUMORS","要求は成立せず","チームは今すぐの移籍に応じなかった。報道は出たが、まずはコート上で価値を示す必要がある。",["TRADE REQUEST DENIED"]);}playSeason();}),
      makeChoice("契約を優先して安定を取る","チームとの信頼を高め、契約延長を狙う。",()=>{state.coach+=rand(2,6);state.agent+=rand(1,4);setEvent("🤝","FRONT OFFICE","信頼を築く","チーム内での役割を受け入れ、安定した環境を選んだ。契約交渉の土台を整える。",["TEAM FIT +"]);playSeason();}),
      makeChoice("FA市場に賭ける","契約年数が残り少ない場合に移籍を狙う。",()=>{if(state.contractYears<=1||Math.random()<.3){const old=state.team;state.team=pick(teams.filter(t=>t[0]!==old))[0];state.salary=Math.max(1100000,Math.round(state.salary*(.75+Math.random()*1.7)));state.contractYears=rand(1,4);state.agent+=rand(2,6);setEvent("💼","FREE AGENCY", "FA市場で新契約",`${state.team}と新たな契約を結んだ。年俸は${money(state.salary)}。チームの役割と契約条件を天秤にかけた決断だ。`,["NEW CONTRACT",money(state.salary)]);}else{setEvent("📑","CONTRACT STATUS","まだ契約が残っている","今すぐFAには出られない。残り契約年数とチームの権利関係が、選択肢を左右する。",[`YEARS LEFT: ${state.contractYears}`]);}playSeason();})
    ];
    if(state.age>=34) choices.push(makeChoice("引退を考える","身体の衰えと家族、次の人生を考える。",()=>retirePrompt()));
    return choices;
  }
  function playSeason(){
    const age=state.age;
    const decline=age>29?Math.max(0,Math.floor((age-29)/2)):0;
    state.overall=clamp(state.overall+rand(-2,3)+(state.growth==="晩成"&&age<28?1:0)-decline,35,99);
    if(Math.random()>(state.durability/130)){state.injuries++;state.overall=clamp(state.overall-rand(1,5),35,99);setEvent("🩼","INJURY REPORT","ケガで離脱","シーズン中にケガを負った。復帰後の状態は個人差があり、プレーへの影響が残る可能性もある。",["INJURY #"+state.injuries]);}
    let roleScore=state.overall+state.coach/8+state.iq/10+rand(-12,12);
    state.role=roleScore>92?"Star":roleScore>82?"Starter":roleScore>70?"Rotation":roleScore>60?"Bench":"End of bench";
    const mins=state.role==="Star"?34:state.role==="Starter"?29:state.role==="Rotation"?21:state.role==="Bench"?12:5;
    state.ppg=Math.max(0,+(mins*(state.shooting/100)*.55+rand(-2,3)).toFixed(1));
    state.rpg=Math.max(0,+((state.height/12-5)*1.1+mins/9+rand(-2,2)).toFixed(1));
    state.apg=Math.max(0,+((state.pos==="PG"?mins/5:state.pos==="SG"?mins/8:mins/12)+state.iq/45+rand(-2,2)).toFixed(1));
    state.games+=rand(35,82);state.starts+=state.role==="Starter"||state.role==="Star"?rand(30,70):rand(0,15);
    state.nbaSeasons++;state.careerEarnings+=state.salary;state.peak=Math.max(state.peak,state.overall);
    state.playoffApps+=Math.random()<.48?1:0;
    if(Math.random()<.09+state.overall/700){state.rings++;state.awards.push("NBA Champion");}
    if(state.overall>88&&Math.random()<.3){state.allStar++;state.awards.push("All-Star");}
    if(state.overall>92&&Math.random()<.12)state.awards.push("All-NBA");
    state.age++;state.year++;state.contractYears=Math.max(0,state.contractYears-1);
    if(state.age>=40||state.overall<43){state.stage="retired";state.retireAge=state.age;setEvent("🏁","CAREER ENDS","現役生活に幕","年齢とコンディションを考え、現役生活を終えることにした。キャリアの価値は数字だけでは測れない。",[`NBA SEASONS: ${state.nbaSeasons}`,`EARNINGS: ${money(state.careerEarnings)}`]);}
    else setEvent("📊","SEASON COMPLETE",`${state.age-1}歳シーズン終了`,`${state.team}で${state.role}としてシーズンを終えた。${state.ppg} PPG / ${state.rpg} RPG / ${state.apg} APG。契約、健康状態、チーム事情が次の判断を左右する。`,[`ROLE: ${state.role}`,`${state.ppg} PPG`,`${state.rings} RINGS`]);
    render();
  }
  function advanceSeason(){state.age++;state.year++;state.overall=clamp(state.overall+rand(0,3),35,99);state.lastEvent=eventForStage(state.stage);render();}
  function retirePrompt(){
    state.stage="retired";state.retireAge=state.age;
    setEvent("🏁","RETIREMENT DECISION","現役生活に区切りを","プロ選手としての道を終える決断をした。次はコーチ、解説、あるいはまったく別の人生へ。",[`NBA SEASONS: ${state.nbaSeasons}`,`CAREER EARNINGS: ${money(state.careerEarnings)}`]);
    render();
  }
  function render(){
    if(!state)return;
    state.overall=clamp(Math.round(state.overall),35,99);
    $("stageTag").textContent=stageNames[state.stage]||state.stage.toUpperCase();
    $("avatar").textContent=state.pos;
    $("displayName").textContent=state.name;
    $("playerMeta").textContent=`${state.pos}${state.secondary!==state.pos?" / "+state.secondary:""} · Age ${state.age} · ${state.origin==="japan"?"JAPAN":state.origin==="international"?"INTERNATIONAL":"USA"}`;
    $("overall").textContent=state.overall;
    $("ovrBar").style.width=state.overall+"%";
    $("height").textContent=inches(state.height);
    $("wingspan").textContent=inches(state.wingspan);
    $("archetype").textContent=archetype();
    $("chapterEyebrow").textContent=`CHAPTER ${String(state.year).padStart(2,"0")} / ${stageNames[state.stage]}`;
    $("chapterTitle").textContent=stageTitles[state.stage]||"キャリアの次章";
    $("careerYear").textContent=String(state.year).padStart(2,"0");
    const ev=state.lastEvent||eventForStage(state.stage);
    $("storyIcon").textContent=ev.icon;$("storyCategory").textContent=ev.category;$("storyTitle").textContent=ev.title;$("storyText").textContent=ev.text;$("storyDate").textContent="AGE "+state.age;
    $("storyStats").innerHTML=(ev.stats||[]).map(s=>`<span class="stat-chip">${escapeHtml(s)}</span>`).join("");
    $("ratings").innerHTML=[["SHOOTING",state.shooting],["DEFENSE",state.defense],["ATHLETICISM",state.athletic],["BASKETBALL IQ",state.iq],["WORK ETHIC",state.work]].map(([n,v])=>`<div class="rating-line"><span>${n}</span><b>${Math.round(v)}</b><div class="rating-track"><i style="width:${clamp(v,0,100)}%"></i></div></div>`).join("");
    const choices=choicesForStage();
    $("choices").innerHTML=choices.map((c,i)=>`<button class="choice-btn" data-choice="${i}"><span class="choice-index">${String(i+1).padStart(2,"0")}</span><span class="choice-copy"><strong>${escapeHtml(c.title)}</strong><span>${escapeHtml(c.desc)}</span></span><span class="choice-arrow">↗</span></button>`).join("");
    $("choiceCount").textContent=`選択肢 ${String(choices.length).padStart(2,"0")}`;
    $("timelineAge").textContent="AGE "+state.age;
    const stages=[["hs","HS"],["college","NCAA"],["draft","DRAFT"],["summer","SUMMER"],["nba","NBA"],["retired","LIFE"]];
    const idx={hs:0,college:1,draft:2,summer:3,gleague:3,nba:4,retired:5}[state.stage]||0;
    $("timeline").innerHTML=stages.map((s,i)=>`<div class="timeline-step ${i<idx?"done":""} ${i===idx?"active":""}"><i></i>${s[1]}</div>`).join("");
    renderFeed();
    $("choices").querySelectorAll("[data-choice]").forEach(btn=>btn.addEventListener("click",()=>{const chosen=choices[Number(btn.dataset.choice)];if(chosen){chosen.fn();}}));
  }
  function renderFeed(){if(!state)return;$("feed").innerHTML=state.feed.map(item=>`<p class="feed-item">${escapeHtml(item)}</p>`).join("");}
  function escapeHtml(str){return String(str).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
  function save(){if(!state){toast("まだキャリアが始まっていません");return;}try{localStorage.setItem("nbaLifeSimSave",JSON.stringify(state));toast("キャリアをこの端末に保存した！");}catch(e){toast("保存できませんでした");}}
  function load(){try{const saved=localStorage.getItem("nbaLifeSimSave");if(saved){state=JSON.parse(saved);$("setupPanel").classList.add("hidden");$("gamePanel").classList.remove("hidden");render();toast("保存データを読み込んだ！");}}catch(e){}}
  document.querySelectorAll(".position-card").forEach(btn=>btn.addEventListener("click",()=>{selectedPos=btn.dataset.pos;document.querySelectorAll(".position-card").forEach(b=>b.classList.toggle("selected",b===btn));}));
  $("startBtn").addEventListener("click",newPlayer);
  $("saveBtn").addEventListener("click",save);
  $("restartBtn").addEventListener("click",()=>{if(confirm("今のキャリアを終了して、新しい人生を始める？保存していない進行は失われます。")){state=null;$("gamePanel").classList.add("hidden");$("setupPanel").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});}});
  $("soundToggle").addEventListener("click",()=>{soundOn=!soundOn;$("soundToggle").style.color=soundOn?"var(--orange2)":"var(--muted)";toast(soundOn?"演出モード ON（音声は再生しません）":"演出モード OFF");});
  $("playerName").addEventListener("input",()=>{const ph=document.querySelector(".player-placeholder");if(ph) ph.textContent=($("playerName").value||"YOUR NAME HERE").toUpperCase();});
  // Expose a low-friction save restore on repeat visits.
  window.addEventListener("DOMContentLoaded",load);
})();
