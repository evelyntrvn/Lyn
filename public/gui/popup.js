
export function openPopup(event, popupName){
    document.getElementById("containerPopup").style.display = 'block';
    document.getElementById(popupName).style.display = "block";
}

function openRef(event, tab){
    var refContent = document.getElementsByClassName('refContent');
    
    // hide all the content in reference
    for (let i = 0; i < refContent.length; i++){
        refContent[i].getElementsByClassName.display = 'none';
    }

    // get rid of "active" class
    tabs = document.getElementsByClassName("tabLinks");
    for (let i = 0; i < tabs; i++){
        tabs[i].className = tabs[i].className.replace(' active', '');
    }

    //show active tab
    document.getElementById(tab).style.display = 'block';
    e.currentTarget.className += ' active';
}

window.onload = function (){
    var helpIcon = document.getElementById('helpIcon')
    helpIcon.addEventListener("click", (e) => {
        openPopup(e, "refPopup")
    })
}