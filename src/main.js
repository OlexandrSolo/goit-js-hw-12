const emptyInput = 'Sorry, please enter text';
const emptySearchQuery = 'Sorry, are no images matching your search query';
const errorFetch = 'Oops'

import fetchImages from "./js/pixabay-api"
import renderMarkup from "./js/render-functions"
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import buttonService from './js/loadMoreService'
import refs from "./js/refs"; './js/refs'

const params = {
    q: '',
    page: 1,
    per_page: 15,
    maxPage: 0
}
buttonService.hide(refs.loadMoreBtn)

refs.form.addEventListener('submit', handleSubmitForm)
refs.loadMoreBtn.addEventListener('click', handleLoadMore)
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250, captionPosition: 'bottom', captionsData: "alt" });

async function handleSubmitForm(evt) {
    evt.preventDefault()
    refs.gallery.innerHTML = '';
    params.page = 1
    params.q = evt.currentTarget.children.query.value
    if (!params.q.trim().length) {
        return createAlertMessages("Warning", emptyInput)
    }
    refs.loader.classList.remove('visually-hidden')
    try {
        const response = await fetchImages(params);
        params.maxPage = Math.ceil(response.totalHits / params.per_page)
        refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(response.hits))
        lightbox.refresh()
        buttonService.show(refs.loadMoreBtn)
        buttonService.disabled(refs.loadMoreBtn)
        if (response.hits.length > 0 && response.hits.length * params.page !== response.totalHits) {
            buttonService.enable(refs.loadMoreBtn)
        }
        else {
            createAlertMessages('warning', emptySearchQuery)
            buttonService.hide(refs.loadMoreBtn)
        }
    }
    catch (error) {
        createAlertMessages('error', errorFetch, error)
        console.log(error);
    }
    finally {
        refs.loader.classList.add('visually-hidden')
        refs.form.reset()
    }
}

async function handleLoadMore() {
    params.page += 1
    const loaderMore = refs.loadMoreBtn.nextElementSibling
    loaderMore.classList.remove('visually-hidden')
    try {
        const response = await fetchImages(params);
        refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(response.hits))
        lightbox.refresh()
        scrollGallery()
    }
    catch (error) {
        // const nameMethod = 'Error'
        createAlertMessages('error', errorFetch, error)
    }
    finally {
        buttonService.enable(refs.loadMoreBtn)
        loaderMore.classList.add('visually-hidden')
        if (params.page === params.maxPage) {
            buttonService.hide(refs.loadMoreBtn);
            refs.loadMoreBtn.removeEventListener('click', handleLoadMore)
            createAlertMessages("Error", "We're sorry, but you've reached the end of search results.")
        }
    }
}

function createAlertMessages(typeMessage, alertMessage, typeError = null) {
    return iziToast[typeMessage]({
        title: `${typeMessage}`,
        message: typeError ? `${alertMessage} ${typeError} ` : `${alertMessage}`,
    })
}

function scrollGallery() {
    const cardHight = refs.gallery.lastElementChild.getBoundingClientRect().height
    window.scrollBy({
        top: cardHight * 2,
        behavior: 'smooth'
    });
}