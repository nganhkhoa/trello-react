import request, { METHOD, API_PATH } from '@/utils/request';

const { GET, POST, DELETE } = METHOD;
const { BOARD } = API_PATH;

export const fetchBoard = async ({ query }) => {
  return request(`${BOARD}/${query}`, {
    method: GET
  });
};
export const addBoardRequest = async ({ data }) => {
  return request(`${BOARD}/add`, {
    method: POST,
    data
  });
};
export const editBoardRequest = async ({ data }) => {
  return request(`${BOARD}/edit`, {
    method: POST,
    data
  });
};
export const addMemberRequest = async ({ data }) => {
  return request(`${BOARD}/add-member`, {
    method: POST,
    data
  });
};

export const removeMemberRequest = async ({ data }) => {
  return request(`${BOARD}/remove-member`, {
    method: POST,
    data
  });
};
export const deleteBoardRequest = async ({ query, data }) => {
  return request(`${BOARD}/${query}`, {
    method: DELETE,
    data
  });
};
