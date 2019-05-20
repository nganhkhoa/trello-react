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
    subForm: { open: false, kind: null }, //  sub form of card detail , kind is addmem form, label form, deadline form ,....
    currentCard: {}
  },
  reducers: {
    putListCard(state, { card }) {
      const { listId } = card;
      const tem =
        state.cards[card.listId] === undefined ? [] : state.cards[card.listId];
      return {
        ...state,
        cards: {
          ...state.cards,
          [listId]: [...tem, card]
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
      // console.log(cardItems);
      return {
        ...state,
        cards: cardItems
      };
    },
    resolveMoveCard(state, { sourceList, cardId, destList, newOrder }) {
      const { order: oldOrder, ...cardBeingMoved } = state.cards[
        sourceList
      ].find(x => x._id === cardId);
      const moveUp = newOrder > oldOrder;

      if (sourceList === destList) {
        console.log(`move ${oldOrder} -> ${newOrder}`);
        return {
          ...state,
          cards: {
            ...state.cards,
            [sourceList]: state.cards[sourceList].map(x => {
              if (x._id === cardId) x.order = newOrder;
              else if (moveUp) {
                // move card up
                if (x.order >= newOrder && x.order < oldOrder) x.order += 1;
              } else {
                // move card down
                if (x.order <= newOrder && x.order > oldOrder) x.order -= 1;
              }
              return x;
            })
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
    *editCardRequest({ body }) {
      console.log(`editting card request`);
      const { card } = yield call(editCardRequest, {
        data: { body }
      });
      console.log(card);
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },
    *addMemberRequest({ body }) {
      console.log(`add member card request`);
      const { card } = yield call(addMemberRequest, {
        data: { body }
      });
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },
    *removeMemberRequest({ body }) {
      console.log(`remove member card request`);
      const { card } = yield call(removeMemberRequest, {
        data: { body }
      });
      yield put({
        type: 'card/putCurrentCard',
        payload: {
          card
        }
      });
    },
    *moveCardRequest({ _id, newListId, oldListId, idUserMove, order }) {
      console.log(
        `move card request ${_id}, ${oldListId} -> ${newListId}, ${order}`
      );
      // console.log(card);
      yield put({
        type: 'card/resolveMoveCard',
        payload: {
          cardId: _id,
          sourceList: oldListId,
          destList: newListId,
          newOrder: order
        }
      });
      // console.log(body)
      yield call(moveCardRequest, {
        data: {
          _id,
          newListId,
          idUserMove,
          order
        }
      });
    },

    *deleteCardRequest({ _id, body }) {
      console.log(`delete card  #${_id}`);
      yield call(deleteCardRequest, {
        params: {
          _id: _id
        },
        data: { body }
      });
    },

    *deleteLabelCardRequest({ body }) {
      console.log(`delete label card   `);
      const { card } = yield call(deleteLabelCardRequest, {
        data: { body }
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
      console.log(card);
      yield put({
        type: 'card/putListCard',
        payload: {
          card
        }
      });
    },
    *getCardRequest({ _id }) {
      // get card info
      console.log(`get card request  `);
      const { card } = yield call(getCardRequest, { query: _id });
      yield put({
        type: 'card/toggleModal',
        payload: {
          card
        }
      });
    }
  }
};
