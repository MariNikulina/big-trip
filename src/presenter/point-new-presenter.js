import EditingPointView from '../view/editing-point-view';
import {render, remove} from '../framework/render';
import {RenderPosition} from '../framework/render';
import {UpdateType, UserAction} from '../const';
import {nanoid} from 'nanoid';

export default class PointNewPresenter{
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;
  #boardOffers = null;
  #destinations = null;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, boardOffers, destinations) => {
    this.#destroyCallback = callback;
    this.#boardOffers = boardOffers;
    this.#destinations = destinations

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditingPointView(undefined, this.#boardOffers, this.#destinations);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (update) => {
    this.#changeData?.(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      update,
    );
    //this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
