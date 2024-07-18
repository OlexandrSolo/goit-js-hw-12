const emptyInput = 'Sorry, please enter text';
const emptySearchQuery = 'Sorry, there are not no images matching your search query';
const errorFetch = 'Oops'

import fetchImages from "./js/pixabay-api"
import renderMarkup from "./js/render-functions"
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import buttonService from './js/loadMoreService'
import refs from "./js/refs"; './js/refs'
const { gallery, form, loader, loadMoreBtn } = refs;

const params = {
    q: '',
    page: 1,
    per_page: 15,
    maxPage: 0
}
buttonService.hide(loadMoreBtn)

form.addEventListener('submit', handleSubmitForm)
gallery.addEventListener('click', handleClick)

function handleClick(evt) {
    evt.preventDefault()
    if (evt.target.nodeName !== "IMG") {
        return
    }
    new SimpleLightbox('.gallery a', { captionDelay: 250, captionPosition: 'bottom', captionsData: "alt" });

}

function handleSubmitForm(evt) {
    evt.preventDefault()
    gallery.innerHTML = '';
    params.page = 1
    params.q = evt.currentTarget.children.query.value
    if (!params.q.trim().length) {
        return createAlertMessages("Warning", emptyInput)
    }
    loader.classList.remove('visually-hidden')
    fetchImages(params)
        .then(({ total, totalHits, hits }) => {
            params.maxPage = Math.ceil(totalHits / params.per_page)
            gallery.insertAdjacentHTML('beforeend', renderMarkup(hits))
            buttonService.show(loadMoreBtn)
            buttonService.disabled(loadMoreBtn)
            if (hits.length > 0 && hits.length * params.page !== totalHits) {
                buttonService.enable(loadMoreBtn)
                loadMoreBtn.addEventListener('click', handleLoadMore)
            }
            else {
                createAlertMessages('Warning', emptySearchQuery)
                buttonService.hide(loadMoreBtn)
            }
        })
        .catch(error => createAlertMessages('Error', errorFetch, error))
        .finally(() => {
            loader.classList.add('visually-hidden')
            form.reset()
        })
}

function handleLoadMore() {
    params.page += 1
    scrollGallery()
    const loaderMore = loadMoreBtn.nextElementSibling
    loaderMore.classList.remove('visually-hidden')
    fetchImages(params)
        .then(({ hits }) => {
            gallery.insertAdjacentHTML('beforeend', renderMarkup(hits))
        })
        .catch(error => createAlertMessages('Error', errorFetch, error))
        .finally(() => {
            buttonService.enable(loadMoreBtn)
            loaderMore.classList.add('visually-hidden')
            if (params.page === params.maxPage) {
                buttonService.hide(loadMoreBtn);
                loadMoreBtn.removeAttribute('click', handleLoadMore)
                createAlertMessages("Error", "We're sorry, but you've reached the end of search results.")
            }
        })
}

function createAlertMessages(typeMessage, alertMessage, typeError = null) {
    return iziToast.warning({
        title: `${typeMessage}`,
        message: typeError ? `${alertMessage} ${typeError} ` : `${alertMessage}`,
    })
}

function scrollGallery() {
    const targetElement = gallery.lastElementChild;

    const rect = targetElement.getBoundingClientRect();
    const galleryRect = gallery.getBoundingClientRect();

    window.scrollBy({
        top: rect.top - galleryRect.top + window.scrollY,
        behavior: 'smooth'
    });
}