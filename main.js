var titleInput = document.getElementById('title-input');
var captionInput = document.getElementById('caption-input');
var counter = 0;

document.getElementById('add-button').addEventListener('click', setProperties);

reloadCards();

function reloadCards() {
  Object.keys(localStorage).forEach(function(key) {
    addCard(JSON.parse(localStorage.getItem(key)));
  })
};

  function displayEmptyMessage() {
    if(!document.querySelector('.empty-message').classList.contains('display-mode-none')) {
      document.querySelector('.empty-message').classList.toggle('display-mode-none');
    }
  }

  function setProperties() {
    var upload = document.querySelector('.inputfile').files[0];
    var url = URL.createObjectURL(upload);
    var newPhoto = new Photo('', titleInput.value, captionInput.value, url, '');
    newPhoto.saveToStorage(); 
    addCard(newPhoto); 
  };

  function addCard(photo) {
    var card = document.createElement('section');
    var cardSection = document.querySelector('.card-section');
    card.className = 'photo-card';
    card.innerHTML = 
    `<div class="card-content">
    <h2 class="card-title" id="${photo.id}" contenteditable= "true">${photo.title}</h2>
    <img class="card-image" src=${photo.file}>
    <h4 class="card-caption" contenteditable="true">${photo.caption}</h4>
    </div>
    <div class="card-bottom">
    <img class="delete-icon card-icon" src="images/delete.svg">
    <img class="favorite-icon card-icon" src="${favoriteImage(photo)}">
    </div>
    `
    displayEmptyMessage();
    cardSection.insertBefore(card, cardSection.firstChild); 
    if (photo.favorite) {
      update(photo.favorite);
      document.querySelector('.favorite-icon').classList.add('favorite-active');
    }
  };

  function favoriteImage(photo) {
    if (photo.favorite) {
      return "images/favorite-active.svg";
    } else {
      return "images/favorite.svg";
    }
  }

  function changeImage(e, photo) {
    var elem = e.target;
    if (photo.favorite) {
      elem.classList.add('favorite-active');
      elem.src = "images/favorite-active.svg";
    } else {
      elem.src = "images/favorite.svg";
      elem.classList.remove('favorite-active');
    }
  };

  document.querySelector('.card-section').addEventListener('click', removeCard);

  function removeCard(e) {
    if (e.target.className === 'delete-icon card-icon') {
      counter--;
      document.getElementById('favorite-button').innerText = `View ${counter} Favorites`;
      var id = e.target.closest('.photo-card').firstChild.firstChild.nextSibling.id;
      var json = localStorage.getItem(id);
      var photoObj = JSON.parse(json);
      var {id, title, caption, file, favorite} = photoObj;
      var photo = new Photo(id, title, caption, file, favorite);
      photo.deleteFromStorage();
      e.target.closest('.photo-card').remove();
    }
    toggleMessage();
  };

function toggleMessage() {
      if (Object.keys(localStorage).length === 0) {
      console.log('sheeps are cute')
      document.querySelector('.empty-message').classList.remove('display-mode-none');
    }
}
  document.querySelector('.card-section').addEventListener('focusout', updateCard);
  document.querySelector('.card-section').addEventListener('keyup', function(e) {
    if (e.keyCode === 13) {
      updateCard(e);
    }
  });

  function updateCard(e) {
    var id = e.target.closest('.photo-card').firstChild.firstChild.nextSibling.id;
    var json = localStorage.getItem(id);
    var photoObj = JSON.parse(json);
    var {id, title, caption, file, favorite} = photoObj;
    var photo = new Photo(id, title, caption, file, favorite);

    if (e.target.className === 'card-title') {
      photo.updatePhoto(e.target.innerText, 'title');
    }
    if (e.target.className === 'card-caption') {
      photo.updatePhoto(e.target.innerText, 'caption');
    }
  };

  document.querySelector('.card-section').addEventListener('click', favorite);

  function favorite(e) {
    if (e.target.classList.contains('favorite-icon')) {
      var id = e.target.closest('.photo-card').firstChild.firstChild.nextSibling.id;
      var json = localStorage.getItem(id);
      var photoObj = JSON.parse(json);
      var {id, title, caption, file, favorite} = photoObj;
      var photo = new Photo(id, title, caption, file, favorite);
      photo.favorite = !photo.favorite;
      photo.saveToStorage();
      changeImage(e, photo);
      update(photo.favorite);
    }
  };

  function update(inc) {
    if(inc) {
      counter++;
    }
    else { 
      counter--;
    }
    document.getElementById('favorite-button').innerText = `View ${counter} Favorites`;
  }

  document.getElementById('search-input').addEventListener('keyup', searchFilter);

  function searchFilter() {
  Object.keys(localStorage).forEach(function(cardObj) {
    let matchingCardsObject = document.getElementById(`${JSON.parse(localStorage[cardObj]).id}`);
    let matchingCards = matchingCardsObject.parentNode.parentNode;
    let localStorageTitle = JSON.parse(localStorage[cardObj]).title;
    let localStorageCaption = JSON.parse(localStorage[cardObj]).caption;
    let searchInput = document.getElementById('search-input').value.toLowerCase();
    if (!localStorageTitle.toLowerCase().includes(searchInput) && !localStorageCaption.toLowerCase().includes(searchInput)){
      matchingCards.classList.add('display-mode-none');
    } else if (localStorageTitle.toLowerCase().includes(searchInput) && localStorageCaption.toLowerCase().includes(searchInput)) {
      matchingCards.classList.remove('display-mode-none');
    }
  });
}

document.getElementById('favorite-button').addEventListener('click', toggleCards);

function toggleCards() {
  var cards = document.querySelectorAll('.photo-card');
  if (document.getElementById('favorite-button').innerHTML === `View ${counter} Favorites`) {
    document.getElementById('favorite-button').innerHTML = 'View All Photos';
    cards.forEach(function(card) {
      if (card.childNodes[2].childNodes[3].classList.contains('favorite-active')) {
        card.classList.remove('display-mode-none');
      } 
      else {
        card.classList.add('display-mode-none');
      }
    })
  } else {
    document.getElementById('favorite-button').innerHTML = `View ${counter} Favorites`;
    cards.forEach(function(card) {
      card.classList.remove('display-mode-none');
    });
  }
}

