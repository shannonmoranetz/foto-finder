var titleInput = document.getElementById('title-input');
var captionInput = document.getElementById('caption-input');

document.getElementById('add-button').addEventListener('click', setProperties);

reloadCards();

function reloadCards() {
  Object.keys(localStorage).forEach(function(key) {
    addCard(JSON.parse(localStorage.getItem(key)));
  })
};

function setProperties() {
  var upload = document.querySelector('.inputfile').files[0];
  var url = URL.createObjectURL(upload)
  var newPhoto = new Photo('', titleInput.value, captionInput.value, url, '');
  newPhoto.saveToStorage(); 
  addCard(newPhoto);
}

function addCard(photo) {
  var card = document.createElement('section');
  var cardSection = document.querySelector('.card-section');
  card.className = 'photo-card';
  card.innerHTML = 
  `<div class="card-content">
  <h2 class="card-title" id="${photo.id}" contenteditable= "true">${photo.title}</h2>
  <h4 class="card-caption" contenteditable="true">${photo.caption}</h4>
  <img class="card-image" src=${photo.file}>
  </div>
  <div class="card-bottom">
  <img class="delete-icon card-icon" src="images/delete.svg">

  <img class="favorite-icon card-icon" src="${elem.src}">
  </div>
  `
  cardSection.insertBefore(card, cardSection.firstChild); 
}

document.querySelector('.card-section').addEventListener('click', removeCard);

function removeCard(e) {
  if (e.target.className === 'delete-icon card-icon') {
    var id = e.target.closest('.photo-card').firstChild.firstChild.nextSibling.id;
    var json = localStorage.getItem(id);
    var photoObj = JSON.parse(json);
    var {id, title, caption, file, favorite} = photoObj;
    var photo = new Photo(id, title, caption, file, favorite);
    photo.deleteFromStorage();
    e.target.closest('.photo-card').remove();
  }
};

document.querySelector('.card-section').addEventListener('focusout', updateCard);

function updateCard(e) {
  var id = e.target.closest('.photo-card').firstChild.firstChild.nextSibling.id;
  var json = localStorage.getItem(id);
  var photoObj = JSON.parse(json);
  var {id, title, caption, file, favorite} = photoObj;
  var photo = new Photo(id, title, caption, file, favorite);

  if (e.target.className === 'card-title') {
    photo.updatePhoto(e.target.innerText, 'title');
    console.log(e.target.innerText);
  }
  if (e.target.className === 'card-caption') {
    photo.updatePhoto(e.target.innerText, 'caption');
  }
};

document.querySelector('.card-section').addEventListener('click', favorite);

function favorite(e) {
  var id = e.target.closest('.photo-card').firstChild.firstChild.nextSibling.id;
  var json = localStorage.getItem(id);
  var photoObj = JSON.parse(json);
  var {id, title, caption, file, favorite} = photoObj;
  var photo = new Photo(id, title, caption, file, favorite);

  if(photo.favorite === false) {
    photo.favorite = true;
    photo.saveToStorage();
    changeImage(e, photo);        
  }
  else {
    photo.favorite = false;   
    photo.saveToStorage();
    changeImage(e, photo);        
  }
}

function changeImage(e, photo) {
  var elem = e.target.closest('.card-section').firstChild.firstChild.nextSibling.nextSibling.firstChild.nextSibling.nextSibling.nextSibling;
  if (photo.favorite) {
    elem.src = "images/favorite-active.svg";
  } else {
    elem.src = "images/favorite.svg";
  }
}














