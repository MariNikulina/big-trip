import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ListSortView from '../view/list-sort-view.js';
import PointListView from '../view/point-list-view';
import NoPointView from '../view/no-point-view';
import PointNewPresenter from './point-new-presenter';
import LoadingView from '../view/loading-view';
import TripInfoView from '../view/trip-info-view';
import {render, remove, RenderPosition} from '../framework/render';
import {sort, sortDayPointUp, sortPricePointDown, sortDurationPointDown, filter} from '../utils';
import PointPresenter from './point-presenter';
import {SortType, UserAction, UpdateType, FilterType} from '../const';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  // #boardOffers = [];
  #pointList = new PointListView();
  #loadingComponent = new LoadingView();
  #noPointView = null;
  #sortComponent = null;
  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #tripInfoComponent = null;
  #headerInfoContainer = null;

  constructor(container, headerInfoContainer, pointsModel, filterModel) {
    this.#container = container;
    this.#headerInfoContainer = headerInfoContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointList.element, this.#handleViewAction);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get pointsFromApi() {
    return this.#pointsModel.points;
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType]([...points]);
    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDayPointUp);
      case SortType.TIME:
        return filteredPoints.sort(sortDurationPointDown);
      case SortType.PRICE:
        return filteredPoints.sort(sortPricePointDown);
    }
    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offer;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback, this.offers, this.destinations);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#pointList.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.offers, this.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        }catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        remove(this.#tripInfoComponent);
        this.#pointPresenter.get(data.id).init(data, this.offers, this.destinations);
        this.#renderTripInfo();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new ListSortView(sort, this.#currentSortType);
    render(this.#sortComponent, this.#container);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderNoPoints() {
    this.#noPointView = new NoPointView(this.#filterType);
    render(this.#noPointView, this.#pointList.element);
  }

  #renderPointList() {
    for(let i = 0; i < this.points.length; i++) {
      this.#renderPoint(this.points[i]);
    }
  }

  #renderTripInfo() {
    const points = this.pointsFromApi.sort(sortDayPointUp);
    this.#tripInfoComponent = new TripInfoView([...points], this.offers);
    render(this.#tripInfoComponent, this.#headerInfoContainer, RenderPosition.AFTERBEGIN);
  }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointView) {
      remove(this.#noPointView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard() {
    const points = this.points;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#pointList, this.#container);

    this.#renderPointList();

    this.#renderTripInfo();
  }
}
