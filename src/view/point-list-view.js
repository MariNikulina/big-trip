import AbstractView from "../framework/view/abstract-view";

const createPointListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class PointListView extends AbstractView {
  get template() {
    return createPointListTemplate();
  }
}
