let s8 = document.getElementById('changes8')
s8.onclick= function(){
    let imgurl = s8.src.toString();
    imgurl = imgurl.split('/')
    if (imgurl[imgurl.length - 1]==='doorcloses8.png') {
        imgurl[imgurl.length - 1] = 'dooropen.png'
        s8.src = imgurl.join('/')
    }
    else {
        let imgurl = s8.src.toString();
        imgurl = imgurl.split('/')
        imgurl[imgurl.length - 1] = 'doorcloses8.png'
        s8.src = imgurl.join('/')
    }
};
let s7 = document.getElementById('changes7')
s7.onclick = function(){
    let imgurl = s7.src.toString();
    imgurl = imgurl.split('/')
    if (imgurl[imgurl.length - 1]==='doorcloses7.png') {
        imgurl[imgurl.length - 1] = 'dooropen.png'
        s7.src = imgurl.join('/')
    }
    else {
        let imgurl = s7.src.toString();
        imgurl = imgurl.split('/')
        imgurl[imgurl.length - 1] = 'doorcloses7.png'
        s7.src = imgurl.join('/')
    }
};
let s4 =document.getElementById('changes4')
s4.onclick =function(){
    let imgurl = s4.src.toString();
    imgurl = imgurl.split('/')
    if (imgurl[imgurl.length - 1]==='doorcloses4.png') {
        imgurl[imgurl.length - 1] = 'dooropen.png'
        s4.src = imgurl.join('/')
    }
    else {
        let imgurl = s4.src.toString();
        imgurl = imgurl.split('/')
        imgurl[imgurl.length - 1] = 'doorcloses4.png'
        s4.src = imgurl.join('/')
    }
};


