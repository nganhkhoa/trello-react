import { call, put } from 'redux-saga/effects';

import {
  fetchCardOfListFromBoard,
  editCardRequest,
  moveCardRequest,
  removeMemberRequest,
  addMemberRequest,
  deleteCardRequest,
  deleteLabelCardRequest,
  addCardRequest,
  getCardRequest
} from '@/services/card';

export const card = {
  state: {
    cards: {},
    showDetail: false,
    //  sub form of card detail , kind is addmem form, label form, deadline form ,....
    subForm: { open: false, kind: null },
    currentCard: {}
  },
  reducers: {
    putListCard(state, { card }) {
      const { listId } = card;
      const temp =
        state.cards[card.listId] === undefined ? [] : state.cards[card.listId];
      return {
        ...state,
        cards: {
          ...state.cards,
          [listId]: [...temp, card]
        }
      };
    },
    put(state, { listId, cardInfo }) {
      return {
        ...state,
        cards: {
          ...state.cards,
          [listId]: cardInfo
        }
      };
    },
    putCurrentCard(state, { card }) {
      const { listId, ...cardInfo } = card;
      return {
        ...state,
        currentCard: card,
        cards: {
          ...state.cards,
          [listId]: state.cards[listId].map(x =>
            x._id === cardInfo._id ? cardInfo : x
          )
        }
      };
    },

    toggleModal(state, { card }) {
      //  toggle detail card form
      return {
        ...state,
        showDetail: !state.showDetail,
        currentCard: card
      };
    },
    toggleSubForm(state, { kind, open }) {
      //  toggle subform   form in card detail modal
      return {
        ...state,
        subForm: { open, kind }
      };
    },
    fromList(state, { cardItems }) {
      return {
        ...state,
        cards: cardItems
      };
    },
    resolveMoveCard(state, { sourceList, cardId, destList, newOrder }) {
      const { order: oldOrder, ...cardBeingMoved } = state.cards[
        sourceList
      ].find(x => x._id === cardId);
      // const moveUp = newOrder > oldOrder;

      if (sourceList === destList) {
        console.log(`move ${oldOrder} -> ${newOrder}`);
        // remove from list
        let newSourceList = state.cards[sourceList].filter(
          x => x._id !== cardId
        );
        // update index after removal
        newSourceList = newSourceList.map(x => {
          if (x.order > oldOrder) x.order -= 1;
          return x;
        });
        // update index after add
        newSourceList = newSourceList.map(x => {
          if (x.order >= newOrder) x.order += 1;
          return x;
        });
        // re-add
        cardBeingMoved.order = newOrder;
        newSourceList.push(cardBeingMoved);
        return {
          ...state,
          cards: {
            ...state.cards,
            [sourceList]: newSourceList
          }
        };
      } else {
        const newSourceList = state.cards[sourceList].filter(
          x => x._id !== cardId
        );
        const newDestList = state.cards[destList].map(x => {
          if (x.order >= newOrder) x.order += 1;
          return x;
        });
        cardBeingMoved.order = newOrder;
        newDestList.push(cardBeingMoved);

        return {
          ...state,
          cards: {
            ...state.cards,
            [sourceList]: newSourceList.map(x => {
              if (x.order > cardBeingMoved.order) x.order -= 1;
              return x;
            }),
            [destList]: newDestList
          }
        };
      }
    }
  },
  effects: {
    *fetchCardOfListFromBoard({ boardId, listId }) {
      console.log(`Fetching card of list #${listId} from #${boardId}`);
      const { card } = yield call(fetchCardOfListFromBoard, {
        params: {
          board: boardId,
          list: listId
        }
      });
      yield put({
        type: 'card/put',
        payload: {
          listId,
          cardInfo: card
        }
      });
    },
    *editCardRequest({
      cardId,
      title,
      description,
      idUserEdit,
      archived,
      deadline,
      label
    }) {
      console.log(`editting card request`);
      const { card } = yield call(editCardRequest, {
        data: {
          _id: cardId,
          title,
          description,
          idUserEdit,
          archived,
          deadline,
          label
        }
      });
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },
    *addMemberRequest({ _id: cardId, idUserAdd, newMemberName }) {
      console.log(`add member card request`);
      const { card } = yield call(addMemberRequest, {
        data: {
          _id: cardId,
          idUserAdd,
          newMemberName
        }
      });
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },
    *removeMemberRequest({ cardId, memberName, idUserRemove }) {
      console.log(`remove member card request`);
      const { card } = yield call(removeMemberRequest, {
        data: {
          cardId,
          memberName,
          idUserRemove
        }
      });
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },
    *moveCardRequest({ cardId, newListId, oldListId, idUserMove, order }) {
      console.log(
        `move card request ${cardId}, ${oldListId} -> ${newListId}, ${order}`
      );
      yield put({
        type: 'card/resolveMoveCard',
        payload: {
          cardId,
          sourceList: oldListId,
          destList: newListId,
          newOrder: order
        }
      });
      // console.log(body)
      yield call(moveCardRequest, {
        data: {
          _id: cardId,
          newListId,
          idUserMove,
          order
        }
      });
    },

    *deleteCardRequest({ cardId, idUserRemove }) {
      console.log(`delete card  #${cardId}`);
      yield call(deleteCardRequest, {
        params: {
          _id: cardId
        },
        data: { idUserRemove }
      });
    },

    *deleteLabelCardRequest({ cardId, labelColor, idUserRemove }) {
      console.log(`delete label card`);
      const { card } = yield call(deleteLabelCardRequest, {
        data: {
          cardId,
          labelColor,
          idUserRemove
        }
      });
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },

    *addCardRequest({ title, ownerId, listId }) {
      console.log(`add card`);
      const { card } = yield call(addCardRequest, {
        data: {
          title,
          ownerId,
          listId
        }
      });
      yield put({
        type: 'card/putListCard',
        payload: {
          card
        }
      });
    },
    *getCardRequest({ cardId }) {
      // get card info
      console.log(`get card request`);
      const { card } = yield call(getCardRequest, { query: cardId });
      yield put({
        type: 'card/toggleModal',
        payload: {
          card
        }
      });
    }
  }
};
