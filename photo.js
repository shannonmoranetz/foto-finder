class Photo {
  constructor(id, title, caption, file, favorite) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  };

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  };

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  };

  updatePhoto(text, type) {
    this[type] = text;
    this.saveToStorage();
  }
};