import { call, put } from 'redux-saga/effects';

import { fetchBoard, addBoardRequest } from '@/services/board';

export const board = {
  state: {},
  reducers: {
    set(state, { boardInfo }) {
      return { ...state, boardInfo };
    }
  },
  effects: {
    *fetchBoard({ id }) {
      console.log(`Fetching board #${id}`);
      const { board } = yield call(fetchBoard, { query: id });
      yield put({
        type: 'board/set',
        payload: { boardInfo: board[0] }
      });
      yield put({
        type: 'list/fetchListOfBoard',
        payload: {
          boardId: id
        }
      });
    },
    *addBoardRequest(payload) {
      const { board } = yield call(addBoardRequest, {
        data: payload
      });

      yield put({
        type: 'user/myboardSingle',
        payload: { newBoard: board }
      });
    }
  }
};
