import { call, put } from 'redux-saga/effects';

import {
  fetchBoard,
  addBoardRequest,
  editBoardRequest,
  addMemberRequest,
  removeMemberRequest,
  deleteBoardRequest
} from '@/services/board';

export const board = {
  state: {
    showFormAddMem: false
  },
  reducers: {
    set(state, { boardInfo }) {
      return { ...state, boardInfo };
    },
    toggleshowFormAddMem(state, { value }) {
      return { ...state, showFormAddMem: value };
    }
  },
  effects: {
    *fetchBoard({ id }) {
      console.log(`Fetching board #${id}`);
      const { board } = yield call(fetchBoard, { query: id });
      yield put({
        type: 'board/set',
        payload: { boardInfo: board }
      });
      yield put({
        type: 'list/fetchListOfBoard',
        payload: {
          boardId: id
        }
      });
    },
    *addBoardRequest({ boardName, background, modeView, ownerId }) {
      const { board } = yield call(addBoardRequest, {
        data: {
          name: boardName,
          background,
          modeView,
          ownerId
        }
      });

      yield put({
        type: 'user/myboardSingle',
        payload: { newBoard: board }
      });
    },
    *editBoardRequest({ boardId, ownerId, boardName, background, modeView }) {
      const { board } = yield call(editBoardRequest, {
        data: {
          _id: boardId,
          ownerId,
          boardName,
          background,
          modeView
        }
      });
      yield put({
        type: 'board/set',
        payload: { boardInfo: board }
      });
    },
    *addMemberRequest(payload) {
      console.log(`add member board request`);
      const { board } = yield call(addMemberRequest, {
        data: payload
      });
      yield put({
        type: 'board/set',
        payload: {
          boardInfo: board
        }
      });
    },
    *removeMemberRequest({ boardId, idUserRemove, memberName }) {
      console.log(`remove member card request`);
      const { board } = yield call(removeMemberRequest, {
        data: {
          _id: boardId,
          idUserRemove,
          memberName
        }
      });
      yield put({
        type: 'board/set',
        payload: {
          boardInfo: board
        }
      });
    },
    *deleteBoardRequest({ boardId, ownerId }) {
      console.log(`delete board #${boardId}`);
      yield call(deleteBoardRequest, {
        query: boardId,
        data: {
          ownerId
        }
      });
      yield put({
        type: 'user/removeBoard',
        payload: {
          boardId
        }
      });
    }
  }
};
