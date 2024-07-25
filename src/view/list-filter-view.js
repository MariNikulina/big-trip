import AbstractView from '../framework/view/abstract-view';

const createFilterItemTemplate = (name, filteredPoints, currentFilter) =>
  `<div class="trip-filters__filter">
    <input
    ${filteredPoints.length === 0 ? 'disabled' : ''}
     id='filter-${name}'
     class="trip-filters__filter-input  visually-hidden"
     type="radio"
     name="trip-filter"
     value="${name}"
     ${name === currentFilter ? 'checked' : ''}
  >
    <label class="trip-filters__filter-label" for="filter-${name}">${name[0].toUpperCase() + name.slice(1)}</label>
    </div>
`;

const createFiltersTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = filterItems.map(({name, filteredPoints}) => createFilterItemTemplate(name, filteredPoints, currentFilter)).join('');

  return `
    <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class ListFilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filterType, currentFilterType) {
    super();
    this.#filters = filterType;
    this.#currentFilter = currentFilterType
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
