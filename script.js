let songs = [{
    name: 'pehla pehla pyaar',
    artist: 'Arijit Singh',
    img: 'song1',
    src: 'song1'
},
{
    name: 'Tujhe kitna chahne lage hum',
    artist: 'Arijit Singh',
    img: 'song2',
    src: 'song2'

},
{
    name: "Gharse Nikalete hi",
    artist: 'Arman Mallick',
    img: 'song3',
    src: 'song3'

},
{
    name: 'banke tera joogi',
    artist: 'Udit narayan',
    img: 'song4',
    src: 'song4'
},
{
    name: 'koi shehri babu',
    artist: 'shruti Rane',
    img: 'song5',
    src: 'song5'
},
{
    name: 'hamra piche padal ba jija ji ke bhai',
    artist: 'Ankus Raja & shilpi',
    img: 'song6',
    src: 'song6'
}
]


//loading the music

let musicImg = document.querySelector('.cover');
let wrapper = document.querySelector('.wrapper'),
    musicName = wrapper.querySelector('.song_details .name'),
    musicArtist = wrapper.querySelector('.song_details .artist'),
    music = wrapper.querySelector('#mainAudio')
let playBtn = document.getElementById('play');
let prevBtn = document.getElementById('prev');
let nextBtn = document.getElementById('next');
let progress_bar = document.querySelector('.progress_bar');
let current_Time = document.querySelector('.current');
let total_Duration = document.querySelector('.duration');
let progress_area = document.querySelector('.progress_area');

let isPlaying = false;

// let randIndex = Math.floor((Math.random() * songs.length)+1)
// console.log(randIndex);
let musicIndex=Math.floor((Math.random()*songs.length));
// if (randIndex <= 3) {
//     musicIndex = randIndex;
// }
// else {
//     musicIndex = 0;
// }
let loadMusic = (musicNum) => {
    musicName.innerText = songs[musicNum].name;
    musicArtist.innerText = songs[musicNum].artist;
    musicImg.src = `images/${songs[musicNum].img}.jpg`;
    music.src = `songs/${songs[musicNum].src}.mp3`;
}
window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingNow();
})

let playMusic = () => {
    isPlaying = true
    music.play();
    playBtn.innerHTML = 'pause';
    playingNow();
}

let pauseMusic = () => {
    isPlaying = false;
    music.pause();
    playBtn.innerHTML = 'play_arrow';
}

playBtn.addEventListener('click', () => {
    isPlaying ? pauseMusic() : playMusic();
    playingNow();
})

let nextSong = () => {
    musicIndex = (musicIndex + 1) % songs.length;
    loadMusic(musicIndex);
    playMusic();
}
//reversing the music
let prevSong = () => {
    musicIndex = (musicIndex - 1 + songs.length) % songs.length;
    loadMusic(musicIndex);
    playMusic();

}
//nexting the song
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

//for progress bar width
music.addEventListener('timeupdate', (event) => {
    // let{currentTime, duration} = event.srcElement;
    let currentTime = event.target.currentTime;
    let duration = event.target.duration;

    let width = (currentTime / duration) * 100;
    progress_bar.style.width = `${width}%`;

    //for song total duration //this is the first way
    // current = music.currentTime;
    // let music_duration = music.duration;
    // total_Duration.innerHTML = music_duration;

    // we have another way using a loadeddata event in audio

    //for music current time
    let music_current = music.currentTime;
    current_Time.innerHTML = music_current;
    let currMin = Math.floor(music_current / 60);
    let currSec = Math.floor(music_current % 60);
    if (currSec < 10) { //adding 0 if the sec is smaller than 10
        currSec = `0${currSec}`;
    }
    current_Time.innerHTML = `${currMin}:${currSec}`;

    music.addEventListener('loadeddata', () => {
        //this function only execute when the frame at the current playback position of the media has finished loading

        //for music total duration
        let music_duration = music.duration;
        let durMin = Math.floor(music_duration / 60);
        let durSec = Math.floor(music_duration % 60);
        if (durSec < 10) {
            durSec = `0${durSec}`;
        }
        total_Duration.innerHTML = `${durMin}:${durSec}`;
    });
});


