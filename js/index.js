// var API_KEY = "AIzaSyCZ1leePMtcQO7GWpgofpZcKS1rCynPCvI";
// var API_KEY = "AIzaSyBG4TGtuyIfa7MEMh2JeX583pP26NMLqpc";
// var API_KEY = "AIzaSyBoxuSlj6bfGhDnCwGbOV1-PXQxh4FlzNU";
// var API_KEY = "AIzaSyDn5ovGUrZm4miWyghad1hCpOuRSk-HDd0";
var API_KEY = "AIzaSyA-byAWIHH8deGmogQMY2XWMr49ahvldfk";

var player, playing = false;

var morningLongForms = [];
var afternoonLongForms = [];
var peopoNewsFillers = [];
var fillerVideoIds = [];
var liveChannelId = "_isseGKrquc";
var isMorning = moment().get('hour') <= 12;
var joinedFillerIds = [];

// isMorning = true;

var playbackStarted = false;

var fillerPlaybackIndex = 0;

var timer = setInterval(() => {
    if (player){
        loadScheduled();
        player.playVideo();
    }
}, 1000)

function loadScheduled() {
    switch(moment().format('hh:mm:ss')) {
        case "08:30:00":
            player.loadVideoById(morningLongForms[0]);
            break;
        case "09:00:00":
            player.loadVideoById(morningLongForms[1]);
            break;
        case "10:00:00":
            player.loadVideoById(morningLongForms[2]);
            break;
        case "11:00:00":
            player.loadVideoById(morningLongForms[1]);
            break;
        case "12:00:00":
            player.loadVideoById(liveChannelId);
            break;
        case "13:30:00":
            player.loadVideoById(afternoonLongForms[0]);
            break;
        case "14:30:00":
            player.loadVideoById(afternoonLongForms[1]);
            break;
        case "15:30:00":
            player.loadVideoById(afternoonLongForms[2]);
            break;
        case "16:30:00":
            player.loadVideoById(afternoonLongForms[0]);
            break;
        default:
            break;
    }
}

function onPlayerStateChange(event) {
    switch(event.data) {
        case YT.PlayerState.PLAYING:
            console.log('video started');
            playing = true;
            var playerElement = document.querySelector("#video");
            var requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen;
            if (requestFullScreen) {
                requestFullScreen.bind(playerElement)();
            }                
            break;
        case YT.PlayerState.PAUSED:
            console.log('video paused');
            playing = false;
        case YT.PlayerState.ENDED:
            console.log('video ended');
            if (player.getCurrentTime() === player.getDuration()) {
                loadFiller();
            }
            player.playVideo()
            playing = true;
        default:
            break; 
    }
}

function loadFiller(){
    player.loadVideoById(joinedFillerIds[fillerPlaybackIndex]);
    if (fillerPlaybackIndex < joinedFillerIds.length - 1) {
        fillerPlaybackIndex++;
    } else {
        fillerPlaybackIndex = 0;
    }
}

function onYouTubeIframeAPIReady() {
    
    var programDuration = Math.abs(moment().diff(moment(isMorning ? "1230" : "1730", "hhmm"), 'seconds'));
    console.log(programDuration);


    document.querySelector("#start").addEventListener('click', (e) => {

        fillerVideoIds = [];
        var urls = document.querySelector("textarea").value.split("\n");
        urls.forEach((url) => {
            var videoId = url.split("watch?v=").pop();
            if (videoId !== "") {
                fillerVideoIds.push(videoId);
            }
        })

        joinedFillerIds = [];
        joinedFillerIds.push(...fillerVideoIds);
        peopoNewsFillers.forEach((filler) => {
            joinedFillerIds.push(filler.id.videoId);
        })

        shuffleArray(joinedFillerIds);
        
        console.log("joined", joinedFillerIds);

        e.target.innerText = "播放中";
        e.target.setAttribute("disabled", "true");
        document.querySelector("textarea").setAttribute("disabled", "true");

        player = new YT.Player('video', {
            videoId: isMorning ? morningLongForms[0].id.videoId : afternoonLongForms[0].id.videoId,
            playerVars: {
                'controls': 1,
                'showinfo': 0,
                'rel': 0,
                'loop': 1,
                'autoplay': 1
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });

        var requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen;

        if (requestFullScreen) {
            requestFullScreen.bind(playerElement)();
        }                

        player.playVideo()
    })


    const englishNewsOptions = {
        part: 'id',
        q: 'PTS English News',
        type: 'video',
        maxResults: 1,
        order: 'date',
        channelId: 'UCexpzYDEnfmAvPSfG4xbcjA',
    }  

    const nightlyNewsOptions = {
        part:'id',
        q: '晚間新聞',
        type: 'video',
        maxResults: 1,
        order: 'date',
        channelId: 'UCexpzYDEnfmAvPSfG4xbcjA',
        videoDuration: 'long'
    }

    const worldNewsOptions = {
        part: 'id',
        q: '新聞全球話',
        type: 'video',
        maxResults: 1,
        order: 'date',
        channelId: 'UCexpzYDEnfmAvPSfG4xbcjA',
        videoDuration: 'long'
    }

    const morningNewsOptions = {
        part: 'id',
        q: '早安新聞',
        type: 'video',
        maxResults: 1,
        order: 'date',
        channelId: 'UCexpzYDEnfmAvPSfG4xbcjA',
        videoDuration: 'long'
    }

    const signLangNewsOptions = {
        part: 'id',
        q: '手語新聞',
        type: 'video',
        maxResults: 1,
        order: 'date',
        channelId: 'UCexpzYDEnfmAvPSfG4xbcjA',
        videoDuration: 'long'
    }

    const peopoNewsOptions = {
        part: 'id, snippet',
        q: '****年**月**日PeoPo公民新聞報',
        maxResults: 4,
        order: 'date',
        type: 'video',
        channelId: 'UCI2rdKuv0zW9OUbC6UqClcw'
    }

    let fetchPeopoNews = searchYoutube(API_KEY, peopoNewsOptions);
    fetchPeopoNews.then((peopo_result) => {

        peopoNewsFillers = peopo_result.items;
    })                    


    if (isMorning) {
        let fetchEnglishNews = searchYoutube(API_KEY, englishNewsOptions);
        let fetchNightlyNews = searchYoutube(API_KEY, nightlyNewsOptions);
        let fetchWorldNews = searchYoutube(API_KEY, worldNewsOptions);

        fetchEnglishNews.then((english_result) => {            
            morningLongForms.push(english_result.items[0]);
            
            fetchNightlyNews.then((nightly_result) => {
                morningLongForms.push(nightly_result.items[0]);

                fetchWorldNews.then((world_result) => {
                    morningLongForms.push(world_result.items[0]);
                    
                    document.querySelector("#start").removeAttribute("disabled");
                })
            })
        })
    } else {
        let fetchSignLangNews = searchYoutube(API_KEY, signLangNewsOptions);
        let fetchMorningNews = searchYoutube(API_KEY, morningNewsOptions);
        let fetchWorldNews = searchYoutube(API_KEY, worldNewsOptions);

        fetchSignLangNews.then((sign_result) => {            
            afternoonLongForms.push(sign_result.items[0]);
            
            fetchMorningNews.then((morning_result) => {
                afternoonLongForms.push(morning_result.items[0]);

                fetchWorldNews.then((world_result) => {
                    afternoonLongForms.push(world_result.items[0]);
                    
                    document.querySelector("#start").removeAttribute("disabled");
                })
            })
        })
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}