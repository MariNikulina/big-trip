import AbstractView from "../framework/view/abstract-view";

const createNoPointTemplate = () => (
  `<p className="trip-events__msg">
    Loading...
  </p>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoPointTemplate();
  }
};