//for changing the song current time according to the progressbar width
progress_area.addEventListener('click', (event) => {
    // let prgoressWidth = progress_area.clientWidth; //another way 
    let progressWidth = event.srcElement.clientWidth; //width of progress area
    let clickedOffsetX = event.offsetX;
    // console.log(clickedOffsetX);
    let music_duration = music.duration;

    music.currentTime = (clickedOffsetX / progressWidth) * music_duration;
    playMusic();
    
})



//lets work on repeat, shuffle song according the icon
let repeatBtn = document.querySelector('#repeat_plist');
repeatBtn.addEventListener('click', () => {
    //first we get the innerText of the icon then we will change accordingly
    let getText = repeatBtn.innerText; //getting inner text of the icons
    // lets do different changes accoring to changes using switch
    switch (getText) {
        case 'repeat': //if icon is repeat then change it to repeat_one
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title','song looped')
            break;

        case 'repeat_one': //if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title','Playback shuffled')
            break;

        case 'shuffle': //if icon is shuffle then change it to repeat
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title','playlist looped')
            break;
    }
});


//now lets work on what to do after the song ended...
music.addEventListener('ended', ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case 'repeat': //if the icon is repeat then simply call nextSong() fun to play the next song
            nextSong();
            break
        case 'repeat_one': //if icon is repeat one then set current Time to 0 so that it will play form the begining.
            music.currentTime = 0;
            // console.log(musicIndex);
            loadMusic(musicIndex);
            playMusic();
            break;

        case 'shuffle': //if icon is shuffle then play play random music
        //generating random index btn the max range of the array length
        let randIndex= Math.floor((Math.random()*songs.length));
        // console.log(randIndex);
        do{
            randIndex= Math.floor((Math.random()*songs.length));
            // console.log(randIndex);
        }while(musicIndex == randIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        playingNow()
        break;
    }
});

//displaying and diminishing the music list

let more_music = document.getElementById('more_music');
let close = document.getElementById('close');
let music_list = document.querySelector('.music_list');
more_music.addEventListener('click', () => {
    music_list.classList.add('show');
})
close.addEventListener('click', () => {
    music_list.classList.remove('show');
})

//managing music lists
let ulTag = document.querySelector('ul');
for(let i = 0;i<songs.length;i++){
    let liTag = `<li li-index="${i}">
        <div class="row">
            <span>${songs[i].name}</span>
            <p>${songs[i].artist}</p>
        </div>
        <audio class="${songs[i].src}" src='songs/${songs[i].src}.mp3'></audio>
        <span id="${songs[i].src}"  class="audio_duration">4:20</span>
    </li>`;
    ulTag.insertAdjacentHTML('beforeend',liTag);

    let liAudioDuration = ulTag.querySelector(`#${songs[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${songs[i].src}`);
   
    liAudioTag.addEventListener('loadeddata',()=>{
        let audio_duration = liAudioTag.duration;
        let durMin = Math.floor(audio_duration / 60);
        let durSec = Math.floor(audio_duration % 60);
        if (durSec < 10) {
            durSec = `0${durSec}`;
        }
        liAudioDuration.innerHTML = `${durMin}:${durSec}`;
        //adding t-duration attribute which we will use below
        liAudioDuration.setAttribute('t-duration',`${durMin}:${durSec}`)
    })
}

//lets work to play particular song on click
let allLiTags = ulTag.querySelectorAll('li');
function playingNow(){
    for(let j = 0;j< allLiTags.length;j++){

        let audioDuration = allLiTags[j].querySelector('.audio_duration');
        let time_duration = audioDuration.getAttribute('t-duration');
        //let remove playing class form all other li except the last one which is clicked
        if(allLiTags[j].classList.contains('playing')){
            allLiTags[j].classList.remove('playing');
            audioDuration.innerText = time_duration;
        }

        //if there is an li tag which li-index is equal to musicIndex then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute('li-index')== musicIndex){
           allLiTags[j].classList.add('playing');
           audioDuration.innerText = 'playing';
       }
       //adding onclick attribute on all li tags
       allLiTags[j].setAttribute('onclick','clicked(this)');
   
   }
}
//lets play song on click
function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute('li-index');
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}