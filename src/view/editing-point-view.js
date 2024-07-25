import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {chooseIcons, humanizeDateEventForForm, getFilterOffers, isDateOneBefore, isDateOneBeforeOrSame} from '../utils';
import {eventType, Cities} from '../const';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


const BLANK_POINT = {
  type: 'bus',
  destination: {
    'description': 'Chamonix, is a beautiful city, with an embankment of a mighty river as a centre of attraction',
    'name': 'Chamonix',
    'pictures': [
      {
        description: 'Chamonix central station',
        src: 'http://picsum.photos/300/200?r=0.5312239692515119',
      }
    ]
  },
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
  isFavorite: false,
  offers: [],
};

const createDestinationListTemplate = (cities) => {

  const destinationList = cities.map((city) => (
    `<option value='${city}'></option>`
  )).join('');

  return destinationList;
};

const createEventTypeListTemplate = (isDisabled) => {
  const eventTypeList = Object.entries(eventType).map(([nameType, type]) => (
    `<div class="event__type-item">
        <input
        id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value=${type}
        ${isDisabled ? 'disabled' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
    </div>`
  )).join('');
  return eventTypeList;
};

const createOffersTemplate = (offers, offersArray, isOffers, isDisabled) => (
  isOffers ?
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersArray.map(({id, title, price}) => `<div class="event__offer-selector">
          <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-id-${id}"
          type="checkbox"
          name="event-offer-id-${id}"
          ${offers.some((offer) => offer === id) ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-id-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
            </div>`).join('')}
        </div>
      </section>` : ''
);

const createDestinationTemplate = (destination, isDestination) => (
  isDestination ?
    `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${destination.pictures.map(({src, description = 'alt'}) => (
    `<img class="event__photo" src=${src} alt='${description}'>`
  )).join('')}
          </div>
        </div>
      </section>` : ''
);


const createEditingPointTemplate = (point) => {
  const {
    type,
    destination,
    basePrice,
    dateFrom,
    dateTo,
    offers,
    isOffers,
    isDestination,
    offersArray,
    citiesList,
    city,
    isAddPoint,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;
  console.log(offersArray);
  //const destinationName = destination !== null ? destination.name : '';

  const typeEvent = type !== '' ? type : 'bus';

  let dayFrom = null;
  if (dateFrom !== null) {
    dayFrom = humanizeDateEventForForm(dateFrom);
  } else {
    console.log('time');
    console.log(dateFrom !== null);
    console.log(isDateOneBeforeOrSame(new Date(), dateFrom));
    dayFrom = 'Enter another date';
  }

  let dayTo = null;
  if (dateTo !== null && isDateOneBefore(dateFrom, dateTo)) {
    dayTo = humanizeDateEventForForm(dateTo);
  } else {
    dayTo = 'Enter another date';
  }

  return `
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src=${chooseIcons(typeEvent)} alt="Event type icon">
                    </label>
                    <input
                    class="event__type-toggle  visually-hidden"
                    id="event-type-toggle-1"
                    type="checkbox"
                    ${isDisabled ? 'disabled' : ''}
                    >

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>

                        ${createEventTypeListTemplate(isDisabled)}

                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input
                    class="event__input  event__input--destination"
                    id="event-destination-1"
                    type="text"
                    name="event-destination"
                    value='${city}'
                    list="destination-list-1"
                    ${isDisabled ? 'disabled' : ''}
                    >
                    <datalist id="destination-list-1">
                        ${createDestinationListTemplate(citiesList)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input
                    class="event__input  event__input--time"
                    id="event-start-time-1"
                    type="text"
                    name="event-start-time"
                    value='${dayFrom}'
                    ${isDisabled ? 'disabled' : ''}
                    >
                    &mdash;

                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input
                    class="event__input  event__input--time"
                    id="event-end-time-1"
                    type="text"
                    name="event-end-time"
                    value='${dayTo}'
                    ${isDisabled ? 'disabled' : ''}
                    >
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input
                    class="event__input  event__input--price"
                    id="event-price-1"
                    type="number"
                    name="event-price"
                    value='${basePrice}'
                    ${isDisabled ? 'disabled' : ''}
                    />
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
                  ${isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
                  ${isDeleting ? 'Deleting...' : isAddPoint ? 'Cancel' : 'Delete'}
                  </button>
                 ${isAddPoint ?
    '' :
    `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
                    <span class="visually-hidden">Open event</span>
                  </button>`}
                </header>
                <section class="event__details">
                  ${createOffersTemplate(offers, offersArray, isOffers, isDisabled)}
                  ${createDestinationTemplate(destination, isDestination)}
                </section>
              </form>
    </li>`;
};

export default class EditingPointView extends AbstractStatefulView {
  #boardOffers = null;
  #destinations = null;
  #dateFrompicker = null;
  #dateTopicker = null;

  constructor(point = BLANK_POINT, boardOffers = [], destinations = []) {
    super();
    this.#boardOffers = boardOffers;
    this.#destinations = destinations;
    this._state = this.#parseTaskToState(point);
    this.#setInnerHandlers();
    this.#setDateFrompicker();
    this.#setDateTopicker();
  }

  get template() {
    return createEditingPointTemplate(this._state);
  }

  setFormSubmitHandler (callback) {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDateFrompicker();
    this.#setDateTopicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    if (!this._state.isAddPoint) {
      this.setPointClickHandler(this._callback.pointClick);
    }
  };

  removeElement() {
    super.removeElement();

    if (this.#dateFrompicker) {
      this.#dateFrompicker.destroy();
      this.#dateFrompicker = null;
    }

    if (this.#dateTopicker) {
      this.#dateTopicker.destroy();
      this.#dateTopicker = null;
    }
  }

  reset = (task) => {
    this.updateElement(
      this.#parseTaskToState(task),
    );
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    console.log('submit');
    this._callback.formSubmit(EditingPointView.parseStateToTask(this._state));
  };

  setPointClickHandler (callback) {
    this._callback.pointClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#clickHandler);
  }

  setDeleteClickHandler (callback) {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.pointClick();
  };

  #typeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      type: evt.target.value,
      offers: [],
      offersArray: getFilterOffers(evt.target.value, this.#boardOffers),
      isOffers: getFilterOffers(evt.target.value, this.#boardOffers).length !== 0,
    });
  };

  #destinationToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      ...this._state,
      destination: this.#destinations.get(evt.target.value),
      city: evt.target.value,
      isDestination: this.#destinations.get(evt.target.value) !== null,
    });
  };

  #offersToggleHandler = (evt) => {
    evt.preventDefault();
    const idClick = Number(evt.currentTarget.firstElementChild.id.split('-').pop());
    if (evt.currentTarget.firstElementChild.checked) {
      this.updateElement({
        ...this._state,
        offers: this._state.offers.filter((id) => id !== idClick),
      });
      return;
    }
    this._state.offers.push(idClick);
    this.updateElement({
      ...this._state,
      offers: this._state.offers,
    });
  };

  #costChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #dateFromChangeHandler = (userDataFrom) => {
    console.log(userDataFrom);
    this.updateElement({
      ...this._state,
      dateFrom: userDataFrom[0],
    });
    console.log(this._state.dateFrom);
  };

  #dateToChangeHandler = ([userDataTo]) => {
    console.log(this._state.dateFrom);
    this.updateElement({
      ...this._state,
      dateTo: userDataTo,
    });
  };

  #dateFromCloseHandler = (userDataFrom) => {
    if (this._state.dateFrom === null) {
      this.updateElement({
        ...this._state,
        dateFrom: new Date(),
      });
    }

  };

  #setDateFrompicker = () => {
    this.#dateFrompicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        // disable: [
        //   function(date) {
        //     return !isDateOneBefore(new Date(), date);
        //   }
        // ],
        // disable: [
        //   function (date) {
        //     return false;
        //   }
        // ],
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: new Date(this._state.dateFrom),
        onChange: this.#dateFromChangeHandler,
        onClose: this.#dateFromCloseHandler,
      }
    );
  };

  #setDateTopicker = () => {
    this.#dateTopicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        disable: [
          (date) => !isDateOneBefore(this._state.dateFrom, date)
        ],
        enableTime: true,
        dateFormat: 'd/m/Y H:i',
        defaultDate: new Date(this._state.dateTo),
        onChange: this.#dateToChangeHandler,
        // minDate: new Date(this._state.dateFrom),
      }
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);
    this.element.querySelectorAll('.event__offer-selector').forEach((offer) => {
      offer.addEventListener('click', this.#offersToggleHandler);
    });
    this.element.querySelector('.event__input--price').addEventListener('input', this.#costChangeHandler);
  };

  #parseTaskToState = (point) => ({
    ...point,
    isDestination: point.destination !== null,
    offersArray: getFilterOffers(point.type, this.#boardOffers).length !== 0 ? getFilterOffers(point.type, this.#boardOffers) : [],
    isOffers: getFilterOffers(point.type, this.#boardOffers).length !== 0,
    city: point.destination !== null ? point.destination.name : '',
    citiesList: Array.from(this.#destinations.keys()),
    isAddPoint: point.destination === null,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditingPointView.parseStateToTask(this._state));
  };

  static parseStateToTask = (state) => {
    const point = {...state};

    if (!point.isOffers) {
      point.offers = [];
    }

    if (!point.isDestination) {
      point.destination = [];
    }

    delete point.isOffers;
    delete point.isDestination;
    delete point.offersArray;
    delete point.citiesList;
    delete point.city;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };
}
