
function renderMarkup(hits) {

  const markup = hits.map(({ largeImageURL, webformatURL, tags, views, downloads, likes, comments }) => {
    return `<li class="gallery-item">
    <a  class="gallery-link" href=${largeImageURL}><img src="${webformatURL}" alt="${tags}" title="${tags}" width="360" height="200"></a>
    <div>
      <ul class="description-list">
        <li><p class="description-element">Like<br><span>${likes}</span></p></li>
        <li><p class="description-element">Views<br><span>${views}</span></p></li>
        <li><p class="description-element">Comments<br><span>${comments}</span></p></li>
        <li><p class="description-element">Downloads<br><span>${downloads}</span></p></li>
      </ul>
      </img>
  </li>
  </div>`;
  }).join(' ');
  return markup;
}

export default renderMarkup;