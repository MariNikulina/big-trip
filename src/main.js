import BoardPresenter from './presenter/board-presenter.js';
import {render} from './framework/render';
import ListFilterView from './view/list-filter-view';
import PointModel from './model/point-model.js';
import {generateFilters} from './mock/filter';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import NewPointButtonView from './view/new-point-button-view';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic hg76jsgdte927hg5';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/big-trip/';

const filterContainer = document.querySelector('.trip-controls__filters');
const headerInfoContainer = document.querySelector('.trip-main');
const mainContainer = document.querySelector('.trip-events');
//const pointsModel = new PointModel();
const pointsModel = new PointModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(mainContainer, headerInfoContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  boardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
boardPresenter.init();
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, headerInfoContainer);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
