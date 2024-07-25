import AbstractView from '../framework/view/abstract-view';
import {humanizeDateEvent, humanizeTimeEvent, humanizeDurationEvent, chooseIcons, isDateAfter} from '../utils';

const createPointTemplate = (point, offersArray) => {
  const {type, destination, dateFrom, dateTo, offers, basePrice, isFavorite, } = point;

  const dayFrom = dateFrom !== null ? humanizeDateEvent(dateFrom) : '';

  const isEventFavorite = isFavorite ? 'event__favorite-btn--active' : '';

  const duration = humanizeDurationEvent(dateFrom, dateTo) ? humanizeDurationEvent(dateFrom, dateTo) : '';

  const createOffersTemplate = () => {
    if (offers.length !== 0) {
      const checkedOffers = offers.map((offer) => offersArray.find(({id}) => id === offer));
      const listOffers = checkedOffers.map(({title, price}) => (
        `<li className="event__offer">
          <span className="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span className="event__offer-price">${price}</span>
          </li>`
      )).join('');
      return listOffers;
    } else {
      return '';
    }
  };

  return (
    `<li class="trip-events__item">
        <div class="event">
                <time class="event__date" datetime="2019-03-18">${dayFrom}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src=${chooseIcons(type)} alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination.name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="2019-03-18T10:30">${humanizeTimeEvent(dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="2019-03-18T11:00">${humanizeTimeEvent(dateTo)}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                    ${createOffersTemplate()}
                </ul>
                <button class="event__favorite-btn ${isEventFavorite}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
</li>`
  );
};

export default class PointView extends AbstractView {
  #point = null;
  #offersArray = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offersArray = offers;
  }

  get template() {
    return createPointTemplate(this.#point, this.#offersArray);
  }

  setEditClickHandler (callback) {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  setFavoriteClickHandler (callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };
}
