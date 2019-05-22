import { call, put } from 'redux-saga/effects';

import {
  fetchCommentOfCard,
  editCommentRequest,
  addCommentRequest
} from '@/services/comment';

export const comment = {
  state: {
    comments: []
  },
  reducers: {
    put(state, { comments }) {
      return {
        ...state,
        comments: comments
      };
    },
    putAfterEdit(state, { comment }) {
      // edit req and then call this
      const { comments } = state;
      return {
        ...state,
        comments: comments.map(x => (x._id === comment._id ? comment : x))
      };
    },
    addCommentResolve(state, { comment }) {
      const { comments } = state;
      comments.push(comment);
      return {
        ...state,
        comments
      };
    }
  },
  effects: {
    *fetchCommentOfCard({ cardId }) {
      console.log(`Fetching comment of card #${cardId} `);
      const { comments } = yield call(fetchCommentOfCard, {
        query: cardId
      });
      // console.log(comments);
      yield put({
        type: 'comment/put',
        payload: {
          comments
        }
      });
    },
    *editCommentRequest({ commentId, idUserEdit, content }) {
      console.log(`edit comment req`);
      const { comment } = yield call(editCommentRequest, {
        data: {
          _id: commentId,
          idUserEdit,
          content
        }
      });
      yield put({
        type: 'comment/putAfterEdit',
        payload: {
          comment
        }
      });
    },
    *addCommentRequest({ content, cardId, ownerId, fileUrl }) {
      console.log(`add comment req`);
      const { comment } = yield call(addCommentRequest, {
        data: {
          content,
          cardId,
          ownerId,
          fileUrl
        }
      });
      yield put({
        type: 'comment/addCommentResolve',
        payload: {
          comment
        }
      });
    }
  }
};
