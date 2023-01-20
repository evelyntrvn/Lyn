
function open(event, popupName){
    var popups = document.getElementsByClassName('popup'),
        button = document.getElementById('helpIcon');

    
    // hide all the content in reference
    // for (let i = 0; i < popups.length; i++){
    //     popups[i].getElementsByClassName.display = 'none';
    // }

    //show active tab
    document.getElementById(popupName).style.display = 'block';
    //event.currentTarget.className += ' active'; 
}

function openRef(e, tab){
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
