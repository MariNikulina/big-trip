import AbstractView from '../framework/view/abstract-view';

const createSortItemTemplate = (name, isDisabled, currentSortType) => `
    <div class="trip-sort__item  trip-sort__item--${name}">
        <input
         id="sort-${name}"
         class="trip-sort__input  visually-hidden"
         type="radio"
         name="trip-sort"
         value="sort-${name}"
         data-sort-type="${name}"
         ${name === currentSortType ? 'checked' : ''}
         ${isDisabled ? '' : 'disabled'}
        >
        <label class="trip-sort__btn" for="sort-${name}">${name[0].toUpperCase() + name.slice(1)}</label>
    </div>`;

const createSortTemplate = (sort, currentSortType) => {
  const sortItemsTemplate = Object.entries(sort).map(([name, isDisabled]) => createSortItemTemplate(name, isDisabled, currentSortType)).join('');

  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
  </form>
`;
};

export default class ListSortView extends AbstractView {
  #sort = null;
  #currentSortType = null;

  constructor(sort, currentSortType) {
    super();
    this.#sort = sort;
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#sort, this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
